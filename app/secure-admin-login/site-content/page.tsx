"use client";

import { useState, useEffect, useRef } from "react";
import useSWR from "swr";
import { siteContentService } from "@/lib/services/site-content";
import { SiteContent } from "@/types";

const LANGS = ["tr", "en", "de", "fr"] as const;
type Lang = typeof LANGS[number];
type Section = "logo" | "hero" | "about" | "whyUs" | "footer";

export default function SiteContentPage() {
  const { data: content, mutate, isLoading } = useSWR("site-content", () => siteContentService.getContent());
  
  const [activeSection, setActiveSection] = useState<Section>("hero");
  const [activeLang, setActiveLang] = useState<Lang>("tr");
  const [formData, setFormData] = useState<Partial<SiteContent>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Refs for clearing file inputs
  const logoInputRef = useRef<HTMLInputElement>(null);
  const heroInputRef = useRef<HTMLInputElement>(null);
  const aboutInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (content) {
      setFormData(content);
    } else if (!isLoading) {
       setFormData({
         logo: { url: "" },
         hero: { title: { tr: "", en: "", de: "", fr: "" }, subtitle: { tr: "", en: "", de: "", fr: "" }, buttonText: { tr: "", en: "", de: "", fr: "" } },
         about: { title: { tr: "", en: "", de: "", fr: "" }, description: { tr: "", en: "", de: "", fr: "" }, stats: [] },
         whyUs: [],
         footer: { address: "", phone: "", email: "", description: { tr: "", en: "", de: "", fr: "" }, workingHours: { tr: "", en: "", de: "", fr: "" }, copyright: { tr: "", en: "", de: "", fr: "" } }
       });
    }
  }, [content, isLoading]);

  const handleUpdate = async () => {
    setIsSubmitting(true);
    try {
      const safeData = {
        logo: formData.logo?.url ? formData.logo : null,
        hero: {
          title: formData.hero?.title || { tr: "" },
          subtitle: formData.hero?.subtitle || { tr: "" },
          buttonText: formData.hero?.buttonText || { tr: "" },
          image: (formData.hero?.image as any)?.url ? formData.hero?.image : null
        },
        about: {
          title: formData.about?.title || { tr: "" },
          description: formData.about?.description || { tr: "" },
          stats: Array.isArray(formData.about?.stats) ? formData.about.stats : [],
          image: (formData.about?.image as any)?.url ? formData.about?.image : null
        },
        whyUs: Array.isArray(formData.whyUs) ? formData.whyUs : [],
        footer: {
          phone: formData.footer?.phone || "",
          email: formData.footer?.email || "",
          address: formData.footer?.address || "",
          description: formData.footer?.description || { tr: "" },
          workingHours: formData.footer?.workingHours || { tr: "" },
          copyright: formData.footer?.copyright || { tr: "" }
        }
      };

      await siteContentService.update(safeData);
      mutate();
      alert("Başarıyla kaydedildi.");
    } catch (error: any) {
      console.error(error);
      alert("Kaydetme hatası: " + (error.message || "Bilinmeyen hata"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, section: "logo" | "hero" | "about") => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;

      if (section === "logo") {
        setFormData(prev => ({ ...prev, logo: { ...(prev.logo || {}), url: base64, objectFit: "contain" } } as any));
      } else if (section === "hero") {
        const currentImg = (formData.hero?.image as any) || {};
        setFormData(prev => ({ ...prev, hero: { ...prev.hero, image: { ...currentImg, url: base64, objectFit: "cover" } } } as any));
      } else if (section === "about") {
        const currentImg = (formData.about?.image as any) || {};
        setFormData(prev => ({ ...prev, about: { ...prev.about, image: { ...currentImg, url: base64, objectFit: "cover" } } } as any));
      }

      if (section === "logo" && logoInputRef.current) logoInputRef.current.value = "";
      if (section === "hero" && heroInputRef.current) heroInputRef.current.value = "";
      if (section === "about" && aboutInputRef.current) aboutInputRef.current.value = "";
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = (section: "logo" | "hero" | "about") => {
    if (section === "logo") {
      setFormData(prev => ({ ...prev, logo: null } as any));
    } else if (section === "hero") {
      setFormData(prev => ({ ...prev, hero: { ...prev.hero, image: null } } as any));
    } else if (section === "about") {
      setFormData(prev => ({ ...prev, about: { ...prev.about, image: null } } as any));
    }
  };

  if (isLoading && !content) return <div className="p-12 text-gray-900 font-bold">Yükleniyor...</div>;

  const inputClass = "w-full px-5 py-4 rounded-2xl border border-gray-300 bg-white text-gray-900 font-bold placeholder-gray-500 focus:ring-2 focus:ring-blue-500 outline-none transition-all";
  const labelClass = "block text-xs font-black text-gray-900 uppercase mb-2 tracking-widest";

  return (
    <div className="max-w-6xl pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-black mb-2">Site İçerik Yönetimi</h1>
          <p className="text-gray-800 font-bold">Tüm görsel ve metinleri buradan kontrol edin.</p>
        </div>
        <div className="flex bg-zinc-200 p-1 rounded-2xl">
          {LANGS.map((lang) => (
            <button
              key={lang} onClick={() => setActiveLang(lang)}
              className={`px-6 py-3 rounded-xl text-sm font-black uppercase transition-all ${
                activeLang === lang ? "bg-white text-blue-600 shadow-xl" : "text-gray-900 hover:bg-white/50"
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-3">
          {(["logo", "hero", "about", "whyUs", "footer"] as Section[]).map((s) => (
            <button
              key={s} onClick={() => setActiveSection(s)}
              className={`w-full text-left px-6 py-5 rounded-2xl font-black transition-all border ${
                activeSection === s 
                  ? "bg-zinc-900 text-white border-zinc-900 shadow-2xl" 
                  : "bg-white text-gray-900 border-gray-200 hover:bg-zinc-50"
              }`}
            >
              {s.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="lg:col-span-3">
          <div className="bg-white p-10 rounded-[40px] border border-gray-200 shadow-2xl space-y-10">
            
            {activeSection === "logo" && (
              <div className="space-y-8">
                <h2 className="text-2xl font-black text-black">Website Logosu</h2>
                <div className="p-10 border-4 border-dashed border-zinc-100 rounded-[32px] bg-zinc-50 flex flex-col items-center">
                  {formData.logo?.url ? (
                    <div className="flex flex-col items-center gap-8">
                      <div className="bg-white p-6 rounded-3xl shadow-sm border border-zinc-200">
                        <img src={formData.logo.url} className="max-h-32 rounded-xl" style={{
                           width: formData.logo.width ? formData.logo.width + "px" : "auto",
                           height: formData.logo.height ? formData.logo.height + "px" : "auto",
                           objectFit: (formData.logo.objectFit as any) || "contain"
                        }} />
                      </div>
                      <button onClick={() => handleRemoveImage("logo")} className="text-xs bg-red-600 text-white px-8 py-3 rounded-xl font-black hover:bg-red-700 transition-all uppercase tracking-widest">
                        Görseli Kalıcı Olarak Kaldır
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="w-24 h-24 bg-white rounded-[24px] flex items-center justify-center shadow-xl mb-6 mx-auto text-4xl">
                        🖼️
                      </div>
                      <p className="text-gray-900 font-black text-xl mb-4">Yeni Logo Seç</p>
                      <input type="file" ref={logoInputRef} accept="image/*" onChange={(e) => handleImageUpload(e, "logo")} className="text-sm font-bold text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-zinc-900 file:text-white hover:file:bg-black cursor-pointer" />
                    </div>
                  )}
                </div>
                {formData.logo?.url && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-zinc-50 p-8 rounded-3xl border border-zinc-100">
                    <div>
                      <label className={labelClass}>Genişlik (px)</label>
                      <input type="number" className={inputClass} value={formData.logo?.width || ""} onChange={(e) => setFormData(prev => ({ ...prev, logo: { ...prev.logo, width: parseInt(e.target.value) || undefined } as any }))} />
                    </div>
                    <div>
                      <label className={labelClass}>Yükseklik (px)</label>
                      <input type="number" className={inputClass} value={formData.logo?.height || ""} onChange={(e) => setFormData(prev => ({ ...prev, logo: { ...prev.logo, height: parseInt(e.target.value) || undefined } as any }))} />
                    </div>
                    <div>
                      <label className={labelClass}>Görünüm</label>
                      <select className={inputClass} value={formData.logo?.objectFit || "contain"} onChange={(e) => setFormData(prev => ({ ...prev, logo: { ...prev.logo, objectFit: e.target.value } as any }))}>
                        <option value="contain">Contain (Sığdır)</option>
                        <option value="cover">Cover (Doldur)</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeSection === "hero" && (
              <div className="space-y-8">
                <div>
                  <label className={labelClass}>Giriş Başlığı ({activeLang})</label>
                  <input type="text" className={inputClass} value={formData.hero?.title?.[activeLang] || ""} onChange={(e) => setFormData(prev => ({ ...prev, hero: { ...prev.hero, title: { ...(prev.hero?.title || {}), [activeLang]: e.target.value } } as any }))} />
                </div>
                <div>
                  <label className={labelClass}>Alt Metin ({activeLang})</label>
                  <textarea rows={3} className={inputClass} value={formData.hero?.subtitle?.[activeLang] || ""} onChange={(e) => setFormData(prev => ({ ...prev, hero: { ...prev.hero, subtitle: { ...(prev.hero?.subtitle || {}), [activeLang]: e.target.value } } as any }))} />
                </div>
                <div>
                  <label className={labelClass}>Buton Metni ({activeLang})</label>
                  <input type="text" className={inputClass} value={formData.hero?.buttonText?.[activeLang] || ""} onChange={(e) => setFormData(prev => ({ ...prev, hero: { ...prev.hero, buttonText: { ...(prev.hero?.buttonText || {}), [activeLang]: e.target.value } } as any }))} />
                </div>
                <div className="pt-8 border-t border-zinc-100">
                   <label className={labelClass}>Arka Plan / Hero Görseli</label>
                   <div className="p-10 bg-zinc-50 rounded-[32px] flex flex-col items-center border-2 border-dashed border-zinc-200">
                      {(formData.hero?.image as any)?.url ? (
                        <div className="flex flex-col items-center gap-8 w-full">
                           <img src={(formData.hero?.image as any).url} className="max-h-64 rounded-2xl shadow-xl shadow-black/10" style={{
                              width: (formData.hero?.image as any).width ? (formData.hero?.image as any).width + "px" : "100%",
                              height: (formData.hero?.image as any).height ? (formData.hero?.image as any).height + "px" : "auto",
                              objectFit: (formData.hero?.image as any).objectFit || "cover"
                           }} />
                           <button onClick={() => handleRemoveImage("hero")} className="bg-red-600 text-white px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-black transition-all">Görseli Kaldır</button>
                        </div>
                      ) : (
                        <div className="text-center">
                           <span className="text-5xl mb-6 block">📸</span>
                           <input type="file" ref={heroInputRef} accept="image/*" onChange={(e) => handleImageUpload(e, "hero")} className="text-sm font-black text-gray-900 cursor-pointer" />
                        </div>
                      )}
                   </div>
                </div>
              </div>
            )}

            {activeSection === "about" && (
              <div className="space-y-8">
                 <input type="text" className={inputClass} placeholder="Hakkımızda Başlığı" value={formData.about?.title?.[activeLang] || ""} onChange={(e) => setFormData(prev => ({ ...prev, about: { ...prev.about, title: { ...(prev.about?.title || {}), [activeLang]: e.target.value } } as any }))} />
                 <textarea rows={8} className={inputClass} placeholder="Uzun Açıklama Metni" value={formData.about?.description?.[activeLang] || ""} onChange={(e) => setFormData(prev => ({ ...prev, about: { ...prev.about, description: { ...(prev.about?.description || {}), [activeLang]: e.target.value } } as any }))} />
                 <div className="pt-8 border-t border-zinc-100">
                    <label className={labelClass}>Hakkımızda Görseli</label>
                    <div className="p-10 bg-zinc-50 rounded-[32px] flex flex-col items-center border-2 border-dashed border-zinc-200">
                      {(formData.about?.image as any)?.url ? (
                        <div className="flex flex-col items-center gap-8 w-full">
                           <img src={(formData.about?.image as any).url} className="max-h-64 rounded-2xl shadow-xl" />
                           <button onClick={() => handleRemoveImage("about")} className="bg-red-600 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-black transition-all">Görseli Kaldır</button>
                        </div>
                      ) : (
                        <div className="text-center">
                           <span className="text-5xl mb-6 block">📸</span>
                           <input type="file" ref={aboutInputRef} accept="image/*" onChange={(e) => handleImageUpload(e, "about")} className="text-sm font-black text-gray-900 cursor-pointer" />
                        </div>
                      )}
                    </div>
                 </div>
              </div>
            )}

            {activeSection === "whyUs" && (
              <div className="space-y-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-black text-gray-900 uppercase">Avantaj Kartları</h3>
                  <button onClick={() => setFormData(prev => ({ ...prev, whyUs: [...(Array.isArray(prev.whyUs) ? prev.whyUs : []), { title: { tr: "" }, description: { tr: "" }, icon: "✓" }] as any }))} className="bg-zinc-900 text-white px-8 py-3 rounded-xl font-black">+ Yeni Ekle</button>
                </div>
                {(Array.isArray(formData.whyUs) ? formData.whyUs : []).map((item: any, idx) => (
                  <div key={idx} className="p-8 bg-zinc-50 border border-zinc-200 rounded-[32px] relative space-y-4">
                    <button onClick={() => {
                      const items = [...(formData.whyUs as any[])];
                      items.splice(idx, 1);
                      setFormData(prev => ({ ...prev, whyUs: items }));
                    }} className="absolute top-6 right-6 bg-red-100 text-red-600 p-3 rounded-xl font-black hover:bg-red-600 hover:text-white transition-all">SİL</button>
                    <input type="text" className={inputClass} placeholder="Kart Başlığı" value={item.title?.[activeLang] || ""} onChange={(e) => {
                      const items = [...(formData.whyUs as any[])];
                      items[idx] = { ...item, title: { ...item.title, [activeLang]: e.target.value } };
                      setFormData(prev => ({ ...prev, whyUs: items }));
                    }} />
                    <textarea rows={2} className={inputClass} placeholder="Kart Açıklaması" value={item.description?.[activeLang] || ""} onChange={(e) => {
                      const items = [...(formData.whyUs as any[])];
                      items[idx] = { ...item, description: { ...item.description, [activeLang]: e.target.value } };
                      setFormData(prev => ({ ...prev, whyUs: items }));
                    }} />
                  </div>
                ))}
              </div>
            )}

            {activeSection === "footer" && (
              <div className="space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div><label className={labelClass}>Telefon</label><input type="text" className={inputClass} value={formData.footer?.phone || ""} onChange={(e) => setFormData(prev => ({ ...prev, footer: { ...prev.footer, phone: e.target.value } as any }))} /></div>
                    <div><label className={labelClass}>E-posta</label><input type="email" className={inputClass} value={formData.footer?.email || ""} onChange={(e) => setFormData(prev => ({ ...prev, footer: { ...prev.footer, email: e.target.value } as any }))} /></div>
                 </div>
                 <div><label className={labelClass}>Adres</label><textarea rows={2} className={inputClass} value={formData.footer?.address || ""} onChange={(e) => setFormData(prev => ({ ...prev, footer: { ...prev.footer, address: e.target.value } as any }))} /></div>
                 <div><label className={labelClass}>Kısa Açıklama ({activeLang})</label><textarea rows={3} className={inputClass} value={formData.footer?.description?.[activeLang] || ""} onChange={(e) => setFormData(prev => ({ ...prev, footer: { ...prev.footer, description: { ...(prev.footer?.description || {}), [activeLang]: e.target.value } } as any }))} /></div>
              </div>
            )}

            <div className="pt-12 border-t border-zinc-100 flex justify-end">
              <button
                disabled={isSubmitting}
                onClick={handleUpdate}
                className="bg-zinc-900 text-white px-16 py-5 rounded-[24px] font-black text-xl hover:bg-blue-600 transition-all shadow-2xl disabled:opacity-50 active:scale-95"
              >
                {isSubmitting ? "KAYDEDİLİYOR..." : "DEĞİŞİKLİKLERİ UYGULA"}
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
