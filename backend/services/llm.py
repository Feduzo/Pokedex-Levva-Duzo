import os
import httpx
from fastapi import HTTPException

OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"
MODEL = "meta-llama/llama-3.1-8b-instruct"

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

async def ask_llm(pokemon: dict, question: str) -> str:
    api_key = os.getenv("OPENROUTER_API_KEY")
    if not api_key:
        raise HTTPException(status_code=503, detail="OPENROUTER_API_KEY nao configurada.")

    try:
        async with httpx.AsyncClient(timeout=20) as c:
            r = await c.post(
                OPENROUTER_URL,
                headers={"Authorization": f"Bearer {api_key}"},
                json={"model": MODEL, "messages": [
                    {"role": "system", "content": "Voce e o Professor Carvalho. Responda em portugues brasileiro, de forma curta, didatica e direta. Evite markdown pesado, tabelas e listas longas. Use no maximo 2 paragrafos ou uma lista curta quando fizer sentido."},
                    {"role": "user", "content": build_prompt(pokemon, question)}
                ]}
            )
            r.raise_for_status()
            return r.json()["choices"][0]["message"]["content"]
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail="Erro ao consultar a LLM.")
    except httpx.HTTPError:
        raise HTTPException(status_code=502, detail="Nao foi possivel consultar a LLM agora.")
