import React, { useLayoutEffect, useRef, useState } from 'react'
import { Skeleton, SkeletonTone } from './Skeleton'

type LazyImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  /**
   * Classes for the placeholder. It is absolutely positioned (`inset-0` unless
   * overridden), so the image's container must be `relative`.
   */
  skeletonClassName?: string
  skeletonTone?: SkeletonTone
}

// 'cached' = already decoded when first rendered, so it appears without a fade.
type Status = 'loading' | 'loaded' | 'cached' | 'error'

/**
 * An <img> with its own loading state. The API response usually lands well
 * before the image bytes do, so the image's container shows a skeleton until
 * the file has loaded, then the image fades in. Images already in the browser
 * cache skip both. A broken image ends the loading state too, leaving whatever
 * the browser — or the caller's onError — shows for it.
 *
 * The container keeps its size throughout. Images that aren't in a fixed-size
 * box should get width/height attributes so the browser can reserve their space.
 */
export default function LazyImage({
  src,
  className = '',
  skeletonClassName = '',
  skeletonTone,
  onLoad,
  onError,
  ...rest
}: LazyImageProps): JSX.Element {
  const imgRef = useRef<HTMLImageElement>(null)
  const [status, setStatus] = useState<Status>('loading')

  // Runs before paint, so cached images never show a placeholder, and resets
  // when the source changes (e.g. an SWR refresh swapping the URL).
  useLayoutEffect(() => {
    const img = imgRef.current
    if (img?.complete) setStatus(img.naturalWidth > 0 ? 'cached' : 'error')
    else setStatus('loading')
  }, [src])

  const isLoading = status === 'loading'
  const radius = /(^|\s)rounded/.test(skeletonClassName) ? '' : 'rounded-none'

  return (
    <>
      {isLoading && (
        <Skeleton tone={skeletonTone} className={`absolute inset-0 ${radius} ${skeletonClassName}`} />
      )}
      <img
        ref={imgRef}
        src={src}
        {...rest}
        className={`${className} ${isLoading ? 'invisible' : status === 'loaded' ? 'image-fade-in' : ''}`}
        onLoad={(e) => {
          setStatus((s) => (s === 'loading' ? 'loaded' : s))
          onLoad?.(e)
        }}
        onError={(e) => {
          setStatus('error')
          onError?.(e)
        }}
      />
    </>
  )
}
