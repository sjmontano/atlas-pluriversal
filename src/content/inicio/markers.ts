/**
 * 📍 POSICIONES DE LOS MARKERS DE LA HOME — fuente v17 markerPositions.js
 * ========================================================================
 * Posiciones de los 16 lugares en PORCENTAJE DEL LIENZO (imagen 1920×1080),
 * no del viewport: los markers quedan pegados a la imagen y se desplazan
 * con ella al hacer pan en pantallas pequeñas, igual que los POIs de un
 * mapa (fijos a coordenadas). `delay` escalona el pulso.
 *
 * Calibración: conversión vh→% sobre el render de referencia 1920×945
 * con recorte cover vertical de 135px (67.5 por lado).
 */

export interface HomeMarkerPosition {
  id: string
  /** % del ancho del lienzo */
  left: number
  /** % del alto del lienzo */
  top: number
  delay: string
}

export const HOME_MARKERS: HomeMarkerPosition[] = [
  { id: 'nevado-huila', top: 37.75, left: 4, delay: '0s' },
  { id: 'paramo-de-moras', top: 41.25, left: 14.5, delay: '2s' },
  { id: 'paramo-las-hermosas', top: 61.38, left: 17.5, delay: '4s' },
  { id: 'cerro-munchique', top: 45.63, left: 27.5, delay: '6s' },
  { id: 'cerro-catalina-teta', top: 45.28, left: 34.3, delay: '8s' },
  { id: 'villa-rica', top: 53.15, left: 35.8, delay: '10s' },
  { id: 'represa-salvajina', top: 44.75, left: 38.5, delay: '12s' },
  { id: 'pondaje-charco-azul', top: 57.88, left: 39.5, delay: '14s' },
  { id: 'oriente-de-cali', top: 57.88, left: 40.8, delay: '16s' },
  { id: 'cordillera-occidental', top: 40.03, left: 47.18, delay: '18s' },
  { id: 'rio-cauca', top: 66.45, left: 45.5, delay: '20s' },
  { id: 'laguna-de-sonso', top: 75.38, left: 47, delay: '22s' },
  { id: 'tejido-suarez', top: 46.76, left: 42, delay: '24s' },
  { id: 'los-farallones', top: 39.68, left: 50.5, delay: '26s' },
  { id: 'embalse-calima', top: 70.83, left: 61.3, delay: '28s' },
  { id: 'buenaventura', top: 61.38, left: 94.4, delay: '30s' },
]
