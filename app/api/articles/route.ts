import { NextRequest, NextResponse } from 'next/server';
import { PPWR_ARTICLES, ARTICLE_CHAPTERS } from '@/lib/db/ppwrArticles';

export async function GET(request: NextRequest) {
  try {
    const chapter = request.nextUrl.searchParams.get('chapter');
    const articleId = request.nextUrl.searchParams.get('id');

    // 특정 조항 조회
    if (articleId) {
      const article = PPWR_ARTICLES.find((a) => a.id === articleId);
      if (!article) {
        return NextResponse.json(
          { status: 'error', message: '조항을 찾을 수 없습니다.' },
          { status: 404 }
        );
      }
      return NextResponse.json({ status: 'success', article });
    }

    // 특정 장(chapter) 조회
    if (chapter) {
      const chapterNum = parseInt(chapter);
      const chapterData = ARTICLE_CHAPTERS[chapterNum as keyof typeof ARTICLE_CHAPTERS];
      if (!chapterData) {
        return NextResponse.json(
          { status: 'error', message: '장을 찾을 수 없습니다.' },
          { status: 404 }
        );
      }
      return NextResponse.json({ status: 'success', chapter: chapterData });
    }

    // 전체 조항 및 장 정보 조회
    return NextResponse.json({
      status: 'success',
      message: 'PPWR 조항 API',
      chapters: ARTICLE_CHAPTERS,
      totalArticles: PPWR_ARTICLES.length,
      endpoints: {
        allArticles: '/api/articles',
        chapterArticles: '/api/articles?chapter=2',
        singleArticle: '/api/articles?id=article-2-1',
      },
    });
  } catch (error) {
    console.error('조항 API 오류:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: '조항 조회 실패',
        error: error instanceof Error ? error.message : '알 수 없는 오류',
      },
      { status: 500 }
    );
  }
}
