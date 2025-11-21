'use strict';

module.exports = {
  routes: [
    // default CRUD routes
    { method: 'GET', path: '/todos', handler: 'todo.find' },
    { method: 'GET', path: '/todos/:id', handler: 'todo.findOne' },
    { method: 'POST', path: '/todos', handler: 'todo.create' },
    { method: 'PUT', path: '/todos/:id', handler: 'todo.update' },
    { method: 'DELETE', path: '/todos/:id', handler: 'todo.delete' },
    
    // bulk upload routes
    { method: 'POST', path: '/todos/bulk-upload', handler: 'todo.bulkUpload', config: { auth: false } },
    { method: 'GET', path: '/todos/upload-status/:jobId', handler: 'todo.uploadStatus', config: { auth: false } },
  ],
};
