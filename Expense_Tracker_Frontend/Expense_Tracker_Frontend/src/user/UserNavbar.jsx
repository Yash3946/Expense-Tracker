import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  BarChart3,
  CreditCard,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  PieChart,
  Plus,
  ReceiptText,
  Sun,
  User,
  WalletCards,
  X,
} from "lucide-react";
import { useTheme } from "../common/ThemeContext";

export const UserNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

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
        ? "bg-slate-950 dark:bg-cyan-600 text-white shadow-sm"
        : "text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 hover:text-slate-950 dark:hover:text-white"
    }`;

  return (
    <div className="app-shell flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 border-b border-slate-200/80 dark:border-slate-800 bg-[#f6f7f4]/90 dark:bg-slate-900/90 backdrop-blur-xl">
        <div className="page-wrap flex min-h-16 items-center justify-between gap-4 py-3">
          <NavLink to="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-950 dark:bg-cyan-600 text-white">
              <WalletCards size={23} />
            </div>
            <div>
              <p className="text-lg font-black leading-none text-slate-950 dark:text-white">ExpTrack</p>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Personal finance desk</p>
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
            <button
              type="button"
              onClick={toggleTheme}
              className="icon-btn mr-1"
              title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
            </button>
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
          <div className="border-t border-slate-200 dark:border-slate-800 bg-[#f6f7f4] dark:bg-slate-900 lg:hidden">
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
              <div className="flex gap-2 sm:col-span-2 mt-2">
                <button
                  type="button"
                  onClick={() => {
                    toggleTheme();
                    setIsOpen(false);
                  }}
                  className="icon-btn flex-1 flex items-center justify-center gap-2"
                >
                  {theme === "dark" ? (
                    <>
                      <Sun size={17} />
                      Light Mode
                    </>
                  ) : (
                    <>
                      <Moon size={17} />
                      Dark Mode
                    </>
                  )}
                </button>
                <button type="button" onClick={logout} className="secondary-btn flex-1">
                  <LogOut size={17} />
                  Logout
                </button>
              </div>
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
