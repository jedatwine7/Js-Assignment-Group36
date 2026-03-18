// 1. DATA (The Warehouse)
const products = [
    { id: 1, name: "Premium Laptop", price: 2500000, category: "Electronics", image: "images/laptop.jpg" },
    { id: 2, name: "Smartphone X", price: 1200000, category: "Electronics", image: "images/phone.jpg" },
    { id: 3, name: "Leather Shoes", price: 150000, category: "Fashion", image: "images/shoes.jpg" },
    { id: 4, name: "Cotton T-Shirt", price: 45000, category: "Fashion", image: "images/shirt.jpg" },
    { id: 5, name: "JavaScript Guide", price: 80000, category: "Books", image: "images/book.jpg" },
    { id: 6, name: "Wireless Headphones", price: 300000, category: "Electronics", image: "images/headphones.jpg" }
];

// 2. LOAD MEMORY (The Storage)
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// 3. HOME PAGE: Display Products
function displayProducts(productsToDisplay = products) {
    const container = document.getElementById('product-container'); 
    if (!container) return; 
    
    container.innerHTML = ''; 
    productsToDisplay.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}"> 
            <h3>${product.name}</h3>
            <p>UGX ${product.price.toLocaleString()}</p>
            <button onclick="addToCart(${product.id})">Add to Cart</button>
        `;
        container.appendChild(productCard);
    });
}

// 4. ADD TO CART LOGIC
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existing = cart.find(item => item.id === productId);
    
    if (existing) {
        existing.quantity = (existing.quantity || 0) + 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCounter();
    alert(product.name + " added to cart!");
}

// 5. UPDATE NAV COUNTER (Works on all pages)
function updateCartCounter() {
    const counter = document.getElementById('cart-counter');
    if (counter) {
        const totalItems = cart.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
        counter.innerText = `Cart (${totalItems})`;
    }
}

// 6. SEARCH LOGIC
function searchProducts() {
    const searchBar = document.getElementById('search-bar');
    if (!searchBar) return;
    const term = searchBar.value.toLowerCase();
    const filtered = products.filter(p => p.name.toLowerCase().includes(term));
    displayProducts(filtered);
}

// 7. CART PAGE: Display Items
function displayCartItems() {
    const cartContainer = document.getElementById('cart-container');
    const totalElement = document.getElementById('total-price');
    if (!cartContainer) return;

    cartContainer.innerHTML = ''; 
    let grandTotal = 0;

    if (cart.length === 0) {
        cartContainer.innerHTML = "<h3>Your cart is empty.</h3>";
    }

    cart.forEach((item, index) => {
        const qty = Number(item.quantity) || 1;
        const itemTotal = item.price * qty;
        grandTotal += itemTotal;

        const itemDiv = document.createElement('div');
        itemDiv.classList.add('cart-item'); // Uses your CSS class
        itemDiv.innerHTML = `
            <div><strong>${item.name}</strong> (x${qty})</div>
            <div>
                UGX ${itemTotal.toLocaleString()}
                <button onclick="removeItem(${index})">Remove</button>
            </div>
        `;
        cartContainer.appendChild(itemDiv);
    });

    if (totalElement) totalElement.innerText = `Total: UGX ${grandTotal.toLocaleString()}`;
}

function removeItem(index) {
    if (cart[index].quantity > 1) {
        cart[index].quantity -= 1;
    } else {
        cart.splice(index, 1);
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCartItems();
    updateCartCounter();
}

// 8. CHECKOUT LOGIC (With Error Handling & Success Redirect)
function setupCheckout() {
    const totalElement = document.getElementById('checkout-total');
    const checkoutForm = document.getElementById('checkout-form');
    if (!checkoutForm) return;

    const grandTotal = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 0)), 0);
    if (totalElement) totalElement.innerText = `Total to Pay: UGX ${grandTotal.toLocaleString()}`;

    checkoutForm.addEventListener('submit', function(event) {
        event.preventDefault();
        try {
            if (cart.length === 0) {
                throw new Error("Cannot place order with an empty cart!");
            }

            // Success Action
            localStorage.removeItem('cart'); // Wipe the cart
            window.location.href = 'success.html'; // Go to success page

        } catch (error) {
            alert("Checkout Error: " + error.message);
        }
    });
}

// 9. THE "SMART" INITIALIZER
function init() {
    updateCartCounter();

    if (document.getElementById('product-container')) {
        displayProducts();
    }
    
    if (document.getElementById('cart-container')) {
        displayCartItems();
    }

    if (document.getElementById('checkout-form')) {
        setupCheckout();
    }
}

// Fire it up!
init();