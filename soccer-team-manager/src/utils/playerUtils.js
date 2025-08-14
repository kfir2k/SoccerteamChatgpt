export const POSITION_COLORS = {
    GK: '#f59e0b', // yellow/orange
    CB: '#3b82f6', LB: '#3b82f6', RB: '#3b82f6',
    CDM: '#22c55e', CM: '#22c55e', CAM: '#22c55e', RM: '#22c55e', LM: '#22c55e',
    RW: '#ef4444', LW: '#ef4444', ST: '#ef4444',
}

export const getPositionColor = (pos) => POSITION_COLORS[pos] || '#64748b'

export const initials = (name) => {
    if (!name) return ''
    const parts = name.trim().split(/\s+/)
    if (parts.length === 1) return parts[0].slice(0, 3).toUpperCase()
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}