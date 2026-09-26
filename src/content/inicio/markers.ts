/**
 * ðŸ“ POSICIONES DE LOS MARKERS DE LA HOME â€” fuente v17 markerPositions.js
 * ========================================================================
 * Posiciones de los 16 lugares en PORCENTAJE DEL LIENZO (imagen 1920Ã—1080),
 * no del viewport: los markers quedan pegados a la imagen y se desplazan
 * con ella al hacer pan en pantallas pequeÃ±as, igual que los POIs de un
 * mapa (fijos a coordenadas). `delay` es NEGATIVO: define la fase del pulso
 * de cada marker — todos laten desde el primer frame, en desorden (como los
 * POIs de un mapa real), no en cascada.
 *
 * CalibraciÃ³n: conversiÃ³n vhâ†’% sobre el render de referencia 1920Ã—945
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
  { id: 'nevado-huila', top: 39.75, left: 6.5, delay: '-0.4s' },
  { id: 'paramo-de-moras', top: 43.25, left: 17, delay: '-2s' },
  { id: 'paramo-las-hermosas', top: 62.38, left: 20, delay: '-4s' },
  { id: 'cerro-munchique', top: 47.63, left: 30, delay: '-6s' },
  { id: 'cerro-catalina-teta', top: 47.28, left: 36.8, delay: '-8s' },
  { id: 'villa-rica', top: 55.15, left: 38.3, delay: '-10s' },
  { id: 'represa-salvajina', top: 46.75, left: 41, delay: '-12s' },
  { id: 'pondaje-charco-azul', top: 59.88, left: 42, delay: '-14s' },
  { id: 'oriente-de-cali', top: 59.88, left: 43.3, delay: '-16s' },
  { id: 'cordillera-occidental', top: 42.03, left: 49.68, delay: '-18s' },
  { id: 'rio-cauca', top: 68.45, left: 48, delay: '-20s' },
  { id: 'laguna-de-sonso', top: 77.38, left: 49.5, delay: '-22s' },
  { id: 'tejido-suarez', top: 48.76, left: 44.5, delay: '-24s' },
  { id: 'los-farallones', top: 41.68, left: 53, delay: '-26s' },
  { id: 'embalse-calima', top: 76.23, left: 63.3, delay: '-28s' },
  { id: 'buenaventura', top: 67.08, left: 96.3, delay: '-30s' },
]

