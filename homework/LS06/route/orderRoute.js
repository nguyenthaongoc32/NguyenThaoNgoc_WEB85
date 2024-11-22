import express from 'express';
import { getOrderHighvalue,postCreateOrder,putByIdOrder } from '../controller/orderController.js';
import {auth} from '../middleware/auth.js'
import { validateOrder } from '../middleware/validateOrders.js';
const Router = express.Router();


Router.route('/highvalue').get(auth,getOrderHighvalue);
Router.route('/').post(auth,validateOrder,postCreateOrder);
Router.route('/:orderId').put(auth,putByIdOrder)
export default Router;