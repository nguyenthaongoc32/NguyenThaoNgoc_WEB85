import express from 'express';
import mongoose from 'mongoose';
import customerRoute from './route/customerRoute.js';
import orderRoute from './route/orderRoute.js';
import productRoute from './route/productRoute.js';
import { auth } from './middleware/auth.js';


mongoose.connect("mongodb+srv://wweb85_admin:admin141319@cluster0.emxjd.mongodb.net/LS06");

const app = express();
app.use(express.json());
app.use('/customers', customerRoute);
app.use('/products', productRoute);
app.use('/orders' , orderRoute)

app.listen(8080, () => {
    console.log('Server is running!');
})