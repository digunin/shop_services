import { Router } from 'express';
import { Controller } from './Controller.js';

const router = Router();
const controller = new Controller();
router.get('/products', controller.getProducts);
router.post('/product', controller.createProduct);
router.get('/all', controller.getRemainders);
router.post('/create', controller.createRemainder);
router.put('/increase/:id', controller.increaseRemainder);
router.put('/decrease/:id', controller.decreaseReaminder);

export { router };
