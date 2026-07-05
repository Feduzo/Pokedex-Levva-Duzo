import { visibleTypeFilters } from "../constants/pokemon"
import { metaFor } from "../constants/types"
import { animatedSprite, pokemonNumber } from "../utils/pokemon"
import { TypeBadge } from "./TypeBadge"

export function PokemonList({ filter, loading, pokemon, query, selectedId, onFilterChange, onPokemonSelect, onQueryChange }) {
    return (
        <aside className="panel list-panel">
            <label className="pokemon-search">
                <span>#</span>
                <input value={query} onChange={e => onQueryChange(e.target.value)} placeholder="Buscar Pokemon" />
            </label>
            <div className="filters">
                {visibleTypeFilters.map(t => (
                    <button className={filter === t ? "active" : ""} key={t} onClick={() => onFilterChange(t)}>
                        {t === "all" ? "Todos" : `${metaFor(t).icon} ${metaFor(t).label}`}
                    </button>
                ))}
            </div>
            {loading ? (
                <div className="pokemon-grid">{Array.from({ length: 8 }).map((_, i) => <span className="pokemon-tile skeleton" key={i} />)}</div>
            ) : pokemon.length ? (
                <div className="pokemon-grid">
                    {pokemon.map(p => (
                        <button className={`pokemon-tile ${selectedId === p.id ? "selected" : ""}`} key={p.id} onClick={() => onPokemonSelect(p)}>
                            <span className="number">{pokemonNumber(p.id)}</span>
                            <img src={animatedSprite(p) || p.sprites.front_default} alt={p.name} />
                            <strong>{p.name}</strong>
                            <span className="mini-types">{p.types.map(t => <TypeBadge key={t.type.name} type={t.type.name} />)}</span>
                        </button>
                    ))}
                </div>
            ) : (
                <div className="empty-list"><strong>Nenhum Pokemon encontrado.</strong><span>Tente outro nome ou tipo.</span></div>
            )}
        </aside>
    )
}
