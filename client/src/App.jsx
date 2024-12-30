import React from "react";
import { useNavigate } from "react-router-dom";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import Login from "./Pages/login";
import Cart from "./Pages/cart";
import Home from "./Pages/home";
import MyProfile from "./Pages/profile";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Button } from "./components/ui/button";
import "./App.css"; // Import the CSS file
import Products from "./Pages/products";
import ProtectedRoute from "./ProtectedRoute";
import ProductDetailsPage from "./Pages/ProductDetailsPage";
import ProductListPage from "./Pages/ProductListPage";
import cart from "./Pages/cart";

const AppContent = () => {
  const location = useLocation();

  const logOutFunc = () => {
    Cookies.remove("jwt");
    toast.success("Logged out successfully");
    window.location.href = "/login";
  };
  const clickAllProd = () => {
    window.location.href = "/products/all";
  };

  // Inside your AppContent component
  const navigate = useNavigate();

  const clickClothProd = () => {
    window.location.href = "/products?category=clothing";
  };

  const clickElecProd = () => {
    window.location.href = "/products?category=electronics";
  };

  const clickJweProd = () => {
    window.location.href = "/products?category=jewelery";
  };

  const clickCart = () => {
    window.location.href = "/cart";
  };
  return (
    <div className="app-container bg-zinc-950">
      <div className="content">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute element={<Home />} />} />
          <Route path="/cart" element={<ProtectedRoute element={<Cart />} />} />
          <Route
            path="/my-profile"
            element={<ProtectedRoute element={<MyProfile />} />}
          />
          <Route
            path="/products/all"
            element={<ProtectedRoute element={<Products />} />}
          />
          <Route
            path="/product/:id"
            element={<ProtectedRoute element={<ProductDetailsPage />} />}
          />
          <Route
            path="/products"
            element={<ProtectedRoute element={<ProductListPage />} />}
          />
          <Route path="/cart" element={<ProtectedRoute element={<Cart />} />} />
        </Routes>
      </div>
      {location.pathname !== "/login" && (
        <footer>
          <div className="flex justify-center items-center">
            <Menubar className="h-16 lg:h-16 sm:h-20">
              <MenubarMenu className="mr-2 sm:mr-4">
                <MenubarTrigger className="text-lg font-normal hover:bg-slate-500 hover:text-white italic cursor-pointer sm:text-xl md:text-2xl lg:text-xl">
                  <Link to="/">Home</Link>
                </MenubarTrigger>
                <MenubarMenu>
                  <MenubarTrigger className="text-lg font-normal hover:bg-slate-500 hover:text-white italic cursor-pointer sm:text-xl md:text-2xl lg:text-xl">
                    Cart
                  </MenubarTrigger>
                  <MenubarContent className="mb-4">
                    <MenubarCheckboxItem
                      className="text-lg sm:text-xl md:text-2xl lg:text-xl"
                      onClick={clickCart}
                    >
                      My Picks
                    </MenubarCheckboxItem>
                    <MenubarCheckboxItem
                      checked
                      className="text-lg sm:text-xl md:text-2xl lg:text-xl"
                    >
                      Wish list
                    </MenubarCheckboxItem>
                    <MenubarItem
                      inset
                      className="text-lg sm:text-xl md:text-2xl lg:text-xl"
                    >
                      liked items
                    </MenubarItem>
                  </MenubarContent>
                </MenubarMenu>
              </MenubarMenu>
              <MenubarMenu>
                <MenubarTrigger className="text-lg font-normal hover:bg-slate-500 hover:text-white italic cursor-pointer sm:text-xl md:text-2xl lg:text-xl">
                  Products
                </MenubarTrigger>
                <MenubarContent className="mb-4 ml-4">
                  <MenubarItem
                    className="text-lg sm:text-xl md:text-2xl lg:text-xl"
                    onClick={clickAllProd}
                  >
                    All Products
                  </MenubarItem>
                  <MenubarSeparator />
                  <MenubarSub>
                    <MenubarSubTrigger className="text-lg sm:text-xl md:text-2xl lg:text-xl">
                      Categories
                    </MenubarSubTrigger>
                    <MenubarSubContent className="ml-3">
                      <MenubarItem className="text-lg sm:text-xl md:text-2xl lg:text-xl">
                        Search from All
                      </MenubarItem>
                      <MenubarSeparator />
                      <MenubarItem
                        className="text-lg sm:text-xl md:text-2xl lg:text-xl"
                        onClick={clickClothProd}
                      >
                        Clothing
                      </MenubarItem>
                      <MenubarItem
                        className="text-lg sm:text-xl md:text-2xl lg:text-xl"
                        onClick={clickElecProd}
                      >
                        Electronics
                      </MenubarItem>
                      <MenubarItem
                        className="text-lg sm:text-xl md:text-2xl lg:text-xl"
                        onClick={clickJweProd}
                      >
                        Jweleries
                      </MenubarItem>
                    </MenubarSubContent>
                  </MenubarSub>
                </MenubarContent>
              </MenubarMenu>

              <MenubarMenu>
                <MenubarTrigger className="text-lg font-normal hover:bg-slate-500 hover:text-white italic cursor-pointer sm:text-xl md:text-2xl lg:text-xl">
                  Account
                </MenubarTrigger>
                <MenubarContent className="mb-4">
                  <MenubarCheckboxItem className="text-lg sm:text-xl md:text-2xl lg:text-xl">
                    My Profile
                  </MenubarCheckboxItem>
                  <MenubarCheckboxItem
                    checked
                    className="text-lg sm:text-xl md:text-2xl lg:text-xl"
                  >
                    My Orders
                  </MenubarCheckboxItem>
                  <MenubarItem
                    inset
                    className="text-lg sm:text-xl md:text-2xl lg:text-xl"
                  >
                    My Address
                  </MenubarItem>
                  <MenubarSeparator />
                  <AlertDialog>
                    <AlertDialogTrigger className="w-full text-lg sm:text-xl md:text-2xl lg:text-xl">
                      <Button className="w-full text-lg sm:text-xl md:text-2xl lg:text-xl">
                        Logout
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you want to Logout?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          You can always login back
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={logOutFunc}>
                          Continue
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </MenubarContent>
              </MenubarMenu>
            </Menubar>
          </div>
        </footer>
      )}
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
