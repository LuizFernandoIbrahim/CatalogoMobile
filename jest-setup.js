// conexão
jest.mock('@react-native-community/netinfo', () => ({
  fetch: jest.fn(() => Promise.resolve({ isConnected: true })),
}));

// firebase
jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(),
  collection: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  getDocs: jest.fn(() => Promise.resolve({ empty: true, docs: [] })),
}));

// banco sql
jest.mock('expo-sqlite', () => ({
  openDatabaseAsync: jest.fn(),
}));

// biometria
jest.mock('expo-local-authentication', () => ({
  hasHardwareAsync: jest.fn(() => Promise.resolve(true)),
  isEnrolledAsync: jest.fn(() => Promise.resolve(true)),
  authenticateAsync: jest.fn(() => Promise.resolve({ success: true })),
}));

// clientes
jest.mock('./src/database/clientes', () => ({
  loginUser: jest.fn(),
  saveUser: jest.fn(),
  isBiometricsEnabled: jest.fn(() => Promise.resolve(true)),
  setBiometricsEnabled: jest.fn(),
  getLastUser: jest.fn(() => Promise.resolve({ id: '1', name: 'Maria', email: 'maria@email.com', isAdmin: 'false' })),
}));

jest.mock('@react-native-async-storage/async-storage', () => {
  return {
    setItem: jest.fn(() => Promise.resolve()),
    getItem: jest.fn(() => Promise.resolve(null)),
    removeItem: jest.fn(() => Promise.resolve()),
    clear: jest.fn(() => Promise.resolve()),
  };
});

// img
jest.mock('react-native/Libraries/Image/resolveAssetSource', () => () => ({ uri: 'asset' }));