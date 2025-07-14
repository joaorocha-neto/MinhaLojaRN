import api from '../api/axiosConfig';
import { ProdutoAPI } from '../tipos/api';

export async function obterTodosProdutos(): Promise<ProdutoAPI[]> {
  try {
    const resposta = await api.get<ProdutoAPI[]>('products');
    return resposta.data;
  } catch (erro: any) {
    throw new Error(erro.message || 'Erro ao buscar produtos.');
  }
}

export async function obterProdutoPorId(id: number): Promise<ProdutoAPI> {
  try {
    const resposta = await api.get<ProdutoAPI>(`products/${id}`);
    return resposta.data;
  } catch (erro: any) {
    if (erro.response && erro.response.status === 404) {
      throw new Error("Produto não encontrado.");
    }
    throw new Error(erro.message || "Erro ao buscar detalhes do produto.");
  }
}