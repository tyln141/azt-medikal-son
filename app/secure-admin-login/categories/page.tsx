"use client";

import { useState } from "react";
import useSWR from "swr";
import { categoriesService } from "@/lib/services/categories";
import { Category } from "@/types";
import CategoryForm from "@/components/admin/CategoryForm";

export default function CategoriesPage() {
  const { data: categories, mutate } = useSWR("categories", () => categoriesService.getAll());
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | undefined>();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCategories = (categories || []).filter(c => 
    c.name?.tr?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = async (data: Partial<Category>) => {
    try {
      await categoriesService.create(data as any);
      setIsFormOpen(false);
      mutate();
    } catch (error) {
       console.error(error);
    }
  };

  const handleUpdate = async (data: Partial<Category>) => {
    if (!editingCategory) return;
    try {
      await categoriesService.update(editingCategory.id, data as any);
      setEditingCategory(undefined);
      mutate();
    } catch (error) {
       console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu kategoriyi silmek istediğinize emin misiniz? Bu işlem geri alınamaz.")) return;
    try {
      await categoriesService.delete(id);
      mutate();
    } catch (error) {
       console.error(error);
    }
  };

  const inputClass = "w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-300 bg-white text-gray-900 font-bold placeholder-gray-500 focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm";

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">Kategori Yönetimi</h1>
          <p className="text-gray-800 font-bold">Ürün gruplarını buradan düzenleyebilirsiniz.</p>
        </div>
        {!isFormOpen && !editingCategory && (
          <button
            onClick={() => setIsFormOpen(true)}
            className="bg-zinc-900 text-white px-10 py-4 rounded-2xl font-black flex items-center justify-center gap-3 shadow-2xl hover:bg-blue-600 transition-all active:scale-95 uppercase tracking-widest text-sm"
          >
            <span className="text-2xl">+</span> Yeni Kategori Ekle
          </button>
        )}
      </div>

      {(isFormOpen || editingCategory) ? (
        <div className="animate-in fade-in slide-in-from-bottom-6 duration-500">
          <CategoryForm
            initialData={editingCategory}
            onSubmit={editingCategory ? handleUpdate : handleCreate}
            onCancel={() => {
              setIsFormOpen(false);
              setEditingCategory(undefined);
            }}
          />
        </div>
      ) : (
        <div className="space-y-8 animate-in fade-in duration-500">
          <div className="max-w-md relative">
             <input
              type="text"
              placeholder="Kategori adı ile ara..."
              className={inputClass}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
             />
             <span className="absolute left-5 top-1/2 -translate-y-1/2 text-2xl">🔍</span>
          </div>

          <div className="bg-white rounded-[40px] border border-gray-200 shadow-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-zinc-100 border-b border-zinc-200">
                  <tr className="text-xs uppercase font-black text-gray-900 tracking-[0.2em]">
                    <th className="px-10 py-6">İkon / Görsel</th>
                    <th className="px-10 py-6">Kategori Detayı</th>
                    <th className="px-10 py-6">Açıklama (TR)</th>
                    <th className="px-10 py-6 text-right">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {filteredCategories.map((category) => (
                    <tr key={category.id} className="hover:bg-zinc-50/80 transition-all group">
                      <td className="px-10 py-6">
                         <div className="w-20 h-20 rounded-2xl overflow-hidden bg-white border border-zinc-200 flex items-center justify-center p-2 shadow-sm transition-transform group-hover:scale-105">
                           {(() => {
                             const img = category.image;
                             const url = typeof img === 'object' ? img?.url : img;
                             return url ? (
                               <img src={url} className="max-w-full max-h-full object-contain" alt="Category" />
                             ) : (
                               <div className="opacity-20 text-3xl">🖼️</div>
                             );
                           })()}
                        </div>
                      </td>
                      <td className="px-10 py-6">
                        <div className="flex flex-col">
                          <span className="text-lg font-black text-gray-900 mb-1">{category.name?.tr || "İsimsiz Kategori"}</span>
                          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{category.id}</span>
                        </div>
                      </td>
                      <td className="px-10 py-6 max-w-md truncate text-gray-900 font-bold">
                        {category.description?.tr || "-"}
                      </td>
                      <td className="px-10 py-6 text-right">
                        <div className="flex justify-end gap-3 translate-x-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                           <button
                            onClick={() => setEditingCategory(category)}
                            className="w-12 h-12 flex items-center justify-center bg-zinc-900 text-white rounded-xl hover:bg-blue-600 transition-all shadow-xl active:scale-90"
                            title="Düzenle"
                           >
                              ✏️
                           </button>
                           <button
                             onClick={() => handleDelete(category.id)}
                             className="w-12 h-12 flex items-center justify-center bg-white text-red-600 border border-red-100 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-xl active:scale-90"
                             title="Sil"
                           >
                              🗑️
                           </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredCategories.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-10 py-24 text-center">
                        <div className="flex flex-col items-center">
                          <span className="text-6xl mb-4 opacity-20">🔎</span>
                          <p className="text-gray-900 font-black text-xl">Kategori bulunamadı.</p>
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
