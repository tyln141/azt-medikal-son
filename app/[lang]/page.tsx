"use client";

import { useState, useEffect, use } from "react";
import Header from "@/components/ui/Header";
import Hero from "@/components/ui/Hero";
import About from "@/components/ui/About";
import CategoriesGrid from "@/components/ui/CategoriesGrid";
import WhyUs from "@/components/ui/WhyUs";
import Footer from "@/components/ui/Footer";
import { categoriesService } from "@/lib/services/categories";
import { siteContentService } from "@/lib/services/site-content";

export default function Home({
  params: paramsPromise,
}: {
  params: Promise<{ lang: string }>;
}) {
  const params = use(paramsPromise);
  const lang = params.lang as any;

  const [categories, setCategories] = useState<any[]>([]);
  const [siteContent, setSiteContent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [cats, content] = await Promise.all([
          categoriesService.getAll(),
          siteContentService.getContent()
        ]);
        setCategories(cats);
        setSiteContent(content);
      } catch (err) {
        console.error("Home Data Load Error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-2xl font-black text-blue-600 animate-pulse uppercase tracking-widest">AZT MEDİKAL...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <Hero lang={lang} content={siteContent?.hero} />
        <About lang={lang} content={siteContent?.about} stats={siteContent?.stats} />
        <CategoriesGrid lang={lang} categories={categories} />
        <WhyUs lang={lang} content={siteContent?.whyUs} />
      </main>
      <Footer />
    </div>
  );
}
