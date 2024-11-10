import http, { request } from 'http';
import { customers, orders, products } from './data.js'
import url from 'url';
const app = http.createServer((request, response) => {
    const parsedUrl = url.parse(request.url, true);
    const endpoint = parsedUrl.pathname;
    const query = parsedUrl.query;
    switch (endpoint) {
        case '/':
            response.end(`Homework LS01`);
            break;
        //1 Viết API để lấy toàn bộ danh sách khách hàng.           
        case '/customers':
            response.end(JSON.stringify(customers));
            break;
        //2 Lấy thông tin chi tiết của một khách hàng
        case '/customers/c001':
        case '/customers/c002':
        case '/customers/c003':
        case '/customers/c004':
        case '/customers/c005':
        case '/customers/c006':
        case '/customers/c007':
        case '/customers/c008':
        case '/customers/c009':
        case '/customers/c0010':
            const id = endpoint.split('/')[2];
            const customer = customers.find(n => n.id === id);
            if (customer) {
                response.end(JSON.stringify(customer));
            };
            break;

        //3. Lấy danh sách đơn hàng của một khách hàng cụ thể

        case '/customers/c001/orders':
        case '/customers/c002/orders':
        case '/customers/c003/orders':
        case '/customers/c004/orders':
        case '/customers/c005/orders':
        case '/customers/c006/orders':
        case '/customers/c007/orders':
        case '/customers/c008/orders':
        case '/customers/c009/orders':
        case '/customers/c0010/orders':
            const orderCustomerId = endpoint.split('/')[2];
            const customerOrder = orders.filter(order => order.customerId === orderCustomerId);
            if (customerOrder) {
                response.end(JSON.stringify(customerOrder));
            } else {
                response.end([])
            };
            break;

        //4. Lấy thông tin các đơn hàng với tổng giá trị trên 10 triệu
        case '/orders/highvalue':
            const highvalueOrder = orders.filter(highvalue => highvalue.totalPrice > 10000000);
            if (highvalueOrder) {
                response.end(JSON.stringify(highvalueOrder))
            };
            break;
        //5. Lọc danh sách sản phẩm theo khoảng giá
        case '/products':
               const minPrice =  parseInt(query.minPrice) || 0;
               const maxPrice = parseInt(query.maxPrice) || Infinity;
               const filterProductPrice = products.filter(
                product => product.price >= minPrice && product.price <= maxPrice
            );
                console.log(filterProductPrice)
                response.end(JSON.stringify(filterProductPrice));
        }
    });

app.listen(8080, () => {
    console.log('Server is running!');
});