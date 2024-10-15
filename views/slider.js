document.addEventListener('DOMContentLoaded', function () {
    let currentPage = 1; // Página inicial
    const pageSize = 5; // Número de productos por página
    const baseUrl = 'http://localhost:3000/products/page/slider'; // URL de la API del servidor backend
    const numerito = document.getElementById('numerito');

    // Array para almacenar productos en el carrito
    let productosEnCarrito = JSON.parse(window.localStorage.getItem("productos-en-carrito")) || [];
    let productos = []; // Variable para almacenar los productos obtenidos del backend

    // Función para obtener productos desde el backend
    async function fetchProducts(page) {
        try {
            const response = await fetch(`${baseUrl}?page=${page - 1}&size=${pageSize}`);
            if (!response.ok) {
                throw new Error('Error al obtener productos del backend');
            }
            const data = await response.json();

            // Actualizar productos y renderizar en el slider
            productos = data.content; // Guardamos los productos en la variable global
            renderProducts(data.content);

            // Actualizar estado de los botones de paginación
            document.getElementById('prev-btn').disabled = page === 1;
            document.getElementById('next-btn').disabled = page >= data.totalPages;

        } catch (error) {
            console.error('Error al obtener productos:', error);
        }
    }

    // Función para renderizar los productos en el slider
    function renderProducts(products) {
        const slider = document.getElementById('product-slider');
        slider.innerHTML = ''; // Limpiar el contenido previo

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
                <button class="add-cart" id="${product.id}">
                    <i class="fa-solid fa-basket-shopping"></i> Agregar al carrito
                </button>
            `;
            slider.appendChild(productDiv);

            // Agregar evento click para agregar al carrito
            productDiv.querySelector('.add-cart').addEventListener('click', function(e) {
                e.preventDefault();
                agregarAlCarrito(e);
            });
        });
    }

    // Función para agregar productos al carrito
    function agregarAlCarrito(e) {
        const idBoton = parseInt(e.currentTarget.id, 10);
        const productoAgregado = productos.find(producto => producto.id === idBoton);

        if (productoAgregado) {
            const productoEnCarrito = productosEnCarrito.find(producto => producto.id === idBoton);

            if (productoEnCarrito) {
                // Si el producto ya está en el carrito, aumentar la cantidad
                productoEnCarrito.sold++;
            } else {
                // Si el producto no está en el carrito, agregarlo con una cantidad inicial de 1
                productoAgregado.sold = 1;
                productosEnCarrito.push(productoAgregado);
            }

            saveLocalCarrito();
            actualizarNumerito();
        } else {
            console.error(`Producto con ID ${idBoton} no encontrado`);
        }
    }

    // Función para guardar el carrito en localStorage
    const saveLocalCarrito = () => {
        localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
    };

    // Función para actualizar el número de productos en el carrito
    function actualizarNumerito() {
        let nuevoNumerito = productosEnCarrito.reduce((acc, producto) => acc + producto.sold, 0);
        numerito.innerText = nuevoNumerito;
    }

    // Controladores de eventos para los botones "Anterior" y "Siguiente"
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

    // Cargar la primera página al inicio
    fetchProducts(currentPage);
});
