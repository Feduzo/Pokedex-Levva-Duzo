from services.llm import OPENROUTER_URL, build_prompt, provider_config

PIKACHU = {
    "name": "pikachu",
    "types": [{"type": {"name": "electric"}}],
    "abilities": [{"ability": {"name": "static"}}],
    "stats": [{"stat": {"name": "speed"}, "base_stat": 90}],
}


def test_build_prompt_includes_pokemon_context():
    prompt = build_prompt(PIKACHU, "Qual a fraqueza?")
    assert "pikachu" in prompt
    assert "electric" in prompt
    assert "static" in prompt
    assert "'speed': 90" in prompt
    assert "Qual a fraqueza?" in prompt


def test_build_prompt_handles_missing_fields():
    prompt = build_prompt({"name": "missingno"}, "Oi")
    assert "missingno" in prompt
    assert "Pergunta do usuario: Oi" in prompt


def test_provider_uses_openrouter_when_key_is_set(monkeypatch):
    monkeypatch.setenv("OPENROUTER_API_KEY", "abc")
    monkeypatch.delenv("OPENROUTER_MODEL", raising=False)
    url, headers, model = provider_config()
    assert url == OPENROUTER_URL
    assert headers == {"Authorization": "Bearer abc"}
    assert model.endswith(":free")


def test_provider_falls_back_to_ollama_without_key(monkeypatch):
    monkeypatch.delenv("OPENROUTER_API_KEY", raising=False)
    monkeypatch.delenv("OLLAMA_URL", raising=False)
    monkeypatch.delenv("OLLAMA_MODEL", raising=False)
    url, headers, model = provider_config()
    assert url == "http://localhost:11434/v1/chat/completions"
    assert headers == {}
    assert model == "llama3.2"


def test_empty_key_counts_as_missing(monkeypatch):
    monkeypatch.setenv("OPENROUTER_API_KEY", "")
    url, _, _ = provider_config()
    assert url != OPENROUTER_URL


def test_ollama_settings_can_be_overridden(monkeypatch):
    monkeypatch.delenv("OPENROUTER_API_KEY", raising=False)
    monkeypatch.setenv("OLLAMA_URL", "http://ollama:11434")
    monkeypatch.setenv("OLLAMA_MODEL", "mistral")
    url, _, model = provider_config()
    assert url == "http://ollama:11434/v1/chat/completions"
    assert model == "mistral"
