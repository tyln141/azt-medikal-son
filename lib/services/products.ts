import { db } from "../firebase/config";
import { 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  query, 
  where, 
  orderBy 
} from "firebase/firestore";
import { Product } from "@/types";
import { getBaseUrl } from "@/lib/utils/base-url";

const COLLECTION_NAME = "products";

export const productsService = {
  async getAll(): Promise<Product[]> {
    try {
      const q = query(collection(db, COLLECTION_NAME), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Product));
    } catch (error: any) {
      console.error("Firestore Error (products.getAll):", error?.message || error);
      return [];
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
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Product));
    } catch (error: any) {
      console.error("Firestore Error (products.getByCategoryId):", error?.message || error);
      return [];
    }
  },

  async getById(id: string): Promise<Product | null> {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Product;
    }
    return null;
  },

  async create(data: Omit<Product, "id" | "createdAt">): Promise<Product> {
    const response = await fetch(`${getBaseUrl()}/api/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to create product");
    return response.json();
  },

  async update(id: string, data: Partial<Product>): Promise<void> {
    const response = await fetch(`${getBaseUrl()}/api/products`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...data }),
    });
    if (!response.ok) throw new Error("Failed to update product");
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${getBaseUrl()}/api/products?id=${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete product");
  }
};
