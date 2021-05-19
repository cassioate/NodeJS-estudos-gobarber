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
import ScheduleController from './app/controllers/ScheduleController';
import NotificationController from './app/controllers/NotificationController';

const routes = new Router();
const upload = multer(multerConfig);


  // GET

  // POST
routes.post('/users', UserController.save)
routes.post('/sessions', SessionController.save)

  // PUT

  // DELETE

// ----------------------------------------------------------------------
/**
 * ENDPOINTS QUE PRECISAM DE VERIFICAÇÃO DO TOKEN FICAM ABAIXO DESSA LINHA
 */
// ----------------------------------------------------------------------

// VERIFICADOR DO TOKEN | TAMBÉM SETTA O VALOR DO USER_ID NA REQUISIÇÃO
routes.use(authMiddleware);


  // GET
routes.get('/providers', ProviderController.getAll)
routes.get('/appointment', AppointmentController.getAll)
routes.get('/schedule', ScheduleController.getAll)
routes.get('/notifications', NotificationController.getAll)

  // POST
routes.post('/files', upload.single('file'), FileController.save);
routes.post('/appointment', AppointmentController.save);

  // PUT
routes.put('/users', UserController.update)
routes.put('/notifications/:id', NotificationController.update)

  // DELETE
routes.delete('/appointment/:id', AppointmentController.delete)


export default routes;
