import { sqliteTable, text, integer, primaryKey } from 'drizzle-orm/sqlite-core';

// 규제 정보 테이블
export const regulations = sqliteTable('regulations', {
  id: text('id').primaryKey(),
  source: text('source').notNull(), // 'EU_LEX' | 'NEWS' | 'KOREAN_AGENCY'
  title: text('title').notNull(),
  content: text('content').notNull(),
  url: text('url').notNull(),
  keywords: text('keywords').notNull(), // JSON 배열로 저장
  publishedAt: integer('published_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().defaultNow(),
});

// PPWR 조항 테이블
export const ppwrArticles = sqliteTable('ppwr_articles', {
  id: text('id').primaryKey(),
  chapter: integer('chapter').notNull(), // 2 | 5 | 7
  articleNumber: text('article_number').notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  keyRequirements: text('key_requirements').notNull(), // JSON 배열로 저장
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().defaultNow(),
});

// 로드맵 아이템 테이블
export const roadmapItems = sqliteTable('roadmap_items', {
  id: text('id').primaryKey(),
  productGroup: text('product_group').notNull(), // '펌프' | '튜브' | '용기' | '색조'
  articleId: text('article_id').notNull().references(() => ppwrArticles.id),
  task: text('task').notNull(),
  startMonth: text('start_month').notNull(), // '2025-01'
  endMonth: text('end_month').notNull(),
  status: text('status').notNull().default('planned'), // 'planned' | 'in_progress' | 'completed'
  notes: text('notes'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().defaultNow(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().defaultNow(),
});

// 제품 정보 테이블 (사용자 입력)
export const productInfos = sqliteTable('product_infos', {
  id: text('id').primaryKey(),
  productGroup: text('product_group').notNull(), // '펌프' | '튜브' | '용기' | '색조'
  productName: text('product_name').notNull(),
  currentState: text('current_state').notNull(),
  currentComplianceStatus: text('current_compliance_status').notNull(),
  targetComplianceDate: text('target_compliance_date').notNull(),
  notes: text('notes'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().defaultNow(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().defaultNow(),
});
