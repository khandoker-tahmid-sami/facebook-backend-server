const bcrypt = require("bcrypt");
const getNewTokens = require("../util/getNewTokens");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const sendEmail = require("../util/sendEmail");

const login = async (email, password, db) => {
  const user = db.get("users").find({ email }).value();

  if (!user) {
    throw new Error("User not found");
  }

  const isPasswordCorrect = await bcrypt.compareSync(password, user.password);

  if (!isPasswordCorrect) {
    throw new Error("Invalid password");
  }

  const tokens = getNewTokens(user);

  let userObj = Object.assign({}, user);
  delete userObj.password;

  return {
    user: userObj,
    token: tokens,
  };
};

const register = (reqBody, db) => {
  const { email, password, firstName, lastName } = reqBody;

  const user = db.get("users").find({ email }).value();

  if (user) {
    throw new Error("User already exists");
  }

  const hashedPassword = bcrypt.hashSync(password, 8);

  const newUser = {
    id: crypto.randomUUID({ disableEntropyCache: true }),
    password: hashedPassword,
    firstName,
    lastName,
    avatar: null,
    email,
  };

  db.get("users").push(newUser).write();

  const token = getNewTokens(newUser);

  delete newUser.password;

  return {
    user: newUser,
    token,
  };
};

const refreshToken = async (refreshToken, db) => {
  // check if refresh token valid
  const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY);

  if (!decoded) {
    throw new Error("Invalid refresh token");
  }

  // check if user exists
  const user = db.get("users").find({ id: decoded.id }).value();

  if (!user) {
    throw new Error("User not found");
  }

  const token = getNewTokens(user);

  return token;
};

//forget password service

const forgotPassword = async(email, db) => {
  //check if user exists
  const user = db.get("users").find({ email }).value();

  // console.log(user);

  if (!user) {
    throw new Error(`No account found with that email ${email}`);
  }

  //generate a secure random token
  const resetToken = crypto.randomBytes(32).toString("hex");

  //set expiry to 1 hour fron now
  const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000).toISOString();

  //save token + expiry to database
  db.get("users")
    .find({ email })
    .assign({ resetToken, resetTokenExpiry })
    .write();


  //build reset Link

  const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`

  await sendEmail(
    email,
    "Password Reset Request",
    `
      <h2>Password Reset</h2>
      <p>You requested a password reset. Click the link below to reset your password.</p>
      <p>This link expires in <strong>1 hour</strong>.</p>
      <a href="${resetLink}" style="
        background:#1877f2;
        color:white;
        padding:10px 20px;
        text-decoration:none;
        border-radius:5px;
        display:inline-block;
        margin-top:10px;
      ">Reset Password</a>
      <p>If you did not request this, ignore this email.</p>
    `
  );

  return { message: "Password reset link sent to your email" };
};

module.exports.UserService = {
  login,
  register,
  refreshToken,
  forgotPassword,
};
