import { MultiLang } from "@/types";

export function t(obj: MultiLang | any, lang: string): string {
  return obj?.[lang] || obj?.tr || "";
}

export function tArray(obj: any, lang: string): string[] {
  return obj?.[lang] || obj?.tr || [];
}
