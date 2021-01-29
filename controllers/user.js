require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models/user");
const _ = require("lodash");
const nodemailer = require("nodemailer");
const Mailgen = require("mailgen");

const {
  EMAIL,
  PASSWORD,
  APP_URL,
  SECRET,
  RESET_PASSWORD_KEY,
  ACCOUNT_ACTIVATE,
} = process.env;

const base = `${APP_URL}`;

const transporter = nodemailer.createTransport({
  service: "gmail",
  secure: false,
  auth: {
    user: EMAIL,
    pass: PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const mailGenerator = new Mailgen({
  theme: "default",
  product: {
    name: "Press Play",
    link: APP_URL,
  },
});

const { sendPasswordResetMail } = require("../config/mail");

exports.userSignup = (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;

  User.findOne({ email }).exec((err, user) => {
    if (user) {
      return res.status(400).json({
        status: false,
        message: "This user already exists",
        data: null,
      });
    }

    User.findOne({ email }).exec((err, user) => {
      if (user) {
        return res.status(400).json({ error: "This user already exists" });
      }

      const token = jwt.sign(
        { firstName, lastName, email, password },
        ACCOUNT_ACTIVATE,
        { expiresIn: "30m" }
      );
      const response = {
        body: {
          name: firstName,
          intro: "Account Activate Link",
          action: {
            instructions: "To activate your account, click on the link below:",
            button: {
              text: "Activate Account",
              link: `${base}/api/users/activate-account?token=${token}`,
            },
          },
          outro: "Do not share this link with anyone.",
        },
      };

      const mail = mailGenerator.generate(response);

      const message = {
        from: `Press Play <o.arigbanla@genesystechhub.com>`,
        to: email,
        subject: "Activate your account",
        html: mail,
      };

      transporter.sendMail(message);
      // return true
      res.status(200).send({
        status: true,
        message:
          "A mail has been sent to your email address to activate your account.",
        data: { token },
      });

      // bcrypt.hash(password, 10, (err, hash)=> {
      //     let newUser = new User({ firstName, lastName, email, password:hash})
      //     newUser.save((err, success) => {
      //     if(err){
      //         console.log("error in signup")
      //         return res.status(400).json({error: err})
      //     }
      //     res.status(200).json({
      //         message :"signup success",
      //         extra: newUser
      //     })
      // })
      // })
    });
  });
};

exports.getLoggedInUser = async (req, res, next) => {
  const user = await User.findById(req.user.userId);
  if (!user)
    return res.status(400).send({
      status: false,
      message: "Invalid User",
      data: null,
    });

  res.send({
    status: true,
    message: null,
    data: _.pick(user, ["firstName", "lastName", "email", "isAuthor", "bio"]),
  });
};

exports.userLogin = (req, res, next) => {
  User.findOne({ email: req.body.email }).then((user) => {
    if (!user) {
      return res.status(401).send({
        status: false,
        message: "User does not exist",
        data: null,
      });
    }
    bcrypt.compare(req.body.password, user.password, (err, result) => {
      if (!result) {
        return res.status(404).send({
          status: false,
          message: "Invalid Password",
          data: null,
        });
      }
      if (result) {
        const token = jwt.sign({ userId: user._id }, SECRET, {
          expiresIn: "1d",
        });
        return res.status(200).send({
          status: true,
          message: "Authentication/Login successful",
          data: { token },
        });
      }
    });
  });
};

exports.activateAccount = (req, res) => {
  const { token } = req.query;
  if (token) {
    jwt.verify(token, ACCOUNT_ACTIVATE, (err, decodedToken) => {
      if (err) {
        return res.status(404).send("Incorrect or expired link");
      }
      const { firstName, lastName, email, password } = decodedToken;

      User.findOne({ email }).exec((err, user) => {
        if (user) {
          return res.status(400).json({
            status: false,
            message: "This user already exists",
            data: null,
          });
        }

        bcrypt.hash(password, 10, (err, hash) => {
          let newUser = new User({
            firstName,
            lastName,
            email,
            password: hash,
          });
          newUser.save((err, success) => {
            if (err) {
              console.log("error in signup");
              return res
                .status(400)
                .json({ status: false, message: err, data: null });
            }
            res.status(200).json({
              status: true,
              message: "signup success",
              data: {
                user: _.pick(newUser, ["firstName", "lastName", "email"]),
                token,
              },
            });
          });
        });
      });
    });
  } else {
    return res.send("error, something went wrong");
  }
};

exports.forgotPassword = (req, res) => {
  const { email } = req.body;

  User.findOne({ email }).exec((err, user) => {
    if (err || !user) {
      console.log("Error or User does not exist");
      res.send({ status: false, message: "User does not exist", data: null });
    }
    const token = jwt.sign({ _id: user._id }, RESET_PASSWORD_KEY, {
      expiresIn: "1h",
    });

    user.token = token;
    // const data = {
    //     from: "yemmyharry@gmail.com",
    //     to: email,
    //     subject: "Reset Password",
    //     html: `
    //         <h2> Please click to reset your password </h2>
    //         <p>  ${CLIENT_URL}/reset_password/${token}  </p>
    // `
    // };

    return user.updateOne({ resetLink: token }, (err, success) => {
      if (err) {
        return res.status(400).send({
          status: false,
          message: "Link expired or invalid link",
          data: null,
        });
      } else {
        sendPasswordResetMail(user);

        res.status(200).send({
          status: true,
          message: "A mail has been sent to your email address.",
          data: null,
        });
      }
    });
  });
};

exports.resetPassword = (req, res) => {
  const { resetLink, newPassword } = req.body;
  if (resetLink) {
    jwt.verify(resetLink, RESET_PASSWORD_KEY, (err, decodedData) => {
      if (err) {
        return res.status(401).send({
          status: false,
          message: "Incorrect or expired token",
          data: null,
        });
      }
      User.findOne({ resetLink }, (err, user) => {
        if (err || !user) {
          res.status(400).send({
            status: false,
            message: "User with this token does not exist",
            data: null,
          });
        }
        bcrypt.hash(newPassword, 10, (err, hashReset) => {
          const obj = {
            password: hashReset,
            resetLink: "",
          };
          user = _.extend(user, obj);
          //user is destination while obj is source

          user.save((err, result) => {
            if (err) {
              return res.status(400).send({
                status: false,
                message: "Reset password error",
                data: null,
              });
            } else {
              return res.json({
                status: true,
                message: "Your password has been successfully changed.",
                data: null,
              });
            }
          });
        });
      });
    });
  } else {
    res.status(401).send({
      status: true,
      message: "Authentication Error",
      data: null,
    });
  }
};

exports.deleteUser = async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user)
    return res.send({ status: false, message: "Invalid User", data: null });
  res.send({ status: true, message: null, data: user });
};
