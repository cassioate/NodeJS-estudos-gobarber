import { Router } from 'express';
import SessionController from './app/controllers/SessionController';
// const { Router } = require('express');

import UserController from './app/controllers/UserController'
import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/users', UserController.save)
routes.post('/sessions', SessionController.save)

routes.put('/users', authMiddleware , UserController.update)


export default routes;
