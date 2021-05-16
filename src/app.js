import express from "express";
import path from 'path'
import routes from "./routes";

import './database'

// const express = require('express')

// const routes = require('./routes')

class App {
  constructor() {
    this.server = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(express.json());
    this.server.use(
      '/files',
      express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
    )
  }

  routes() {
    this.server.use(routes);
  }
}

export default new App().server;
// module.exports = new App().server;
