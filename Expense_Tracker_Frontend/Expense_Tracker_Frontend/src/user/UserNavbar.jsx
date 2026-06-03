import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  BarChart3,
  CreditCard,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  Menu,
  PieChart,
  Plus,
  ReceiptText,
  User,
  WalletCards,
  X,
} from "lucide-react";

export const UserNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { name: "Dashboard", path: "", icon: LayoutDashboard },
    { name: "Add Category", path: "add-category", icon: Plus },
    { name: "Categories", path: "my-categories", icon: FolderKanban },
    { name: "Add Record", path: "add-expense", icon: ReceiptText },
    { name: "Records", path: "my-expenses", icon: CreditCard },
    { name: "Category Report", path: "reports", icon: PieChart },
    { name: "Mode Report", path: "report1", icon: BarChart3 },
    { name: "Budget", path: "budget", icon: WalletCards },
    { name: "Profile", path: "user-profile", icon: User },
  ];

  const logout = () => {
    localStorage.removeItem("token");
    document.cookie = "token=; path=/; max-age=0; sameSite=Lax";
    navigate("/login");
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-bold transition ${
      isActive
        ? "bg-slate-950 text-white shadow-sm"
        : "text-slate-600 hover:bg-white hover:text-slate-950"
    }`;

  return (
    <div className="app-shell flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-[#f6f7f4]/90 backdrop-blur-xl">
        <div className="page-wrap flex min-h-16 items-center justify-between gap-4 py-3">
          <NavLink to="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-950 text-white">
              <WalletCards size={23} />
            </div>
            <div>
              <p className="text-lg font-black leading-none text-slate-950">ExpTrack</p>
              <p className="text-xs font-bold text-slate-500">Personal finance desk</p>
            </div>
          </NavLink>

          <nav className="hidden flex-1 items-center justify-center gap-1 lg:flex">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink key={link.path || "dashboard"} to={link.path} end={link.path === ""} className={linkClass}>
                  <Icon size={16} />
                  {link.name}
                </NavLink>
              );
            })}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <button type="button" onClick={logout} className="secondary-btn">
              <LogOut size={17} />
              Logout
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen((value) => !value)}
            className="icon-btn lg:hidden"
            aria-label="Toggle navigation"
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {isOpen && (
          <div className="border-t border-slate-200 bg-[#f6f7f4] lg:hidden">
            <nav className="page-wrap grid gap-2 py-4 sm:grid-cols-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <NavLink
                    key={link.path || "dashboard"}
                    to={link.path}
                    end={link.path === ""}
                    onClick={() => setIsOpen(false)}
                    className={linkClass}
                  >
                    <Icon size={16} />
                    {link.name}
                  </NavLink>
                );
              })}
              <button type="button" onClick={logout} className="secondary-btn sm:col-span-2">
                <LogOut size={17} />
                Logout
              </button>
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1 py-8 sm:py-10">
        <Outlet />
      </main>
    </div>
  );
};
