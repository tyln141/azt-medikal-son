import Header from "@/components/ui/Header";
import Hero from "@/components/ui/Hero";
import About from "@/components/ui/About";
import CategoriesGrid from "@/components/ui/CategoriesGrid";
import WhyUs from "@/components/ui/WhyUs";
import Footer from "@/components/ui/Footer";
import { categoriesService } from "@/lib/services/categories";
import { siteContentService } from "@/lib/services/site-content";

export const dynamic = "force-dynamic";

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  // Fetch data via Service Layer
  const [categories, siteContent] = await Promise.all([
    categoriesService.getAll(),
    typeof siteContentService?.getContent === "function"
      ? siteContentService.getContent()
      : Promise.resolve(null),
  ]);

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
