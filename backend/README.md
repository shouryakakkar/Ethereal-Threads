# Ethereal Threads Backend

Backend server for the Ethereal Threads e-commerce platform.

## Features

- User authentication (login/register)
- Admin dashboard for managing contact messages
- Product management
- Contact form submission handling

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/ethereal-threads.git
cd ethereal-threads/backend
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
Create a `.env` file in the root directory with the following variables:
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=30d
```

4. Create admin user
```bash
npm run create-admin
```
This will create an admin user with the following credentials:
- Email: shourya@etherealthreads.com
- Password: EtherealAdmin@123

5. Start the server
```bash
npm run dev
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Contact Messages

- `POST /api/contact` - Submit a contact form (public)
- `GET /api/contact` - Get all contact messages (admin only)
- `PATCH /api/contact/:id/status` - Update message status (admin only)

### Products

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get a single product

## Admin Dashboard

The admin dashboard is accessible at `/admin` in the frontend application. You can use it to:

1. View all contact form submissions
2. Update the status of messages (new/read/replied)
3. View message details

## Security

- All admin routes are protected with JWT authentication
- Passwords are hashed using bcrypt
- Admin routes require the 'admin' role

## License

This project is licensed under the MIT License - see the LICENSE file for details. 