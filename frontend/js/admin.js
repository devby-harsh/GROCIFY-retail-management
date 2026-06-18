const API_BASE = '/api';

const checkAdmin = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'admin') {
        alert('Access denied. Administrator privileges required.');
        window.location.href = 'dashboard.html';  // Redirect to dashboard or login page
    }
};

const fetchAdminProducts = async () => {
    try {
        const res = await fetch(`${API_BASE}/products`);
        const products = await res.json();
        const productList = document.getElementById('product-admin-list');
        productList.innerHTML = '';

        if (!Array.isArray(products) || products.length === 0) {
            productList.innerHTML = '<p style="text-align: center; color: var(--text-muted); padding: 2rem;">No products found in the catalog.</p>';
            return;
        }

        const table = document.createElement('table');
        table.innerHTML = `
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Product Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody id="admin-product-table-body"></tbody>
        `;
        productList.appendChild(table);
        const tbody = document.getElementById('admin-product-table-body');

        products.forEach(p => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>#${p.product_id}</td>
                <td style="font-weight: 600; color: var(--primary);">${p.name}</td>
                <td><span class="status-badge" style="background: rgba(212, 175, 55, 0.1); color: var(--accent);">${p.category_name}</span></td>
                <td style="font-weight: 600;">₹${p.price}</td>
                <td>${p.stock} units</td>
                <td>
                    <div style="display: flex; gap: 0.5rem;">
                        <button onclick="openModal(${p.product_id})" class="btn" style="padding: 0.5rem; background: rgba(27, 67, 50, 0.1); color: var(--primary); border-radius: 8px;"><i class="fas fa-edit"></i></button>
                        <button onclick="handleDeleteProduct(${p.product_id})" class="btn" style="padding: 0.5rem; background: rgba(255, 77, 77, 0.1); color: #ff4d4d; border-radius: 8px;"><i class="fas fa-trash"></i></button>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (err) {
        console.error(err);
    }
};

const openModal = async (id = null) => {
    const modal = document.getElementById('product-modal');
    const title = document.getElementById('modal-title');
    const form = document.getElementById('product-form');
    
    form.reset();
    document.getElementById('product-id').value = id || '';
    title.innerText = id ? 'Edit Inventory Item' : 'Add New Product';
    
    if (id) {
        try {
            const res = await fetch(`${API_BASE}/products/${id}`);
            const p = await res.json();
            document.getElementById('p-name').value = p.name;
            document.getElementById('p-price').value = p.price;
            document.getElementById('p-stock').value = p.stock;
            document.getElementById('p-category').value = p.category_id;
            document.getElementById('p-image').value = p.image_url;
        } catch (err) {
            console.error(err);
        }
    }
    
    modal.style.display = 'flex';
};

const closeModal = () => {
    document.getElementById('product-modal').style.display = 'none';
};

const handleDeleteProduct = async (id) => {
    if (!confirm('Are you certain you wish to remove this exquisite item from the catalog?')) return;
    
    const user = JSON.parse(localStorage.getItem('user'));
    try {
        const res = await fetch(`${API_BASE}/products/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${user.token}` }
        });
        if (res.ok) {
            fetchAdminProducts();
        } else {
            alert('Could not remove the item. It might be part of existing orders.');
        }
    } catch (err) {
        console.error(err);
    }
};

const handleProductSubmit = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('user'));
    const id = document.getElementById('product-id').value;
    
    const data = {
        name: document.getElementById('p-name').value,
        price: document.getElementById('p-price').value,
        stock: document.getElementById('p-stock').value,
        category_id: document.getElementById('p-category').value,
        image_url: document.getElementById('p-image').value,
        description: 'Premium curated grocery item'
    };

    const method = id ? 'PUT' : 'POST';
    const url = id ? `${API_BASE}/products/${id}` : `${API_BASE}/products`;

    try {
        const res = await fetch(url, {
            method,
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}` 
            },
            body: JSON.stringify(data)
        });
        if (res.ok) {
            closeModal();
            fetchAdminProducts();
        } else {
            const errData = await res.json();
            alert(errData.message || 'Failed to save product details.');
        }
    } catch (err) {
        console.error(err);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    checkAdmin();
    fetchAdminProducts();
    
    const addProductBtn = document.getElementById('add-product-btn');
    if (addProductBtn) addProductBtn.addEventListener('click', () => openModal());
    
    const productForm = document.getElementById('product-form');
    if (productForm) productForm.addEventListener('submit', handleProductSubmit);
});
