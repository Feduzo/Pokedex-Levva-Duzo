from fastapi import APIRouter
from services.pokeapi import get_pokemon_by_name, list_pokemon as fetch_list

router = APIRouter(prefix="/pokemon")

@router.get("/")
async def list_pokemon(limit: int = 50): return await fetch_list(limit)

@router.get("/{name}")
async def get_pokemon(name: str): return await get_pokemon_by_name(name)