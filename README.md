# Pokedex Inteligente - levva

Projeto desenvolvido para o desafio tecnico de Estagio em Engenharia de Software da levva.

A aplicacao permite listar Pokemon, visualizar detalhes consumidos da PokeAPI e conversar com uma LLM sobre o Pokemon selecionado.

## Funcionalidades

- Listagem de Pokemon com busca por nome.
- Tela de detalhes com imagem, tipos, atributos, altura, peso, habilidade e descricao.
- Reproducao do som do Pokemon selecionado.
- Chat com o Professor Carvalho usando contexto do Pokemon e pergunta do usuario.
- Backend dedicado para integrar com OpenRouter sem expor a chave no frontend.

## Stack

- Frontend: React + Vite
- Backend: FastAPI
- APIs externas: PokeAPI e OpenRouter

## Como rodar

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
uvicorn main:app --reload
```

No arquivo `backend/.env`, configure:

```bash
OPENROUTER_API_KEY=sua_chave_aqui
```

O backend roda em:

```bash
http://localhost:8000
```

### Frontend

Em outro terminal:

```bash
cd frontend
npm install
npm run dev
```

O frontend roda em:

```bash
http://localhost:5173
```

## Decisoes tecnicas

- A PokeAPI e consumida no frontend para manter a navegacao rapida e responsiva.
- O carregamento dos Pokemon acontece em lotes para a tela nao ficar travada esperando todos os dados.
- A chamada para LLM fica no backend para proteger a chave de API.
- O prompt envia nome, tipos, habilidades e atributos do Pokemon para dar contexto suficiente ao modelo.
- A interface foi organizada em tres areas: lista, detalhes e chat.

## Validacao

Comandos usados para validar a entrega:

```bash
cd frontend
npm run lint
npm run build
```

Tambem foi feita validacao de sintaxe dos arquivos Python do backend.

Endpoints uteis do backend:

- `GET /`: status da API.
- `GET /pokemon?limit=251`: lista Pokemon pela PokeAPI.
- `GET /pokemon/{name}`: busca detalhes de um Pokemon.
- `POST /chat`: envia o Pokemon e a pergunta para a LLM.
