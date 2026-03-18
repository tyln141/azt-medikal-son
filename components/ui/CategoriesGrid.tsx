"use client";

import Link from "next/link";
import { Category } from "@/types";

export default function CategoriesGrid({ lang, categories }: { lang: string, categories: Category[] }) {
  const t = (v: any, lang: string) => v?.[lang] || v?.tr || "";
  const safeCategories = Array.isArray(categories) ? categories : [];

  const T_SUBTITLE = { tr: "ÜRETİM / TEDARİK", en: "PRODUCTION / SUPPLY", de: "PRODUKTION / VERSORGUNG", fr: "PRODUCTION / FOURNITURE" };
  const T_TITLE = { tr: "Ürün Kategorilerimiz", en: "Our Product Categories", de: "Unsere Produktkategorien", fr: "Nos catégories de produits" };
  const T_INSPECT = { tr: "İncele", en: "Inspect", de: "Prüfen", fr: "Inspecter" };

  return (
    <section id="categories" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-sm font-black tracking-widest text-blue-600 uppercase mb-4 opacity-80">{t(T_SUBTITLE, lang)}</h2>
        <h3 className="text-4xl md:text-5xl font-black text-gray-900 mb-16">{t(T_TITLE, lang)}</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {safeCategories.map((category: any) => {
            const imgData = typeof category.image === 'object' ? category.image : { url: category.image };
            return (
              <Link 
                key={category.id} 
                href={`/${lang}/category/${category.id}`}
                className="group bg-white p-6 rounded-3xl shadow-md border border-gray-100 hover:border-blue-200 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 text-left flex flex-col"
              >
                <div className="w-full aspect-square bg-gray-50 rounded-2xl mb-8 overflow-hidden relative flex items-center justify-center border border-gray-100">
                  <img 
                    src={imgData?.url || "/placeholder.png"} 
                    alt={t(category.name, lang)} 
                    className={
                        imgData?.width || imgData?.height 
                        ? "transition-transform duration-500 group-hover:scale-110" 
                        : "absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    }
                    style={{
                      width: imgData?.width ? `${imgData.width}px` : undefined,
                      height: imgData?.height ? `${imgData.height}px` : undefined,
                      objectFit: imgData?.objectFit || undefined
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <h4 className="text-2xl font-black text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {t(category.name, lang)}
                </h4>
                <p className="text-gray-600 font-medium line-clamp-2 mb-6 flex-1">
                  {t(category.description, lang)}
                </p>
                <div className="mt-auto flex items-center text-blue-600 font-black text-sm uppercase tracking-wider group-hover:translate-x-2 transition-transform duration-300">
                  {t(T_INSPECT, lang)} <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
