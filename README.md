# 🛒 BlinkShop - Modern Ecommerce Platform

<div align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Express.js-404D59?style=for-the-badge" alt="Express.js" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
</div>

<div align="center">
  <h3>🚀 <a href="https://blinkshopn.netlify.app">Live Demo</a></h3>
  <p>A full-stack modern ecommerce platform with advanced features and beautiful UI</p>
</div>

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### 🛍️ **Core Ecommerce**

- **Product Catalog** - Browse products with advanced filtering and sorting
- **Search & Filter** - Real-time search with category, price range, and sorting options
- **Product Details** - Detailed product pages with image carousels and reviews
- **Shopping Cart** - Add, remove, and manage cart items with real-time updates
- **Wishlist** - Save favorite products for later purchase
- **Infinite Scroll** - Seamless product loading with pagination

### 👤 **User Management**

- **Multi-Auth System** - Email/password and Google OAuth integration
- **User Profiles** - Comprehensive user profile management
- **Address Management** - Multiple shipping addresses with CRUD operations
- **Order History** - Complete order tracking and history

### 💳 **Payment & Orders**

- **Razorpay Integration** - Secure payment processing
- **Order Management** - Complete order lifecycle from placement to delivery
- **Email Notifications** - Automated order confirmations and updates
- **Invoice Generation** - PDF invoice generation for orders

### 🎨 **Modern UI/UX**

- **Responsive Design** - Mobile-first approach with perfect responsiveness
- **Shadcn/ui Components** - Beautiful, accessible UI components
- **Dark Theme** - Consistent dark theme with blue accents
- **Loading States** - Skeleton loaders and smooth transitions
- **Toast Notifications** - Real-time feedback for user actions

### 🔧 **Advanced Features**

- **Image Upload** - Cloudinary integration for image management
- **Review System** - Product reviews and ratings
- **Price Range Filters** - Dynamic price filtering
- **Category Management** - Organized product categories
- **Protected Routes** - JWT-based authentication and authorization

## 🛠️ Tech Stack

### Frontend

- **React 18** - Modern React with hooks and functional components
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/ui** - High-quality component library
- **React Router Dom** - Client-side routing
- **Axios** - HTTP client for API requests
- **React Hook Form** - Form validation and management
- **Zod** - TypeScript-first schema validation

### Backend

- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database with Mongoose ODM
- **JWT** - JSON Web Tokens for authentication
- **Bcryptjs** - Password hashing
- **Cloudinary** - Image upload and management
- **Nodemailer** - Email service integration

### Payment & Services

- **Razorpay** - Payment gateway integration
- **Google OAuth** - Social authentication
- **CORS** - Cross-origin resource sharing

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Git

### Clone Repository

```bash
git clone https://github.com/NarendraPapasani/ecommerce-website.git
cd ecommerce-website
```

### Backend Setup

```bash
cd server
npm install
npm run dev
```

### Frontend Setup

```bash
cd client
npm install
npm run dev
```

Visit `http://localhost:5173` to see the application running!

## 📦 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/NarendraPapasani/ecommerce-website.git
cd ecommerce-website
```

### 2. Install Backend Dependencies

```bash
cd server
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../client
npm install
```

### 4. Setup Environment Variables

Create `.env` files in both `server` and `client` directories (see [Environment Variables](#-environment-variables))

### 5. Start Development Servers

```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

## 🔐 Environment Variables

### Server Environment Variables

Create `.env` file in the `server` directory:

```env
# Database
MONGO_URI=mongodb+srv://your-connection-string

# Authentication
JWT_SECRET=your-super-secret-jwt-key

# Server Configuration
PORT=8000
NODE_ENV=development

# Frontend URLs
FRONTEND_API_BASE_URL=http://localhost:5173
FRONTEND_API_PROD_URL=https://your-production-domain.com

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email Service
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@yourapp.com

# Payment Gateway
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_SECRET=your-razorpay-secret
```

### Client Environment Variables

Create `.env` file in the `client` directory:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8000

# Google OAuth
VITE_GOOGLE_CLIENT_ID=your-google-client-id

# App Configuration
VITE_APP_NAME=BlinkShop
```

## 📚 API Documentation

### Authentication Endpoints

```
POST /api/auth/register    - User registration
POST /api/auth/login       - User login
POST /api/auth/google      - Google OAuth login
POST /api/auth/logout      - User logout
```

### Product Endpoints

```
GET    /api/products/all              - Get all products with pagination
GET    /api/products/category/:category - Get products by category
GET    /api/products/:id              - Get single product
GET    /api/products/categories       - Get all categories
GET    /api/products/price-range      - Get price range
```

### Cart Endpoints

```
GET    /api/cart           - Get user cart
POST   /api/cart/add       - Add item to cart
PUT    /api/cart/update    - Update cart item
DELETE /api/cart/remove    - Remove item from cart
DELETE /api/cart/clear     - Clear entire cart
```

### Wishlist Endpoints

```
GET    /api/wishlist       - Get user wishlist
POST   /api/wishlist/add   - Add item to wishlist
DELETE /api/wishlist/remove - Remove item from wishlist
DELETE /api/wishlist/clear  - Clear entire wishlist
```

### Order Endpoints

```
GET    /api/order          - Get user orders
POST   /api/order/create   - Create new order
GET    /api/order/:id      - Get order details
PUT    /api/order/:id/status - Update order status
```

## 📁 Project Structure

```
ecommerce-website/
├── client/                 # Frontend React application
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   │   └── ui/       # Shadcn/ui components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── lib/          # Utility functions
│   │   ├── Pages/        # Route components
│   │   │   ├── auth/     # Authentication pages
│   │   │   ├── cart/     # Shopping cart
│   │   │   ├── checkout/ # Checkout process
│   │   │   ├── home/     # Homepage
│   │   │   ├── orders/   # Order management
│   │   │   ├── products/ # Product catalog
│   │   │   ├── profile/  # User profile
│   │   │   └── wishlist/ # Wishlist management
│   │   ├── App.jsx       # Main app component
│   │   └── main.jsx      # Entry point
│   ├── package.json
│   └── vite.config.js
│
└── server/                # Backend Node.js application
    ├── controllers/       # Route controllers
    ├── DB/               # Database connection
    ├── lib/              # Utility services
    ├── middleware/       # Custom middleware
    ├── models/           # MongoDB models
    ├── routes/           # API routes
    ├── server.js         # Entry point
    └── package.json
```

## 🎯 Key Features Breakdown

### 🔐 Authentication System

- **Email/Password Authentication** with bcrypt hashing
- **Google OAuth 2.0** integration
- **JWT-based sessions** with secure cookie storage
- **Protected routes** and middleware
- **Password reset** functionality

### 🛒 Shopping Experience

- **Advanced Product Filtering** by category, price, and search terms
- **Infinite Scroll** for seamless browsing
- **Real-time Cart Updates** with quantity management
- **Wishlist Functionality** for saving favorite items
- **Responsive Product Cards** with hover effects

### 💰 Payment Integration

- **Razorpay Payment Gateway** for secure transactions
- **Order Tracking** from placement to delivery
- **Email Notifications** for order updates
- **Invoice Generation** for completed orders

### 🎨 Modern UI/UX

- **Dark Theme** with consistent zinc-950 backgrounds
- **Blue Accent Colors** for highlights and actions
- **Shadcn/ui Components** for accessibility and beauty
- **Loading Skeletons** for better perceived performance
- **Toast Notifications** for user feedback

## 🚀 Deployment

### Frontend (Netlify)

1. Build the client application:
   ```bash
   cd client
   npm run build
   ```
2. Deploy the `dist` folder to Netlify
3. Set environment variables in Netlify dashboard

### Backend (Your preferred hosting service)

1. Ensure all environment variables are set
2. Update CORS configuration for production domains
3. Set `NODE_ENV=production`

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines

- Follow the existing code style and patterns
- Write meaningful commit messages
- Update documentation as needed
- Test your changes thoroughly

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Narendra Papasani**

- GitHub: [@NarendraPapasani](https://github.com/NarendraPapasani)
- Email: papasaninarendra9492@gmail.com

## 🙏 Acknowledgments

- [Shadcn/ui](https://ui.shadcn.com/) for the beautiful component library
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Razorpay](https://razorpay.com/) for payment gateway integration
- [Cloudinary](https://cloudinary.com/) for image management
- [MongoDB](https://mongodb.com/) for the database solution

---

<div align="center">
  <p>Made with ❤️ by <a href="https://github.com/NarendraPapasani">Narendra Papasani</a></p>
  <p>⭐ Star this repo if you found it helpful!</p>
</div>
