"use client";

import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const galleryImages = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop",
    title: "Minimalist Living",
    className: "col-span-2 row-span-2",
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?q=80&w=1000&auto=format&fit=crop",
    title: "Oak Textures",
    className: "col-span-1 row-span-1",
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1540932239986-30128078f3c5?q=80&w=1000&auto=format&fit=crop",
    title: "Atmospheric Lighting",
    className: "col-span-1 row-span-2",
  },
  {
    id: 4,
    url: "https://images.unsplash.com/photo-1567016432779-094069958ad5?q=80&w=1000&auto=format&fit=crop",
    title: "Timeless Study",
    className: "col-span-1 row-span-1",
  },
  {
    id: 5,
    url: "https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=1000&auto=format&fit=crop",
    title: "Velvet Accents",
    className: "col-span-2 row-span-1",
  },
];

const GalleryItem = ({ image, index }: { image: typeof galleryImages[0], index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.21, 0.45, 0.32, 0.9] }}
      className={`relative group overflow-hidden ${image.className}`}
    >
      <img
        src={image.url}
        alt={image.title}
        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-brand-charcoal/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center p-6 text-center">
        <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
          <p className="text-white font-serif italic text-xl mb-2">{image.title}</p>
          <div className="w-12 h-[1px] bg-brand-gold mx-auto"></div>
        </div>
      </div>
    </motion.div>
  );
};

const Gallery = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 100]);

  return (
    <section ref={containerRef} id="gallery" className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-20">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-brand-gold font-medium uppercase tracking-[0.3em] text-sm mb-4 block"
          >
            Aesthetics of Space
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-5xl lg:text-7xl font-serif text-brand-charcoal"
          >
            Curated <span className="italic">Spaces</span>
          </motion.h2>
        </div>

        {/* Unique Mosaic Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[250px] lg:auto-rows-[300px]">
          {/* Item 1 - Hero Image */}
          <GalleryItem image={galleryImages[0]} index={0} />

          {/* Item 2 */}
          <motion.div style={{ y: y1 }} className="col-span-1 row-span-1">
             <GalleryItem image={galleryImages[1]} index={1} />
          </motion.div>
          
          {/* Item 3 */}
          <GalleryItem image={galleryImages[2]} index={2} />

          {/* Item 4 */}
          <motion.div style={{ y: y2 }} className="col-span-1 row-span-1">
            <GalleryItem image={galleryImages[3]} index={3} />
          </motion.div>

          {/* Item 5 */}
          <GalleryItem image={galleryImages[4]} index={4} />
        </div>
        
        {/* Editorial Quote */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-24 text-center max-w-2xl mx-auto"
        >
          <p className="text-2xl font-serif italic text-gray-400 leading-relaxed">
            "Design is not just what it looks like and feels like. Design is how it works and how it transforms your daily rituals into moments of peace."
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <div className="w-12 h-[1px] bg-brand-stone"></div>
            <span className="text-xs uppercase tracking-widest text-brand-gold">M. Ajining — Lead Artisan</span>
            <div className="w-12 h-[1px] bg-brand-stone"></div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Gallery;
