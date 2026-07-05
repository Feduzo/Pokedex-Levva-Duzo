export const typeMeta = {
    normal: { label: "Normal", icon: "N", color: "#94a3b8", soft: "#f1f5f9" },
    fire: { label: "Fire", icon: "F", color: "#ef4444", soft: "#fee2e2" },
    water: { label: "Water", icon: "W", color: "#3b82f6", soft: "#dbeafe" },
    grass: { label: "Grass", icon: "G", color: "#22c55e", soft: "#dcfce7" },
    electric: { label: "Electric", icon: "E", color: "#facc15", soft: "#fef9c3" },
    poison: { label: "Poison", icon: "P", color: "#8b5cf6", soft: "#ede9fe" },
    flying: { label: "Flying", icon: "FL", color: "#60a5fa", soft: "#e0f2fe" },
    ghost: { label: "Ghost", icon: "GH", color: "#6d48b7", soft: "#ede9fe" },
    dragon: { label: "Dragon", icon: "D", color: "#4f46e5", soft: "#e0e7ff" },
    psychic: { label: "Psychic", icon: "PS", color: "#fb477e", soft: "#fce7f3" },
    rock: { label: "Rock", icon: "R", color: "#9a7a2f", soft: "#fef3c7" },
    bug: { label: "Bug", icon: "B", color: "#65a30d", soft: "#ecfccb" },
    ice: { label: "Ice", icon: "I", color: "#38bdf8", soft: "#e0f2fe" },
    ground: { label: "Ground", icon: "GR", color: "#ca8a04", soft: "#fef3c7" },
    fairy: { label: "Fairy", icon: "FA", color: "#ec4899", soft: "#fce7f3" },
    fighting: { label: "Fighting", icon: "FI", color: "#dc2626", soft: "#fee2e2" },
    steel: { label: "Steel", icon: "S", color: "#64748b", soft: "#f1f5f9" },
    dark: { label: "Dark", icon: "DK", color: "#334155", soft: "#e2e8f0" },
}

export const metaFor = type => typeMeta[type] || typeMeta.normal
