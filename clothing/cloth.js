const products = [
    {
        id: 1,
        name: "Cotton T-Shirt",
        price: 499,
        image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80",
        description: "Comfortable cotton t-shirt for everyday wear."
    },
    {
        id: 2,
        name: "Denim Jeans",
        price: 1199,
        image: "https://images.unsplash.com/photo-1521577352947-9ffcb3b2b3d5?auto=format&fit=crop&w=400&q=80",
        description: "Classic blue denim jeans."
    },
    {
        id: 3,
        name: "Summer Dress",
        price: 899,
        image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
        description: "Floral printed summer dress."
    },
    {
        id: 4,
        name: "Leather Jacket",
        price: 2999,
        image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=400&q=80",
        description: "Trendy black leather jacket."
    }
];

let cart = [];

function renderProducts() {
    const productsSection = document.getElementById("products");
    productsSection.innerHTML = "";
    products.forEach(product => {
        const card = document.createElement("div");
        card.className = "product-card";
        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>₹${product.price}</p>
            <p>${product.description}</p>
            <button onclick="addToCart(${product.id})">Add to Cart</button>
        `;
        productsSection.appendChild(card);
    });
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const found = cart.find(item => item.id === productId);
    if(found) {
        found.qty += 1;
    } else {
        cart.push({...product, qty: 1});
    }
    updateCartCount();
}

function updateCartCount() {
    document.getElementById("cart-count").textContent = cart.reduce((sum, item) => sum + item.qty, 0);
}

document.getElementById("cart").addEventListener("click", () => {
    renderCartDetails();
    document.getElementById("cart-details").classList.remove("hidden");
});

document.getElementById("close-cart").addEventListener("click", () => {
    document.getElementById("cart-details").classList.add("hidden");
});

function renderCartDetails() {
    const cartItems = document.getElementById("cart-items");
    cartItems.innerHTML = "";
    if(cart.length === 0) {
        cartItems.innerHTML = "<li>Your cart is empty.</li>";
        return;
    }
    cart.forEach(item => {
        const li = document.createElement("li");
        li.innerHTML = `
            <span>${item.name} x ${item.qty}</span>
            <span>₹${item.price * item.qty}</span>
        `;
        cartItems.appendChild(li);
    });
}

renderProducts();
updateCartCount();