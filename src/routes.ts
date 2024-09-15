import { Router } from 'express';
import { Controller } from './controllers/Controller.js';

const router = Router();
const controller = new Controller();
router.get('/products', controller.getProducts);
router.post('/product', controller.createProduct);
router.get('/remainders', controller.getRemainders);
router.post('/remainder', controller.createRemainder);
router.put('/increase', controller.increaseRemainder);
router.put('/decrease', controller.decreaseReaminder);

export { router };
