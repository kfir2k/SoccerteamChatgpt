export const pad2 = (n) => String(Math.floor(n)).padStart(2, '0')
export const formatSeconds = (s) => {
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${pad2(m)}:${pad2(sec)}`
}