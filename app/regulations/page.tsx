'use client';

import { useState, useEffect } from 'react';

export default function RegulationsPage() {
  const [regulations, setRegulations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);

  const collectRegulations = async () => {
    setLoading(true);
    try {
      console.log('🔄 규제 정보 수집 요청...');
      const response = await fetch('/api/regulations?action=collect', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();

      console.log('✅ 수집 응답:', data);

      if (data.regulations && data.regulations.length > 0) {
        setRegulations(data.regulations);
        setLastUpdate(new Date().toLocaleString('ko-KR'));
        localStorage.setItem('regulations', JSON.stringify(data.regulations));
        alert(`✅ 수집 완료! ${data.count}개의 규제 정보를 가져왔습니다.`);
      } else {
        alert('⚠️ 수집할 규제 정보가 없습니다. API 키와 네트워크 연결을 확인해주세요.');
      }
    } catch (error) {
      console.error('규제 정보 수집 실패:', error);
      alert('❌ 규제 정보 수집 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 페이지 로드 시 저장된 데이터 복원
  useEffect(() => {
    // 로컬 스토리지에서 저장된 데이터 로드
    const saved = localStorage.getItem('regulations');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setRegulations(parsed);
        setLastUpdate('(저장된 데이터)');
      } catch (e) {
        console.error('저장된 데이터 파싱 실패:', e);
      }
    }
  }, []);

  // 규제 정보 저장
  useEffect(() => {
    if (regulations.length > 0) {
      localStorage.setItem('regulations', JSON.stringify(regulations));
    }
  }, [regulations]);

  return (
    <div className="space-y-8">
      {/* 헤더 */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">규제 정보</h1>
        <p className="text-gray-600">
          EU PPWR/ESPR 최신 규제 정보 및 모니터링
        </p>
      </div>

      {/* 정보 */}
      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
        <p className="text-sm text-blue-900">
          📡 <strong>자동 수집:</strong> 다음 소스에서 규제 정보를 수집합니다:
        </p>
        <ul className="text-sm text-blue-800 mt-2 ml-6 space-y-1">
          <li>• EU Lex (공식 규제 문서)</li>
          <li>• 주요 언론사 (뉴스)</li>
          <li>• 한국 관련 기관 (환경공단, 화장품협회 등)</li>
        </ul>
        {lastUpdate && (
          <p className="text-xs text-blue-700 mt-3">
            마지막 업데이트: {lastUpdate}
          </p>
        )}
      </div>

      {/* 수집 버튼 */}
      <div className="flex gap-4">
        <button
          onClick={collectRegulations}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
        >
          {loading ? '수집 중...' : '지금 수집'}
        </button>
        <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg text-gray-600">
          <span className="text-sm">수집된 정보: {regulations.length}개</span>
        </div>
      </div>

      {/* 규제 정보 목록 */}
      {regulations.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 p-8 rounded-lg text-center">
          <p className="text-gray-600 text-lg">수집된 규제 정보가 없습니다.</p>
          <p className="text-sm text-gray-500 mt-2">
            '지금 수집' 버튼을 눌러 최신 규제 정보를 수집하세요.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {regulations.map((reg, idx) => (
            <RegulationCard key={idx} regulation={reg} />
          ))}
        </div>
      )}

      {/* 수집 일정 정보 */}
      <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg">
        <h3 className="text-lg font-bold text-gray-900 mb-4">수집 일정</h3>
        <div className="space-y-3 text-sm text-gray-700">
          <div className="flex justify-between">
            <span>자동 수집 주기:</span>
            <span className="font-medium">3일마다 (오전 2시)</span>
          </div>
          <div className="flex justify-between">
            <span>수집 소스 수:</span>
            <span className="font-medium">3곳 (EU Lex, 뉴스, 한국 기관)</span>
          </div>
          <div className="flex justify-between">
            <span>키워드 필터:</span>
            <span className="font-medium">EU, 패키징, PPWR, 규제 (2개 이상)</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function RegulationCard({ regulation }: { regulation: any }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
      {/* 소스 정보 */}
      <div className="mb-3">
        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded font-medium">
          {regulation.source}
        </span>
      </div>

      {/* 제목 (클릭 가능) */}
      {regulation.url ? (
        <a
          href={regulation.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-lg font-bold text-blue-600 hover:text-blue-800 hover:underline mb-2 cursor-pointer"
        >
          {regulation.title}
        </a>
      ) : (
        <h3 className="text-lg font-bold text-gray-900 mb-2">{regulation.title}</h3>
      )}

      {/* 내용 */}
      <p className="text-gray-700 text-sm mb-3 line-clamp-2">
        {regulation.content}
      </p>

      {/* 키워드 */}
      {regulation.keywords && regulation.keywords.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {regulation.keywords.map((keyword: string, idx: number) => (
            <span
              key={idx}
              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
            >
              #{keyword}
            </span>
          ))}
        </div>
      )}

      {/* 날짜 */}
      <div className="text-xs text-gray-500">
        {regulation.publishedAt && (
          <>
            📅{' '}
            {new Date(regulation.publishedAt).toLocaleDateString('ko-KR')}
          </>
        )}
      </div>
    </div>
  );
}
