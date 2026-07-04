import { metaFor } from "../constants/types"
export function TypeBadge({ type }) {
    const { icon, label, color } = metaFor(type)
    return <span style={{ background: color, color: "#fff", borderRadius: 4, padding: "2px 6px", fontSize: 12 }}>{icon} {label}</span>
}