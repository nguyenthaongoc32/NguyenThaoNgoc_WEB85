import express from 'express';
import mongoose from 'mongoose';
import CustomerModel from './model/customers.js';
import ProductModel from './model/products.js';
import OrderModel from './model/orders.js';


mongoose.connect("mongodb+srv://wweb85_admin:admin141319@cluster0.emxjd.mongodb.net/WEB85");

const app = express();
app.use(express.json());

app.get('/customers', async (req, res) => {
    try {
        const customers = await CustomerModel.find();
        res.status(200).send({
            message: 'Get customers successfully!',
            data: customers,
            success: true
        });
    } catch (error) {
        res.status(404).send({
            message: error.message,
            data: null,
            success: false
        });
    }
});


app.get('/customers/:id', async (req, res) => {
    try{
        const customer = await CustomerModel.findById(req.params.id);
        if (!customer) throw new Error('Customer not found');
        res.status(200).send({
            message: 'Get customer successfully!',
            data: customer,
            success: true
        });
    }catch(err) {
        res.status(404).send({
            message: err.message,
            data: null,
            success: false
        });
    }
});

app.get('/customers/:customerId/orders', async (req, res) => {
    try {
        const orders = await OrderModel.find({ customerId: req.params.customerId });
        res.status(200).send({
            message: 'Get orders successfully!',
            data: orders,
            success: true
        });
    } catch (error) {
        res.status(403).send({
            message: error.message,
            data: null,
            success: false
        });
    }
});

app.get('/orders/highvalue', async(req,res) => {
    try {
        const orderHighvalue = await OrderModel.find({totalPrice : { $gt: 10000000 }})
        res.status(200).send({
            message: 'Get highvalue successfully!',
            data: orderHighvalue,
            success: true
        });
    } catch (error) {
        res.status(403).send({
            message: error.message,
            data: null,
            success: false
        });
    }
});

app.get('/products', async(req,res) => {
    try {
        const {minPrice , maxPrice} = req.query;
        const filters = {};
        if (minPrice) filters.price = { $gte:(minPrice) };
        if (maxPrice) filters.price = { ...filters.price, $lte: (maxPrice) };

        const products  = await ProductModel.find(filters);
        
        res.status(200).send({
            message: 'Get producs successfully!',
            data: products,
            success: true
        })
    } catch (error) {
        res.status(200).send({
            message: error.message,
            data: null,
            success: false
        })
    }
});

app.post('/customers', async (req,res) =>{
    try {
        const { name, email, age } = req.body;
        const existingCustomer = await CustomerModel.findOne({ email });
        if (existingCustomer) throw new Error('Email already exists');
        const newCustomer = await CustomerModel.create({ name, email, age });
        res.status(201).send({
            message: 'Customer created successfully!',
            data: newCustomer,
            success: true
        });
    } catch (error) {
        res.status(400).send({
            message: error.message,
            data: null,
            success: false
        });
    }
});


app.post('/orders', async(req,res)=>{
    try{
    const { customerId, productId, quantity} = req.body;

    const product = await ProductModel.findById(productId);
    if (quantity > product.quantity) throw new Error ('Invalid product quantity')
    const totalPrice = product.price * quantity;
    const newOrders = await OrderModel.create({ customerId, productId, quantity, totalPrice});
    product.quantity -= quantity;
    await product.save();
    res.status(201).send({
        message: 'Order created successfully!',
        data: newOrders,
        success: true
    });
} catch (error) {
    res.status(400).send({
        message: error.message,
        data: null,
        success: false
    });
}
});

app.put('/orders/:orderId', async(req,res) => {
    try{
    const {quantity} = req.body;

    const orderId =  await OrderModel.findById(req.params.orderId );
    if(!orderId) throw new Error ('Order not found');
    const product = await ProductModel.findOne({ _id: orderId.productId });
    if (product.quantity + orderId.quantity < quantity) throw new Error('Insufficient product stock');
    product.quantity += orderId.quantity - quantity;
    orderId.quantity = quantity;
    orderId.totalPrice = product.price * quantity;

    await orderId.save();
    await product.save();

    res.status(200).send({
        message: 'Order updated successfully!',
        data: orderId,
        success: true
    });
} catch (error) {
    res.status(400).send({
        message: error.message,
        data: null,
        success: false
    });
}
});


app.delete('/customers/:id', async (req, res) => {
    try {
      const customer = await CustomerModel.findByIdAndDelete(req.params.id);
      if (!customer) throw new Error('Customer not found');
      res.status(200).send({
          message: 'Customer deleted successfully',
          data: customer,
          success: true
      });
  } catch (error) {
      res.status(404).send({
          message: error.message,
          data: null,
          success: false
      });
  }
});
app.listen(8080, () => {
    console.log('Server is running!');
});