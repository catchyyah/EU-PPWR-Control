import { NextRequest, NextResponse } from 'next/server';

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

// 키워드 필터링 함수 (2개 이상 포함 검사)
function hasEnoughKeywords(text: string): boolean {
  const keywords = ['EU', '패키징', 'PPWR', '규제'];
  const matches = keywords.filter(kw =>
    text.toUpperCase().includes(kw.toUpperCase()) ||
    text.includes(kw)
  );
  return matches.length >= 2;
}

// 규제 정보 수집 (네이버 뉴스 + 한국 기관)
async function collectRegulationsAPI() {
  const regulations: any[] = [];
  const generateId = () => Math.random().toString(36).substring(2, 15) + Date.now();

  console.log('='.repeat(50));
  console.log('🚀 한국 기반 규제 정보 수집 시작');
  console.log('='.repeat(50));

  // 1. 네이버 뉴스 수집
  console.log('\n📰 1️⃣ 네이버 뉴스 수집 중...');
  const naverNews = await scrapeNaverNews();
  regulations.push(...naverNews);
  console.log(`   └─ ${naverNews.length}개 수집\n`);

  // 2. 한국 기관 수집
  console.log('🏢 2️⃣ 한국 기관 웹사이트 수집 중...');
  const koreanAgencies = await scrapeKoreanAgencies();
  regulations.push(...koreanAgencies);
  console.log(`   └─ ${koreanAgencies.length}개 수집\n`);

  console.log('='.repeat(50));
  console.log(`✅ 총 ${regulations.length}개 정보 수집 완료`);
  console.log('='.repeat(50));

  return regulations;
}

// 네이버 뉴스 수집
async function scrapeNaverNews() {
  const results: any[] = [];
  const generateId = () => Math.random().toString(36).substring(2, 15) + Date.now();

  // 네이버 뉴스 검색 URL (직접 HTML 스크래핑은 차단되므로 기본 정보만 제공)
  // 실제 구현에서는 네이버 뉴스 API 또는 RSS 피드 사용 권장
  const rssFeeds = [
    'https://news.naver.com/rss/ranking/popular.xml',
  ];

  try {
    for (const feedUrl of rssFeeds) {
      try {
        const response = await fetch(feedUrl);
        const text = await response.text();

        // 간단한 XML 파싱
        const titleMatches = text.match(/<title>(.*?)<\/title>/g) || [];
        const linkMatches = text.match(/<link>(.*?)<\/link>/g) || [];
        const descMatches = text.match(/<description>(.*?)<\/description>/g) || [];

        for (let i = 1; i < Math.min(titleMatches.length, 10); i++) {
          const title = titleMatches[i]?.replace(/<\/?title>/g, '').trim() || '';
          const link = linkMatches[i]?.replace(/<\/?link>/g, '').trim() || '';
          const desc = descMatches[i]?.replace(/<\/?description>/g, '').trim() || '';

          if (title && hasEnoughKeywords(title + ' ' + desc)) {
            results.push({
              id: `naver-${generateId()}`,
              source: 'NEWS',
              title: title,
              content: desc,
              url: link,
              keywords: extractKeywords(title + ' ' + desc),
              publishedAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            });
          }
        }
      } catch (error) {
        console.log(`   ⚠️ 네이버 뉴스 피드 오류: ${error instanceof Error ? error.message : error}`);
      }
    }
  } catch (error) {
    console.error('네이버 뉴스 수집 실패:', error);
  }

  // 아직 RSS가 안 되면 더미 데이터로 테스트
  if (results.length === 0) {
    console.log('   ℹ️  현재 네이버 뉴스 RSS 수집 기능 개선 중...');
  }

  return results;
}

// 한국 기관 웹사이트 수집
async function scrapeKoreanAgencies() {
  const results: any[] = [];
  const generateId = () => Math.random().toString(36).substring(2, 15) + Date.now();

  const agencies = [
    {
      name: '한국환경공단',
      url: 'https://www.keco.or.kr',
      selectors: ['a', 'h2', 'h3', '.headline'],
    },
    {
      name: '대한화장품협회',
      url: 'https://www.kosmetic.or.kr',
      selectors: ['a', '.news-item', 'h3'],
    },
    {
      name: '한국포장재재활용공제사업조합',
      url: 'https://www.kpro.or.kr',
      selectors: ['a', 'h3', '.title'],
    },
    {
      name: 'KCL',
      url: 'https://www.kcl.re.kr',
      selectors: ['a', 'h3', '.article-title'],
    },
  ];

  for (const agency of agencies) {
    try {
      console.log(`   🔍 ${agency.name} (${agency.url})`);

      const response = await fetch(agency.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; PPWRBot/1.0)',
        },
      });

      if (!response.ok) {
        console.log(`      └─ HTTP ${response.status}`);
        continue;
      }

      const html = await response.text();

      // 간단한 HTML 파싱: href와 텍스트 추출
      const linkPattern = /<a[^>]*href=["']([^"']*?)["'][^>]*>([^<]*)<\/a>/gi;
      let match;
      let foundCount = 0;

      while ((match = linkPattern.exec(html)) && foundCount < 5) {
        const href = match[1].trim();
        const text = match[2].replace(/<[^>]*>/g, '').trim();

        if (text.length > 3 && hasEnoughKeywords(text)) {
          const fullUrl = href.startsWith('http')
            ? href
            : href.startsWith('/')
            ? new URL(agency.url).origin + href
            : agency.url + '/' + href;

          results.push({
            id: `agency-${generateId()}`,
            source: 'KOREAN_AGENCY',
            title: text,
            content: text,
            url: fullUrl,
            keywords: extractKeywords(text),
            publishedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });

          foundCount++;
        }
      }

      console.log(`      └─ ${foundCount}개 발견`);
    } catch (error) {
      console.log(`      └─ ❌ 오류: ${error instanceof Error ? error.message : error}`);
    }
  }

  return results;
}

// 키워드 추출 함수
function extractKeywords(text: string): string[] {
  const keywords: string[] = [];
  const keywordList = ['EU', '패키징', 'PPWR', '규제'];

  for (const kw of keywordList) {
    if (text.toUpperCase().includes(kw.toUpperCase()) || text.includes(kw)) {
      keywords.push(kw);
    }
  }

  return keywords.slice(0, 3);
}
