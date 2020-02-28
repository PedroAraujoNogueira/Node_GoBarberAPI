// Aqui iremos configurar nosso servidor express.
// O sucrase permite utilizar funcionalidades mais novas do JS, como o import e export por
// exemplo.

import 'dotenv/config';

// const express = require('express')
import express from 'express';
import path from 'path';
import Youch from 'youch';
import * as Sentry from '@sentry/node';
import 'express-async-errors';
// const routes = require('./routes')
import routes from './routes';
import sentryConfig from './config/sentry';

import './database';

class App {
  constructor() {
    this.server = express();

    Sentry.init(sentryConfig);
    this.middlewares();
    this.routes();
    this.exceptionHandler();
  }

  middlewares() {
    this.server.use(Sentry.Handlers.requestHandler());
    this.server.use(express.json());
    this.server.use('/files', express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))); // Esse caminho será chamado em uma requisicao do tipo GET.
  }

  routes() {
    this.server.use(routes);
    this.server.use(Sentry.Handlers.errorHandler());
  }

  exceptionHandler() {
    this.server.use(async (err, req, resp, next) => {
      const errors = await new Youch(err, req).toJSON();

      return resp.status(500).json(errors);
    });
  }
}

// module.exports = new App().server
export default new App().server;
