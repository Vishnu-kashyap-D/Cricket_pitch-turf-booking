-- Insert sample branches
INSERT INTO branches (location, contact_number1, contact_number2) VALUES
('Koramangala Sports Complex', '080-23456789', '080-23456790'),
('Indiranagar Cricket Ground', '080-23456791', '080-23456792'),
('Whitefield Cricket Club', '080-23456793', '080-23456794'),
('Electronic City Sports Hub', '080-23456795', '080-23456796');

-- Insert sample pitches
INSERT INTO pitches (pitch_type, club, pitch_no, books_per_hour, status, price_per_hour, branch_id) VALUES
-- Koramangala Sports Complex
('Turf', 'Koramangala Cricket Club', 'K1', 2, 'Available', 1500.00, 1),
('Concrete', 'Koramangala Cricket Club', 'K2', 2, 'Available', 1000.00, 1),
('Mat', 'Koramangala Cricket Club', 'K3', 2, 'Available', 800.00, 1),
('Turf', 'Koramangala Cricket Club', 'K4', 2, 'Available', 1500.00, 1),

-- Indiranagar Cricket Ground
('Turf', 'Indiranagar Cricket Academy', 'I1', 2, 'Available', 1800.00, 2),
('Turf', 'Indiranagar Cricket Academy', 'I2', 2, 'Available', 1800.00, 2),
('Concrete', 'Indiranagar Cricket Academy', 'I3', 2, 'Available', 1200.00, 2),
('Mat', 'Indiranagar Cricket Academy', 'I4', 2, 'Available', 900.00, 2),

-- Whitefield Cricket Club
('Turf', 'Whitefield Cricket Club', 'W1', 2, 'Available', 2000.00, 3),
('Turf', 'Whitefield Cricket Club', 'W2', 2, 'Available', 2000.00, 3),
('Concrete', 'Whitefield Cricket Club', 'W3', 2, 'Available', 1500.00, 3),
('Mat', 'Whitefield Cricket Club', 'W4', 2, 'Available', 1000.00, 3),

-- Electronic City Sports Hub
('Turf', 'Electronic City Cricket Club', 'E1', 2, 'Available', 1600.00, 4),
('Turf', 'Electronic City Cricket Club', 'E2', 2, 'Available', 1600.00, 4),
('Concrete', 'Electronic City Cricket Club', 'E3', 2, 'Available', 1100.00, 4),
('Mat', 'Electronic City Cricket Club', 'E4', 2, 'Available', 850.00, 4);

-- Insert sample employees
INSERT INTO employees (name, branch_id, position, salary) VALUES
('Rahul Sharma', 1, 'Ground Manager', 45000.00),
('Priya Patel', 1, 'Receptionist', 25000.00),
('Vikram Singh', 2, 'Ground Manager', 45000.00),
('Ananya Reddy', 2, 'Receptionist', 25000.00),
('Mohammed Iqbal', 3, 'Ground Manager', 45000.00),
('Sneha Gupta', 3, 'Receptionist', 25000.00),
('Rajesh Kumar', 4, 'Ground Manager', 45000.00),
('Meera Joshi', 4, 'Receptionist', 25000.00);

-- Insert sample customers
INSERT INTO customers (name, email_id, phone, address, password) VALUES
('Arjun Verma', 'arjun@email.com', '9876543210', 'Koramangala, Bangalore', '$2a$10$X7UrH5QxX5QxX5QxX5QxX.'),
('Neha Singh', 'neha@email.com', '9876543211', 'Indiranagar, Bangalore', '$2a$10$X7UrH5QxX5QxX5QxX5QxX.'),
('Rahul Mehta', 'rahul@email.com', '9876543212', 'Whitefield, Bangalore', '$2a$10$X7UrH5QxX5QxX5QxX5QxX.'),
('Priya Patel', 'priya@email.com', '9876543213', 'Electronic City, Bangalore', '$2a$10$X7UrH5QxX5QxX5QxX5QxX.');

-- Insert sample bookings
INSERT INTO bookings (customer_id, pitch_id, entry_time, exit_time, booking_status) VALUES
(1, 1, '2024-03-20 10:00:00', '2024-03-20 11:00:00', 'Confirmed'),
(2, 5, '2024-03-20 14:00:00', '2024-03-20 15:00:00', 'Confirmed'),
(3, 9, '2024-03-20 16:00:00', '2024-03-20 17:00:00', 'Confirmed'),
(4, 13, '2024-03-20 18:00:00', '2024-03-20 19:00:00', 'Confirmed');

-- Insert sample payments
INSERT INTO payments (booking_id, amount, payment_mode, payment_status, transaction_id) VALUES
(1, 1500.00, 'Online', 'Completed', 'TXN123456'),
(2, 1800.00, 'Online', 'Completed', 'TXN123457'),
(3, 2000.00, 'Online', 'Completed', 'TXN123458'),
(4, 1600.00, 'Online', 'Completed', 'TXN123459'); 