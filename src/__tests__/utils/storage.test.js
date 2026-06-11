import AsyncStorage from '@react-native-async-storage/async-storage';

// Criamos uma função fictícia baseada no que seu AuthScreen usa
async function salvarTokenLocal(chave, valor) {
  await AsyncStorage.setItem(chave, valor);
  return true;
}

describe('Utilitários - Armazenamento Local (Storage)', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('1. Deve salvar um dado no AsyncStorage com sucesso', async () => {
    const sucesso = await salvarTokenLocal('user_session', 'token123');
    
    expect(sucesso).toBe(true);
    const valorSalvo = await AsyncStorage.getItem('user_session');
    expect(valorSalvo).toBe('token123');
  });
});