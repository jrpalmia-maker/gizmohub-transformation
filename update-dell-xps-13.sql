-- Update Dell XPS 13 with detailed specifications and pros/cons

UPDATE products SET
    specification = 'Processor: Intel Core Ultra 7 256V|Graphics: Intel Arc Graphics 140V|RAM: 16GB|Storage: 512GB SSD|Display: 13.4-inch, 2880x1800, 60Hz OLED|Panel: OLED Tandem|Dimensions: 0.58 x 11.6 x 7.8 inches|Weight: 2.6 lbs|Battery Life: 16h 38m|OS: Windows 11 Home|Wireless: Wi-Fi 7, Bluetooth 5.4|Ports: 2x Thunderbolt 4|Touch Screen: Yes',
    reasons_to_buy = 'Impressive battery life (16+ hours),Gorgeous tandem OLED display,Sleek and compact design,High-quality audio,Premium build quality',
    reasons_to_avoid = 'Lattice keyboard looks better than it works,Just two Thunderbolt 4 ports,No headphone jack,No mobile broadband option,Limited port connectivity'
WHERE product_id = 3 AND name = 'Dell XPS 13';
