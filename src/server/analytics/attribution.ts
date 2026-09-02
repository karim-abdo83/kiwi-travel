import { attributionRecord } from "@/lib/attribution";

export function attributionColumns(raw: unknown) {
  return attributionRecord(raw);
}
