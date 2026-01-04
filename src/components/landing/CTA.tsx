"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const CTA = () => {
  return (
    <section className="py-24 bg-brand-charcoal relative overflow-hidden">
      {/* Background Decorative Circles */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-gold/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-brand-gold/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
      
      <div className="container mx-auto px-4 lg:px-8 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <span className="text-brand-gold font-medium uppercase tracking-[0.3em] text-sm mb-6 block">Ready to Transform Your Space?</span>
          <h2 className="text-5xl lg:text-7xl font-serif text-white mb-8 leading-tight">
            Bring <span className="italic">Luxury</span> and <span className="italic">Comfort</span> <br /> to Your Home
          </h2>
          <p className="text-gray-400 text-lg lg:text-xl mb-12 max-w-2xl mx-auto">
            Consult with our expert design team today and receive a personalized quote for your dream furniture project.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button size="lg" className="bg-white text-brand-charcoal hover:bg-brand-gold hover:text-white px-12 py-8 text-lg rounded-none transition-all duration-300">
              Free Consultation
            </Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-brand-charcoal px-12 py-8 text-lg rounded-none transition-all duration-300">
              Get A Quote
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;
