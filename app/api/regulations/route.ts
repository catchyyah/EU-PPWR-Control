import { NextRequest, NextResponse } from 'next/server';

// 메모리 저장소
let cachedRegulations: any[] = [];

export async function GET(request: NextRequest) {
  try {
    const action = request.nextUrl.searchParams.get('action');

    if (action === 'collect') {
      console.log('\n📥 규제 정보 수집 시작...');
      const regulations = await collectRegulationsAPI();
      cachedRegulations = regulations; // 메모리 캐시 업데이트

      return NextResponse.json({
        status: 'success',
        message: '규제 정보 수집 완료',
        count: regulations.length,
        regulations: regulations,
        timestamp: new Date().toISOString(),
      });
    }

    // 기본 조회 (캐시된 데이터 반환)
    return NextResponse.json({
      status: 'success',
      message: 'PPWR 규제 정보',
      regulations: cachedRegulations,
      count: cachedRegulations.length,
    });
  } catch (error) {
    console.error('❌ 규제 정보 API 오류:', error);
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
      console.log('\n📥 규제 정보 수집 시작...');
      const regulations = await collectRegulationsAPI();
      cachedRegulations = regulations;

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
    console.error('❌ 규제 정보 POST API 오류:', error);
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

// ============================================
// 키워드 필터링 함수
// ============================================
function hasEnoughKeywords(text: string): boolean {
  const keywords = ['EU', '패키징', 'PPWR', 'ESPR', '규제'];
  const matches = keywords.filter(kw =>
    text.toUpperCase().includes(kw.toUpperCase())
  );
  return matches.length >= 2;
}

function extractKeywords(text: string): string[] {
  const keywords: string[] = [];
  const keywordList = ['EU', '패키징', 'PPWR', 'ESPR', '규제'];

  for (const kw of keywordList) {
    if (text.toUpperCase().includes(kw.toUpperCase())) {
      keywords.push(kw);
    }
  }

  return keywords.slice(0, 3);
}

// ============================================
// 메인 수집 함수
// ============================================
async function collectRegulationsAPI() {
  const results: any[] = [];

  console.log('='.repeat(60));
  console.log('🚀 규제 정보 수집 시작');
  console.log('='.repeat(60));

  // 수집 대상 URL들 (사용자 지정)
  const sources = [
    {
      name: '한국환경공단',
      url: 'https://www.keco.or.kr/web/lay1/bbs/S1T10C108/A/18/list.do',
      baseUrl: 'https://www.keco.or.kr',
      viewPattern: 'view.do?article_seq=',
    },
    {
      name: '대한화장품협회',
      url: 'https://kcia.or.kr/home/edu/edu_01.php',
      baseUrl: 'https://kcia.or.kr',
    },
    {
      name: 'KCL',
      url: 'https://www.kcl.re.kr/site/program/board/basicboard/list.do?boardtypeid=6&menuid=001016004',
      baseUrl: 'https://www.kcl.re.kr',
      viewPattern: 'view.do?',
    },
  ];

  // 각 소스에서 크롤링
  for (const source of sources) {
    try {
      console.log(`\n📍 ${source.name}`);
      const items = await scrapeSource(source);
      results.push(...items);
      console.log(`   └─ ${items.length}개 수집`);
    } catch (error) {
      console.log(`   ❌ 오류: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log(`✅ 총 ${results.length}개 정보 수집 완료`);
  console.log('='.repeat(60) + '\n');

  return results;
}

// ============================================
// 개별 소스 크롤링 함수
// ============================================
async function scrapeSource(source: any): Promise<any[]> {
  const results: any[] = [];
  const generateId = () => Math.random().toString(36).substring(2, 15) + Date.now();

  try {
    const response = await fetch(source.url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9',
      },
    });

    if (!response.ok) {
      console.log(`   ⚠️ HTTP ${response.status}`);
      return results;
    }

    const html = await response.text();
    let count = 0;

    // ===== 패턴: <a> 태그 기반 링크 추출 =====
    const linkPattern = /<a[^>]*href=["']([^"']*?)["'][^>]*>([^<]{5,200}?)<\/a>/gi;
    let match;

    while ((match = linkPattern.exec(html)) && count < 10) {
      let href = match[1]?.trim() || '';
      // 제목에서 HTML 태그, 따옴표, 공백 제거
      const title = match[2]
        ?.replace(/<[^>]*>/g, '') // HTML 태그 제거
        .replace(/^["'\s]+|["'\s]+$/g, '') // 앞뒤 따옴표와 공백 제거
        .trim() || '';

      // 유효성 검사
      if (
        !title ||
        title.length < 8 ||
        title.length > 300 ||
        !hasEnoughKeywords(title) ||
        href.includes('javascript:') ||
        title.includes('이전') ||
        title.includes('다음') ||
        title.includes('목록')
      ) {
        continue;
      }

      // URL 생성 - view.do 패턴 우선
      let fullUrl = '';

      // 1. 이미 절대 URL인 경우
      if (href.startsWith('http')) {
        fullUrl = href;
      }
      // 2. 절대 경로 (/path/to/view.do?params)
      else if (href.startsWith('/')) {
        fullUrl = source.baseUrl + href;
      }
      // 3. 상대 경로 (./view.do?params)
      else if (href.startsWith('./')) {
        const basePath = source.url.substring(0, source.url.lastIndexOf('/') + 1);
        fullUrl = basePath + href.substring(2); // ./ 제거
      }
      // 4. 상대 경로 (view.do?params)
      else if (href.includes('view.do')) {
        const basePath = source.url.substring(0, source.url.lastIndexOf('/') + 1);
        fullUrl = basePath + href;
      }
      // 5. 쿼리 문자열만 있는 경우 (list.do?article_seq=xxx)
      else if (href.startsWith('?')) {
        const baseList = source.url.split('?')[0]; // list.do 부분만
        fullUrl = baseList + href;
      }
      // 6. 기타 상대 경로
      else if (href && !href.startsWith('#')) {
        const basePath = source.url.substring(0, source.url.lastIndexOf('/') + 1);
        fullUrl = basePath + href;
      }

      // URL 최종 검증
      if (!fullUrl || !fullUrl.includes('http') || fullUrl.includes('javascript:')) {
        continue;
      }

      results.push({
        id: `reg-${generateId()}`,
        source: source.name,
        title: title.substring(0, 150),
        content: title.substring(0, 300),
        url: fullUrl,
        keywords: extractKeywords(title),
        publishedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      count++;
    }
  } catch (error) {
    throw error;
  }

  return results;
}
