import {
  HomeIcon,
  ShoppingBagIcon,
  ClipboardDocumentListIcon,
  UserGroupIcon,
  ChartBarIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { NavLink } from "react-router-dom";

const navigation = [
  { name: "Dashboard", key: "dashboard", icon: HomeIcon, path: "/dashboard" },
  {
    name: "Products",
    key: "products",
    icon: ShoppingBagIcon,
    path: "/products",
  },
  {
    name: "Orders",
    key: "orders",
    icon: ClipboardDocumentListIcon,
    path: "/orders",
  },
  {
    name: "Customers",
    key: "customers",
    icon: UserGroupIcon,
    path: "/customers",
  },
  {
    name: "Analytics",
    key: "analytics",
    icon: ChartBarIcon,
    path: "/analytics",
  },
];

export default function Sidebar({ isOpen, setIsOpen }) {
  return (
    <>
      {/* Mobile/Tablet Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed top-0 left-0 h-screen bg-zinc-900/95 backdrop-blur-sm border-r border-zinc-800 z-50
        transition-all duration-300 ease-in-out group
        ${isOpen ? "w-64" : "w-16 hover:w-64"}
        lg:relative lg:z-auto
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        {/* Logo */}
        <div className="flex items-center h-16 px-4 border-b border-zinc-800">
          <div className="flex items-center space-x-2 w-full">
            <ShoppingBagIcon className="h-8 w-8 text-blue-500 flex-shrink-0" />
            <div
              className={`flex flex-col overflow-hidden whitespace-nowrap transition-all duration-300 ${
                isOpen
                  ? "opacity-100 w-auto"
                  : "opacity-0 w-0 group-hover:opacity-100 group-hover:w-auto"
              }`}
            >
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent font-['Montserrat']">
                BlinkShop
              </h1>
              <span className="text-xs text-zinc-400 font-['Montserrat'] -mt-1">
                Admin
              </span>
            </div>

            {/* Mobile Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className={`lg:hidden ml-auto p-1 rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-white transition-all duration-200 ${
                isOpen ? "opacity-100" : "opacity-0"
              }`}
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-8 px-3 flex-1 overflow-y-auto">
          <ul className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.key}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `w-full flex items-center px-3 py-3 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800/50 transition-all duration-200 group/item relative ${
                        isActive
                          ? "text-white bg-blue-600 hover:bg-blue-700"
                          : ""
                      }`
                    }
                    title={item.name}
                    onClick={() => {
                      if (window.innerWidth < 1024) {
                        setIsOpen(false);
                      }
                    }}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    <span
                      className={`ml-3 text-sm font-medium overflow-hidden whitespace-nowrap font-['Montserrat'] transition-all duration-300 ${
                        isOpen
                          ? "opacity-100 w-auto"
                          : "opacity-0 w-0 group-hover:opacity-100 group-hover:w-auto"
                      }`}
                    >
                      {item.name}
                    </span>

                    {/* Tooltip for collapsed state - only show when sidebar is collapsed and not hovered */}
                    <div
                      className={`absolute left-16 top-1/2 -translate-y-1/2 bg-zinc-800 text-white px-2 py-1 rounded-md text-xs whitespace-nowrap pointer-events-none transition-opacity duration-200 z-50 font-['Montserrat'] border border-zinc-700 ${
                        isOpen
                          ? "opacity-0"
                          : "opacity-0 group-hover/item:opacity-100 group-hover:opacity-0"
                      }`}
                    >
                      {item.name}
                    </div>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer - only visible when expanded or on hover */}
        <div
          className={`absolute bottom-0 left-0 right-0 p-4 border-t border-zinc-800 transition-opacity duration-300 ${
            isOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          }`}
        >
          <div className="text-xs text-zinc-500 text-center font-['Montserrat']">
            BlinkShop Admin v1.0
          </div>
        </div>
      </div>
    </>
  );
}
