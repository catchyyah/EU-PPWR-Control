'use client';

import { useState, useEffect } from 'react';
import { PPWR_ARTICLES } from '@/lib/db/ppwrArticles';
import { ALL_ROADMAPS } from '@/lib/db/roadmapData';

export default function Dashboard() {
  const [regulations, setRegulations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // 로드맵 통계
  const roadmapStats = {
    펌프: {
      total: ALL_ROADMAPS.펌프.length,
      completed: ALL_ROADMAPS.펌프.filter((t) => t.status === 'completed').length,
      inProgress: ALL_ROADMAPS.펌프.filter((t) => t.status === 'in_progress').length,
    },
    용기: {
      total: ALL_ROADMAPS.용기.length,
      completed: ALL_ROADMAPS.용기.filter((t) => t.status === 'completed').length,
      inProgress: ALL_ROADMAPS.용기.filter((t) => t.status === 'in_progress').length,
    },
  };

  const collectRegulations = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/regulations?action=collect');
      const data = await response.json();
      if (data.regulations) {
        setRegulations(data.regulations.slice(0, 5));
      }
    } catch (error) {
      console.error('규제 정보 수집 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* 헤더 */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">대시보드</h2>
        <p className="text-gray-600">EU PPWR/ESPR 규제 모니터링 및 기술 로드맵</p>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="text-sm text-gray-600 mb-2">📋 분석 조항</div>
          <div className="text-3xl font-bold text-blue-600">{PPWR_ARTICLES.length}</div>
          <p className="text-xs text-gray-500 mt-2">제2, 5, 7장</p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="text-sm text-gray-600 mb-2">🗓️ 펌프 로드맵</div>
          <div className="text-3xl font-bold text-green-600">
            {roadmapStats.펌프.total}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {roadmapStats.펌프.completed}개 완료
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="text-sm text-gray-600 mb-2">📦 용기 로드맵</div>
          <div className="text-3xl font-bold text-purple-600">
            {roadmapStats.용기.total}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {roadmapStats.용기.completed}개 완료
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="text-sm text-gray-600 mb-2">🔄 상태</div>
          <div className="text-3xl font-bold text-orange-600">구축중</div>
          <p className="text-xs text-gray-500 mt-2">시스템 초기화</p>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 규제 정보 */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-900">최신 규제 정보</h3>
            <button
              onClick={collectRegulations}
              disabled={loading}
              className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? '수집중...' : '수집'}
            </button>
          </div>
          <div className="space-y-4">
            {regulations.length === 0 ? (
              <div className="border-l-4 border-blue-500 pl-4 py-2">
                <p className="text-sm text-gray-600">
                  아직 수집된 규제 정보가 없습니다.
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  '수집' 버튼을 눌러 규제 정보를 수집하세요.
                </p>
              </div>
            ) : (
              regulations.map((reg, idx) => (
                <div key={idx} className="border-l-4 border-blue-500 pl-4 py-2">
                  <p className="text-sm font-medium text-gray-900">{reg.title}</p>
                  <p className="text-xs text-gray-500 mt-1">{reg.source}</p>
                </div>
              ))
            )}
          </div>
          <a href="/regulations" className="text-blue-600 text-sm mt-4 inline-block hover:underline">
            더보기 →
          </a>
        </div>

        {/* 빠른 메뉴 */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">빠른 메뉴</h3>
          <div className="space-y-2">
            <a
              href="/articles"
              className="block p-3 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 text-sm text-blue-900 font-medium"
            >
              📄 조항 분석
            </a>
            <a
              href="/roadmap"
              className="block p-3 bg-green-50 border border-green-200 rounded hover:bg-green-100 text-sm text-green-900 font-medium"
            >
              🗓️ 로드맵 보기
            </a>
            <a
              href="/products"
              className="block p-3 bg-purple-50 border border-purple-200 rounded hover:bg-purple-100 text-sm text-purple-900 font-medium"
            >
              🏭 제품 정보
            </a>
          </div>
        </div>
      </div>

      {/* 조항별 요약 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[2, 5, 7].map((chapter) => {
          const chapterArticles = PPWR_ARTICLES.filter((a) => a.chapter === chapter);
          const titles = {
            2: '지속가능성 요구사항',
            5: '경제주체의 의무',
            7: '라벨링',
          };
          return (
            <div key={chapter} className="bg-white p-6 rounded-lg border border-gray-200">
              <h4 className="text-lg font-bold text-gray-900 mb-3">
                제{chapter}장: {titles[chapter as keyof typeof titles]}
              </h4>
              <p className="text-3xl font-bold text-blue-600 mb-4">
                {chapterArticles.length}
              </p>
              <ul className="space-y-2">
                {chapterArticles.slice(0, 3).map((article) => (
                  <li key={article.id} className="text-sm text-gray-600">
                    • {article.title}
                  </li>
                ))}
              </ul>
              <a
                href={`/articles?chapter=${chapter}`}
                className="text-blue-600 text-sm mt-3 inline-block hover:underline"
              >
                자세히 보기 →
              </a>
            </div>
          );
        })}
      </div>

      {/* 시스템 상태 */}
      <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
        <p className="text-sm text-green-900">
          <strong>✓ 시스템 준비 완료:</strong> PPWR 조항 분석 및 로드맵 시스템이 구축되었습니다.
          제품별 로드맵을 확인하고 필요에 따라 커스터마이징하세요.
        </p>
      </div>
    </div>
  );
}
