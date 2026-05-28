/**
 * Math formula detection and KaTeX rendering for plain-text formulas
 * Identifies mathematical expressions in rendered HTML and converts them to LaTeX
 * Does NOT modify presentationData.js
 * 
 * CONSERVATIVE: Only renders leaf elements that are purely formula text
 * Never touches elements with images or complex children
 */

// Plain text → LaTeX conversion rules
const textToLatex = (text) => {
  let tex = text
  // Greek letters (θ⁻ must come before θ)
  tex = tex.replace(/θ⁻/g, '\\theta^{-}')
  tex = tex.replace(/α/g, '\\alpha ')
  tex = tex.replace(/β/g, '\\beta ')
  tex = tex.replace(/γ/g, '\\gamma ')
  tex = tex.replace(/δ/g, '\\delta ')
  tex = tex.replace(/ε/g, '\\varepsilon ')
  tex = tex.replace(/θ/g, '\\theta ')
  tex = tex.replace(/π/g, '\\pi ')
  tex = tex.replace(/σ/g, '\\sigma ')
  tex = tex.replace(/μ/g, '\\mu ')
  tex = tex.replace(/λ/g, '\\lambda ')
  tex = tex.replace(/∇/g, '\\nabla ')
  tex = tex.replace(/∑/g, '\\sum ')
  tex = tex.replace(/Σ/g, '\\sum ')
  tex = tex.replace(/𝔼/g, '\\mathbb{E}')
  // Superscripts/subscripts
  tex = tex.replace(/²/g, '^{2}')
  tex = tex.replace(/³/g, '^{3}')
  tex = tex.replace(/⁻/g, '^{-}')
  // Operators
  tex = tex.replace(/←/g, '\\leftarrow ')
  tex = tex.replace(/→/g, '\\rightarrow ')
  tex = tex.replace(/·/g, '\\cdot ')
  tex = tex.replace(/×/g, '\\times ')
  tex = tex.replace(/≥/g, '\\geq ')
  tex = tex.replace(/≤/g, '\\leq ')
  tex = tex.replace(/≈/g, '\\approx ')
  // Subscript patterns: Q_target, s', a'
  tex = tex.replace(/Q_(\w+)/g, 'Q_{$1}')
  tex = tex.replace(/(\w)'/g, "$1'")
  // argmax, max, min as operators
  tex = tex.replace(/argmax/g, '\\operatorname{argmax}')
  tex = tex.replace(/max/g, '\\max')
  tex = tex.replace(/min/g, '\\min')
  return tex
}

// Strict formula patterns - only match lines that are PURELY mathematical
const formulaPatterns = [
  // Q-learning update: Q(s,a) ← Q(s,a) + α[...]
  /^\s*Q\([^)]*\)\s*[←=]/,
  // Loss/objective: L(θ) = ..., Loss = ...
  /^\s*(?:L\(θ\)|Loss)\s*=/,
  // TD target: y = r + γ..., yt = ...
  /^\s*y[_t]*\s*=\s*r/,
  // Bellman: Q*(s,a) = ...
  /^\s*Q\*\s*\(/,
  // δ = r + γ...
  /^\s*δ\s*=\s*r/,
  // G_t = Σ ...
  /^\s*G[_t]*\s*=/,
]

/**
 * Scan the rendered slide DOM and replace formula text with KaTeX-rendered HTML
 * ONLY targets leaf elements (no children) with pure formula content
 */
export function renderFormulasWithKaTeX(container) {
  if (!container || !window.katex) return

  // Only target leaf elements (no child elements at all)
  const candidates = container.querySelectorAll('div, span, p')
  
  candidates.forEach(el => {
    // STRICT: must be a true leaf node (no child elements, only text)
    if (el.children.length > 0) return
    // Skip if already rendered
    if (el.querySelector && el.innerHTML.includes('katex')) return
    
    const text = el.textContent.trim()
    if (!text || text.length > 150 || text.length < 5) return

    // Skip if contains significant Chinese (it's explanatory text)
    const chineseChars = (text.match(/[\u4e00-\u9fff]/g) || []).length
    if (chineseChars > 3) return

    // Check if this is a pure formula line
    const isFormula = formulaPatterns.some(p => p.test(text))
    
    if (isFormula) {
      try {
        const latex = textToLatex(text)
        const rendered = window.katex.renderToString(latex, {
          displayMode: false,
          throwOnError: false,
          trust: true
        })
        el.innerHTML = rendered
        el.style.fontFamily = '"KaTeX_Main", "Times New Roman", serif'
      } catch (e) {
        // Keep original on failure
      }
    }
  })
}
