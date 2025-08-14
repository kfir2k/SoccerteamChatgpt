import { useEffect, useRef } from 'react'

/**
 * Keeps players' playingTime increasing when they are on field
 * and tournament is active (and not paused). Uses rAF but batches
 * updates ~4 times per second to reduce re-renders.
 */
export default function usePlayerTimers(players, setPlayers, tournament) {
    const rafRef = useRef()
    const lastRef = useRef(0)
    const accRef = useRef(0)

    useEffect(() => {
        const loop = (ts) => {
            const { isActive, isPaused } = tournament
            if (!lastRef.current) lastRef.current = ts
            const delta = (ts - lastRef.current) / 1000
            lastRef.current = ts

            if (isActive && !isPaused) {
                accRef.current += delta
                if (accRef.current >= 0.25) { // batch update
                    const inc = accRef.current
                    accRef.current = 0
                    setPlayers((prev) => prev.map(p => (
                        p.isOnField ? { ...p, playingTime: p.playingTime + inc } : p
                    )))
                }
            }
            rafRef.current = requestAnimationFrame(loop)
        }
        rafRef.current = requestAnimationFrame(loop)
        return () => cancelAnimationFrame(rafRef.current)
    }, [setPlayers, tournament])
}