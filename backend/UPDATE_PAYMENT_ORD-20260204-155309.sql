-- SQL Query untuk Update Payment ORD-20260204-155309
-- Jalankan di PostgreSQL production database

-- Step 1: Cari order dan payment
SELECT 
    o.id as order_id,
    o.order_number,
    o.status as order_status,
    p.id as payment_id,
    p.status as payment_status,
    p.va_number
FROM orders o
LEFT JOIN payments p ON p.order_id = o.id
WHERE o.order_number = 'ORD-20260204-155309';

-- Step 2: Update payment ke success
UPDATE payments 
SET 
    status = 'success',
    paid_at = NOW()
WHERE va_number = '9881988123522890';

-- Step 3: Update order ke paid
UPDATE orders 
SET status = 'paid'
WHERE order_number = 'ORD-20260204-155309';

-- Step 4: Verify hasil
SELECT 
    o.order_number,
    o.status as order_status,
    o.total_price,
    p.status as payment_status,
    p.paid_at,
    p.va_number
FROM orders o
LEFT JOIN payments p ON p.order_id = o.id
WHERE o.order_number = 'ORD-20260204-155309';
