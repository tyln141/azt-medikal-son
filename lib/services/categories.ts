import { db } from "../firebase/config";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  orderBy,
  updateDoc
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
    id: "life-support",
    name: { "tr": "Yaşam Destek Üniteleri", "en": "Life Support Units", "de": "Lebenserhaltungssysteme", "fr": "Unités de Réanimation" },
    description: { "tr": "Yüksek hassasiyetli ventilatörler, anestezi cihazları ve yaşamsal fonksiyon monitörizasyon sistemleri.", "en": "High-precision ventilators, anesthesia machines, and vital function monitoring systems.", "de": "Hochpräzise Beatmungsgeräte, Anästhesiegeräte und Überwachungssysteme für Vitalfunktionen.", "fr": "Ventilateurs de haute précision, appareils d'anesthésie et systèmes de surveillance des fonctions vitales." },
    createdAt: Date.now()
  },
  {
    id: "surgical-systems",
    name: { "tr": "Cerrahi ve Ameliyathane Sistemleri", "en": "Surgical and OR Systems", "de": "Chirurgie- und OP-Systeme", "fr": "Systèmes Chirurgicaux et Bloc Opératoire" },
    description: { "tr": "Modern ameliyathaneler için cerrahi masalar, yüksek performanslı ameliyat lambaları ve cerrahi aspiratörler.", "en": "Surgical tables, high-performance surgical lights, and surgical aspirators for modern operating rooms.", "de": "OP-Tische, Hochleistungs-OP-Leuchten und chirurgische Asperatoren für moderne Operationssäle.", "fr": "Tables d'opération, éclairages chirurgicaux haute performance et aspirateurs chirurgicaux pour blocs opératoires modernes." },
    createdAt: Date.now() - 1000
  },
  {
    id: "diagnostic-lab",
    name: { "tr": "Tanı ve Laboratuvar Ekipmanları", "en": "Diagnostic and Lab Equipment", "de": "Diagnostik- und Laborausrüstung", "fr": "Équipement de Diagnostic et de Laboratoire" },
    description: { "tr": "Hızlı ve doğru tanı için biyokimya analizörleri, mikroskoplar ve ileri düzey laboratuvar test sistemleri.", "en": "Biochemistry analyzers, microscopes, and advanced laboratory testing systems for fast and accurate diagnosis.", "de": "Biochemie-Analysatoren, Mikroskope und fortschrittliche Labortestsysteme für eine schnelle und genaue Diagnose.", "fr": "Analyseurs de biochimie, microscopes et systèmes de test de laboratoire avancés pour un diagnostic rapide et précis." },
    createdAt: Date.now() - 2000
  },
  {
    id: "sterilization",
    name: { "tr": "Sterilizasyon ve Hijyen Çözümleri", "en": "Sterilization and Hygiene Solutions", "de": "Sterilisations- und Hygienelösungen", "fr": "Solutions de Stérilisation et d'Hygiène" },
    description: { "tr": "Maksimum hastane hijyeni için tam otomatik otoklavlar, yıkama-dezenfeksiyon cihazları ve sterilizasyon takip sistemleri.", "en": "Fully automatic autoclaves, washer-disinfectors, and sterilization tracking systems for maximum hospital hygiene.", "de": "Vollautomatische Autoklaven, Reinigungs- und Desinfektionsgeräte sowie Sterilisations-Tracking-Systeme für maximale Hygiene im Krankenhaus.", "fr": "Autoclaves entièrement automatiques, laveurs-désinfecteurs et systèmes de suivi de stérilisation pour une hygiène hospitalière maximale." },
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
      
      // Fallback to seed data if not found in Firestore
      const seeded = seedCategories.find(c => c.id === id);
      return seeded || null;
    } catch (error) {
       console.error(error);
       return seedCategories.find(c => c.id === id) || null;
    }
  },

  async create(data: Omit<Category, "id" | "createdAt">): Promise<Category> {
    const response = await fetch(`${getBaseUrl()}/api/categories`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || "Failed to create category");
    }
    return response.json();
  },

  async update(id: string, data: Partial<Category>): Promise<void> {
    if (!id) {
       throw new Error("Missing document ID");
    }

    const payload = {
      ...data,
      id,
      updatedAt: Date.now()
    };

    console.log("Updating Category ID:", id);

    try {
      const response = await fetch(`${getBaseUrl()}/api/categories`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || "Failed to update category");
      }
    } catch (error: any) {
      console.error("UPDATE ERROR:", error);
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${getBaseUrl()}/api/categories?id=${id}`, {
      method: "DELETE"
    });
    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || "Failed to delete category");
    }
  }
};
