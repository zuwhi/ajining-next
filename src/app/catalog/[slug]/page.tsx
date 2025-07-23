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
      <p key={index} className="mb-6 leading-relaxed">
        {paragraph}
      </p>
    ));
  };

  if (loading) return <div className="p-12 text-center">Loading...</div>;
  if (error)
    return <div className="p-12 text-center text-red-600">Error: {error}</div>;
  if (!productData)
    return <div className="p-12 text-center">Produk tidak ditemukan</div>;

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Breadcrumb */}
      {/* <nav className="border-b border-gray-100 px-6 py-4 text-sm text-gray-600">
        <div className="mx-auto max-w-7xl">
          <span>Beranda</span>
          <span className="mx-2">/</span>
          <span>Produk</span>
          <span className="mx-2">/</span>
          <span className="text-black">{productData.category}</span>
        </div>
      </nav> */}

      <div className="mx-auto max-w-7xl px-6 py-12">
        {/* Header */}
        <header className="mb-12">
          <div className="mb-4 inline-block rounded-md border border-gray-300 px-3 py-1 text-xs text-gray-700">
            {productData.category}
          </div>
          <h1 className="mb-6 text-4xl leading-tight font-light md:text-5xl">
            {productData.title}
          </h1>
        </header>

        <div className="mb-16 grid grid-cols-1 gap-16 lg:grid-cols-2">
          {/* Gallery */}
          <div className="space-y-6">
            <div className="relative aspect-square overflow-hidden rounded-md bg-gray-50">
              <img
                src={productData.images[selectedImageIndex]}
                alt={`${productData.title} - Gambar ${selectedImageIndex + 1}`}
                className="h-full w-full cursor-pointer object-cover transition-opacity hover:opacity-95"
                onClick={() => setIsLightboxOpen(true)}
              />
              {productData.images.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute top-1/2 left-4 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-lg transition-colors hover:bg-white"
                    aria-label="Gambar sebelumnya"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute top-1/2 right-4 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-lg transition-colors hover:bg-white"
                    aria-label="Gambar selanjutnya"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
            </div>

            {productData.images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto">
                {productData.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border-2 transition-colors ${
                      selectedImageIndex === index
                        ? "border-black"
                        : "border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-8">
            <div className="text-3xl font-light">{productData.price}</div>

            <p className="text-lg leading-relaxed text-gray-800">
              {productData.shortDescription}
            </p>

            <div className="space-y-4">
              <button className="w-full rounded-md bg-black px-6 py-4 text-lg font-medium text-white transition-colors hover:bg-gray-900">
                Pesan Sekarang
              </button>
              <button className="flex w-full items-center justify-center gap-2 rounded-md border border-black px-6 py-4 text-lg font-medium text-black transition-colors hover:bg-gray-50">
                <MessageCircle className="h-5 w-5" />
                Konsultasi via WhatsApp
              </button>
            </div>
          </div>
        </div>

        {/* Specifications */}
        <section className="mb-16">
          <h2 className="mb-8 text-2xl font-light">Spesifikasi Produk</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {Object.entries(productData.specs).map(([key, value]) => (
              <div
                key={key}
                className="flex flex-col space-y-2 rounded-md border border-gray-200 p-6"
              >
                <dt className="font-mono text-sm tracking-wider text-gray-600 uppercase">
                  {key}
                </dt>
                <dd className="font-mono text-lg">{value}</dd>
              </div>
            ))}
          </div>
        </section>

        {/* Long Description */}
        <section className="mb-16">
          <h2 className="mb-8 text-2xl font-light">Deskripsi Lengkap</h2>
          <div className="prose max-w-none">
            <div className="space-y-6 text-lg leading-relaxed">
              {formatDescription(productData.longDescription)}
            </div>
          </div>
        </section>

        {/* Related Products */}
        <section className="mb-16">
          <h2 className="mb-8 text-2xl font-light">Produk Terkait</h2>
          <div className="relative">
            <div className="flex gap-6 overflow-hidden">
              {productData.relatedProducts
                .slice(relatedProductIndex, relatedProductIndex + 3)
                .map((product, index) => (
                  <div key={index} className="min-w-0 flex-1">
                    <div className="group cursor-pointer">
                      <div className="mb-4 aspect-[3/2] overflow-hidden rounded-md bg-gray-100">
                        <img
                          src={product.image}
                          alt={product.title}
                          className="h-full w-full object-cover transition-opacity group-hover:opacity-90"
                        />
                      </div>
                      <h3 className="mb-2 text-lg font-light transition-colors group-hover:text-gray-700">
                        {product.title}
                      </h3>
                      <p className="font-mono text-xl">{product.price}</p>
                    </div>
                  </div>
                ))}
            </div>

            {productData.relatedProducts.length > 3 && (
              <div className="mt-8 flex justify-center gap-4">
                <button
                  onClick={handlePrevRelated}
                  className="rounded-full border border-gray-300 p-2 transition-colors hover:border-black"
                  aria-label="Produk terkait sebelumnya"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={handleNextRelated}
                  className="rounded-full border border-gray-300 p-2 transition-colors hover:border-black"
                  aria-label="Produk terkait selanjutnya"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="border-t border-gray-200 py-16 text-center">
          <h2 className="mb-6 text-3xl font-light">
            Tertarik dengan Produk Ini?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-700">
            Konsultasikan kebutuhan furniture ukiran Anda dengan tim ahli kami.
            Kami siap membantu mewujudkan desain impian Anda.
          </p>
          <div className="mx-auto flex max-w-md flex-col justify-center gap-4 sm:flex-row">
            <button className="rounded-md bg-black px-8 py-3 text-white transition-colors hover:bg-gray-900">
              Hubungi Kami
            </button>
            <a
              href={productData.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-md border border-black px-8 py-3 text-black transition-colors hover:bg-gray-50"
            >
              <ExternalLink className="h-4 w-4" />
              Lihat Asli
            </a>
          </div>
        </section>
      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && productData && (
        <div
          className="bg-opacity-90 fixed inset-0 z-50 flex items-center justify-center bg-black p-6"
          onClick={() => setIsLightboxOpen(false)}
        >
          <div className="relative max-h-full max-w-4xl">
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="absolute -top-12 right-0 text-white transition-colors hover:text-gray-300"
              aria-label="Tutup lightbox"
            >
              <X className="h-8 w-8" />
            </button>
            <img
              src={productData.images[selectedImageIndex]}
              alt={`${productData.title} - Gambar ${selectedImageIndex + 1}`}
              className="max-h-full max-w-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            {productData.images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrevImage();
                  }}
                  className="absolute top-1/2 left-4 -translate-y-1/2 rounded-full bg-white/20 p-3 text-white transition-colors hover:bg-white/30"
                  aria-label="Gambar sebelumnya"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNextImage();
                  }}
                  className="absolute top-1/2 right-4 -translate-y-1/2 rounded-full bg-white/20 p-3 text-white transition-colors hover:bg-white/30"
                  aria-label="Gambar selanjutnya"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;
