export const typeMeta = {
    normal: { label: "Normal", icon: "●", color: "#8a95a6", soft: "#f1f5f9" },
    fire: { label: "Fogo", icon: "🔥", color: "#ef4444", soft: "#fee2e2" },
    water: { label: "Água", icon: "💧", color: "#2563eb", soft: "#dbeafe" },
    grass: { label: "Planta", icon: "🌿", color: "#16a34a", soft: "#dcfce7" },
    electric: { label: "Elétrico", icon: "⚡", color: "#d9a404", soft: "#fef9c3" },
    poison: { label: "Veneno", icon: "☠", color: "#7c3aed", soft: "#ede9fe" },
    flying: { label: "Voador", icon: "🪽", color: "#4f8fd9", soft: "#e0f2fe" },
    ghost: { label: "Fantasma", icon: "◐", color: "#6d48b7", soft: "#ede9fe" },
    dragon: { label: "Dragão", icon: "◆", color: "#4f46e5", soft: "#e0e7ff" },
    psychic: { label: "Psíquico", icon: "✦", color: "#db2777", soft: "#fce7f3" },
    rock: { label: "Pedra", icon: "⬢", color: "#8a6f2a", soft: "#fef3c7" },
    bug: { label: "Inseto", icon: "◌", color: "#65a30d", soft: "#ecfccb" },
    ice: { label: "Gelo", icon: "❄", color: "#0891b2", soft: "#e0f2fe" },
    ground: { label: "Terra", icon: "▰", color: "#b7791f", soft: "#fef3c7" },
    fairy: { label: "Fada", icon: "✿", color: "#db2777", soft: "#fce7f3" },
    fighting: { label: "Lutador", icon: "✊", color: "#dc2626", soft: "#fee2e2" },
    steel: { label: "Aço", icon: "⬡", color: "#64748b", soft: "#f1f5f9" },
    dark: { label: "Sombrio", icon: "☾", color: "#334155", soft: "#e2e8f0" },
}

export const metaFor = type => typeMeta[type] || typeMeta.normal
