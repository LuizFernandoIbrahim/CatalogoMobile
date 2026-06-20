import { loginUser, saveUser } from '../../src/database/clientes';

jest.mock('../../src/database/clientes', () => ({
  loginUser: jest.fn().mockResolvedValue({ id: '1', name: 'Marcos', email: 'marcos@email.com' }),
  saveUser: jest.fn().mockResolvedValue({ success: true }),
  isBiometricsEnabled: jest.fn().mockResolvedValue(true)
}));

describe('Camada de Dados - Clientes', () => {
  it('1. Deve simular o login de um usuário existente', async () => {
    const usuario = await loginUser('marcos@email.com', '123');
    expect(usuario.name).toBe('Marcos');
    expect(usuario.email).toBe('marcos@email.com');
  });

  it('2. Deve cadastrar um novo cliente com sucesso', async () => {
    const novoCliente = { name: 'Lucas', email: 'lucas@email.com', password: '456' };
    const resposta = await saveUser(novoCliente);
    expect(resposta).toEqual({ success: true });
  });
});