"use client";

import { useState } from "react";
import useSWR from "swr";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import ProductCard from "@/components/ui/ProductCard";
import QuoteModal from "@/components/ui/QuoteModal";
import CategorySidebar from "@/components/ui/CategorySidebar";
import { productsService } from "@/lib/services/products";
import { Category, Product } from "@/types";

interface CategoryViewProps {
  lang: string;
  category: Category;
  initialProducts: Product[];
}

export default function CategoryView({ lang, category, initialProducts }: CategoryViewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProductName, setSelectedProductName] = useState("");

  const { data: products } = useSWR(
    `products-${category.id}`,
    () => productsService.getByCategoryId(category.id),
    { fallbackData: initialProducts, revalidateOnFocus: false }
  );

  const handleQuoteRequest = (productName: string) => {
    setSelectedProductName(productName);
    setIsModalOpen(true);
  };

  const tLocal = (v: any, lang: string) => v?.[lang] || v?.tr || "";
  const safeProducts = Array.isArray(products) ? products : [];

  const T_EMPTY = { tr: "Bu kategoride henüz ürün bulunmamaktadır.", en: "No products found in this category yet.", de: "In dieser Kategorie wurden noch keine Produkte gefunden.", fr: "Aucun produit trouvé dans cette catégorie pour le moment." };

  return (
    <div className="min-h-screen bg-zinc-50/50 flex flex-col">
      <Header />
      
      <main className="flex-1 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-12 text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight">{tLocal(category.name, lang)}</h1>
            <p className="text-xl text-gray-600 font-medium leading-relaxed">{tLocal(category.description, lang)}</p>
          </div>

          <div className="w-full">
            {safeProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {safeProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    lang={lang}
                    onQuoteRequest={handleQuoteRequest}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-16 text-center border-2 border-dashed border-gray-200 shadow-sm max-w-2xl mx-auto">
                <p className="text-gray-600 font-bold text-lg">{tLocal(T_EMPTY, lang)}</p>
              </div>
            )}
          </div>

        </div>
      </main>

      <Footer />

      <QuoteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        productName={selectedProductName}
        lang={lang}
      />
    </div>
  );
}
