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
import { getBaseUrl } from "../utils";

const COLLECTION_NAME = "categories";

export const categoriesService = {
  // Read operations (Client-side safe)
  async getAll(): Promise<Category[]> {
    try {
      const q = query(collection(db, COLLECTION_NAME), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Category));
    } catch (error: any) {
      console.error("Firestore Error (categories.getAll):", error?.message || error);
      return [];
    }
  },

  async getById(id: string): Promise<Category | null> {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Category;
    }
    return null;
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
