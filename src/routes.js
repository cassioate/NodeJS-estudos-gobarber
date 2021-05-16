import { Router } from 'express';
// const { Router } = require('express');

import multer from 'multer';
import FileController from './app/controllers/FileController';
import SessionController from './app/controllers/SessionController';
import ProviderController from './app/controllers/ProviderController';


import UserController from './app/controllers/UserController'
import authMiddleware from './app/middlewares/auth';
import multerConfig from './config/multer';
import AppointmentController from './app/controllers/AppointmentController';

const routes = new Router();
const upload = multer(multerConfig);

// GET
routes.get('/providers', ProviderController.getAll)

// POST
routes.post('/users', UserController.save)
routes.post('/sessions', SessionController.save)
routes.post('/files', upload.single('file'), FileController.save);
routes.post('/appointment', AppointmentController.save);

// PUT
routes.put('/users', authMiddleware , UserController.update)

// DELETE



export default routes;
