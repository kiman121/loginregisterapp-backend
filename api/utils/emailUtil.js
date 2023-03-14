import path from 'path';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';
import pug from 'pug';
import { htmlToText } from 'html-to-text';

import environment from '../../config/environment.js';

class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.firstName;
    this.url = url;
    this.from = `Login Register App ${environment.emailFrom}`;
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      // Sendgrid or any other provider
    }

    return nodemailer.createTransport({
      host: environment.emailHost,
      port: environment.emailPort,
      auth: {
        user: environment.emailUsername,
        pass: environment.emailPassword,
      },
    });
  }

  async send(template, subject) {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject,
    });

    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText(html),
    };

    await this.newTransport().sendMail(mailOptions);
  }

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password reset token (valid for only 10 minutes)'
    );
  }
}

export default Email;
