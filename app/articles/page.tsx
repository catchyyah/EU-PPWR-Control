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
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">조항 분석</h1>
        <p className="text-gray-600">PPWR 주요 조항 (제2, 5, 7장)</p>
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
          <div className="text-2xl text-gray-400">
            {expanded ? '▼' : '▶'}
          </div>
        </div>
      </div>

      {/* 확장 콘텐츠 */}
      {expanded && (
        <div className="bg-gray-50 border-t border-gray-200 p-6">
          <div className="space-y-4">
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

            {/* 대응 로드맵 링크 */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <a
                href={`/roadmap?article=${article.id}`}
                className="text-blue-600 hover:underline text-sm font-medium"
              >
                이 조항의 로드맵 보기 →
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
