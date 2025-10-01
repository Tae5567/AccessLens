// src/app/api/storyblok/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const slug = searchParams.get('slug') || 'home';

  const token = process.env.NEXT_PUBLIC_STORYBLOK_PREVIEW_TOKEN;

  if (!token) {
    return NextResponse.json(
      { error: 'Storyblok token not configured' },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(
      `https://api.storyblok.com/v2/cdn/stories/${slug}?version=draft&token=${token}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Storyblok API error:', response.status, errorText);
      throw new Error(`Failed to fetch story: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error fetching from Storyblok:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch story' },
      { status: 500 }
    );
  }
}