'use client';

import { useState } from 'react';
import { ALL_ROADMAPS, generateMonths, isMonthInRange } from '@/lib/db/roadmapData';
import type { RoadmapTask } from '@/lib/db/roadmapData';

const MONTHS = generateMonths('2025-01', '2030-12');
const PRODUCTS = ['펌프', '용기', '튜브', '색조'] as const;

export default function RoadmapPage() {
  const [selectedProduct, setSelectedProduct] = useState<typeof PRODUCTS[number]>('펌프');

  const roadmapData = ALL_ROADMAPS[selectedProduct as keyof typeof ALL_ROADMAPS] || [];

  return (
    <div className="space-y-8">
      {/* 헤더 */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">로드맵</h1>
        <p className="text-gray-600">제품군별 PPWR 대응 타임라인 (2025-2030)</p>
      </div>

      {/* 제품군 선택 */}
      <div className="flex gap-2 flex-wrap">
        {PRODUCTS.map((product) => (
          <button
            key={product}
            onClick={() => setSelectedProduct(product)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedProduct === product
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-gray-200 text-gray-700 hover:border-blue-300'
            }`}
          >
            {product}
          </button>
        ))}
      </div>

      {/* 로드맵 없음 메시지 */}
      {roadmapData.length === 0 ? (
        <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg text-center">
          <p className="text-yellow-900">
            {selectedProduct} 로드맵은 개발 중입니다.
          </p>
          <p className="text-sm text-yellow-800 mt-2">
            펌프와 용기 로드맵 완성 후 적용 예정
          </p>
        </div>
      ) : (
        <>
          {/* 타임라인 차트 */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-x-auto">
            <TimelineChart tasks={roadmapData} months={MONTHS} />
          </div>

          {/* 작업 목록 */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-gray-900">작업 목록</h3>
            {roadmapData.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function TimelineChart({
  tasks,
  months,
}: {
  tasks: RoadmapTask[];
  months: string[];
}) {
  // 월별로 6개월씩 페이지 분할
  const pageSize = 6;
  const pages = Math.ceil(months.length / pageSize);
  const [currentPage, setCurrentPage] = useState(0);

  const startIdx = currentPage * pageSize;
  const endIdx = Math.min(startIdx + pageSize, months.length);
  const pageMonths = months.slice(startIdx, endIdx);

  return (
    <div className="p-6">
      {/* 네비게이션 */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-semibold text-gray-900">타임라인</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
            disabled={currentPage === 0}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            ←
          </button>
          <span className="px-3 py-1 text-sm text-gray-600">
            {currentPage + 1} / {pages}
          </span>
          <button
            onClick={() => setCurrentPage(Math.min(pages - 1, currentPage + 1))}
            disabled={currentPage === pages - 1}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            →
          </button>
        </div>
      </div>

      {/* 테이블 */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="text-left p-3 font-semibold text-gray-900 w-48 sticky left-0 z-10 bg-gray-100">
                작업
              </th>
              {pageMonths.map((month) => (
                <th key={month} className="p-2 text-center text-xs text-gray-600">
                  {month.split('-')[1]}월
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, idx) => (
              <tr key={task.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="p-3 text-gray-900 font-medium w-48 sticky left-0 z-10 bg-inherit">
                  <div className="truncate text-xs">{task.task}</div>
                </td>
                {pageMonths.map((month) => {
                  const inRange = isMonthInRange(month, task.startMonth, task.endMonth);
                  const isStart = month === task.startMonth;
                  const isEnd = month === task.endMonth;

                  const statusColor =
                    task.status === 'completed'
                      ? 'bg-green-200'
                      : task.status === 'in_progress'
                        ? 'bg-yellow-200'
                        : 'bg-blue-200';

                  return (
                    <td key={`${task.id}-${month}`} className="p-2 text-center">
                      {inRange && (
                        <div
                          className={`h-6 rounded text-xs flex items-center justify-center text-gray-700 ${statusColor}`}
                        >
                          {isStart && '시'}
                          {isEnd && '종'}
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 범례 */}
      <div className="mt-6 flex gap-6 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-200 rounded"></div>
          <span>예정</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-200 rounded"></div>
          <span>진행중</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-200 rounded"></div>
          <span>완료</span>
        </div>
      </div>
    </div>
  );
}

function TaskCard({ task }: { task: RoadmapTask }) {
  const statusColors = {
    planned: 'bg-blue-50 border-blue-200',
    in_progress: 'bg-yellow-50 border-yellow-200',
    completed: 'bg-green-50 border-green-200',
  };

  const statusLabels = {
    planned: '예정',
    in_progress: '진행중',
    completed: '완료',
  };

  const priorityColors = {
    high: 'text-red-600 bg-red-50',
    medium: 'text-orange-600 bg-orange-50',
    low: 'text-blue-600 bg-blue-50',
  };

  return (
    <div className={`border p-4 rounded-lg ${statusColors[task.status]}`}>
      <div className="flex justify-between items-start gap-4">
        <div>
          <h4 className="font-semibold text-gray-900">{task.task}</h4>
          <p className="text-sm text-gray-600 mt-1">
            조항: {task.articleId}
          </p>
          {task.notes && (
            <p className="text-sm text-gray-600 mt-2">
              <span className="font-medium">비고:</span> {task.notes}
            </p>
          )}
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <span
            className={`px-2 py-1 rounded text-xs font-medium ${priorityColors[task.priority]}`}
          >
            {task.priority === 'high' ? '높음' : task.priority === 'medium' ? '중간' : '낮음'}
          </span>
          <span className="px-2 py-1 rounded text-xs font-medium bg-white border border-gray-300">
            {statusLabels[task.status]}
          </span>
        </div>
      </div>
      <div className="text-xs text-gray-600 mt-3">
        {task.startMonth} → {task.endMonth}
      </div>
    </div>
  );
}
