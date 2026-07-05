const BASE = "https://pokeapi.co/api/v2"
const getJson = async url => { const r = await fetch(url); if (!r.ok) throw new Error(); return r.json() }

export const fetchPokemon = names => Promise.all(names.map(n => getJson(`${BASE}/pokemon/${n}`)))
export const fetchPokemonPage = async (limit = 50, onBatch) => {
    const names = (await getJson(`${BASE}/pokemon?limit=${limit}`)).results.map(p => p.name)
    const loaded = []

    for (let i = 0; i < names.length; i += 24) {
        const batch = await fetchPokemon(names.slice(i, i + 24))
        loaded.push(...batch)
        onBatch?.(batch)
    }

    return loaded
}
export const fetchPokemonDescription = async name => {
    const s = await getJson(`${BASE}/pokemon-species/${name}`)
    const e = s.flavor_text_entries.find(e => e.language.name === "pt") || s.flavor_text_entries.find(e => e.language.name === "en")
    return e?.flavor_text?.replace(/\f|\n/g, " ") || "Descrição indisponível."
}
