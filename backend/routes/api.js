const express = require('express');
const router = express.Router();
const db = require('../config/db');

// --- Products CRUD ---
router.get('/products', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT p.*, c.category_name, s.supplier_name 
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.category_id
            LEFT JOIN suppliers s ON p.supplier_id = s.supplier_id
            ORDER BY p.product_name ASC
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/products', async (req, res) => {
    const { category_id, supplier_id, product_name, sku, description, purchase_price, sale_price, stock_quantity, min_stock_level } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO products (category_id, supplier_id, product_name, sku, description, purchase_price, sale_price, stock_quantity, min_stock_level) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [category_id, supplier_id, product_name, sku, description, purchase_price, sale_price, stock_quantity, min_stock_level]
        );
        res.status(201).json({ id: result.insertId, message: 'Product created successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/products/:id', async (req, res) => {
    const { category_id, supplier_id, product_name, sku, description, purchase_price, sale_price, stock_quantity, min_stock_level } = req.body;
    try {
        await db.query(
            'UPDATE products SET category_id=?, supplier_id=?, product_name=?, sku=?, description=?, purchase_price=?, sale_price=?, stock_quantity=?, min_stock_level=? WHERE product_id=?',
            [category_id, supplier_id, product_name, sku, description, purchase_price, sale_price, stock_quantity, min_stock_level, req.params.id]
        );
        res.json({ message: 'Product updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/products/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM products WHERE product_id=?', [req.params.id]);
        res.json({ message: 'Product deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Categories ---
router.get('/categories', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM categories ORDER BY category_name ASC');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/categories', async (req, res) => {
    const { category_name, description } = req.body;
    try {
        const [result] = await db.query('INSERT INTO categories (category_name, description) VALUES (?, ?)', [category_name, description]);
        res.status(201).json({ id: result.insertId, message: 'Category created successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Suppliers ---
router.get('/suppliers', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM suppliers ORDER BY supplier_name ASC');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/suppliers', async (req, res) => {
    const { supplier_name, contact_person, phone, email, address } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO suppliers (supplier_name, contact_person, phone, email, address) VALUES (?, ?, ?, ?, ?)',
            [supplier_name, contact_person, phone, email, address]
        );
        res.status(201).json({ id: result.insertId, message: 'Supplier created successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Sales ---
router.post('/sales', async (req, res) => {
    const { user_id, items, total_amount, payment_method } = req.body;
    // items: [{ product_id, quantity, unit_price }]
    
    let connection;
    try {
        connection = await db.getConnection();
        await connection.beginTransaction();

        // 1. Call stored procedure to create sale
        // Using direct SQL since mysql2 doesn't always support OUT params well in all setups
        const [saleResult] = await connection.query(
            'INSERT INTO sales (user_id, total_amount, payment_method) VALUES (?, ?, ?)',
            [user_id || 1, total_amount, payment_method || 'cash']
        );
        const saleId = saleResult.insertId;

        // 2. Insert sale items
        for (const item of items) {
            const subtotal = item.quantity * item.unit_price;
            await connection.query(
                'INSERT INTO sale_items (sale_id, product_id, quantity, unit_price, subtotal) VALUES (?, ?, ?, ?, ?)',
                [saleId, item.product_id, item.quantity, item.unit_price, subtotal]
            );
        }

        await connection.commit();
        res.status(201).json({ id: saleId, message: 'Sale completed successfully' });
    } catch (err) {
        if (connection) await connection.rollback();
        res.status(500).json({ error: err.message });
    } finally {
        if (connection) connection.release();
    }
});

// --- Reports ---
router.get('/reports/low-stock', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM view_low_stock');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/reports/sales-summary', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM view_sales_summary');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/dashboard/stats', async (req, res) => {
    try {
        const [total_products] = await db.query('SELECT COUNT(*) as count FROM products');
        const [total_sales] = await db.query('SELECT SUM(total_amount) as total FROM sales');
        const [low_stock] = await db.query('SELECT COUNT(*) as count FROM view_low_stock');
        const [recent_sales] = await db.query('SELECT * FROM view_sales_summary LIMIT 5');
        
        res.json({
            total_products: total_products[0].count,
            total_sales: total_sales[0].total || 0,
            low_stock_count: low_stock[0].count,
            recent_sales: recent_sales
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
