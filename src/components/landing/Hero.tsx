"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-brand-offwhite">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="z-10"
          >
            <span className="inline-block text-brand-gold font-medium tracking-widest uppercase text-sm mb-4">
              Est. 2015 — Premium Collection
            </span>
            <h1 className="text-6xl lg:text-8xl font-serif text-brand-charcoal leading-tight mb-6">
              Modern <br />
              <span className="italic font-normal">Elegance</span> <br />
              for Your Home
            </h1>
            <p className="text-gray-600 text-lg lg:text-xl max-w-md leading-relaxed mb-8">
              Discover our curated collection of artisanal furniture, where timeless craftsmanship meets contemporary design.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-brand-charcoal hover:bg-black text-white px-10 py-7 text-lg rounded-none transition-all duration-300">
                Explore Collection
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" className="border-brand-charcoal text-brand-charcoal px-10 py-7 text-lg rounded-none hover:bg-brand-charcoal hover:text-white transition-all duration-300">
                Custom Design
              </Button>
            </div>
            
            <div className="mt-12 flex items-center gap-8">
              <div>
                <p className="text-2xl font-serif text-brand-charcoal">2.5k+</p>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Happy Clients</p>
              </div>
              <div className="h-10 w-[1px] bg-brand-stone"></div>
              <div>
                <p className="text-2xl font-serif text-brand-charcoal">10Y</p>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Experience</p>
              </div>
            </div>
          </motion.div>

          {/* Image Side */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative h-[500px] lg:h-[700px]"
          >
            <div className="absolute inset-0 bg-brand-stone -z-10 translate-x-6 translate-y-6"></div>
            <img 
              src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=2070&auto=format&fit=crop" 
              alt="Premium Sofa"
              className="w-full h-full object-cover shadow-2xl"
            />
            
            {/* Floating Info */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="absolute bottom-8 -right-8 bg-white p-6 shadow-xl max-w-[200px] hidden lg:block"
            >
              <p className="text-brand-gold font-serif italic mb-1">New Arrival</p>
              <p className="text-brand-charcoal font-bold text-sm uppercase tracking-tight">Oslo Minimalist Sofa</p>
              <p className="text-xs text-gray-500 mt-2">Crafted from top-tier teak wood and premium linen.</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
      
      {/* Decorative Element */}
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
    </section>
  );
};

export default Hero;
