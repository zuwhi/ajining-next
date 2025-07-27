"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  databases,
  DATABASE_ID,
  COLLECTION_ORDER_ID,
  ID,
  COLLECTION_NOTA_ID,
  COLLECTION_TRANSACTION_ID,
} from "@/lib/appwrite";

interface Product {
  name: string;
  price: number;
  category: string;
  image: string;
  slug: string;
}

interface CartItem extends Product {
  quantity: number;
}

interface CheckoutForm {
  nama_pembeli: string;
  contact_person: string;
  no_hp_email: string;
  alamat: string;
  tanggal: string;
}

interface OrderDetail {
  $id: string;
  product_name: string;
  qty: number;
  price: number;
  subtotal: number;
}

interface OrderData {
  name: string;
  contact_person: string;
  handphone: string;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  date: string;
  address: string;
  detailNota: OrderDetail[];
}

export default function CartPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkoutForm, setCheckoutForm] = useState<CheckoutForm>({
    nama_pembeli: "",
    contact_person: "",
    no_hp_email: "",
    alamat: "",
    tanggal: new Date().toISOString().split("T")[0], // Default hari ini
  });

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

  const handleAddToCart = (product: Product) => {
    setCart((prev) => {
      const existingItem = prev.find((p) => p.slug === product.slug);
      if (existingItem) {
        // Increment quantity if product already exists
        return prev.map((item) =>
          item.slug === product.slug
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      } else {
        // Add new product with quantity 1
        return [...prev, { ...product, quantity: 1 }];
      }
    });
    // Auto open cart on mobile when adding item
    if (window.innerWidth < 1024) {
      setIsCartOpen(true);
    }
  };

  const handleRemoveFromCart = (productSlug: string) => {
    setCart((prev) => prev.filter((p) => p.slug !== productSlug));
  };

  const handleIncrementQuantity = (productSlug: string) => {
    setCart((prev) =>
      prev.map((item) =>
        item.slug === productSlug
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      ),
    );
  };

  const handleDecrementQuantity = (productSlug: string) => {
    setCart(
      (prev) =>
        prev
          .map((item) => {
            if (item.slug === productSlug) {
              if (item.quantity <= 1) {
                // Remove item if quantity becomes 0
                return null;
              }
              return { ...item, quantity: item.quantity - 1 };
            }
            return item;
          })
          .filter(Boolean) as CartItem[],
    );
  };

  const handleCheckout = () => {
    setIsCheckoutOpen(true);
  };

  const handleSubmitCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Calculate order details
      const detailNota: OrderDetail[] = cart.map((item) => ({
        $id: ID.unique(),
        product_name: item.name,
        qty: item.quantity,
        price: item.price,
        subtotal: item.price * item.quantity,
      }));

      const subtotal = detailNota.reduce((sum, item) => sum + item.subtotal, 0);
      const discount = Math.round(subtotal * 0.1); // 10% discount
      const tax = Math.round((subtotal - discount) * 0.1); // 10% tax
      const total = subtotal - discount + tax;

      // Prepare order data
      const orderData: OrderData = {
        name: checkoutForm.nama_pembeli,
        contact_person: checkoutForm.contact_person,
        handphone: checkoutForm.no_hp_email,
        subtotal: subtotal,
        discount: discount,
        tax: tax,
        total: total,
        date: new Date(checkoutForm.tanggal).toISOString(),
        address: checkoutForm.alamat,
        detailNota: detailNota,
      };

      // Save to Appwrite
      await databases.createDocument(
        DATABASE_ID,
        COLLECTION_NOTA_ID,
        ID.unique(),
        orderData,
      );

      // Create transaction record for cash management
      const transactionData = {
        type: 1, // Kredit (income)
        title: `Penjualan - ${checkoutForm.nama_pembeli}`,
        desc: `Penjualan produk kepada ${checkoutForm.nama_pembeli}. Total: ${cart.length} item`,
        amount: total,
        categoryCash: "", // Default category
        image: "",
        date: new Date(),
        updated_at: new Date().toISOString(),
      };

      await databases.createDocument(
        DATABASE_ID,
        COLLECTION_TRANSACTION_ID,
        ID.unique(),
        transactionData,
      );

      setIsCheckoutOpen(false);
      setCart([]);

      window.location.href = "/dashboard/nota";

      // Reset form
      setCheckoutForm({
        nama_pembeli: "",
        contact_person: "",
        no_hp_email: "",
        alamat: "",
        tanggal: new Date().toISOString().split("T")[0],
      });
    } catch (error) {
      console.error("Error saving order:", error);
      alert("Terjadi kesalahan saat menyimpan pesanan. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get unique categories for filter
  const categories = Array.from(
    new Set(products.map((p) => p.category)),
  ).sort();

  // Filter products based on search and category
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesCategory =
      !selectedCategory || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Calculate total items in cart
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="relative">
      {/* Mobile Cart Button */}
      <div className="fixed right-4 bottom-4 z-50 lg:hidden">
        <Button
          className="rounded-full bg-teal-600 text-white shadow-lg hover:bg-teal-700"
          onClick={() => setIsCartOpen(true)}
        >
          🛒 {totalItems > 0 && <span className="ml-1">{totalItems}</span>}
        </Button>
      </div>

      <div className="flex min-h-[80vh] flex-col gap-4 lg:flex-row lg:gap-6">
        {/* Produk Grid */}
        <div className="order-2 flex-1 lg:order-1">
          <div className="mb-4 lg:mb-6">
            <h1 className="mb-2 text-2xl font-extrabold tracking-tight text-teal-700 lg:text-4xl">
              Cart
            </h1>
            <p className="text-sm text-gray-500 lg:text-lg">
              Daftar produk yang ada di keranjang Anda.
            </p>
          </div>

          {/* Search and Filter */}
          <div className="mb-6 flex flex-col gap-3 lg:mb-8 lg:gap-4">
            <input
              type="text"
              placeholder="Cari furnitur..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border-b border-teal-200 bg-transparent px-2 py-2 text-base placeholder:text-gray-400 focus:border-teal-600 focus:outline-none lg:text-lg"
            />
            <div className="flex flex-wrap gap-2 overflow-x-auto pb-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-3 py-1 text-xs tracking-wide whitespace-nowrap uppercase transition lg:px-4 lg:text-sm ${
                  !selectedCategory
                    ? "text-teal-600 underline underline-offset-4"
                    : "opacity-50 hover:opacity-100"
                }`}
              >
                Semua
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 text-xs tracking-wide whitespace-nowrap uppercase transition lg:px-4 lg:text-sm ${
                    selectedCategory === cat
                      ? "text-teal-600 underline underline-offset-4"
                      : "opacity-50 hover:opacity-100"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <div className="text-center text-gray-500">Memuat produk...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center text-gray-500">
              Tidak ada produk ditemukan.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-2 lg:gap-8 xl:grid-cols-3">
              {filteredProducts.map((product) => {
                return (
                  <div
                    key={product.slug}
                    className="group cursor-pointer"
                    onMouseEnter={() => setHoveredProduct(product.slug)}
                    onMouseLeave={() => setHoveredProduct(null)}
                    onClick={() => handleAddToCart(product)}
                  >
                    <div className="relative h-64 w-full overflow-hidden rounded-lg shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl sm:h-72 lg:h-80">
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
                        className={`absolute inset-x-0 bottom-0 transform bg-gradient-to-t from-black/80 to-transparent p-3 transition-all duration-300 lg:p-5 ${hoveredProduct === product.slug ? "translate-y-0" : "translate-y-2"}`}
                      >
                        <div className="text-white">
                          <p className="mb-1 text-xs font-medium lg:text-sm">
                            {product.category}
                          </p>
                          <h3 className="mb-2 text-sm font-bold lg:text-lg">
                            {product.name}
                          </h3>
                          <p className="text-xs font-semibold lg:text-base">
                            Rp {product.price.toLocaleString("id-ID")}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Sidebar Keranjang - Desktop */}
        <aside className="sticky top-6 order-1 hidden h-fit w-full max-w-xs flex-col self-start rounded-xl border-l border-teal-100 bg-white shadow-xl lg:order-2 lg:flex xl:max-w-sm">
          <div className="border-b p-4 lg:p-6">
            <h2 className="mb-2 text-xl font-bold text-teal-700 lg:text-2xl">
              Keranjang
            </h2>
            <p className="text-xs text-gray-500 lg:text-sm">
              Produk yang Anda pilih ({totalItems} item)
            </p>
          </div>
          <div className="flex-1 overflow-y-auto p-4 lg:p-6">
            {cart.length === 0 ? (
              <div className="text-center text-sm text-gray-400">
                Keranjang masih kosong.
              </div>
            ) : (
              <div className="space-y-3 lg:space-y-4">
                {cart.map((item) => {
                  return (
                    <div
                      key={item.slug}
                      className="flex items-center gap-3 rounded-lg border p-3 shadow-sm lg:gap-4 lg:p-4"
                    >
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-12 w-12 rounded object-cover lg:h-16 lg:w-16"
                        />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded bg-gray-100 text-gray-400 lg:h-16 lg:w-16">
                          No Image
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-semibold lg:text-base">
                          {item.name}
                        </div>
                        <div className="text-xs text-gray-500 lg:text-sm">
                          Rp {item.price.toLocaleString("id-ID")}
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDecrementQuantity(item.slug);
                            }}
                            className="h-6 w-6 p-0 text-xs"
                          >
                            -
                          </Button>
                          <span className="min-w-[20px] text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleIncrementQuantity(item.slug);
                            }}
                            className="h-6 w-6 p-0 text-xs"
                          >
                            +
                          </Button>
                        </div>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemoveFromCart(item.slug)}
                        className="px-2 py-1 text-xs lg:px-3 lg:py-2"
                      >
                        Hapus
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <div className="border-t p-4 lg:p-6">
            <Button
              className="w-full bg-teal-600 text-sm text-white hover:bg-teal-700 lg:text-base"
              disabled={cart.length === 0}
              onClick={handleCheckout}
            >
              Checkout
            </Button>
          </div>
        </aside>

        {/* Mobile Cart Sidebar */}
        {isCartOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            {/* Overlay */}
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setIsCartOpen(false)}
            />
            {/* Cart Sidebar */}
            <div className="absolute top-0 right-0 flex h-full w-80 max-w-[90vw] flex-col bg-white shadow-xl">
              <div className="flex items-center justify-between border-b p-4">
                <h2 className="text-xl font-bold text-teal-700">
                  Keranjang ({totalItems} item)
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsCartOpen(false)}
                  className="text-gray-500"
                >
                  ✕
                </Button>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                {cart.length === 0 ? (
                  <div className="text-center text-sm text-gray-400">
                    Keranjang masih kosong.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {cart.map((item) => {
                      return (
                        <div
                          key={item.slug}
                          className="flex items-center gap-3 rounded-lg border p-3 shadow-sm"
                        >
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-12 w-12 rounded object-cover"
                            />
                          ) : (
                            <div className="flex h-12 w-12 items-center justify-center rounded bg-gray-100 text-gray-400">
                              No Image
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <div className="truncate text-sm font-semibold">
                              {item.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              Rp {item.price.toLocaleString("id-ID")}
                            </div>
                            <div className="mt-2 flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDecrementQuantity(item.slug);
                                }}
                                className="h-6 w-6 p-0 text-xs"
                              >
                                -
                              </Button>
                              <span className="min-w-[20px] text-center text-sm font-medium">
                                {item.quantity}
                              </span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleIncrementQuantity(item.slug);
                                }}
                                className="h-6 w-6 p-0 text-xs"
                              >
                                +
                              </Button>
                            </div>
                          </div>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleRemoveFromCart(item.slug)}
                            className="px-2 py-1 text-xs"
                          >
                            Hapus
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              <div className="border-t p-4">
                <Button
                  className="w-full bg-teal-600 text-sm text-white hover:bg-teal-700"
                  disabled={cart.length === 0}
                  onClick={handleCheckout}
                >
                  Checkout
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Checkout Form Dialog */}
      <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Form Checkout</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmitCheckout} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nama_pembeli">Nama Pembeli</Label>
              <Input
                id="nama_pembeli"
                value={checkoutForm.nama_pembeli}
                onChange={(e) =>
                  setCheckoutForm({
                    ...checkoutForm,
                    nama_pembeli: e.target.value,
                  })
                }
                placeholder="Masukkan nama pembeli"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact_person">Contact Person</Label>
              <Input
                id="contact_person"
                value={checkoutForm.contact_person}
                onChange={(e) =>
                  setCheckoutForm({
                    ...checkoutForm,
                    contact_person: e.target.value,
                  })
                }
                placeholder="Masukkan contact person"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="no_hp_email">No. HP / Email</Label>
              <Input
                id="no_hp_email"
                type="email"
                value={checkoutForm.no_hp_email}
                onChange={(e) =>
                  setCheckoutForm({
                    ...checkoutForm,
                    no_hp_email: e.target.value,
                  })
                }
                placeholder="Masukkan no. HP atau email"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="alamat">Alamat</Label>
              <textarea
                id="alamat"
                value={checkoutForm.alamat}
                onChange={(e) =>
                  setCheckoutForm({ ...checkoutForm, alamat: e.target.value })
                }
                placeholder="Masukkan alamat lengkap"
                className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring min-h-[80px] w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tanggal">Tanggal</Label>
              <Input
                id="tanggal"
                type="date"
                value={checkoutForm.tanggal}
                onChange={(e) =>
                  setCheckoutForm({ ...checkoutForm, tanggal: e.target.value })
                }
                required
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCheckoutOpen(false)}
                disabled={isSubmitting}
              >
                Batal
              </Button>
              <Button
                type="submit"
                className="bg-teal-600 hover:bg-teal-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Menyimpan..." : "Simpan Invoice"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
