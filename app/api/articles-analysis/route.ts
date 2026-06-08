import { NextRequest, NextResponse } from 'next/server';

// 메모리에 분석 데이터 저장 (임시)
const analysisData: Map<string, any[]> = new Map();

export async function GET(request: NextRequest) {
  try {
    const articleId = request.nextUrl.searchParams.get('articleId');

    if (!articleId) {
      return NextResponse.json({
        status: 'error',
        message: '조항 ID가 필요합니다',
      }, { status: 400 });
    }

    // 해당 조항의 분석 데이터 조회
    const analyses = analysisData.get(articleId) || [];

    return NextResponse.json({
      status: 'success',
      articleId,
      analyses,
      count: analyses.length,
    });
  } catch (error) {
    console.error('분석 조회 오류:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: '분석 조회 실패',
        error: error instanceof Error ? error.message : '알 수 없는 오류',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { articleId, analysisType, title, content, author } = body;

    if (!articleId || !analysisType || !title || !content) {
      return NextResponse.json(
        {
          status: 'error',
          message: '필수 항목이 누락되었습니다',
        },
        { status: 400 }
      );
    }

    // 새 분석 데이터 생성
    const newAnalysis = {
      id: `analysis-${Date.now()}`,
      articleId,
      analysisType,
      title,
      content,
      author: author || '연구기획자',
      createdAt: new Date().toISOString(),
      status: 'published',
    };

    // 메모리에 저장
    if (!analysisData.has(articleId)) {
      analysisData.set(articleId, []);
    }
    analysisData.get(articleId)!.unshift(newAnalysis);

    return NextResponse.json({
      status: 'success',
      message: '분석이 저장되었습니다',
      analysis: newAnalysis,
    });
  } catch (error) {
    console.error('분석 저장 오류:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: '분석 저장 실패',
        error: error instanceof Error ? error.message : '알 수 없는 오류',
      },
      { status: 500 }
    );
  }
}
