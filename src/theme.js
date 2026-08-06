export const THEMES = {
  dark: {
    id: 'dark',
    label: 'VS Code Dark',
    place: {
        fill: '#0f172a',
        stroke: '#38bdf8',
        radius: 25,
        strokeWidth: 2.5 
    },
    transition: {
        fill: '#0f172a',
        stroke: '#f59e0b',
        width: 40,
        height: 40,
        strokeWidth: 2.5,
        rx: 6
    },
    arc: {
        stroke: '#94a3b8',
        strokeWidth: 2
    },
    text: {
        label: '#94a3b8',
        token: '#ffffff'
    },
    bg: '#020617',
    grid: '#1e293b',
  },

  monokai: {
    id: 'monokai',
    label: 'Monokai Pro',
    place: {
        fill: '#2d2a2e',
        stroke: '#a9dc76',
        radius: 25,
        strokeWidth: 2.5
    },
    transition: {
        fill: '#2d2a2e',
        stroke: '#ff6188',
        width: 40,
        height: 40,
        strokeWidth: 2.5,
        rx: 6 },
    arc: {
        stroke: '#787878',
        strokeWidth: 2
    },
    text: {
        label: '#c1c0c0',
        token: '#ffd866'
    },
    bg: '#19181a',
    grid: '#222124',
  },

  light: {
    id: 'light',
    label: 'Clean Light',
    place: {
        fill: '#ffffff',
        stroke: '#0284c7',
        radius: 25,
        strokeWidth: 2.5
    },
    transition: {
        fill: '#ffffff',
        stroke: '#d97706',
        width: 40,
        height: 40,
        strokeWidth: 2.5,
        rx: 6
    },
    arc: {
        stroke: '#64748b',
        strokeWidth: 2
    },
    text: {
        label: '#475569',
        token: '#0f172a'
    },
    bg: '#f8fafc',
    grid: '#e2e8f0',
  },
};