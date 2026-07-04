import httpx
from fastapi import HTTPException

POKEAPI_URL = "https://pokeapi.co/api/v2"

async def get_json(url: str):
    try:
        async with httpx.AsyncClient(timeout=10) as c:
            r = await c.get(url)
            r.raise_for_status()
            return r.json()
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail="Pokemon nao encontrado.")
    except httpx.HTTPError:
        raise HTTPException(status_code=502, detail="Nao foi possivel consultar a PokeAPI agora.")

async def list_pokemon(limit: int = 50): return await get_json(f"{POKEAPI_URL}/pokemon?limit={limit}")
async def get_pokemon_by_name(name: str): return await get_json(f"{POKEAPI_URL}/pokemon/{name.lower()}")