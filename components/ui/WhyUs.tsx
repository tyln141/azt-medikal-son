"use client";

export default function WhyUs({ lang, content }: { lang: string, content?: any[] }) {
  const items = Array.isArray(content) ? content : [];

  const T_SUBTITLE = { tr: "AVANTAJLARIMIZ", en: "OUR ADVANTAGES", de: "UNSERE VORTEILE", fr: "NOS AVANTAGES" };
  const T_TITLE = { tr: "Neden Bizi Tercih Etmelisiniz?", en: "Why Choose Us?", de: "Warum uns wählen?", fr: "Pourquoi nous choisir?" };

  const labelSubtitle = T_SUBTITLE[lang as keyof typeof T_SUBTITLE] || T_SUBTITLE.tr;
  const labelTitle = T_TITLE[lang as keyof typeof T_TITLE] || T_TITLE.tr;

  if (items.length === 0) return null;

  return (
    <section className="py-24 bg-zinc-50 uppercase">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="flex justify-between items-end mb-16">
          <div className="max-w-2xl">
            <h2 className="text-xs font-black text-blue-600 tracking-[0.2em] mb-4">{labelSubtitle}</h2>
            <h3 className="text-4xl md:text-5xl font-black text-black leading-tight tracking-tight">{labelTitle}</h3>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((item: any, index: number) => (
            <div 
              key={index} 
              className="bg-white p-10 rounded-[40px] shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border border-zinc-100 group"
            >
              <div className="text-5xl mb-8 group-hover:scale-110 transition-transform duration-500 inline-block">
                {item.icon || "✨"}
              </div>
              <h4 className="text-xl font-black text-black mb-4 tracking-tight">
                {item.title?.[lang] || item.title?.tr || ""}
              </h4>
              <p className="text-zinc-600 font-bold text-sm leading-relaxed lowercase first-letter:uppercase">
                {item.description?.[lang] || item.description?.tr || ""}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
