export const validateOrder = (req, res, next) => {
    const { orderId, customerId, productId, quantity } = req.body;
  
    if (!orderId || !customerId || !productId || typeof quantity !== 'number' || quantity <= 0) {
      return res.status(400).json({ error: "Invalid or missing order data" });
    }
  
    next();
  };