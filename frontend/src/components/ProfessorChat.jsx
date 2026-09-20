import { useState } from "react"
import professorCarvalho from "../assets/professor-carvalho.png"
import { askProfessor } from "../services/chat"
import { pokemonName } from "../utils/pokemon"

const initialMessage = {
  role: "professor",
  text: "Olá! Eu sou o Professor Carvalho. Escolha um Pokémon e me pergunte sobre tipos, fraquezas, estratégias ou curiosidades.",
}

export function ProfessorChat({ pokemon }) {
  const [question, setQuestion] = useState("")
  const [status, setStatus] = useState("idle")
  const [history, setHistory] = useState({})

  const key = pokemon?.name || "global"
  const messages = history[key] || [initialMessage]

  const setMessages = updater => {
    setHistory(current => ({
      ...current,
      [key]: typeof updater === "function" ? updater(current[key] || messages) : updater,
    }))
  }

  const ask = async text => {
    const clean = text.trim()
    if (!clean || !pokemon || status === "thinking") return

    setQuestion("")
    setStatus("thinking")
    setMessages(current => [...current, { role: "user", text: clean }])

    try {
      const answer = await askProfessor(pokemon, clean)
      setMessages(current => [...current, { role: "professor", text: answer }])
      setStatus("speaking")
      setTimeout(() => setStatus("idle"), 1600)
    } catch {
      setMessages(current => [
        ...current,
        {
          role: "professor",
          text: "Nao consegui acessar a LLM agora. Confira se o backend esta rodando em localhost:8000 e se o Ollama esta ativo (ou se OPENROUTER_API_KEY esta no backend/.env).",
          error: true,
        },
      ])
      setStatus("error")
    }
  }

  const suggestions = pokemon ? [
    { label: "Fraquezas", text: `Quais são as fraquezas de ${pokemonName(pokemon.name)}?` },
    { label: "Estratégia", text: `Crie uma estratégia de batalha para ${pokemonName(pokemon.name)}.` },
    { label: "Resumo", text: `Explique ${pokemonName(pokemon.name)} para iniciante.` },
  ] : []

  return (
    <div className="chat">
      <div className="chat-title professor-title">
        <ProfessorAvatar status={status} />
        <div>
          <h2>Professor Carvalho</h2>
          <p>{status === "thinking" ? "Analisando dados..." : "Consultor da Pokedex"}</p>
        </div>
      </div>

      <div className="messages pokedex-chat-screen">
        {messages.map((message, index) => (
          <div className={`${message.role}-bubble ${message.error ? "error" : ""}`} key={`${message.role}-${index}`}>
            {message.role === "professor" && <ProfessorMini status={message.error ? "error" : status} />}
            <p>{message.text}</p>
            {message.role === "professor" && (
              <button className="copy-answer" onClick={() => navigator.clipboard?.writeText(message.text)}>Copiar</button>
            )}
          </div>
        ))}
      </div>

      <div className="quick-actions">
        {suggestions.map(item => <button key={item.label} onClick={() => ask(item.text)}>{item.label}</button>)}
      </div>

      <form className="ask-box" onSubmit={event => {
        event.preventDefault()
        ask(question)
      }}>
        <input
          value={question}
          onChange={event => setQuestion(event.target.value)}
          placeholder={pokemon ? `Pergunte ao Professor Carvalho sobre ${pokemonName(pokemon.name)}...` : "Escolha um Pokémon primeiro..."}
          disabled={!pokemon || status === "thinking"}
        />
        <button disabled={!pokemon || status === "thinking"}>{status === "thinking" ? "..." : "Perguntar"}</button>
      </form>
    </div>
  )
}

function ProfessorAvatar({ status }) {
  const label = status === "thinking" ? "Pensando..." : status === "speaking" ? "Respondendo..." : status === "error" ? "Ops!" : ""

  return (
    <div className={`professor-avatar ${status}`}>
      <img src={professorCarvalho} alt="Professor Carvalho" />
      {label && <span className="professor-thought">{label}</span>}
    </div>
  )
}

function ProfessorMini({ status }) {
  return <span className={`professor-mini ${status}`}>PC</span>
}
