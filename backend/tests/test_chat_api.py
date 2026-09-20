from fastapi.testclient import TestClient

from main import app

client = TestClient(app)

BODY = {"pokemon": {"name": "pikachu"}, "question": "Fale sobre ele"}


def test_health():
    assert client.get("/health").json() == {"status": "ok"}


def test_chat_returns_llm_answer(monkeypatch):
    async def fake_ask(pokemon, question):
        assert pokemon["name"] == "pikachu"
        return "resposta de teste"

    monkeypatch.setattr("routers.chat.ask_llm", fake_ask)
    r = client.post("/chat/", json=BODY)
    assert r.status_code == 200
    assert r.json() == {"response": "resposta de teste"}


def test_chat_rejects_short_question():
    r = client.post("/chat/", json={**BODY, "question": "oi"})
    assert r.status_code == 422


def test_chat_rejects_long_question():
    r = client.post("/chat/", json={**BODY, "question": "a" * 501})
    assert r.status_code == 422
