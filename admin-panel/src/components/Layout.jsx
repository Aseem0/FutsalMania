import React, { useState } from "react";
import { 
  LayoutDashboard, 
  Users as UsersIcon, 
  MapPin, 
  Trophy, 
  CalendarCheck, 
  LogOut, 
  Menu, 
  X,
  User,
  Search,
  ChevronDown,
  Calendar,
  Clock,
  Briefcase,
  Users as CustomersIcon
} from "lucide-react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

const cn = (...inputs) => twMerge(clsx(inputs));

const Sidebar = ({ isOpen, toggle }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('adminUser'));
  const isAdmin = user?.role === 'admin';
  const isManager = user?.role === 'manager';

  const menuItems = isAdmin ? [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Users", path: "/users", icon: UsersIcon },
    { name: "Manage Managers", path: "/managers", icon: User },
    { name: "Futsal Arenas", path: "/grounds", icon: MapPin },
    { name: "Matches", path: "/matches", icon: Clock },
    { name: "Tournaments", path: "/tournaments", icon: Trophy },
    { name: "Bookings", path: "/bookings", icon: CalendarCheck },
  ] : [
    { name: "Dashboard", path: "/manager/dashboard", icon: LayoutDashboard },
    { name: "Arena Overview", path: "/manager/arena", icon: MapPin },
    { name: "Bookings", path: "/manager/bookings", icon: Calendar },
    { name: "Schedule", path: "/manager/schedule", icon: Clock },
    { name: "Customers", path: "/manager/customers", icon: CustomersIcon },
  ];

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    navigate("/login");
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={toggle}
        />
      )}

      {/* Sidebar Content */}
      <aside className={cn(
        "fixed inset-y-0 left-0 w-64 bg-zinc-950 border-r border-zinc-900 z-50 transform transition-transform duration-300 ease-in-out md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full px-4 py-6">
          <div className="flex items-center gap-3 px-2 mb-10">
            <div className="p-2 bg-amber-500 rounded-lg">
              <Trophy className="w-6 h-6 text-black fill-current" />
            </div>
            <span className="text-xl font-outfit-bold text-white tracking-tight">FutsalMania</span>
          </div>

          <nav className="flex-1 space-y-1">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group text-sm font-medium",
                    isActive 
                      ? "bg-amber-500 text-black shadow-lg shadow-amber-500/20" 
                      : "text-zinc-500 hover:text-white hover:bg-zinc-900"
                  )}
                >
                  <Icon className={cn("w-5 h-5", isActive ? "text-black" : "text-zinc-500 group-hover:text-white")} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto border-t border-zinc-900 pt-4">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-3 py-3 rounded-xl text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 group text-sm font-medium"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

const Navbar = ({ toggleSidebar }) => {
  const admin = JSON.parse(localStorage.getItem('adminUser')) || { username: 'Admin' };

  return (
    <header className="h-20 bg-black/80 backdrop-blur-xl border-b border-zinc-900 sticky top-0 z-30 px-4 md:px-8">
      <div className="h-full flex items-center justify-between max-w-7xl mx-auto">
        <button onClick={toggleSidebar} className="p-2 text-zinc-400 hover:text-white md:hidden">
          <Menu className="w-6 h-6" />
        </button>

        <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-zinc-900/50 border border-zinc-800 rounded-full w-96">
          <Search className="w-4 h-4 text-zinc-500" />
          <input 
            type="text" 
            placeholder="Search dashboard..." 
            className="bg-transparent border-none text-sm focus:ring-0 text-white w-full placeholder:text-zinc-600"
          />
        </div>

        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end hidden sm:flex">
            <span className="text-sm font-semibold text-white">{admin.username}</span>
            <span className="text-xs text-amber-500 capitalize">{admin.role}</span>
          </div>
          <button className="h-10 w-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center overflow-hidden">
            <User className="w-5 h-5 text-zinc-500" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black flex transition-all duration-300">
      <Sidebar isOpen={sidebarOpen} toggle={() => setSidebarOpen(false)} />
      
      <div className="flex-1 md:ml-64 flex flex-col">
        <Navbar toggleSidebar={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
