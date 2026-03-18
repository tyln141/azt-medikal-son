"use client";

import { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  lang: string;
  onQuoteRequest: (productName: string) => void;
}

export default function ProductCard({ product, lang, onQuoteRequest }: ProductCardProps) {
  const tLocal = (v: any, lang: string) => {
    if (typeof v === "string") return v;
    return v?.[lang] || v?.tr || "";
  };
  
  const rawImage = product.images?.[0];
  const isConfig = typeof rawImage === 'object' && rawImage !== null;
  const imageUrl = (isConfig ? (rawImage as any).url : (rawImage as string)) || "/placeholder.png";

  const T_QUOTE = { tr: "Fiyat Teklifi Al", en: "Get a Quote", de: "Angebot einholen", fr: "Obtenir un devis" };

  return (
    <div className="bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full overflow-hidden group hover:-translate-y-2 border border-gray-100">
      
      <div className="relative h-56 overflow-hidden bg-gray-50 flex items-center justify-center">
        <img 
          src={imageUrl} 
          alt={tLocal(product.name, lang)} 
          className={
            isConfig && ((rawImage as any).width || (rawImage as any).height)
              ? "transition-transform duration-700 group-hover:scale-110"
              : "w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          }
          style={isConfig ? {
            width: (rawImage as any).width ? (rawImage as any).width + "px" : undefined,
            height: (rawImage as any).height ? (rawImage as any).height + "px" : undefined,
            objectFit: (rawImage as any).objectFit || undefined
          } : {}}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      <div className="p-7 flex flex-col flex-1">
        <h4 className="text-xl font-black text-gray-900 mb-3 line-clamp-1">
          {tLocal(product.name, lang)}
        </h4>
        
        <p className="text-gray-600 font-medium mb-6 line-clamp-2 flex-1 leading-relaxed">
           {tLocal(product.description, lang)}
        </p>
        
        <button 
          onClick={() => onQuoteRequest(tLocal(product.name, lang))}
          className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black hover:bg-zinc-900 transition-all duration-300 shadow-lg shadow-blue-500/10 active:scale-95 text-sm uppercase tracking-wider"
        >
          {tLocal(T_QUOTE, lang)}
        </button>
      </div>
    </div>
  );
}
