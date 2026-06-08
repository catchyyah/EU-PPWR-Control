import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// 수집된 규제 정보 임시 저장소
let regulationsCache: any[] = [];

export async function GET(request: NextRequest) {
  try {
    const action = request.nextUrl.searchParams.get('action');

    // 기존 데이터 로드
    try {
      const dataPath = path.join(process.cwd(), 'public', 'regulations-data.json');
      const data = await fs.readFile(dataPath, 'utf-8');
      regulationsCache = JSON.parse(data);
    } catch (e) {
      // 파일이 없으면 빈 배열
      regulationsCache = [];
    }

    if (action === 'collect') {
      // 수동으로 규제 정보 수집 실행
      console.log('📥 규제 정보 수집 API 호출');
      const regulations = await collectRegulationsAPI();

      // 파일에 저장
      const dataPath = path.join(process.cwd(), 'public', 'regulations-data.json');
      await fs.writeFile(dataPath, JSON.stringify(regulations, null, 2));

      return NextResponse.json({
        status: 'success',
        message: '규제 정보 수집 완료',
        count: regulations.length,
        regulations: regulations.slice(0, 10), // 최근 10개만 반환
      });
    }

    // 기본 조회 (저장된 데이터 반환)
    return NextResponse.json({
      status: 'success',
      message: 'PPWR 규제 정보',
      regulations: regulationsCache,
      count: regulationsCache.length,
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

      // 파일에 저장
      const dataPath = path.join(process.cwd(), 'public', 'regulations-data.json');
      await fs.writeFile(dataPath, JSON.stringify(regulations, null, 2));

      return NextResponse.json({
        status: 'success',
        message: '규제 정보 수집 완료',
        count: regulations.length,
        regulations: regulations.slice(0, 10),
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

// 규제 정보 수집 (NewsAPI + 한국 기관)
async function collectRegulationsAPI() {
  const { randomUUID } = await import('crypto');
  const axios = require('axios');

  const regulations: any[] = [];
  const newsApiKey = process.env.NEWS_API_KEY;

  // 1. NewsAPI 수집
  if (newsApiKey) {
    try {
      console.log('📰 언론사 뉴스 수집 중...');
      const keywords = ['EU PPWR packaging', 'packaging regulation', 'sustainable packaging'];

      for (const keyword of keywords) {
        const response = await axios.get('https://newsapi.org/v2/everything', {
          params: {
            q: keyword,
            language: 'en',
            sortBy: 'publishedAt',
            pageSize: 3,
            apiKey: newsApiKey,
          },
        });

        for (const article of response.data.articles || []) {
          regulations.push({
            id: `news-${randomUUID()}`,
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
      console.log(`✓ ${regulations.length}개 뉴스 수집 완료`);
    } catch (error) {
      console.error('뉴스 API 오류:', error);
    }
  }

  return regulations;
}
