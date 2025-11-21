'use strict';

const { createCoreService } = require('@strapi/strapi').factories;
const csv = require('csv-parser');
const fs = require('fs');

const uploadTasks = new Map();

module.exports = createCoreService('api::todo.todo', ({ strapi }) => ({

    // csv processing
    async processCSVUpload(jobId, filePath) {
        const job = uploadTasks.get(jobId);
        const results = [];

        try {
            await new Promise((resolve, reject) => {
                fs.createReadStream(filePath)
                    .pipe(csv())
                    .on('data', (row) => results.push(row))
                    .on('end', resolve)
                    .on('error', reject);
            });

            job.total = results.length;
            job.status = 'processing';

            const batchSize = 10;
            for (let i = 0; i < results.length; i += batchSize) {
                const batch = results.slice(i, i + batchSize);
                await this.processBatch(batch, i, job);
            }

            job.status = 'completed';
            fs.unlinkSync(filePath);
            setTimeout(() => uploadTasks.delete(jobId), 3600000);

        } catch (error) {
            job.status = 'failed';
            job.errorDetails.push(`Processing failed: ${error.message}`);
        }
    },

    // process csv as batchs
    async processBatch(batch, startIndex, job) {
        await Promise.all(batch.map(async (row, index) => {
            const rowIndex = startIndex + index;
            try {
                const todoData = this.mapRowToTodo(row);

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
    },

    // map csv data to todo object
    mapRowToTodo(row) {
        return {
            title: row.title || row.Title,
            description: row.description || row.Description,
            status: row.status === 'true' || row.Status === 'true' || true,
            amount: row.amount ? parseInt(row.amount) : null,
            email: row.email || row.Email,
            due_date: row.due_date || row.Due_Date,
            password: row.password || row.Password || 'default123',
            publishedAt: new Date(),
        };
    },

    // create new upload job tracking object
    createUploadJob(jobId) {
        const job = {
            status: 'parsing',
            total: 0,
            processed: 0,
            created: 0,
            errors: 0,
            errorDetails: [],
            startTime: new Date()
        };
        uploadTasks.set(jobId, job);
        return job;
    },

    // get upload job by id
    getUploadJob(jobId) {
        return uploadTasks.get(jobId);
    }
}));