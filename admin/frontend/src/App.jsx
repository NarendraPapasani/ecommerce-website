import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Customers from "./pages/Customers";
import Analytics from "./pages/Analytics";
import "./App.css";

import { Bars3Icon } from "@heroicons/react/24/outline";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Router>
      <div className="h-screen bg-zinc-950 flex overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

        {/* Mobile Hamburger Button */}
        <button
          className="fixed z-50 bottom-6 right-6 lg:hidden bg-zinc-900 border border-zinc-800 rounded-full p-3 shadow-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all duration-200"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open sidebar"
          style={{ display: sidebarOpen ? "none" : "" }}
        >
          <Bars3Icon className="h-7 w-7" />
        </button>

        <div className="relative z-10 flex w-full h-full">
          {/* Mobile/Tablet Sidebar */}
          <div className="lg:hidden">
            <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
          </div>

          {/* Desktop Sidebar - Always visible on desktop, collapsed by default */}
          <div className="hidden lg:block flex-shrink-0">
            <Sidebar isOpen={false} setIsOpen={() => {}} />
          </div>

          {/* Main content area */}
          <div className="flex-1 flex flex-col min-w-0 h-full">
            <main className="flex-1 overflow-y-auto overflow-x-hidden">
              <Routes>
                <Route
                  path="/"
                  element={<Navigate to="/dashboard" replace />}
                />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/products" element={<Products />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/customers" element={<Customers />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="*" element={<Dashboard />} />
              </Routes>
            </main>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
