import express from 'express';
import {getMinMaxProduct } from '../controller/productController.js';
import {auth} from '../middleware/auth.js'
const Router = express.Router();


Router.route('/').get(auth,getMinMaxProduct);

export default Router;