const juice = require('juice');
const config = require('config');
const path = require('path');
const pug = require('pug');

const nodemailer = require('nodemailer');
const { htmlToText } = require('nodemailer-html-to-text');
const stubTransport = require('nodemailer-stub-transport');

// configure gmail: https://nodemailer.com/using-gmail/
// allow less secure apps
const SMTPTransport = require('nodemailer-smtp-transport');
const Letter = require('../models/letter');

const transportEngine = config.mailer.transport !== 'test' ? new SMTPTransport({
  service: 'Yandex',
  debug: true,
  auth: {
    user: config.mailer.gmail.user,
    pass: config.mailer.gmail.password,
  },
}) : stubTransport();

const transport = nodemailer.createTransport(transportEngine);

transport.use('compile', htmlToText());

module.exports = async function (options) {
  const message = {};

  const sender = config.mailer.senders;
  if (!sender) {
    throw new Error(`Unknown sender:${options.from}`);
  }

  message.from = {
    name: sender.fromName,
    address: sender.fromEmail,
  };

  // for template
  const locals = Object.create(options);

  locals.config = config;
  locals.sender = sender;

  message.html = pug.renderFile(`${path.join(config.template.root, 'email', options.template)}.pug`, locals);
  message.html = juice(message.html);


  message.to = (typeof options.to === 'string') ? { address: options.to } : options.to;

  if (process.env.MAILER_REDIRECT) { // for debugging
    message.to = { address: sender.fromEmail };
  }

  if (!message.to.address) {
    throw new Error(`No email for recepient, message options:${JSON.stringify(options)}`);
  }

  message.subject = options.subject;

  message.headers = options.headers;

  const transportResponse = await transport.sendMail(message);

  const letter = await Letter.create({
    message,
    transportResponse,
    messageId: transportResponse.messageId, // .replace(/@email.amazonses.com$/, '')
  });

  return letter;
};
