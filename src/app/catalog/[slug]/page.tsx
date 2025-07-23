"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  fetchProductsFromAppwrite,
  getProductImageUrl,
} from "../../dashboard/product/page";
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

const SPECIFICATIONS = [
  { label: "Material", value: "Solid Oak Wood" },
  { label: "Finishing", value: "Natural Oil Finish" },
  { label: "Warna", value: "Natural Oak" },
  { label: "Berat", value: "45 kg" },
  { label: "Kapasitas", value: "6-8 Orang" },
  { label: "Asal Kayu", value: "European Oak" },
];

const RELATED_PRODUCTS = [
  {
    name: "Scandinavian Oak Chair",
    price: 2850000,
    image:
      "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&q=80",
  },
  {
    name: "Oak Minimalist Sideboard",
    price: 12500000,
    image:
      "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400&q=80",
  },
  {
    name: "Round Oak Coffee Table",
    price: 8750000,
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80",
  },
];

export default function ProductDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mainImage, setMainImage] = useState<string>("");
  const [zoomActive, setZoomActive] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const products = await fetchProductsFromAppwrite();
      const found = products.find((p: Product) => p.slug === params.slug);
      setProduct(found || null);
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
  }, [params.slug]);

  useEffect(() => {
    if (product) {
      let imagesArr: string[] = [];
      try {
        imagesArr = Array.isArray(product.images)
          ? product.images
          : JSON.parse(product.images || "[]");
      } catch {
        imagesArr = [];
      }
      setMainImage(
        imagesArr.length > 0 ? getProductImageUrl(imagesArr[0]) : "",
      );
    }
  }, [product]);

  if (isLoading) {
    return (
      <section
        style={{
          minHeight: "80vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ color: "#888" }}>Memuat detail produk...</div>
      </section>
    );
  }

  if (!product) {
    return (
      <section
        style={{
          minHeight: "80vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ color: "#888" }}>Produk tidak ditemukan.</div>
      </section>
    );
  }

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
    <>
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Manrope:wght@300;400;500;600&display=swap");
        body {
          font-family: "Inter", sans-serif;
          background: #fff;
          color: #1a1a1a;
        }
      `}</style>
      <div
        className="container"
        style={{ maxWidth: 1400, margin: "0 auto", padding: "0 40px" }}
      >
        {/* Header */}
        <header
          className="header"
          style={{
            padding: "80px 0 40px",
            textAlign: "center",
            borderBottom: "1px solid rgba(0,0,0,0.08)",
          }}
        >
          <div
            className="category"
            style={{
              fontSize: 14,
              fontWeight: 300,
              letterSpacing: 3,
              textTransform: "uppercase",
              color: "#666",
              marginBottom: 16,
            }}
          >
            {categoryNames.join(", ") || "-"}
          </div>
          <h1
            className="main-title"
            style={{
              fontSize: 64,
              fontWeight: 300,
              letterSpacing: -1,
              color: "#1a1a1a",
              marginBottom: 20,
              fontFamily: "Manrope, sans-serif",
            }}
          >
            {product.name}
          </h1>
        </header>

        {/* Product Section */}
        <section
          className="product-section"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 400px",
            gap: 80,
            padding: "80px 0",
          }}
        >
          {/* Gallery */}
          <div className="gallery-container" style={{ position: "relative" }}>
            {mainImage ? (
              <img
                src={mainImage}
                alt={product.name}
                className="main-image"
                style={{
                  width: "100%",
                  height: 600,
                  objectFit: "cover",
                  borderRadius: 4,
                  boxShadow: "0 20px 60px rgba(0,0,0,0.12)",
                  transition: "all 0.6s",
                  cursor: "zoom-in",
                }}
                onClick={() => setZoomActive(true)}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: 600,
                  background: "#f3f3f3",
                  borderRadius: 4,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#bbb",
                }}
              >
                No Image
              </div>
            )}
            {imagesArr.length > 1 && (
              <div
                className="thumbnail-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns: `repeat(${Math.min(imagesArr.length, 4)}, 1fr)`,
                  gap: 12,
                  marginTop: 24,
                }}
              >
                {imagesArr.slice(0, 4).map((img, idx) => (
                  <img
                    key={idx}
                    src={getProductImageUrl(img)}
                    alt={product.name + " " + (idx + 1)}
                    className={`thumbnail${mainImage === getProductImageUrl(img) ? "active" : ""}`}
                    style={{
                      width: "100%",
                      height: 120,
                      objectFit: "cover",
                      borderRadius: 2,
                      boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                      cursor: "pointer",
                      transition: "all 0.4s",
                      opacity: mainImage === getProductImageUrl(img) ? 1 : 0.7,
                    }}
                    onClick={() => setMainImage(getProductImageUrl(img))}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="product-info" style={{ padding: "20px 0" }}>
            <h2
              className="product-name"
              style={{
                fontSize: 32,
                fontWeight: 300,
                color: "#1a1a1a",
                marginBottom: 24,
                fontFamily: "Manrope, sans-serif",
              }}
            >
              {product.name}
            </h2>
            <p
              className="product-description"
              style={{
                fontSize: 16,
                fontWeight: 300,
                color: "#555",
                lineHeight: 1.8,
                marginBottom: 40,
              }}
            >
              {product.desc}
            </p>
            <div className="dimensions" style={{ marginBottom: 40 }}>
              <h4
                style={{
                  fontSize: 12,
                  fontWeight: 500,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  color: "#888",
                  marginBottom: 8,
                }}
              >
                Dimensi
              </h4>
              <p style={{ fontSize: 18, fontWeight: 300, color: "#1a1a1a" }}>
                200 × 90 × 75 cm
              </p>
            </div>
            <div
              className="price"
              style={{
                fontSize: 28,
                fontWeight: 400,
                color: "#1a1a1a",
                marginBottom: 48,
              }}
            >
              Rp {product.price.toLocaleString("id-ID")}
            </div>
            <div
              className="actions"
              style={{ display: "flex", flexDirection: "column", gap: 16 }}
            >
              <button
                className="btn"
                style={{
                  padding: "18px 24px",
                  border: "1px solid #1a1a1a",
                  background: "transparent",
                  color: "#1a1a1a",
                  fontSize: 14,
                  fontWeight: 400,
                  letterSpacing: 1,
                  textTransform: "uppercase",
                  borderRadius: 2,
                  cursor: "pointer",
                  transition: "all 0.4s",
                }}
              >
                Tambah ke Keranjang
              </button>
              <button
                className="btn btn-secondary"
                style={{
                  padding: "18px 24px",
                  border: "1px solid #888",
                  background: "transparent",
                  color: "#888",
                  fontSize: 14,
                  fontWeight: 400,
                  letterSpacing: 1,
                  textTransform: "uppercase",
                  borderRadius: 2,
                  cursor: "pointer",
                  transition: "all 0.4s",
                }}
              >
                Konsultasi Desain
              </button>
            </div>
          </div>
        </section>

        {/* Specifications */}
        <section
          className="specifications"
          style={{ padding: "80px 0", borderTop: "1px solid rgba(0,0,0,0.08)" }}
        >
          <h3
            className="spec-title"
            style={{
              fontSize: 24,
              fontWeight: 300,
              color: "#1a1a1a",
              marginBottom: 48,
              textAlign: "center",
            }}
          >
            Spesifikasi Detail
          </h3>
          <div
            className="spec-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 40,
              marginBottom: 80,
            }}
          >
            {SPECIFICATIONS.map((spec, idx) => (
              <div
                className="spec-item"
                key={idx}
                style={{
                  padding: "32px 24px",
                  background: "#fff",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.06)",
                  borderRadius: 4,
                  transition: "all 0.4s",
                }}
              >
                <div
                  className="spec-label"
                  style={{
                    fontSize: 12,
                    fontWeight: 500,
                    letterSpacing: 2,
                    textTransform: "uppercase",
                    color: "#888",
                    marginBottom: 8,
                  }}
                >
                  {spec.label}
                </div>
                <div
                  className="spec-value"
                  style={{ fontSize: 16, fontWeight: 300, color: "#1a1a1a" }}
                >
                  {spec.value}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Related Products */}
        <section
          className="related-products"
          style={{ padding: "80px 0", borderTop: "1px solid rgba(0,0,0,0.08)" }}
        >
          <h3
            className="related-title"
            style={{
              fontSize: 24,
              fontWeight: 300,
              color: "#1a1a1a",
              marginBottom: 48,
              textAlign: "center",
            }}
          >
            Koleksi Terkait
          </h3>
          <div
            className="related-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: 40,
            }}
          >
            {RELATED_PRODUCTS.map((item, idx) => (
              <div
                className="product-card"
                key={idx}
                style={{
                  background: "#fff",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.06)",
                  borderRadius: 4,
                  overflow: "hidden",
                  transition: "all 0.6s",
                  cursor: "pointer",
                }}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="card-image"
                  style={{
                    width: "100%",
                    height: 240,
                    objectFit: "cover",
                    transition: "all 0.6s",
                  }}
                />
                <div className="card-content" style={{ padding: "32px 24px" }}>
                  <h4
                    className="card-title"
                    style={{
                      fontSize: 18,
                      fontWeight: 300,
                      color: "#1a1a1a",
                      marginBottom: 8,
                    }}
                  >
                    {item.name}
                  </h4>
                  <p
                    className="card-price"
                    style={{ fontSize: 16, fontWeight: 400, color: "#666" }}
                  >
                    Rp {item.price.toLocaleString("id-ID")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Zoom Overlay */}
      {zoomActive && (
        <div
          className="zoom-overlay"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(255,255,255,0.95)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            backdropFilter: "blur(10px)",
          }}
          onClick={() => setZoomActive(false)}
        >
          <button
            className="close-zoom"
            style={{
              position: "absolute",
              top: 40,
              right: 40,
              fontSize: 24,
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 10,
              color: "#1a1a1a",
            }}
            onClick={() => setZoomActive(false)}
          >
            &times;
          </button>
          <img
            src={mainImage}
            alt={product.name}
            className="zoom-image"
            style={{
              maxWidth: "90vw",
              maxHeight: "90vh",
              objectFit: "contain",
              boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
            }}
          />
        </div>
      )}
    </>
  );
}
