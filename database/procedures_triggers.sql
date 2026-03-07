-- GROCIFY - Triggers and Procedures for DBMS Project
USE grocify;

-- 1. Trigger to automatically reduce product stock after a sale item is added
DELIMITER //
CREATE TRIGGER after_sale_item_insert
AFTER INSERT ON sale_items
FOR EACH ROW
BEGIN
    UPDATE products 
    SET stock_quantity = stock_quantity - NEW.quantity
    WHERE product_id = NEW.product_id;
END;
//
DELIMITER ;

-- 2. Trigger to prevent sale if stock is insufficient
DELIMITER //
CREATE TRIGGER before_sale_item_insert
BEFORE INSERT ON sale_items
FOR EACH ROW
BEGIN
    DECLARE current_stock INT;
    SELECT stock_quantity INTO current_stock FROM products WHERE product_id = NEW.product_id;
    
    IF current_stock < NEW.quantity THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Insufficient stock for the product';
    END IF;
END;
//
DELIMITER ;

-- 3. Stored Procedure to safely create a sale transaction
-- This procedure will be called from the backend to insert into 'sales' and then return the ID.
-- The sale items will then be inserted individually (which will trigger the stock update).
DELIMITER //
CREATE PROCEDURE CreateSale(
    IN p_user_id INT,
    IN p_total_amount DECIMAL(10, 2),
    IN p_payment_method VARCHAR(20),
    OUT p_sale_id INT
)
BEGIN
    INSERT INTO sales (user_id, total_amount, payment_method) 
    VALUES (p_user_id, p_total_amount, p_payment_method);
    
    SET p_sale_id = LAST_INSERT_ID();
END;
//
DELIMITER ;

-- 4. View for Sales Summary (Bonus for academic correctness)
CREATE VIEW view_sales_summary AS
SELECT 
    s.sale_id,
    s.sale_date,
    u.full_name AS staff_name,
    s.total_amount,
    s.payment_method
FROM sales s
JOIN users u ON s.user_id = u.user_id
ORDER BY s.sale_date DESC;

-- 5. View for Low Stock Alerts
CREATE VIEW view_low_stock AS
SELECT 
    p.product_id,
    p.product_name,
    p.stock_quantity,
    p.min_stock_level,
    c.category_name,
    supp.supplier_name
FROM products p
JOIN categories c ON p.category_id = c.category_id
JOIN suppliers supp ON p.supplier_id = supp.supplier_id
WHERE p.stock_quantity <= p.min_stock_level;
