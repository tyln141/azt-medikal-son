import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { Settings } from "@/types";
import { getBaseUrl } from "../utils";

const SETTINGS_DOC_ID = "main";

export const settingsService = {
  async get(): Promise<Settings | null> {
    const docRef = doc(db, "settings", SETTINGS_DOC_ID);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as Settings;
    }
    return null;
  },

  async update(data: Partial<Settings>): Promise<void> {
    const response = await fetch(`${getBaseUrl()}/api/settings`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Settings update failed");
  },
};
