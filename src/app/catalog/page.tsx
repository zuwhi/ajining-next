"use client";

import React, { useEffect, useState } from "react";
import {
  fetchProductsFromAppwrite,
  getProductImageUrl,
} from "../dashboard/product/page";
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
  $id: string;
  name: string;
  desc: string;
  slug: string;
  price: number;
  date: string;
  images: string;
  productCategory: any[];
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
      const data = await fetchProductsFromAppwrite();
      setProducts(data);
      setIsLoading(false);
    }

    async function fetchCategories() {
      try {
        const response = await databases.listDocuments(
          DATABASE_ID,
          COLLECTION_PRODUCT_CATEGORY_ID,
        );
        setCategories(
          response.documents.map((doc: any) => ({
            $id: doc.$id,
            name: doc.name,
          })),
        );
      } catch (error) {
        console.error("Error fetching product categories:", error);
      }
    }

    fetchData();
    fetchCategories();
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.desc.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      !selectedCategory ||
      (Array.isArray(product.productCategory) &&
        product.productCategory.some((cat: any) =>
          typeof cat === "string"
            ? cat === selectedCategory
            : cat.$id === selectedCategory,
        ));

    return matchesSearch && matchesCategory;
  });

  return (
    <section className="mt-8 min-h-screen bg-white pb-20 font-sans text-black">
      <div className="mx-auto max-w-6xl px-6">
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
              let imagesArr: string[] = [];
              try {
                imagesArr = Array.isArray(product.images)
                  ? product.images
                  : JSON.parse(product.images || "[]");
              } catch {
                imagesArr = [];
              }

              const categoryNames = Array.isArray(product.productCategory)
                ? product.productCategory
                    .map((cat: any) =>
                      typeof cat === "string"
                        ? categories.find((c) => c.$id === cat)?.name || cat
                        : cat.name || cat.$id,
                    )
                    .filter(Boolean)
                : [];

              return (
                <div
                  key={product.$id}
                  className="group cursor-pointer"
                  onMouseEnter={() => setHoveredProduct(product.$id)}
                  onMouseLeave={() => setHoveredProduct(null)}
                >
                  <a href={`/catalog/${product.slug}`} className="block">
                    <div className="relative h-72 w-full overflow-hidden rounded-lg shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
                      {imagesArr.length > 0 ? (
                        <img
                          src={getProductImageUrl(imagesArr[0])}
                          alt={product.name}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-gray-400">
                          No Image
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/0 transition-all duration-300 group-hover:bg-black/20"></div>
                      <div
                        className={`absolute inset-x-0 bottom-0 transform bg-gradient-to-t from-black/80 to-transparent p-5 transition-all duration-300 ${hoveredProduct === product.$id ? "translate-y-0" : "translate-y-2"}`}
                      >
                        <div className="text-white">
                          <p className="mb-1 text-sm font-medium">
                            {categoryNames.join(", ")}
                          </p>
                          <h3 className="mb-2 text-lg font-bold">
                            {product.name}
                          </h3>
                          <p className="mb-2 line-clamp-2 text-xs text-gray-200">
                            {product.desc}
                          </p>
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
