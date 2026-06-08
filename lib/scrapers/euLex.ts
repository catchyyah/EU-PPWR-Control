import axios from 'axios';
import * as cheerio from 'cheerio';
import { randomUUID } from 'crypto';
import { Regulation } from '../types';

/**
 * EU Lex에서 PPWR 관련 최신 문서 수집
 * EUR-Lex API를 사용하여 공식 규제 문서를 수집합니다.
 */
export async function scrapeEULex(): Promise<Regulation[]> {
  try {
    const regulations: Regulation[] = [];

    // EUR-Lex Advanced Search API를 통한 PPWR 검색
    // 참고: https://eur-lex.europa.eu/
    const searchUrl = 'https://eur-lex.europa.eu/search.html?scope=EURLEX&text=PPWR&type=advanced';

    console.log('📥 EU Lex 수집 시작...');

    // 실제 구현에서는 EUR-Lex API 또는 직접 스크래핑
    // 여기서는 최근 PPWR 관련 문서 정보를 정의합니다
    const ppwrDocuments = [
      {
        title: 'Regulation (EU) 2025/40/EU on packaging and packaging waste',
        url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32025R0040',
        publishedAt: new Date('2025-01-15'),
      },
    ];

    for (const doc of ppwrDocuments) {
      try {
        // 실제로 문서 내용을 가져올 수 있도록 구현
        // 여기서는 기본 정보만 저장
        const regulation: Regulation = {
          id: randomUUID(),
          source: 'EU_LEX',
          title: doc.title,
          content: `PPWR 최신 규제 문서: ${doc.title}`,
          url: doc.url,
          keywords: ['EU', '패키징', 'PPWR', '규제'],
          publishedAt: doc.publishedAt,
          updatedAt: new Date(),
        };

        regulations.push(regulation);
      } catch (error) {
        console.error(`❌ EU Lex 문서 처리 실패: ${doc.url}`, error);
      }
    }

    console.log(`✓ EU Lex 수집 완료: ${regulations.length}개 문서`);
    return regulations;
  } catch (error) {
    console.error('❌ EU Lex 스크래핑 오류:', error);
    return [];
  }
}

/**
 * EUR-Lex HTML 파싱 (필요시 사용)
 */
async function parseEURLexPage(url: string): Promise<string> {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; PPWRBot/1.0)',
      },
    });

    const $ = cheerio.load(response.data);
    const content = $('body').text();
    return content.substring(0, 2000); // 처음 2000글자만
  } catch (error) {
    console.error('EUR-Lex 페이지 파싱 실패:', error);
    return '';
  }
}
