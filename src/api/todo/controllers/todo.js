'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::todo.todo', ({ strapi }) => ({

  // bulk upload
  async bulkUpload(ctx) {
    try {
      const files = ctx.request['files'] || {};

      if (!files || !files.csvFile) {
        return ctx.badRequest('CSV file is required');
      }

      // create unique session ID per browser tab
      const tabId = ctx.request.headers['x-tab-id'] || `tab_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const ip = ctx.request.ip || ctx.request.socket.remoteAddress;
      const sessionId = `${ip}_${tabId}`;

      const jobId = `upload_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const csvFile = files.csvFile;

      strapi.service('api::todo.todo').createUploadJob(jobId, sessionId);
      strapi.service('api::todo.todo').processCSVUpload(jobId, csvFile.path, sessionId);

      return ctx.send({
        jobId,
        sessionId, // return sessionId to frontend
        message: 'Upload started',
        status: 'parsing'
      });

    } catch (error) {
      return ctx.throw(500, `Upload failed: ${error.message}`);
    }
  },

  // upload status
  async uploadStatus(ctx) {
    const { jobId } = ctx.params;
    const job = strapi.service('api::todo.todo').getUploadJob(jobId);

    if (!job) {
      return ctx.notFound('Job not found');
    }

    const progress = job.total > 0 ? Math.round((job.processed / job.total) * 100) : 0;

    return ctx.send({
      jobId,
      status: job.status,
      progress,
      total: job.total,
      processed: job.processed,
      created: job.created,
      errors: job.errors,
      errorDetails: job.errorDetails.slice(-5),
      duration: Date.now() - job.startTime.getTime()
    });
  },

  // active session
  async activeSession(ctx) {
    const tabId = ctx.request.headers['x-tab-id'];
    const ip = ctx.request.ip || ctx.request.socket.remoteAddress;

    if (!tabId) {
      return ctx.send({
        hasActiveJob: false,
        jobId: null,
        progress: null
      });
    }

    const sessionId = `${ip}_${tabId}`;
    const activeSession = strapi.service('api::todo.todo').getActiveSession(sessionId);

    if (!activeSession) {
      return ctx.send({
        hasActiveJob: false,
        jobId: null,
        progress: null
      });
    }

    const { jobId, job } = activeSession;
    const progress = job.total > 0 ? Math.round((job.processed / job.total) * 100) : 0;

    return ctx.send({
      hasActiveJob: true,
      jobId,
      progress: {
        status: job.status,
        progress,
        total: job.total,
        processed: job.processed,
        created: job.created,
        errors: job.errors
      }
    });
  },

  // clear session endpoint
  async clearSession(ctx) {
    const sessionId = ctx.request.ip || ctx.request.socket.remoteAddress;
    const cleared = strapi.service('api::todo.todo').clearCompletedSession(sessionId);

    return ctx.send({
      cleared,
      message: cleared ? 'Session cleared' : 'No completed session to clear'
    });
  }
}));
