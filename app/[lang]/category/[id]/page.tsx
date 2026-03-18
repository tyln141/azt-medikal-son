import { categoriesService } from "@/lib/services/categories";
import { productsService } from "@/lib/services/products";
import CategoryView from "@/components/ui/CategoryView";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{
    lang: string;
    id: string;
  }>;
}

export default async function CategoryPage({ params }: PageProps) {
  const { lang, id } = await params;

  const category = await categoriesService.getById(id);
  if (!category) {
    notFound();
  }

  const initialProducts = await productsService.getByCategoryId(id);

  return (
    <CategoryView 
      lang={lang} 
      category={category} 
      initialProducts={initialProducts} 
    />
  );
}
