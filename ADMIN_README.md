# Admin System Documentation

This document provides information about the admin system implementation for the ecommerce application.

## Overview

The admin system provides a comprehensive management interface for the ecommerce platform with separate backend API endpoints and a standalone React frontend application.

## Backend Implementation

### Admin Role & Permissions

- Added `role` field to User model with enum values: `["user", "admin"]`
- Created admin-only middleware (`adminMiddleware.js`) for route protection
- Admin users have access to management endpoints and operations

### Admin Controllers

1. **adminController.js** - Authentication and dashboard
   - `POST /api/admin/login` - Admin login
   - `POST /api/admin/logout` - Admin logout  
   - `GET /api/admin/dashboard/stats` - Dashboard statistics

2. **adminUserController.js** - User management
   - `GET /api/admin/users` - Get all users with pagination/filtering
   - `GET /api/admin/users/:id` - Get user details
   - `PUT /api/admin/users/:id/status` - Update user status
   - `PUT /api/admin/users/:id/role` - Update user role
   - `DELETE /api/admin/users/:id` - Delete user
   - `GET /api/admin/users/stats` - User statistics

3. **adminProductController.js** - Product management
   - `GET /api/admin/products` - Get all products with pagination/filtering
   - `GET /api/admin/products/:id` - Get product details
   - `POST /api/admin/products` - Create new product
   - `PUT /api/admin/products/:id` - Update product
   - `DELETE /api/admin/products/:id` - Delete product
   - `DELETE /api/admin/products` - Bulk delete products
   - `GET /api/admin/products/stats` - Product statistics

4. **adminOrderController.js** - Order management
   - `GET /api/admin/orders` - Get all orders with pagination/filtering
   - `GET /api/admin/orders/:id` - Get order details
   - `PUT /api/admin/orders/:id/status` - Update order status
   - `PUT /api/admin/orders/status` - Bulk update order status
   - `GET /api/admin/orders/stats` - Order statistics

### Security Features

- JWT-based authentication with admin role verification
- Protected routes with `adminMiddleware`
- Input validation and sanitization
- Role-based access control

## Frontend Implementation

### Admin React App

Located in `/admin` directory with the following structure:

```
admin/
├── src/
│   ├── components/
│   │   ├── layout/AdminLayout.jsx
│   │   ├── ui/ (Shadcn components)
│   │   └── AdminProtectedRoute.jsx
│   ├── pages/
│   │   ├── auth/AdminLogin.jsx
│   │   ├── dashboard/Dashboard.jsx
│   │   └── users/UsersManagement.jsx
│   ├── services/adminService.js
│   └── hooks/
├── package.json
├── tailwind.config.js
└── vite.config.js
```

### Key Features

1. **Admin Login** - Secure authentication with form validation
2. **Dashboard** - Overview with statistics and recent activity
3. **User Management** - CRUD operations, status updates, role changes
4. **Responsive Design** - Mobile-friendly interface
5. **Real-time Updates** - API integration with loading states

### Styling

- Uses Tailwind CSS with dark theme
- Consistent with main application design system
- Shadcn/ui components for professional UI
- Responsive layout with sidebar navigation

## Setup Instructions

### 1. Create Admin User

Run the admin user creation script:

```bash
cd server
node createAdmin.js
```

This creates an admin user with:
- Email: `admin@example.com`
- Password: `admin123`

### 2. Start Backend Server

```bash
cd server
npm install
npm run dev
```

Server runs on `http://localhost:5000`

### 3. Start Admin Frontend

```bash
cd admin
npm install
npm run dev
```

Admin app runs on `http://localhost:5175`

### 4. Access Admin Panel

1. Navigate to `http://localhost:5175`
2. Login with admin credentials
3. Access dashboard and management features

## API Endpoints

### Authentication
- `POST /api/admin/login` - Admin login
- `POST /api/admin/logout` - Admin logout

### Dashboard
- `GET /api/admin/dashboard/stats` - Dashboard statistics

### User Management
- `GET /api/admin/users` - List users (with pagination/filtering)
- `GET /api/admin/users/:id` - Get user details
- `PUT /api/admin/users/:id/status` - Update user status
- `PUT /api/admin/users/:id/role` - Update user role
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/users/stats` - User statistics

### Product Management
- `GET /api/admin/products` - List products
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product
- `GET /api/admin/products/stats` - Product statistics

### Order Management
- `GET /api/admin/orders` - List orders
- `GET /api/admin/orders/:id` - Get order details
- `PUT /api/admin/orders/:id/status` - Update order status
- `GET /api/admin/orders/stats` - Order statistics

## Environment Variables

Add to your `.env` file:

```
# Admin Frontend
VITE_API_BASE_URL=http://localhost:5000/api

# Backend (existing)
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

## Security Considerations

1. **Admin Role Verification** - All admin endpoints verify user role
2. **JWT Authentication** - Secure token-based authentication
3. **Input Validation** - All inputs are validated and sanitized
4. **CORS Configuration** - Proper CORS setup for admin app
5. **Rate Limiting** - Consider implementing rate limiting for admin endpoints

## Future Enhancements

1. **Product Management UI** - Complete product CRUD interface
2. **Order Management UI** - Full order management interface
3. **Analytics Dashboard** - Advanced analytics and reports
4. **File Upload** - Image upload for products
5. **Bulk Operations** - Bulk user/product operations
6. **Activity Logs** - Admin action logging
7. **Settings Management** - Application settings interface

## Troubleshooting

### Common Issues

1. **CORS Errors** - Ensure admin app URL is in CORS configuration
2. **Authentication Issues** - Check JWT secret and token expiry
3. **Database Connection** - Verify MongoDB connection string
4. **Port Conflicts** - Admin app uses port 5175, main app uses 5173

### Debug Mode

Enable debug logging by setting:
```
NODE_ENV=development
```

## License

This admin system is part of the ecommerce application and follows the same license terms.