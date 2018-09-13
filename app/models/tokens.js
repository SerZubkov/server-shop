/* eslint-disable no-underscore-dangle */
const mongoose = require('mongoose');

const { Schema } = mongoose;

/**
 * Tokens Schema
 */

const TokenSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  refreshToken: {
    type: String,
    index: true,
  },
}, {
  timestamps: true,
});


TokenSchema.methods.getToken = function () {
  return {
    user: this.user,
    refreshToken: this.refreshToken,
  };
};

TokenSchema.virtual('id')
  .get(function () {
    return this._id;
  });

module.exports = mongoose.model('Token', TokenSchema);
