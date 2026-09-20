import os
import httpx
from fastapi import HTTPException

OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"

SYSTEM_PROMPT = "Voce e o Professor Carvalho. Responda em portugues brasileiro, de forma curta, didatica e direta. Evite markdown pesado, tabelas e listas longas. Use no maximo 2 paragrafos ou uma lista curta quando fizer sentido."

def build_prompt(pokemon: dict, question: str) -> str:
    types = [t["type"]["name"] for t in pokemon.get("types", [])]
    abilities = [a["ability"]["name"] for a in pokemon.get("abilities", [])]
    stats = {s["stat"]["name"]: s["base_stat"] for s in pokemon.get("stats", [])}
    return (
        f"Pokemon selecionado: {pokemon.get('name')}\n"
        f"Tipos: {types}\n"
        f"Habilidades: {abilities}\n"
        f"Atributos: {stats}\n\n"
        f"Pergunta do usuario: {question}"
    )

def provider_config() -> tuple[str, dict, str]:
    # Com OPENROUTER_API_KEY usa o OpenRouter; sem chave, usa o Ollama local.
    api_key = os.getenv("OPENROUTER_API_KEY")
    if api_key:
        model = os.getenv("OPENROUTER_MODEL", "meta-llama/llama-3.3-70b-instruct:free")
        return OPENROUTER_URL, {"Authorization": f"Bearer {api_key}"}, model
    base = os.getenv("OLLAMA_URL", "http://localhost:11434")
    return f"{base}/v1/chat/completions", {}, os.getenv("OLLAMA_MODEL", "llama3.2")

async def ask_llm(pokemon: dict, question: str) -> str:
    url, headers, model = provider_config()

    try:
        async with httpx.AsyncClient(timeout=60) as c:
            r = await c.post(
                url,
                headers=headers,
                json={"model": model, "messages": [
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": build_prompt(pokemon, question)}
                ]}
            )
            r.raise_for_status()
            return r.json()["choices"][0]["message"]["content"]
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail="Erro ao consultar a LLM.")
    except httpx.ConnectError:
        raise HTTPException(status_code=503, detail="LLM indisponivel. Inicie o Ollama (ollama serve) ou configure OPENROUTER_API_KEY.")
    except httpx.HTTPError:
        raise HTTPException(status_code=502, detail="Nao foi possivel consultar a LLM agora.")
