
const nodemailer = require("nodemailer");
const { smtpConfig } = require("../config/config");

class EmailService {
  #transport;

  constructor() {
    try {
      let config = {
        auth: {
          user: smtpConfig.user,
          pass: smtpConfig.password,
        },
      };

      // If a specific provider like Gmail is used, Nodemailer handles host/port automatically
      if (smtpConfig.provider) {
        config.service = smtpConfig.provider;
      } else {
        config.host = smtpConfig.host;
        config.port = smtpConfig.port;
        config.secure = smtpConfig.port === 465; // true for 465, false for other ports
      }

      this.#transport = nodemailer.createTransport(config);
    } catch (exception) {
      console.error("******** Error Connecting Email Service ********", exception);
      throw exception;
    }
  }

  sendEmail = async ({
    to,
    sub,
    message,
    cc = null,
    bcc = null,
    attachments = null,
  }) => {
    try {
      let body = {
        to: to,
        from: smtpConfig.from,
        subject: sub,
        html: message,
      };

      if (cc) body.cc = cc;
      if (bcc) body.bcc = bcc;
      if (attachments) body.attachments = attachments;

      // FIXED: Added 'await' so errors are properly caught in the catch block
      let result = await this.#transport.sendMail(body);
      return result;
    } catch (exception) {
      throw {
        code: 500,
        message: exception.message || "Error sending email",
        status: "ERROR_SENDING_EMAIL",
      };
    }
  };
}

const emailSvc = new EmailService();
module.exports = emailSvc;