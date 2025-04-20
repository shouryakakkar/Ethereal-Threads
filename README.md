# Ethereal Threads

A modern e-commerce platform for jewelry, built with React, Node.js, and MongoDB.

## Features

- User authentication and authorization
- Product catalog with categories
- Shopping cart functionality
- Admin dashboard for product and order management
- Contact form for customer inquiries
- Responsive design for all devices

## Tech Stack

- Frontend:
  - React
  - TypeScript
  - Vite
  - Tailwind CSS
  - Shadcn UI
  - React Router
  - React Query

- Backend:
  - Node.js
  - Express
  - MongoDB
  - Mongoose
  - JWT Authentication

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/shouryakakkar/Ethereal-Threads.git
cd Ethereal-Threads
```

2. Install dependencies:
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
```

3. Set up environment variables:
- Create `.env` file in the root directory
- Create `.env` file in the backend directory
- Add necessary environment variables (see .env.example files)

4. Start the development servers:
```bash
# Start frontend (from root directory)
npm run dev

# Start backend (from backend directory)
npm start
```

## Project Structure

```
ethereal-threads/
├── backend/           # Backend server code
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   └── server.js
│   └── package.json
├── src/              # Frontend React code
│   ├── components/
│   ├── pages/
│   ├── contexts/
│   └── App.tsx
└── package.json
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

Shourya Kakkar - [GitHub](https://github.com/shouryakakkar)
