const express = require('express');
const cors = require('cors'); // Importa el paquete cors
const app = express();
const sequelize = require('./config/database');
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const cartRoutes = require('./routes/cartRoutes');
const galleryRoutes = require('./routes/galleryRoutes');


// Middleware para habilitar CORS
app.use(cors()); // Permite todas las solicitudes CORS

app.use(express.json());

app.use('/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/gallery',galleryRoutes);
app.use('/users', userRoutes);
app.use('/cart', cartRoutes);

sequelize.sync()
    .then(() => {
        app.listen(3000, () => {
            console.log('Server is running on port 3000');
        });
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });
    
