import React, { useState, useEffect } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TelaLogin from "./src/telas/TelaLogin";
import TelaProdutos from "./src/telas/TelaProdutos";
import TelaDetalhesProduto from "./src/telas/TelaDetalhesProduto";
import { obterToken, removerToken } from "./src/servicos/servicoArmazenamento";
import api from "./src/api/axiosConfig";
import NomeDaRotaBusca from "./src/telas/TelaBuscaProdutos";

const Pilha = createNativeStackNavigator();

export default function App() {
  const [autenticado, setAutenticado] = useState<boolean | null>(null);
  const [carregandoInicial, setCarregandoInicial] = useState(true);

  useEffect(() => {
    const verificarAutenticacao = async () => {
      const token = await obterToken();
      if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        setAutenticado(true);
      } else {
        setAutenticado(false);
      }
      setCarregandoInicial(false);
    };
    verificarAutenticacao();
  }, []);

  const lidarComLogout = async () => {
    await removerToken();
    delete api.defaults.headers.common["Authorization"];
    setAutenticado(false);
  };

  if (carregandoInicial) {
    return (
      <View style={estilos.containerCentral}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Pilha.Navigator screenOptions={{ headerShown: false }}>
        {autenticado ? (
          <Pilha.Group>
            <Pilha.Screen name="Produtos" options={{ title: "Lista de Produtos" }}>
              {(props) => <TelaProdutos {...props} aoLogout={lidarComLogout} />}
            </Pilha.Screen>
            <Pilha.Screen name="DetalhesProduto" options={{ title: "Detalhes do Produto" }}>
              {(props: any) => <TelaDetalhesProduto {...props} />}
            </Pilha.Screen>

            <Pilha.Screen name="BuscaProduto" options={{ title: "Busca" }}>
              {(props: any) => <NomeDaRotaBusca {...props} />}
            </Pilha.Screen>
            <Pilha.Screen name="Admin" options={{ title: "Admin" }}>
              {(props: any) => <TelaDetalhesProduto {...props} />}
            </Pilha.Screen>
          </Pilha.Group>
        ) : (
          <Pilha.Group>
            <Pilha.Screen name="Login" options={{ title: "Entrar" }}>
              {(props) => <TelaLogin {...props} aoLoginSucesso={() => setAutenticado(true)} />}
            </Pilha.Screen>
          </Pilha.Group>
        )}
      </Pilha.Navigator>
    </NavigationContainer>
  );
}

const estilos = StyleSheet.create({
  containerCentral: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});