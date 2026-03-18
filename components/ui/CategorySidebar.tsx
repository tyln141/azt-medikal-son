"use client";

import { Category } from "@/types";

interface CategorySidebarProps {
  category: Category;
  lang: string;
}

export default function CategorySidebar({ category, lang }: CategorySidebarProps) {
  const tLocal = (v: any, lang: string) => v?.[lang] || v?.tr || "";

  const T_HELP = { tr: "Yardıma mı ihtiyacınız var?", en: "Need Help?", de: "Brauchen Sie Hilfe?", fr: "Besoin d'aide?" };
  const T_DESC = { tr: "Uzman ekibimiz size en uygun çözümü sunmak için hazır.", en: "Our expert team is ready to provide the best solution.", de: "Unser Team ist bereit, die beste Lösung anzubieten.", fr: "Notre équipe est prête à fournir la meilleure solution." };
  const T_BTN = { tr: "Bizimle İletişime Geçin", en: "Contact Us", de: "Kontaktiere uns", fr: "Contactez-nous" };

  return (
    <aside className="space-y-8">
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-8 rounded-3xl shadow-xl shadow-blue-600/20 text-white relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-[40px] -translate-y-1/2 translate-x-1/3 group-hover:scale-150 transition-transform duration-700" />
        <h4 className="text-2xl font-black mb-4 relative z-10">{tLocal(T_HELP, lang)}</h4>
        <p className="text-blue-100 mb-8 font-medium leading-relaxed relative z-10">
          {tLocal(T_DESC, lang)}
        </p>
        <a 
          href={`/${lang}/#contact`}
          className="block w-full text-center bg-white text-blue-600 py-4 rounded-xl font-black text-sm uppercase tracking-wider shadow-lg hover:bg-zinc-50 hover:-translate-y-1 transition-all duration-300 relative z-10 active:scale-95"
        >
          {tLocal(T_BTN, lang)}
        </a>
      </div>
    </aside>
  );
}
