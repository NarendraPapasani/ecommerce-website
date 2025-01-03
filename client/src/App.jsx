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
import MyProfile from "./Pages/Profile";
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

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
import Address from "./Pages/Address";
import CheckOut from "./Pages/CheckOut";
import Orders from "./Pages/Orders";
import OrderDetails from "./Pages/OrderDetails";

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

  const jwt = Cookies.get("jwt");

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

  const clickAddress = () => {
    window.location.href = "/addresses";
  };
  return (
    <div className="app-container bg-zinc-950">
      <div className="content">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<ProtectedRoute element={<Cart />} />} />
          <Route
            path="/my-profile"
            element={<ProtectedRoute element={<MyProfile />} />}
          />
          <Route path="/products/all" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetailsPage />} />
          <Route path="/products" element={<ProductListPage />} />
          <Route path="/cart" element={<ProtectedRoute element={<Cart />} />} />
          <Route
            path="/addresses"
            element={<ProtectedRoute element={<Address />} />}
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
          <Route path="*" element={<Home />} />
        </Routes>
      </div>

      <footer>
        <div className="flex justify-center items-center">
          <Menubar className="h-16 lg:h-16 sm:h-20">
            <MenubarMenu className="mr-2 sm:mr-4">
              <MenubarTrigger className="text-lg text-black font-normal hover:bg-slate-500 hover:text-white italic cursor-pointer sm:text-xl md:text-2xl lg:text-xl">
                <Link to="/">Home</Link>
              </MenubarTrigger>
              <MenubarMenu>
                <MenubarTrigger className="text-lg text-black font-normal hover:bg-slate-500 hover:text-white italic cursor-pointer sm:text-xl md:text-2xl lg:text-xl">
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
                </MenubarContent>
              </MenubarMenu>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger className="text-lg text-black font-normal hover:bg-slate-500 hover:text-white italic cursor-pointer sm:text-xl md:text-2xl lg:text-xl">
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
                  <MenubarSubContent className="ml-3 mb-24">
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
              <MenubarTrigger className="text-lg font-normal text-black hover:bg-slate-500 hover:text-white italic cursor-pointer sm:text-xl md:text-2xl lg:text-xl">
                Account
              </MenubarTrigger>
              <MenubarContent className="mb-4">
                <MenubarCheckboxItem
                  checked
                  className="text-lg sm:text-xl md:text-2xl lg:text-xl"
                  onClick={() => (window.location.href = "/orders")}
                >
                  My Orders
                </MenubarCheckboxItem>
                <MenubarItem
                  inset
                  className="text-lg sm:text-xl md:text-2xl lg:text-xl"
                  onClick={clickAddress}
                >
                  My Address
                </MenubarItem>
                <MenubarSeparator />
                <AlertDialog>
                  <AlertDialogTrigger className="w-full text-lg sm:text-xl md:text-2xl lg:text-xl">
                    {!jwt ? (
                      <Button
                        className="w-full text-xl sm:text-xl md:text-2xl lg:text-xl"
                        onClick={() => (window.location.href = "/login")}
                      >
                        Login
                      </Button>
                    ) : (
                      <Button className="w-full text-xl sm:text-xl md:text-2xl lg:text-xl">
                        Logout
                      </Button>
                    )}
                  </AlertDialogTrigger>
                  {jwt !== undefined && (
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
                  )}
                </AlertDialog>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
          {jwt && (
            <Avatar className="ml-4 cursor-pointer">
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          )}
        </div>
      </footer>
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
