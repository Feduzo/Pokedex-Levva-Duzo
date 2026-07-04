const BASE = "https://pokeapi.co/api/v2"
const getJson = async url => { const r = await fetch(url); if (!r.ok) throw new Error(); return r.json() }

export const fetchPokemon = names => Promise.all(names.map(n => getJson(`${BASE}/pokemon/${n}`)))
export const fetchPokemonPage = async (limit = 50) => fetchPokemon((await getJson(`${BASE}/pokemon?limit=${limit}`)).results.map(p => p.name))
export const fetchPokemonDescription = async name => {
    const s = await getJson(`${BASE}/pokemon-species/${name}`)
    const e = s.flavor_text_entries.find(e => e.language.name === "pt") || s.flavor_text_entries.find(e => e.language.name === "en")
    return e?.flavor_text?.replace(/\f|\n/g, " ") || "Descricao indisponivel."
}