"use client";

import { useState, useRef } from "react";
import { Category, MultiLang } from "@/types";

interface CategoryFormProps {
  initialData?: Category;
  onSubmit: (data: Partial<Category>) => Promise<void>;
  onCancel: () => void;
}

const LANGS = ["tr", "en", "de", "fr"] as const;
type Lang = typeof LANGS[number];

export default function CategoryForm({ initialData, onSubmit, onCancel }: CategoryFormProps) {
  const [activeLang, setActiveLang] = useState<Lang>("tr");
  const [formData, setFormData] = useState<Partial<Category>>(
    initialData || {
      name: { tr: "", en: "", de: "", fr: "" },
      description: { tr: "", en: "", de: "", fr: "" },
    }
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTextChange = (field: "name" | "description", value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: { ...(prev[field] as MultiLang), [activeLang]: value },
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setFormData(prev => ({
        ...prev,
        image: { ...((prev.image as any) || {}), url: base64, objectFit: "cover" as const }
      }));
      if (fileInputRef.current) fileInputRef.current.value = "";
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, image: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const finalImage = (formData.image as any)?.url ? formData.image : null;
      await onSubmit({ ...formData, image: finalImage as any });
    } catch (error) {
       console.error(error);
       alert("Bir hata oluştu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = "w-full px-5 py-4 rounded-2xl border border-gray-300 bg-white text-gray-900 font-bold placeholder-gray-500 focus:ring-2 focus:ring-blue-500 outline-none transition-all";
  const labelClass = "block text-xs font-black text-gray-900 uppercase mb-2 tracking-widest";

  return (
    <form onSubmit={handleSubmit} className="space-y-10 bg-white p-10 rounded-[40px] border border-gray-200 shadow-2xl">
      <div className="flex justify-between items-center border-b border-zinc-100 pb-8">
        <h2 className="text-3xl font-black text-gray-900">
          {initialData ? "KATEGORİ DÜZENLE" : "YENİ KATEGORİ"}
        </h2>
        <div className="flex bg-zinc-200 p-1 rounded-2xl gap-2">
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
            <label className={labelClass}>Kategori İsmi ({activeLang})</label>
            <input required type="text" className={inputClass} value={formData.name?.[activeLang] || ""} onChange={(e) => handleTextChange("name", e.target.value)} />
          </div>

          <div>
            <label className={labelClass}>Açıklama ({activeLang})</label>
            <textarea rows={6} className={inputClass} value={formData.description?.[activeLang] || ""} onChange={(e) => handleTextChange("description", e.target.value)} />
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <label className={labelClass}>Kategori Kapak Görseli</label>
            <div className="space-y-6">
              {(() => {
                const img = formData.image;
                const url = typeof img === 'object' ? img?.url : (typeof img === 'string' ? img : "");
                
                if (url) {
                  return (
                    <div className="p-8 bg-zinc-50 border border-zinc-200 rounded-[32px] space-y-6">
                      <div className="relative aspect-video rounded-2xl overflow-hidden bg-white border border-zinc-200 flex items-center justify-center p-4">
                        <img src={url} className="max-h-full" style={{
                            width: typeof img === 'object' && img?.width ? img.width + "px" : "100%",
                            height: typeof img === 'object' && img?.height ? img.height + "px" : "auto",
                            objectFit: (typeof img === 'object' && img?.objectFit) || "cover"
                          }} />
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                         <input type="number" placeholder="W" className="p-2 text-xs border border-gray-300 rounded-lg bg-white text-gray-900 font-black" value={typeof img === 'object' ? (img.width || "") : ""} onChange={(e) => {
                            const val = parseInt(e.target.value) || undefined;
                            const currentImg = (typeof formData.image === 'object' ? formData.image : { url }) as any;
                            setFormData({ ...formData, image: { ...currentImg, width: val } });
                         }} />
                         <input type="number" placeholder="H" className="p-2 text-xs border border-gray-300 rounded-lg bg-white text-gray-900 font-black" value={typeof img === 'object' ? (img.height || "") : ""} onChange={(e) => {
                            const val = parseInt(e.target.value) || undefined;
                            const currentImg = (typeof formData.image === 'object' ? formData.image : { url }) as any;
                            setFormData({ ...formData, image: { ...currentImg, height: val } });
                         }} />
                         <select className="p-2 text-[10px] border border-gray-300 rounded-lg bg-white text-gray-900 font-black" value={typeof img === 'object' ? (img.objectFit || "cover") : "cover"} onChange={(e) => {
                            const currentImg = (typeof formData.image === 'object' ? formData.image : { url }) as any;
                            setFormData({ ...formData, image: { ...currentImg, objectFit: e.target.value as any } });
                         }}><option value="cover">Cover</option><option value="contain">Contain</option></select>
                      </div>
                      <button type="button" onClick={handleRemoveImage} className="w-full py-4 text-xs font-black bg-red-600 text-white rounded-2xl hover:bg-black transition-all uppercase tracking-widest shadow-xl">
                        GÖRSELİ SİL
                      </button>
                    </div>
                  );
                }
                
                return (
                  <label className="block w-full py-20 rounded-[32px] border-4 border-dashed border-zinc-200 hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer text-center relative">
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                    <div className="flex flex-col items-center justify-center">
                      <span className="text-6xl mb-4">📸</span>
                      <span className="font-black text-lg text-gray-900 uppercase tracking-tight">Kategori Görseli Yükle</span>
                    </div>
                  </label>
                );
              })()}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-6 pt-10 border-t border-zinc-100">
        <button type="button" onClick={onCancel} className="px-10 py-5 rounded-2xl font-black text-gray-900 hover:bg-zinc-100 transition-all uppercase tracking-widest text-sm">VAZGEÇ</button>
        <button disabled={isSubmitting} type="submit" className="px-16 py-5 bg-zinc-900 text-white rounded-[24px] font-black hover:bg-black transition-all shadow-2xl disabled:opacity-50 active:scale-95 text-lg uppercase">
          {isSubmitting ? "KAYDEDİLİYOR..." : "KATEGORİYİ YAYINLA / GÜNCELLE"}
        </button>
      </div>
    </form>
  );
}
