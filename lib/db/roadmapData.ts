/**
 * 제품군별 로드맵 데이터
 * 펌프와 용기를 먼저 정의하고, 나중에 튜브와 색조에 이식
 */

export interface RoadmapTask {
  id: string;
  productGroup: '펌프' | '튜브' | '용기' | '색조';
  articleId: string; // PPWR 조항 ID (예: article-2-1)
  task: string; // 대응 작업 설명
  startMonth: string; // '2025-01'
  endMonth: string; // '2030-12'
  status: 'planned' | 'in_progress' | 'completed';
  priority: 'high' | 'medium' | 'low';
  notes?: string;
}

// ==================== 펌프 로드맵 ====================
export const PUMP_ROADMAP: RoadmapTask[] = [
  {
    id: 'pump-1',
    productGroup: '펌프',
    articleId: 'article-2-3',
    task: '플라스틱 펌프 재생 재질 30% 도입',
    startMonth: '2025-01',
    endMonth: '2025-12',
    status: 'planned',
    priority: 'high',
    notes: 'rPET 소싱 및 공급망 구축',
  },
  {
    id: 'pump-2',
    productGroup: '펌프',
    articleId: 'article-2-1',
    task: '펌프 무게 10% 경량화',
    startMonth: '2025-03',
    endMonth: '2026-06',
    status: 'planned',
    priority: 'high',
    notes: '구조 최적화 및 소재 개선',
  },
  {
    id: 'pump-3',
    productGroup: '펌프',
    articleId: 'article-2-2',
    task: '단일 재질화 (플라스틱만 사용)',
    startMonth: '2025-06',
    endMonth: '2026-12',
    status: 'planned',
    priority: 'high',
    notes: '금속 스프링 제거 및 플라스틱 대체재료 적용',
  },
  {
    id: 'pump-4',
    productGroup: '펌프',
    articleId: 'article-2-4',
    task: '유해 물질 제거 검증',
    startMonth: '2025-02',
    endMonth: '2025-08',
    status: 'planned',
    priority: 'high',
    notes: '재료 성분 분석 및 대체재 선정',
  },
  {
    id: 'pump-5',
    productGroup: '펌프',
    articleId: 'article-5-1',
    task: 'LCA 평가 및 설계 최적화',
    startMonth: '2025-04',
    endMonth: '2026-03',
    status: 'planned',
    priority: 'medium',
    notes: '외부 전문기관 컨설팅',
  },
  {
    id: 'pump-6',
    productGroup: '펌프',
    articleId: 'article-7-1',
    task: '라벨 및 재질 표시 업데이트',
    startMonth: '2026-01',
    endMonth: '2026-06',
    status: 'planned',
    priority: 'medium',
    notes: 'ISO 1043 준수',
  },
  {
    id: 'pump-7',
    productGroup: '펌프',
    articleId: 'article-2-3',
    task: '플라스틱 재생 재질 50% 달성',
    startMonth: '2027-01',
    endMonth: '2027-12',
    status: 'planned',
    priority: 'high',
    notes: '2030년 목표 중간점검',
  },
];

// ==================== 용기 로드맵 ====================
export const CONTAINER_ROADMAP: RoadmapTask[] = [
  {
    id: 'container-1',
    productGroup: '용기',
    articleId: 'article-2-3',
    task: '용기 재생 재질 25% 도입',
    startMonth: '2025-01',
    endMonth: '2025-09',
    status: 'planned',
    priority: 'high',
    notes: 'rPET, rHDPE 공급망 확보',
  },
  {
    id: 'container-2',
    productGroup: '용기',
    articleId: 'article-2-1',
    task: '용기 벽두께 최적화 (무게 12% 감소)',
    startMonth: '2025-02',
    endMonth: '2026-05',
    status: 'planned',
    priority: 'high',
    notes: '강도 테스트 및 안전성 확인',
  },
  {
    id: 'container-3',
    productGroup: '용기',
    articleId: 'article-2-2',
    task: '재활용성 개선 (라벨 제거 용이화)',
    startMonth: '2025-05',
    endMonth: '2026-03',
    status: 'planned',
    priority: 'high',
    notes: '접착력 개선 및 분리 가능성 검증',
  },
  {
    id: 'container-4',
    productGroup: '용기',
    articleId: 'article-2-4',
    task: '화학물질 리스크 평가 및 개선',
    startMonth: '2025-03',
    endMonth: '2025-10',
    status: 'planned',
    priority: 'high',
    notes: 'SVHC 검토 및 대체재료 검증',
  },
  {
    id: 'container-5',
    productGroup: '용기',
    articleId: 'article-5-3',
    task: '재활용 정보 제공 (QR코드, 웹사이트)',
    startMonth: '2026-01',
    endMonth: '2026-06',
    status: 'planned',
    priority: 'medium',
    notes: '디지털 라벨 시스템 구축',
  },
  {
    id: 'container-6',
    productGroup: '용기',
    articleId: 'article-5-4',
    task: '재사용 가능 용기 시스템 개발',
    startMonth: '2026-06',
    endMonth: '2028-12',
    status: 'planned',
    priority: 'medium',
    notes: '회수 및 세척 시스템 구축',
  },
  {
    id: 'container-7',
    productGroup: '용기',
    articleId: 'article-2-3',
    task: '재생 재질 비율 50% 달성',
    startMonth: '2028-01',
    endMonth: '2028-12',
    status: 'planned',
    priority: 'high',
    notes: '2030년 목표 준비',
  },
];

// ==================== 튜브 로드맵 (추후 추가) ====================
export const TUBE_ROADMAP: RoadmapTask[] = [];

// ==================== 색조 로드맵 (추후 추가) ====================
export const COLOR_ROADMAP: RoadmapTask[] = [];

// 전체 로드맵 통합
export const ALL_ROADMAPS = {
  펌프: PUMP_ROADMAP,
  용기: CONTAINER_ROADMAP,
  튜브: TUBE_ROADMAP,
  색조: COLOR_ROADMAP,
};

/**
 * 월 범위 내의 모든 월 생성
 */
export function generateMonths(startMonth: string, endMonth: string): string[] {
  const months: string[] = [];
  const [startYear, startMon] = startMonth.split('-').map(Number);
  const [endYear, endMon] = endMonth.split('-').map(Number);

  for (let y = startYear; y <= endYear; y++) {
    const start = y === startYear ? startMon : 1;
    const end = y === endYear ? endMon : 12;

    for (let m = start; m <= end; m++) {
      months.push(`${y}-${String(m).padStart(2, '0')}`);
    }
  }

  return months;
}

/**
 * 월이 작업 기간에 포함되는지 확인
 */
export function isMonthInRange(
  month: string,
  startMonth: string,
  endMonth: string
): boolean {
  return month >= startMonth && month <= endMonth;
}
