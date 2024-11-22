import ProductModel from '../model/products.js';

export const getMinMaxProduct = async(req,res) =>{
    try{
        const {minPrice,maxPrice} = req.query;
        const filters = {}
        if (minPrice) filters.price = {$gte: (minPrice)};
        if(maxPrice) filters.price = {...filters.price, $lte:(maxPrice)}
        const products  = await ProductModel.find(filters);
        
        res.status(200).send({
            message: 'Get producs successfully!',
            data: products,
            success: true
        })
    } catch (error) {
        res.status(200).send({
            message: error.message,
            data: null,
            success: false
        })
    }
};