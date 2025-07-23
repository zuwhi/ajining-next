"use client";

import React, { useEffect, useState } from "react";
import {
  databases,
  storage,
  DATABASE_ID,
  COLLECTION_PRODUCT_ID,
  COLLECTION_PRODUCT_CATEGORY_ID,
  BUCKET_ID,
  ID,
  Query,
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
import { format } from "date-fns";

export const dynamic = "force-dynamic";

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
  images: string; // simpan sebagai string JSON
  productCategory: ProductCategory[];
}

interface ProductFormData extends Omit<Partial<Product>, "productCategory"> {
  productCategory: string[]; // array of string
}

export async function fetchProductsFromAppwrite() {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTION_PRODUCT_ID,
    );
    return response.documents.map((doc: any) => ({
      $id: doc.$id,
      name: doc.name,
      desc: doc.desc,
      slug: doc.slug,
      price: doc.price,
      date: doc.date,
      images: doc.images, // tetap string di Product
      productCategory: doc.productCategory || [],
    }));
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export function getProductImageUrl(fileId: string) {
  if (!fileId) return "";
  return `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${fileId}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`;
}

export default function ProductPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    desc: "",
    slug: "",
    price: 0,
    date: format(new Date(), "yyyy-MM-dd"),
    images: "", // string kosong, akan diisi JSON.stringify(array)
    productCategory: [],
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
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_PRODUCT_ID,
      );

      console.log(JSON.stringify(response, null, 2));

      setProducts(
        response.documents.map((doc: any) => ({
          $id: doc.$id,
          name: doc.name,
          desc: doc.desc,
          slug: doc.slug,
          price: doc.price,
          date: doc.date,
          images: doc.images, // tetap string di Product
          productCategory: doc.productCategory || [],
        })),
      );
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const uploadImages = async (files: File[]): Promise<string[]> => {
    const ids: string[] = [];
    for (const file of files) {
      try {
        const response = await storage.createFile(BUCKET_ID, ID.unique(), file);
        ids.push(response.$id);
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
    return ids;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let imageIds = formData.images;
      if (selectedFiles.length > 0) {
        imageIds = JSON.stringify(await uploadImages(selectedFiles));
      }
      const productData = {
        name: formData.name,
        desc: formData.desc,
        slug: formData.slug,
        price: formData.price,
        date: formData.date,
        images: imageIds, // always string
        productCategory: formData.productCategory,
      };
      if (formData.$id) {
        await databases.updateDocument(
          DATABASE_ID,
          COLLECTION_PRODUCT_ID,
          formData.$id,
          productData,
        );
      } else {
        await databases.createDocument(
          DATABASE_ID,
          COLLECTION_PRODUCT_ID,
          ID.unique(),
          productData,
        );
      }
      setIsDialogOpen(false);
      setSelectedFiles([]);
      setImagePreviews([]);
      fetchProducts();
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await databases.deleteDocument(DATABASE_ID, COLLECTION_PRODUCT_ID, id);
        fetchProducts();
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  const handleEdit = (product: Product) => {
    let imagesArr: string[] = [];
    try {
      imagesArr = Array.isArray(product.images)
        ? product.images
        : JSON.parse(product.images || "[]");
    } catch {
      imagesArr = [];
    }
    setFormData({
      ...product,
      images: JSON.stringify(imagesArr), // always string
      productCategory: Array.isArray(product.productCategory)
        ? product.productCategory.map((cat) =>
            typeof cat === "string" ? cat : cat.$id,
          )
        : [],
    });
    setImagePreviews(imagesArr.map((imgId) => getProductImageUrl(imgId)));
    setSelectedFiles([]);
    setIsDialogOpen(true);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="mb-2 text-4xl font-extrabold tracking-tight text-teal-700">
          Kelola Produk
        </h1>
        <p className="text-lg text-gray-500">Tambah, edit, dan kelola produk</p>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button
            className="mb-4 rounded-xl bg-teal-600 text-white shadow-md transition-all hover:bg-teal-700"
            onClick={() => {
              setFormData({
                name: "",
                desc: "",
                slug: "",
                price: 0,
                date: format(new Date(), "yyyy-MM-dd"),
                images: "",
                productCategory: [],
              });
              setSelectedFiles([]);
              setImagePreviews([]);
            }}
          >
            Tambah Produk Baru
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl rounded-xl shadow-md">
          <DialogHeader>
            <DialogTitle>
              {formData.$id ? "Edit Produk" : "Tambah Produk Baru"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nama Produk
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="col-span-3"
                placeholder="Masukkan nama produk"
                required
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
                placeholder="Masukkan deskripsi produk"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="slug" className="text-right">
                Slug
              </Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
                className="col-span-3"
                placeholder="kursi-kayu-minimalis"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                Harga
              </Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: Number(e.target.value) })
                }
                className="col-span-3"
                placeholder="350000"
                required
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
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="images" className="text-right">
                Gambar
              </Label>
              <Input
                id="images"
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="col-span-3"
              />
            </div>
            {imagePreviews.length > 0 && (
              <div className="col-span-4 flex flex-wrap gap-2">
                {imagePreviews.map((src, idx) => (
                  <img
                    key={idx}
                    src={src}
                    alt={`Preview ${idx}`}
                    className="max-h-24 rounded"
                  />
                ))}
              </div>
            )}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="productCategory" className="text-right">
                Kategori Produk
              </Label>
              <select
                id="productCategory"
                multiple
                value={formData.productCategory}
                onChange={(e) => {
                  const selected = Array.from(
                    e.target.selectedOptions,
                    (option) => option.value,
                  );
                  setFormData({ ...formData, productCategory: selected });
                }}
                className="col-span-3 rounded border px-2 py-1"
                required
              >
                {categories.map((cat) => (
                  <option key={cat.$id} value={cat.$id}>
                    {cat.name}
                  </option>
                ))}
              </select>
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
              <TableHead>Deskripsi</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Harga</TableHead>
              <TableHead>Tanggal</TableHead>
              <TableHead>Gambar</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8}>Loading...</TableCell>
              </TableRow>
            ) : products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8}>Belum ada produk.</TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.$id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.desc}</TableCell>
                  <TableCell>{product.slug}</TableCell>
                  <TableCell>{product.price}</TableCell>
                  <TableCell>
                    {format(new Date(product.date), "yyyy-MM-dd")}
                  </TableCell>
                  <TableCell>
                    {(() => {
                      let imagesArr: string[] = [];
                      try {
                        imagesArr = Array.isArray(product.images)
                          ? product.images
                          : JSON.parse(product.images || "[]");
                      } catch {
                        imagesArr = [];
                      }
                      return imagesArr.length > 0 ? (
                        <img
                          src={getProductImageUrl(imagesArr[0])}
                          alt={product.name}
                          className="mr-1 inline-block max-h-10 rounded"
                        />
                      ) : (
                        "-"
                      );
                    })()}
                  </TableCell>
                  <TableCell>
                    {Array.isArray(product.productCategory) &&
                    product.productCategory.length > 0
                      ? product.productCategory
                          .map((catId) => {
                            const cat = categories.find(
                              (c) =>
                                c.$id ===
                                (typeof catId === "string" ? catId : catId.$id),
                            );
                            return cat ? cat.name : "-";
                          })
                          .join(", ")
                      : "-"}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mr-2"
                      onClick={() => handleEdit(product)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(product.$id)}
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
