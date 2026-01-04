"use client";

import React from "react";
import { motion } from "framer-motion";
import { Award, Shield, Truck } from "lucide-react";

const features = [
  {
    icon: <Award className="h-10 w-10" />,
    title: "Premium Materials",
    description: "Every piece is crafted from hand-selected solid wood and high-grade sustainable materials.",
  },
  {
    icon: <Shield className="h-10 w-10" />,
    title: "5 Year Warranty",
    description: "We stand by our craftsmanship. Enjoy peace of mind with our comprehensive quality guarantee.",
  },
  {
    icon: <Truck className="h-10 w-10" />,
    title: "Direct Delivery",
    description: "White-glove delivery and professional installation by our expert in-house logistics team.",
  },
];

const Features = () => {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group text-center"
            >
              <div className="mx-auto w-20 h-20 mb-8 rounded-full bg-brand-offwhite flex items-center justify-center text-brand-gold group-hover:bg-brand-gold group-hover:text-white transition-all duration-500">
                {feature.icon}
              </div>
              <h3 className="text-xl font-serif text-brand-charcoal mb-4 uppercase tracking-wider">{feature.title}</h3>
              <p className="text-gray-500 leading-relaxed max-w-xs mx-auto">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
