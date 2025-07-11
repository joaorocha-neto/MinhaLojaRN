import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import TelaLogin from './src/telas/TelaLogin';
import TelaProdutos from './src/telas/TelaProdutos';
import { obterToken, removerToken } from './src/servicos/servicoArmazenamento';
import api from './src/api/axiosConfig';

export default function App() {
  const [autenticado, setAutenticado] = useState<boolean | null>(null); // null = verificando
  const [carregandoInicial, setCarregandoInicial] = useState(true);

  useEffect(() => {
    const verificarAutenticacao = async () => {
      const token = await obterToken();
      if (token) {
        // Configura o cabeçalho de autorização padrão do Axios
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setAutenticado(true);
      } else {
        setAutenticado(false);
      }
      setCarregandoInicial(false);
    };
    verificarAutenticacao();
    // O interceptor de resposta já foi configurado em axiosConfig.ts
    // Ele lidará com erros 401 e removerá o token.
    // Você pode querer adicionar um listener aqui ou um contexto para reagir ao logout forçado.
  }, []);

  const lidarComLogout = async () => {
    await removerToken();
    delete api.defaults.headers.common['Authorization']; // Remove o token do Axios
    setAutenticado(false);
  };

  if (carregandoInicial) {
    return (
      <View style={estilos.containerCentral}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (autenticado) {
    return <TelaProdutos aoLogout={lidarComLogout} />;
  } else {
    return <TelaLogin aoLoginSucesso={() => setAutenticado(true)} />;
  }
}

const estilos = StyleSheet.create({
  containerCentral: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});