import { animatedSprite, pokemonName, pokemonNumber } from "../utils/pokemon"
import { TypeBadge } from "./TypeBadge"

export function PokemonList({ loading, pokemon, query, total, selectedId, onPokemonSelect, onQueryChange }) {
    return (
        <aside className="panel list-panel">
            <label className="pokemon-search">
                <span>#</span>
                <input value={query} onChange={e => onQueryChange(e.target.value)} placeholder="Buscar Pokémon" />
            </label>
            <div className="list-summary">
                <strong>{pokemon.length}</strong>
                <span>{query ? "resultado(s)" : `de ${total || 251} Pokemon`}</span>
            </div>
            {loading ? (
                <div className="pokemon-grid">{Array.from({ length: 10 }).map((_, i) => <span className="pokemon-tile skeleton" key={i} />)}</div>
            ) : pokemon.length ? (
                <div className="pokemon-grid">
                    {pokemon.map(p => (
                        <button className={`pokemon-tile ${selectedId === p.id ? "selected" : ""}`} key={p.id} onClick={() => onPokemonSelect(p)}>
                            <span className="number">{pokemonNumber(p.id)}</span>
                            <img src={animatedSprite(p) || p.sprites.front_default} alt={p.name} />
                            <strong>{pokemonName(p.name)}</strong>
                            <span className="mini-types">{p.types.map(t => <TypeBadge key={t.type.name} type={t.type.name} />)}</span>
                        </button>
                    ))}
                </div>
            ) : (
                <div className="empty-list"><strong>Nenhum Pokémon encontrado.</strong><span>Tente outro nome.</span></div>
            )}
        </aside>
    )
}
