export const MAX_TEXTURE_EDGE = 4096
export const SUBCUENCA_TEXTURE_EDGE = 2048

export interface DownscalePlan {
  width: number
  height: number
}

export function isCloudinaryUpload(url: string): boolean {
  return url.includes('res.cloudinary.com') && url.includes('/upload/')
}

export function clampCloudinaryUrl(url: string, edge: number = MAX_TEXTURE_EDGE): string {
  if (!isCloudinaryUpload(url)) return url
  const start = url.indexOf('/upload/') + '/upload/'.length
  const end = url.indexOf('/', start)
  const segment = url.slice(start, end === -1 ? undefined : end)
  const hasLimit = segment.split(',').some((part) => part.startsWith('c_limit'))
  if (hasLimit) return url
  return `${url.slice(0, start)}c_limit,w_${edge},h_${edge}/${url.slice(start)}`
}

export function clampTransform(transform: string, edge: number = MAX_TEXTURE_EDGE): string {
  return transform.replace(/([wh])_(\d+)/g, (_match, axis: string, value: string) => {
    return `${axis}_${Math.min(Number(value), edge)}`
  })
}

export function downscalePlan(width: number, height: number, edge: number): DownscalePlan | null {
  if (width <= 0 || height <= 0 || edge <= 0) return null
  if (width <= edge && height <= edge) return null
  const scale = edge / Math.max(width, height)
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  }
}
