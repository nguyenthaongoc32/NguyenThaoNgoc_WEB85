import express from 'express';
import axios from 'axios';
import { v4 } from 'uuid';

const app = express();
app.use(express.json());

const dbUrl = 'http://localhost:3000';


//1
app.get('/customers', (req, res) => {
  fetch(`${dbUrl}/customers`).then((rs) => {
    return rs.json()
  }).then((data) => {
    res.send({
      message: '1.Customers',
      data
    });
  });
});

//2
app.get('/customers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const response = await axios.get(`${dbUrl}/customers/${id}`)
    res.status(201).send({
      message: '2.Customers id',
      data: response.data
    });
  } catch (error) {
    res.status(403).send({
      message: error.message,
      status: 'fail',
      data: null
    })
  }
});


//3
app.get('/customers/:cId/orders', async (req, res) => {
  try {
    const { cId } = req.params;
    const reponse = await axios.get(`${dbUrl}/orders`);
    const allOrders = reponse.data;

    const order = allOrders.filter(i => i.customerId === cId);
    res.status(201).send({
      message: '3. Orders CustomerId',
      data: order
    });
  } catch (error) {
    res.status(403).send({
      message: error.message,
      status: 'fail',
      data: null
    })
  }
});

//4
app.get('/orders/highvalue', async (req, res) => {
  try {
    const reponse = await axios.get(`${dbUrl}/orders`);
    const allOrders = reponse.data;

    const highvalue = allOrders.filter(i => i.totalPrice > 10000000);
    res.status(201).send({
      message: '3. Orders highvalue',
      data: highvalue
    });
  } catch (error) {
    res.status(403).send({
      message: error.message,
      status: 'fail',
      data: null
    })
  }
});


//5

app.get('/products', async (req, res) => {
  try {

    const minPrice = req.query.minPrice || 0;
    const maxPrice = req.query.maxPrice || Infinity;
    const reponse = await axios.get(`${dbUrl}/products`);
    const allProducts = reponse.data;

    const filterProducts = allProducts.filter(product => product.price >= minPrice && product.price <= maxPrice);
    res.status(201).send({
      message: '4. Products',
      data: filterProducts
    });
  } catch (error) {
    res.status(403).send({
      message: error.message,
      status: 'fail',
      data: null
    })
  }
});


//6

app.post('/customers', async (req, res) => {
  try {
    const { name, email, age } = req.body;
    const id = `c${v4().slice(0, 3)}`;

    if (!email) throw new Error('Emai is required!');
    if (!name) throw new Error('Name is required!');
    if (!age) throw new Error('Age is required!');

    const { data: customers } = await axios.get(`${dbUrl}/customers`);
    if (customers.some(customer => customer.emai === email)) {
      return res.status(400).send({
        message: 'Email đã tồn tại',
        status: 'fail',
        data: { email }
      })
    }
    const newUser = {
      id,
      name,
      email,
      age
    }
    await axios.post(`${dbUrl}/customers`, newUser);
    res.status(201).send({
      message: 'Create customer success',
      status: 'success',
      data: customers, newUser
    })
  } catch (error) {
    res.status(403).send({
      message: error.message,
      status: 'fail',
      data: null
    })

  }
})


//7

app.post('/orders', async (req, res) => {
  try {
    const { orderId, customerId, productId, quantity } = req.body;

    if (!orderId) throw new Error('OrderId is required!');
    if (!customerId) throw new Error('OrderId is required!');
    if (!productId) throw new Error('OrderId is required!');
    if (!quantity) throw new Error('OrderId is required!');

    const productResponse = await axios.get(`${dbUrl}/products/${productId}`);
    const product = productResponse.data;

    if (quantity > quantity.product) {
      return res.status(400).send({
        message: "Sản phẩm không đủ số lượng ",
        status: 'fail',
        data: null
      })
    }
    const totalPrice = product.price * quantity;

    const newOrder = {
      orderId,
      customerId,
      productId,
      quantity,
      totalPrice
    };
    await axios.post(`${dbUrl}/orders`, newOrder);

    await axios.patch(`${dbUrl}/products/${productId}`, {
      quantity: product.quantity - quantity
    });

    const allOrdersResponse = await axios.get(`${dbUrl}/orders`);
    const allOrders = allOrdersResponse.data;

    res.status(201).send({
      message: "New order added successfully",
      data: {
        allOrders,
        newOrder
      }
    });

  } catch (error) {
    res.status(500).send({
      message: error.message,
      status: "fail",
      data: null
    });
  }
});

// 8


app.put('/orders/:orderId', async (req, res) => {
  const { orderId } = req.params;
  const { quantity } = req.body;

  if (!quantity || quantity <= 0) {
    return res.status(400).json({
      message: "Quantity is required ",
      status: "fail",
      data: null
    });
  }
  try {
    const { data: order } = await axios.get(`${dbUrl}/orders/${orderId}`);
    console.log(order)
    if (!order) {
      return res.status(404).json({
        message: "Order not found",
        status: "fail",
        data: null
      });
    }


    const { data: product } = await axios.get(`${dbUrl}/products/${order.productId}`);
    if (!product) {
      return res.status(404).json({
        message: "Product not found",
        status: "fail",
        data: null
      });
    }

    const updatedStock = product.quantity + order.quantity - quantity;
    if (updatedStock < 0) {
      return res.status(400).send({
        message: 'Không đủ hàng để cập nhập',
        status: 'fail',
        data: null
      });
    }
    const updatedOrder = { ...order, quantity, totalPrice: product.price * quantity };
    await axios.put(`${dbUrl}/orders/${orderId}`, updatedOrder);
    await axios.patch(`${dbUrl}/products/${product.id}`, { quantity: updatedStock });

    res.status(200).json({
      message: "Order quantity updated successfully",
      data: updatedOrder
    });

  } catch (error) {
    if (error.response && error.response.status === 404) {
      return res.status(404).json({
        message: "Order not found",
        status: "fail",
        data: null
      });
    }

    res.status(500).json({
      message: error.message,
      status: "fail",
      data: null
    });
  }
});

app.delete('/customers/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const response = await axios.delete(`${dbUrl}/customers/${id}`);
    res.status(200).send({
      message: "Xóa khách hàng thành công",
      status: "success",
      data: response.data
    });
  } catch (error) {
    res.status(404).send({
      message: "Không tìm thấy khách hàng",
      status: "fail",
      data: null
    });
  }
});



app.listen(8080, () => {
  console.log('Server is running!');
});