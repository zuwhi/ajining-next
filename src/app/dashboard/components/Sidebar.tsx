"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  HomeIcon,
  WalletIcon,
  TagIcon,
  ChartBarIcon,
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ShoppingCartIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import { logout } from "@/lib/auth";

const menuItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: HomeIcon,
  },
  {
    title: "Transaksi & Kategori",
    href: "/dashboard/cash-category",
    icon: WalletIcon,
  },
  {
    title: "Produk",
    href: "/dashboard/product",
    icon: ShoppingCartIcon,
  },
  {
    title: "Kategori Produk",
    href: "/dashboard/product-category",
    icon: TagIcon,
  },
  {
    title: "Cart",
    href: "/dashboard/cart",
    icon: ShoppingCartIcon,
  },
  {
    title: "Nota",
    href: "/dashboard/nota",
    icon: DocumentTextIcon,
  },
  {
    title: "Reports",
    href: "/dashboard/reports",
    icon: ChartBarIcon,
  },
];

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const pathname = usePathname();

  // Persist collapsed state in localStorage
  useEffect(() => {
    const collapsed = localStorage.getItem("sidebar-collapsed");
    if (collapsed === "true") setIsCollapsed(true);
  }, []);
  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", isCollapsed ? "true" : "false");
  }, [isCollapsed]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      // Redirect to login page after logout
      window.location.replace("/auth/login");
    } catch (error) {
      console.error("Logout error:", error);
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 rounded-full bg-teal-600 text-white shadow-lg transition-all hover:bg-teal-700 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <XMarkIcon className="h-6 w-6" />
        ) : (
          <Bars3Icon className="h-6 w-6" />
        )}
      </Button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 transition-opacity md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          // Base styles
          "z-40 h-screen rounded-r-xl border-r border-teal-100 bg-white shadow-xl",
          // Mobile styles: fixed position, full height, slide animation
          "fixed top-0 left-0 h-full w-64 -translate-x-full transition-transform duration-300 ease-in-out",
          // Desktop styles: static position, border
          "md:static md:translate-x-0 md:rounded-none md:shadow-none",
          // Show on mobile when open
          isOpen && "translate-x-0",
          // Collapsed state for desktop
          isCollapsed && "w-64 md:w-20",
        )}
      >
        <div
          className={cn(
            "mt-4 flex h-screen flex-col p-6 transition-all duration-300 md:mt-0",
            isCollapsed && "p-2",
          )}
        >
          {/* Collapse/Expand button (desktop only) */}
          <button
            type="button"
            className={cn(
              "absolute top-4 right-[-16px] z-50 hidden h-8 w-8 items-center justify-center rounded-full border border-teal-100 bg-white shadow transition-all hover:bg-teal-50 md:flex",
              isCollapsed && "right-[-16px]",
            )}
            onClick={() => setIsCollapsed((prev) => !prev)}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRightIcon className="h-5 w-5 text-teal-600" />
            ) : (
              <ChevronLeftIcon className="h-5 w-5 text-teal-600" />
            )}
          </button>
          <div
            className={cn(
              "mt-4 mb-8 flex items-center justify-center transition-all duration-300",
              isCollapsed && "mt-2 mb-4",
            )}
          >
            <span
              className={cn(
                "inline-flex items-center gap-2 text-3xl font-extrabold tracking-tight text-teal-700 transition-all duration-300",
                isCollapsed && "gap-0 text-xl",
              )}
            >
              <svg
                width={isCollapsed ? "24" : "28"}
                height={isCollapsed ? "24" : "28"}
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="10" fill="#14b8a6" />
                <path
                  d="M8 12l2 2 4-4"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {!isCollapsed && "Ajining"}
            </span>
          </div>

          <nav className="flex-1 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-5 py-3 text-base font-medium transition-all",
                    active
                      ? "bg-teal-50 text-teal-700 shadow-md"
                      : "text-gray-600 hover:bg-teal-100 hover:text-teal-700",
                    isCollapsed && "justify-center gap-0 px-2 py-3",
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  <Icon
                    className={cn(
                      "h-6 w-6",
                      active ? "text-teal-600" : "text-gray-400",
                    )}
                  />
                  {!isCollapsed && <span>{item.title}</span>}
                </Link>
              );
            })}
          </nav>

          {/* Logout button */}
          <div
            className={cn(
              "mt-auto border-t border-gray-100 pt-4 transition-all duration-300",
              isCollapsed && "pt-2",
            )}
          >
            <Button
              variant="ghost"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className={cn(
                "w-full justify-start gap-3 rounded-xl px-5 py-3 text-base font-medium text-red-600 transition-all hover:bg-red-50 hover:text-red-700",
                isCollapsed && "justify-center gap-0 px-2 py-3",
              )}
            >
              <ArrowLeftOnRectangleIcon className="h-6 w-6" />
              {!isCollapsed && (
                <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom bar for mobile (bonus) */}
      <div className="shadow-t fixed right-0 bottom-0 left-0 z-50 flex justify-around rounded-t-xl border-t border-teal-100 bg-white py-2 md:hidden">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 px-2 py-1 text-xs font-medium transition-all",
                active ? "text-teal-600" : "text-gray-400 hover:text-teal-600",
              )}
            >
              <Icon className="h-6 w-6" />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </div>
    </>
  );
}
