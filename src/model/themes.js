/**
 * 主题系统 - CSS变量 + 调色板
 * 配色来源：Catppuccin(社区40k+Star) / Nord(极简北欧) / 原创
 */
export const themes = {
  memphis: {
    name: 'Memphis',
    ink: '#1A1A2E',
    paper: '#FFF8EE',
    accent: '#FF6B6B',
    accent2: '#4ECDC4',
    accent3: '#FFD93D',
    font: "'Poppins', sans-serif"
  },
  ocean: {
    name: 'Ocean',
    ink: '#1e3a5f',
    paper: '#f0f8ff',
    accent: '#0077b6',
    accent2: '#00b4d8',
    accent3: '#90e0ef',
    font: "'Inter', sans-serif"
  },
  forest: {
    name: 'Forest',
    ink: '#1b4332',
    paper: '#f1faee',
    accent: '#2d6a4f',
    accent2: '#52b788',
    accent3: '#95d5b2',
    font: "'Inter', sans-serif"
  },
  midnight: {
    name: 'Midnight',
    ink: '#e2e8f0',
    paper: '#0f172a',
    accent: '#818cf8',
    accent2: '#f472b6',
    accent3: '#fbbf24',
    font: "'Inter', sans-serif"
  },
  // --- Catppuccin 系列 (社区40k+ Star) ---
  catppuccinLatte: {
    name: 'Catppuccin Latte',
    ink: '#4c4f69',
    paper: '#eff1f5',
    accent: '#1e66f5',
    accent2: '#179299',
    accent3: '#df8e1d',
    font: "'Inter', sans-serif"
  },
  catppuccinMocha: {
    name: 'Catppuccin Mocha',
    ink: '#cdd6f4',
    paper: '#1e1e2e',
    accent: '#89b4fa',
    accent2: '#a6e3a1',
    accent3: '#f9e2af',
    font: "'Inter', sans-serif"
  },
  // --- Nord (极简北欧风) ---
  nord: {
    name: 'Nord',
    ink: '#2e3440',
    paper: '#eceff4',
    accent: '#5e81ac',
    accent2: '#88c0d0',
    accent3: '#a3be8c',
    font: "'Inter', sans-serif"
  },
  nordAurora: {
    name: 'Nord Aurora',
    ink: '#eceff4',
    paper: '#2e3440',
    accent: '#88c0d0',
    accent2: '#a3be8c',
    accent3: '#ebcb8b',
    font: "'Inter', sans-serif"
  },
  // --- 学术/商务经典 ---
  academic: {
    name: 'Academic',
    ink: '#1a1a1a',
    paper: '#ffffff',
    accent: '#c0392b',
    accent2: '#2c3e50',
    accent3: '#7f8c8d',
    font: "'Georgia', serif"
  },
  corporate: {
    name: 'Corporate',
    ink: '#1f2937',
    paper: '#ffffff',
    accent: '#2563eb',
    accent2: '#059669',
    accent3: '#d97706',
    font: "'Inter', sans-serif"
  },
}

export function isColorDark(hex) {
  const c = hex.replace('#', '')
  const r = parseInt(c.substring(0, 2), 16)
  const g = parseInt(c.substring(2, 4), 16)
  const b = parseInt(c.substring(4, 6), 16)
  return (r * 299 + g * 587 + b * 114) / 1000 < 128
}

export function applyTheme(slides, theme) {
  slides.forEach(slide => {
    const isDark = slide.bgColor && isColorDark(slide.bgColor)
    slide.bgColor = isDark ? theme.ink : theme.paper
    slide.blocks.forEach(block => {
      if (block.style?.color) {
        block.style.color = isDark ? theme.paper : theme.ink
      }
      if (block.type === 'cards' && block.cards) {
        const accents = [theme.accent, theme.accent2, theme.accent3]
        block.cards.forEach((c, i) => {
          if (c.style?.background) c.style.background = accents[i % 3]
        })
      }
    })
  })
}
