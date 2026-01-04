"use client";

import React from "react";
import { motion } from "framer-motion";

import Link from "next/link";

interface ProductCardProps {
  product: {
    id?: number | string;
    name: string;
    price: string | number;
    image: string;
    category: string;
    slug?: string;
  };
}

const ProductCard = ({ product }: ProductCardProps) => {
  const formattedPrice = typeof product.price === "number" 
    ? `Rp ${product.price.toLocaleString("id-ID")}` 
    : product.price;

  const content = (
    <div className="group">
      <div className="relative overflow-hidden bg-brand-offwhite">
        <div className="aspect-[4/5] overflow-hidden">
          <img 
            src={product.image || "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=800&fit=crop"} 
            alt={product.name} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        </div>
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-brand-charcoal/10 mix-blend-multiply opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        {/* Quick Add / Detail Button */}
        <div className="absolute bottom-0 left-0 w-full p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out">
          <button className="w-full bg-brand-charcoal text-white py-3 text-sm uppercase tracking-widest font-medium hover:bg-black transition-colors">
            View Details
          </button>
        </div>
      </div>
      
      <div className="mt-4 flex justify-between items-start">
        <div>
          <p className="text-xs text-brand-gold uppercase tracking-widest mb-1">{product.category}</p>
          <h3 className="text-brand-charcoal font-serif text-lg group-hover:text-brand-gold transition-colors duration-300">
            {product.name}
          </h3>
        </div>
        <p className="text-brand-charcoal font-medium">{formattedPrice}</p>
      </div>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      {product.slug ? (
        <Link href={`/catalog/${product.slug}`} className="block">
          {content}
        </Link>
      ) : (
        content
      )}
    </motion.div>
  );
};

export default ProductCard;
