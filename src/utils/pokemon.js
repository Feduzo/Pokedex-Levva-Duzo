export const animatedSprite = p => p?.sprites?.versions?.["generation-v"]?.["black-white"]?.animated?.front_default
export const artwork = p => p?.sprites?.other?.["official-artwork"]?.front_default || p?.sprites?.front_default
export const pokemonNumber = id => `Nº ${String(id).padStart(3, "0")}`
export const playCry = (pokemon, volume, muted) => {
    const src = pokemon?.cries?.latest || pokemon?.cries?.legacy
    if (!src || muted) return
    const audio = new Audio(src)
    audio.volume = volume
    audio.play().catch(() => { })
}