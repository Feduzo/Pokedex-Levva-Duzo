# Pokedex Inteligente - levva

Projeto desenvolvido para o desafio tecnico de Estagio em Engenharia de Software da levva.

A aplicacao lista Pokemon das duas primeiras geracoes, exibe detalhes consumidos da PokeAPI e permite conversar com uma LLM sobre o Pokemon selecionado.

## Stack

- Frontend: React + Vite
- Backend: FastAPI
- APIs externas: PokeAPI; LLM via Ollama (local) ou OpenRouter (opcional)

## Funcionalidades

- Busca de Pokemon por nome.
- Detalhes com imagem, tipos, atributos, altura, peso, habilidade e som.
- Chat com o Professor Carvalho usando contexto do Pokemon selecionado.
- Backend intermediando a chamada para a LLM para nao expor a chave no frontend.

## Como rodar

Instale as dependencias do backend:

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
```

Escolha como o Professor Carvalho (chat) vai responder:

- **Ollama local (padrao, sem chave e sem custo):** instale o [Ollama](https://ollama.com), rode `ollama pull llama3.2` e mantenha o Ollama aberto. Nao precisa editar o `.env`.
- **OpenRouter (opcional):** crie uma chave gratuita em openrouter.ai/keys e coloque em `backend/.env`. Com a chave definida, ela tem prioridade sobre o Ollama e usa um modelo `:free`.

```bash
OPENROUTER_API_KEY=sua_chave_aqui
```

Variaveis opcionais: `OPENROUTER_MODEL`, `OLLAMA_URL` e `OLLAMA_MODEL` (veja `backend/.env.example`). Nunca envie o `.env` para o Git.

Instale as dependencias do frontend:

```bash
cd ../frontend
npm install
```

Volte para a raiz e rode a aplicacao completa:

```bash
cd ..
npm run start
```

Acesse:

```bash
http://localhost:8000
```

## Desenvolvimento

Para trabalhar com hot reload no frontend:

```bash
npm run dev
```

Nesse modo, o backend roda em `http://localhost:8000` e o frontend em `http://localhost:5173`.

## Decisoes tecnicas

- O backend serve o build do frontend para facilitar a avaliacao em uma unica porta.
- A lista de Pokemon e carregada em lotes para evitar uma tela travada enquanto os dados chegam.
- O prompt da LLM recebe tipos, habilidades e atributos do Pokemon para responder com contexto.
- A interface foi separada em lista, detalhes e chat para deixar o fluxo de uso direto.

## Validacao

```bash
npm run lint
npm run build
```

Tambem foi feita validacao de sintaxe dos arquivos Python do backend.
