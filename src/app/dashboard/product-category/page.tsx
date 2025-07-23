"use client";

import React, { useEffect, useState } from "react";
import {
  databases,
  DATABASE_ID,
  COLLECTION_PRODUCT_CATEGORY_ID,
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

export const dynamic = "force-dynamic";

interface ProductCategory {
  $id: string;
  name: string;
}

export default function ProductCategoryPage() {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<ProductCategory>>({
    name: "",
  });

  const fetchCategories = async () => {
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
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const categoryData = {
        name: formData.name,
      };
      if (formData.$id) {
        await databases.updateDocument(
          DATABASE_ID,
          COLLECTION_PRODUCT_CATEGORY_ID,
          formData.$id,
          categoryData,
        );
      } else {
        await databases.createDocument(
          DATABASE_ID,
          COLLECTION_PRODUCT_CATEGORY_ID,
          ID.unique(),
          categoryData,
        );
      }
      setIsDialogOpen(false);
      fetchCategories();
    } catch (error) {
      console.error("Error saving product category:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (
      window.confirm("Are you sure you want to delete this product category?")
    ) {
      try {
        await databases.deleteDocument(
          DATABASE_ID,
          COLLECTION_PRODUCT_CATEGORY_ID,
          id,
        );
        fetchCategories();
      } catch (error) {
        console.error("Error deleting product category:", error);
      }
    }
  };

  const handleEdit = (category: ProductCategory) => {
    setFormData(category);
    setIsDialogOpen(true);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="mb-2 text-4xl font-extrabold tracking-tight text-teal-700">
          Kelola Kategori Produk
        </h1>
        <p className="text-lg text-gray-500">
          Tambah, edit, dan kelola kategori produk
        </p>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button
            className="mb-4 rounded-xl bg-teal-600 text-white shadow-md transition-all hover:bg-teal-700"
            onClick={() => {
              setFormData({ name: "" });
            }}
          >
            Tambah Kategori Produk Baru
          </Button>
        </DialogTrigger>
        <DialogContent className="rounded-xl shadow-md">
          <DialogHeader>
            <DialogTitle>
              {formData.$id
                ? "Edit Kategori Produk"
                : "Tambah Kategori Produk Baru"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nama
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="col-span-3"
                placeholder="Masukkan nama kategori produk"
                required
              />
            </div>
            <DialogFooter>
              <Button
                type="submit"
                className="bg-teal-600 text-white hover:bg-teal-700"
              >
                {formData.$id ? "Simpan Perubahan" : "Tambah"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <div className="overflow-x-auto rounded-xl bg-white p-4 shadow-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={2}>Loading...</TableCell>
              </TableRow>
            ) : categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={2}>Belum ada kategori produk.</TableCell>
              </TableRow>
            ) : (
              categories.map((category) => (
                <TableRow key={category.$id}>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mr-2"
                      onClick={() => handleEdit(category)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(category.$id)}
                    >
                      Hapus
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
