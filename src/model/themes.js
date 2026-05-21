/**
 * 主题系统 - CSS变量 + 调色板
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
  }
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
