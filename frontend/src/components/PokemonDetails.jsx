import { metaFor } from "../constants/types"
import { artwork, pokemonName, pokemonNumber, statLabel } from "../utils/pokemon"
import { TypeBadge } from "./TypeBadge"

export function PokemonDetails({ pokemon: p, description, onCry }) {
    const meta = metaFor(p.types[0].type.name)
    return (
        <div className="pokemon-detail" style={{ "--type-color": meta.color, "--type-soft": meta.soft }}>
            <span className="type-watermark">{meta.icon}</span>
            <div className="detail-head">
                <h2>{pokemonName(p.name)}</h2>
                <p>{pokemonNumber(p.id)}</p>
                <div className="types">{p.types.map(t => <TypeBadge key={t.type.name} type={t.type.name} />)}</div>
            </div>
            <div className="stage">
                <img src={artwork(p)} alt={p.name} />
            </div>
            <div className="detail-actions">
                <button onClick={onCry}>Ouvir som</button>
                <span>{meta.icon} Tipo dominante: {meta.label}</span>
            </div>
            <h3>Status</h3>
            <div className="stats">
                {p.stats.map(({ base_stat, stat }) => (
                    <div className="stat" key={stat.name}>
                        <span>{statLabel(stat.name)}</span>
                        <strong>{base_stat}</strong>
                        <i><b style={{ width: `${Math.min(base_stat, 140) / 140 * 100}%` }} /></i>
                    </div>
                ))}
            </div>
            <p className="species-description">{description}</p>
            <div className="facts">
                <span><b>Altura</b>{p.height / 10} m</span>
                <span><b>Peso</b>{p.weight / 10} kg</span>
                <span><b>Habilidade</b>{pokemonName(p.abilities[0]?.ability.name || "")}</span>
            </div>
        </div>
    )
}
