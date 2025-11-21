'use strict';

// const bcrypt = require('bcryptjs');
const argon2 = require('argon2');

module.exports = {
  async beforeCreate(event) {
    const data = event.params.data;

    if (data.password) {
      data.password = await argon2.hash(data.password);
    }
  },

  async beforeUpdate(event) {
    const data = event.params.data;

    if (data.password) {
      data.password = await argon2.hash(data.password);
    }
  }
};
