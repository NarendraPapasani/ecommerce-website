import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { adminAuthService } from '../../services/adminService';
import { Button } from '../ui/button';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  ShoppingCart, 
  LogOut, 
  Menu,
  X,
  Shield
} from 'lucide-react';
import { toast } from '../../hooks/use-toast';

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = adminAuthService.getCurrentUser();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Users', href: '/users', icon: Users },
    { name: 'Products', href: '/products', icon: Package },
    { name: 'Orders', href: '/orders', icon: ShoppingCart },
  ];

  const handleLogout = async () => {
    try {
      await adminAuthService.logout();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of the admin panel.",
      });
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Still navigate to login even if logout API fails
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 relative">
      {/* Background Pattern */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
      
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 lg:hidden z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-zinc-900/95 backdrop-blur-sm border-r border-zinc-800 transform transition-transform duration-300 ease-in-out lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between px-6 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <Shield className="h-8 w-8 text-white" />
              <span className="text-xl font-bold text-white">Admin Portal</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden text-zinc-400 hover:text-white"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-6 py-6">
            <ul className="space-y-2">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className={`
                        flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                        ${isActive 
                          ? 'bg-white text-black' 
                          : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                        }
                      `}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* User info and logout */}
          <div className="border-t border-zinc-800 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center">
                <span className="text-sm font-semibold text-black">
                  {currentUser?.firstName?.[0]}{currentUser?.lastName?.[0]}
                </span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-white">
                  {currentUser?.firstName} {currentUser?.lastName}
                </p>
                <p className="text-xs text-zinc-400">{currentUser?.email}</p>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="w-full justify-start gap-3 text-zinc-400 hover:text-white hover:bg-zinc-800"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-zinc-800 bg-zinc-900/95 backdrop-blur-sm px-6">
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden text-zinc-400 hover:text-white"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-white">
              {navigation.find(item => item.href === location.pathname)?.name || 'Admin Panel'}
            </h1>
          </div>
        </div>

        {/* Page content */}
        <main className="relative z-10 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;