"use client";

import React from "react";
import { motion } from "framer-motion";
import ProductCard from "./ProductCard";

const products = [
  {
    id: 1,
    name: "Oslo Minimalist Sofa",
    price: "Rp 12.500.000",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=800&fit=crop",
    category: "Living Room",
  },
  {
    id: 2,
    name: "Scandinavia Dining Table",
    price: "Rp 8.500.000",
    image: "https://images.unsplash.com/photo-1549497538-303791108f95?w=600&h=800&fit=crop",
    category: "Dining Room",
  },
  {
    id: 3,
    name: "Premium Teak Wardrobe",
    price: "Rp 15.000.000",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=800&fit=crop",
    category: "Bedroom",
  },
  {
    id: 4,
    name: "Ergonomic Work Chair",
    price: "Rp 4.250.000",
    image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=600&h=800&fit=crop",
    category: "Office",
  },
];

const Collections = () => {
  return (
    <section id="collections" className="py-24 bg-brand-offwhite">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <span className="text-brand-gold font-medium uppercase tracking-[0.2em] text-sm mb-4 block">Curated Pieces</span>
            <h2 className="text-4xl lg:text-5xl font-serif text-brand-charcoal leading-tight">
              Featured <span className="italic">Collections</span>
            </h2>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <button className="group text-brand-charcoal font-medium uppercase tracking-widest text-sm flex items-center gap-2 hover:text-brand-gold transition-colors duration-300">
              View All Products
              <span className="w-8 h-[1px] bg-brand-charcoal group-hover:bg-brand-gold transition-colors duration-300"></span>
            </button>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Collections;
