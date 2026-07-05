import { useEffect, useMemo, useState } from "react"
import { PokemonDetails } from "./components/PokemonDetails"
import { PokemonList } from "./components/PokemonList"
import { ProfessorChat } from "./components/ProfessorChat"
import { SoundControl } from "./components/SoundControl"
import { fetchPokemonDescription, fetchPokemonPage } from "./services/pokeapi"
import { playCry } from "./utils/pokemon"
import "./App.css"

export default function App() {
    const [pokemon, setPokemon] = useState([])
    const [selected, setSelected] = useState(null)
    const [query, setQuery] = useState("")
    const [loading, setLoading] = useState(true)
    const [description, setDescription] = useState("")
    const [volume, setVolume] = useState(0.15)
    const [muted, setMuted] = useState(false)

    useEffect(() => {
        let cancelled = false
        const loaded = []

        fetchPokemonPage(251, batch => {
            if (cancelled) return
            loaded.push(...batch)
            setPokemon([...loaded])
            setSelected(current => current || batch[0])
        }).finally(() => {
            if (!cancelled) setLoading(false)
        })

        return () => { cancelled = true }
    }, [])

    useEffect(() => {
        if (!selected) return
        fetchPokemonDescription(selected.name).then(setDescription).catch(() => setDescription("Descricao indisponivel."))
    }, [selected])

    const filtered = useMemo(() => pokemon.filter(p => {
        const q = query.trim().toLowerCase()
        return p.name.includes(q)
    }), [pokemon, query])

    const choosePokemon = p => { setSelected(p); playCry(p, volume, muted) }

    return (
        <main className="pokedex-shell">
            <header className="topbar">
                <div className="brand"><span className="pokeball" /><h1>Pokedex Inteligente</h1></div>
                <SoundControl muted={muted} onMutedChange={setMuted} volume={volume} onVolumeChange={setVolume} />
                <span className="lens" />
            </header>
            <section className="workspace">
                <PokemonList loading={loading} pokemon={filtered} query={query} total={pokemon.length} selectedId={selected?.id} onPokemonSelect={choosePokemon} onQueryChange={setQuery} />
                <section className="panel detail-panel">
                    {selected ? <PokemonDetails pokemon={selected} description={description} onCry={() => playCry(selected, volume, muted)} /> : <div className="detail-placeholder">Carregando dados da Pokedex...</div>}
                </section>
                <aside className="panel assistant-panel">
                    <ProfessorChat pokemon={selected} />
                </aside>
            </section>
        </main>
    )
}
