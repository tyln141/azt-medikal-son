import { MultiLang } from "@/types";

export function t(obj: MultiLang | any, lang: string): string {
  return obj?.[lang] || obj?.tr || "";
}

export function tArray(obj: any, lang: string): string[] {
  return obj?.[lang] || obj?.tr || [];
}

export function getBaseUrl() {
  if (typeof window !== "undefined") return "";
  return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
}
