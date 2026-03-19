"use client";

interface AboutProps {
  lang: string;
  content?: any;
  stats?: any[];
}

export default function About({ lang, content, stats }: AboutProps) {
  const title = content?.title?.[lang] || "";
  const description = content?.description?.[lang] || "";
  const image = content?.image as any;

  const T_ABOUT = { tr: "HAKKIMIZDA", en: "ABOUT US", de: "ÜBER UNS", fr: "À PROPOS" };
  const labelAbout = T_ABOUT[lang as keyof typeof T_ABOUT] || T_ABOUT.tr;

  return (
    <section id="about" className="py-32 bg-white relative overflow-hidden text-black uppercase">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          
          {/* Image Section */}
          <div className="relative group">
            <div className="relative z-10 rounded-[40px] overflow-hidden bg-zinc-50 border border-zinc-100 shadow-2xl transition-all duration-700 group-hover:shadow-blue-500/20">
              {image?.url ? (
                <img 
                  src={image.url} 
                  className="mx-auto" 
                  style={{
                    width: image.width ? image.width + "px" : "100%",
                    height: image.height ? image.height + "px" : "auto",
                    objectFit: image.objectFit || "cover"
                  }}
                  alt={title}
                />
              ) : (
                <div className="aspect-square flex items-center justify-center bg-zinc-100 text-zinc-400">
                  <span className="text-6xl">📸</span>
                </div>
              )}
            </div>
            {/* Decorative Elements */}
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-blue-600 rounded-[32px] -z-10 animate-pulse opacity-20" />
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-zinc-900 rounded-[24px] -z-10 opacity-10" />
          </div>

          {/* Text Section */}
          <div className="space-y-10">
            <div>
              <span className="inline-block px-4 py-1.5 bg-blue-50 text-blue-600 text-xs font-black tracking-[0.2em] rounded-full mb-6">
                {labelAbout}
              </span>
              <h2 className="text-5xl md:text-6xl font-black text-black leading-tight tracking-tighter">
                {title}
              </h2>
            </div>
            
            <p className="text-xl text-zinc-700 leading-relaxed font-medium lowercase first-letter:uppercase">
              {description}
            </p>
            
            {/* Stats Grid */}
            {stats && stats.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 pt-10 border-t border-zinc-100">
                {stats.map((stat: any, idx: number) => (
                   <div key={idx} className="group">
                     <span className="block text-4xl font-black text-blue-600 mb-2 group-hover:scale-110 transition-transform origin-left">
                       {stat.value}
                     </span>
                     <p className="text-zinc-500 font-bold text-xs tracking-widest leading-tight">
                       {stat.label?.[lang] || stat.label?.tr || ""}
                     </p>
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
