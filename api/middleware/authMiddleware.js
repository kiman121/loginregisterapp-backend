import asyncHandler from 'express-async-handler';
import { StatusCodes } from 'http-status-codes';

import { validateToken } from '../helpers/jwtHelper.js';
import User from '../models/userModel.js';
import AppError from '../utils/appErrorUtil.js';
import generalUtils from '../utils/generalUtils.js';

const protect = asyncHandler(async (req, res, next) => {
  let token;
  const { authorization } = req.headers;

  if (authorization && authorization.startsWith('Bearer')) {
    token = authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token)
    return next(
      new AppError('Please login to get access.', StatusCodes.UNAUTHORIZED)
    );

  try {
    const decoded = validateToken(token);
    const user = await User.findById(decoded.id);

    if (!user)
      return next(
        new AppError(
          'The user for this token no longer exists.',
          StatusCodes.UNAUTHORIZED
        )
      );

    if (!user.active)
      return next(
        new AppError(
          'The user account has been deactivated. Kindly contact your system admin.',
          StatusCodes.UNAUTHORIZED
        )
      );

    if (await user.changedPasswordAfter(decoded.iat))
      return next(
        new AppError(
          'User recently changed password! Please login again.',
          StatusCodes.UNAUTHORIZED
        )
      );

    req.user = user;
    next();
  } catch (error) {
    return next(generalUtils.asyncRejectRes(error));
  }
});

export default protect;
