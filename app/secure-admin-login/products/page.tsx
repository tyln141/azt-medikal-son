"use client";

import { useState } from "react";
import useSWR from "swr";
import { productsService } from "@/lib/services/products";
import { categoriesService } from "@/lib/services/categories";
import { Product } from "@/types";
import ProductForm from "@/components/admin/ProductForm";

export default function ProductsPage() {
  const { data: products, mutate } = useSWR("products", () => productsService.getAll());
  const { data: categories } = useSWR("categories", () => categoriesService.getAll());
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = (products || []).filter(p => 
    p.name?.tr?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.categoryId === searchTerm
  );

  const handleCreate = async (data: Partial<Product>) => {
    try {
      await productsService.create(data as any);
      setIsFormOpen(false);
      mutate();
    } catch (error) {
       console.error(error);
    }
  };

  const handleUpdate = async (data: Partial<Product>) => {
    if (!editingProduct) return;
    try {
      await productsService.update(editingProduct.id, data as any);
      setEditingProduct(undefined);
      mutate();
    } catch (error) {
       console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu ürünü silmek istediğinize emin misiniz?")) return;
    try {
      await productsService.delete(id);
      mutate();
    } catch (error) {
       console.error(error);
    }
  };

  const inputClass = "w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-300 bg-white text-gray-900 font-bold placeholder-gray-500 focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm";
  const selectClass = "px-8 py-4 rounded-2xl border border-gray-300 bg-white text-gray-900 font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm cursor-pointer";

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">Ürün Yönetimi</h1>
          <p className="text-gray-800 font-bold">Mağazanızdaki tüm ürünleri buradan düzenleyin.</p>
        </div>
        {!isFormOpen && !editingProduct && (
          <button
            onClick={() => setIsFormOpen(true)}
            className="bg-zinc-900 text-white px-10 py-4 rounded-2xl font-black flex items-center justify-center gap-3 shadow-2xl hover:bg-blue-600 transition-all active:scale-95 uppercase tracking-widest text-sm"
          >
            <span className="text-2xl">+</span> Yeni Ürün Ekle
          </button>
        )}
      </div>

      {(isFormOpen || editingProduct) ? (
        <div className="animate-in fade-in slide-in-from-bottom-6 duration-500">
          <ProductForm
            initialData={editingProduct}
            onSubmit={editingProduct ? handleUpdate : handleCreate}
            onCancel={() => {
              setIsFormOpen(false);
              setEditingProduct(undefined);
            }}
          />
        </div>
      ) : (
        <div className="space-y-8 animate-in fade-in duration-500">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 relative">
               <input
                type="text"
                placeholder="Ürün ismi veya kategori ID ile ara..."
                className={inputClass}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
               />
               <span className="absolute left-5 top-1/2 -translate-y-1/2 text-2xl group-focus-within:scale-110 transition-transform">🔍</span>
            </div>
            <select
              className={selectClass}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            >
              <option value="" className="font-bold">Tüm Kategoriler</option>
              {categories?.map(cat => (
                <option key={cat.id} value={cat.id} className="text-gray-900 font-bold">
                  {cat.name?.tr || cat.id}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-white rounded-[40px] border border-gray-200 shadow-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-zinc-100 border-b border-zinc-200">
                  <tr className="text-xs uppercase font-black text-gray-900 tracking-[0.2em]">
                    <th className="px-10 py-6">Görsel</th>
                    <th className="px-10 py-6">Ürün Detayı</th>
                    <th className="px-10 py-6">Kategori</th>
                    <th className="px-10 py-6 text-right">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-zinc-50/80 transition-all group">
                      <td className="px-10 py-6">
                        <div className="w-20 h-20 rounded-2xl overflow-hidden bg-white border border-zinc-200 flex items-center justify-center p-2 shadow-sm transition-transform group-hover:scale-105">
                           {(() => {
                             const img = product.images?.[0];
                             const url = typeof img === 'object' ? (img as any)?.url : img;
                             return url ? (
                               <img src={url} className="max-w-full max-h-full object-contain" alt="Product" />
                             ) : (
                               <div className="opacity-20 text-3xl">🖼️</div>
                             );
                           })()}
                        </div>
                      </td>
                      <td className="px-10 py-6">
                        <div className="flex flex-col">
                          <span className="text-lg font-black text-gray-900 mb-1">{product.name?.tr || "İsimsiz Ürün"}</span>
                          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{product.id}</span>
                        </div>
                      </td>
                      <td className="px-10 py-6">
                        <span className="px-4 py-2 bg-blue-50 text-blue-700 rounded-xl text-[10px] font-black uppercase tracking-widest border border-blue-100">
                           {categories?.find(c => c.id === product.categoryId)?.name?.tr || "Kategorisiz"}
                        </span>
                      </td>
                      <td className="px-10 py-6 text-right">
                        <div className="flex justify-end gap-3 translate-x-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                           <button
                            onClick={() => setEditingProduct(product)}
                            className="w-12 h-12 flex items-center justify-center bg-zinc-900 text-white rounded-xl hover:bg-blue-600 transition-all shadow-xl active:scale-90"
                            title="Düzenle"
                           >
                              ✏️
                           </button>
                           <button
                             onClick={() => handleDelete(product.id)}
                             className="w-12 h-12 flex items-center justify-center bg-white text-red-600 border border-red-100 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-xl active:scale-90"
                             title="Sil"
                           >
                              🗑️
                           </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredProducts.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-10 py-24 text-center">
                        <div className="flex flex-col items-center">
                          <span className="text-6xl mb-4 opacity-20">🔎</span>
                          <p className="text-gray-900 font-black text-xl">Aradığınız kriterde ürün bulunamadı.</p>
                          <p className="text-gray-500 font-bold mt-2">Filtreleri değiştirmeyi veya yeni ürün eklemeyi deneyin.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
