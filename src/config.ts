export const DEV_TOOLS = import.meta.env.VITE_DEV_TOOLS === 'true'

/** Capa de tiles XYZ local. `VITE_TILES_ENABLED=false` la omite por completo
 *  (demo sin tiles: base + previews + Cloudinary; sin spinner de 15s).
 *  Default: true (WP/local con tiles generados). */
export const TILES_ENABLED = import.meta.env.VITE_TILES_ENABLED !== 'false'
