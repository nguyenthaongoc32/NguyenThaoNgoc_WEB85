import Customers from '../model/customers.js';

export const auth = async (req, res, next) => {
  try {
    const { api_key } = req.query;
    if (!api_key) {
      return res.status(403).send('Forbidden'); 
    }

    const customer = await Customers.findOne({ api_key });
    if (!customer) {
      return res.status(403).send('Forbidden'); 
    }

    req.customer = customer; 
    next(); 
  } catch (error) {
    res.status(500).send('Internal Server Error'); 
  }
};