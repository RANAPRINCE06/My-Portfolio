import { NextResponse } from 'next/server';
import { repositoryService } from '@/lib/github/repository-service';

export const revalidate = 3600; // Cache for 1 hour

export async function GET() {
  try {
    const data = await repositoryService.getCuratedRepositories();

    return NextResponse.json(
      {
        success: true,
        data: data.repositories,
        featured: data.featured,
        fromFallback: data.fromFallback,
        timestamp: new Date().toISOString(),
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      }
    );
  } catch (error) {
    console.error('GitHub API route handler error:', error);
    // Never fail with 500: return verified local fallback
    const fallback = repositoryService.getLocalFallbackRepositories();
    return NextResponse.json(
      {
        success: true,
        data: fallback,
        featured: fallback.filter((r) => r.isFeatured),
        fromFallback: true,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  }
}

