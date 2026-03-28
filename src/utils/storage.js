import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  USERS: '@users',
  CURRENT_USER: '@user',
  LAST_USER: '@last_user',
  BIOMETRICS_ENABLED: '@biometrics_enabled',
  PRODUCTS: '@products',
};

function toBoolean(value) {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (normalized === 'true' || normalized === '1') return true;
    if (normalized === 'false' || normalized === '0' || normalized === '') return false;
  }
  if (typeof value === 'number') return value === 1;
  return false;
}


export async function saveUser(userData) {
  try {
    const users = await getAllUsers();
    const alreadyExists = users.find(
      (u) => u.email.toLowerCase() === userData.email.toLowerCase()
    );
    if (alreadyExists) throw new Error('E-mail já cadastrado.');
    const newUser = {
      ...userData,
      id: Date.now().toString(),
      isAdmin: userData.email === 'admin@loja.com',
    };
    await AsyncStorage.setItem(KEYS.USERS, JSON.stringify([...users, newUser]));
    return newUser;
  } catch (error) {
    throw error;
  }
}

export async function loginUser(email, password) {
  const users = await getAllUsers();
  const found = users.find(
    (u) =>
      u.email.toLowerCase() === email.toLowerCase() &&
      u.password === password
  );
  if (!found) throw new Error('E-mail ou senha incorretos.');
  const safeUser = { ...found, isAdmin: toBoolean(found.isAdmin) };
  await AsyncStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(safeUser));
  await AsyncStorage.setItem(KEYS.LAST_USER, JSON.stringify(safeUser));
  return safeUser;
}

export async function getCurrentUser() {
  try {
    const data = await AsyncStorage.getItem(KEYS.CURRENT_USER);
    if (!data) return null;
    const parsed = JSON.parse(data);
    return { ...parsed, isAdmin: toBoolean(parsed.isAdmin) };
  } catch {
    return null;
  }
}

export async function getLastUser() {
  try {
    const current = await getCurrentUser();
    if (current) return current;
    const data = await AsyncStorage.getItem(KEYS.LAST_USER);
    if (!data) return null;
    const parsed = JSON.parse(data);
    return { ...parsed, isAdmin: toBoolean(parsed.isAdmin) };
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
    if (current) {
      await AsyncStorage.setItem(KEYS.LAST_USER, JSON.stringify(current));
    }
    await AsyncStorage.removeItem(KEYS.CURRENT_USER);
  } catch (error) {
    console.log('Erro ao fazer logout:', error);
  }
}

export async function removeUser() {
  return logoutUser();
}

async function getAllUsers() {
  try {
    const data = await AsyncStorage.getItem(KEYS.USERS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export async function updateUserPhoto(userId, photoUri) {
  try {
    const user = await getCurrentUser();
    if (user) {
      const updated = { ...user, photo: photoUri };
      await AsyncStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(updated));
      await AsyncStorage.setItem(KEYS.LAST_USER, JSON.stringify(updated));
      const users = await getAllUsers();
      const updatedUsers = users.map((u) =>
        u.id === userId ? { ...u, photo: photoUri } : u
      );
      await AsyncStorage.setItem(KEYS.USERS, JSON.stringify(updatedUsers));
    }
  } catch (error) {
    console.log('Erro ao atualizar foto:', error);
  }
}


export async function setBiometricsEnabled(enabled) {
  try {
    await AsyncStorage.setItem(KEYS.BIOMETRICS_ENABLED, String(toBoolean(enabled)));
  } catch (error) {
    console.log('Erro ao salvar biometria:', error);
  }
}

export async function isBiometricsEnabled() {
  try {
    const data = await AsyncStorage.getItem(KEYS.BIOMETRICS_ENABLED);
    if (data === null) return false;
    return toBoolean(data);
  } catch {
    return false;
  }
}

export async function getProducts() {
  try {
    const data = await AsyncStorage.getItem(KEYS.PRODUCTS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export async function saveProduct(product) {
  try {
    const products = await getProducts();
    const newProduct = { ...product, id: Date.now().toString() };
    await AsyncStorage.setItem(KEYS.PRODUCTS, JSON.stringify([...products, newProduct]));
  } catch (error) {
    console.log('Erro ao salvar produto:', error);
  }
}

export async function updateProduct(updatedProduct) {
  try {
    const products = await getProducts();
    const updated = products.map((p) =>
      p.id === updatedProduct.id ? updatedProduct : p
    );
    await AsyncStorage.setItem(KEYS.PRODUCTS, JSON.stringify(updated));
  } catch (error) {
    console.log('Erro ao atualizar produto:', error);
  }
}

export async function deleteProduct(id) {
  try {
    const products = await getProducts();
    const filtered = products.filter((p) => p.id !== id);
    await AsyncStorage.setItem(KEYS.PRODUCTS, JSON.stringify(filtered));
  } catch (error) {
    console.log('Erro ao deletar produto:', error);
  }
}