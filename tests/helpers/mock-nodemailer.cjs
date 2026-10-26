// Preloaded with `node --require` so the built server never reaches Gmail.
// Every message the server tries to send is appended as one JSON line to
// MAIL_CAPTURE_FILE. Set MAIL_FAIL=1 to make sendMail reject like an SMTP outage.
const fs = require('fs');
const Module = require('module');

const originalLoad = Module._load;

const fakeNodemailer = {
  createTransport() {
    return {
      async sendMail(message) {
        if (process.env.MAIL_FAIL === '1') {
          throw new Error('Invalid login: 535-5.7.8 Username and Password not accepted (smtp-internal-detail)');
        }
        if (process.env.MAIL_CAPTURE_FILE) {
          fs.appendFileSync(process.env.MAIL_CAPTURE_FILE, JSON.stringify(message) + '\n');
        }
        return { messageId: '<test@localhost>' };
      },
    };
  },
};

Module._load = function (request, parent, isMain) {
  if (request === 'nodemailer') return fakeNodemailer;
  return originalLoad.call(this, request, parent, isMain);
};
