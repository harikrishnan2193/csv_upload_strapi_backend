'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::todo.todo', ({ strapi }) => ({

  // bulk upload
  async bulkUpload(ctx) {
    try {
      // extract csv file from reqest 
      const files = ctx.request['files'] || {};

      if (!files || !files.csvFile) {
        return ctx.badRequest('CSV file is required');
      }

      // create uniqu id
      const jobId = `upload_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const csvFile = files.csvFile;

      strapi.service('api::todo.todo').createUploadJob(jobId);
      strapi.service('api::todo.todo').processCSVUpload(jobId, csvFile.path);

      return ctx.send({
        jobId,
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
  }
}));
