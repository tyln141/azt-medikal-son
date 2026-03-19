import { MultiLang } from "@/types";

export function t(obj: MultiLang | any, lang: string): string {
  return obj?.[lang] || obj?.tr || "";
}

export function tArray(obj: any, lang: string): string[] {
  return obj?.[lang] || obj?.tr || [];
}

export function getBaseUrl() {
  if (typeof window !== "undefined") return "";

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return "http://localhost:3000";
}
