const productService = require('../services/productService');

exports.getAllProducts = async (req, res) => {
    try {
        const products = await productService.getAllProducts();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createProduct = async (req, res) => {
    try {
        const product = await productService.createProduct(req.body);  // Asegúrate de enviar el campo 'img'
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
