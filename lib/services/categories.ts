import { db } from "../firebase/config";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  orderBy
} from "firebase/firestore";
import { Category } from "@/types";
import { getBaseUrl } from "@/lib/utils/base-url";

const COLLECTION_NAME = "categories";

const normalizeCategory = (data: any): Category => {
  const n = (val: any) => (typeof val === "object" && val !== null && !Array.isArray(val)) 
    ? { tr: "", en: "", de: "", fr: "", ...val } 
    : { tr: (typeof val === 'string' ? val : ""), en: "", de: "", fr: "" };

  return {
    ...data,
    name: n(data.name),
    description: n(data.description),
  };
};

const seedCategories: Category[] = [
  { id: "hemodiyaliz-kateterleri", name: { tr: "Hemodiyaliz Kateterleri", en: "Hemodialysis Catheters", de: "", fr: "" }, description: { tr: "Yüksek kaliteli kateter çözümleri", en: "High quality catheter solutions", de: "", fr: "" }, createdAt: Date.now() },
  { id: "infuzyon-pompaları", name: { tr: "İnfüzyon Pompaları", en: "Infusion Pumps", de: "", fr: "" }, description: { tr: "Modern infüzyon çözümleri", en: "Modern infusion solutions", de: "", fr: "" }, createdAt: Date.now() - 1000 },
  { id: "diyaliz-sarf-malzemeleri", name: { tr: "Diyaliz Sarf Malzemeleri", en: "Dialysis Consumables", de: "", fr: "" }, description: { tr: "Diyaliz için tüm ihtiyaçlar", en: "All dialysis needs", de: "", fr: "" }, createdAt: Date.now() - 2000 },
  { id: "port-igneleri", name: { tr: "Port İğneleri", en: "Port Needles", de: "", fr: "" }, description: { tr: "Güvenilir port iğneleri", en: "Reliable port needles", de: "", fr: "" }, createdAt: Date.now() - 3000 }
];

export const categoriesService = {
  // Read operations (Client-side safe)
  async getAll(): Promise<Category[]> {
    try {
      const q = query(collection(db, COLLECTION_NAME), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const docs = querySnapshot.docs.map(doc => normalizeCategory({
        id: doc.id,
        ...doc.data()
      }));

      if (docs.length === 0) {
        return seedCategories;
      }
      return docs;
    } catch (error: any) {
      console.error("Firestore Error (categories.getAll):", error?.message || error);
      return seedCategories; // Return seed if error (e.g. no collection)
    }
  },

  async getById(id: string): Promise<Category | null> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return normalizeCategory({ id: docSnap.id, ...docSnap.data() });
      }
      // Fallback to seed
      return seedCategories.find(c => c.id === id) || null;
    } catch (error) {
      return seedCategories.find(c => c.id === id) || null;
    }
  },

  // Write operations (Must go through API)
  async create(data: Omit<Category, "id" | "createdAt">): Promise<Category> {
    const response = await fetch(`${getBaseUrl()}/api/categories`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to create category");
    return response.json();
  },

  async update(id: string, data: Partial<Category>): Promise<void> {
    const response = await fetch(`${getBaseUrl()}/api/categories`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...data }),
    });
    if (!response.ok) throw new Error("Failed to update category");
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${getBaseUrl()}/api/categories?id=${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete category");
  }
};
