````markdown
# 🛒 BlinkShop - Advanced Ecommerce Platform

<div align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Express.js-404D59?style=for-the-badge" alt="Express.js" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/AI_Powered-FF6B6B?style=for-the-badge&logo=openai&logoColor=white" alt="AI Powered" />
</div>

<div align="center">
  <h3>🚀 <a href="https://blinkshopn.netlify.app">Live Demo</a></h3>
  <p>A comprehensive full-stack ecommerce platform with AI-powered shopping assistant, advanced admin panel, and modern UI/UX</p>
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

### 🤖 **AI-Powered Shopping Assistant**

- **Intelligent Product Search** - AI chatbot helps users find products using natural language
- **Smart Recommendations** - Contextual product suggestions based on user queries
- **Interactive Chat Interface** - Floating AI assistant with collapsible panels
- **Product Discovery** - AI can understand complex queries like "gifts for my father under 2000"

### 🛍️ **Core Ecommerce Features**

- **Advanced Product Catalog** - Browse products with sophisticated filtering and sorting
- **Multi-layered Search** - Real-time search with category, price range, brand, and rating filters
- **Detailed Product Pages** - Image carousels, reviews, specifications, and related products
- **Smart Shopping Cart** - Add, remove, update quantities with real-time price calculations
- **Wishlist Management** - Save favorite products with persistent storage
- **Infinite Scroll & Pagination** - Seamless product loading with URL-based pagination

### 👤 **Advanced User Management**

- **Multi-Authentication** - Email/password, Google OAuth, and JWT-based sessions
- **Comprehensive Profiles** - User information, preferences, and profile picture management
- **Address Book** - Multiple shipping addresses with full CRUD operations
- **Order History & Tracking** - Complete order lifecycle from placement to delivery
- **Account Security** - Password reset, session management, and secure authentication

### 💳 **Payment & Order System**

- **Razorpay Integration** - Secure payment gateway with multiple payment methods
- **Complete Order Management** - Order creation, status updates, and tracking
- **Email Notifications** - Automated confirmations, updates, and invoice delivery
- **Order Details & Invoices** - Detailed order information and PDF invoice generation
- **Order Status Tracking** - Real-time order status updates from placement to delivery

### 🎨 **Modern UI/UX Design**

- **Responsive Design** - Mobile-first approach with perfect cross-device compatibility
- **Shadcn/ui Components** - Beautiful, accessible, and consistent UI components
- **Dark Theme** - Professional dark theme with blue accent colors
- **Loading States & Skeletons** - Smooth loading experiences with skeleton screens
- **Toast Notifications** - Real-time user feedback for all actions
- **Micro-interactions** - Hover effects, transitions, and smooth animations

### � **Security & Performance**

- **JWT Authentication** - Secure token-based authentication system
- **Protected Routes** - Client and server-side route protection
- **Image Optimization** - Cloudinary integration for optimized image delivery
- **Form Validation** - Comprehensive client and server-side validation
- **Error Handling** - Graceful error handling with user-friendly messages

### 📱 **Advanced Features**

- **Review & Rating System** - Product reviews with star ratings and helpful votes
- **Dynamic Price Filtering** - Real-time price range filtering with sliders
- **Category Management** - Organized product categories with images
- **Stock Management** - Real-time inventory tracking and availability
- **Search Suggestions** - Auto-complete and search suggestions

## 🏢 **Admin Panel Features**

### 📊 **Dashboard & Analytics**

- **Comprehensive Dashboard** - Overview of orders, products, users, and revenue
- **Advanced Analytics** - Sales analytics, product performance, and user metrics
- **Real-time Statistics** - Live updates on key business metrics
- **Data Visualization** - Charts and graphs for better insights

### 🛒 **Product Management**

- **Full Product CRUD** - Create, read, update, and delete products
- **Bulk Operations** - Bulk product upload via CSV/Excel files
- **Image Management** - Multiple image upload with Cloudinary integration
- **Category Management** - Dynamic category creation and management
- **Stock Tracking** - Inventory management with low stock alerts
- **Advanced Filtering** - Filter products by category, price, stock status
- **URL-based Pagination** - Proper pagination with URL state management

### 👥 **User & Customer Management**

- **Customer Overview** - View all registered users and their details
- **User Activity Tracking** - Monitor user engagement and behavior
- **Account Management** - Enable/disable user accounts and permissions

### 📦 **Order Management**

- **Order Dashboard** - View all orders with detailed information
- **Order Status Updates** - Change order status (pending, confirmed, shipped, delivered)
- **Order Analytics** - Track order trends and patterns
- **Customer Order History** - View complete customer purchase history

### 🤖 **AI Integration**

- **LLM Controller** - Backend AI integration for the shopping assistant
- **Smart Product Recommendations** - AI-powered product suggestion engine
- **Natural Language Processing** - Process and understand user queries
- **Chat Management** - Handle AI chat conversations and context

### 🔧 **System Management**

- **Separate Admin Backend** - Independent admin API with enhanced security
- **Role-based Access** - Different permission levels for admin users
- **System Configuration** - Manage application settings and configurations
- **Performance Monitoring** - Track system performance and health

## 🛠️ Tech Stack

### 🎨 **Frontend (Client)**

- **React 18** - Modern React with hooks and functional components
- **Vite** - Lightning-fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development
- **Shadcn/ui** - High-quality, accessible component library
- **React Router Dom** - Client-side routing with URL state management
- **Axios** - Promise-based HTTP client for API requests
- **React Hook Form** - Performant forms with easy validation
- **Zod** - TypeScript-first schema validation library
- **Lucide React** - Beautiful & consistent icon library
- **Class Variance Authority** - Utility for managing component variants

### 🎛️ **Admin Frontend**

- **React 18** - Separate admin interface with modern React
- **Vite** - Optimized build and development environment
- **Tailwind CSS** - Consistent styling with the main application
- **Shadcn/ui** - Professional admin UI components
- **React Router** - URL-based pagination and navigation
- **Chart Libraries** - Data visualization for analytics
- **Responsive Design** - Mobile-friendly admin panel

### ⚙️ **Backend (Server)**

- **Node.js** - JavaScript runtime environment
- **Express.js** - Fast, minimalist web framework
- **MongoDB** - NoSQL database with flexible document structure
- **Mongoose** - Elegant MongoDB object modeling for Node.js
- **JWT** - JSON Web Tokens for secure authentication
- **Bcryptjs** - Password hashing and salting
- **Cloudinary** - Cloud-based image and video management
- **Nodemailer** - Email sending capabilities
- **Multer** - Middleware for handling multipart/form-data
- **Cookie Parser** - Parse HTTP request cookies

### 🏢 **Admin Backend**

- **Express.js** - Separate backend service for admin operations
- **MongoDB Integration** - Shared database with enhanced admin queries
- **Advanced Controllers** - Specialized controllers for admin operations
- **Bulk Operations** - CSV/Excel import and export functionality
- **Enhanced Security** - Additional security layers for admin operations
- **API Analytics** - Performance monitoring and logging

### 💰 **Payment & External Services**

- **Razorpay** - Comprehensive payment gateway integration
- **Google OAuth 2.0** - Social authentication service
- **Cloudinary API** - Image optimization and delivery network
- **Email Services** - SMTP integration for transactional emails
- **AI/LLM Integration** - Large Language Model for shopping assistant

### 🔐 **Security & Authentication**

- **JWT Tokens** - Secure, stateless authentication
- **CORS** - Cross-origin resource sharing configuration
- **bcryptjs** - Password encryption and hashing
- **Cookie Security** - Secure HTTP-only cookie management
- **Environment Variables** - Secure configuration management
- **Input Validation** - Client and server-side data validation

### 📊 **Development & Deployment**

- **ESLint** - Code linting and formatting
- **PostCSS** - CSS processing and optimization
- **Environment Configuration** - Separate development and production configs
- **Build Optimization** - Vite's optimized production builds
- **Cross-env** - Cross-platform environment variable management

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v16 or higher)
- **MongoDB** (local installation or cloud service like MongoDB Atlas)
- **Git** for version control
- **npm** or **yarn** package manager

### 🏃‍♂️ **One-Command Setup**

```bash
# Clone and setup everything
git clone https://github.com/NarendraPapasani/ecommerce-website.git
cd ecommerce-website
```

### 🖥️ **Main Application Setup**

```bash
# Backend setup
cd server
npm install
npm run dev          # Runs on http://localhost:8000

# In a new terminal - Frontend setup
cd ../client
npm install
npm run dev          # Runs on http://localhost:5173
```

### 🏢 **Admin Panel Setup** (Optional)

```bash
# Admin Backend
cd admin/backend
npm install
npm start           # Runs on http://localhost:3001

# In a new terminal - Admin Frontend
cd ../admin/frontend
npm install
npm run dev         # Runs on http://localhost:5174
```

### 🌐 **Access Points**

- **Main Application**: `http://localhost:5173`
- **Admin Panel**: `http://localhost:5174`
- **API Server**: `http://localhost:8000`
- **Admin API**: `http://localhost:3001`

🎉 **That's it!** Your BlinkShop ecommerce platform is now running!

## 📦 Detailed Installation

### 1. **Clone the Repository**

```bash
git clone https://github.com/NarendraPapasani/ecommerce-website.git
cd ecommerce-website
```

### 2. **Server Setup**

```bash
cd server
npm install
cp .env.example .env  # Copy environment template
# Configure your .env file (see Environment Variables section)
```

### 3. **Client Setup**

```bash
cd ../client
npm install
# Create .env file with your configuration
```

### 4. **Admin Panel Setup** (Optional but Recommended)

```bash
# Admin Backend
cd ../admin/backend
npm install
cp .env.example .env  # Configure admin environment

# Admin Frontend
cd ../frontend
npm install
```

### 5. **Database Setup**

```bash
# Make sure MongoDB is running
# For local MongoDB:
mongod

# For MongoDB Atlas:
# Just ensure your connection string is in the .env file
```

### 6. **Start All Services**

```bash
# Terminal 1 - Main Backend
cd server && npm run dev

# Terminal 2 - Main Frontend
cd client && npm run dev

# Terminal 3 - Admin Backend (Optional)
cd admin/backend && npm start

# Terminal 4 - Admin Frontend (Optional)
cd admin/frontend && npm run dev
```

### 7. **Verify Installation**

- ✅ Main App: http://localhost:5173
- ✅ Admin Panel: http://localhost:5174
- ✅ API Health: http://localhost:8000/api/health
- ✅ Admin API: http://localhost:3001/api/health

## 🔐 Environment Variables

### 🖥️ **Main Server Environment Variables**

Create `.env` file in the `server` directory:

```env
# Database Configuration
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/blinkshop
# or for local: mongodb://localhost:27017/blinkshop

# Authentication & Security
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
NODE_ENV=development
PORT=8000

# Frontend URLs (CORS Configuration)
FRONTEND_API_BASE_URL=http://localhost:5173
FRONTEND_API_PROD_URL=https://blinkshopn.netlify.app

# Cloudinary Configuration (Image Management)
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# Email Service Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
EMAIL_FROM=noreply@blinkshop.com

# Payment Gateway (Razorpay)
RAZORPAY_KEY_ID=rzp_test_your-key-id
RAZORPAY_SECRET=your-razorpay-secret-key

# AI/LLM Configuration (Optional)
LLM_API_KEY=your-ai-service-api-key
LLM_MODEL=gpt-3.5-turbo
```

### 🎨 **Client Environment Variables**

Create `.env` file in the `client` directory:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8000

# Google OAuth 2.0
VITE_GOOGLE_CLIENT_ID=your-google-oauth-client-id.googleusercontent.com

# App Configuration
VITE_APP_NAME=BlinkShop
VITE_APP_VERSION=1.0.0

# Feature Flags
VITE_ENABLE_AI_ASSISTANT=true
VITE_ENABLE_GOOGLE_AUTH=true

# Analytics (Optional)
VITE_GA_TRACKING_ID=GA-TRACKING-ID
```

### 🏢 **Admin Backend Environment Variables**

Create `.env` file in the `admin/backend` directory:

```env
# Database (Same as main server)
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/blinkshop

# Admin Authentication
JWT_SECRET=your-admin-jwt-secret-key
ADMIN_JWT_EXPIRY=24h
PORT=3001

# CORS Configuration
ADMIN_FRONTEND_URL=http://localhost:5174
ADMIN_FRONTEND_PROD_URL=https://your-admin-domain.com

# Admin Security
ADMIN_API_KEY=your-admin-api-key
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100

# File Upload Limits
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/webp

# AI/LLM for Admin Features
ADMIN_LLM_API_KEY=your-ai-service-key
```

### 📊 **Admin Frontend Environment Variables**

Create `.env` file in the `admin/frontend` directory:

```env
# Admin API Configuration
VITE_ADMIN_API_BASE_URL=http://localhost:3001

# Admin App Configuration
VITE_ADMIN_APP_NAME=BlinkShop Admin
VITE_ADMIN_VERSION=1.0.0

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_BULK_UPLOAD=true
VITE_ENABLE_AI_FEATURES=true

# Security
VITE_ADMIN_SESSION_TIMEOUT=3600000
```

### 🔑 **Getting API Keys**

#### **MongoDB Atlas:**

1. Visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get your connection string

#### **Cloudinary:**

1. Sign up at [Cloudinary](https://cloudinary.com/)
2. Get your cloud name, API key, and API secret from dashboard

#### **Razorpay:**

1. Create account at [Razorpay](https://razorpay.com/)
2. Generate API keys from dashboard

#### **Google OAuth:**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a project and enable Google+ API
3. Create OAuth 2.0 client ID

### 🔒 **Security Notes**

- Never commit `.env` files to version control
- Use strong, unique secrets for JWT
- Enable 2FA on all external services
- Use environment-specific configurations
- Regularly rotate API keys and secrets

## 📚 API Documentation

### 🔐 **Authentication Endpoints**

```http
POST /api/auth/register           # User registration with email/password
POST /api/auth/login              # User login authentication
POST /api/auth/google             # Google OAuth 2.0 login
POST /api/auth/logout             # User logout and token invalidation
POST /api/auth/forgot-password    # Send password reset email
POST /api/auth/reset-password     # Reset password with token
GET  /api/auth/verify-token       # Verify JWT token validity
GET  /api/auth/profile            # Get current user profile
PUT  /api/auth/update-profile     # Update user profile information
```

### 🛍️ **Product Endpoints**

```http
GET    /api/products/all                    # Get all products with advanced filtering
GET    /api/products/search?q=query         # Search products by text
GET    /api/products/category/:category     # Get products by category
GET    /api/products/:id                    # Get single product details
GET    /api/products/categories             # Get all available categories
GET    /api/products/price-range            # Get min/max price range
GET    /api/products/trending              # Get trending products
GET    /api/products/related/:id           # Get related products
POST   /api/products/upload                # Bulk upload products (Admin)
```

### 🛒 **Cart Management Endpoints**

```http
GET    /api/cart                # Get user's cart items
POST   /api/cart/add            # Add product to cart
PUT    /api/cart/update/:id     # Update cart item quantity
DELETE /api/cart/remove/:id     # Remove specific item from cart
DELETE /api/cart/clear          # Clear entire cart
GET    /api/cart/count          # Get cart items count
```

### ❤️ **Wishlist Endpoints**

```http
GET    /api/wishlist            # Get user's wishlist
POST   /api/wishlist/add        # Add product to wishlist
DELETE /api/wishlist/remove/:id # Remove item from wishlist
DELETE /api/wishlist/clear      # Clear entire wishlist
GET    /api/wishlist/check/:id  # Check if product is in wishlist
```

### 📦 **Order Management Endpoints**

```http
GET    /api/order               # Get user's order history
POST   /api/order/create        # Create new order
GET    /api/order/:id           # Get specific order details
PUT    /api/order/:id/status    # Update order status (Admin)
POST   /api/order/payment       # Process payment for order
GET    /api/order/invoice/:id   # Download order invoice
POST   /api/order/cancel/:id    # Cancel order (if eligible)
```

### 📍 **Address Management Endpoints**

```http
GET    /api/address             # Get user's saved addresses
POST   /api/address/create      # Add new address
PUT    /api/address/update/:id  # Update existing address
DELETE /api/address/delete/:id  # Delete address
PUT    /api/address/default/:id # Set default address
```

### ⭐ **Review & Rating Endpoints**

```http
GET    /api/review/product/:id  # Get product reviews
POST   /api/review/create       # Add product review
PUT    /api/review/update/:id   # Update review
DELETE /api/review/delete/:id   # Delete review
POST   /api/review/helpful/:id  # Mark review as helpful
```

### 💳 **Payment Endpoints**

```http
POST   /api/payment/create-order      # Create Razorpay order
POST   /api/payment/verify           # Verify payment signature
GET    /api/payment/methods          # Get available payment methods
POST   /api/payment/refund/:id       # Process refund (Admin)
```

### 🤖 **AI Assistant Endpoints**

```http
POST   /api/ai/chat               # Send message to AI assistant
POST   /api/ai/product-search     # AI-powered product search
GET    /api/ai/suggestions        # Get AI product suggestions
POST   /api/ai/analyze-query      # Analyze user search intent
```

## 🏢 **Admin API Endpoints** (Port 3001)

### 📊 **Dashboard & Analytics**

```http
GET    /api/admin/dashboard        # Get dashboard statistics
GET    /api/admin/analytics        # Get detailed analytics
GET    /api/admin/sales-report     # Generate sales reports
GET    /api/admin/user-metrics     # Get user engagement metrics
```

### 🛒 **Product Management**

```http
GET    /api/admin/products         # Get all products with admin view
POST   /api/admin/products         # Create new product
PUT    /api/admin/products/:id     # Update product
DELETE /api/admin/products/:id     # Delete product
POST   /api/admin/products/bulk    # Bulk upload products
GET    /api/admin/products/low-stock # Get low stock products
```

### 👥 **User Management**

```http
GET    /api/admin/users            # Get all users
GET    /api/admin/users/:id        # Get specific user details
PUT    /api/admin/users/:id/status # Update user status
DELETE /api/admin/users/:id        # Delete user account
GET    /api/admin/users/analytics  # Get user analytics
```

### 📦 **Order Management**

```http
GET    /api/admin/orders           # Get all orders
PUT    /api/admin/orders/:id/status # Update order status
GET    /api/admin/orders/analytics # Get order analytics
POST   /api/admin/orders/bulk-update # Bulk update order statuses
```

### 🤖 **AI & LLM Management**

```http
POST   /api/admin/llm/query        # Process LLM queries
GET    /api/admin/llm/logs         # Get AI interaction logs
PUT    /api/admin/llm/config       # Update AI configuration
GET    /api/admin/llm/analytics    # Get AI usage analytics
```

### 📊 **Request/Response Format**

#### **Standard Response Format:**

```json
{
  "status": "success|error",
  "message": "Human readable message",
  "data": {
    // Response data
  },
  "pagination": {
    "currentPage": 1,
    "totalPages": 10,
    "totalItems": 100,
    "hasNext": true,
    "hasPrev": false
  }
}
```

#### **Error Response Format:**

```json
{
  "status": "error",
  "message": "Error description",
  "error": {
    "code": "ERROR_CODE",
    "details": "Detailed error information"
  }
}
```

## 📁 Project Structure

```
ecommerce-website/
├── 📱 client/                          # Main Frontend Application
│   ├── 🎨 public/                     # Static assets & meta files
│   │   ├── _redirects                 # Netlify redirects
│   │   ├── google-test.html           # Google verification
│   │   └── shopping-bag-icon.svg      # App icon
│   ├── 🧩 src/
│   │   ├── 🎛️ components/             # Reusable UI Components
│   │   │   ├── AISearchModal.jsx      # AI shopping assistant
│   │   │   ├── FloatingAIChatButton.jsx # AI chat trigger
│   │   │   ├── layout/                # Layout components
│   │   │   ├── skeletons/             # Loading skeletons
│   │   │   └── ui/                    # Shadcn/ui components
│   │   ├── 🪝 hooks/                  # Custom React hooks
│   │   │   ├── use-mobile.jsx         # Mobile detection
│   │   │   └── use-toast.js           # Toast notifications
│   │   ├── 🛠️ lib/                    # Utility functions
│   │   │   └── utils.js               # Helper utilities
│   │   ├── 📄 Pages/                  # Route Components
│   │   │   ├── auth/                  # Authentication
│   │   │   │   ├── LoginPage.jsx      # Login interface
│   │   │   │   └── RegisterPage.jsx   # Registration
│   │   │   ├── cart/                  # Shopping Cart
│   │   │   │   └── CartPage.jsx       # Cart management
│   │   │   ├── checkout/              # Checkout Process
│   │   │   │   └── CheckoutPage.jsx   # Payment & shipping
│   │   │   ├── home/                  # Homepage
│   │   │   │   └── HomePage.jsx       # Landing page
│   │   │   ├── orders/                # Order Management
│   │   │   │   ├── OrdersPage.jsx     # Order history
│   │   │   │   └── OrderDetailsPage.jsx # Order details
│   │   │   ├── products/              # Product Catalog
│   │   │   │   ├── ProductListPage.jsx # Product listing
│   │   │   │   ├── ProductDetailsPage.jsx # Product details
│   │   │   │   └── ProductCard.jsx    # Product card component
│   │   │   ├── profile/               # User Profile
│   │   │   │   └── ProfilePage.jsx    # Profile management
│   │   │   ├── wishlist/              # Wishlist
│   │   │   │   └── WishlistPage.jsx   # Saved products
│   │   │   ├── Address.jsx            # Address management
│   │   │   └── NotFound.jsx           # 404 page
│   │   ├── 📱 functions/              # Utility components
│   │   ├── 🎯 features/               # Feature modules
│   │   ├── App.jsx                    # Main app component
│   │   └── main.jsx                   # Application entry point
│   ├── components.json                # Shadcn/ui config
│   ├── tailwind.config.js             # Tailwind CSS config
│   └── vite.config.js                 # Vite build config
│
├── 🖥️ server/                         # Main Backend Application
│   ├── 🎛️ controllers/               # Business Logic Controllers
│   │   ├── authController.js          # Authentication logic
│   │   ├── productController.js       # Product management
│   │   ├── cartController.js          # Cart operations
│   │   ├── orderController.js         # Order processing
│   │   ├── paymentController.js       # Payment handling
│   │   ├── wishlistController.js      # Wishlist management
│   │   ├── addressController.js       # Address CRUD
│   │   ├── reviewController.js        # Review system
│   │   └── uploadProducts.js          # Bulk upload
│   ├── 🗄️ models/                    # MongoDB Data Models
│   │   ├── userModel.js               # User schema
│   │   ├── productModel.js            # Product schema
│   │   ├── orderModel.js              # Order schema
│   │   ├── cartModel.js               # Cart schema
│   │   ├── wishlistModel.js           # Wishlist schema
│   │   ├── addressModel.js            # Address schema
│   │   ├── reviewModel.js             # Review schema
│   │   └── paymentModel.js            # Payment schema
│   ├── 🛣️ routes/                     # API Route Definitions
│   │   ├── authRoute.js               # Auth endpoints
│   │   ├── productRoute.js            # Product endpoints
│   │   ├── cartRoute.js               # Cart endpoints
│   │   ├── orderRoute.js              # Order endpoints
│   │   ├── paymentRoute.js            # Payment endpoints
│   │   ├── wishlistRoute.js           # Wishlist endpoints
│   │   ├── addressRoute.js            # Address endpoints
│   │   ├── reviewRoute.js             # Review endpoints
│   │   └── aiRoute.js                 # AI assistant endpoints
│   ├── 🔐 middleware/                 # Custom Middleware
│   │   └── authenticateController.js  # JWT authentication
│   ├── 🗂️ DB/                        # Database Configuration
│   │   └── connectDb.js               # MongoDB connection
│   ├── 📚 lib/                        # Shared Utilities
│   │   └── utils/                     # Helper functions
│   ├── products.json                  # Sample product data
│   └── server.js                      # Server entry point
│
├── 🏢 admin/                          # Admin Panel System
│   ├── 🎨 frontend/                   # Admin Frontend Interface
│   │   ├── 🧩 src/
│   │   │   ├── components/            # Admin UI components
│   │   │   ├── pages/                 # Admin Pages
│   │   │   │   ├── Dashboard.jsx      # Admin dashboard
│   │   │   │   ├── Products.jsx       # Product management
│   │   │   │   ├── Orders.jsx         # Order management
│   │   │   │   ├── Customers.jsx      # User management
│   │   │   │   ├── Analytics.jsx      # Analytics dashboard
│   │   │   │   └── chatPage.jsx       # AI chat interface
│   │   │   ├── hooks/                 # Admin-specific hooks
│   │   │   └── lib/                   # Admin utilities
│   │   ├── tailwind.config.js         # Admin styling config
│   │   └── vite.config.js             # Admin build config
│   │
│   └── ⚙️ backend/                    # Admin Backend Service
│       ├── 🎛️ controllers/           # Admin Controllers
│       │   ├── adminProductController.js # Product admin operations
│       │   ├── adminOrderController.js   # Order admin operations
│       │   ├── adminUserController.js    # User admin operations
│       │   └── llmcontroller.js          # AI/LLM integration
│       ├── 🛣️ routes/                 # Admin API Routes
│       │   ├── adminProductRoutes.js  # Product management APIs
│       │   ├── adminOrderRoutes.js    # Order management APIs
│       │   ├── adminUserRoutes.js     # User management APIs
│       │   ├── llmroutes.js           # AI integration APIs
│       │   ├── orderRoute.js          # Order operations
│       │   └── userRoute.js           # User operations
│       ├── utils/                     # Admin utilities
│       └── app.js                     # Admin server entry
│
├── 📝 Configuration Files
├── package.json                       # Root package info
├── README.md                          # This documentation
└── .gitignore                         # Git ignore rules
```

### 🗂️ **Key Architecture Patterns**

#### **Frontend Architecture:**

- **Component-Based**: Modular React components with clear separation
- **Feature-Driven**: Organized by features (auth, products, cart, etc.)
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **State Management**: React hooks with context for global state
- **Route Protection**: Protected routes with authentication guards

#### **Backend Architecture:**

- **MVC Pattern**: Models, Controllers, and Routes separation
- **Middleware Pipeline**: Authentication, validation, and error handling
- **Database Abstraction**: Mongoose ODM for MongoDB operations
- **API-First Design**: RESTful APIs with consistent response formats
- **Microservice Ready**: Separate admin backend for scalability

#### **Security Architecture:**

- **JWT Authentication**: Stateless token-based auth
- **Input Validation**: Client and server-side validation
- **CORS Configuration**: Proper cross-origin handling
- **Environment Secrets**: Secure configuration management
- **Rate Limiting**: API protection against abuse

#### **Data Flow:**

```
Frontend (React) → API Routes → Controllers → Models → MongoDB
                ↑                                        ↓
            JWT Auth ← Middleware ← Validation ← Response
```

## 🎯 Key Features Deep Dive

### 🤖 **AI-Powered Shopping Assistant**

#### **Intelligent Conversational Interface:**

- **Natural Language Processing** - Understands complex user queries like "show me affordable laptops for students"
- **Contextual Responses** - Maintains conversation context for follow-up questions
- **Product Recommendations** - AI suggests products based on user preferences and budget
- **Smart Search** - Converts natural language to structured product queries
- **Interactive UI** - Collapsible chat panel with product display integration

#### **Advanced AI Capabilities:**

- **Intent Recognition** - Understands whether user wants to browse, compare, or get recommendations
- **Price-aware Suggestions** - Considers budget constraints in recommendations
- **Category Intelligence** - Maps user queries to relevant product categories
- **Personalized Responses** - Tailors responses based on user behavior patterns

### 🔐 **Multi-Layer Authentication System**

#### **Authentication Methods:**

- **Email/Password** - Secure bcrypt hashing with salt rounds
- **Google OAuth 2.0** - Seamless social login integration
- **JWT Sessions** - Stateless authentication with secure token management
- **Persistent Login** - Remember me functionality with secure cookies

#### **Security Features:**

- **Password Validation** - Strong password requirements and validation
- **Token Refresh** - Automatic token renewal for extended sessions
- **Session Management** - Secure logout and session invalidation
- **Route Protection** - Client and server-side authentication guards

### 🛒 **Advanced Shopping Experience**

#### **Product Discovery:**

- **Multi-faceted Filtering** - Filter by category, price range, brand, ratings, availability
- **Dynamic Search** - Real-time search with auto-suggestions and typo tolerance
- **Smart Sorting** - Sort by popularity, price, ratings, newest arrivals
- **Infinite Scroll** - Seamless product loading with performance optimization
- **URL State Management** - Shareable product filter URLs with pagination

#### **Enhanced Product Pages:**

- **Interactive Image Gallery** - Zoom, multiple angles, and high-resolution images
- **Comprehensive Reviews** - Star ratings, written reviews, helpful votes
- **Stock Indicators** - Real-time inventory status and availability alerts
- **Related Products** - AI-powered product recommendations
- **Social Sharing** - Share products on social media platforms

### 🛍️ **Shopping Cart & Wishlist**

#### **Smart Cart Management:**

- **Real-time Updates** - Instant price calculations and inventory checks
- **Quantity Controls** - Easy increment/decrement with stock validation
- **Persistent Storage** - Cart items saved across sessions and devices
- **Quick Actions** - Save for later, move to wishlist, bulk operations
- **Price Breakdown** - Detailed pricing with taxes, discounts, and shipping

#### **Intelligent Wishlist:**

- **Cross-device Sync** - Access wishlist from any device
- **Price Drop Alerts** - Notifications when wishlist items go on sale
- **Stock Notifications** - Alerts when out-of-stock items become available
- **Easy Management** - Bulk add to cart, remove items, organize collections

### 💰 **Comprehensive Payment System**

#### **Razorpay Integration:**

- **Multiple Payment Methods** - Cards, UPI, net banking, wallets
- **Secure Processing** - PCI DSS compliant payment handling
- **International Support** - Multi-currency transactions
- **Payment Verification** - Webhook-based payment confirmation
- **Refund Management** - Automated and manual refund processing

#### **Order Management:**

- **Order Lifecycle** - From placement to delivery tracking
- **Status Updates** - Real-time order status with email notifications
- **Invoice Generation** - Professional PDF invoices with company branding
- **Order History** - Detailed order tracking and reorder functionality

### 🎨 **Modern UI/UX Design Philosophy**

#### **Design System:**

- **Consistent Dark Theme** - Professional zinc-950 color palette
- **Blue Accent Strategy** - Strategic use of blue for calls-to-action
- **Accessible Components** - WCAG compliant UI elements from shadcn/ui
- **Responsive Grid** - Mobile-first responsive design with breakpoint optimization
- **Micro-interactions** - Subtle animations and hover effects for enhanced UX

#### **Performance Optimization:**

- **Skeleton Loading** - Progressive content loading with skeleton screens
- **Image Optimization** - Lazy loading, WebP format, and responsive images
- **Code Splitting** - Dynamic imports and route-based code splitting
- **Caching Strategy** - Intelligent caching for API responses and static assets

### 📱 **Mobile-First Experience**

#### **Mobile Optimization:**

- **Touch-friendly Interface** - Optimized touch targets and gesture support
- **Progressive Web App** - PWA capabilities with offline functionality
- **Mobile Navigation** - Collapsible menus and mobile-optimized layouts
- **Performance** - Optimized for mobile networks and devices

### 🏢 **Enterprise Admin Panel**

#### **Comprehensive Dashboard:**

- **Real-time Analytics** - Live sales data, user metrics, and performance indicators
- **Visual Data Representation** - Charts, graphs, and statistical overviews
- **Key Performance Indicators** - Revenue, orders, user growth, and conversion rates
- **Customizable Widgets** - Personalized dashboard with draggable components

#### **Advanced Product Management:**

- **Bulk Operations** - Mass product import/export via CSV/Excel
- **Rich Media Management** - Multi-image upload with Cloudinary integration
- **Category Hierarchies** - Nested categories with image assignments
- **Inventory Tracking** - Real-time stock management with alerts
- **SEO Optimization** - Meta descriptions, slugs, and search optimization

#### **Customer Relationship Management:**

- **User Analytics** - Customer behavior analysis and segmentation
- **Communication Tools** - Email notifications and customer messaging
- **Order Management** - Complete order lifecycle management
- **Support Features** - Customer service tools and ticket management

## 🚀 Deployment Guide

### 🌐 **Frontend Deployment (Netlify)**

#### **Automatic Deployment:**

1. **Connect Repository:**
   ```bash
   # Push your code to GitHub
   git push origin main
   ```
2. **Netlify Configuration:**
   - Connect your GitHub repository
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: `18.x`

#### **Manual Deployment:**

```bash
cd client
npm run build
# Upload dist/ folder to Netlify
```

#### **Environment Variables (Netlify):**

```env
VITE_API_BASE_URL=https://your-backend-domain.com
VITE_GOOGLE_CLIENT_ID=your-google-client-id
VITE_APP_NAME=BlinkShop
```

### 🖥️ **Backend Deployment Options**

#### **Option 1: Railway/Render/Heroku**

```bash
# Create Procfile
echo "web: node server.js" > Procfile

# Set environment variables in platform dashboard
# Deploy through Git integration
```

#### **Option 2: VPS/Cloud Server**

```bash
# Install Node.js and MongoDB
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs mongodb

# Deploy application
git clone https://github.com/yourusername/ecommerce-website.git
cd ecommerce-website/server
npm install --production
pm2 start server.js --name "blinkshop-api"
```

#### **Option 3: Docker Deployment**

```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 8000
CMD ["node", "server.js"]
```

```bash
# Build and run
docker build -t blinkshop-api .
docker run -p 8000:8000 --env-file .env blinkshop-api
```

### 🏢 **Admin Panel Deployment**

#### **Admin Frontend (Netlify/Vercel):**

```bash
cd admin/frontend
npm run build
# Deploy dist/ folder
```

#### **Admin Backend (Same as main backend):**

```bash
cd admin/backend
npm install --production
pm2 start app.js --name "blinkshop-admin"
```

### 🔧 **Production Configuration**

#### **Server Production Setup:**

```env
NODE_ENV=production
MONGO_URI=mongodb+srv://prod-cluster.mongodb.net/blinkshop
FRONTEND_API_PROD_URL=https://blinkshopn.netlify.app
```

#### **CORS Configuration:**

```javascript
// Update server/server.js
const corsOptions = {
  origin: ["https://blinkshopn.netlify.app", "https://admin.blinkshop.com"],
  credentials: true,
};
```

#### **SSL/HTTPS Setup:**

```bash
# Using Let's Encrypt with Nginx
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d api.blinkshop.com
```

### 📊 **Monitoring & Analytics**

#### **Performance Monitoring:**

```bash
# Install monitoring tools
npm install --save helmet compression morgan
```

#### **Database Monitoring:**

- MongoDB Atlas monitoring
- Set up alerts for performance metrics
- Regular backup scheduling

#### **Application Monitoring:**

- Set up error tracking (Sentry)
- Performance monitoring (New Relic)
- Uptime monitoring (UptimeRobot)

### 🔄 **CI/CD Pipeline**

#### **GitHub Actions Workflow:**

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm run build
      - run: npm test
      - name: Deploy to Netlify
        uses: netlify/actions/build@master
```

### 🌍 **Domain & DNS Setup**

#### **Custom Domain Configuration:**

1. **Purchase domain** from registrar
2. **Configure DNS records:**
   ```
   A     @              your-server-ip
   CNAME www            your-domain.com
   CNAME api            your-backend-domain.com
   CNAME admin          your-admin-domain.com
   ```

### 📈 **Scaling Considerations**

#### **Horizontal Scaling:**

- Load balancer setup (Nginx)
- Multiple backend instances
- Database clustering

#### **Performance Optimization:**

- CDN setup for static assets
- Redis caching implementation
- Database indexing optimization
- Image optimization with Cloudinary

#### **Security Hardening:**

```bash
# Install security middleware
npm install helmet express-rate-limit
```

### ✅ **Post-Deployment Checklist**

- [ ] Environment variables configured
- [ ] Database connection working
- [ ] HTTPS/SSL certificates installed
- [ ] CORS properly configured
- [ ] Payment gateway in production mode
- [ ] Email service configured
- [ ] Monitoring tools active
- [ ] Backup system in place
- [ ] Performance optimization enabled
- [ ] Security headers configured

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
````
