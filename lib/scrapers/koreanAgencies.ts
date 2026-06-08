import axios from 'axios';
import * as cheerio from 'cheerio';
import { randomUUID } from 'crypto';
import { Regulation } from '../types';

interface KoreanAgency {
  name: string;
  url: string;
  searchUrl: string;
  selector: string;
}

/**
 * 한국 관련 기관의 웹사이트에서 정보 수집
 * - 한국환경공단
 * - 대한화장품협회
 * - 한국포장재재활용공제사업조합
 * - KCL
 */
const agencies: KoreanAgency[] = [
  {
    name: '한국환경공단',
    url: 'https://www.keco.or.kr',
    searchUrl: 'https://www.keco.or.kr/search',
    selector: 'article, .article-item',
  },
  {
    name: '대한화장품협회',
    url: 'https://www.kosmetic.or.kr',
    searchUrl: 'https://www.kosmetic.or.kr/search',
    selector: 'article, .news-item',
  },
  {
    name: '한국포장재재활용공제사업조합',
    url: 'https://www.k-recycle.or.kr',
    searchUrl: 'https://www.k-recycle.or.kr/search',
    selector: 'article, .content-item',
  },
  {
    name: 'KCL',
    url: 'https://www.kcl.re.kr',
    searchUrl: 'https://www.kcl.re.kr/search',
    selector: 'article, .item',
  },
];

/**
 * 모든 한국 기관에서 정보 수집
 */
export async function scrapeKoreanAgencies(): Promise<Regulation[]> {
  const allRegulations: Regulation[] = [];

  console.log('📥 한국 기관 웹사이트 수집 시작...');

  for (const agency of agencies) {
    try {
      const regulations = await scrapeAgency(agency);
      allRegulations.push(...regulations);
      console.log(`✓ ${agency.name}: ${regulations.length}개 항목 수집`);
    } catch (error) {
      console.error(`❌ ${agency.name} 수집 실패:`, error);
    }
  }

  console.log(
    `✓ 한국 기관 수집 완료: 총 ${allRegulations.length}개 항목`
  );
  return allRegulations;
}

/**
 * 개별 기관 스크래핑
 */
async function scrapeAgency(agency: KoreanAgency): Promise<Regulation[]> {
  try {
    const regulations: Regulation[] = [];

    // 기관 메인 페이지에서 최신 뉴스/공지 수집
    const response = await axios.get(agency.url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; PPWRBot/1.0)',
      },
      timeout: 10000,
    });

    const $ = cheerio.load(response.data);

    // 페이지에서 기관 관련 정보 추출
    // 실제 구현에서는 각 기관의 HTML 구조에 맞춰 수정 필요
    const articles = $(agency.selector).slice(0, 10);

    for (let i = 0; i < articles.length; i++) {
      const article = articles.eq(i);
      const title = article.find('h2, h3, .title, .headline').text().trim();
      const link = article.find('a').attr('href') || '';
      const description = article.find('p, .description, .summary').text().trim();

      // 키워드 필터링 (2개 이상 포함 필수)
      const keywords = extractKeywords(title, description);
      if (keywords.length >= 2) {
        const regulation: Regulation = {
          id: randomUUID(),
          source: 'KOREAN_AGENCY',
          title: title || `${agency.name} 공지사항`,
          content: description || title || '',
          url: link ? (link.startsWith('http') ? link : `${agency.url}${link}`) : agency.url,
          keywords: keywords,
          publishedAt: new Date(),
          updatedAt: new Date(),
        };

        if (title) {
          regulations.push(regulation);
        }
      }
    }

    return regulations;
  } catch (error) {
    console.error(`${agency.name} 스크래핑 오류:`, error);
    return [];
  }
}

/**
 * 제목과 설명에서 키워드 추출
 */
function extractKeywords(title: string, description: string): string[] {
  const keywords: Set<string> = new Set();
  const text = `${title} ${description}`.toLowerCase();

  // 필터링할 키워드 (2개 이상 포함해야 함)
  const filterKeywords = ['eu', '패키징', 'ppwr', '규제', 'packaging', 'espr'];

  for (const keyword of filterKeywords) {
    if (text.includes(keyword)) {
      keywords.add(keyword);
    }
  }

  return Array.from(keywords);
}
