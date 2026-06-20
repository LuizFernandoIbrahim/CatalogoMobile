import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import CatalogScreen from '../../src/screens/CatalogScreen';

// useFocusEffect roda o callback assim que o componente é focado;
// em testes não há navegação real, então simulamos isso chamando o callback direto.
jest.mock('@react-navigation/native', () => ({
  useFocusEffect: (callback) => {
    const React = require('react');
    React.useEffect(() => {
      callback();
    }, []);
  },
}));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

const mockGetProducts = jest.fn();
const mockSincronizarComFirebase = jest.fn();

jest.mock('../../src/database/catalogo', () => ({
  getProducts: (...args) => mockGetProducts(...args),
  sincronizarComFirebase: (...args) => mockSincronizarComFirebase(...args),
}));

const PRODUTOS_MOCK = [
  { id: '1', name: 'Tapete de Crochê Redondo', category: 'Decoração', price: 49.9, photo: null },
  { id: '2', name: 'Bolsa Nova', category: 'Uso Pessoal', price: 12.9, photo: null },
];

function renderCatalogScreen() {
  const navigation = { navigate: jest.fn() };
  const utils = render(<CatalogScreen navigation={navigation} />);
  return { ...utils, navigation };
}

describe('Tela de Catálogo (CatalogScreen)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetProducts.mockResolvedValue(PRODUTOS_MOCK);
    mockSincronizarComFirebase.mockResolvedValue();
  });

  it('deve exibir o título da tela e a barra de pesquisa', async () => {
    const { getByText, getByPlaceholderText } = renderCatalogScreen();

    expect(getByText('Catálogo')).toBeTruthy();
    expect(getByPlaceholderText('Buscar produto...')).toBeTruthy();

    await waitFor(() => expect(mockGetProducts).toHaveBeenCalled());
  });

  it('deve listar os produtos vindos do banco local ao focar a tela', async () => {
    const { getByText } = renderCatalogScreen();

    await waitFor(() => {
      expect(getByText('Tapete de Crochê Redondo')).toBeTruthy();
      expect(getByText('Bolsa Nova')).toBeTruthy();
    });
  });

  it('deve chamar sincronizarComFirebase ao focar a tela (inicializarDados)', async () => {
    renderCatalogScreen();

    await waitFor(() => {
      expect(mockSincronizarComFirebase).toHaveBeenCalledTimes(1);
    });
  });

  it('deve continuar exibindo o cache local mesmo se a sincronização falhar', async () => {
    mockSincronizarComFirebase.mockRejectedValue(new Error('Sem conexão'));

    const { getByText } = renderCatalogScreen();

    await waitFor(() => {
      expect(getByText('Tapete de Crochê Redondo')).toBeTruthy();
    });
  });

  it('deve filtrar produtos pelo texto digitado na busca', async () => {
    const { getByPlaceholderText, getByText, queryByText } = renderCatalogScreen();

    await waitFor(() => expect(getByText('Bolsa Nova')).toBeTruthy());

    fireEvent.changeText(getByPlaceholderText('Buscar produto...'), 'Tapete');

    await waitFor(() => {
      expect(getByText('Tapete de Crochê Redondo')).toBeTruthy();
      expect(queryByText('Bolsa Nova')).toBeNull();
    });
  });

  it('deve filtrar produtos pela categoria selecionada', async () => {
    const { getByText, getAllByText, queryByText } = renderCatalogScreen();

    await waitFor(() => expect(getByText('Bolsa Nova')).toBeTruthy());

    // "Uso Pessoal" aparece duas vezes: como chip de filtro e como badge
    // dentro do card do produto. O chip é o primeiro elemento na árvore.
    const usoPessoalChip = getAllByText('Uso Pessoal')[0];
    fireEvent.press(usoPessoalChip);

    await waitFor(() => {
      expect(getByText('Bolsa Nova')).toBeTruthy();
      expect(queryByText('Tapete de Crochê Redondo')).toBeNull();
    });
  });

  it('deve exibir mensagem de lista vazia quando nenhum produto local existe', async () => {
    mockGetProducts.mockResolvedValue([]);

    const { getByText } = renderCatalogScreen();

    await waitFor(() => {
      expect(getByText('Nenhum produto encontrado.')).toBeTruthy();
    });
  });

  it('deve navegar para o detalhe do produto ao tocar em um item da lista', async () => {
    const { getByText, navigation } = renderCatalogScreen();

    await waitFor(() => expect(getByText('Bolsa Nova')).toBeTruthy());
    fireEvent.press(getByText('Bolsa Nova'));

    expect(navigation.navigate).toHaveBeenCalledWith(
      'ProductDetail',
      { product: PRODUTOS_MOCK[1] }
    );
  });
});
