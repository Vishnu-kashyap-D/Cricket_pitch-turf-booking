CREATE DATABASE IF NOT EXISTS cricket;
USE cricket;

CREATE TABLE IF NOT EXISTS Branch (
    Branch_ID INT PRIMARY KEY AUTO_INCREMENT,
    Location VARCHAR(100) NOT NULL,
    Contact_Number VARCHAR(15) NOT NULL,
    Contact_Number_2 VARCHAR(15)
);

CREATE TABLE IF NOT EXISTS Pitch (
    Pitch_ID INT PRIMARY KEY AUTO_INCREMENT,
    Branch_ID INT,
    Pitch_type VARCHAR(50) NOT NULL,
    Status ENUM('Available', 'Not Available') DEFAULT 'Available',
    Books_per_hour DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (Branch_ID) REFERENCES Branch(Branch_ID)
);

CREATE TABLE IF NOT EXISTS Customer (
    Customer_ID INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(100) NOT NULL,
    Email_ID VARCHAR(100) UNIQUE NOT NULL,
    Password VARCHAR(255) NOT NULL,
    Phone VARCHAR(15),
    Address TEXT
);

CREATE TABLE IF NOT EXISTS Bookings (
    Booking_ID INT PRIMARY KEY AUTO_INCREMENT,
    Customer_ID INT,
    Pitch_ID INT,
    Entry_time DATETIME NOT NULL,
    Exit_time DATETIME NOT NULL,
    FOREIGN KEY (Customer_ID) REFERENCES Customer(Customer_ID),
    FOREIGN KEY (Pitch_ID) REFERENCES Pitch(Pitch_ID)
); 