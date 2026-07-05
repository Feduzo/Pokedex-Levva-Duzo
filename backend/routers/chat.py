from fastapi import APIRouter
from pydantic import BaseModel, Field
from services.llm import ask_llm

router = APIRouter(prefix="/chat")

class ChatRequest(BaseModel):
    pokemon: dict
    question: str = Field(min_length=3, max_length=500)

@router.post("/")
async def chat(req: ChatRequest): return {"response": await ask_llm(req.pokemon, req.question)}
