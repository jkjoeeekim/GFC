/** Lead with a cross-section of an album; retain every original item exactly once. */
export function prioritizeAlbumPhotos<T>(photos: readonly T[]): T[] {
  const featuredCount = Math.min(18, photos.length)
  if (featuredCount < 2) return [...photos]
  const featured = new Set(Array.from({ length: featuredCount }, (_, index) => Math.round(index * (photos.length - 1) / (featuredCount - 1))))
  return [...Array.from(featured, index => photos[index]), ...photos.filter((_, index) => !featured.has(index))]
}
