/**
 * PPWR 주요 조항 데이터
 * 제2장(지속가능성), 제5장(경제주체의무), 제7장(라벨링)
 */

export const PPWR_ARTICLES = [
  // ==================== 제2장: 지속가능성 요구사항 ====================
  {
    id: 'article-2-1',
    chapter: 2,
    articleNumber: '2.1',
    title: '포장 무게 및 부피 감소',
    description: '포장의 총 무게와 부피를 단계적으로 감소시키는 요구사항',
    keyRequirements: [
      '2030년까지 포장 무게 15% 감소',
      '2040년까지 포장 무게 30% 감소',
      '필요 기능 유지하면서 감소',
    ],
  },
  {
    id: 'article-2-2',
    chapter: 2,
    articleNumber: '2.2',
    title: '재활용 가능성 요구사항',
    description: '포장재가 회수 및 재활용 시스템에서 기술적으로 분리 가능해야 함',
    keyRequirements: [
      '단일 재질 또는 쉽게 분리 가능한 재질 사용',
      '수동 또는 기계적 분리 가능해야 함',
      '재활용 시설에서 처리 가능한 규격',
    ],
  },
  {
    id: 'article-2-3',
    chapter: 2,
    articleNumber: '2.3',
    title: '포장재 재활용 함량',
    description: '포장에 재활용된 재질의 최소 함량 요구사항',
    keyRequirements: [
      '플라스틱: 2030년 30%, 2040년 50% 이상 재생 재질 사용',
      '목재/종이: 2030년부터 재생 재질 사용 의무',
      '금속: 재활용 함량 요구사항 미적용',
    ],
  },
  {
    id: 'article-2-4',
    chapter: 2,
    articleNumber: '2.4',
    title: '포장에 포함된 유해 물질 제한',
    description: '포장에 포함된 특정 유해 물질의 사용 금지 또는 제한',
    keyRequirements: [
      'SVHC(고관심물질) 함유 제한',
      '중금속(Pb, Cd, Hg, Cr6+) 함유 제한',
      '불소화 물질(PFAS) 함유 제한',
      '특정 프탈레이트 함유 제한',
    ],
  },
  {
    id: 'article-2-5',
    chapter: 2,
    articleNumber: '2.5',
    title: '인쇄 및 라벨링 재료',
    description: '포장의 인쇄 및 라벨링에 사용된 재료의 친환경성',
    keyRequirements: [
      '환경친화적 인쇄 방식 사용',
      '쉽게 제거 가능한 라벨 사용',
      '인쇄 및 코팅재의 환경성 확인',
    ],
  },

  // ==================== 제5장: 경제주체의 의무 ====================
  {
    id: 'article-5-1',
    chapter: 5,
    articleNumber: '5.1',
    title: '포장 설계 시 지속가능성 고려',
    description: '제조 단계에서 지속가능한 설계를 의무화',
    keyRequirements: [
      '포장 수명 주기 평가(LCA) 수행',
      '재활용성 및 재사용성 고려',
      '환경 영향 최소화 설계',
      '대체 재질 검토 의무',
    ],
  },
  {
    id: 'article-5-2',
    chapter: 5,
    articleNumber: '5.2',
    title: '포장 감량 전략',
    description: '경제주체의 포장 감량 달성 의무',
    keyRequirements: [
      '정기적 포장 감량 계획 수립',
      '감량 목표 설정 및 달성',
      '달성 현황 기록 및 보유',
      '증명 가능한 감량 증거 제시',
    ],
  },
  {
    id: 'article-5-3',
    chapter: 5,
    articleNumber: '5.3',
    title: '포장 재활용성 정보 제공',
    description: '소비자에게 포장의 재활용 가능성에 대한 정보 제공',
    keyRequirements: [
      '명확한 재활용 지침 표시',
      '포장 재질 구성 정보 공개',
      '올바른 분리배출 방법 안내',
      'QR 코드 등 추가 정보 제공 가능',
    ],
  },
  {
    id: 'article-5-4',
    chapter: 5,
    articleNumber: '5.4',
    title: '포장 재사용 시스템 구축',
    description: '재사용 가능한 포장 시스템의 도입 및 운영',
    keyRequirements: [
      '재사용 포장 시스템 설계',
      '소비자 참여 메커니즘',
      '회수 및 처리 프로세스',
      '시스템 효과성 모니터링',
    ],
  },

  // ==================== 제7장: 패키징 라벨링 ====================
  {
    id: 'article-7-1',
    chapter: 7,
    articleNumber: '7.1',
    title: '포장 재질 표시',
    description: '포장에 사용된 재질의 명확한 표시 의무',
    keyRequirements: [
      '포장 재질 명시 (예: PET, HDPE, 종이 등)',
      'ISO 1043 표준 준수',
      '눈에 띄는 위치에 표시',
      '최소 폰트 크기 준수',
    ],
  },
  {
    id: 'article-7-2',
    chapter: 7,
    articleNumber: '7.2',
    title: '분리배출 표시 및 지침',
    description: '소비자가 올바르게 분리배출할 수 있도록 하는 표시',
    keyRequirements: [
      '명확한 분류 기호 표시',
      '지역별 분리배출 방법 안내',
      '온라인 정보 링크 제공 가능',
      '다국어 표시 권장',
    ],
  },
  {
    id: 'article-7-3',
    chapter: 7,
    articleNumber: '7.3',
    title: '포장 재질 비율 표시',
    description: '포장에 포함된 각 재질의 비율 표시',
    keyRequirements: [
      '주요 재질의 무게 비율 표시',
      '재활용 재질 함량 표시',
      '수치 및 백분율 형식',
      '명확하고 가독성 있는 표시',
    ],
  },
  {
    id: 'article-7-4',
    chapter: 7,
    articleNumber: '7.4',
    title: '디지털 라벨 및 추가 정보',
    description: 'QR 코드, 웹사이트 등을 통한 추가 정보 제공',
    keyRequirements: [
      'QR 코드를 통한 상세 정보 제공',
      '제조사 웹사이트 링크 제공',
      '환경 정보 및 재활용 방법 안내',
      '다국어 정보 제공',
    ],
  },
];

export const ARTICLE_CHAPTERS = {
  2: {
    title: '포장 제조의 환경 책임 (지속가능성 요구사항)',
    description:
      '포장 제조 단계에서 환경 친화적 설계 및 재질 사용을 요구',
    articles: PPWR_ARTICLES.filter((a) => a.chapter === 2),
  },
  5: {
    title: '경제주체의 의무',
    description: '포장 제조업체가 이행해야 할 법적 의무사항',
    articles: PPWR_ARTICLES.filter((a) => a.chapter === 5),
  },
  7: {
    title: '패키징 정보 공개 및 라벨링',
    description: '소비자에게 제공해야 할 포장 정보',
    articles: PPWR_ARTICLES.filter((a) => a.chapter === 7),
  },
};
