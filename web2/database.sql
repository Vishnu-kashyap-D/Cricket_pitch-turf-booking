-- Create database
CREATE DATABASE IF NOT EXISTS cricket_booking;
USE cricket_booking;

-- Customer table
CREATE TABLE customers (
    customer_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email_id VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(15) NOT NULL,
    address TEXT,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Branch table
CREATE TABLE branches (
    branch_id INT PRIMARY KEY AUTO_INCREMENT,
    location VARCHAR(255) NOT NULL,
    contact_number1 VARCHAR(15),
    contact_number2 VARCHAR(15)
);

-- Employee table
CREATE TABLE employees (
    employee_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    branch_id INT,
    position VARCHAR(50) NOT NULL,
    salary DECIMAL(10,2),
    FOREIGN KEY (branch_id) REFERENCES branches(branch_id)
);

-- Pitch table
CREATE TABLE pitches (
    pitch_id INT PRIMARY KEY AUTO_INCREMENT,
    pitch_type VARCHAR(50) NOT NULL,
    club VARCHAR(100),
    pitch_no VARCHAR(20) NOT NULL,
    books_per_hour INT NOT NULL,
    status ENUM('Available', 'Not Available') DEFAULT 'Available',
    price_per_hour DECIMAL(10,2) NOT NULL,
    branch_id INT,
    FOREIGN KEY (branch_id) REFERENCES branches(branch_id)
);

-- Booking table
CREATE TABLE bookings (
    booking_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT,
    pitch_id INT,
    entry_time DATETIME NOT NULL,
    exit_time DATETIME NOT NULL,
    booking_status ENUM('Pending', 'Confirmed', 'Cancelled') DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
    FOREIGN KEY (pitch_id) REFERENCES pitches(pitch_id)
);

-- Payment table
CREATE TABLE payments (
    payment_id INT PRIMARY KEY AUTO_INCREMENT,
    booking_id INT,
    amount DECIMAL(10,2) NOT NULL,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    payment_mode VARCHAR(50) NOT NULL,
    payment_status ENUM('Pending', 'Completed', 'Failed') DEFAULT 'Pending',
    transaction_id VARCHAR(100),
    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id)
);

-- Create indexes for better performance
CREATE INDEX idx_customer_email ON customers(email_id);
CREATE INDEX idx_booking_dates ON bookings(entry_time, exit_time);
CREATE INDEX idx_pitch_status ON pitches(status); 