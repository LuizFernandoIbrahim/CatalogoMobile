import * as SQLite from 'expo-sqlite';

let database = null;

const PRODUTOS_INICIAIS = [
  {
    id: '1',
    name: 'Tapete de Crochê Redondo',
    description: 'Tapete artesanal feito à mão com fio 100% algodão.',
    price: 89.90,
    category: 'Crochê',
    photo: null,
  },
  {
    id: '2',
    name: 'Cesto Organizador',
    description: 'Cesto trançado em fibra natural, ideal para organizar o lar.',
    price: 65.00,
    category: 'Cestaria',
    photo: null,
  },
  {
    id: '3',
    name: 'Vaso de Macramê',
    description: 'Vaso suspenso em macramê, perfeito para plantas pequenas.',
    price: 45.00,
    category: 'Macramê',
    photo: null,
  },
  {
    id: '4',
    name: 'Almofada Bordada',
    description: 'Almofada com bordado floral feito à mão, enchimento incluso.',
    price: 120.00,
    category: 'Bordado',
    photo: null,
  },
  {
    id: '5',
    name: 'Porta-retratos de Palha',
    description: 'Porta-retratos artesanal trançado em palha natural.',
    price: 38.50,
    category: 'Outros',
    photo: null,
  },
];

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

  await inserirProdutosIniciais(database);

  return database;
}

async function inserirProdutosIniciais(db) {
  const existentes = await db.getFirstAsync(
    'SELECT COUNT(*) as total FROM products'
  );
  console.log('📦 Produtos no banco:', existentes.total);

  if (existentes.total > 0) {
    console.log('ℹ️ Seed ignorado — banco já tem produtos');
    return;
  }

  for (const produto of PRODUTOS_INICIAIS) {
    await db.runAsync(
      `INSERT INTO products (id, name, description, price, category, photo)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        produto.id,
        produto.name,
        produto.description,
        produto.price,
        produto.category,
        produto.photo,
      ]
    );
  }
  console.log('🌱 Produtos iniciais inseridos com sucesso');
}