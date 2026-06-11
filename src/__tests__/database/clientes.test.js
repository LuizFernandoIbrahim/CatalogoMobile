import { loginUser, saveUser } from '../../database/clientes';

const mockRunAsync = jest.fn().mockResolvedValue({});
const mockGetFirstAsync = jest.fn();

jest.mock('../../database/banco', () => ({
  getDatabase: jest.fn(() => Promise.resolve({
    runAsync: mockRunAsync,
    getFirstAsync: mockGetFirstAsync
  }))
}));

describe('Camada de Dados - Clientes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('1. Deve simular o login de um usuário existente', async () => {
    mockGetFirstAsync.mockResolvedValue({
      id: '1',
      name: 'Marcos',
      email: 'marcos@email.com',
      password: '123'
    });

    const usuario = await loginUser('marcos@email.com', '123');
    
    expect(usuario.name).toBe('Marcos');
    expect(mockGetFirstAsync).toHaveBeenCalledWith(
      'SELECT * FROM users WHERE LOWER(email) = LOWER(?) AND password = ?',
      ['marcos@email.com', '123']
    );
  });

  it('2. Deve cadastrar um novo cliente com sucesso', async () => {
    // Simulamos que o banco retornou undefined (e-mail livre para cadastro)
    mockGetFirstAsync.mockResolvedValue(undefined); 
    
    const novoCliente = { name: 'Lucas', email: 'lucas@email.com', password: '456' };
    await saveUser(novoCliente);

    expect(mockRunAsync).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO users'),
      expect.arrayContaining(['Lucas', 'lucas@email.com', '456'])
    );
  });
});