#!/usr/bin/env node

/**
 * 규제 정보 수집 스크립트
 * 언론사 + 주요 기관 웹 크롤링
 */

const axios = require('axios');
const cheerio = require('cheerio');
const { randomUUID } = require('crypto');

// NewsAPI 키
const NEWS_API_KEY = process.env.NEWS_API_KEY;

console.log('\n' + '='.repeat(60));
console.log('🚀 PPWR/ESPR 규제 정보 수집 시작');
console.log('='.repeat(60) + '\n');

// 뉴스 API 수집
async function scrapeNewsAPI() {
  if (!NEWS_API_KEY) {
    console.warn('⚠️  NEWS_API_KEY가 설정되지 않았습니다.');
    return [];
  }

  console.log('📰 2️⃣ 언론사 뉴스 수집 중...\n');

  const regulations = [];
  const keywords = [
    'EU PPWR packaging',
    'EU packaging regulation',
    'PPWR packaging waste',
  ];

  for (const keyword of keywords) {
    try {
      console.log(`   🔍 검색어: "${keyword}"`);
      const response = await axios.get('https://newsapi.org/v2/everything', {
        params: {
          q: keyword,
          language: 'en',
          sortBy: 'publishedAt',
          pageSize: 5,
          apiKey: NEWS_API_KEY,
        },
      });

      const articles = response.data.articles || [];
      console.log(`      └─ ${articles.length}개 뉴스 발견`);

      for (const article of articles) {
        regulations.push({
          id: `news-${randomUUID()}`,
          source: 'NEWS',
          title: article.title,
          content: article.description || article.content || '',
          url: article.url,
          keywords: ['EU', '패키징', 'PPWR'].filter(k =>
            article.title.toLowerCase().includes(k.toLowerCase())
          ),
          publishedAt: new Date(article.publishedAt),
          updatedAt: new Date(),
        });
      }
    } catch (error) {
      console.error(`      ❌ 오류: ${error.message}`);
    }
  }

  return regulations;
}

// 한국 기관 웹 크롤링
async function scrapeKoreanAgencies() {
  console.log('\n🏢 3️⃣ 주요 기관 웹 크롤링 중...\n');

  const agencies = [
    {
      name: '한국환경공단',
      url: 'https://www.keco.or.kr',
      selector: 'article, .article-item, .news-item',
    },
    {
      name: '대한화장품협회',
      url: 'https://www.kosmetic.or.kr',
      selector: 'article, .news-item, .item',
    },
  ];

  const regulations = [];

  for (const agency of agencies) {
    try {
      console.log(`   📍 ${agency.name} 접속 중...`);
      const response = await axios.get(agency.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; PPWRBot/1.0)',
        },
        timeout: 10000,
      });

      const $ = cheerio.load(response.data);
      const items = $(agency.selector).slice(0, 3);

      console.log(`      └─ ${items.length}개 항목 발견`);

      items.each((idx, elem) => {
        const title = $(elem).find('h2, h3, .title, .headline').text().trim();
        const link = $(elem).find('a').attr('href') || '';

        if (title && title.length > 5) {
          regulations.push({
            id: `agency-${randomUUID()}`,
            source: 'KOREAN_AGENCY',
            title: title,
            content: title,
            url: link.startsWith('http') ? link : `${agency.url}${link}`,
            keywords: ['EU', '패키징', 'PPWR'].filter(k =>
              title.toLowerCase().includes(k.toLowerCase())
            ),
            publishedAt: new Date(),
            updatedAt: new Date(),
          });
        }
      });
    } catch (error) {
      console.log(`      ❌ 접속 실패: ${error.message}`);
    }
  }

  return regulations;
}

// 메인 실행
async function main() {
  try {
    // 1. 언론사 수집
    const newsData = await scrapeNewsAPI();

    // 2. 한국 기관 수집
    const koreanData = await scrapeKoreanAgencies();

    // 3. 결과 출력
    const allData = [...newsData, ...koreanData];
    const uniqueData = Array.from(
      new Map(allData.map(r => [r.url, r])).values()
    );

    console.log('\n' + '='.repeat(60));
    console.log('📊 수집 결과\n');
    console.log(`총 ${uniqueData.length}개 정보 수집 완료\n`);
    console.log('소스별 집계:');
    console.log(`  • 언론사: ${newsData.length}개`);
    console.log(`  • 한국 기관: ${koreanData.length}개`);
    console.log('='.repeat(60) + '\n');

    // 수집한 데이터 출력
    console.log('📋 수집된 정보 목록:\n');
    uniqueData.forEach((item, idx) => {
      console.log(`${idx + 1}. [${item.source}] ${item.title}`);
      console.log(`   URL: ${item.url.substring(0, 60)}...`);
      console.log('');
    });

    console.log('✅ 수집 완료!\n');
    console.log('💡 팁: 웹 대시보드 /regulations 페이지에서 수집된 정보를 확인할 수 있습니다.\n');

  } catch (error) {
    console.error('❌ 오류 발생:', error.message);
    process.exit(1);
  }
}

main();
