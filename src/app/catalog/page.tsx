"use client";

import React, { useEffect, useState } from "react";
// import { getProductImageUrl } from "../dashboard/product/page";
import {
  databases,
  DATABASE_ID,
  COLLECTION_PRODUCT_CATEGORY_ID,
} from "@/lib/appwrite";

interface ProductCategory {
  $id: string;
  name: string;
}

interface Product {
  name: string;
  price: number;
  category: string;
  image: string;
  slug: string;
}

export default function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const res = await fetch("/api/scrape");
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        setProducts([]);
      }
      setIsLoading(false);
    }
    fetchData();
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesCategory =
      !selectedCategory || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <section className="mt-8 min-h-screen bg-white pb-20 font-sans text-black">
      <div className="mx-auto max-w-7xl px-6">
        {/* Filter */}
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <input
            type="text"
            placeholder="Cari furnitur..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border-b border-black bg-transparent px-2 py-2 text-lg placeholder:text-gray-400 focus:outline-none md:max-w-md"
          />
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-1 text-sm tracking-wide uppercase transition ${
                !selectedCategory
                  ? "underline underline-offset-4"
                  : "opacity-50 hover:opacity-100"
              }`}
            >
              Semua
            </button>
            {categories.map((cat) => (
              <button
                key={cat.$id}
                onClick={() => setSelectedCategory(cat.$id)}
                className={`px-4 py-1 text-sm tracking-wide uppercase transition ${
                  selectedCategory === cat.$id
                    ? "underline underline-offset-4"
                    : "opacity-50 hover:opacity-100"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Produk Grid */}
        {isLoading ? (
          <div className="text-center text-gray-500">Memuat produk...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center text-gray-500">
            Tidak ada produk ditemukan.
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {filteredProducts.map((product) => {
              return (
                <div
                  key={product.name + product.price}
                  className="group cursor-pointer"
                  onMouseEnter={() =>
                    setHoveredProduct(product.name + product.price)
                  }
                  onMouseLeave={() => setHoveredProduct(null)}
                >
                  <a href={`/catalog/${product.slug}`} className="block">
                    <div className="relative h-80 w-full overflow-hidden rounded-lg shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-gray-100 text-gray-400">
                          No Image
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/0 transition-all duration-300 group-hover:bg-black/20"></div>
                      <div
                        className={`absolute inset-x-0 bottom-0 transform bg-gradient-to-t from-black/80 to-transparent p-5 transition-all duration-300 ${hoveredProduct === product.name + product.price ? "translate-y-0" : "translate-y-2"}`}
                      >
                        <div className="text-white">
                          <p className="mb-1 text-sm font-medium">
                            {product.category}
                          </p>
                          <h3 className="mb-2 text-lg font-bold">
                            {product.name}
                          </h3>
                          <p className="text-base font-semibold">
                            Rp {product.price.toLocaleString("id-ID")}
                          </p>
                        </div>
                      </div>
                    </div>
                  </a>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
