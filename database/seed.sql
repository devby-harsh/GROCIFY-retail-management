-- GROCIFY - Seed Data for DBMS Project
USE grocify;

-- 1. Users (password is 'admin123' for both)
INSERT INTO users (full_name, username, password, role) VALUES 
('System Admin', 'admin', 'admin123', 'admin'),
('John Doe', 'staff1', 'staff123', 'staff');

-- 2. Categories
INSERT INTO categories (category_name, description) VALUES 
('Fresh Produce', 'Fruits and Vegetables'),
('Dairy & Eggs', 'Milk, butter, cheese, eggs'),
('Beverages', 'Soft drinks, water, juice, tea, coffee'),
('Snacks', 'Chips, biscuits, popcorn, nuts'),
('Meat & Poultry', 'Chicken, beef, mutton, seafood'),
('Bakery', 'Bread, cakes, pastries'),
('Pantry Staples', 'Rice, flour, sugar, oil, spices');

-- 3. Suppliers
INSERT INTO suppliers (supplier_name, contact_person, phone, email, address) VALUES 
('Green Farms Ltd', 'Alice Green', '+1234567890', 'alice@greenfarms.com', '123 Farm Road, Greenfield'),
('Dairy Delight', 'Bob Miller', '+1234567891', 'bob@dairydelight.com', '456 Milk Way, Cream City'),
('Meat Masters', 'Charlie Brown', '+1234567892', 'charlie@meatmasters.com', '789 Butcher Street, Meat Town'),
('Global Pantry', 'David Wilson', '+1234567893', 'david@globalpantry.com', '101 Spice Avenue, Flavor City');

-- 4. Products
INSERT INTO products (category_id, supplier_id, product_name, sku, description, purchase_price, sale_price, stock_quantity, min_stock_level) VALUES 
(1, 1, 'Organic Apples', 'FR001', 'Fresh organic red apples', 1.20, 2.50, 100, 20),
(1, 1, 'Bananas (Bunch)', 'FR002', 'Sweet yellow bananas', 0.80, 1.50, 150, 30),
(2, 2, 'Full Cream Milk (1L)', 'DR001', 'Pasteurized full cream milk', 1.10, 1.80, 80, 15),
(2, 2, 'Large White Eggs (12pk)', 'DR002', 'Farm fresh white eggs', 2.00, 3.50, 50, 10),
(3, 4, 'Sparkling Water (500ml)', 'BV001', 'Natural sparkling mineral water', 0.50, 1.20, 200, 40),
(5, 3, 'Chicken Breast (500g)', 'MT001', 'Skinless boneless chicken breast', 4.50, 7.50, 40, 10),
(7, 4, 'Basmati Rice (5kg)', 'PS001', 'Long grain premium basmati rice', 8.00, 12.00, 30, 5),
(7, 4, 'Sunflower Oil (2L)', 'PS002', 'Pure refined sunflower oil', 3.50, 6.00, 25, 8);

-- 5. Sales
INSERT INTO sales (user_id, total_amount, payment_method) VALUES 
(2, 12.50, 'cash'),
(2, 25.80, 'card'),
(1, 15.00, 'online');

-- 6. Sale Items
INSERT INTO sale_items (sale_id, product_id, quantity, unit_price, subtotal) VALUES 
(1, 1, 2, 2.50, 5.00),
(1, 2, 5, 1.50, 7.50),
(2, 6, 2, 7.50, 15.00),
(2, 3, 6, 1.80, 10.80),
(3, 7, 1, 12.00, 12.00),
(3, 5, 2, 1.50, 3.00);
