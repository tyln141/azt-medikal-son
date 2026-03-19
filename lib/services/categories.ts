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
  { 
    id: "hemodiyaliz-kateterleri", 
    name: { tr: "Hemodiyaliz Kateterleri", en: "Hemodialysis Catheters", de: "Hämodialysekatheter", fr: "Cathéters d'hémodialyse" }, 
    description: { 
      tr: "Yüksek kaliteli ve güvenilir hemodiyaliz çözümleri", 
      en: "High-quality and reliable hemodialysis solutions", 
      de: "Hochwertige und zuverlässige Hämodialyselösungen", 
      fr: "Solutions d'hémodialyse fiables et de haute qualité" 
    }, 
    createdAt: Date.now() 
  },
  { 
    id: "infuzyon-pompaları", 
    name: { tr: "İnfüzyon Pompaları", en: "Infusion Pumps", de: "Infusionspumpen", fr: "Pompes à perfusion" }, 
    description: { 
      tr: "Modern ve hassas infüzyon teknolojileri", 
      en: "Modern and precise infusion technologies", 
      de: "Moderne und präzise Infusionstechnologien", 
      fr: "Technologies d'infusion modernes et précises" 
    }, 
    createdAt: Date.now() - 1000 
  },
  { 
    id: "diyaliz-sarf-malzemeleri", 
    name: { tr: "Diyaliz Sarf Malzemeleri", en: "Dialysis Consumables", de: "Dialyse-Verbrauchsmaterialien", fr: "Consommables de dialyse" }, 
    description: { 
      tr: "Diyaliz süreçleri için tüm sarf malzemeleri", 
      en: "All consumables for dialysis processes", 
      de: "Alle Verbrauchsmaterialien für Dialyseprozesse", 
      fr: "Tous les consommables pour la dialyse" 
    }, 
    createdAt: Date.now() - 2000 
  },
  { 
    id: "port-igneleri", 
    name: { tr: "Port İğneleri", en: "Port Needles", de: "Portnadeln", fr: "Aiguilles à port" }, 
    description: { 
      tr: "Güvenli ve konforlu port iğne çözümleri", 
      en: "Safe and comfortable port needle solutions", 
      de: "Sichere und komfortable Portnadeln", 
      fr: "Solutions d'aiguilles de port sûres and confortables" 
    }, 
    createdAt: Date.now() - 3000 
  }
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
