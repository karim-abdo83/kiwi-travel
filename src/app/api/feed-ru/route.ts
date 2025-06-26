import { generateRSSFeed } from '@/server/utils';
import { NextResponse } from 'next/server';

export async function GET() {
  const xml = await generateRSSFeed("ru");

  return new NextResponse(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
