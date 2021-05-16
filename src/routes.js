import { Router } from 'express';
import multer from 'multer';
import FileController from './app/controllers/FileController';
import SessionController from './app/controllers/SessionController';
// const { Router } = require('express');

import UserController from './app/controllers/UserController'
import authMiddleware from './app/middlewares/auth';
import multerConfig from './config/multer';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.save)
routes.post('/sessions', SessionController.save)

routes.put('/users', authMiddleware , UserController.update)

routes.post('/files', upload.single('file'), FileController.save);

export default routes;
