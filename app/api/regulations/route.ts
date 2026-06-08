import { NextRequest, NextResponse } from 'next/server';
import { runCollectionNow } from '@/lib/scheduler';

export async function GET(request: NextRequest) {
  try {
    const action = request.nextUrl.searchParams.get('action');

    if (action === 'collect') {
      // 수동으로 규제 정보 수집 실행
      console.log('📥 규제 정보 수집 API 호출');
      const regulations = await runCollectionNow();

      return NextResponse.json({
        status: 'success',
        message: '규제 정보 수집 완료',
        count: regulations.length,
        regulations: regulations.slice(0, 10), // 최근 10개만 반환
      });
    }

    // 기본 조회 (향후 DB에서 조회하도록 수정)
    return NextResponse.json({
      status: 'success',
      message: 'PPWR 규제 정보 API',
      regulations: [],
      note: 'GET ?action=collect 로 수동 수집 실행',
    });
  } catch (error) {
    console.error('규제 정보 API 오류:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: '규제 정보 조회 실패',
        error: error instanceof Error ? error.message : '알 수 없는 오류',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (body.action === 'collect') {
      console.log('📥 규제 정보 수집 시작...');
      const regulations = await runCollectionNow();

      return NextResponse.json({
        status: 'success',
        message: '규제 정보 수집 완료',
        count: regulations.length,
        timestamp: new Date().toISOString(),
      });
    }

    return NextResponse.json(
      { status: 'error', message: '유효하지 않은 요청' },
      { status: 400 }
    );
  } catch (error) {
    console.error('규제 정보 POST API 오류:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: '규제 정보 처리 실패',
        error: error instanceof Error ? error.message : '알 수 없는 오류',
      },
      { status: 500 }
    );
  }
}
