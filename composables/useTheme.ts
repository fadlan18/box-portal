export type DashTheme = 'dark' | 'light'

const STORAGE_KEY = 'mitranz-dash-theme'

export function useTheme() {
  const theme = useState<DashTheme>('dash-theme', () => 'light')
  const isDark = computed(() => theme.value === 'dark')

  function applyTheme(t: DashTheme) {
    const html = document.documentElement
    const root = document.documentElement.style

    html.classList.remove('dash-dark', 'dash-light')
    html.classList.add('dash-' + t)

    if (t === 'light') {
      root.setProperty('--dash-text-primary', '#1a202c')
      root.setProperty('--dash-text-muted', '#64748b')
      root.setProperty('--dash-card-bg', '#ffffff')
      root.setProperty('--dash-card-border', '#e2e8f0')
      root.setProperty('--dash-input-bg', '#f8fafc')
      root.setProperty('--dash-input-border', '#e2e8f0')
      root.setProperty('--dash-divider', '#e2e8f0')
      document.body.style.background = '#f0f4fa'

      const id = 'mitranz-light-styles'
      if (!document.getElementById(id)) {
        const style = document.createElement('style')
        style.id = id
        style.textContent = `
          .dash-light { color: #1a202c; background: #f0f4fa; }
          .dash-light .glass { background: #ffffff !important; border-color: #e2e8f0 !important; box-shadow: 0 1px 8px rgba(0,0,0,0.06) !important; }
          .dash-light .text-white { color: #1a202c !important; }
          .dash-light .text-gray-400 { color: #64748b !important; }
          .dash-light .text-gray-500 { color: #475569 !important; }
          .dash-light .text-gray-300 { color: #64748b !important; }
          .dash-light .text-gray-600 { color: #334155 !important; }
          .dash-light .text-adaptive { color: #1a202c !important; }
          .dash-light .text-adaptive-muted { color: #64748b !important; }
          .dash-light input, .dash-light select, .dash-light textarea {
            background: #f8fafc !important; border-color: #e2e8f0 !important; color: #1a202c !important;
          }
          .dash-light input::placeholder, .dash-light textarea::placeholder { color: #94a3b8 !important; }
          .dash-light .font-display { color: #1a202c !important; }
          .dash-light .text-cyan-400 { color: #2563eb !important; }
          .dash-light .text-emerald-400 { color: #059669 !important; }
          .dash-light .text-amber-400 { color: #d97706 !important; }
          .dash-light .text-blue-400 { color: #2563eb !important; }
          .dash-light .text-red-400 { color: #dc2626 !important; }
          .dash-light .text-violet-400 { color: #7c3aed !important; }
          .dash-light .stat-card { background: #eff6ff !important; border-color: #bfdbfe !important; }
          .dash-light .stat-card .stat-value { color: #1a202c !important; }
          .dash-light .stat-card .stat-label { color: #64748b !important; }
          .dash-light .btn-ghost { background: #f1f5f9 !important; border-color: #e2e8f0 !important; color: #475569 !important; }
          .dash-light [style*="color:var(--dash-text-primary)"] { color: #1a202c !important; }
          .dash-light [style*="color:var(--dash-text-muted)"] { color: #64748b !important; }
        `
        document.head.appendChild(style)
      }
    } else {
      root.setProperty('--dash-text-primary', '#f1f5f9')
      root.setProperty('--dash-text-muted', '#94a3b8')
      root.setProperty('--dash-card-bg', 'rgba(255,255,255,0.04)')
      root.setProperty('--dash-card-border', 'rgba(255,255,255,0.08)')
      root.setProperty('--dash-input-bg', 'rgba(255,255,255,0.05)')
      root.setProperty('--dash-input-border', 'rgba(255,255,255,0.1)')
      root.setProperty('--dash-divider', 'rgba(255,255,255,0.06)')
      document.body.style.background = '#0a0f1e'

      const lightStyle = document.getElementById('mitranz-light-styles')
      if (lightStyle) lightStyle.remove()
    }

    theme.value = t
    localStorage.setItem(STORAGE_KEY, t)
  }

  function toggleTheme() {
    applyTheme(theme.value === 'dark' ? 'light' : 'dark')
  }

  function initTheme() {
    const saved = localStorage.getItem(STORAGE_KEY) as DashTheme | null
    applyTheme(saved ?? 'light')
  }

  return { theme, isDark, applyTheme, toggleTheme, initTheme }
}
