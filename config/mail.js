const nodemailer = require('nodemailer');
const Mailgen = require('mailgen');


const { EMAIL, PASSWORD, APP_URL } = process.env;

const base = `${APP_URL}`;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL,
    pass: PASSWORD
  }
});

const mailGenerator = new Mailgen({
  theme: 'default',
  product: {
    name: 'Press Play',
    link: APP_URL,
    logo: 'https://i.ibb.co/N2ffWPS/Layer-2.png'
  }
});

exports.sendPasswordResetMail = async (user) => {
  // send mail
  const response = {
    body: {
      name: user.firstName,
      intro: 'Password Reset Link',
      action: {
        instructions: 'To reset your password, click on the link below:',
        button: {
          color: '#E2605B',
          text: 'Reset password',
          link: `${base}/user/password-reset?token=${user.token}`
        }
      },
      outro: 'Do not share this link with anyone. Except if the person is helping to reset your password'
    }
  };

  const mail = mailGenerator.generate(response);

  const message = {
    from: `Press Play <o.arigbanla@genesystechhub.com>`,
    to: user.email,
    subject: 'Reset your password',
    html: mail
  };

  await transporter.sendMail(message);
  // return true;
};


