'use strict';

const { createCoreService } = require('@strapi/strapi').factories;
const csv = require('csv-parser');
const fs = require('fs');

const uploadTasks = new Map(); // js Map - store in memory
const activeSessions = new Map(); // track active sessions by IP/user

module.exports = createCoreService('api::todo.todo', ({ strapi }) => ({

    // csv processing
    async processCSVUpload(jobId, filePath, sessionId) {
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

            // clean up after completion
            setTimeout(() => {
                uploadTasks.delete(jobId);
                activeSessions.delete(sessionId);
            }, 3600000);

        } catch (error) {
            job.status = 'failed';
            job.errorDetails.push(`Processing failed: ${error.message}`);
        }
    },

    // process csv as batches
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
    createUploadJob(jobId, sessionId) {
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

        // store multiple sessions per IP
        const ip = sessionId.split('_')[0]; // extract IP part
        if (!activeSessions.has(sessionId)) {
            activeSessions.set(sessionId, jobId); // use full sessionId as key
        }

        return job;
    },


    // get upload job by id
    getUploadJob(jobId) {
        return uploadTasks.get(jobId);
    },

    // get active session for specific tab
    getActiveSession(sessionId) {
        const jobId = activeSessions.get(sessionId);
        if (!jobId) return null;

        const job = uploadTasks.get(jobId);
        if (!job) {
            activeSessions.delete(sessionId); // Clean up stale session
            return null;
        }

        // If job is completed or failed, don't return it as active
        if (job.status === 'completed' || job.status === 'failed') {
            return null;
        }

        return { jobId, job };
    },

    // Clear specific session
    clearCompletedSession(sessionId) {
        const jobId = activeSessions.get(sessionId);
        if (jobId) {
            const job = uploadTasks.get(jobId);
            if (job && (job.status === 'completed' || job.status === 'failed')) {
                activeSessions.delete(sessionId);
                uploadTasks.delete(jobId);
                return true;
            }
        }
        return false;
    }
}));
