import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Login from "./Pages/auth/login";
import Cart from "./Pages/cart/cart";
import Home from "./Pages/home/home";
import Profile from "./Pages/profile/profile";
import ProductDetailsPage from "./Pages/products/ProductDetailsPage";
import ProductListPage from "./Pages/products/ProductListPage";
import Address from "./Pages/address/Address";
import CheckOut from "./Pages/checkout/CheckOut";
import Orders from "./Pages/orders/Orders";
import OrderDetails from "./Pages/orders/OrderDetails";
import Wishlist from "./Pages/wishlist/wishList";
import NotFound from "./Pages/NotFound";
import ProtectedRoute from "./ProtectedRoute";
import Navbar from "./Pages/home/Navbar";
import { Toaster } from "@/components/ui/toaster";

import "./App.css";

const AppContent = () => {
  const location = useLocation();
  const showNavbar = location.pathname !== "/login";

  return (
    <div className="app-container bg-zinc-950 min-h-screen w-full relative">
      {/* Global Background Pattern */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="relative z-10">
        {showNavbar && <Navbar />}
        <div className="content flex-grow">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Home />} />
            <Route
              path="/cart"
              element={<ProtectedRoute element={<Cart />} />}
            />
            <Route
              path="/my-profile"
              element={<ProtectedRoute element={<Profile />} />}
            />
            <Route
              path="/product/:category/:id"
              element={<ProductDetailsPage />}
            />
            <Route path="/products" element={<ProductListPage />} />
            <Route path="/products/:category" element={<ProductListPage />} />
            <Route
              path="/addresses"
              element={<ProtectedRoute element={<Address />} />}
            />
            <Route
              path="/wishlist"
              element={<ProtectedRoute element={<Wishlist />} />}
            />
            <Route
              path="/checkout"
              element={<ProtectedRoute element={<CheckOut />} />}
            />
            <Route
              path="/orders"
              element={<ProtectedRoute element={<Orders />} />}
            />
            <Route
              path="/order/:id"
              element={<ProtectedRoute element={<OrderDetails />} />}
            />
            {/* NotFound Route - Must be last */}
            <Route path="*" element={<NotFound />} />
            {/* <Route path="*" element={<Home />} /> */}
          </Routes>
        </div>
      </div>

      <Toaster />
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
