import { db } from "../firebase/config";
import { 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  query, 
  where, 
  orderBy,
  updateDoc
} from "firebase/firestore";
import { Product } from "@/types";
import { getBaseUrl } from "@/lib/utils/base-url";

const COLLECTION_NAME = "products";

const normalizeProduct = (data: any): Product => {
  const n = (val: any) => (typeof val === "object" && val !== null && !Array.isArray(val)) 
    ? { tr: "", en: "", de: "", fr: "", ...val } 
    : { tr: (typeof val === 'string' ? val : ""), en: "", de: "", fr: "" };

  return {
    ...data,
    name: n(data.name),
    description: n(data.description),
    features: (typeof data.features === "object" && data.features !== null && !Array.isArray(data.features)) ? {
      tr: [], en: [], de: [], fr: [],
      ...data.features
    } : { tr: [], en: [], de: [], fr: [] },
  };
};

const seedProducts: Product[] = [
  {
    id: "infuzyon-pompasi-pro-3000",
    name: { tr: "Akıllı İnfüzyon Pompası - Pro 3000", en: "Smart Infusion Pump - Pro 3000", de: "", fr: "" },
    description: { tr: "Hassas dozaj kontrolü ve güvenli sıvı iletimi sağlar. Modern sağlık kuruluşları için tasarlanmıştır.", en: "Provides precise dosage control and safe fluid delivery. Designed for modern healthcare facilities.", de: "", fr: "" },
    features: {
      tr: ["Dokunmatik ekran", "Kablosuz bağlantı", "Hata önleme sistemi", "Geniş ilaç kütüphanesi"],
      en: ["Touch screen", "Wireless connection", "Error prevention system", "Extensive drug library"],
      de: [], fr: []
    },
    categoryId: "infuzyon-pompaları",
    images: [],
    createdAt: Date.now()
  },
  {
    id: "diyaliz-sarf-seti-v1",
    name: { tr: "Diyaliz Sarf Seti - Model V1", en: "Dialysis Consumable Set - Model V1", de: "", fr: "" },
    description: { tr: "Steril ve yüksek kaliteli diyaliz sarf malzemeleri seti.", en: "Sterile and high quality dialysis consumable set.", de: "", fr: "" },
    features: {
      tr: ["Steril paketleme", "Biyouyumlu malzeme", "Hızlı kurulum"],
      en: ["Sterile packaging", "Biocompatible material", "Fast setup"],
      de: [], fr: []
    },
    categoryId: "diyaliz-sarf-malzemeleri",
    images: [],
    createdAt: Date.now() - 5000
  },
  {
    id: "guvenli-port-ignesi-20g",
    name: { tr: "Güvenli Port İğnesi - 20G", en: "Safety Port Needle - 20G", de: "", fr: "" },
    description: { tr: "İğne batma yaralanmalarını önleyen güvenlik mekanizmalı port iğnesi.", en: "Port needle with safety mechanism preventing needle stick injuries.", de: "", fr: "" },
    features: {
      tr: ["Güvenlik kilidi", "Yumuşak kanatçıklar", "Yüksek akış hızı"],
      en: ["Safety lock", "Soft wings", "High flow rate"],
      de: [], fr: []
    },
    categoryId: "port-igneleri",
    images: [],
    createdAt: Date.now() - 10000
  }
];

export const productsService = {
  async getAll(): Promise<Product[]> {
    try {
      const q = query(collection(db, COLLECTION_NAME), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const docs = querySnapshot.docs.map(doc => normalizeProduct({
        id: doc.id,
        ...doc.data()
      }));
      
      if (docs.length === 0) return seedProducts;
      return docs;
    } catch (error: any) {
      console.error("Firestore Error (products.getAll):", error?.message || error);
      return seedProducts;
    }
  },

  async getByCategoryId(categoryId: string): Promise<Product[]> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME), 
        where("categoryId", "==", categoryId),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      const docs = querySnapshot.docs.map(doc => normalizeProduct({
        id: doc.id,
        ...doc.data()
      }));

      if (docs.length === 0) {
        return seedProducts.filter(p => p.categoryId === categoryId);
      }
      return docs;
    } catch (error: any) {
      console.error("Firestore Error (products.getByCategoryId):", error?.message || error);
      return seedProducts.filter(p => p.categoryId === categoryId);
    }
  },

  async getById(id: string): Promise<Product | null> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return normalizeProduct({ id: docSnap.id, ...docSnap.data() });
      }
      // Fallback to seed
      return seedProducts.find(p => p.id === id) || null;
    } catch (error) {
      return seedProducts.find(p => p.id === id) || null;
    }
  },

  async create(data: Omit<Product, "id" | "createdAt">): Promise<Product> {
    const response = await fetch(`${getBaseUrl()}/api/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || "Failed to create product");
    }
    return response.json();
  },

  async update(id: string, data: Partial<Product>): Promise<void> {
    if (!id) {
       throw new Error("Missing document ID");
    }

    const payload = {
      ...data,
      id,
      updatedAt: Date.now()
    };

    console.log("Updating Product ID:", id);

    try {
      const response = await fetch(`${getBaseUrl()}/api/products`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || "Failed to update product");
      }
    } catch (error: any) {
      console.error("UPDATE ERROR:", error);
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${getBaseUrl()}/api/products?id=${id}`, {
      method: "DELETE"
    });
    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || "Failed to delete product");
    }
  }
};
