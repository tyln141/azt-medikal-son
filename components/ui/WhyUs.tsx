"use client";

import { useRef } from "react";
import { SiteContent } from "@/types";

export default function WhyUs({ lang, content }: { lang: string, content?: SiteContent["whyUs"] }) {
  const tLocal = (v: any, lang: string) => {
    if (typeof v === "string") return v;
    return v?.[lang] || v?.tr || "";
  };

  const items = Array.isArray(content) ? content : [];
  const scrollRef = useRef<HTMLDivElement>(null);

  const T_SUBTITLE = { tr: "AVANTAJLARIMIZ", en: "OUR ADVANTAGES", de: "UNSERE VORTEILE", fr: "NOS AVANTAGES" };
  const T_TITLE = { tr: "Neden Bizi Tercih Etmelisiniz?", en: "Why Choose Us?", de: "Warum uns wählen?", fr: "Pourquoi nous choisir?" };

  const scrollLeft = () => scrollRef.current?.scrollBy({ left: -300, behavior: "smooth" });
  const scrollRight = () => scrollRef.current?.scrollBy({ left: 300, behavior: "smooth" });

  if (items.length === 0) return null;

  return (
    <section className="py-20 bg-zinc-50">
      <div className="max-w-6xl mx-auto px-6">
        
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-sm font-black text-blue-600 uppercase tracking-widest mb-3">{tLocal(T_SUBTITLE, lang)}</h2>
            <h3 className="text-4xl font-black text-gray-900 tracking-tight">{tLocal(T_TITLE, lang)}</h3>
          </div>
          
          {items.length > 4 && (
            <div className="flex gap-3">
              <button 
                onClick={scrollLeft} 
                className="w-12 h-12 rounded-2xl bg-white border border-gray-200 text-gray-900 flex justify-center items-center hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-sm active:scale-90"
              >
                 <span className="text-xl">←</span>
              </button>
              <button 
                onClick={scrollRight} 
                className="w-12 h-12 rounded-2xl bg-white border border-gray-200 text-gray-900 flex justify-center items-center hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-sm active:scale-90"
              >
                 <span className="text-xl">→</span>
              </button>
            </div>
          )}
        </div>
        
        {items.length <= 4 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {items.map((item: any, index: number) => (
              <div 
                key={index} 
                className="bg-white p-8 rounded-3xl shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 group"
              >
                <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-500 inline-block">
                  {item.icon || "✨"}
                </div>
                <h4 className="text-xl font-black text-gray-900 mb-3">{tLocal(item.title, lang)}</h4>
                <p className="text-gray-600 font-medium leading-relaxed">{tLocal(item.description, lang)}</p>
              </div>
            ))}
          </div>
        ) : (
          <div 
            ref={scrollRef}
            className="flex overflow-x-auto gap-6 pb-8 snap-x no-scrollbar"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {items.map((item: any, index: number) => (
              <div 
                key={index} 
                className="min-w-[320px] shrink-0 bg-white p-8 rounded-3xl shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 snap-start group"
              >
                <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-500 inline-block">
                  {item.icon || "✨"}
                </div>
                <h4 className="text-xl font-black text-gray-900 mb-3">{tLocal(item.title, lang)}</h4>
                <p className="text-gray-600 font-medium leading-relaxed">{tLocal(item.description, lang)}</p>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
