import { metaFor } from "../constants/types"
export function TypeBadge({ type }) {
    const { icon, label, color } = metaFor(type)
    return <span className="type-badge" style={{ "--type": color }}>{icon} {label}</span>
}
