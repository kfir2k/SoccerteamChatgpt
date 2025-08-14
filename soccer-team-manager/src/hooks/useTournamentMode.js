import { useCallback, useEffect, useRef, useState } from 'react'

export default function useTournamentMode() {
    const [isActive, setIsActive] = useState(false)
    const [isPaused, setIsPaused] = useState(false)
    const [gameDuration, setGameDuration] = useState(90 * 60) // seconds
    const [currentTime, setCurrentTime] = useState(0)

    const rafRef = useRef()
    const lastRef = useRef(0)

    const tick = useCallback((ts) => {
        if (!isActive || isPaused) { lastRef.current = ts; rafRef.current = requestAnimationFrame(tick); return }
        if (!lastRef.current) lastRef.current = ts
        const delta = (ts - lastRef.current) / 1000
        lastRef.current = ts
        setCurrentTime((t) => Math.min(t + delta, gameDuration))
        rafRef.current = requestAnimationFrame(tick)
    }, [isActive, isPaused, gameDuration])

    useEffect(() => {
        rafRef.current = requestAnimationFrame(tick)
        return () => cancelAnimationFrame(rafRef.current)
    }, [tick])

    const start = useCallback((minutes) => {
        setGameDuration((minutes || 90) * 60)
        setCurrentTime(0)
        setIsPaused(false)
        setIsActive(true)
    }, [])

    const stop = useCallback(() => {
        setIsActive(false)
        setIsPaused(false)
        setCurrentTime(0)
    }, [])

    const pause = useCallback(() => setIsPaused(true), [])
    const resume = useCallback(() => setIsPaused(false), [])

    // Add time to the game duration without stopping the timer
    const addTime = useCallback((seconds) => {
        setGameDuration(prev => prev + seconds)
    }, [])

    return {
        isActive,
        isPaused,
        gameDuration,
        currentTime,
        start,
        stop,
        pause,
        resume,
        addTime
    }
}