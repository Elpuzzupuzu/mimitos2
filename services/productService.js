const Product = require('../models/Product');

exports.getAllProducts = async () => {
    return await Product.findAll();
};

exports.createProduct = async (data) => {
    return await Product.create(data);  // Asegúrate de que 'data' incluya 'img'
};
