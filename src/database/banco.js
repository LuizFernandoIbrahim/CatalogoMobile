import * as SQLite from 'expo-sqlite';

let database = null;

export async function getDatabase() {
  if (database) return database;

  database = await SQLite.openDatabaseAsync('oficina.db');
  console.log('✅ Banco oficina.db aberto com sucesso');

  await database.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS users (
      id       TEXT PRIMARY KEY,
      name     TEXT NOT NULL,
      email    TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      isAdmin  INTEGER NOT NULL DEFAULT 0,
      photo    TEXT
    );

    CREATE TABLE IF NOT EXISTS products (
      id          TEXT PRIMARY KEY,
      name        TEXT NOT NULL,
      description TEXT,
      price       REAL NOT NULL DEFAULT 0,
      category    TEXT,
      photo       TEXT
    );

    CREATE TABLE IF NOT EXISTS settings (
      key   TEXT PRIMARY KEY,
      value TEXT
    );
  `);
  console.log('✅ Tabelas criadas/verificadas');

  return database;
}