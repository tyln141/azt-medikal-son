import { db } from "../firebase/config";
import { 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  query, 
  orderBy 
} from "firebase/firestore";
import { Message } from "@/types";
import { getBaseUrl } from "@/lib/utils/base-url";

const COLLECTION_NAME = "messages";

export const messagesService = {
  async getAll(): Promise<Message[]> {
    const q = query(collection(db, COLLECTION_NAME), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Message));
  },

  async create(data: Omit<Message, "id" | "createdAt" | "isRead">): Promise<void> {
    const response = await fetch(`${getBaseUrl()}/api/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to send message");
  },

  async markAsRead(id: string): Promise<void> {
    const response = await fetch(`${getBaseUrl()}/api/messages`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, isRead: true }),
    });
    if (!response.ok) throw new Error("Failed to mark as read");
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${getBaseUrl()}/api/messages?id=${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete message");
  }
};
