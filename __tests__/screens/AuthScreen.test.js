import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import AuthScreen from '../../src/screens/AuthScreen';

describe('Tela de Autenticação (AuthScreen)', () => {
  it('deve renderizar os elementos básicos da tela de login', async () => {
    const { getByPlaceholderText, getByText } = render(<AuthScreen onLogin={() => {}} />);

    await waitFor(() => {
      expect(getByText('Oficina de Marias')).toBeTruthy();
    });

    expect(getByText('Bem-vindo à nossa loja!')).toBeTruthy();
    expect(getByPlaceholderText('E-mail')).toBeTruthy();
    expect(getByPlaceholderText('Senha')).toBeTruthy();
  });

  it('deve alternar para o modo de cadastro quando clicar no botão de alternância', async () => {
    const { getByText, getByPlaceholderText, queryByPlaceholderText } = render(
      <AuthScreen onLogin={() => {}} />
    );

    await waitFor(() => {
      expect(queryByPlaceholderText('Nome completo')).toBeNull();
    });

    // Clica no link para ir para o cadastro
    const switchBtn = getByText('Não tem conta? Cadastre-se');
    fireEvent.press(switchBtn);

    await waitFor(() => {
      expect(getByText('Crie sua conta')).toBeTruthy();
      expect(getByPlaceholderText('Nome completo')).toBeTruthy();
    });
  });
});