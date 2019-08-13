const nodemailer = require('nodemailer');
const {
  email: { smtp: smtpConfig }
} = require('../config');

const transporter = nodemailer.createTransport({
  host: smtpConfig.host,
  port: smtpConfig.port,
  secure: smtpConfig.secure,
  auth: {
    user: smtpConfig.username,
    pass: smtpConfig.password
  }
});

module.exports = transporter;
