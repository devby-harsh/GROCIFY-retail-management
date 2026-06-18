const API_BASE = '/api';

const fetchCartItems = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    try {
        const res = await fetch(`${API_BASE}/cart`, {
            headers: { 'Authorization': `Bearer ${user.token}` }
        });
        const cartItems = await res.json();
        const cartContainer = document.getElementById('cart-items');
        const cartTotal = document.getElementById('cart-total');
        const totalPriceEl = document.getElementById('total-price');
        
        cartContainer.innerHTML = '';
        let total = 0;

        if (!Array.isArray(cartItems) || cartItems.length === 0) {
            cartContainer.innerHTML = '<p style="text-align: center; color: var(--text-muted); padding: 4rem; font-size: 1.1rem;">Your basket is currently empty. <a href="dashboard.html" style="color: var(--primary); font-weight: 700; text-decoration: underline;">Discover our selection</a></p>';
            if (cartTotal) cartTotal.style.display = 'none';
        } else {
            const table = document.createElement('table');
            table.innerHTML = `
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Subtotal</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody id="cart-table-body"></tbody>
            `;
            cartContainer.appendChild(table);
            const tbody = document.getElementById('cart-table-body');

            cartItems.forEach(item => {
                const subtotal = item.price * item.quantity;
                total += subtotal;
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td style="font-weight: 600; color: var(--primary);">${item.name}</td>
                    <td>₹${item.price}</td>
                    <td>${item.quantity}</td>
                    <td style="font-weight: 600;">₹${subtotal.toFixed(2)}</td>
                    <td>
                        <button onclick="handleRemoveFromCart(${item.product_id})" class="btn" style="background: rgba(255, 77, 77, 0.1); color: #ff4d4d; padding: 0.6rem 1.2rem; font-size: 0.8rem; border-radius: 10px;">
                            <i class="fas fa-trash"></i> Remove
                        </button>
                    </td>
                `;
                tbody.appendChild(row);
            });

            if (totalPriceEl) totalPriceEl.innerText = `₹${total.toFixed(2)}`;
            if (cartTotal) cartTotal.style.display = 'block';
        }
        
        if (typeof updateCartCount === 'function') updateCartCount();
    } catch (err) {
        console.error(err);
    }
};

const handleRemoveFromCart = async (productId) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return;

    try {
        const res = await fetch(`${API_BASE}/cart/${productId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${user.token}` }
        });
        if (res.ok) {
            fetchCartItems();
        }
    } catch (err) {
        console.error(err);
    }
};

const handlePlaceOrder = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return;

    try {
        const res = await fetch(`${API_BASE}/orders`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${user.token}` }
        });
        const data = await res.json();
        if (res.ok) {
            alert('Your order has been received! Our curators are now preparing your selections. Order Reference: ' + (data.order_id || 'GRC-' + Date.now()));
            window.location.href = 'dashboard.html';
        } else {
            alert(data.message || 'There was an issue processing your order.');
        }
    } catch (err) {
        console.error(err);
        alert('Connectivity issue. Your order could not be placed.');
    }
};

document.addEventListener('DOMContentLoaded', () => {
    fetchCartItems();
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) checkoutBtn.addEventListener('click', handlePlaceOrder);
});
