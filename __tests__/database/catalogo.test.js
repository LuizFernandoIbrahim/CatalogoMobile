import { getProducts, sincronizarComFirebase } from '../../src/database/catalogo';

// Mock do banco local — simula runAsync (INSERT/DELETE) e getAllAsync (SELECT)
const mockRunAsync = jest.fn().mockResolvedValue({});
const mockGetAllAsync = jest.fn().mockResolvedValue([
  { id: '1', name: 'Tapete de Crochê', price: 49.90 }
]);

jest.mock('../../src/database/banco', () => ({
  getDatabase: jest.fn(() => Promise.resolve({
    runAsync: (...args) => mockRunAsync(...args),
    getAllAsync: (...args) => mockGetAllAsync(...args),
  }))
}));

// Mock do NetInfo — controla se o dispositivo está "online" ou "offline" em cada teste
const mockNetInfoFetch = jest.fn();
jest.mock('@react-native-community/netinfo', () => ({
  fetch: () => mockNetInfoFetch(),
}));

// Mock do Firestore — simula getDocs retornando documentos da coleção "produtos"
const mockGetDocs = jest.fn();
jest.mock('firebase/firestore', () => ({
  collection: jest.fn(() => 'produtos-ref'),
  getDocs: (...args) => mockGetDocs(...args),
  doc: jest.fn(),
  setDoc: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
}));

jest.mock('../../src/database/firebase', () => ({
  dbFirestore: {},
}));

function criarSnapshot(produtos) {
  return {
    size: produtos.length,
    docs: produtos.map((p) => ({
      id: p.id,
      data: () => p.dados,
    })),
  };
}

describe('Camada de Dados - Catálogo', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetAllAsync.mockResolvedValue([
      { id: '1', name: 'Tapete de Crochê', price: 49.90 }
    ]);
  });

  it('deve buscar os produtos locais ordenados por nome com sucesso', async () => {
    const produtos = await getProducts();

    expect(Array.isArray(produtos)).toBe(true);
    expect(produtos.length).toBe(1);
    expect(produtos[0].name).toBe('Tapete de Crochê');
  });

  it('não deve consultar o Firebase quando o dispositivo está offline', async () => {
    mockNetInfoFetch.mockResolvedValue({ isConnected: false });

    await sincronizarComFirebase();

    // getDocs (Firestore) não deve ser chamado; runAsync ainda roda por causa
    // do ALTER TABLE de atualizarEstruturaTabela, que independe de conexão
    expect(mockGetDocs).not.toHaveBeenCalled();
    expect(mockRunAsync).toHaveBeenCalledWith(
      expect.stringContaining('ALTER TABLE products')
    );
    expect(mockRunAsync).not.toHaveBeenCalledWith(
      expect.stringContaining('INSERT OR REPLACE'),
      expect.anything()
    );
  });

  it('deve buscar TODOS os documentos da coleção, sem filtrar por updatedAt', async () => {
    mockNetInfoFetch.mockResolvedValue({ isConnected: true });
    mockGetDocs.mockResolvedValue(criarSnapshot([
      { id: '1', dados: { name: 'Tapete de Crochê', price: 49.90, updatedAt: 0 } },
    ]));

    await sincronizarComFirebase();

    // getDocs deve ser chamado com a referência da coleção direto,
    // sem um segundo argumento de "query" com filtro where(updatedAt > x)
    expect(mockGetDocs).toHaveBeenCalledWith('produtos-ref');
  });

  it('deve gravar no SQLite local mesmo quando updatedAt do documento é 0 ou ausente', async () => {
    mockNetInfoFetch.mockResolvedValue({ isConnected: true });
    mockGetDocs.mockResolvedValue(criarSnapshot([
      { id: '2', dados: { name: 'Editado direto no console', price: 10, updatedAt: 0 } },
    ]));

    await sincronizarComFirebase();

    expect(mockRunAsync).toHaveBeenCalledWith(
      expect.stringContaining('INSERT OR REPLACE INTO products'),
      expect.arrayContaining(['2', 'Editado direto no console'])
    );
  });

  it('deve remover localmente produtos que não existem mais na nuvem', async () => {
    mockNetInfoFetch.mockResolvedValue({ isConnected: true });
    mockGetDocs.mockResolvedValue(criarSnapshot([
      { id: '1', dados: { name: 'Tapete de Crochê', price: 49.90, updatedAt: 0 } },
    ]));

    await sincronizarComFirebase();

    expect(mockRunAsync).toHaveBeenCalledWith(
      expect.stringContaining('DELETE FROM products WHERE id NOT IN'),
      ['1']
    );
  });

  it('deve apagar todos os produtos locais quando a coleção remota está vazia', async () => {
    mockNetInfoFetch.mockResolvedValue({ isConnected: true });
    mockGetDocs.mockResolvedValue(criarSnapshot([]));

    await sincronizarComFirebase();

    expect(mockRunAsync).toHaveBeenCalledWith('DELETE FROM products');
  });
});