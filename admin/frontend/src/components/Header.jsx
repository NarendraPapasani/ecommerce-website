import {
  Bars3Icon,
  XMarkIcon,
  BellIcon,
  UserCircleIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/outline";
import { Button } from "./ui/button";
import { useState } from "react";

export default function Header({
  sidebarOpen,
  setSidebarOpen,
  activeTab,
  setActiveTab,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="bg-zinc-900/95 backdrop-blur-sm border-b border-zinc-800 h-16 flex items-center justify-between px-4 lg:px-6 relative z-40 flex-shrink-0">
        {/* Left side */}
        <div className="flex items-center space-x-4">
          {/* Mobile/Tablet sidebar toggle button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden text-zinc-400 hover:text-white hover:bg-zinc-800"
          >
            <Bars3Icon className="h-6 w-6" />
          </Button>

          {/* Mobile/Tablet Logo */}
          <div className="flex items-center space-x-2 lg:hidden">
            <ShoppingBagIcon className="h-7 w-7 text-blue-500" />
            <div className="flex flex-col">
              <h1 className="text-lg font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent font-['Montserrat']">
                BlinkShop
              </h1>
              <span className="text-xs text-zinc-400 font-['Montserrat'] -mt-1">
                Admin
              </span>
            </div>
          </div>

          {/* Desktop Title */}
          <div className="hidden lg:block">
            <h1 className="text-xl font-semibold text-white font-['Montserrat'] capitalize">
              {activeTab}{" "}
              {activeTab === "dashboard" ? "Overview" : "Management"}
            </h1>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            className="text-zinc-400 hover:text-white hover:bg-zinc-800"
          >
            <BellIcon className="h-5 w-5" />
          </Button>

          <div className="flex items-center space-x-2">
            <UserCircleIcon className="h-8 w-8 text-zinc-400" />
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-white font-['Montserrat']">
                Admin User
              </p>
              <p className="text-xs text-zinc-400 font-['Montserrat']">
                admin@blinkshop.com
              </p>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
