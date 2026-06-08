import axios from 'axios';
import { randomUUID } from 'crypto';
import { Regulation } from '../types';

/**
 * NewsAPI.org를 통한 뉴스 검색
 * PPWR, 패키징, 규제 관련 뉴스를 수집합니다.
 */
export async function scrapeNewsAPI(): Promise<Regulation[]> {
  const apiKey = process.env.NEWS_API_KEY;

  if (!apiKey) {
    console.warn('⚠️ NEWS_API_KEY 환경 변수가 설정되지 않았습니다.');
    return [];
  }

  try {
    const regulations: Regulation[] = [];

    // 검색 키워드 (2개 이상 포함해야 함)
    const keywords = [
      'EU PPWR packaging',
      'EU packaging regulation',
      'PPWR packaging waste',
      'packaging sustainability regulation',
    ];

    console.log('📥 뉴스 API 수집 시작...');

    for (const keyword of keywords) {
      try {
        const response = await axios.get('https://newsapi.org/v2/everything', {
          params: {
            q: keyword,
            language: 'en',
            sortBy: 'publishedAt',
            pageSize: 10,
            apiKey: apiKey,
          },
        });

        if (response.data.articles) {
          for (const article of response.data.articles) {
            const regulation: Regulation = {
              id: randomUUID(),
              source: 'NEWS',
              title: article.title,
              content: article.description || article.content || '',
              url: article.url,
              keywords: extractKeywords(article.title, article.description),
              publishedAt: new Date(article.publishedAt),
              updatedAt: new Date(),
            };

            regulations.push(regulation);
          }
        }
      } catch (error) {
        console.error(`❌ 뉴스 API 검색 실패 (${keyword}):`, error);
      }
    }

    // 중복 제거
    const uniqueRegulations = Array.from(
      new Map(regulations.map((r) => [r.url, r])).values()
    );

    console.log(
      `✓ 뉴스 API 수집 완료: ${uniqueRegulations.length}개 뉴스`
    );
    return uniqueRegulations;
  } catch (error) {
    console.error('❌ 뉴스 API 스크래핑 오류:', error);
    return [];
  }
}

/**
 * 제목과 설명에서 키워드 추출
 */
function extractKeywords(title: string, description?: string): string[] {
  const keywords: Set<string> = new Set();
  const text = `${title} ${description || ''}`.toLowerCase();

  // 기본 키워드들
  const baseKeywords = ['eu', '패키징', 'ppwr', '규제', 'packaging', 'regulation', 'waste'];

  for (const keyword of baseKeywords) {
    if (text.includes(keyword.toLowerCase())) {
      keywords.add(keyword);
    }
  }

  return Array.from(keywords);
}
