import { StatusCodes } from 'http-status-codes';
import AppError from './appErrorUtil.js';

const generalUtils = {
  /**
   * Returns an sync reject message
   * @param {Object} error
   * @returns {Object}
   */
  asyncRejectRes(error) {
    return new AppError(
      error.message,
      error.StatusCodes ? error.StatusCodes : StatusCodes.INTERNAL_SERVER_ERROR
    );
  },
};

export default generalUtils;
