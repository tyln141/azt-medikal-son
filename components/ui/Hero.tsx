"use client";

import { useContact } from "@/context/ContactContext";

interface HeroProps {
  lang: string;
  content?: any;
}

export default function Hero({ lang, content }: HeroProps) {
  const { openModal } = useContact();

  const title = content?.title?.[lang] || "";
  const subtitle = content?.subtitle?.[lang] || "";
  const buttonText = content?.buttonText?.[lang] || "";
  const image = content?.image as any;
  const position = content?.position || "left";

  return (
    <section className="relative w-full overflow-hidden min-h-[600px] flex items-center py-24 bg-zinc-900 border-none">
      {/* Background Image / Gradient */}
      {image?.url ? (
        <div className="absolute inset-0 z-0">
          <img 
            src={image.url} 
            className="w-full h-full" 
            style={{ 
              objectFit: image.objectFit || "cover",
              width: image.width ? image.width + "px" : "100%",
              height: image.height ? image.height + "px" : "100%"
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        </div>
      ) : (
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-sky-600 to-blue-800 opacity-90" />
      )}

      <div className={`relative z-10 max-w-7xl mx-auto px-6 w-full flex ${
        position === 'center' ? 'justify-center text-center' :
        position === 'right' ? 'justify-end text-right' :
        'justify-start text-left'
      }`}>
        <div className={`max-w-3xl ${
          position === 'center' ? 'flex flex-col items-center' :
          position === 'right' ? 'flex flex-col items-end' :
          'flex flex-col items-start'
        }`}>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-8 leading-tight animate-fade-in uppercase tracking-tight">
            {title}
          </h1>
          <p className={`text-xl md:text-2xl text-zinc-100/90 mb-12 font-medium max-w-2xl ${
            position === 'center' ? '' :
            position === 'right' ? 'border-r-4 border-blue-500 pr-6' :
            'border-l-4 border-blue-500 pl-6'
          }`}>
            {subtitle}
          </p>
          <button 
            onClick={openModal}
            className="group relative bg-blue-600 text-white px-12 py-5 rounded-2xl font-black hover:bg-white hover:text-blue-600 transition-all duration-500 shadow-2xl active:scale-95 uppercase tracking-widest text-sm overflow-hidden"
          >
            <span className="relative z-10">{buttonText}</span>
          </button>
        </div>
      </div>
    </section>
  );
}
