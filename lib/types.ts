// 규제 정보
export interface Regulation {
  id: string;
  source: 'EU_LEX' | 'NEWS' | 'KOREAN_AGENCY';
  title: string;
  content: string;
  url: string;
  keywords: string[];
  publishedAt: Date;
  updatedAt: Date;
}

// PPWR 조항
export interface PPWRArticle {
  id: string;
  chapter: 2 | 5 | 7;
  articleNumber: string;
  title: string;
  description: string;
  keyRequirements: string[];
}

// 제품군별 로드맵
export interface RoadmapItem {
  id: string;
  productGroup: '펌프' | '튜브' | '용기' | '색조';
  articleId: string;
  task: string;
  startMonth: string; // '2025-01'
  endMonth: string;   // '2030-12'
  status: 'planned' | 'in_progress' | 'completed';
  notes?: string;
}

// 제품 정보 (사용자 입력)
export interface ProductInfo {
  id: string;
  productGroup: '펌프' | '튜브' | '용기' | '색조';
  productName: string;
  currentState: string;
  currentComplianceStatus: string;
  targetComplianceDate: string;
  notes: string;
}
