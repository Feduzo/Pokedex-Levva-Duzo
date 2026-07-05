from fastapi import APIRouter, Query
from services.pokeapi import get_pokemon_by_name, list_pokemon as fetch_list

router = APIRouter(prefix="/pokemon")

@router.get("/")
async def list_pokemon(limit: int = Query(50, ge=1, le=251)): return await fetch_list(limit)

@router.get("/{name}")
async def get_pokemon(name: str): return await get_pokemon_by_name(name)
