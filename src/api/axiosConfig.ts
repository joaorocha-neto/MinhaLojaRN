import axios from 'axios'
import { obterToken, removerToken } from '../servicos/servicoArmazenamento';

const api = axios.create({
    baseURL: 'https://fakestoreapi.com/',
    timeout: 10000, 
    headers: {    
        'Content-Type': 'application/json',
    },
})

api.interceptors.request.use(
    async (config) => {
        const token = await obterToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (erro: any) => {
        return Promise.reject(erro);
    }
);

api.interceptors.response.use(
    (response: any) => response,
    async (erro: { response: { status: number; }; }) => {
        if (erro.response && erro.response.status === 401) {
            await removerToken();
            console.warn('Token de autenticação expirado ou invalido. relize o login novamente.');

        } 
        return Promise.reject(erro);
    }
);

export default api