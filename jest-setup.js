// conexão
jest.mock('@react-native-community/netinfo', () => ({
  fetch: jest.fn(() => Promise.resolve({ isConnected: true })),
}));

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

jest.mock('expo-sqlite', () => ({
  openDatabaseAsync: jest.fn(),
}));

jest.mock('expo-local-authentication', () => ({
  hasHardwareAsync: jest.fn(() => Promise.resolve(true)),
  isEnrolledAsync: jest.fn(() => Promise.resolve(true)),
  authenticateAsync: jest.fn(() => Promise.resolve({ success: true })),
}));

jest.mock('./src/database/clientes', () => ({
  loginUser: jest.fn(),
  saveUser: jest.fn(),
  isBiometricsEnabled: jest.fn(() => Promise.resolve(true)),
  setBiometricsEnabled: jest.fn(),
  getLastUser: jest.fn(() => Promise.resolve({ id: '1', name: 'Maria', email: 'maria@email.com', isAdmin: 'false' })),
}));

jest.mock('react-native/Libraries/Image/resolveAssetSource', () => () => ({ uri: 'asset' }));