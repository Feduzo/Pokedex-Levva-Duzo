from fastapi import APIRouter
from pydantic import BaseModel
from services.llm import ask_llm

router = APIRouter(prefix="/chat")

class ChatRequest(BaseModel):
    pokemon: dict
    question: str

@router.post("/")
async def chat(req: ChatRequest): return {"response": await ask_llm(req.pokemon, req.question)}