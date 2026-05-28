/**
 * Emoji → SVG icon replacement module
 * Replaces emoji characters in rendered slides with beautiful inline SVG icons (lucide-style)
 * Does NOT modify presentationData.js — only transforms at render time
 */

// SVG icon templates (24x24 viewBox, stroke-based, lucide-inspired)
const svgIcon = (path, color = 'currentColor') =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:-0.125em;">${path}</svg>`

const svgFilled = (path, color = 'currentColor') =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="${color}" stroke="none" style="display:inline-block;vertical-align:-0.125em;">${path}</svg>`

// Emoji → SVG mapping
const emojiMap = {
  // Science & Math
  '📐': svgIcon('<path d="M3 21L3 3L21 21H3Z"/><path d="M7 7L17 17"/>', '#1a56db'),
  '📏': svgIcon('<rect x="2" y="8" width="20" height="8" rx="1"/><path d="M6 8v4"/><path d="M10 8v3"/><path d="M14 8v4"/><path d="M18 8v3"/>', '#1a56db'),

  // Tech & Code
  '🔥': svgIcon('<path d="M12 2c0 4-4 6-4 10a4 4 0 0 0 8 0c0-4-4-6-4-10z"/><path d="M12 22c-2 0-3-1-3-3 0-2 3-3 3-5 0 2 3 3 3 5 0 2-1 3-3 3z"/>', '#f59e0b'),
  '🏋️': svgIcon('<path d="M6 5v14"/><path d="M18 5v14"/><path d="M6 12h12"/><rect x="3" y="7" width="2" height="10" rx="1"/><rect x="19" y="7" width="2" height="10" rx="1"/><rect x="1" y="9" width="2" height="6" rx="1"/><rect x="21" y="9" width="2" height="6" rx="1"/>', '#6366f1'),
  '🎮': svgIcon('<rect x="2" y="6" width="20" height="12" rx="4"/><circle cx="8" cy="12" r="1" fill="currentColor"/><circle cx="16" cy="10" r="1" fill="currentColor"/><circle cx="16" cy="14" r="1" fill="currentColor"/><circle cx="14" cy="12" r="1" fill="currentColor"/><circle cx="18" cy="12" r="1" fill="currentColor"/>', '#8b5cf6'),
  '🧠': svgIcon('<path d="M12 2a7 7 0 0 0-7 7c0 3 2 5.5 4 7.5L12 22l3-5.5c2-2 4-4.5 4-7.5a7 7 0 0 0-7-7z"/><path d="M12 2v20"/><path d="M5 9c2 0 3 1 5 1s3-1 5-1"/><path d="M7 13c1.5 0 2.5 1 5 1s3.5-1 5-1"/>', '#ec4899'),
  '🐍': svgIcon('<path d="M3.5 12c0-4 2-8 8.5-8s8.5 4 8.5 8-2 8-8.5 8-8.5-4-8.5-8z"/><path d="M12 4v4"/><circle cx="9" cy="9" r="0.5" fill="currentColor"/><circle cx="15" cy="9" r="0.5" fill="currentColor"/>', '#22c55e'),
  '💡': svgIcon('<path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z"/>', '#f59e0b'),

  // Data & Charts
  '📊': svgIcon('<rect x="3" y="12" width="4" height="9"/><rect x="10" y="7" width="4" height="14"/><rect x="17" y="3" width="4" height="18"/>', '#0ea5e9'),
  '📈': svgIcon('<path d="M3 21L8 14L13 17L21 3"/><polyline points="17 3 21 3 21 7"/>', '#10b981'),
  '📉': svgIcon('<path d="M3 3L8 10L13 7L21 21"/><polyline points="17 21 21 21 21 17"/>', '#ef4444'),

  // Files & Folders
  '📁': svgIcon('<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>', '#f59e0b'),
  '📄': svgIcon('<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>', '#64748b'),
  '📝': svgIcon('<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>', '#1a56db'),
  '📦': svgIcon('<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>', '#8b5cf6'),

  // Actions & Status
  '✅': svgIcon('<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>', '#10b981'),
  '❌': svgIcon('<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>', '#ef4444'),
  '⚠️': svgIcon('<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>', '#f59e0b'),
  '⚡': svgIcon('<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>', '#f59e0b'),
  '⚙️': svgIcon('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>', '#64748b'),
  '🔄': svgIcon('<polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>', '#0ea5e9'),
  '🔁': svgIcon('<polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>', '#6366f1'),
  '🔍': svgIcon('<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>', '#64748b'),
  '🔑': svgIcon('<path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>', '#f59e0b'),
  '🔒': svgIcon('<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>', '#64748b'),
  '🔗': svgIcon('<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>', '#0ea5e9'),

  // Objects & Concepts
  '🎯': svgIcon('<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>', '#ef4444'),
  '🎓': svgIcon('<path d="M22 10L12 5 2 10l10 5 10-5z"/><path d="M6 12v5c0 2 3 3 6 3s6-1 6-3v-5"/><line x1="22" y1="10" x2="22" y2="16"/>', '#1a56db'),
  '🎲': svgIcon('<rect x="2" y="2" width="20" height="20" rx="3"/><circle cx="8" cy="8" r="1.5" fill="currentColor"/><circle cx="16" cy="8" r="1.5" fill="currentColor"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/><circle cx="8" cy="16" r="1.5" fill="currentColor"/><circle cx="16" cy="16" r="1.5" fill="currentColor"/>', '#8b5cf6'),
  '🏆': svgIcon('<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 22V18a2 2 0 0 1 4 0v4"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/>', '#f59e0b'),
  '🏗️': svgIcon('<rect x="2" y="18" width="20" height="4"/><path d="M9 18V8l-4 4"/><path d="M15 18V8l4 4"/><path d="M9 8h6"/><rect x="10" y="12" width="4" height="6"/>', '#64748b'),
  '🚀': svgIcon('<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>', '#6366f1'),
  '🤖': svgIcon('<rect x="3" y="8" width="18" height="12" rx="3"/><path d="M12 2v6"/><circle cx="12" cy="2" r="2"/><circle cx="9" cy="14" r="1.5" fill="currentColor"/><circle cx="15" cy="14" r="1.5" fill="currentColor"/><path d="M9 18h6"/>', '#0ea5e9'),
  '📤': svgIcon('<polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>', '#64748b'),
  '📥': svgIcon('<polyline points="8 8 12 12 16 8"/><line x1="12" y1="12" x2="12" y2="3"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/><polyline points="4 19 4 22 20 22 20 19"/>', '#64748b'),
  '📍': svgIcon('<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>', '#ef4444'),

  // Indicators
  '⚖️': svgIcon('<path d="M12 3v18"/><path d="M3 7l9-4 9 4"/><path d="M3 7l3 9h0a5 5 0 0 0 3-3"/><path d="M21 7l-3 9h0a5 5 0 0 1-3-3"/><circle cx="12" cy="3" r="1" fill="currentColor"/>', '#6366f1'),
  '♻️': svgIcon('<path d="M7.5 7.5L12 2l4.5 5.5"/><path d="M16.5 7.5L21 13l-5.5 2"/><path d="M16.5 15L12 22l-4.5-7"/><path d="M7.5 15L3 13l3-5.5"/>', '#10b981'),
  '✂️': svgIcon('<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/>', '#64748b'),

  // Status dots / circles
  '🔴': svgFilled('<circle cx="12" cy="12" r="10"/>', '#ef4444'),
  '🟡': svgFilled('<circle cx="12" cy="12" r="10"/>', '#f59e0b'),
  '🟢': svgFilled('<circle cx="12" cy="12" r="10"/>', '#10b981'),
  '🏁': svgIcon('<path d="M4 2v20"/><rect x="4" y="2" width="16" height="12"/><path d="M12 2v12"/><path d="M4 8h16"/>', '#1a56db'),

  // Nature & Misc
  '🌱': svgIcon('<path d="M7 20h10"/><path d="M12 20v-8"/><path d="M12 12C12 7 17 4 22 4c0 5-3 8-7 9"/><path d="M12 12C12 7 7 4 2 4c0 5 3 8 7 9"/>', '#10b981'),
  '🕹️': svgIcon('<rect x="6" y="11" width="12" height="10" rx="2"/><path d="M12 7v4"/><circle cx="12" cy="5" r="2"/>', '#8b5cf6'),
  '🖥️': svgIcon('<rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>', '#1a56db'),

  // Tree structure chars (keep as-is, style them)
  '★': svgFilled('<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>', '#f59e0b'),
}

/**
 * Replace emoji characters with SVG icons in a DOM container
 * @param {HTMLElement} container - The slide container element
 */
export function replaceEmojisWithSVG(container) {
  if (!container) return

  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, null)
  const textNodes = []
  while (walker.nextNode()) {
    textNodes.push(walker.currentNode)
  }

  for (const node of textNodes) {
    let text = node.textContent
    let hasMatch = false

    for (const [emoji, svg] of Object.entries(emojiMap)) {
      if (text.includes(emoji)) {
        hasMatch = true
        break
      }
    }

    if (!hasMatch) continue

    // Replace text node with span containing mixed content
    const span = document.createElement('span')
    span.style.display = 'contents' // transparent wrapper
    let remaining = text

    // Build replacement HTML
    let html = text
    for (const [emoji, svg] of Object.entries(emojiMap)) {
      if (html.includes(emoji)) {
        html = html.replaceAll(emoji, `<span class="icon-replaced">${svg}</span>`)
      }
    }

    span.innerHTML = html
    node.parentNode.replaceChild(span, node)
  }
}

export default emojiMap
