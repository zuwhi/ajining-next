"use client";

import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  X,
  ExternalLink,
  MessageCircle,
} from "lucide-react";
import { useParams } from "next/navigation";

interface ProductSpecs {
  [key: string]: string;
}

interface RelatedProduct {
  title: string;
  url: string;
  image: string;
  price: string;
}

interface ProductData {
  title: string;
  category: string;
  price: string;
  shortDescription: string;
  longDescription: string;
  specs: ProductSpecs;
  images: string[];
  relatedProducts: RelatedProduct[];
  sourceUrl: string;
}

import { motion, AnimatePresence } from "framer-motion";

const ProductDetailPage: React.FC = () => {
  const params = useParams();
  const slug = params?.slug as string;

  const [productData, setProductData] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);
  const [relatedProductIndex, setRelatedProductIndex] = useState<number>(0);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError(null);
    setProductData(null);
    const url = `https://samisukofurnicraftjepara.com/produk/${slug}/`;
    fetch("/api/scrape-detail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setProductData(data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [slug]);

  const handlePrevImage = () => {
    if (!productData) return;
    setSelectedImageIndex((prev) =>
      prev === 0 ? productData.images.length - 1 : prev - 1,
    );
  };

  const handleNextImage = () => {
    if (!productData) return;
    setSelectedImageIndex((prev) =>
      prev === productData.images.length - 1 ? 0 : prev + 1,
    );
  };

  const handlePrevRelated = () => {
    if (!productData) return;
    setRelatedProductIndex((prev) =>
      prev === 0
        ? Math.max(0, productData.relatedProducts.length - 3)
        : prev - 1,
    );
  };

  const handleNextRelated = () => {
    if (!productData) return;
    setRelatedProductIndex((prev) =>
      prev >= productData.relatedProducts.length - 3 ? 0 : prev + 1,
    );
  };

  const formatDescription = (text: string) => {
    return text.split("\n").map((paragraph, index) => (
      <p key={index} className="mb-6">
        {paragraph}
      </p>
    ));
  };

  if (loading) return (
    <div className="min-h-screen bg-brand-offwhite flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-brand-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="font-serif italic text-2xl text-brand-charcoal">Curating Details...</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen bg-brand-offwhite flex items-center justify-center p-12">
      <div className="text-center max-w-md">
         <h2 className="text-3xl font-serif text-brand-charcoal mb-4">Something went wrong</h2>
         <p className="text-red-600 mb-8">{error}</p>
         <button onClick={() => window.location.reload()} className="px-8 py-3 bg-brand-charcoal text-white uppercase tracking-widest text-sm font-bold">Try Again</button>
      </div>
    </div>
  );

  if (!productData) return <div className="p-12 text-center font-serif italic text-2xl">Masterpiece not found.</div>;

  return (
    <div className="min-h-screen bg-brand-offwhite text-brand-charcoal pb-24">
      {/* Product Hero Section */}
      <section className="bg-white border-b border-brand-stone py-12 lg:py-24">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
            {/* Gallery Column */}
            <div className="space-y-6">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative aspect-square overflow-hidden bg-brand-offwhite group cursor-zoom-in"
                onClick={() => setIsLightboxOpen(true)}
              >
                <AnimatePresence mode="wait">
                  <motion.img
                    key={selectedImageIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    src={productData.images[selectedImageIndex]}
                    alt={productData.title}
                    className="w-full h-full object-cover"
                  />
                </AnimatePresence>
                
                {productData.images.length > 1 && (
                  <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={(e) => { e.stopPropagation(); handlePrevImage(); }}
                      className="w-12 h-12 rounded-full bg-white/80 shadow-lg flex items-center justify-center hover:bg-white transition-colors"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleNextImage(); }}
                      className="w-12 h-12 rounded-full bg-white/80 shadow-lg flex items-center justify-center hover:bg-white transition-colors"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>
                  </div>
                )}
              </motion.div>

              {productData.images.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                  {productData.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`relative w-24 h-24 flex-shrink-0 overflow-hidden border-2 transition-all ${
                        selectedImageIndex === index ? "border-brand-gold" : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img src={image} className="w-full h-full object-cover" alt={`Gallery ${index}`} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info Column */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col h-full justify-between py-4"
            >
              <div>
                <span className="text-brand-gold font-medium uppercase tracking-[0.3em] text-xs mb-4 block">
                  {productData.category}
                </span>
                <h1 className="text-5xl lg:text-7xl font-serif leading-tight mb-8">
                  {productData.title}
                </h1>
                <div className="text-3xl font-light text-brand-charcoal/80 mb-8 border-b border-brand-stone pb-8">
                  {productData.price}
                </div>
                
                <div className="text-gray-500 text-lg leading-relaxed space-y-4 mb-12 max-w-xl">
                  {productData.shortDescription}
                </div>
              </div>

              <div className="space-y-4 max-w-md">
                <button className="w-full bg-brand-charcoal text-white py-5 px-8 text-sm uppercase tracking-[0.2em] font-bold hover:bg-black transition-all duration-300">
                  Contact Specialist
                </button>
                <div className="flex gap-4">
                  <button className="flex-1 flex items-center justify-center gap-2 border border-brand-stone py-5 px-8 text-sm uppercase tracking-[0.2em] font-bold hover:bg-brand-gold hover:text-white transition-all duration-300">
                    <MessageCircle className="h-4 w-4" />
                    WhatsApp
                  </button>
                  <a 
                    href={productData.sourceUrl} 
                    target="_blank" 
                    className="w-16 flex items-center justify-center border border-brand-stone hover:bg-gray-50 transition-colors"
                  >
                    <ExternalLink className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Specifications & Details Section */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-24">
            {/* Left Col: Specs */}
            <div className="lg:col-span-4">
              <h2 className="text-2xl font-serif italic mb-12 border-l-4 border-brand-gold pl-6">Specifications</h2>
              <dl className="space-y-1">
                {Object.entries(productData.specs).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-6 border-b border-brand-stone group">
                    <dt className="text-xs uppercase tracking-[0.2em] text-gray-400 group-hover:text-brand-gold transition-colors">{key}</dt>
                    <dd className="text-sm font-medium">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Right Col: Long Description */}
            <div className="lg:col-span-8">
              <h2 className="text-2xl font-serif italic mb-12 border-l-4 border-brand-gold pl-6">Deep Narrative</h2>
              <div className="prose prose-brand text-gray-600 max-w-none text-xl leading-relaxed">
                {formatDescription(productData.longDescription)}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {productData.relatedProducts.length > 0 && (
        <section className="py-24 border-t border-brand-stone bg-white">
          <div className="container mx-auto px-6">
            <div className="flex justify-between items-end mb-16">
              <div>
                <span className="text-brand-gold font-medium uppercase tracking-[0.3em] text-xs mb-4 block">Recommended</span>
                <h2 className="text-4xl lg:text-5xl font-serif">Related <span className="italic">Treasures</span></h2>
              </div>
              {productData.relatedProducts.length > 3 && (
                <div className="flex gap-4">
                  <button onClick={handlePrevRelated} className="w-12 h-12 border border-brand-stone flex items-center justify-center hover:border-brand-gold hover:text-brand-gold transition-colors rounded-full">
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button onClick={handleNextRelated} className="w-12 h-12 border border-brand-stone flex items-center justify-center hover:border-brand-gold hover:text-brand-gold transition-colors rounded-full">
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <AnimatePresence mode="popLayout text-center">
                {productData.relatedProducts
                  .slice(relatedProductIndex, relatedProductIndex + 3)
                  .map((product, index) => (
                    <motion.div
                      key={product.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="group cursor-pointer"
                    >
                      <div className="aspect-[3/2] overflow-hidden bg-brand-offwhite mb-6">
                        <img src={product.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt={product.title} />
                      </div>
                      <h4 className="font-serif text-xl mb-2 group-hover:text-brand-gold transition-colors">{product.title}</h4>
                      <p className="text-brand-gold font-medium text-lg">{product.price}</p>
                    </motion.div>
                  ))
                }
              </AnimatePresence>
            </div>
          </div>
        </section>
      )}

      {/* Lightbox Modal */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-brand-charcoal/95 p-6 md:p-12"
            onClick={() => setIsLightboxOpen(false)}
          >
            <button className="absolute top-8 right-8 text-white hover:text-brand-gold">
              <X className="h-10 w-10" />
            </button>
            <motion.div 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-6xl max-h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={productData.images[selectedImageIndex]}
                className="w-full h-full object-contain shadow-2xl"
                alt="Product High Res"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductDetailPage;
