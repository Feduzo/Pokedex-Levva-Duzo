import { useState } from "react"
import { askProfessor } from "../services/chat"

const initialMessage = { role: "professor", text: "Ola! Eu sou o Professor Carvalho. Escolha um Pokemon e me pergunte sobre tipos, fraquezas, estrategias ou curiosidades." }

export function ProfessorChat({ pokemon }) {
    const [question, setQuestion] = useState("")
    const [status, setStatus] = useState("idle")
    const [history, setHistory] = useState({})

    const key = pokemon?.name || "global"
    const messages = history[key] || [initialMessage]
    const setMessages = fn => setHistory(h => ({ ...h, [key]: typeof fn === "function" ? fn(h[key] || messages) : fn }))

    const ask = async text => {
        const clean = text.trim()
        if (!clean || !pokemon || status === "thinking") return
        setQuestion("")
        setStatus("thinking")
        setMessages(m => [...m, { role: "user", text: clean }])
        try {
            const answer = await askProfessor(pokemon, clean)
            setMessages(m => [...m, { role: "professor", text: answer }])
            setStatus("speaking")
            setTimeout(() => setStatus("idle"), 1600)
        } catch {
            setMessages(m => [...m, { role: "professor", text: "Nao consegui acessar a LLM agora. Confira se o backend esta rodando.", error: true }])
            setStatus("error")
        }
    }

    const suggestions = pokemon ? [
        { label: "Fraquezas", text: `Quais sao as fraquezas de ${pokemon.name}?` },
        { label: "Estrategia", text: `Crie uma estrategia de batalha para ${pokemon.name}.` },
        { label: "Iniciante", text: `Explique ${pokemon.name} para iniciante.` },
    ] : []

    return (
        <div className="chat">
            <div className="chat-title">
                <h2>Professor Carvalho</h2>
                <p>{status === "thinking" ? "Pensando..." : "Especialista Pokemon"}</p>
            </div>
            <div className="messages">
                {messages.map((m, i) => (
                    <div className={`${m.role}-bubble ${m.error ? "error" : ""}`} key={i}>
                        <p>{m.text}</p>
                        {m.role === "professor" && <button onClick={() => navigator.clipboard?.writeText(m.text)}>Copiar</button>}
                    </div>
                ))}
            </div>
            <div className="quick-actions">
                {suggestions.map(s => <button key={s.label} onClick={() => ask(s.text)}>{s.label}</button>)}
            </div>
            <div className="ask-box">
                <input value={question} onChange={e => setQuestion(e.target.value)} onKeyDown={e => e.key === "Enter" && ask(question)} placeholder={pokemon ? `Pergunte sobre ${pokemon.name}...` : "Escolha um Pokemon primeiro..."} disabled={!pokemon || status === "thinking"} />
                <button onClick={() => ask(question)} disabled={!pokemon || status === "thinking"}>{status === "thinking" ? "..." : "Perguntar"}</button>
            </div>
        </div>
    )
}