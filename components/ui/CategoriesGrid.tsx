"use client";

import Link from "next/link";
import { Category } from "@/types";

export default function CategoriesGrid({ lang, categories }: { lang: string, categories: Category[] }) {
  const safeCategories = Array.isArray(categories) ? categories : [];

  const T_SUBTITLE = { tr: "ÜRETİM / TEDARİK", en: "PRODUCTION / SUPPLY", de: "PRODUKTION / VERSORGUNG", fr: "PRODUCTION / FOURNITURE" };
  const T_TITLE = { tr: "Ürün Kategorilerimiz", en: "Our Product Categories", de: "Unsere Produktkategorien", fr: "Nos catégories de produits" };
  const T_INSPECT = { tr: "İncele", en: "Inspect", de: "Prüfen", fr: "Inspecter" };

  const labelSubtitle = T_SUBTITLE[lang as keyof typeof T_SUBTITLE] || T_SUBTITLE.tr;
  const labelTitle = T_TITLE[lang as keyof typeof T_TITLE] || T_TITLE.tr;
  const labelInspect = T_INSPECT[lang as keyof typeof T_INSPECT] || T_INSPECT.tr;

  if (safeCategories.length === 0) return null;

  return (
    <section id="categories" className="py-32 bg-white relative uppercase">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-xs font-black tracking-[0.2em] text-blue-600 mb-6">{labelSubtitle}</h2>
        <h3 className="text-5xl md:text-6xl font-black text-black mb-20 tracking-tighter">{labelTitle}</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {safeCategories.map((category: any) => {
            const imgData = typeof category.image === 'object' ? category.image : { url: category.image };
            const name = category.name?.[lang] || category.name?.tr || "";
            const desc = category.description?.[lang] || category.description?.tr || "";
            
            return (
              <Link 
                key={category.id} 
                href={`/${lang}/category/${category.id}`}
                className="group bg-zinc-50 p-8 rounded-[40px] border border-zinc-100 hover:border-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-700 transform hover:-translate-y-4 text-left flex flex-col h-full"
              >
                <div className="w-full aspect-square bg-white rounded-[32px] mb-10 overflow-hidden relative flex items-center justify-center border border-zinc-100 group-hover:border-blue-100 transition-all">
                  <img 
                    src={imgData?.url || "/placeholder.png"} 
                    alt={name} 
                    className="transition-transform duration-1000 group-hover:scale-110"
                    style={{
                      width: imgData?.width ? imgData.width + "px" : "100%",
                      height: imgData?.height ? imgData.height + "px" : "100%",
                      objectFit: imgData?.objectFit || "cover"
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                </div>
                
                <div className="flex-1">
                  <h4 className="text-2xl font-black text-black mb-4 group-hover:text-blue-600 transition-colors leading-none">
                    {name}
                  </h4>
                  <p className="text-zinc-600 font-bold text-sm leading-relaxed lowercase first-letter:uppercase line-clamp-3">
                    {desc}
                  </p>
                </div>

                <div className="mt-10 flex items-center text-blue-600 font-black text-[10px] tracking-widest uppercase group-hover:translate-x-3 transition-transform duration-500">
                  {labelInspect} 
                  <span className="ml-3 text-lg">→</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
