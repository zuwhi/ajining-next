"use client";

import React from "react";
import { motion } from "framer-motion";

const About = () => {
  return (
    <section id="about" className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          {/* Images Grid */}
          <div className="lg:w-1/2 relative">
            <div className="grid grid-cols-2 gap-4">
              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="aspect-[3/4] overflow-hidden"
              >
                <img 
                  src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=800&fit=crop" 
                  alt="Joinery detail" 
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                />
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: -40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="aspect-[3/4] overflow-hidden mt-12"
              >
                <img 
                  src="https://images.unsplash.com/photo-1594913785162-e6786b42dea3?w=600&h=800&fit=crop" 
                  alt="Workshop" 
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                />
              </motion.div>
            </div>
            
            {/* Year Badge */}
            <motion.div 
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-brand-charcoal text-white flex flex-col items-center justify-center border-8 border-white"
            >
              <span className="text-xs uppercase tracking-tighter">Since</span>
              <span className="text-2xl font-serif font-bold">2015</span>
            </motion.div>
          </div>

          {/* Content */}
          <div className="lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-brand-gold font-medium uppercase tracking-[0.2em] text-sm mb-4 block">Our Story</span>
              <h2 className="text-4xl lg:text-5xl font-serif text-brand-charcoal mb-8 leading-tight">
                Crafted with <br />
                <span className="italic font-normal">Passion & Precision</span>
              </h2>
              <div className="space-y-6 text-gray-600 text-lg leading-relaxed">
                <p>
                  At Ajining, we believe that furniture is more than just objects in a room. It's the silent witness to your life's best moments, the anchor of your sanctuary, and an investment in your well-being.
                </p>
                <p>
                  Since 2015, we've dedicated ourselves to the art of traditional Indonesian woodworking blended with modern minimalist aesthetics. Every piece is hand-selected from sustainable teak forests and meticulously crafted by master artisans who have perfected their trade over generations.
                </p>
                <p className="font-serif italic text-brand-charcoal text-xl">
                  "Quality is not an act, it is a habit."
                </p>
              </div>
              
              <div className="mt-12 grid grid-cols-2 gap-8">
                <div>
                  <h4 className="font-serif text-brand-charcoal text-xl mb-2 underline decoration-brand-gold underline-offset-8">Material</h4>
                  <p className="text-sm text-gray-500">Only the finest A-grade solid wood and premium fabrics.</p>
                </div>
                <div>
                  <h4 className="font-serif text-brand-charcoal text-xl mb-2 underline decoration-brand-gold underline-offset-8">Artistry</h4>
                  <p className="text-sm text-gray-500">Traditional techniques met with modern precision tools.</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
