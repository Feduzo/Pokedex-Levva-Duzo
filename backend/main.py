from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
from routers import chat, pokemon

load_dotenv()

app = FastAPI(title="Pokedex Levva Duzo API")
frontend_dist = Path(__file__).resolve().parent.parent / "frontend" / "dist"

app.add_middleware(CORSMiddleware, allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"], allow_methods=["*"], allow_headers=["*"])

app.include_router(pokemon.router)
app.include_router(chat.router)

if (frontend_dist / "assets").exists():
    app.mount("/assets", StaticFiles(directory=frontend_dist / "assets"), name="assets")

@app.get("/")
async def index():
    index_file = frontend_dist / "index.html"
    if index_file.exists():
        return FileResponse(index_file)
    return {"status": "ok", "service": "Pokedex Levva Duzo API"}

@app.get("/health")
async def health_check():
    return {"status": "ok"}
