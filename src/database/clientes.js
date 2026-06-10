import { getDatabase } from './banco';

const ADMIN_EMAIL = 'admin@loja.com';

async function getSetting(key) {
  const db = await getDatabase();
  const row = await db.getFirstAsync(
    'SELECT value FROM settings WHERE key = ?', [key]
  );
  return row?.value ?? null;
}

async function setSetting(key, value) {
  const db = await getDatabase();
  await db.runAsync(
    `INSERT INTO settings (key, value) VALUES (?, ?)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
    [key, value]
  );
}

function formatUser(row) {
  if (!row) return null;
  return { ...row, isAdmin: row.isAdmin === 1 };
}

export async function saveUser(userData) {
  const db = await getDatabase();

  const existing = await db.getFirstAsync(
    'SELECT id FROM users WHERE LOWER(email) = LOWER(?)',
    [userData.email]
  );
  if (existing) throw new Error('E-mail já cadastrado.');

  await db.runAsync(
    `INSERT INTO users (id, name, email, password, isAdmin, photo)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      Date.now().toString(),
      userData.name,
      userData.email,
      userData.password,
      userData.email === ADMIN_EMAIL ? 1 : 0,
      userData.photo || null,
    ]
  );
}

export async function loginUser(email, password) {
  const db = await getDatabase();

  const user = await db.getFirstAsync(
    'SELECT * FROM users WHERE LOWER(email) = LOWER(?) AND password = ?',
    [email, password]
  );
  if (!user) throw new Error('E-mail ou senha incorretos.');

  const safeUser = formatUser(user);
  await setSetting('current_user_id', user.id);
  await setSetting('last_user_id', user.id);
  return safeUser;
}

export async function getCurrentUser() {
  try {
    const userId = await getSetting('current_user_id');
    if (!userId) return null;
    const db = await getDatabase();
    const user = await db.getFirstAsync(
      'SELECT * FROM users WHERE id = ?', [userId]
    );
    return formatUser(user);
  } catch {
    return null;
  }
}

export async function getLastUser() {
  try {
    const current = await getCurrentUser();
    if (current) return current;
    const userId = await getSetting('last_user_id');
    if (!userId) return null;
    const db = await getDatabase();
    const user = await db.getFirstAsync(
      'SELECT * FROM users WHERE id = ?', [userId]
    );
    return formatUser(user);
  } catch {
    return null;
  }
}

export async function getUser() {
  return getCurrentUser();
}

export async function logoutUser() {
  try {
    const current = await getCurrentUser();
    if (current) await setSetting('last_user_id', current.id);
    await setSetting('current_user_id', null);
  } catch (e) {
    console.log('Erro ao fazer logout:', e);
  }
}

export async function removeUser() {
  return logoutUser();
}

export async function updateUserPhoto(userId, photoUri) {
  try {
    const db = await getDatabase();
    await db.runAsync(
      'UPDATE users SET photo = ? WHERE id = ?',
      [photoUri, userId]
    );
  } catch (e) {
    console.log('Erro ao atualizar foto:', e);
  }
}

export async function isBiometricsEnabled() {
  try {
    const value = await getSetting('biometrics_enabled');
    return value === 'true';
  } catch {
    return false;
  }
}

export async function setBiometricsEnabled(enabled) {
  try {
    await setSetting('biometrics_enabled', enabled ? 'true' : 'false');
  } catch (e) {
    console.log('Erro ao salvar biometria:', e);
  }
}
