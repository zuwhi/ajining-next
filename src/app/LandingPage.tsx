"use client";

import React from "react";
import Hero from "@/components/landing/Hero";
import About from "@/components/landing/About";
import CatalogEmbed from "@/components/landing/CatalogEmbed";
import Collections from "@/components/landing/Collections";
import Gallery from "@/components/landing/Gallery";
import Features from "@/components/landing/Features";
import Testimonials from "@/components/landing/Testimonials";
import CTA from "@/components/landing/CTA";

/**
 * FurnitureLandingPage - Main entry point for the landing page.
 * Refactored to use modular, premium components with Framer Motion animations.
 */
const FurnitureLandingPage = () => {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section - The First Impression */}
      <Hero />

      {/* About Section - Brand Story & Craftsmanship */}
      <About />

      {/* Digital Catalog Embed - Visual Exploration */}
      <CatalogEmbed />

      {/* Collections Section - Curated Furniture Pieces */}
      <Collections />

      {/* Unique Gallery - Visual Exploration of Spaces */}
      <Gallery />

      {/* Features Section - Why Choose Us */}
      <Features />

      {/* Testimonials - Voice of Excellence */}
      <Testimonials />

      {/* CTA Section - Conversion Point */}
      <CTA />
    </div>
  );
};

export default FurnitureLandingPage;
