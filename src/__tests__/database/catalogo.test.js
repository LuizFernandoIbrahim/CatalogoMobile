import { getProducts } from '../../database/catalogo';

// Simulamos o retorno do módulo auxiliar de banco para não abrir conexões reais
jest.mock('../../database/banco', () => ({
  getDatabase: jest.fn(() => Promise.resolve({
    runAsync: jest.fn().mockResolvedValue({}),
    getAllAsync: jest.fn().mockResolvedValue([
      { id: '1', name: 'Tapete de Crochê', price: 49.90 }
    ])
  }))
}));

describe('Camada de Dados - Catálogo', () => {
  it('deve buscar os produtos locais ordenados por nome com sucesso', async () => {
    const produtos = await getProducts();
    
    expect(Array.isArray(produtos)).toBe(true);
    expect(produtos.length).toBe(1);
    expect(produtos[0].name).toBe('Tapete de Crochê');
  });
});