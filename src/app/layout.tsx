"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ArrowUp, Menu, X } from "lucide-react";
import "./app.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <html lang="en">
      <body className="font-inter min-h-screen bg-white">
        {/* Navbar */}
        <nav
          className={`fixed z-50 w-full transition-all duration-300 ${
            isScrolled
              ? "bg-white/95 shadow-lg backdrop-blur-sm"
              : "bg-transparent"
          }`}
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex-shrink-0">
                <h1
                  className="cursor-pointer text-2xl font-bold text-gray-900"
                  onClick={() => router.push("/")}
                >
                  Ajining Furniture
                </h1>
              </div>

              {/* Desktop Menu */}
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-8">
                  <button
                    onClick={() => router.push("/")}
                    className="px-3 py-2 text-sm font-medium text-gray-900 transition-colors hover:text-amber-600"
                  >
                    Home
                  </button>
                  <button
                    onClick={() => router.push("/catalog")}
                    className="px-3 py-2 text-sm font-medium text-gray-900 transition-colors hover:text-amber-600"
                  >
                    Catalog
                  </button>
                  <button
                    onClick={() => router.push("/contact")}
                    className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800"
                  >
                    Contact
                  </button>
                </div>
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden">
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="text-gray-900 hover:text-amber-600"
                >
                  {mobileMenuOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="border-t bg-white/95 backdrop-blur-sm md:hidden">
              <div className="space-y-1 px-2 pt-2 pb-3">
                <button
                  onClick={() => {
                    router.push("/");
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full px-3 py-2 text-left text-base font-medium text-gray-900 hover:text-amber-600"
                >
                  Home
                </button>
                <button
                  onClick={() => {
                    router.push("/catalog");
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full px-3 py-2 text-left text-base font-medium text-gray-900 hover:text-amber-600"
                >
                  Catalog
                </button>
                <button
                  onClick={() => {
                    router.push("/contact");
                    setMobileMenuOpen(false);
                  }}
                  className="mx-3 block rounded-md bg-gray-900 px-3 py-2 text-base font-medium text-white"
                >
                  Contact
                </button>
              </div>
            </div>
          )}
        </nav>

        {/* Main Content */}
        <main className="min-h-screen pt-16">{children}</main>

        {/* Footer */}
        <footer className="border-t bg-white py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 md:grid-cols-4">
              <div className="col-span-2">
                <h3 className="mb-4 text-2xl font-bold text-gray-900">
                  Ajining
                </h3>
                <p className="mb-6 leading-relaxed text-gray-600">
                  Premium furniture untuk rumah modern Anda. Kualitas terjamin,
                  desain eksklusif, dan layanan terbaik.
                </p>
                <div className="flex space-x-4">
                  <div className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-gray-100 transition-colors hover:bg-gray-900 hover:text-white">
                    <span className="text-sm font-bold">f</span>
                  </div>
                  <div className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-gray-100 transition-colors hover:bg-gray-900 hover:text-white">
                    <span className="text-sm font-bold">ig</span>
                  </div>
                  <div className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-gray-100 transition-colors hover:bg-gray-900 hover:text-white">
                    <span className="text-sm font-bold">tw</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="mb-4 font-semibold text-gray-900">
                  Quick Links
                </h4>
                <ul className="space-y-2 text-gray-600">
                  <li>
                    <button
                      onClick={() => router.push("/")}
                      className="transition-colors hover:text-gray-900"
                    >
                      Home
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => router.push("/catalog")}
                      className="transition-colors hover:text-gray-900"
                    >
                      Catalog
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => router.push("/contact")}
                      className="transition-colors hover:text-gray-900"
                    >
                      Contact
                    </button>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="mb-4 font-semibold text-gray-900">
                  Contact Info
                </h4>
                <ul className="space-y-2 text-gray-600">
                  <li>Jakarta, Indonesia</li>
                  <li>+62 21 1234 5678</li>
                  <li>hello@ajiningfurniture.com</li>
                  <li>Mon-Sat 9AM-6PM</li>
                </ul>
              </div>
            </div>
            <div className="mt-12 border-t pt-8 text-center text-gray-600">
              <p>&copy; 2025 Ajining Furniture. All rights reserved.</p>
            </div>
          </div>
        </footer>

        {/* Scroll to Top Button */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="fixed right-8 bottom-8 z-50 rounded-full bg-gray-900 p-3 text-white shadow-lg transition-all duration-300 hover:scale-110 hover:bg-gray-800"
          >
            <ArrowUp className="h-6 w-6" />
          </button>
        )}

        <style jsx>{`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .font-inter {
            font-family:
              "Inter",
              -apple-system,
              BlinkMacSystemFont,
              sans-serif;
          }

          html {
            scroll-behavior: smooth;
          }
        `}</style>
      </body>
    </html>
  );
}
