const mongoose = require('mongoose');

const { Schema } = mongoose;

const emailSchema = new Schema({
  message: {},

  messageId: String, // from transport

  // lastSqsNotification: {  },

  transportResponse: {
    messageId: String,
    envelope: {},
    accepted: {},
    rejected: {},
    pending: {},
    response: String,
  },

}, {
  timestamps: true,
});


emailSchema.index({ 'message.to.address': 1 });
emailSchema.index({ messageId: 1 });

module.exports = mongoose.model('Letter', emailSchema);
