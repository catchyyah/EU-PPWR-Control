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

// 네이버 뉴스 검색 크롤링
async function scrapeNaverNews() {
  const results: any[] = [];
  const generateId = () => Math.random().toString(36).substring(2, 15) + Date.now();

  const searchKeywords = ['EU', '패키징', 'PPWR', 'ESPR', '규제'];
  const newsUrls = new Set<string>();

  console.log('   📰 네이버 뉴스 검색 크롤링 시작');

  try {
    for (const keyword of searchKeywords) {
      try {
        const searchUrl = `https://news.naver.com/search/news.naver?query=${encodeURIComponent(keyword)}&sort=date&page=1`;
        console.log(`      검색: "${keyword}"`);

        const response = await fetch(searchUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'text/html,application/xhtml+xml',
          },
        });

        if (!response.ok) {
          console.log(`        └─ HTTP ${response.status}`);
          continue;
        }

        const html = await response.text();
        console.log(`        └─ HTML 크기: ${html.length}bytes`);

        // 다양한 HTML 패턴 시도
        let foundInThisKeyword = 0;

        // 패턴 1: <a href="/article/..." class="news_tit">제목</a>
        const pattern1 = /<a[^>]*href="(\/article\/[^"]*)"[^>]*class="[^"]*(?:news_tit|_sp_each_title)[^"]*"[^>]*>([^<]{5,150}?)<\/a>/gi;
        let match;
        while ((match = pattern1.exec(html))) {
          const url = 'https://news.naver.com' + match[1].trim();
          const title = match[2].replace(/<[^>]*>/g, '').trim();

          if (title.length > 10 && hasEnoughKeywords(title)) {
            newsUrls.add(url);
            foundInThisKeyword++;
          }
        }

        // 패턴 2: <a href="https://..." class="...">제목</a> (외부 매체)
        const pattern2 = /<a[^>]*href="(https?:\/\/[^"]*)"[^>]*(?:class="[^"]*(?:news|link|title)[^"]*")?[^>]*>([^<]{5,150}?)<\/a>/gi;
        while ((match = pattern2.exec(html))) {
          const url = match[1].trim();
          const title = match[2].replace(/<[^>]*>/g, '').trim();

          if (
            title.length > 10 &&
            hasEnoughKeywords(title) &&
            (url.includes('news') || url.includes('article') || url.includes('post'))
          ) {
            newsUrls.add(url);
            foundInThisKeyword++;
          }
        }

        console.log(`        └─ ${foundInThisKeyword}개 발견`);
      } catch (error) {
        console.log(`        └─ 오류: ${error instanceof Error ? error.message : String(error)}`);
      }
    }

    console.log(`      총 중복제거 후: ${newsUrls.size}개`);

    // 수집된 URL들을 결과로 변환 (상세 페이지 로드 제외 - 속도 향상)
    for (const url of Array.from(newsUrls).slice(0, 10)) {
      // 최대 10개만 처리
      try {
        // 제목을 URL에서 추출하거나 기본값 사용
        const title = url.includes('article')
          ? '네이버 뉴스 기사'
          : url.split('/').pop()?.substring(0, 100) || '뉴스';

        results.push({
          id: `news-${generateId()}`,
          source: 'NEWS',
          title: title,
          content: title,
          url: url,
          keywords: extractKeywords(title),
          publishedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      } catch (error) {
        console.log(`      └─ 처리 오류: ${error instanceof Error ? error.message : String(error)}`);
      }
    }

    console.log(`      └─ 최종 수집: ${results.length}개`);
  } catch (error) {
    console.error('네이버 뉴스 수집 실패:', error);
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
      url: 'https://www.keco.or.kr/news/newsroom/press.do',
      baseUrl: 'https://www.keco.or.kr',
    },
    {
      name: '대한화장품협회',
      url: 'https://www.kosmetic.or.kr/news/news.php',
      baseUrl: 'https://www.kosmetic.or.kr',
    },
    {
      name: 'KCL',
      url: 'https://www.kcl.re.kr/html/ko/business/cs_news01.html',
      baseUrl: 'https://www.kcl.re.kr',
    },
  ];

  for (const agency of agencies) {
    try {
      console.log(`   🔍 ${agency.name}`);

      const response = await fetch(agency.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
      });

      if (!response.ok) {
        console.log(`      └─ HTTP ${response.status}, 건너뜀`);
        continue;
      }

      const html = await response.text();
      let foundCount = 0;

      // 타이틀 패턴 추출 (다양한 HTML 구조 대응)
      const patterns = [
        /<a[^>]*href=["']([^"']*?)["'][^>]*>([^<]{5,200}?)<\/a>/gi,
        /<h[2-4][^>]*>([^<]{5,200}?)<\/h[2-4]>/gi,
        /<td[^>]*>([^<]{5,200}?)<\/td>/gi,
      ];

      for (const pattern of patterns) {
        let match;
        while ((match = pattern.exec(html)) && foundCount < 5) {
          const href = match[1]?.trim() || '';
          const text = (match[2] || match[1]).replace(/<[^>]*>/g, '').trim();

          // 필터링: 최소 길이, 키워드 확인
          if (text.length > 5 && text.length < 300) {
            if (hasEnoughKeywords(text)) {
              let fullUrl = '';

              if (href && href.startsWith('http')) {
                fullUrl = href;
              } else if (href && href.startsWith('/')) {
                fullUrl = agency.baseUrl + href;
              } else if (href) {
                fullUrl = agency.baseUrl + '/' + href;
              } else {
                fullUrl = agency.url;
              }

              results.push({
                id: `agency-${generateId()}`,
                source: 'KOREAN_AGENCY',
                title: text.substring(0, 100),
                content: text.substring(0, 200),
                url: fullUrl,
                keywords: extractKeywords(text),
                publishedAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              });

              foundCount++;
            }
          }
        }

        if (foundCount > 0) break; // 첫 번째 패턴에서 발견하면 다음 패턴 스킵
      }

      if (foundCount === 0) {
        console.log(`      └─ 조건 일치 항목 없음`);
      } else {
        console.log(`      └─ ${foundCount}개 발견`);
      }
    } catch (error) {
      console.log(`      └─ 오류: ${error instanceof Error ? error.message : String(error)}`);
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
