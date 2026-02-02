-- SQL Script to Add Test Payment Service
-- Run this directly in production database

-- Check if test-payment exists
SELECT * FROM services WHERE slug = 'test-payment';

-- If exists, update it
UPDATE services 
SET 
    name = 'Test Payment Service',
    description = 'Service untuk test pembayaran dengan nominal minimal Rp 5.000',
    category = 'test',
    price = 5000,
    duration_days = 1,
    features = '["Test Payment", "Minimal Amount", "Email Notification Test"]'
WHERE slug = 'test-payment';

-- If not exists, insert it
INSERT INTO services (name, slug, description, category, price, duration_days, features)
SELECT 
    'Test Payment Service',
    'test-payment',
    'Service untuk test pembayaran dengan nominal minimal Rp 5.000',
    'test',
    5000,
    1,
    '["Test Payment", "Minimal Amount", "Email Notification Test"]'
WHERE NOT EXISTS (
    SELECT 1 FROM services WHERE slug = 'test-payment'
);

-- Verify
SELECT * FROM services WHERE slug = 'test-payment';

-- Show all services
SELECT slug, name, price FROM services ORDER BY price;
