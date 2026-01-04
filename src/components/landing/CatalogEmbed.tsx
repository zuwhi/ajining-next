"use client";

import React from "react";
import { motion } from "framer-motion";

const CatalogEmbed = () => {
  return (
    <section id="digital-catalog" className="py-24 bg-white relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-brand-gold font-medium uppercase tracking-[0.3em] text-sm mb-4 block"
          >
            Visual Exploration
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl lg:text-5xl font-serif text-brand-charcoal"
          >
            Digital <span className="italic">Lookbook</span>
          </motion.h2>
          <motion.div 
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="w-24 h-[1px] bg-brand-gold mx-auto mt-8"
          />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative w-full aspect-[4/3] lg:aspect-[16/9] shadow-2xl rounded-sm overflow-hidden bg-brand-offwhite"
        >
          <iframe 
            src="https://online.fliphtml5.com/pskith/gild/?1767068850175" 
            className="absolute inset-0 w-full h-full"
            style={{ border: "none" }}
            allowFullScreen
            loading="lazy"
            title="Ajining Furniture Digital Catalog"
          />
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <p className="text-gray-400 font-serif italic text-lg">
            Turn the pages to discover our signature collection of masterfully crafted pieces.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default CatalogEmbed;
