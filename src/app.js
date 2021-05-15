import express from "express";
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
  }

  routes() {
    this.server.use(routes);
  }
}

export default new App().server;
// module.exports = new App().server;
