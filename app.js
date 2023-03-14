import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import { StatusCodes } from 'http-status-codes';
import cookieParser from 'cookie-parser';

import environment from './config/environment.js';
import errorHandler from './api/middleware/errorMiddleware.js';
import AppError from './api/utils/appErrorUtil.js';
import { v1Routes } from './api/routes/index.js';

class App {
  constructor() {
    this.app = express();

    this.app.use(
      logger('dev', { skip: (req, res) => environment.nodeEnv === 'test' })
    );

    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(bodyParser.json());

    this.app.use(cookieParser());

    app.use((req, res, next) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE');
      res.setHeader(
        'Access-Control-Allow-Headers',
        'Content-Type,Authorization'
      );
      next();
    });

    this.setRoutes();
  }

  setRoutes() {
    this.app.use('/api/v1', v1Routes);

    this.app.all('*', (req, res, next) => {
      next(
        new AppError(
          `Unable to find ${req.originalUrl} on this server!`,
          StatusCodes.NOT_FOUND
        )
      );
    });

    this.app.use(errorHandler);
  }

  getApp() {
    return this.app;
  }

  listen() {
    const { port, nodeEnv } = environment;

    this.app.listen(port, () => {
      console.log(
        `Backend server listening in ${nodeEnv} mode on port ${port}`.yellow
          .bold
      );
    });
  }
}

export default App;
