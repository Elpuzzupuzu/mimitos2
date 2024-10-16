document.addEventListener('DOMContentLoaded', function () {
    // Variables
    let productosEnCarrito = JSON.parse(window.localStorage.getItem("productos-en-carrito")) || [];
    let productos = []; // Almacena los productos obtenidos del backend
    let currentPage = 1;
    const pageSize = 5;
    const numerito = document.getElementById('numerito');

    // Función para obtener productos desde el backend
    async function fetchProducts(page) {
        try {
            const response = await fetch(`http://localhost:3000/api/products/slider?page=${page}&pageSize=${pageSize}`);
            if (!response.ok) throw new Error('Error al obtener los productos');
            const data = await response.json();

            // Renderizar los productos en el slider
            renderProducts(data.products);

            // Manejar botones de paginación
            document.getElementById('prev-btn').disabled = currentPage === 1;
            document.getElementById('next-btn').disabled = currentPage >= data.totalPages;
        } catch (error) {
            console.error('Error:', error);
        }
    }

    // Función para obtener todos los productos desde el backend
    async function getAllProducts() {
        try {
            const response = await fetch('http://localhost:3000/api/products/getall');
            if (!response.ok) throw new Error('Network response was not ok');
            const products = await response.json();

            productos = products; // Guardar los productos
            displayProducts(products);
            renderProducts(products);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    }

    // Mostrar los productos en la lista general
    function displayProducts(products) {
        const productsContainer = document.getElementById('products-container');
        productsContainer.innerHTML = '';

        if (!products || products.length === 0) {
            productsContainer.innerHTML = '<p>No se encontraron productos.</p>';
            return;
        }

        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.classList.add('product-card');
            productCard.innerHTML = `
                <div class="card-product">
                    <div class="container-img">
                        <img src="${product.img}" alt="Producto">
                        <span class="discount">-13%</span>
                        <div class="button-group">
                            <span><i class="fa-solid fa-eye"></i></span>
                            <span><i class="fa-regular fa-heart"></i></span>
                            <span><i class="fa-solid fa-code-compare"></i></span>
                        </div>
                    </div>
                    <div class="content-card-product">
                        <div class="stars">
                            <i class="fa-solid fa-star"></i>
                            <i class="fa-solid fa-star"></i>
                            <i class="fa-solid fa-star"></i>
                            <i class="fa-solid fa-star"></i>
                            <i class="fa-regular fa-star"></i>
                        </div>
                        <h3>${product.name}</h3>
                        <button class="add-cart" id="${product.id_product}">
                            <i class="fa-solid fa-basket-shopping"></i>
                        </button>
                        <p class="price">$${product.price} <span></span></p>
                        <p class="stock">${product.stock} en stock</p>
                    </div>
                </div>
            `;

            productsContainer.appendChild(productCard);

            productCard.querySelector('.add-cart').addEventListener('click', () => {
                agregarAlCarrito(product.id_product);
            });
        });
    }

    // Renderizar los productos en el slider
    function renderProducts(products) {
        const slider = document.getElementById('product-slider');
        slider.innerHTML = '';

        if (!products || products.length === 0) {
            slider.innerHTML = '<p>No se encontraron productos.</p>';
            return;
        }

        products.forEach(product => {
            const productDiv = document.createElement('div');
            productDiv.classList.add('product-item');
            productDiv.innerHTML = `
                <h3>${product.name}</h3>
                <img src="${product.img}" alt="${product.name}">
                <p>${product.description}</p>
                <p><strong>Precio:</strong> $${product.price}</p>
                <p><strong>Stock:</strong> ${product.stock} unidades</p>
                <button class="add-cart" id="${product.id_product}">
                    <i class="fa-solid fa-basket-shopping"></i> Agregar al carrito
                </button>
            `;
            slider.appendChild(productDiv);

            productDiv.querySelector('.add-cart').addEventListener('click', () => {
                agregarAlCarrito(product.id_product);
            });
        });
    }

    // Función para agregar al carrito
    function agregarAlCarrito(productId) {
        const productoAgregado = productos.find(producto => producto.id_product === productId);

        if (productoAgregado) {
            const productoEnCarrito = productosEnCarrito.find(producto => producto.id_product === productId);

            if (productoEnCarrito) {
                productoEnCarrito.sold++;
            } else {
                productoAgregado.sold = 1;
                productosEnCarrito.push(productoAgregado);
            }

            saveLocalCarrito();
            actualizarNumerito();
        } else {
            console.error(`Producto con ID ${productId} no encontrado`);
        }
    }

    // Guardar el carrito en localStorage
    const saveLocalCarrito = () => {
        localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
    };

    // Actualizar el número de productos en el carrito
    function actualizarNumerito() {
        let nuevoNumerito = productosEnCarrito.reduce((acc, producto) => acc + producto.sold, 0);
        numerito.innerText = nuevoNumerito;
    }

    // Botones de paginación
    document.getElementById('prev-btn').addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            fetchProducts(currentPage);
        }
    });

    document.getElementById('next-btn').addEventListener('click', () => {
        currentPage++;
        fetchProducts(currentPage);
    });

    // Cargar la primera página y todos los productos al inicio
    fetchProducts(currentPage);
    getAllProducts();
});
