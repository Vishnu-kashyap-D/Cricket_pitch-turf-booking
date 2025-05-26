# Cricket Pitch/Nets Booking System

A comprehensive web application for managing cricket pitch and nets bookings. This system allows customers to book cricket pitches, make payments, and administrators to manage pitches, branches, employees, and view bookings.

## Features

- Customer registration and login
- Pitch listing and availability status
- Booking system with time slot selection
- Payment integration (simulated gateway)
- Admin panel for managing pitches, branches, and employees
- Booking management and statistics dashboard

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v8 or higher)
- npm (Node Package Manager)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd cricket-pitch-booking
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following content:
```
PORT=3000
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=cricket_booking
JWT_SECRET=your_jwt_secret_key
PAYMENT_GATEWAY_KEY=your_payment_gateway_key
```

4. Set up the database:
- Create a MySQL database named `cricket_booking`
- Import the schema from `database.sql`

## Running the Application

1. Start the server:
```bash
npm start
```

2. For development with auto-reload:
```bash
npm run dev
```

The server will start on http://localhost:3000

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register a new customer
- POST `/api/auth/login` - Customer login

### Pitches
- GET `/api/pitches` - Get all available pitches
- GET `/api/pitches/availability/:pitchId/:date` - Get pitch availability for a date

### Bookings
- POST `/api/bookings` - Create a new booking
- GET `/api/bookings/my-bookings` - Get user's bookings
- PUT `/api/bookings/cancel/:bookingId` - Cancel a booking

### Payments
- POST `/api/payments/process/:bookingId` - Process payment for a booking
- GET `/api/payments/:bookingId` - Get payment details

### Admin Routes
- GET `/api/admin/bookings` - Get all bookings (admin only)
- POST `/api/admin/pitches` - Add a new pitch
- PUT `/api/admin/pitches/:pitchId` - Update pitch status
- POST `/api/admin/branches` - Add a new branch
- POST `/api/admin/employees` - Add a new employee
- GET `/api/admin/dashboard` - Get dashboard statistics

## Database Schema

The application uses the following main tables:
- customers
- pitches
- bookings
- payments
- branches
- employees

For detailed schema information, refer to `database.sql`

## Security

- JWT-based authentication
- Password hashing using bcrypt
- Input validation and sanitization
- Protected admin routes

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request 