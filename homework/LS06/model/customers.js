import mongoose from "mongoose";
import  Collections  from "../data/collection.js";


const customerSchema = new mongoose.Schema({
    id: {  type: mongoose.Schema.Types.ObjectId,},
    name: String,
    email: { type: String, unique: true, required: true },
    age: Number,
    api_key: String,
})

const CustomerModel = mongoose.model(Collections.CUSTOMERS, customerSchema);
export default CustomerModel;