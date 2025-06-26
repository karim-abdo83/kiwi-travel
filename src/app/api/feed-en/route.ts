import { generateGoogleFeed } from '@/server/utils';
import { NextResponse } from 'next/server';

export async function GET() {
  const xml = await generateGoogleFeed("en");

  return new NextResponse(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
