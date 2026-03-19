"use client";

import { useState, useRef } from "react";
import { Product, MultiLang, MultiLangArray } from "@/types";
import { categoriesService } from "@/lib/services/categories";
import useSWR from "swr";

interface ProductFormProps {
  initialData?: Product;
  onSubmit: (data: Partial<Product>) => Promise<void>;
  onCancel: () => void;
}

const LANGS = ["tr", "en", "de", "fr"] as const;
type Lang = typeof LANGS[number];

export default function ProductForm({ initialData, onSubmit, onCancel }: ProductFormProps) {
  const { data: categories } = useSWR("categories", () => categoriesService.getAll());
  
  const [activeLang, setActiveLang] = useState<Lang>("tr");
  const [formData, setFormData] = useState<Partial<Product>>(
    initialData || {
      name: { tr: "", en: "", de: "", fr: "" },
      description: { tr: "", en: "", de: "", fr: "" },
      features: { tr: [], en: [], de: [], fr: [] },
      categoryId: "",
      images: [],
    }
  );

  const [newFeature, setNewFeature] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTextChange = (field: "name" | "description", value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: {
        ...(typeof prev[field] === "object" ? prev[field] : {}),
        [activeLang]: value,
      },
    }));
  };

  const addFeature = () => {
    if (!newFeature.trim()) return;
    setFormData((prev) => {
      const current = (typeof prev.features === "object" ? prev.features?.[activeLang] : []) || [];
      const newFeatures = {
        tr: [], en: [], de: [], fr: [],
        ...(typeof prev.features === "object" ? prev.features : {}),
        [activeLang]: [...current, newFeature.trim()],
      };
      return {
        ...prev,
        features: newFeatures as MultiLangArray,
      };
    });
    setNewFeature("");
  };

  const removeFeature = (index: number) => {
    setFormData((prev) => {
      const current = (typeof prev.features === "object" ? prev.features?.[activeLang] : []) || [];
      const newFeatures = {
        tr: [], en: [], de: [], fr: [],
        ...(typeof prev.features === "object" ? prev.features : {}),
        [activeLang]: current.filter((_, i) => i !== index),
      };
      return {
        ...prev,
        features: newFeatures as MultiLangArray,
      };
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      const newImg = { url: base64, objectFit: "cover" as const };
      
      setFormData(prev => ({
        ...prev,
        images: [...(prev.images || []), newImg]
      }));
      
      if (fileInputRef.current) fileInputRef.current.value = "";
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...(formData.images || [])];
    newImages.splice(index, 1);
    setFormData({ ...formData, images: newImages });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.categoryId) {
      alert("Kategori seçin.");
      return;
    }
    setIsSubmitting(true);
    try {
      await onSubmit({ ...formData, images: formData.images || [] });
    } catch (error) {
       console.error(error);
       alert("Hata oluştu.");
    } finally {
       setIsSubmitting(false);
    }
  };

  const inputClass = "w-full px-5 py-4 rounded-2xl border border-gray-300 bg-white text-gray-900 font-bold placeholder-gray-500 focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm";
  const labelClass = "block text-xs font-black text-gray-900 uppercase mb-2 tracking-widest";

  return (
    <form onSubmit={handleSubmit} className="space-y-10 bg-white p-10 rounded-[40px] border border-gray-200 shadow-2xl">
      <div className="flex justify-between items-center border-b border-zinc-100 pb-8">
        <h2 className="text-3xl font-black text-gray-900">
          {initialData ? "ÜRÜN DÜZENLEME" : "YENİ ÜRÜN"}
        </h2>
        <div className="flex bg-zinc-200 p-1 rounded-2xl">
          {LANGS.map((lang) => (
            <button
              key={lang} type="button" onClick={() => setActiveLang(lang)}
              className={`px-6 py-2 rounded-xl text-xs font-black uppercase transition-all ${
                activeLang === lang ? "bg-white text-blue-600 shadow-md" : "text-gray-900 hover:bg-white/50"
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div>
            <label className={labelClass}>Ürün İsmi ({activeLang})</label>
            <input required type="text" className={inputClass} value={formData.name?.[activeLang] || ""} onChange={(e) => handleTextChange("name", e.target.value)} />
          </div>

          <div>
            <label className={labelClass}>Açıklama ({activeLang})</label>
            <textarea rows={5} className={inputClass} value={formData.description?.[activeLang] || ""} onChange={(e) => handleTextChange("description", e.target.value)} />
          </div>

          <div>
            <label className={labelClass}>Ürün Kategorisi</label>
            <select required className={inputClass} value={formData.categoryId || ""} onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}>
              <option value="" className="text-gray-400">Seçim Yapın</option>
              {categories?.map((cat) => (
                <option key={cat.id} value={cat.id} className="text-gray-900 font-bold">{cat.name?.[activeLang] || cat.name?.tr || cat.id}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>Teknik Özellikler ({activeLang})</label>
            <div className="flex gap-3 mb-4">
              <input type="text" className={inputClass} placeholder="Yeni özellik yazın..." value={newFeature} onChange={(e) => setNewFeature(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())} />
              <button type="button" onClick={addFeature} className="px-8 bg-zinc-900 text-white font-black rounded-2xl hover:bg-black transition-all">EKLE</button>
            </div>
            <div className="space-y-3">
              {(formData.features?.[activeLang] || []).map((feature, idx) => (
                <div key={idx} className="flex justify-between items-center bg-zinc-50 px-6 py-4 rounded-2xl border border-zinc-200 group">
                  <span className="text-gray-900 font-bold">{feature}</span>
                  <button type="button" onClick={() => removeFeature(idx)} className="text-red-600 font-black text-sm opacity-0 group-hover:opacity-100 uppercase tracking-tighter">SİL</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <label className={labelClass}>Ürün Görselleri</label>
            <div className="grid grid-cols-1 gap-8">
              {(formData.images || []).map((img, index) => {
                const isConfig = typeof img === 'object' && img !== null;
                const url = isConfig ? (img as any).url : img;
                if (!url) return null;
                return (
                  <div key={index} className="p-8 bg-zinc-50 border border-zinc-200 rounded-[32px] space-y-6">
                    <div className="relative aspect-video rounded-2xl overflow-hidden bg-white border border-zinc-200 flex items-center justify-center p-4">
                      <img src={url} style={{
                          width: isConfig && (img as any).width ? (img as any).width + "px" : "100%",
                          height: isConfig && (img as any).height ? (img as any).height + "px" : "auto",
                          objectFit: (isConfig && (img as any).objectFit) || "cover"
                        }} className="max-h-full" />
                    </div>
                    
                    <div className="grid grid-cols-3 gap-3">
                       <div><label className="text-[10px] font-black text-gray-500 uppercase">W (px)</label><input type="number" className="w-full p-2 text-xs border border-gray-300 rounded-lg bg-white text-gray-900 font-bold" value={isConfig ? ((img as any).width || "") : ""} onChange={(e) => {
                          const val = parseInt(e.target.value) || undefined;
                          const newImages = [...(formData.images || [])];
                          newImages[index] = { ...((img as any) || {}), width: val };
                          setFormData(prev => ({ ...prev, images: newImages }));
                       }} /></div>
                       <div><label className="text-[10px] font-black text-gray-500 uppercase">H (px)</label><input type="number" className="w-full p-2 text-xs border border-gray-300 rounded-lg bg-white text-gray-900 font-bold" value={isConfig ? ((img as any).height || "") : ""} onChange={(e) => {
                          const val = parseInt(e.target.value) || undefined;
                          const newImages = [...(formData.images || [])];
                          newImages[index] = { ...((img as any) || {}), height: val };
                          setFormData(prev => ({ ...prev, images: newImages }));
                       }} /></div>
                       <div><label className="text-[10px] font-black text-gray-500 uppercase">Fit</label><select className="w-full p-2 text-[10px] border border-gray-300 rounded-lg bg-white text-gray-900 font-bold" value={isConfig ? ((img as any).objectFit || "cover") : "cover"} onChange={(e) => {
                          const newImages = [...(formData.images || [])];
                          newImages[index] = { ...((img as any) || {}), objectFit: e.target.value as any };
                          setFormData(prev => ({ ...prev, images: newImages }));
                       }}><option value="cover">Cover</option><option value="contain">Contain</option></select></div>
                    </div>

                    <button type="button" onClick={() => handleRemoveImage(index)} className="w-full py-4 text-xs font-black bg-red-600 text-white rounded-2xl hover:bg-black transition-all uppercase tracking-widest shadow-xl shadow-red-500/10">
                      GÖRSELİ SİL
                    </button>
                  </div>
                );
              })}
              
              <label className="block w-full py-16 rounded-[32px] border-4 border-dashed border-zinc-200 hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer text-center relative">
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                <div className="flex flex-col items-center justify-center">
                  <span className="text-5xl mb-4">📸</span>
                  <span className="font-black text-lg text-gray-900">YENİ GÖRSEL YÜKLE</span>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-6 pt-10 border-t border-zinc-100">
        <button type="button" onClick={onCancel} className="px-10 py-5 rounded-2xl font-black text-gray-900 hover:bg-zinc-100 transition-all uppercase tracking-widest text-sm">VAZGEÇ</button>
        <button disabled={isSubmitting} type="submit" className="px-16 py-5 bg-zinc-900 text-white rounded-[24px] font-black hover:bg-blue-600 transition-all shadow-2xl disabled:opacity-50 active:scale-95 text-lg uppercase">
          {isSubmitting ? "KAYDEDİLİYOR..." : "ÜRÜNÜ YAYINLA / GÜNCELLE"}
        </button>
      </div>
    </form>
  );
}