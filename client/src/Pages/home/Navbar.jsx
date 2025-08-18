import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import {
  ShoppingBag,
  User,
  Heart,
  Search,
  Menu,
  Home,
  Package,
  MapPin,
  LogOut,
  LogIn,
  ShoppingCart,
  X,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const jwt = Cookies.get("jwt1");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showMobileSubmenu, setShowMobileSubmenu] = useState(null);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const logOutFunc = () => {
    console.log("Logout function called");
    Cookies.remove("jwt1");
    Cookies.remove("jwt1", { path: "/" });
    toast.success("Logged out successfully");
    navigate("/");
    setMobileMenuOpen(false);
    setShowLogoutDialog(false);
  };

  const navItems = [
    {
      label: "Home",
      icon: Home,
      path: "/",
    },
    {
      label: "Products",
      icon: Package,
      submenu: [
        { label: "All Products", path: "/products" },
        { label: "Categories", isSeparator: true },
        { label: "Clothing", path: "/products/clothes" },
        { label: "Electronics", path: "/products/electronics" },
        { label: "Shoes", path: "/products/shoes" },
        { label: "Furniture", path: "/products/furniture" },
        { label: "Miscellaneous", path: "/products/miscellaneous" },
      ],
    },
    {
      label: "Cart",
      icon: ShoppingCart,
      submenu: [
        { label: "My Cart", path: "/cart" },
        { label: "Wishlist", path: "/wishlist" },
      ],
    },
    {
      label: "Account",
      icon: User,
      submenu: jwt
        ? [
            { label: "My Orders", path: "/orders", icon: Package },
            { label: "My Address", path: "/addresses", icon: MapPin },
            { label: "Profile", path: "/my-profile", icon: User },
            { isSeparator: true },
            { label: "Logout", action: "logout", icon: LogOut },
          ]
        : [{ label: "Login", path: "/login", icon: LogIn }],
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-zinc-950/95 backdrop-blur supports-[backdrop-filter]:bg-zinc-950/75">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <ShoppingBag className="h-8 w-8 text-blue-500" />
            <h1 className="text-3xl lg:text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              BlinkShop
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex">
            <Menubar className="border-0 bg-transparent">
              {navItems.map((item) => (
                <MenubarMenu key={item.label}>
                  {item.submenu ? (
                    <>
                      <MenubarTrigger className="text-zinc-300 hover:text-white hover:bg-zinc-800 font-['Montserrat'] cursor-pointer">
                        <item.icon className="h-4 w-4 mr-2" />
                        {item.label}
                      </MenubarTrigger>
                      <MenubarContent className="bg-zinc-900 border-zinc-700">
                        {item.submenu.map((subItem, index) =>
                          subItem.isSeparator ? (
                            <MenubarSeparator
                              key={index}
                              className="bg-zinc-700"
                            />
                          ) : subItem.label === "Categories" ? (
                            <MenubarSub key={index}>
                              <MenubarSubTrigger className="text-zinc-300 hover:text-white hover:bg-zinc-800">
                                {subItem.label}
                              </MenubarSubTrigger>
                              <MenubarSubContent className="bg-zinc-900 border-zinc-700">
                                {item.submenu
                                  .slice(index + 2)
                                  .map((catItem) => (
                                    <MenubarItem
                                      key={catItem.label}
                                      className="text-zinc-300 hover:text-white hover:bg-zinc-800 cursor-pointer"
                                      onClick={() => navigate(catItem.path)}
                                    >
                                      {catItem.label}
                                    </MenubarItem>
                                  ))}
                              </MenubarSubContent>
                            </MenubarSub>
                          ) : subItem.action === "logout" ? (
                            <MenubarItem
                              key={index}
                              className="text-zinc-300 hover:text-white hover:bg-zinc-800 cursor-pointer"
                              onClick={() => setShowLogoutDialog(true)}
                            >
                              {subItem.icon && (
                                <subItem.icon className="h-4 w-4 mr-2" />
                              )}
                              {subItem.label}
                            </MenubarItem>
                          ) : (
                            <MenubarItem
                              key={index}
                              className="text-zinc-300 hover:text-white hover:bg-zinc-800 cursor-pointer"
                              onClick={() => navigate(subItem.path)}
                            >
                              {subItem.icon && (
                                <subItem.icon className="h-4 w-4 mr-2" />
                              )}
                              {subItem.label}
                            </MenubarItem>
                          )
                        )}
                      </MenubarContent>
                    </>
                  ) : (
                    <MenubarTrigger
                      className="text-zinc-300 hover:text-white hover:bg-zinc-800 font-['Montserrat'] cursor-pointer"
                      onClick={() => navigate(item.path)}
                    >
                      <item.icon className="h-4 w-4 mr-2" />
                      {item.label}
                    </MenubarTrigger>
                  )}
                </MenubarMenu>
              ))}
            </Menubar>
          </nav>

          {/* User Avatar */}
          {jwt && (
            <div className="hidden md:flex items-center space-x-4">
              <Avatar
                className="cursor-pointer"
                onClick={() => navigate("/my-profile")}
              >
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="Profile"
                />
                <AvatarFallback className="bg-blue-600 text-white">
                  U
                </AvatarFallback>
              </Avatar>
            </div>
          )}

          {/* Mobile Menu Button */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-white"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="bg-zinc-900 border-zinc-800 text-white p-0"
            >
              <SheetHeader className="p-6 border-b border-zinc-800">
                <div className="flex items-center space-x-2">
                  <ShoppingBag className="h-6 w-6 text-blue-500" />
                  <SheetTitle className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                    BlinkShop
                  </SheetTitle>
                </div>
              </SheetHeader>

              {/* Mobile Navigation Links */}
              <div className="flex flex-col">
                {navItems.map((item, index) => (
                  <div key={item.label}>
                    {item.submenu ? (
                      <div className="border-b border-zinc-800">
                        <div
                          className="flex items-center justify-between p-4 text-zinc-200 hover:bg-zinc-800"
                          onClick={() =>
                            setShowMobileSubmenu(
                              showMobileSubmenu === index ? null : index
                            )
                          }
                        >
                          <div className="flex items-center">
                            <item.icon className="h-5 w-5 mr-3" />
                            <span>{item.label}</span>
                          </div>
                          <ChevronRight
                            className={`h-5 w-5 transition-transform ${
                              showMobileSubmenu === index ? "rotate-90" : ""
                            }`}
                          />
                        </div>

                        {showMobileSubmenu === index && (
                          <div className="bg-zinc-950 pl-6">
                            {item.submenu.map(
                              (subItem, subIndex) =>
                                !subItem.isSeparator && (
                                  <div
                                    key={subIndex}
                                    className="p-3 border-b border-zinc-800/50 text-zinc-300 hover:bg-zinc-900 hover:text-white cursor-pointer"
                                    onClick={() => {
                                      if (subItem.action === "logout") {
                                        setShowLogoutDialog(true);
                                      } else if (subItem.path) {
                                        navigate(subItem.path);
                                        setMobileMenuOpen(false);
                                      }
                                    }}
                                  >
                                    <div className="flex items-center">
                                      {subItem.icon && (
                                        <subItem.icon className="h-4 w-4 mr-3" />
                                      )}
                                      <span>{subItem.label}</span>
                                    </div>
                                  </div>
                                )
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div
                        className="p-4 border-b border-zinc-800 text-zinc-200 hover:bg-zinc-800 cursor-pointer"
                        onClick={() => {
                          navigate(item.path);
                          setMobileMenuOpen(false);
                        }}
                      >
                        <div className="flex items-center">
                          <item.icon className="h-5 w-5 mr-3" />
                          <span>{item.label}</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {jwt && (
                  <div className="mt-4 p-4 flex items-center">
                    <Avatar className="mr-3">
                      <AvatarImage
                        src="https://github.com/shadcn.png"
                        alt="Profile"
                      />
                      <AvatarFallback className="bg-blue-600 text-white">
                        U
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-zinc-200">My Account</div>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent className="bg-zinc-900 border-zinc-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">
              Are you sure you want to logout?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400">
              You can always login back anytime.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={logOutFunc}
              className="bg-red-600 hover:bg-red-700"
            >
              Logout
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </header>
  );
};

export default Navbar;
