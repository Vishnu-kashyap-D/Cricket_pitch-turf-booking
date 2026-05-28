# Cricket Pitch Booking System

A comprehensive web-based application for managing cricket pitch and nets bookings. This system allows users to book cricket pitches, view their bookings, manage profiles, and includes both user and admin interfaces for complete pitch management.

## 🏏 Features

### User Features
- **User Registration & Authentication**: Secure user registration with email verification
- **Pitch Booking**: Book available cricket pitches and nets with specific time slots
- **Booking Management**: View, modify, and cancel personal bookings
- **Booking History**: Complete history of all past bookings
- **Profile Management**: Update personal information and preferences
- **Real-time Availability**: Check pitch availability in real-time

### Admin Features
- **Admin Dashboard**: Comprehensive dashboard for pitch management
- **Booking Management**: View and manage all user bookings
- **Pitch Management**: Add, update, and manage pitch availability and rates
- **User Management**: Manage user accounts and permissions
- **Analytics**: View booking statistics and reports
- **Branch Management**: Manage multiple cricket facility branches

## 🛠️ Tech Stack

### Frontend
- **HTML5**: Semantic markup for accessibility
- **CSS3**: Modern styling with responsive design
- **JavaScript (Vanilla)**: Client-side functionality
- **Bootstrap 5**: Responsive UI components and grid system

### Backend
- **Node.js**: Server-side JavaScript runtime
- **Express.js**: Web application framework
- **MySQL**: Relational database management system

### Authentication & Security
- **JWT (JSON Web Tokens)**: Secure authentication
- **bcryptjs**: Password hashing and verification
- **CORS**: Cross-origin resource sharing

## 📋 Prerequisites

Before running the project, ensure you have the following installed:

- **Node.js** (v14 or higher)
- **MySQL Server** (v8.0 or higher)
- **npm** (Node Package Manager)

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd cricket-pitch-booking
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory with the following variables:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=cricket_booking_system
JWT_SECRET=your_jwt_secret_key
PORT=3000
```

### 4. Database Setup

#### Option A: Using MySQL Command Line
```bash
mysql -u root -p
```

Then run the following commands:
```sql
CREATE DATABASE cricket_booking_system;
USE cricket_booking_system;
```

#### Option B: Using the provided SQL files
```bash
mysql -u root -p < setup.sql
```

### 5. Database Schema

The system uses the following database structure:

#### Customer Table
```sql
CREATE TABLE Customer (
    Customer_ID INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(100) NOT NULL,
    Email_ID VARCHAR(100) UNIQUE NOT NULL,
    Password VARCHAR(255) NOT NULL,
    Phone VARCHAR(15),
    Address TEXT
);
```

#### Branch Table
```sql
CREATE TABLE Branch (
    Branch_ID INT PRIMARY KEY AUTO_INCREMENT,
    Location VARCHAR(100) NOT NULL,
    Contact_Number VARCHAR(15),
    Contact_Number_2 VARCHAR(15)
);
```

#### Employee Table
```sql
CREATE TABLE Employee (
    Employee_ID INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(100) NOT NULL,
    Branch_ID INT,
    Position VARCHAR(50),
    Salary DECIMAL(10,2),
    FOREIGN KEY (Branch_ID) REFERENCES Branch(Branch_ID)
);
```

#### Pitch Table
```sql
CREATE TABLE Pitch (
    Pitch_ID INT PRIMARY KEY AUTO_INCREMENT,
    Pitch_type VARCHAR(50) NOT NULL,
    Club VARCHAR(100),
    Pitch_no VARCHAR(20),
    Books_per_hour DECIMAL(8,2),
    Status ENUM('Available', 'Not Available') DEFAULT 'Available'
);
```

#### Bookings Table
```sql
CREATE TABLE Bookings (
    Booking_ID INT PRIMARY KEY AUTO_INCREMENT,
    Customer_ID INT,
    Pitch_ID INT,
    Entry_time DATETIME NOT NULL,
    Exit_time DATETIME NOT NULL,
    Booking_Date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (Customer_ID) REFERENCES Customer(Customer_ID),
    FOREIGN KEY (Pitch_ID) REFERENCES Pitch(Pitch_ID)
);
```

#### Payment Table
```sql
CREATE TABLE Payment (
    Payment_ID INT PRIMARY KEY AUTO_INCREMENT,
    Booking_ID INT,
    Amount DECIMAL(10,2) NOT NULL,
    Payment_Date DATETIME DEFAULT CURRENT_TIMESTAMP,
    Payment_Mode ENUM('Cash', 'Card', 'Online', 'UPI') NOT NULL,
    FOREIGN KEY (Booking_ID) REFERENCES Bookings(Booking_ID)
);
```

### 6. Sample Data

The system includes sample data for testing:

#### Sample Branches
```sql
INSERT INTO Branch (Location, Contact_Number, Contact_Number_2) VALUES
('Mumbai Central', '022-12345678', '022-87654321'),
('Delhi NCR', '011-23456789', '011-98765432'),
('Bangalore', '080-34567890', '080-09876543');
```

#### Sample Customers
```sql
INSERT INTO Customer (Name, Email_ID, Phone, Address) VALUES
('Rohit Mehta', 'rohit.mehta@email.com', '+91-9876543210', 'Andheri West, Mumbai'),
('Virat Singh', 'virat.singh@email.com', '+91-8765432109', 'CP, New Delhi'),
('MS Dhoni', 'ms.dhoni@email.com', '+91-7654321098', 'Ranchi, Jharkhand');
```

#### Sample Pitches
```sql
INSERT INTO Pitch (Pitch_type, Club, Pitch_no, Books_per_hour, Status) VALUES
('Cricket Net', 'Mumbai Cricket Club', 'NET-001', 500.00, 'Available'),
('Full Pitch', 'Mumbai Cricket Club', 'PITCH-001', 2000.00, 'Available'),
('Practice Net', 'Delhi Sports Club', 'NET-002', 400.00, 'Available'),
('Turf Pitch', 'Bangalore Cricket Academy', 'TURF-001', 1500.00, 'Not Available');
```

### 7. Start the Application
```bash
npm start
```

The application will be available at `http://localhost:3000`

## 📁 Project Structure

```
cricket-pitch-booking/
├── public/
│   ├── index.html          # Main user interface
│   ├── script.js           # Client-side JavaScript
│   ├── styles.css          # Styling
│   ├── admin.html          # Admin dashboard
│   ├── admin.js            # Admin functionality
│   └── vishnu.jpg          # Assets
├── server.js               # Main server file
├── server-frontend.js      # Frontend server configuration
├── database.sql            # Database schema
├── setup.sql              # Database setup script
├── create_tables.sql      # Table creation scripts
├── database commands.txt   # Database commands log
├── package.json           # Project dependencies
├── package-lock.json      # Dependency lock file
└── README.md              # Project documentation
```

## 🔌 API Endpoints

### Authentication
- `POST /api/register` - Register a new user
- `POST /api/login` - User login
- `GET /api/user/profile` - Get user profile

### Bookings
- `GET /api/pitches` - Get all available pitches
- `GET /api/branches` - Get all branches
- `POST /api/bookings` - Create a new booking
- `GET /api/bookings/user` - Get user's bookings
- `POST /api/bookings/:id/cancel` - Cancel a booking

### Admin
- `GET /api/auth/check-admin` - Check admin status
- `GET /api/admin/bookings` - Get all bookings
- `GET /api/admin/users` - Get all users
- `POST /api/admin/pitches` - Add new pitch
- `PUT /api/admin/pitches/:id` - Update pitch details

## 🔒 Security Features

- **Password Hashing**: Using bcryptjs for secure password storage
- **JWT Authentication**: Secure token-based authentication
- **Protected Routes**: API endpoints protected with middleware
- **Input Validation**: Server-side validation for all inputs
- **SQL Injection Prevention**: Parameterized queries
- **CORS Configuration**: Proper cross-origin resource sharing

## 📊 Database Performance

The database includes optimized indexes for better performance:

```sql
CREATE INDEX idx_customer_email ON Customer(Email_ID);
CREATE INDEX idx_booking_date ON Bookings(Entry_time);
CREATE INDEX idx_payment_date ON Payment(Payment_Date);
```

## 🧪 Testing

### Database Testing Commands

```bash
# Connect to MySQL
mysql -u root -p

# Use the database
USE cricket_booking_system;

# View all tables
SHOW TABLES;

# Check customer data
SELECT * FROM Customer;

# Check bookings
SELECT * FROM Bookings;

# Check pitch availability
SELECT * FROM Pitch WHERE Status = 'Available';
```

## 🚀 Deployment

### Local Development
```bash
npm run dev  # Uses nodemon for auto-restart
```

### Production
```bash
npm start    # Uses node server.js
```

## 📝 Dependencies

### Production Dependencies
- `bcryptjs`: ^2.4.3 - Password hashing
- `cors`: ^2.8.5 - Cross-origin resource sharing
- `dotenv`: ^16.5.0 - Environment variables
- `express`: ^4.21.2 - Web framework
- `jsonwebtoken`: ^9.0.2 - JWT authentication
- `mysql2`: ^3.14.1 - MySQL database driver

### Development Dependencies
- `nodemon`: ^3.0.2 - Auto-restart development server

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Email: support@cricketpitch.com
- Create an issue in the repository
- Check the documentation in this README

## 🙏 Acknowledgments

- **Bootstrap** for the responsive UI components
- **Express.js** team for the robust backend framework
- **MySQL** team for the reliable database system
- **JWT** for secure authentication implementation

## 📈 Future Enhancements

- [ ] Mobile app development
- [ ] Payment gateway integration
- [ ] Real-time notifications
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Email notifications
- [ ] SMS integration
- [ ] Weather integration for outdoor pitches

## 🔧 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Ensure MySQL is running
   - Check database credentials in `.env` file
   - Verify database exists

2. **Port Already in Use**
   - Change PORT in `.env` file
   - Kill existing process on port 3000

3. **Module Not Found**
   - Run `npm install` to install dependencies
   - Check `package.json` for correct dependencies

4. **JWT Token Issues**
   - Ensure JWT_SECRET is set in `.env`
   - Check token expiration

## 📞 Contact

- **Developer**: Vishnu
- **Email**: vishnu@gmail.com
- **Phone**: 6362991486
- **Location**: Yalahanka

---

**Last Updated**: May 2025
**Version**: 1.0.0 