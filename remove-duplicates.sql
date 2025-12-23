-- Remove duplicate categories and brands

-- Keep only the first (lowest ID) category for each name
DELETE FROM categories WHERE category_id IN (
    SELECT category_id FROM (
        SELECT MAX(category_id) as category_id 
        FROM categories 
        GROUP BY name 
        HAVING COUNT(*) > 1
    ) as duplicates
);

-- Keep only the first (lowest ID) brand for each name
DELETE FROM brands WHERE brand_id IN (
    SELECT brand_id FROM (
        SELECT MAX(brand_id) as brand_id 
        FROM brands 
        GROUP BY name 
        HAVING COUNT(*) > 1
    ) as duplicates
);

-- Verify results
SELECT 'Categories' as type, COUNT(*) as total FROM categories
UNION ALL
SELECT 'Brands' as type, COUNT(*) as total FROM brands;

SELECT 'Final Categories:' as info;
SELECT * FROM categories ORDER BY category_id;

SELECT 'Final Brands:' as info;
SELECT * FROM brands ORDER BY brand_id;
