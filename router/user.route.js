const express = require("express");
const { UserController } = require("../controller/user.controller");
const catchAsync = require("../util/catchAsync");

const router = express.Router();

router.post("/login", catchAsync(UserController.login));
router.post("/register", catchAsync(UserController.register));
router.post("/refresh-token", catchAsync(UserController.refreshToken));
router.post("/forgot-password", catchAsync(UserController.forgotPassword));
router.post("/reset-password", catchAsync(UserController.resetPassword));

module.exports = router;
