from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from routers import chat, pokemon

load_dotenv()

app = FastAPI(title="Pokedex Levva Duzo API")

app.add_middleware(CORSMiddleware, allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"], allow_methods=["*"], allow_headers=["*"])

app.include_router(pokemon.router)
app.include_router(chat.router)

@app.get("/")
async def health_check():
    return {"status": "ok", "service": "Pokedex Levva Duzo API"}
