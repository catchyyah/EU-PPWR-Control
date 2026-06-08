import { NextRequest, NextResponse } from 'next/server';
import { ALL_ROADMAPS } from '@/lib/db/roadmapData';

export async function GET(request: NextRequest) {
  try {
    const productGroup = request.nextUrl.searchParams.get('product');

    // 특정 제품군의 로드맵 조회
    if (productGroup) {
      const roadmap =
        ALL_ROADMAPS[productGroup as keyof typeof ALL_ROADMAPS];
      if (!roadmap) {
        return NextResponse.json(
          {
            status: 'error',
            message: `제품군을 찾을 수 없습니다: ${productGroup}`,
          },
          { status: 404 }
        );
      }
      return NextResponse.json({
        status: 'success',
        productGroup,
        roadmap,
        count: roadmap.length,
      });
    }

    // 전체 로드맵 조회
    return NextResponse.json({
      status: 'success',
      message: '제품군별 로드맵',
      roadmaps: ALL_ROADMAPS,
      products: Object.keys(ALL_ROADMAPS),
      endpoints: {
        pump: '/api/roadmap?product=펌프',
        container: '/api/roadmap?product=용기',
        tube: '/api/roadmap?product=튜브',
        color: '/api/roadmap?product=색조',
      },
    });
  } catch (error) {
    console.error('로드맵 API 오류:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: '로드맵 조회 실패',
        error: error instanceof Error ? error.message : '알 수 없는 오류',
      },
      { status: 500 }
    );
  }
}
