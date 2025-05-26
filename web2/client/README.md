# Cricket Booking System - Frontend

This is the frontend application for the Cricket Booking System, built with React and Material-UI.

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

The application will be available at http://localhost:3000

## Features

- User authentication (Login/Register)
- View available cricket pitches
- Book cricket pitches
- View and manage bookings
- Responsive design using Material-UI

## Project Structure

```
src/
  ├── components/     # Reusable components
  ├── pages/         # Page components
  ├── App.js         # Main application component
  └── index.js       # Application entry point
```

## API Integration

The frontend connects to the backend API running at http://localhost:5000. Make sure the backend server is running before using the application.

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App

## Dependencies

- React
- React Router DOM
- Material-UI
- Axios
- Emotion (for Material-UI styling) 