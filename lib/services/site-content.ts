import { db } from "../firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { SiteContent } from "@/types";

const COLLECTION_NAME = "site-content";
const DOCUMENT_ID = "main";

export const siteContentService = {
  async getContent(): Promise<SiteContent | null> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/site-content`, {
      cache: "no-store"
    });
    if (!response.ok) return null;
    return response.json();
  },

  async update(data: any): Promise<void> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/site-content`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update site content");
  }
};
