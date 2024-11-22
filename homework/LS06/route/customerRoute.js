import express from 'express';
import { getAllCustomers,getByIdCustomer,postCreatCustomer,getApiKey} from '../controller/customerController.js';
import {getOrderByCustomerId } from '../controller/orderController.js'
import {auth} from '../middleware/auth.js'
import { validateCustomerData } from '../middleware/validateCustomer.js';
const Router = express.Router();

Router.route('/getApikey/:id').get(getApiKey)
Router.route('/').get(auth,getAllCustomers);
Router.route('/:id').get(auth,getByIdCustomer);
Router.route('/:customerId/orders').get(auth,getOrderByCustomerId);
Router.route('/').post(auth,validateCustomerData,postCreatCustomer)
export default Router;