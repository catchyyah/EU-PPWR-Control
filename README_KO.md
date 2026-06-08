# PPWR/ESPR 규제 모니터링 시스템

EU PPWR(Packaging and Packaging Waste Regulation)과 ESPR(Ecodesign for Sustainable Products Regulation) 규제에 대한 **자동 모니터링 및 기술 로드맵 시각화 시스템**입니다.

## 🎯 주요 기능

### 1. 규제 정보 자동 수집
- **EU Lex**: 공식 EU 규제 문서
- **뉴스 API**: 주요 언론사 기사 (NewsAPI)
- **한국 기관**: 환경공단, 화장품협회, KCL 등
- **자동 업데이트**: 3일마다 자동 수집

### 2. PPWR 주요 조항 분석
- **제2장**: 지속가능성 요구사항 (5개 조항)
- **제5장**: 경제주체의 의무 (4개 조항)
- **제7장**: 패키징 라벨링 (4개 조항)

### 3. 기술 로드맵 시각화
- **제품군별**: 펌프, 튜브, 용기, 색조
- **시간 범위**: 2025년 1월 ~ 2030년 12월 (월별)
- **타임라인 차트**: 조항별 대응 항목 시각화

### 4. 제품 정보 관리
- 회사별 제품 정보 입력
- 규정 준수 현황 추적
- 대응 일정 관리

## 📋 시스템 구조

```
ppwr-monitoring/
├── app/
│   ├── page.tsx              # 대시보드
│   ├── articles/             # 조항 분석
│   ├── roadmap/              # 로드맵
│   ├── products/             # 제품 정보
│   ├── regulations/          # 규제 정보
│   └── api/
│       ├── health            # 헬스 체크
│       ├── articles          # 조항 API
│       ├── regulations       # 규제 정보 API
│       └── roadmap           # 로드맵 API
├── lib/
│   ├── db/                   # 데이터베이스
│   ├── scrapers/             # 웹 스크래퍼
│   └── scheduler.ts          # 자동 스케줄러
└── package.json
```

## 🚀 시작하기

### 1. 설치

```bash
cd ~/ppwr-monitoring
npm install
```

### 2. 환경 변수 설정

```bash
cp .env.local.example .env.local
```

`.env.local` 파일에 다음을 입력:

```env
# NewsAPI (https://newsapi.org 에서 발급받기)
NEWS_API_KEY=your_api_key_here

# 선택사항: Google News API
GOOGLE_NEWS_API_KEY=your_google_api_key_here

NODE_ENV=development
```

### 3. 개발 서버 시작

```bash
npm run dev
```

브라우저에서 `http://localhost:3000` 열기

### 4. 프로덕션 빌드

```bash
npm run build
npm start
```

## 📖 사용 가이드

### 대시보드 (`/`)
- 시스템 상태 확인
- 최신 규제 정보 조회
- 로드맵 진행 상황 확인
- 빠른 메뉴

### 조항 분석 (`/articles`)
- PPWR 제2장, 5장, 7장 상세 분석
- 각 조항의 핵심 요구사항 조회
- 조항별 로드맵 링크

### 로드맵 (`/roadmap`)
- 제품군별 대응 타임라인
- 2025-2030년 월별 진행도
- 작업 상태 (예정/진행중/완료)
- 우선순위 표시

### 제품 정보 (`/products`)
- 회사 제품 등록
- 규정 준수 현황 관리
- 대응 일정 추적
- 통계 보기

### 규제 정보 (`/regulations`)
- 수집된 규제 정보 조회
- 지금 수집 버튼으로 수동 실행
- 소스별 필터링 (EU Lex, 뉴스, 한국 기관)

## 🔧 API 엔드포인트

### Health Check
```
GET /api/health
```

### 조항 조회
```
GET /api/articles              # 전체 조항
GET /api/articles?chapter=2    # 제2장
GET /api/articles?id=article-2-1  # 특정 조항
```

### 규제 정보
```
GET /api/regulations           # 저장된 규제 정보
GET /api/regulations?action=collect  # 지금 수집
POST /api/regulations          # 수집 실행
```

### 로드맵
```
GET /api/roadmap               # 전체 로드맵
GET /api/roadmap?product=펌프  # 특정 제품
```

## 🔄 자동화 설정

### 3일 주기 자동 수집
현재 수동 실행으로 설정되어 있습니다. 자동 실행으로 변경하려면:

**Vercel 배포 후:**
1. Vercel 대시보드에서 프로젝트 열기
2. Settings → Crons 메뉴
3. 다음 Cron 설정 추가:

```
GET /api/regulations?action=collect
0 2 * * * (매일 오전 2시)
```

**또는 로컬 서버에서:**
```typescript
// lib/scheduler.ts 수정
task.start();  // task.stop() 제거
```

## 📦 배포 (Vercel)

### 1. GitHub에 푸시

```bash
git add .
git commit -m "Initial PPWR monitoring system"
git push origin main
```

### 2. Vercel 배포

```bash
npm install -g vercel
vercel
```

### 3. 환경 변수 설정

Vercel 대시보드에서 Settings → Environment Variables 추가:
- `NEWS_API_KEY`
- `GOOGLE_NEWS_API_KEY`

### 4. Cron Jobs 설정 (선택사항)

Vercel의 Cron Triggers를 사용하여 3일마다 자동 실행:

```
GET /api/regulations?action=collect
Cron: 0 2 * * 1,4 (월요일, 목요일 오전 2시)
```

## 💾 데이터베이스

### SQLite (로컬)
- 파일: `./data.db`
- 스키마 자동 생성
- 로컬 개발용

### PostgreSQL (선택사항)
향후 배포 시 PostgreSQL로 마이그레이션 권장

```bash
npm install pg
```

## 📝 입력 데이터

### 초기화 필요 항목

1. **제품 정보** (`/products`)
   - 펌프, 튜브, 용기, 색조별 제품
   - 현재 포장 상태
   - 규정 준수 현황
   - 목표 완료 일정

2. **로드맵 커스터마이징** (`lib/db/roadmapData.ts`)
   - 회사별 구체적인 대응 일정
   - 우선순위 설정
   - 담당자 정보 (향후 추가)

## 🛠️ 개발 가이드

### 스택
- **Framework**: Next.js 14 + React
- **Language**: TypeScript
- **Database**: SQLite + Drizzle ORM
- **Styling**: Tailwind CSS
- **UI Components**: Lucide React
- **Web Scraping**: Cheerio, Axios
- **Scheduling**: node-cron
- **Visualization**: Recharts

### 새 페이지 추가

```bash
mkdir app/your-page
touch app/your-page/page.tsx
```

### 새 API 라우트 추가

```bash
mkdir app/api/your-endpoint
touch app/api/your-endpoint/route.ts
```

## 📞 API 키 발급

### NewsAPI (필수)
1. https://newsapi.org 접속
2. 회원가입
3. API Keys에서 키 발급
4. `.env.local`에 `NEWS_API_KEY` 추가

## 🐛 문제 해결

### 1. 뉴스 수집이 안 됨
- `NEWS_API_KEY` 환경 변수 확인
- API 요청 한도 초과 확인 (NewsAPI 무료는 100 요청/일)
- API 상태 페이지 확인

### 2. 스크래핑 실패
- 한국 기관 사이트 HTML 구조 변경 가능
- `lib/scrapers/koreanAgencies.ts`의 선택자 업데이트 필요
- User-Agent 헤더 추가됨

### 3. 빌드 오류
```bash
npm run build  # 전체 빌드
npm run lint   # Lint 확인
npm run type-check  # 타입 확인
```

## 📚 참고 자료

- [EU PPWR 공식 문서](https://eur-lex.europa.eu)
- [PPWR 요구사항 가이드](https://ec.europa.eu)
- [NewsAPI 문서](https://newsapi.org/docs)

## 📄 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다.

## 👤 작성자

연구개발그룹 연구기획자

## 🤝 기여

개선 사항이나 버그 리포트는 이슈로 등록해주세요.

---

**마지막 업데이트**: 2025년 6월 8일
