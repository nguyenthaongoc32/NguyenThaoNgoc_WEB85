import OrderModel from '../model/orders.js';
import ProductModel from '../model/products.js';

export const getOrderByCustomerId = async(req,res) =>{
    try{
        const order = await OrderModel.find({customerId : req.params.customerId});
        if(!order) throw new Error ('Order is not exists!')
        res.status(200).send({
            message : 'Get order successfully!',
            data : order,
            success : true
        })
    }catch (error) {
        res.status(404).send({
            message: error.message,
            data: null,
            success: false
        });
    }
};

export const getOrderHighvalue = async(req,res) => {
    try{
        const highvalue = await OrderModel.find({totalPrice : {$gt :  10000000 }});
        res.status(200).send({
            message: 'Get highvalue successfully!',
            data: highvalue,
            success: true
        });
    }catch (error) {
        res.status(403).send({
            message: error.message,
            data: null,
            success: false
        });
    }
};

export const postCreateOrder = async(req,res) =>{
    try{
        const {customerId, productId, quantity} = req.body;
        const product = await ProductModel.findById(productId);

        if(!product || product.quantity < quantity) throw new Error('Invalid product quantity')
        const totalPrice = product.price * quantity;
        const newOrders = await OrderModel.create({customerId, productId, quantity, totalPrice});
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
    }

export const putByIdOrder = async(req,res) =>{
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
};