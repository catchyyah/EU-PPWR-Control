import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data.db');
const sqlite = new Database(dbPath);
export const db = drizzle(sqlite, { schema });

// 데이터베이스 초기화
export async function initializeDatabase() {
  try {
    // 테이블 생성 (이미 있으면 무시)
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS regulations (
        id TEXT PRIMARY KEY,
        source TEXT NOT NULL,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        url TEXT NOT NULL,
        keywords TEXT NOT NULL,
        published_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        created_at INTEGER NOT NULL DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS ppwr_articles (
        id TEXT PRIMARY KEY,
        chapter INTEGER NOT NULL,
        article_number TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        key_requirements TEXT NOT NULL,
        created_at INTEGER NOT NULL DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS roadmap_items (
        id TEXT PRIMARY KEY,
        product_group TEXT NOT NULL,
        article_id TEXT NOT NULL,
        task TEXT NOT NULL,
        start_month TEXT NOT NULL,
        end_month TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'planned',
        notes TEXT,
        created_at INTEGER NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at INTEGER NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (article_id) REFERENCES ppwr_articles(id)
      );

      CREATE TABLE IF NOT EXISTS product_infos (
        id TEXT PRIMARY KEY,
        product_group TEXT NOT NULL,
        product_name TEXT NOT NULL,
        current_state TEXT NOT NULL,
        current_compliance_status TEXT NOT NULL,
        target_compliance_date TEXT NOT NULL,
        notes TEXT,
        created_at INTEGER NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at INTEGER NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('✓ Database initialized');
  } catch (error) {
    console.error('✗ Database initialization failed:', error);
    throw error;
  }
}
