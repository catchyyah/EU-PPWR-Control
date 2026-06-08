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

// 각 언론사 공식 웹사이트 뉴스 크롤링
async function scrapeNaverNews() {
  const results: any[] = [];
  const generateId = () => Math.random().toString(36).substring(2, 15) + Date.now();

  // 주요 한국 언론사 뉴스 페이지
  const newsSources = [
    {
      name: '환경일보',
      url: 'https://www.hkbs.co.kr/',
      category: '/news/articleList.html?view_type=sm',
      baseUrl: 'https://www.hkbs.co.kr',
    },
    {
      name: '포장타임즈',
      url: 'https://www.packtime.net/',
      category: '/news/list.html',
      baseUrl: 'https://www.packtime.net',
    },
    {
      name: '화학신문',
      url: 'https://www.chemnews.co.kr/',
      category: '/news/ArticleList.html',
      baseUrl: 'https://www.chemnews.co.kr',
    },
  ];

  console.log('   📰 한국 언론사 뉴스 크롤링');

  for (const source of newsSources) {
    try {
      console.log(`      🔍 ${source.name}`);

      // 뉴스 목록 페이지 접근
      const newsPageUrl = source.url + source.category;
      const response = await fetch(newsPageUrl, {
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
      let foundCount = 0;

      // 패턴 1: <a href="/path/article_id" title="제목">
      const pattern1 = /<a[^>]*href="([^"]*(?:article|news|view)[^"]*)"[^>]*(?:title="([^"]{5,150})")?[^>]*>([^<]{5,150}?)<\/a>/gi;
      let match;

      while ((match = pattern1.exec(html)) && foundCount < 5) {
        let href = match[1]?.trim() || '';
        const titleAttr = match[2]?.trim();
        const titleText = match[3]?.replace(/<[^>]*>/g, '').trim();

        const title = titleAttr || titleText || '';

        if (title.length > 10 && hasEnoughKeywords(title)) {
          // URL 정규화
          let fullUrl = '';
          if (href.startsWith('http')) {
            fullUrl = href;
          } else if (href.startsWith('/')) {
            fullUrl = source.baseUrl + href;
          } else if (href.length > 0) {
            fullUrl = source.url + href;
          }

          if (fullUrl && !fullUrl.includes('javascript')) {
            results.push({
              id: `news-${generateId()}`,
              source: 'NEWS',
              title: title.substring(0, 150),
              content: title.substring(0, 200),
              url: fullUrl,
              keywords: extractKeywords(title),
              publishedAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            });
            foundCount++;
          }
        }
      }

      // 패턴 2: <div class="title/headline"><a href="...">제목</a></div>
      const pattern2 = /<(?:div|span)[^>]*class="[^"]*(?:title|headline|article-title)[^"]*"[^>]*>[\s\n]*<a[^>]*href="([^"]*)"[^>]*>([^<]{5,150}?)<\/a>/gi;

      while ((match = pattern2.exec(html)) && foundCount < 5) {
        let href = match[1]?.trim() || '';
        const titleText = match[2]?.replace(/<[^>]*>/g, '').trim();

        if (titleText && titleText.length > 10 && hasEnoughKeywords(titleText)) {
          let fullUrl = '';
          if (href.startsWith('http')) {
            fullUrl = href;
          } else if (href.startsWith('/')) {
            fullUrl = source.baseUrl + href;
          } else if (href.length > 0) {
            fullUrl = source.url + href;
          }

          if (fullUrl && !fullUrl.includes('javascript')) {
            results.push({
              id: `news-${generateId()}`,
              source: 'NEWS',
              title: titleText.substring(0, 150),
              content: titleText.substring(0, 200),
              url: fullUrl,
              keywords: extractKeywords(titleText),
              publishedAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            });
            foundCount++;
          }
        }
      }

      console.log(`        └─ ${foundCount}개 발견`);
    } catch (error) {
      console.log(`        └─ 오류: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  console.log(`      └─ 최종 수집: ${results.length}개`);
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
