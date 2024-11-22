import mongoose from 'mongoose';
import  Collections  from "../data/collection.js";

const productSchema = new mongoose.Schema({
    id : { type: mongoose.Schema.Types.ObjectId},
    name: String,
    price: Number,
    quantity: Number,
});

const ProductModel = mongoose.model(Collections.PRODUCTS, productSchema);
export default ProductModel;