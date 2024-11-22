export const validateCustomerData = (req, res, next) => {
    const { name, email, age } = req.body;
  
    if (!name || !email || !age) {
      return res.status(400).json({ error: "Missing required fields: name, email, or age" });
    }
  
    if (typeof age !== 'number' || age <= 0) {
      return res.status(400).json({ error: "Invalid age" });
    }
  
    next(); 
  };