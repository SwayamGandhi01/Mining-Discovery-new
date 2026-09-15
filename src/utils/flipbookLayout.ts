/**
 * Page sizing for the flipbook reader.
 *
 * Kept apart from FlipbookViewer (which pulls in react-pdf) so the eagerly
 * loaded FlipbookSkeleton can reserve the same space without that weight.
 */

export type PageSize = {
  width: number
  height: number
}

export const getResponsivePageSize = (): PageSize => {
  if (typeof window === 'undefined') return { width: 280, height: 396 }

  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight

  // Mobile: small single page, Tablet: medium, Desktop: larger
  let baseWidth: number
  if (viewportWidth < 480) {
    baseWidth = Math.min(280, viewportWidth - 32)
  } else if (viewportWidth < 768) {
    baseWidth = Math.min(360, viewportWidth - 48)
  } else {
    baseWidth = Math.min(420, (viewportWidth - 60) / 2)
  }

  const availableHeight = Math.max(300, viewportHeight - 280)
  let height = Math.round(baseWidth * 1.414)

  if (height > availableHeight) {
    height = Math.max(300, Math.floor(availableHeight * 0.9))
    baseWidth = Math.max(180, Math.floor(height / 1.414))
  }

  return { width: Math.max(180, baseWidth), height }
}

/**
 * Height the rendered pages will occupy: a two-page spread on wider screens,
 * one framed page on phones. Loading placeholders hold this height so the book
 * doesn't push the page around when it replaces them.
 */
export const getReaderStageHeight = (): number => {
  if (typeof window === 'undefined') return 420

  const size = getResponsivePageSize()
  if (window.innerWidth < 768) {
    const width = Math.min(size.width, window.innerWidth - 28)
    // The single page sits in a padded card (p-2 + border) inside a py-2 wrapper.
    return Math.round(width * 1.414) + 34
  }
  return size.height
}
