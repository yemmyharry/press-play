const nodemailer = require("nodemailer");
const Mailgen = require("mailgen");

const {
  EMAILER,
  APP_URL,
  GoogleClientId,
  GoogleClientSecret,
  GoogleClientRefreshToken,
} = process.env;

let googleAuth = {
  type: "OAuth2",
  user: EMAILER,
  clientId: GoogleClientId,
  clientSecret: GoogleClientSecret,
  refreshToken: GoogleClientRefreshToken,
};

exports.transporter = transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: googleAuth,
  tls: {
    rejectUnauthorized: false,
  },
});

exports.mailGenerator = mailGenerator = new Mailgen({
  theme: "default",
  product: {
    name: "Press Play",
    link: `${APP_URL}`,
    logo: "https://i.ibb.co/N2ffWPS/Layer-2.png",
  },
});

exports.sendActivationMail = async (user) => {
  const mail = {
    body: {
      name: user.firstName,
      intro: "Welcome to Press Play",
      action: {
        instructions: "To activate your account, click on the link below:",
        button: {
          color: "#E2605B",
          text: "Activate Account",
          link: `${user.origin}/api/users/activate-account?token=${user.token}`,
        },
      },
      outro: "Do not share this link with anyone.",
    },
  };
  sendEmail(user.email, "Activate your account", mail);
};

exports.sendPasswordResetMail = async (user) => {
  const mail = {
    body: {
      name: user.firstName,
      intro: "Request for a Password Reset.",
      action: {
        instructions: "To reset your password, click on the link below:",
        button: {
          color: "#E2605B",
          text: "Reset password",
          link: `${user.origin}/user/password-reset?token=${user.resetLink}`,
        },
      },
      outro:
        "Please ignore this email if you did not request a password reset.",
    },
  };
  await sendEmail(user.email, "Reset your password", mail);
};

let sendEmail = (to, subject, mail) => {
  html = mailGenerator.generate(mail);
  const message = {
    from: `Press Play <${EMAILER}>`,
    to,
    subject,
    html,
  };
  return transporter.sendMail(message);
};
