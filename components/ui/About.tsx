"use client";

import useSWR from "swr";
import { siteContentService } from "@/lib/services/site-content";
import { SiteContent } from "@/types";

interface AboutProps {
  lang: string;
  content?: SiteContent["about"];
}

export default function About({ lang, content }: AboutProps) {
  const tLocal = (v: any, lang: string) => v?.[lang] || v?.tr || "";
  const titleText = content?.title ? tLocal(content.title, lang) : "Geleceğin Sağlık Teknolojilerini Bugün Sunuyoruz";
  const descText = content?.description ? tLocal(content.description, lang) : "10 yılı aşkın tecrübemizle...";

  const T_ABOUT = { tr: "HAKKIMIZDA", en: "ABOUT US", de: "ÜBER UNS", fr: "À PROPOS" };

  return (
    <section id="about" className="py-24 bg-zinc-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          
          <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl bg-white border border-gray-100 flex items-center justify-center p-4 group">
              {(() => {
                const img = content?.image;
                const isConfig = typeof img === 'object' && img !== null;
                const url = isConfig ? (img as any).url : (typeof img === 'string' ? img : "");
                
                if (url) {
                  return (
                    <img 
                      src={url} 
                      className="max-h-[400px] w-full transition-transform duration-700 group-hover:scale-105" 
                      style={{
                        width: isConfig && (img as any).width ? (img as any).width + "px" : "100%",
                        height: isConfig && (img as any).height ? (img as any).height + "px" : "auto",
                        objectFit: (isConfig && (img as any).objectFit) || "contain"
                      }}
                      alt={titleText}
                    />
                  );
                }
                
                return (
                  <div className="flex items-center justify-center text-gray-800 font-black uppercase tracking-widest text-sm w-full h-80 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 mx-auto">📸</div>
                      Görsel Bulunamadı
                    </div>
                  </div>
                );
              })()}
          </div>

          <div className="space-y-8">
            <div>
              <h2 className="text-sm font-black tracking-widest text-blue-600 uppercase mb-4 opacity-80">{tLocal(T_ABOUT, lang)}</h2>
              <h3 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">
                {titleText}
              </h3>
            </div>
            
            <p className="text-xl text-gray-600 leading-relaxed font-medium">
              {descText}
            </p>
            
            {(content?.stats && content.stats.length > 0) && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-6 border-t border-gray-200">
                {content.stats.map((stat: any, idx: number) => (
                   <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                     <span className="block text-4xl font-black text-blue-600 mb-2">{stat.value}</span>
                     <p className="text-gray-800 font-bold text-sm uppercase tracking-wide opacity-80">{tLocal(stat.label, lang)}</p>
                   </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
