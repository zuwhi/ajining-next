"use client";

import React from "react";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Wijaya",
    role: "Interior Designer",
    content:
      "The quality of the furniture is exceptional! Every detail shows premium craftsmanship. My clients are always satisfied with recommendations from Ajining.",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
  },
  {
    name: "David Chen",
    role: "Property Developer",
    content:
      "We've been collaborating for 3 years on high-end property projects. The consistency in quality and design always impresses our investors.",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
  },
  {
    name: "Melissa Tanoto",
    role: "Homeowner",
    content:
      "Our home is truly transformed! The Ajining team understood our vision and delivered furniture that went beyond our expectations.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
  },
];

const Testimonials = () => {
  return (
    <section className="py-24 bg-brand-offwhite relative">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-brand-gold font-medium uppercase tracking-[0.3em] text-sm mb-4 block"
          >
            Voice of Excellence
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl lg:text-5xl font-serif text-brand-charcoal"
          >
            Kind <span className="italic">Words</span> from Clients
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {testimonials.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white p-10 relative shadow-sm hover:shadow-xl transition-shadow duration-500"
            >
              <Quote className="absolute top-6 left-6 h-12 w-12 text-brand-gold/10" />
              
              <p className="text-gray-600 italic leading-relaxed mb-8 relative z-10">
                "{item.content}"
              </p>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-brand-stone">
                  <img src={item.avatar} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-serif text-brand-charcoal font-bold">{item.name}</h4>
                  <p className="text-xs text-brand-gold uppercase tracking-widest">{item.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
