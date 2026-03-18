"use client";

import { SiteContent } from "@/types";

interface HeroProps {
  lang: string;
  content?: SiteContent["hero"];
}

import { useContact } from "@/context/ContactContext";

export default function Hero({ lang, content }: HeroProps) {
  const { openModal } = useContact();
  const tLocal = (v: any, lang: string) => {
    if (typeof v === "string") return v;
    return v?.[lang] || v?.tr || "";
  };

  const titleText = content?.title ? tLocal(content.title, lang) : "Sağlıkta Güven ve Yenilikçi Çözümler";
  const subtitleText = content?.subtitle ? tLocal(content.subtitle, lang) : "AZT Medikal olarak en yüksek standartlarda hizmet sunuyoruz.";
  
  const T_OFFER = { tr: "Teklif Al", en: "Get a Quote", de: "Angebot einholen", fr: "Obtenir un devis" };

  return (
    <section className="w-full bg-gradient-to-r from-sky-500 to-blue-600 text-white min-h-[500px] flex items-center py-20">
      <div className="max-w-7xl mx-auto px-6 w-full text-center">
        <div className="flex flex-col items-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-8 leading-tight">
            {titleText}
          </h1>
          <p className="text-xl md:text-2xl mb-12 font-medium text-sky-50 opacity-90 max-w-2xl">
            {subtitleText}
          </p>
          <button 
            onClick={openModal}
            className="bg-white text-blue-600 px-12 py-5 rounded-2xl font-black hover:bg-zinc-900 hover:text-white transition-all duration-300 shadow-2xl scale-110 active:scale-100 uppercase tracking-widest text-sm"
          >
            {tLocal(T_OFFER, lang)}
          </button>
        </div>
      </div>
    </section>
  );
}
