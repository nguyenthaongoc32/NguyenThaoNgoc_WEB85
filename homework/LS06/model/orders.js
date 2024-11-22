import mongoose from "mongoose";
import  Collections  from "../data/collection.js";

const orderSchema = new mongoose.Schema({
    customerId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: Collections.CUSTOMERS,
        required: true
    },
    productId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: Collections.PRODUCTS,
        required: true
    },
    quantity: Number,
    totalPrice: Number,
})

const OrderModel = mongoose.model(Collections.ORDERS, orderSchema);
export default OrderModel;