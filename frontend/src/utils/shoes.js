// Display helpers shared by the shoe views.

// Muted outdoor colorways (laurel green, clove, taupe, coffee, macadamia, breen, slate, black)
const shoeColors = ['#7f9488', '#a88379', '#9b948a', '#7a5a40', '#c8c3b9', '#a87a3d', '#6d7b8a', '#3f3f3f']

// Gives each shoe a stable upper color, used by the photo placeholder.
export function getShoeColor(id) {
  return shoeColors[Math.abs(Number(id) || 0) % shoeColors.length]
}

export function formatPrice(price) {
  const value = Number(price)
  return Number.isFinite(value) ? `${value.toFixed(2)} USD` : '—'
}

// Returns the sizes as a sorted array of numbers, ignoring anything that is not a number.
export function getSizes(sizes) {
  if (!Array.isArray(sizes)) return []
  return sizes.map(Number).filter(Number.isFinite).sort((a, b) => a - b)
}

// [7, 8, 9, 12] -> "7–12"
export function formatSizeRange(sizes) {
  const list = getSizes(sizes)
  if (list.length === 0) return 'No sizes listed'
  if (list.length === 1) return `Size ${list[0]}`
  return `Sizes ${list[0]}–${list[list.length - 1]}`
}
