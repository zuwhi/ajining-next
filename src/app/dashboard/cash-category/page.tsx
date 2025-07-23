"use client";

import React, { useEffect, useState, Suspense } from "react";
import {
  databases,
  storage,
  DATABASE_ID,
  COLLECTION_TRANSACTION_ID,
  COLLECTION_CATEGORY_ID,
  BUCKET_ID,
  Query,
  ID,
} from "@/lib/appwrite";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

export const dynamic = "force-dynamic";

interface CategoryCash {
  $id: string;
  name: string;
  type: number;
  icon?: string | null;
  color?: string | null;
}

interface Transaction {
  $id: string;
  date: string;
  datetime: string;
  type: number;
  title: string;
  desc: string;
  amount: number;
  categoryCash: CategoryCash;
  image: string;
}

interface TransactionFormData
  extends Omit<Partial<Transaction>, "categoryCash"> {
  categoryCash: {
    id: string;
    name: string;
  };
}

interface CategoryFormData {
  $id?: string;
  name: string;
  type: number;
  icon: string;
  color: string;
}

function CashCategoryPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // Tab state
  const [activeTab, setActiveTab] = useState<"cash" | "category">("cash");

  // Transaction state
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [filterType, setFilterType] = useState("all");
  const [formData, setFormData] = useState<TransactionFormData>({
    type: 1,
    date: format(new Date(), "yyyy-MM-dd"),
    datetime: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
    title: "",
    desc: "",
    amount: 0,
    categoryCash: {
      id: "",
      name: "Uncategorized",
    },
    image: "",
  });

  // Category state
  const [categories, setCategories] = useState<CategoryCash[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [categoryFormData, setCategoryFormData] = useState<CategoryFormData>({
    name: "",
    type: 1,
    icon: "tag",
    color: "#14b8a6",
  });

  // --- Transaction Logic ---
  const formatDate = (dateString: string, formatString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Tanggal tidak valid";
      }
      return format(date, formatString);
    } catch (error) {
      return "Tanggal tidak valid";
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_CATEGORY_ID,
      );
      setCategories(
        response.documents.map((doc: any) => ({
          $id: doc.$id,
          name: doc.name,
          type: doc.type,
          icon: doc.icon,
          color: doc.color,
        })),
      );
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setIsLoadingCategories(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_TRANSACTION_ID,
      );
      setTransactions(
        response.documents.map((doc: any) => ({
          $id: doc.$id,
          date: doc.date,
          datetime: doc.datetime,
          type: doc.type,
          title: doc.title,
          desc: doc.desc,
          amount: doc.amount,
          categoryCash: doc.categoryCash,
          image: doc.image,
        })),
      );
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setIsLoadingTransactions(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
    fetchCategories();
  }, []);

  useEffect(() => {
    const editId = searchParams.get("edit");
    if (editId) {
      const transaction = transactions.find((t) => t.$id === editId);
      if (transaction) {
        handleEdit(transaction);
        router.replace("/dashboard/cash-category");
      }
    }
  }, [searchParams, transactions, router]);

  const handleCategoryChange = (categoryId: string) => {
    if (categoryId === "none") {
      setFormData({
        ...formData,
        categoryCash: {
          id: "",
          name: "Uncategorized",
        },
      });
    } else {
      const selectedCategory = categories.find((cat) => cat.$id === categoryId);
      setFormData({
        ...formData,
        categoryCash: {
          id: categoryId,
          name: selectedCategory?.name || "Uncategorized",
        },
      });
    }
  };

  useEffect(() => {
    if (formData.type) {
      setFormData((prev) => ({
        ...prev,
        categoryCash: {
          id: "",
          name: "Uncategorized",
        },
      }));
    }
  }, [formData.type]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Ukuran file terlalu besar. Maksimal 5MB.");
        return;
      }
      if (!file.type.startsWith("image/")) {
        alert("File harus berupa gambar.");
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    try {
      const response = await storage.createFile(BUCKET_ID, ID.unique(), file);
      return response.$id;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw new Error("Gagal mengupload gambar. Silakan coba lagi.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let imageId = formData.image;
      if (selectedFile) {
        try {
          imageId = await uploadImage(selectedFile);
        } catch (uploadError) {
          alert(
            "Gagal mengupload gambar. Transaksi akan disimpan tanpa gambar.",
          );
          imageId = "";
        }
      }
      const transactionData = {
        type: formData.type,
        title: formData.title,
        desc: formData.desc,
        amount: formData.amount,
        categoryCash: formData.categoryCash?.id || "",
        image: imageId,
        date: new Date(),
        updated_at: new Date().toISOString(),
      };
      if (formData.$id) {
        await databases.updateDocument(
          DATABASE_ID,
          COLLECTION_TRANSACTION_ID,
          formData.$id,
          transactionData,
        );
      } else {
        await databases.createDocument(
          DATABASE_ID,
          COLLECTION_TRANSACTION_ID,
          ID.unique(),
          transactionData,
        );
      }
      setIsDialogOpen(false);
      fetchTransactions();
      setFormData({
        type: 1,
        date: format(new Date(), "yyyy-MM-dd"),
        datetime: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
        title: "",
        desc: "",
        amount: 0,
        categoryCash: {
          id: "",
          name: "Uncategorized",
        },
        image: "",
      });
      setImagePreview("");
      setSelectedFile(null);
    } catch (error) {
      alert("Gagal menyimpan transaksi. Silakan coba lagi.");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus transaksi ini?")) {
      try {
        await databases.deleteDocument(
          DATABASE_ID,
          COLLECTION_TRANSACTION_ID,
          id,
        );
        fetchTransactions();
      } catch (error) {
        console.error("Error deleting transaction:", error);
      }
    }
  };

  const handleEdit = (transaction: Transaction) => {
    setFormData({
      ...transaction,
      categoryCash: {
        id: transaction.categoryCash?.$id || "",
        name: transaction.categoryCash?.name || "Uncategorized",
      },
    });
    if (transaction.image) {
      setImagePreview(getImageUrl(transaction.image));
    } else {
      setImagePreview("");
    }
    setIsDialogOpen(true);
  };

  const handleRemoveImage = () => {
    setImagePreview("");
    setSelectedFile(null);
    setFormData({ ...formData, image: "" });
  };

  const handleView = (transaction: Transaction) => {
    router.push(`/dashboard/cash-category/${transaction.$id}`);
  };

  const getImageUrl = (fileId: string) => {
    return `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${fileId}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`;
  };

  // --- Category Logic ---
  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const categoryData = {
        name: categoryFormData.name,
        type: categoryFormData.type,
        icon: categoryFormData.icon,
        color: categoryFormData.color,
      };
      if (categoryFormData.$id) {
        await databases.updateDocument(
          DATABASE_ID,
          COLLECTION_CATEGORY_ID,
          categoryFormData.$id,
          categoryData,
        );
      } else {
        await databases.createDocument(
          DATABASE_ID,
          COLLECTION_CATEGORY_ID,
          ID.unique(),
          categoryData,
        );
      }
      setIsCategoryDialogOpen(false);
      fetchCategories();
    } catch (error) {
      alert("Gagal menyimpan kategori. Silakan coba lagi.");
    }
  };

  const handleCategoryDelete = async (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus kategori ini?")) {
      try {
        await databases.deleteDocument(DATABASE_ID, COLLECTION_CATEGORY_ID, id);
        fetchCategories();
      } catch (error) {
        alert("Gagal menghapus kategori. Silakan coba lagi.");
      }
    }
  };

  const handleCategoryEdit = (category: CategoryCash) => {
    setCategoryFormData({
      $id: category.$id,
      name: category.name,
      type: category.type,
      icon: category.icon || "tag",
      color: category.color || "#14b8a6",
    });
    setIsCategoryDialogOpen(true);
  };

  const iconOptions = [
    { value: "tag", label: "Tag" },
    { value: "shopping-cart", label: "Shopping Cart" },
    { value: "home", label: "Home" },
    { value: "car", label: "Car" },
    { value: "utensils", label: "Food" },
    { value: "graduation-cap", label: "Education" },
    { value: "heart", label: "Health" },
    { value: "plane", label: "Travel" },
    { value: "gift", label: "Gift" },
    { value: "coffee", label: "Coffee" },
  ];

  // --- UI ---
  return (
    <div>
      <div className="mb-6 flex gap-4">
        <Button
          className={`rounded-xl px-6 py-2 font-bold shadow-md transition-all ${activeTab === "cash" ? "bg-teal-600 text-white" : "bg-teal-50 text-teal-700"}`}
          onClick={() => setActiveTab("cash")}
        >
          Transaksi
        </Button>
        <Button
          className={`rounded-xl px-6 py-2 font-bold shadow-md transition-all ${activeTab === "category" ? "bg-teal-600 text-white" : "bg-teal-50 text-teal-700"}`}
          onClick={() => setActiveTab("category")}
        >
          Kategori
        </Button>
      </div>
      {activeTab === "cash" ? (
        <div>
          <div className="mb-6">
            <h1 className="mb-2 text-4xl font-extrabold tracking-tight text-teal-700">
              Kelola Transaksi
            </h1>
            <p className="text-lg text-gray-500">
              Tambah, edit, dan kelola transaksi keuangan Anda
            </p>
          </div>

          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex w-full flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div className="order-2 flex gap-2 sm:order-1">
                <Button
                  variant={filterType === "all" ? "default" : "outline"}
                  className={
                    filterType === "all"
                      ? "rounded-xl bg-teal-600 text-white shadow-md"
                      : "rounded-xl border-teal-200 transition-all hover:bg-teal-50"
                  }
                  onClick={() => setFilterType("all")}
                >
                  Semua
                </Button>
                <Button
                  variant={filterType === "1" ? "default" : "outline"}
                  className={
                    filterType === "1"
                      ? "rounded-xl bg-teal-600 text-white shadow-md"
                      : "rounded-xl border-teal-200 transition-all hover:bg-teal-50"
                  }
                  onClick={() => setFilterType("1")}
                >
                  Kredit
                </Button>
                <Button
                  variant={filterType === "2" ? "default" : "outline"}
                  className={
                    filterType === "2"
                      ? "rounded-xl bg-teal-600 text-white shadow-md"
                      : "rounded-xl border-teal-200 transition-all hover:bg-teal-50"
                  }
                  onClick={() => setFilterType("2")}
                >
                  Debet
                </Button>
              </div>

              <Button
                className="order-1 rounded-xl bg-teal-600 text-white shadow-md transition-all hover:bg-teal-700 sm:order-2"
                onClick={() => setIsDialogOpen(true)}
              >
                Tambah Transaksi
              </Button>
            </div>
          </div>

          {isLoadingTransactions ? (
            <div className="mx-auto w-full max-w-2xl">
              <div className="mb-4 h-12 animate-pulse rounded-xl bg-teal-50" />
              <div className="h-40 animate-pulse rounded-xl bg-teal-50" />
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-teal-100 bg-white shadow-lg">
              <table className="min-w-full divide-y divide-teal-100">
                <thead className="sticky top-0 z-10 bg-teal-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-bold tracking-wider text-teal-700 uppercase">
                      Tanggal
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold tracking-wider text-teal-700 uppercase">
                      Tipe
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold tracking-wider text-teal-700 uppercase">
                      Judul
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold tracking-wider text-teal-700 uppercase">
                      Deskripsi
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold tracking-wider text-teal-700 uppercase">
                      Jumlah
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold tracking-wider text-teal-700 uppercase">
                      Kategori
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold tracking-wider text-teal-700 uppercase">
                      Bukti
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold tracking-wider text-teal-700 uppercase">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-teal-50">
                  {transactions
                    .filter((t) =>
                      filterType === "all"
                        ? true
                        : filterType === "1"
                          ? t.type === 1
                          : t.type === 2,
                    )
                    .map((transaction, idx) => (
                      <tr
                        key={transaction.$id}
                        className={
                          "group transition-all hover:bg-teal-50 " +
                          (idx % 2 === 0 ? "bg-white" : "bg-teal-50/40")
                        }
                      >
                        <td className="px-4 py-3 text-sm font-medium whitespace-nowrap text-gray-700">
                          {formatDate(transaction.date, "dd/MM/yyyy")}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span
                            className={
                              transaction.type === 1
                                ? "inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700"
                                : "inline-block rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700"
                            }
                          >
                            {transaction.type === 1 ? "Kredit" : "Debet"}
                          </span>
                        </td>
                        <td
                          className="max-w-[160px] truncate px-4 py-3 text-sm font-semibold text-gray-800"
                          title={transaction.title}
                        >
                          {transaction.title}
                        </td>
                        <td
                          className="max-w-[200px] truncate px-4 py-3 text-xs text-gray-500"
                          title={transaction.desc}
                        >
                          {transaction.desc}
                        </td>
                        <td
                          className={
                            "px-4 py-3 text-sm font-bold whitespace-nowrap " +
                            (transaction.type === 1
                              ? "text-green-600"
                              : "text-red-600")
                          }
                        >
                          Rp {transaction.amount.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="inline-block rounded-full bg-teal-100 px-3 py-1 text-xs font-semibold text-teal-700">
                            {transaction.categoryCash?.name || "Uncategorized"}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {transaction.image && (
                            <Image
                              src={getImageUrl(transaction.image)}
                              alt="Transaction"
                              width={40}
                              height={40}
                              className="rounded-lg border border-teal-100 object-cover shadow-sm"
                              unoptimized
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                              }}
                            />
                          )}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="rounded-lg border-teal-200 hover:bg-teal-100"
                              onClick={() => handleView(transaction)}
                            >
                              View
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="rounded-lg border-teal-200 hover:bg-teal-100"
                              onClick={() => handleEdit(transaction)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="rounded-lg border-teal-200 hover:bg-red-50 hover:text-red-700"
                              onClick={() => handleDelete(transaction.$id)}
                            >
                              Hapus
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  {/* Summary row */}
                  <tr className="bg-teal-700 font-bold text-white">
                    <td className="px-4 py-3" colSpan={4}>
                      Total
                    </td>
                    <td className="px-4 py-3">
                      Rp{" "}
                      {transactions
                        .filter((t) => t.type === 1)
                        .reduce((sum, t) => sum + t.amount, 0)
                        .toLocaleString()}{" "}
                      /
                      <span className="text-red-200">
                        Rp{" "}
                        {transactions
                          .filter((t) => t.type === 2)
                          .reduce((sum, t) => sum + t.amount, 0)
                          .toLocaleString()}
                      </span>
                    </td>
                    <td className="px-4 py-3" colSpan={3}>
                      Saldo: Rp{" "}
                      {(
                        transactions
                          .filter((t) => t.type === 1)
                          .reduce((sum, t) => sum + t.amount, 0) -
                        transactions
                          .filter((t) => t.type === 2)
                          .reduce((sum, t) => sum + t.amount, 0)
                      ).toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* Dialog Transaksi */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="rounded-xl shadow-md">
              <DialogHeader>
                <DialogTitle className="text-teal-700">
                  Tambah/Edit Transaksi
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="type" className="text-right">
                      Tipe
                    </Label>
                    <Select
                      value={formData.type?.toString()}
                      onValueChange={(value) =>
                        setFormData({ ...formData, type: parseInt(value) })
                      }
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Pilih tipe transaksi" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Kredit</SelectItem>
                        <SelectItem value="2">Debet</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="title" className="text-right">
                      Judul
                    </Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      className="col-span-3"
                      placeholder="Masukkan judul transaksi"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="desc" className="text-right">
                      Deskripsi
                    </Label>
                    <Input
                      id="desc"
                      value={formData.desc}
                      onChange={(e) =>
                        setFormData({ ...formData, desc: e.target.value })
                      }
                      className="col-span-3"
                      placeholder="Masukkan deskripsi transaksi"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="amount" className="text-right">
                      Jumlah
                    </Label>
                    <Input
                      id="amount"
                      type="number"
                      value={formData.amount}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          amount: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="col-span-3"
                      placeholder="Masukkan jumlah"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="date" className="text-right">
                      Tanggal
                    </Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) =>
                        setFormData({ ...formData, date: e.target.value })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="categoryCash" className="text-right">
                      Kategori
                    </Label>
                    <Select
                      value={formData.categoryCash?.id || "none"}
                      onValueChange={handleCategoryChange}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Pilih kategori" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Tanpa Kategori</SelectItem>
                        {categories
                          .filter(
                            (cat) =>
                              cat.type === formData.type || cat.type === 0,
                          )
                          .map((category) => (
                            <SelectItem key={category.$id} value={category.$id}>
                              {category.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="image" className="text-right">
                      Gambar
                    </Label>
                    <div className="col-span-3">
                      <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="col-span-3"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Format: JPG, PNG, GIF. Maksimal 5MB.
                      </p>
                    </div>
                  </div>
                  {imagePreview && (
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right">Preview</Label>
                      <div className="relative col-span-3">
                        <Image
                          src={imagePreview}
                          alt="Preview"
                          width={200}
                          height={200}
                          className="rounded-lg object-cover"
                          unoptimized
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleRemoveImage}
                          className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                        >
                          ✕
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    className="rounded-xl bg-teal-600 text-white shadow-md transition-all hover:bg-teal-700"
                  >
                    {formData.$id ? "Update" : "Simpan"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      ) : (
        <div>
          <div className="mb-6">
            <h1 className="mb-2 text-4xl font-extrabold tracking-tight text-teal-700">
              Kelola Kategori
            </h1>
            <p className="text-lg text-gray-500">
              Tambah, edit, dan kelola kategori transaksi Anda
            </p>
          </div>

          <Button
            className="mb-4 rounded-xl bg-teal-600 text-white shadow-md transition-all hover:bg-teal-700"
            onClick={() => {
              setCategoryFormData({
                name: "",
                type: 1,
                icon: "tag",
                color: "#14b8a6",
              });
              setIsCategoryDialogOpen(true);
            }}
          >
            Tambah Kategori Baru
          </Button>

          <Dialog
            open={isCategoryDialogOpen}
            onOpenChange={setIsCategoryDialogOpen}
          >
            <DialogContent className="rounded-xl shadow-md">
              <DialogHeader>
                <DialogTitle>
                  {categoryFormData.$id
                    ? "Edit Kategori"
                    : "Tambah Kategori Baru"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCategorySubmit} className="space-y-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Nama
                  </Label>
                  <Input
                    id="name"
                    value={categoryFormData.name}
                    onChange={(e) =>
                      setCategoryFormData({
                        ...categoryFormData,
                        name: e.target.value,
                      })
                    }
                    className="col-span-3"
                    placeholder="Masukkan nama kategori"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="type" className="text-right">
                    Tipe
                  </Label>
                  <Select
                    value={categoryFormData.type?.toString()}
                    onValueChange={(value) =>
                      setCategoryFormData({
                        ...categoryFormData,
                        type: parseInt(value),
                      })
                    }
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Pilih tipe kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Kredit</SelectItem>
                      <SelectItem value="2">Debet</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="icon" className="text-right">
                    Icon
                  </Label>
                  <Input
                    id="icon"
                    value={categoryFormData.icon}
                    onChange={(e) =>
                      setCategoryFormData({
                        ...categoryFormData,
                        icon: e.target.value,
                      })
                    }
                    className="col-span-3"
                    placeholder="Masukkan nama icon"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="color" className="text-right">
                    Warna
                  </Label>
                  <Input
                    id="color"
                    type="color"
                    value={categoryFormData.color}
                    onChange={(e) =>
                      setCategoryFormData({
                        ...categoryFormData,
                        color: e.target.value,
                      })
                    }
                    className="col-span-3"
                  />
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCategoryDialogOpen(false)}
                  >
                    Batal
                  </Button>
                  <Button type="submit">
                    {categoryFormData.$id ? "Update" : "Simpan"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          {isLoadingCategories ? (
            <div className="mx-auto w-full max-w-2xl">
              <div className="mb-4 h-12 animate-pulse rounded-xl bg-teal-50" />
              <div className="h-40 animate-pulse rounded-xl bg-teal-50" />
            </div>
          ) : (
            <div className="rounded-xl border border-teal-100 bg-white shadow-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama</TableHead>
                    <TableHead>Tipe</TableHead>
                    <TableHead>Icon</TableHead>
                    <TableHead>Warna</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((category) => (
                    <TableRow
                      key={category.$id}
                      className="transition-all hover:bg-teal-50"
                    >
                      <TableCell>{category.name}</TableCell>
                      <TableCell>
                        <span
                          className={
                            category.type === 1
                              ? "font-semibold text-teal-600"
                              : "font-semibold text-rose-600"
                          }
                        >
                          {category.type === 1 ? "Kredit" : "Debet"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <i className={`fas fa-${category.icon}`}></i>
                      </TableCell>
                      <TableCell>
                        <div className="h-6 w-6 rounded-full border border-teal-200"></div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-xl border-teal-200 transition-all hover:bg-teal-50"
                            onClick={() => handleCategoryEdit(category)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="rounded-xl transition-all hover:bg-rose-100"
                            onClick={() => handleCategoryDelete(category.$id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function CashCategoryPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
            <p className="text-gray-600">Memuat halaman...</p>
          </div>
        </div>
      }
    >
      <CashCategoryPageContent />
    </Suspense>
  );
}
