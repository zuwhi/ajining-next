"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header>
      <nav
        className={`fixed z-50 w-full transition-all duration-500 ${
          scrolled ? "bg-white/95 shadow-md backdrop-blur-md py-2" : "bg-transparent py-4"
        }`}
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 group">
              <span className="text-2xl font-serif font-bold text-brand-charcoal tracking-tight">
                Ajining<span className="text-brand-gold italic font-normal ml-1 group-hover:pl-1 transition-all">Furniture</span>
              </span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden items-center space-x-12 md:flex">
              <Link
                href="/"
                className="text-xs font-medium uppercase tracking-[0.2em] text-brand-charcoal transition-all hover:text-brand-gold"
              >
                Home
              </Link>
              <Link
                href="/catalog"
                className="text-xs font-medium uppercase tracking-[0.2em] text-brand-charcoal transition-all hover:text-brand-gold"
              >
                Catalog
              </Link>
              <Link
                href="/contact"
                className="bg-brand-charcoal text-white px-8 py-3 text-xs font-medium uppercase tracking-[0.2em] hover:bg-black transition-all"
              >
                Contact
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="p-2 md:hidden text-brand-charcoal hover:text-brand-gold transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden overflow-hidden bg-white border-t border-brand-stone"
              >
                <div className="space-y-4 px-2 pt-6 pb-8 text-center">
                  <Link
                    href="/"
                    className="block text-sm font-medium uppercase tracking-[0.2em] text-brand-charcoal hover:text-brand-gold"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Home
                  </Link>
                  <Link
                    href="/catalog"
                    className="block text-sm font-medium uppercase tracking-[0.2em] text-brand-charcoal hover:text-brand-gold"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Catalog
                  </Link>
                  <Link
                    href="/contact"
                    className="mx-auto max-w-[200px] block bg-brand-charcoal text-white py-3 text-sm font-medium uppercase tracking-[0.2em] hover:bg-black"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Contact
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>
    </header>
  );
};

export default Header;
