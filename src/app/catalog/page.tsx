"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "@/components/landing/ProductCard";
import { Search } from "lucide-react";

interface ProductCategory {
  $id: string;
  name: string;
}

interface Product {
  name: string;
  price: number;
  category: string;
  image: string;
  slug: string;
}

export default function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const res = await fetch("/api/scrape");
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        setProducts([]);
      }
      setIsLoading(false);
    }
    fetchData();
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesCategory =
      !selectedCategory || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-brand-offwhite pb-24">
      {/* Header Section */}
      <section className="bg-white py-20 border-b border-brand-stone">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="text-brand-gold font-medium uppercase tracking-[0.3em] text-sm mb-4 block">Our Collection</span>
            <h1 className="text-5xl lg:text-7xl font-serif text-brand-charcoal mb-6 leading-tight">
              Artisan <span className="italic">Crafted</span> Catalog
            </h1>
            <p className="text-gray-500 text-lg">
              Explore our curation of premium furniture, each piece telling a story of tradition, quality, and modern elegance.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-6 mt-16">
        {/* Filter & Search Bar */}
        <div className="flex flex-col lg:flex-row gap-8 justify-between items-start lg:items-center mb-16">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative w-full lg:max-w-md group"
          >
            <Search className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-brand-gold transition-colors" />
            <input
              type="text"
              placeholder="Search our collection..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border-b border-brand-stone bg-transparent pl-8 py-3 text-lg placeholder:text-gray-400 focus:outline-none focus:border-brand-gold transition-all"
            />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-wrap gap-x-8 gap-y-4"
          >
            <button
              onClick={() => setSelectedCategory(null)}
              className={`text-sm font-medium uppercase tracking-[0.2em] transition-all relative py-2 ${
                !selectedCategory
                  ? "text-brand-charcoal"
                  : "text-gray-400 hover:text-brand-charcoal"
              }`}
            >
              All
              {!selectedCategory && (
                <motion.div layoutId="underline" className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand-gold" />
              )}
            </button>
            {/* Using derived categories from products since static categories list is empty in the original code */}
            {Array.from(new Set(products.map(p => p.category))).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-sm font-medium uppercase tracking-[0.2em] transition-all relative py-2 ${
                  selectedCategory === cat
                    ? "text-brand-charcoal"
                    : "text-gray-400 hover:text-brand-charcoal"
                }`}
              >
                {cat}
                {selectedCategory === cat && (
                  <motion.div layoutId="underline" className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand-gold" />
                )}
              </button>
            ))}
          </motion.div>
        </div>

        {/* Product Grid */}
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-24 text-center"
            >
              <div className="inline-block w-8 h-8 border-2 border-brand-gold border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-gray-500 font-serif italic text-xl">Discovering masterpieces...</p>
            </motion.div>
          ) : filteredProducts.length === 0 ? (
            <motion.div 
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-24 text-center border-2 border-dashed border-brand-stone rounded-xl"
            >
              <p className="text-gray-500 font-serif italic text-xl">No treasures found for this search.</p>
              <button 
                onClick={() => {setSearch(""); setSelectedCategory(null);}}
                className="mt-4 text-brand-gold underline underline-offset-4 uppercase tracking-widest text-xs font-bold"
              >
                Clear Filters
              </button>
            </motion.div>
          ) : (
            <motion.div 
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-4"
            >
              {filteredProducts.map((product, index) => (
                <ProductCard key={product.slug + index} product={product} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Decorative Badge */}
      <div className="container mx-auto px-6 mt-32">
        <div className="h-[1px] bg-brand-stone w-full mb-12" />
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-gray-400 text-sm uppercase tracking-widest leading-relaxed text-center md:text-left">
            Showing {filteredProducts.length} of {products.length} exclusive pieces
          </p>
          <div className="flex items-center gap-4">
             <span className="text-xs font-bold text-brand-charcoal uppercase tracking-tighter">Premium Quality</span>
             <div className="w-2 h-2 rounded-full bg-brand-gold" />
             <span className="text-xs font-bold text-brand-charcoal uppercase tracking-tighter">Handcrafted</span>
          </div>
        </div>
      </div>
    </div>
  );
}
