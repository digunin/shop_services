import { Router } from 'express';
import { Controller } from './Controller.js';

const router = Router();
const controller = new Controller();
router.post('/record', controller.createRecord);
router.get('/get-log', controller.getLog);

export { router };
