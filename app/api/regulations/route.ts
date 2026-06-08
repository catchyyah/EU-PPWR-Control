import { NextRequest, NextResponse } from 'next/server';

// 응답 함수 (서버리스 환경에서 작동)
export async function GET(request: NextRequest) {
  try {
    const action = request.nextUrl.searchParams.get('action');

    if (action === 'collect') {
      console.log('📥 규제 정보 수집 시작...');
      const regulations = await collectRegulationsAPI();

      return NextResponse.json({
        status: 'success',
        message: '규제 정보 수집 완료',
        count: regulations.length,
        regulations: regulations,
        timestamp: new Date().toISOString(),
      });
    }

    // 기본 조회 (로컬 스토리지 또는 초기 데이터 반환)
    return NextResponse.json({
      status: 'success',
      message: 'PPWR 규제 정보',
      regulations: [],
      count: 0,
      note: '지금 수집 버튼을 눌러 최신 데이터를 가져오세요.',
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
      const regulations = await collectRegulationsAPI();

      return NextResponse.json({
        status: 'success',
        message: '규제 정보 수집 완료',
        count: regulations.length,
        regulations: regulations,
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

// 규제 정보 수집 (NewsAPI)
async function collectRegulationsAPI() {
  const regulations: any[] = [];
  const newsApiKey = process.env.NEWS_API_KEY;

  // UUID 생성 함수
  const generateId = () => Math.random().toString(36).substring(2, 15);

  // 1. NewsAPI 수집
  if (!newsApiKey) {
    console.warn('⚠️ NEWS_API_KEY가 설정되지 않았습니다.');
    return regulations;
  }

  try {
    console.log('📰 언론사 뉴스 수집 중...');
    const keywords = [
      'EU PPWR packaging',
      'EU packaging regulation',
      'PPWR packaging waste',
    ];

    for (const keyword of keywords) {
      try {
        const url = new URL('https://newsapi.org/v2/everything');
        url.searchParams.append('q', keyword);
        url.searchParams.append('language', 'en');
        url.searchParams.append('sortBy', 'publishedAt');
        url.searchParams.append('pageSize', '5');
        url.searchParams.append('apiKey', newsApiKey);

        const response = await fetch(url.toString());
        const data = await response.json();

        if (data.articles) {
          console.log(`   검색어 "${keyword}": ${data.articles.length}개 발견`);
          for (const article of data.articles) {
            regulations.push({
              id: `news-${generateId()}-${Date.now()}`,
              source: 'NEWS',
              title: article.title,
              content: article.description || article.content || '',
              url: article.url,
              keywords: ['EU', '패키징', 'PPWR'],
              publishedAt: article.publishedAt,
              updatedAt: new Date().toISOString(),
            });
          }
        }
      } catch (error) {
        console.error(`   검색어 "${keyword}" 오류:`, error instanceof Error ? error.message : error);
      }
    }

    console.log(`✓ 총 ${regulations.length}개 뉴스 수집 완료`);
  } catch (error) {
    console.error('뉴스 API 오류:', error instanceof Error ? error.message : error);
  }

  return regulations;
}
