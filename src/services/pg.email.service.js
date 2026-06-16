const nodemailer = require("nodemailer");
const { smtpConfig } = require("../config/config");
class EmailService {
  #transport;
  constructor() {
    try {
      let config = {
        host: smtpConfig.host,
        port: smtpConfig.port,
        service: smtpConfig.provider,
        auth: {
          user: smtpConfig.user,
          pass: smtpConfig.password,
        },
      };
      if (smtpConfig.provider === "gmail") {
        config = {
          ...config,
          service: smtpConfig.provider,
        };
      }
      this.#transport = nodemailer.createTransport(config);
    } catch (exception) {
      console.log("******** Error Connecting Email Service Error ********");
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
      if (cc) {
        body["cc"] = cc;
      }
      if (bcc) {
        body["bcc"] = bcc;
      }
      if (attachments) {
        body["attachments"] = attachments;
      }
      let result = await this.#transport.sendMail(body);
      console.log(result)
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