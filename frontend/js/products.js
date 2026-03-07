const API_BASE = '/api';

const fetchProducts = async () => {
    try {
        const res = await fetch(`${API_BASE}/products`);
        const products = await res.json();
        const productList = document.getElementById('product-list');
        productList.innerHTML = '';

        if (!products.length) {
            productList.innerHTML = '<div class="loading-state"><p>Our artisans are currently replenishing the stocks. Please check back later.</p></div>';
            return;
        }

        products.forEach(p => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <div class="product-img-wrapper">
                    <img src="${p.image_url || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80'}" alt="${p.name}">
                </div>
                <div class="product-info">
                    <span class="product-category">${p.category_name}</span>
                    <h3 class="product-name">${p.name}</h3>
                    <div class="product-footer">
                        <span class="product-price">₹${p.price}</span>
                        <button onclick="handleAddToCart(${p.product_id})" class="add-btn" title="Add to Cart">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </div>
            `;
            productList.appendChild(card);
        });
    } catch (err) {
        console.error(err);
        document.getElementById('product-list').innerHTML = '<div class="loading-state"><p>There was an error in loading our selection.</p></div>';
    }
};

const handleAddToCart = async (productId) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        alert('Please login to add items to your basket.');
        window.location.href = 'login.html';
        return;
    }

    try {
        const res = await fetch(`${API_BASE}/cart`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            },
            body: JSON.stringify({ product_id: productId, quantity: 1 })
        });
        const data = await res.json();
        if (res.ok) {
            updateCartCount();
            // Could add a toast or toast animation here
            const addBtn = event.currentTarget;
            addBtn.innerHTML = '<i class="fas fa-check"></i>';
            setTimeout(() => {
                addBtn.innerHTML = '<i class="fas fa-plus"></i>';
            }, 1000);
        } else {
            alert(data.message || 'Error adding to cart');
        }
    } catch (err) {
        console.error(err);
    }
};

const updateCartCount = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return;

    try {
        const res = await fetch(`${API_BASE}/cart`, {
            headers: { 'Authorization': `Bearer ${user.token}` }
        });
        const cartItems = await res.json();
        if (Array.isArray(cartItems)) {
            const count = cartItems.reduce((acc, item) => acc + item.quantity, 0);
            const cartCountElement = document.getElementById('cart-count');
            if (cartCountElement) cartCountElement.innerText = count;
        }
    } catch (err) {
        console.error(err);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
    updateCartCount();
});
