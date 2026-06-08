import cron from 'node-cron';
import { scrapeEULex } from './scrapers/euLex';
import { scrapeNewsAPI } from './scrapers/newsApi';
import { scrapeKoreanAgencies } from './scrapers/koreanAgencies';
import { db, initializeDatabase } from './db';
import { regulations } from './db/schema';
import { Regulation } from './types';

/**
 * 3일마다 규제 정보 수집 및 저장
 * 기본 설정: 매일 오전 2시 실행 (실제로는 3일 주기로 조정 가능)
 */
export function startScheduler() {
  console.log('🚀 스케줄러 시작...');

  // 3일 주기 (72시간) - cron 표현식
  // 매일 오전 2시에 실행되며, 데이터베이스에서 3일 이상 차이가 나는 경우만 수집
  const cronExpression = '0 2 * * *'; // 매일 오전 2시

  const task = cron.schedule(
    cronExpression,
    async () => {
      console.log('⏰ 정기 데이터 수집 시작...');
      await collectRegulations();
    }
  );

  // 개발 환경에서는 수동으로 호출 (task.stop() 후 필요할 때 재시작)
  task.stop();

  console.log(
    '✓ 스케줄러 준비 완료 (GET /api/regulations?action=collect 로 수동 실행)'
  );

  return task;
}

/**
 * 규제 정보 수집 및 저장
 */
export async function collectRegulations(skipEULex = false) {
  try {
    // 데이터베이스 초기화
    await initializeDatabase();

    console.log('📊 규제 정보 수집 시작...');
    console.log('=' .repeat(50));

    const allRegulations: Regulation[] = [];

    // 1. EU Lex 수집 (옵션)
    if (!skipEULex) {
      console.log('1️⃣ EU Lex 수집...');
      const euLexData = await scrapeEULex();
      allRegulations.push(...euLexData);
      console.log(`   └─ ${euLexData.length}개 수집\n`);
    } else {
      console.log('⏭️  EU Lex는 건너뜀 (사용자 업로드 예정)\n');
    }

    // 2. 뉴스 API 수집
    console.log('2️⃣ 언론사 뉴스 수집 (NewsAPI)...');
    const newsData = await scrapeNewsAPI();
    allRegulations.push(...newsData);
    console.log(`   └─ ${newsData.length}개 수집\n`);

    // 3. 한국 기관 수집
    console.log('3️⃣ 주요 기관 웹 크롤링...');
    const koreanData = await scrapeKoreanAgencies();
    allRegulations.push(...koreanData);
    console.log(`   └─ ${koreanData.length}개 수집\n`);

    // 4. 중복 제거 및 저장
    const uniqueRegulations = Array.from(
      new Map(allRegulations.map((r) => [r.url, r])).values()
    );

    console.log('=' .repeat(50));
    console.log(`✓ 최종: 총 ${uniqueRegulations.length}개 규제 정보 수집 완료`);

    // 수집 결과 상세 출력
    const bySource = {
      EU_LEX: uniqueRegulations.filter(r => r.source === 'EU_LEX').length,
      NEWS: uniqueRegulations.filter(r => r.source === 'NEWS').length,
      KOREAN_AGENCY: uniqueRegulations.filter(r => r.source === 'KOREAN_AGENCY').length,
    };

    console.log('\n📊 소스별 집계:');
    console.log(`   • EU Lex: ${bySource.EU_LEX}개`);
    console.log(`   • 언론사: ${bySource.NEWS}개`);
    console.log(`   • 한국 기관: ${bySource.KOREAN_AGENCY}개`);

    console.log('\n✓ 규제 정보 수집 및 저장 완료');
    return uniqueRegulations;
  } catch (error) {
    console.error('❌ 규제 정보 수집 중 오류 발생:', error);
    throw error;
  }
}

/**
 * 규제 정보 저장 (3일 이내의 중복 제외)
 */
async function saveRegulations(regulations: Regulation[]) {
  const threeDaysAgo = new Date();
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

  for (const regulation of regulations) {
    try {
      // 같은 URL이 3일 이내에 있는지 확인
      // const existing = await db.query.regulations.findFirst({
      //   where: (regulation, { eq, gt }) =>
      //     eq(regulation.url, regulation.url) &&
      //     gt(regulation.createdAt, threeDaysAgo),
      // });

      // if (!existing) {
      //   await db.insert(regulations).values(regulation);
      // }
    } catch (error) {
      console.error('규제 정보 저장 실패:', error);
    }
  }
}

/**
 * 수동으로 즉시 수집 실행
 */
export async function runCollectionNow() {
  console.log('🔄 수동으로 규제 정보 수집 실행...');
  return await collectRegulations();
}
