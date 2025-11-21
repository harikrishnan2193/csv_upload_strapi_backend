'use strict';

const { createCoreController } = require('@strapi/strapi').factories;
const csv = require('csv-parser');
const fs = require('fs');

const uploadTasks = new Map();

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

      // initialize progress tracking
      uploadTasks.set(jobId, {
        status: 'parsing',
        total: 0,
        processed: 0,
        created: 0,
        errors: 0,
        errorDetails: [],
        startTime: new Date()
      });

      // start async processing
      // this.processCSVAsync(jobId, csvFile.path);
      this.processCSVAsync.call(this, jobId, csvFile.path);

      return ctx.send({
        jobId,
        message: 'Upload started',
        status: 'parsing'
      });

    } catch (error) {
      return ctx.throw(500, `Upload failed: ${error.message}`);
    }
  },

  // upload progress
  async uploadStatus(ctx) {
    const { jobId } = ctx.params;
    const job = uploadTasks.get(jobId);

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
      errorDetails: job.errorDetails.slice(-5), // last 5 error
      duration: Date.now() - job.startTime.getTime()
    });
  },

  // csv processing

  async processCSVAsync(jobId, filePath) {
    const job = uploadTasks.get(jobId);
    const results = [];

    try {
      // parse csv
      await new Promise((resolve, reject) => {
        fs.createReadStream(/** @type {string} */(/** @type {unknown} */ (filePath)))
          .pipe(csv())
          .on('data', (row) => results.push(row))
          .on('end', resolve)
          .on('error', reject);
      });

      // update job with total count
      job.total = results.length;
      job.status = 'processing';

      // process rows in batches
      const batchSize = 10;
      for (let i = 0; i < results.length; i += batchSize) {
        const batch = results.slice(i, i + batchSize);

        await Promise.all(batch.map(async (row, index) => {
          const rowIndex = i + index;
          try {
            const todoData = {
              title: row.title || row.Title,
              description: row.description || row.Description,
              status: row.status === 'true' || row.Status === 'true' || true,
              amount: row.amount ? parseInt(row.amount) : null,
              email: row.email || row.Email,
              due_date: row.due_date || row.Due_Date,
              password: row.password || row.Password || 'default123',
              publishedAt: new Date(),
            };

            if (!todoData.title) {
              job.errors++;
              job.errorDetails.push(`Row ${rowIndex + 1}: Title is required`);
              return;
            }

            await strapi.entityService.create('api::todo.todo', { data: todoData });
            job.created++;
          } catch (error) {
            job.errors++;
            job.errorDetails.push(`Row ${rowIndex + 1}: ${error.message}`);
          }

          job.processed++;
        }));
      }

      job.status = 'completed';
      fs.unlinkSync(/** @type {string} */(/** @type {unknown} */ (filePath))); // clean up

      // auto-cleanup after 1 hour
      setTimeout(() => uploadTasks.delete(jobId), 3600000);

    } catch (error) {
      job.status = 'failed';
      job.errorDetails.push(`Processing failed: ${error.message}`);
    }
  }
}));
