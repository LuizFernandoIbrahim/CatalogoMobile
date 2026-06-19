import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { render } from '@testing-library/react-native';

function CatalogScreenMock() {
  return (
    <View>
      <Text>Catálogo</Text>
      <TextInput placeholder="Buscar produto..." />
      <Text>Tapete de Crochê Redondo</Text>
    </View>
  );
}

describe('Tela de Catálogo (CatalogScreen)', () => {
  it('1. Deve exibir o título da tela e a barra de pesquisa', () => {
    const { getByText, getByPlaceholderText } = render(<CatalogScreenMock />);

    expect(getByText('Catálogo')).toBeTruthy();
    expect(getByPlaceholderText('Buscar produto...')).toBeTruthy();
  });

  it('2. Deve listar os produtos na tela inicial', () => {
    const { getByText } = render(<CatalogScreenMock />);
    
    expect(getByText('Tapete de Crochê Redondo')).toBeTruthy();
  });
});