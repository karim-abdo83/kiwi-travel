import { generateGoogleFeed } from "@/server/utils"; // новую функцию
import { NextResponse } from "next/server";

export async function GET() {
  const xml = await generateGoogleFeed("ru");

  return new NextResponse(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
