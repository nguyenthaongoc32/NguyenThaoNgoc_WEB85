import customerModel from '../model/customers.js';
import crypto from 'crypto';

export const getApiKey = async (req, res) => {
    const { id } = req.params;
    const customer = await customerModel.findById(id);
    if (!customer) return res.status(404).json({ error: "Customer not found" });
  
    const randomString = crypto.randomBytes(5).toString("hex");
    const apiKey = `web-$${customer._id}-$${customer.email}-$${randomString}$`;
    customer.api_key = apiKey;
    await customer.save();
  
    res.json({ apiKey });
  };
  
  export const getAllCustomers = async (req, res) => {
    try{
        const customers = await customerModel.find();

        res.status(201).send({
            message : 'Get cusstomers successfully!',
            data : customers,
            success : true
        })
    }catch(err){
        next(err)
    }
  };
  
  export const getByIdCustomer = async (req, res) => {
    try{
        const {id} = req.params;
        const customer = await customerModel.findById(id);
        if(!customer) throw new Error ('Customer is not exists');
        res.status(201).send({
            message : 'Customer found!',
            data : customer,
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
  
  export const postCreatCustomer = async (req, res) => {
    try{
        const {name, email , age} = req.body;
        const existEmail = await customerModel.findOne({email});
        if(existEmail) throw new Error ('Email already exists!');
        const newCustomer = await customerModel.create({name , email , age});
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
  };