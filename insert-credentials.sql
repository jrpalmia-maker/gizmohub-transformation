-- Insert Default Credentials into Gizmohub Database

-- Default Admin Account
INSERT INTO admins (full_name, username, password) VALUES
('Admin User', 'admin', 'admin123');-- Default Customer Accounts
INSERT INTO customers (first_name, last_name, email, password, phone) VALUES 
('John', 'Doe', 'john@example.com', 'password123', '555-1234');

INSERT INTO customers (first_name, last_name, email, password, phone) VALUES 
('Jane', 'Smith', 'jane@example.com', 'password123', '555-5678');
