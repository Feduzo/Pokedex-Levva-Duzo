const api = import.meta.env.VITE_API_URL || "http://localhost:8000"

export const askProfessor = async (pokemon, question) => {
    const r = await fetch(`${api}/chat/`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ pokemon, question }) })
    if (!r.ok) throw new Error("Chat failed")
    return (await r.json()).response
}