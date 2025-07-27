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
import { Textarea } from "@/components/ui/textarea";
import { databases, DATABASE_ID, COLLECTION_NOTA_ID, ID } from "@/lib/appwrite";
import {
  EyeIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  PrinterIcon,
} from "@heroicons/react/24/outline";

interface OrderDetail {
  $id: string;
  product_name: string;
  qty: number;
  price: number;
  subtotal: number;
}

interface NotaData {
  $id: string;
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

interface EditFormData {
  name: string;
  contact_person: string;
  handphone: string;
  address: string;
  date: string;
}

export default function NotaPage() {
  const [notas, setNotas] = useState<NotaData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNota, setSelectedNota] = useState<NotaData | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editForm, setEditForm] = useState<EditFormData>({
    name: "",
    contact_person: "",
    handphone: "",
    address: "",
    date: "",
  });

  useEffect(() => {
    fetchNotas();
  }, []);

  const fetchNotas = async () => {
    setIsLoading(true);
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_NOTA_ID,
      );
      setNotas(response.documents as unknown as NotaData[]);
    } catch (error) {
      console.error("Error fetching notas:", error);
      setNotas([]);
    }
    setIsLoading(false);
  };

  const handleViewDetail = (nota: NotaData) => {
    setSelectedNota(nota);
    setIsDetailOpen(true);
  };

  const handleEdit = (nota: NotaData) => {
    setSelectedNota(nota);
    setEditForm({
      name: nota.name,
      contact_person: nota.contact_person,
      handphone: nota.handphone,
      address: nota.address,
      date: new Date(nota.date).toISOString().split("T")[0],
    });
    setIsEditOpen(true);
  };

  const handleDelete = (nota: NotaData) => {
    setSelectedNota(nota);
    setIsDeleteOpen(true);
  };

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedNota) return;

    setIsSubmitting(true);
    try {
      await databases.updateDocument(
        DATABASE_ID,
        COLLECTION_NOTA_ID,
        selectedNota.$id,
        {
          name: editForm.name,
          contact_person: editForm.contact_person,
          handphone: editForm.handphone,
          address: editForm.address,
          date: new Date(editForm.date).toISOString(),
        },
      );

      // Refresh the list
      await fetchNotas();
      setIsEditOpen(false);
      setSelectedNota(null);
    } catch (error) {
      console.error("Error updating nota:", error);
      alert("Terjadi kesalahan saat mengupdate nota.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedNota) return;

    setIsSubmitting(true);
    try {
      await databases.deleteDocument(
        DATABASE_ID,
        COLLECTION_NOTA_ID,
        selectedNota.$id,
      );

      // Refresh the list
      await fetchNotas();
      setIsDeleteOpen(false);
      setSelectedNota(null);
    } catch (error) {
      console.error("Error deleting nota:", error);
      alert("Terjadi kesalahan saat menghapus nota.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrintInvoice = (nota: NotaData) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
      }).format(amount);
    };

    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    };

    const invoiceNumber = nota.$id.slice(-8).toUpperCase();
    const currentDate = new Date().toLocaleDateString("id-ID");

    const printContent = `
      <!DOCTYPE html>
      <html lang="id">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Invoice - ${nota.name}</title>
        <style>
          @media print {
            body { margin: 0; }
            .no-print { display: none !important; }
          }
          
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background: #fff;
          }
          
          .invoice-container {
            max-width: 800px;
            margin: 0 auto;
            padding: 40px 20px;
            background: #fff;
          }
          
          .header {
            text-align: center;
            margin-bottom: 40px;
            padding-bottom: 20px;
            border-bottom: 3px solid #14b8a6;
          }
          
          .company-name {
            font-size: 28px;
            font-weight: bold;
            color: #14b8a6;
            margin-bottom: 5px;
          }
          
          .company-tagline {
            font-size: 14px;
            color: #666;
            margin-bottom: 10px;
          }
          
          .invoice-title {
            font-size: 24px;
            font-weight: bold;
            color: #333;
            margin-bottom: 5px;
          }
          
          .invoice-number {
            font-size: 16px;
            color: #666;
          }
          
          .invoice-details {
            display: flex;
            justify-content: space-between;
            margin-bottom: 40px;
            flex-wrap: wrap;
            gap: 20px;
          }
          
          .customer-info, .invoice-info {
            flex: 1;
            min-width: 300px;
          }
          
          .section-title {
            font-size: 18px;
            font-weight: bold;
            color: #14b8a6;
            margin-bottom: 15px;
            padding-bottom: 5px;
            border-bottom: 2px solid #e5e7eb;
          }
          
          .info-row {
            margin-bottom: 8px;
          }
          
          .info-label {
            font-weight: 600;
            color: #555;
            display: inline-block;
            width: 120px;
          }
          
          .info-value {
            color: #333;
          }
          
          .products-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          }
          
          .products-table th {
            background: #14b8a6;
            color: white;
            padding: 15px 10px;
            text-align: left;
            font-weight: 600;
          }
          
          .products-table td {
            padding: 12px 10px;
            border-bottom: 1px solid #e5e7eb;
          }
          
          .products-table tr:nth-child(even) {
            background: #f9fafb;
          }
          
          .text-right {
            text-align: right;
          }
          
          .text-center {
            text-align: center;
          }
          
          .summary {
            margin-left: auto;
            width: 300px;
            background: #f8fafc;
            padding: 20px;
            border-radius: 8px;
            border: 2px solid #e5e7eb;
          }
          
          .summary-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            padding-bottom: 5px;
            border-bottom: 1px solid #e5e7eb;
          }
          
          .summary-row:last-child {
            border-bottom: none;
            font-weight: bold;
            font-size: 18px;
            color: #14b8a6;
            margin-top: 10px;
            padding-top: 10px;
            border-top: 2px solid #14b8a6;
          }
          
          .footer {
            margin-top: 40px;
            text-align: center;
            color: #666;
            font-size: 14px;
            border-top: 1px solid #e5e7eb;
            padding-top: 20px;
          }
          
          .print-button {
            position: fixed;
            top: 20px;
            right: 20px;
            background: #14b8a6;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 16px;
            font-weight: 600;
            box-shadow: 0 4px 12px rgba(20, 184, 166, 0.3);
            transition: all 0.3s ease;
          }
          
          .print-button:hover {
            background: #0d9488;
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(20, 184, 166, 0.4);
          }
          
          @media print {
            .print-button {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        <button class="print-button no-print" onclick="window.print()">
          🖨️ Cetak Invoice
        </button>
        
        <div class="invoice-container">
          <div class="header">
            <div class="company-name">AJINING FURNITURE</div>
            <div class="company-tagline">Solusi Furnitur Berkualitas untuk Rumah Impian Anda</div>
            <div class="invoice-title">INVOICE</div>
            <div class="invoice-number">No: INV-${invoiceNumber}</div>
          </div>
          
          <div class="invoice-details">
            <div class="customer-info">
              <div class="section-title">Informasi Pelanggan</div>
              <div class="info-row">
                <span class="info-label">Nama:</span>
                <span class="info-value">${nota.name}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Contact Person:</span>
                <span class="info-value">${nota.contact_person}</span>
              </div>
              <div class="info-row">
                <span class="info-label">No. HP:</span>
                <span class="info-value">${nota.handphone}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Alamat:</span>
                <span class="info-value">${nota.address}</span>
              </div>
            </div>
            
            <div class="invoice-info">
              <div class="section-title">Informasi Invoice</div>
              <div class="info-row">
                <span class="info-label">Tanggal Invoice:</span>
                <span class="info-value">${formatDate(nota.date)}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Tanggal Cetak:</span>
                <span class="info-value">${currentDate}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Status:</span>
                <span class="info-value" style="color: #059669; font-weight: bold;">LUNAS</span>
              </div>
            </div>
          </div>
          
          <table class="products-table">
            <thead>
              <tr>
                <th style="width: 40%;">Produk</th>
                <th style="width: 15%; text-align: center;">Qty</th>
                <th style="width: 20%; text-align: right;">Harga Satuan</th>
                <th style="width: 25%; text-align: right;">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${nota.detailNota
                .map(
                  (item) => `
                <tr>
                  <td>${item.product_name}</td>
                  <td class="text-center">${item.qty}</td>
                  <td class="text-right">${formatCurrency(item.price)}</td>
                  <td class="text-right">${formatCurrency(item.subtotal)}</td>
                </tr>
              `,
                )
                .join("")}
            </tbody>
          </table>
          
          <div class="summary">
            <div class="summary-row">
              <span>Subtotal:</span>
              <span>${formatCurrency(nota.subtotal)}</span>
            </div>
            <div class="summary-row">
              <span>Diskon (10%):</span>
              <span style="color: #dc2626;">-${formatCurrency(nota.discount)}</span>
            </div>
            <div class="summary-row">
              <span>Pajak (10%):</span>
              <span>${formatCurrency(nota.tax)}</span>
            </div>
            <div class="summary-row">
              <span>TOTAL:</span>
              <span>${formatCurrency(nota.total)}</span>
            </div>
          </div>
          
          <div class="footer">
            <p>Terima kasih telah mempercayai AJINING FURNITURE</p>
            <p>Untuk pertanyaan atau informasi lebih lanjut, silakan hubungi kami</p>
            <p style="margin-top: 10px; font-weight: bold; color: #14b8a6;">
              AJINING FURNITURE - Solusi Furnitur Berkualitas
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
  };

  const filteredNotas = notas.filter(
    (nota) =>
      nota.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nota.contact_person.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nota.handphone.includes(searchTerm),
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-teal-700">Nota</h1>
          <p className="text-gray-600">Kelola semua nota dan invoice</p>
        </div>
        {/* <Button
          onClick={() => (window.location.href = "/dashboard/cart")}
          className="bg-teal-600 hover:bg-teal-700"
        >
          <PlusIcon className="mr-2 h-5 w-5" />
          Buat Nota Baru
        </Button> */}
      </div>

      {/* Search */}
      <div className="relative">
        <MagnifyingGlassIcon className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <Input
          type="text"
          placeholder="Cari nota berdasarkan nama, contact person, atau nomor HP..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Nota List */}
      {isLoading ? (
        <div className="py-8 text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-teal-600"></div>
          <p className="mt-2 text-gray-600">Memuat nota...</p>
        </div>
      ) : filteredNotas.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-gray-500">Tidak ada nota ditemukan.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredNotas.map((nota) => (
            <div
              key={nota.$id}
              className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mb-4 flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="truncate font-semibold text-gray-900">
                    {nota.name}
                  </h3>
                  <p className="text-sm text-gray-600">{nota.contact_person}</p>
                  <p className="text-sm text-gray-500">{nota.handphone}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-teal-600">
                    {formatCurrency(nota.total)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatDate(nota.date)}
                  </p>
                </div>
              </div>

              <div className="mb-4 flex items-center justify-between text-sm text-gray-600">
                <span>Subtotal: {formatCurrency(nota.subtotal)}</span>
                <span>Qty: {nota.detailNota.length} item</span>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewDetail(nota)}
                  className="flex-1"
                >
                  <EyeIcon className="mr-1 h-4 w-4" />
                  Detail
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(nota)}
                  className="flex-1"
                >
                  <PencilIcon className="mr-1 h-4 w-4" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(nota)}
                >
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detail Nota</DialogTitle>
          </DialogHeader>
          {selectedNota && (
            <div className="space-y-6">
              {/* Customer Info */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Nama Pembeli
                  </Label>
                  <p className="text-gray-900">{selectedNota.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Contact Person
                  </Label>
                  <p className="text-gray-900">{selectedNota.contact_person}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    No. HP
                  </Label>
                  <p className="text-gray-900">{selectedNota.handphone}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Tanggal
                  </Label>
                  <p className="text-gray-900">
                    {formatDate(selectedNota.date)}
                  </p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Alamat
                </Label>
                <p className="text-gray-900">{selectedNota.address}</p>
              </div>

              {/* Order Details */}
              <div>
                <Label className="mb-2 block text-sm font-medium text-gray-700">
                  Detail Produk
                </Label>
                <div className="overflow-hidden rounded-lg border">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                          Produk
                        </th>
                        <th className="px-4 py-2 text-right text-xs font-medium tracking-wider text-gray-500 uppercase">
                          Qty
                        </th>
                        <th className="px-4 py-2 text-right text-xs font-medium tracking-wider text-gray-500 uppercase">
                          Harga
                        </th>
                        <th className="px-4 py-2 text-right text-xs font-medium tracking-wider text-gray-500 uppercase">
                          Subtotal
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {selectedNota.detailNota.map((item) => (
                        <tr key={item.$id}>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {item.product_name}
                          </td>
                          <td className="px-4 py-3 text-right text-sm text-gray-900">
                            {item.qty}
                          </td>
                          <td className="px-4 py-3 text-right text-sm text-gray-900">
                            {formatCurrency(item.price)}
                          </td>
                          <td className="px-4 py-3 text-right text-sm text-gray-900">
                            {formatCurrency(item.subtotal)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Summary */}
              <div className="border-t pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">
                      {formatCurrency(selectedNota.subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Diskon:</span>
                    <span className="font-medium text-red-600">
                      -{formatCurrency(selectedNota.discount)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pajak:</span>
                    <span className="font-medium">
                      {formatCurrency(selectedNota.tax)}
                    </span>
                  </div>
                  <div className="flex justify-between border-t pt-2 text-lg font-bold text-teal-600">
                    <span>Total:</span>
                    <span>{formatCurrency(selectedNota.total)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailOpen(false)}>
              Tutup
            </Button>
            <Button
              onClick={() => selectedNota && handlePrintInvoice(selectedNota)}
              className="bg-teal-600 hover:bg-teal-700"
            >
              <PrinterIcon className="mr-2 h-4 w-4" />
              Cetak Invoice
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Nota</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmitEdit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit_name">Nama Pembeli</Label>
              <Input
                id="edit_name"
                value={editForm.name}
                onChange={(e) =>
                  setEditForm({ ...editForm, name: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_contact_person">Contact Person</Label>
              <Input
                id="edit_contact_person"
                value={editForm.contact_person}
                onChange={(e) =>
                  setEditForm({ ...editForm, contact_person: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_handphone">No. HP</Label>
              <Input
                id="edit_handphone"
                value={editForm.handphone}
                onChange={(e) =>
                  setEditForm({ ...editForm, handphone: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_address">Alamat</Label>
              <Textarea
                id="edit_address"
                value={editForm.address}
                onChange={(e) =>
                  setEditForm({ ...editForm, address: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_date">Tanggal</Label>
              <Input
                id="edit_date"
                type="date"
                value={editForm.date}
                onChange={(e) =>
                  setEditForm({ ...editForm, date: e.target.value })
                }
                required
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditOpen(false)}
                disabled={isSubmitting}
              >
                Batal
              </Button>
              <Button
                type="submit"
                className="bg-teal-600 hover:bg-teal-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-600">
              Apakah Anda yakin ingin menghapus nota "{selectedNota?.name}"?
              Tindakan ini tidak dapat dibatalkan.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteOpen(false)}
              disabled={isSubmitting}
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Menghapus..." : "Hapus"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
