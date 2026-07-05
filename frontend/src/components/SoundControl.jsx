export function SoundControl({ muted, onMutedChange, volume, onVolumeChange }) {
    return (
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button onClick={() => onMutedChange(!muted)}>{muted ? "Som off" : "Som on"}</button>
            <input type="range" min={0} max={1} step={0.01} value={volume} onChange={e => onVolumeChange(+e.target.value)} disabled={muted} />
        </div>
    )
}
