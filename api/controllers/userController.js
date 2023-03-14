import crypto from 'crypto';
import asyncHandler from 'express-async-handler';
import { StatusCodes } from 'http-status-codes';

import User from '../models/userModel.js';
import Email from '../utils/emailUtil.js';
import { generateToken } from '../helpers/jwtHelper.js';
import AppError from '../utils/appErrorUtil.js';
import environment from '../../config/environment.js';

/**
 * @description Register a new user
 * @route POST /api/v1/users
 * @access Public
 */
const registerUser = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists)
    return next(
      new AppError('A user with this email exists!', StatusCodes.BAD_REQUEST)
    );

  const user = await User.create(req.body);

  if (!user)
    return next(
      new AppError('Unable to create user.', StatusCodes.BAD_REQUEST)
    );

  const newUser = await user.excludeFields({ ...user._doc }, [
    'active',
    'password',
    '__v',
  ]);

  res.status(StatusCodes.CREATED).send({
    status: 'success',
    message: 'User created successfully',
    data: newUser,
  });
});

/**
 * @description Logs in a user & gets token
 * @route POST /api/v1/users/login
 * @access Public
 */
const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password)))
    return next(
      new AppError('Invalid login credentials', StatusCodes.UNAUTHORIZED)
    );

  if (!user.active)
    return next(
      new AppError(
        'Your account is inactive, please contact your system administrator.',
        StatusCodes.UNAUTHORIZED
      )
    );

  const loggedInUser = await user.excludeFields({ ...user._doc }, [
    'active',
    'password',
    '__v',
  ]);

  loggedInUser.token = generateToken(loggedInUser._id);

  return res.status(StatusCodes.OK).send({
    status: 'success',
    message: 'Logged in successfully.',
    data: loggedInUser,
  });
});

/**
 * @description Sends a reset password token
 * @route POST /api/v1/users/forgot-password
 * @access Public
 */
const forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user)
    return next(
      new AppError(
        'There is no user with that email address',
        StatusCodes.NOT_FOUND
      )
    );

  const resetToken = await user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  try {
    let { clientDomain } = environment;
    const resetURL = `${clientDomain}/reset-password/${resetToken}`;

    // Send email here
    await new Email(user, resetURL).sendPasswordReset();

    return res.status(StatusCodes.OK).send({
      status: 'success',
      message: 'Token sent to your email.',
      resetURL,
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    console.log(error);
    return next(
      new AppError('There was an eror sending the email. Try again later!', 500)
    );
  }
});

/**
 * @description resets password token
 * @route POST /api/v1/users/reset-password
 * @access Public
 */
const resetPassword = asyncHandler(async (req, res, next) => {
  const { token } = req.params;
  const { password, confirmPassword } = req.body;

  if (password !== confirmPassword)
    return next(
      new AppError(
        'The passwords are not matching',
        StatusCodes.UNPROCESSABLE_ENTITY
      )
    );

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user)
    return next(
      new AppError('Token is invalid or has expired!', StatusCodes.UNAUTHORIZED)
    );

  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  const _user = await user.excludeFields({ ...user._doc }, [
    'active',
    'password',
    '__v',
  ]);

  _user.token = generateToken(_user._id);

  return res.status(StatusCodes.OK).send({
    status: 'success',
    message: 'Password reset successfully.',
    data: _user,
  });
});

export { registerUser, loginUser, forgotPassword, resetPassword };
