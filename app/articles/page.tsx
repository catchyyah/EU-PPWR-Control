'use client';

import { useState, useEffect } from 'react';
import { ARTICLE_CHAPTERS, PPWR_ARTICLES } from '@/lib/db/ppwrArticles';

export default function ArticlesPage() {
  const [selectedChapter, setSelectedChapter] = useState<2 | 5 | 7>(2);
  const [articles, setArticles] = useState<any[]>([]);

  useEffect(() => {
    const chapterData =
      ARTICLE_CHAPTERS[selectedChapter as keyof typeof ARTICLE_CHAPTERS];
    if (chapterData) {
      setArticles(chapterData.articles);
    }
  }, [selectedChapter]);

  const chapters = [
    { num: 2, title: '제2장: 지속가능성 요구사항' },
    { num: 5, title: '제5장: 경제주체의 의무' },
    { num: 7, title: '제7장: 라벨링' },
  ] as const;

  const currentChapter =
    ARTICLE_CHAPTERS[selectedChapter as keyof typeof ARTICLE_CHAPTERS];

  return (
    <div className="space-y-8">
      {/* 헤더 */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">조항 분석</h1>
          <p className="text-gray-600">PPWR 주요 조항 (제2, 5, 7장) - 최신 분석 정보</p>
        </div>
        <a
          href="/api/regulations?action=collect"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
        >
          🔄 규제 정보 업데이트
        </a>
      </div>

      {/* 장 선택 탭 */}
      <div className="flex gap-2 border-b border-gray-200">
        {chapters.map((ch) => (
          <button
            key={ch.num}
            onClick={() => setSelectedChapter(ch.num)}
            className={`px-4 py-3 font-medium border-b-2 transition-colors ${
              selectedChapter === ch.num
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            {ch.title}
          </button>
        ))}
      </div>

      {/* 장 설명 */}
      <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
        <h2 className="text-xl font-bold text-blue-900 mb-2">
          {currentChapter?.title}
        </h2>
        <p className="text-blue-800">{currentChapter?.description}</p>
      </div>

      {/* 조항 목록 */}
      <div className="space-y-4">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
}

function ArticleCard({ article }: { article: any }) {
  const [expanded, setExpanded] = useState(false);
  const [showAnalysisForm, setShowAnalysisForm] = useState(false);
  const [analyses, setAnalyses] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [formData, setFormData] = useState({
    analysisType: 'interpretation',
    title: '',
    content: '',
  });
  const [loading, setLoading] = useState(false);

  // 분석 데이터 로드
  useEffect(() => {
    if (expanded) {
      loadAnalyses();
    }
  }, [expanded]);

  const loadAnalyses = async () => {
    try {
      const response = await fetch(`/api/articles-analysis?articleId=${article.id}`);
      const data = await response.json();
      if (data.analyses) {
        setAnalyses(data.analyses);
      }
    } catch (error) {
      console.error('분석 로드 실패:', error);
    }
  };

  const submitAnalysis = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      alert('제목과 내용을 입력해주세요');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/articles-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          articleId: article.id,
          ...formData,
        }),
      });

      if (response.ok) {
        await loadAnalyses();
        setFormData({ analysisType: 'interpretation', title: '', content: '' });
        setShowAnalysisForm(false);
        alert('분석이 저장되었습니다!');
      }
    } catch (error) {
      console.error('분석 저장 실패:', error);
      alert('분석 저장에 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  const analysisTypeLabels = {
    interpretation: '해석',
    risk: '리스크',
    opportunity: '기회',
    implementation: '구현 방안',
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      <div
        className="p-6 cursor-pointer hover:bg-gray-50"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <div className="text-sm font-semibold text-blue-600 mb-1">
              {article.articleNumber}
            </div>
            <h3 className="text-lg font-bold text-gray-900">{article.title}</h3>
            <p className="text-gray-600 text-sm mt-2">{article.description}</p>
          </div>
          <div className="flex items-center gap-3">
            {analyses.length > 0 && (
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded font-medium">
                분석 {analyses.length}개
              </span>
            )}
            <div className="text-2xl text-gray-400">
              {expanded ? '▼' : '▶'}
            </div>
          </div>
        </div>
      </div>

      {/* 확장 콘텐츠 */}
      {expanded && (
        <div className="bg-gray-50 border-t border-gray-200 p-6 space-y-6">
          {/* 핵심 요구사항 */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">
              핵심 요구사항
            </h4>
            <ul className="space-y-2">
              {article.keyRequirements.map(
                (req: string, idx: number) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 text-sm text-gray-700"
                  >
                    <span className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-600 mt-2"></span>
                    <span>{req}</span>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* 분석 섹션 */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-semibold text-gray-900">📊 상세 분석</h4>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="px-3 py-1 text-sm bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                >
                  {showHistory ? '접기' : '히스토리'}
                </button>
                <button
                  onClick={() => setShowAnalysisForm(!showAnalysisForm)}
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  + 분석 추가
                </button>
              </div>
            </div>

            {/* 분석 입력 폼 */}
            {showAnalysisForm && (
              <div className="bg-white border border-gray-300 p-4 rounded-lg mb-4 space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    분석 유형
                  </label>
                  <select
                    value={formData.analysisType}
                    onChange={(e) =>
                      setFormData({ ...formData, analysisType: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded text-sm"
                  >
                    {Object.entries(analysisTypeLabels).map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    제목
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="분석 제목"
                    className="w-full p-2 border border-gray-300 rounded text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    분석 내용
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) =>
                      setFormData({ ...formData, content: e.target.value })
                    }
                    placeholder="상세 분석 내용을 입력하세요"
                    rows={4}
                    className="w-full p-2 border border-gray-300 rounded text-sm"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={submitAnalysis}
                    disabled={loading}
                    className="px-4 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:opacity-50"
                  >
                    {loading ? '저장중...' : '저장'}
                  </button>
                  <button
                    onClick={() => setShowAnalysisForm(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400"
                  >
                    취소
                  </button>
                </div>
              </div>
            )}

            {/* 분석 목록 */}
            {analyses.length > 0 ? (
              <div className="space-y-3">
                {(showHistory ? analyses : analyses.slice(0, 1)).map((analysis) => (
                  <div key={analysis.id} className="bg-white border border-gray-300 p-4 rounded">
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded font-medium">
                          {analysisTypeLabels[analysis.analysisType as keyof typeof analysisTypeLabels]}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(analysis.createdAt).toLocaleDateString('ko-KR')}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">{analysis.author}</span>
                    </div>
                    <h5 className="font-semibold text-gray-900 mb-1">
                      {analysis.title}
                    </h5>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">
                      {analysis.content}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>아직 분석이 없습니다.</p>
                <p className="text-sm mt-1">첫 분석을 추가해보세요!</p>
              </div>
            )}
          </div>

          {/* 로드맵 링크 */}
          <div className="border-t border-gray-200 pt-4">
            <a
              href={`/roadmap?article=${article.id}`}
              className="text-blue-600 hover:underline text-sm font-medium"
            >
              이 조항의 로드맵 보기 →
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
