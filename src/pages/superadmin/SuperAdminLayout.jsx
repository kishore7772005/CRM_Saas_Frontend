import React, { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  LayoutDashboard,
  Building2,
  Settings,
  User,
  Power,
  Menu,
  X,
  ShieldAlert,
  CreditCard,
} from "lucide-react";
import { clearSuperAdminCredentials } from "../../store/authSlice";

const SuperAdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(clearSuperAdminCredentials());
    window.location.href = "/";
  };

  const navItems = [
    { to: "/superadmin/dashboard", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
    { to: "/superadmin/tenants", icon: <Building2 size={20} />, label: "Tenants" },
    { to: "/superadmin/subscription-plans", icon: <CreditCard size={20} />, label: "Subscription plans" },
    { to: "/superadmin/settings", icon: <Settings size={20} />, label: "Settings" },
    { to: "/superadmin/profile", icon: <User size={20} />, label: "Profile" },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col w-64 bg-slate-900 text-slate-100 border-r border-slate-800 transition-transform duration-300 transform lg:translate-x-0 lg:static lg:inset-auto ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800">
          <Link to="/superadmin/dashboard" className="flex items-center space-x-3">
            <ShieldAlert className="text-amber-500" size={28} />
            <span className="text-xl font-bold tracking-wider text-white">SuperAdmin</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Sidebar Nav */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-slate-800 text-white font-medium shadow-md shadow-slate-950/20"
                    : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-100"
                }`
              }
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center font-bold text-white shadow-sm border border-slate-600">
                SA
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-white">Platform Owner</p>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-medium">SuperAdmin</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg text-slate-400 hover:bg-red-500 hover:text-white transition-colors cursor-pointer"
              title="Logout"
            >
              <Power size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200 shadow-sm z-10">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-slate-100 lg:hidden text-slate-600 transition-colors"
            >
              <Menu size={22} />
            </button>
            <h1 className="text-xl font-bold text-slate-800">Management Console</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
              Live Server
            </span>
          </div>
        </header>

        {/* Dashboard Views Container */}
        <main className="flex-1 overflow-y-auto p-6 bg-slate-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SuperAdminLayout;
