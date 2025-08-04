import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ToastAndroid,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { obterProdutoPorId, obterTodosProdutos } from "../servicos/servicoProdutos";
import { ProdutoAPI } from "../tipos/api";

interface TelaProdutosProps {
  aoLogout: () => void;
}

export default function TelaAdmin({ aoLogout }: TelaProdutosProps) {
  const navegacao = useNavigation();
  const [listaProdutos, setListaProdutos] = useState<ProdutoAPI[]>([]);
  const [produtosFiltrados, setProdutosFiltrados] = useState<ProdutoAPI[]>([]);
  const [carregandoProdutos, setCarregandoProdutos] = useState(true);
  const [mensagemErro, setMensagemErro] = useState('');
  const [termoBusca, setTermoBusca] = useState('');

  useEffect(() => {
    const carregarProdutos = async () => {
      setCarregandoProdutos(true);
      setMensagemErro('');
      try {
        const produtos = await obterTodosProdutos();
        setListaProdutos(produtos);
        setProdutosFiltrados(produtos); 
      } catch (erro: any) {
        setMensagemErro(erro.message || 'Não foi possível carregar os produtos.');
        if (erro.message.includes('Sessão expirada')) {
          aoLogout();
        }
      } finally {
        setCarregandoProdutos(false);
      }
    };
    carregarProdutos();
  }, [aoLogout]);

  useEffect(() => {
    if (termoBusca === '') {
      setProdutosFiltrados(listaProdutos);
    } else {
      const produtosEncontrados = listaProdutos.filter((produto) =>
        produto.title.toLowerCase().includes(termoBusca.toLowerCase()) ||
        produto.category.toLowerCase().includes(termoBusca.toLowerCase())
      ); 
      setProdutosFiltrados(produtosEncontrados);
    }
  }, [termoBusca, listaProdutos]);

  useEffect(() => {
      const produtosEncontrados = listaProdutos.filter((produto) =>
        produto.title.toLowerCase().includes(termoBusca.toLowerCase()) ||
        produto.category.toLowerCase().includes(termoBusca.toLowerCase())
      );
  
      setProdutosFiltrados(produtosEncontrados);
  
      if (termoBusca !== '' && produtosEncontrados.length === 0) {
        ToastAndroid.show(`Nenhum resultado encontrado para "${termoBusca}"`, ToastAndroid.SHORT);
      }
    }, [termoBusca, listaProdutos]);

  const excluir = async (id: number) => {
    try {
        await fetch(`https://fakestoreapi.com/products/${id}`, {
            method: 'DELETE',
          });

        setListaProdutos(listaProdutos.filter(produto => produto.id !== id));
    } catch (error) {
        console.error("Erro ao excluir produto: ", error);
    }
  };


  const renderizarItemProduto = ({ item }: { item: ProdutoAPI }) => (
    <View
      style={estilos.itemProduto}
    >
      <Image source={{ uri: item.image }} style={estilos.imagemProduto} />
      <View style={estilos.detalhesProduto}>
        <Text style={estilos.tituloProduto}>{item.title}</Text>
        <Text style={estilos.categoriaProduto}>{item.category}</Text>
        <Text style={estilos.precoProduto}>R$ {item.price.toFixed(2)}</Text>
        <TouchableOpacity style={estilos.botaoEx} onPress={() => excluir(item.id)}>
        <Image style={estilos.botao}  source={require("../IMG/Ex.png")}></Image>
        </TouchableOpacity>
      </View>
    </View>
  );  

  if (carregandoProdutos) {
    return (
      <View style={estilos.containerCentral}>
        <ActivityIndicator size="large" />
        <Text>Carregando produtos...</Text>
      </View>
    );
  }

  if (mensagemErro) {
    return (
      <View style={estilos.containerCentral}>
        <Text style={estilos.mensagemErro}>{mensagemErro}</Text>
        <TouchableOpacity style={estilos.botaoLogout} onPress={aoLogout}>
          <Text style={estilos.textoBotao}>Fazer Logout</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={estilos.container}>
      <View style={estilos.cabecalho}>
        <Text style={estilos.tituloPagina}>Produtos</Text>
        <TouchableOpacity style={estilos.botaoLogout} onPress={aoLogout}>
          <Text style={estilos.textoBotao}>Sair</Text>
        </TouchableOpacity>
      </View>
    <TouchableOpacity
        style={estilos.botaoFiltro}
        onPress={() => navegacao.goBack()}>
        <Image style={estilos.botao}  source={require("../IMG/Voltar.png")}></Image>
    </TouchableOpacity>
        
    <TextInput
        style={estilos.inputBusca}
        placeholder="Pesquisar produtos..."
        value={termoBusca}
        onChangeText={setTermoBusca}
        />

      <FlatList
        data={produtosFiltrados}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderizarItemProduto}
        contentContainerStyle={estilos.listaConteudo}
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 10,
  },
  containerCentral: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  cabecalho: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  tituloPagina: {
    fontSize: 26,
    fontWeight: 'bold', 
  },
  botaoEx: {
    width: 35,
    borderRadius: 5,
    backgroundColor: '#dc3545',
  },
  botaoLogout: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    backgroundColor: '#dc3545',
  },
  textoBotao: {
    fontSize: 14,
    color: '#fff',
  },
  inputBusca: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 15,
  },
  itemProduto: {
    flexDirection: 'row',
    padding: 15,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
    backgroundColor: '#fff',
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  imagemProduto: {
    width: 60,
    height: 60,
    borderRadius: 5,
    marginRight: 15,
    resizeMode: 'contain',
  },
  detalhesProduto: {
    flex: 1,
  },
  tituloProduto: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  categoriaProduto: {
    fontSize: 12,
    marginBottom: 5,
    opacity: 0.7,
    fontStyle: 'italic',
  },
  precoProduto: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#28a745',
  },
  listaConteudo: {
    paddingBottom: 20,
  },
  mensagemErro: {
    textAlign: 'center',
    marginBottom: 20,
    color: '#dc3545',
    fontSize: 16,
  },
  botaoFiltro: {
   borderWidth: 2,
   borderRadius: "50%",
   height: 40,
   width: 40,
   margin: 12
  },
  
  botao: {
    height: 34,
    width: 34
  },

  func: {
    flexDirection: "row",
    justifyContent: "space-between",
    
  }
});