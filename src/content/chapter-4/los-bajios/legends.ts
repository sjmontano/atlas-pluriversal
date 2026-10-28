import type { LegendItem } from '../../../types/layer'

// Leyenda v17 (losBajios, layerMenu.jsx): puramente informativa, sin ojos.
const legenda = (
  id: string,
  name: string,
  icon: string,
  order: number,
  group?: string,
): LegendItem => ({
  id,
  name,
  icon,
  order,
  ...(group === undefined ? {} : { group }),
})

export const LEGENDS: LegendItem[] = [

  legenda('los-bajios-leyenda-01-cuerpos-de-agua---aljibe', 'Cuerpos de agua - Aljibe', '/assets/legends/cap4/aljibe.svg', 10, 'Zonificación'),
  legenda('los-bajios-leyenda-02-huerta', 'Huerta', '/assets/legends/cap4/huertas.svg', 20, 'Zonificación'),
  legenda('los-bajios-leyenda-03-construcción', 'Construcción', '/assets/legends/cap4/construccion.svg', 30, 'Zonificación'),
  legenda('los-bajios-leyenda-04-cultivos-diversos', 'Cultivos diversos', '/assets/legends/cap4/cultivoDiverso.svg', 40, 'Zonificación'),
  legenda('los-bajios-leyenda-05-delimitación', 'Delimitación', '/assets/legends/cap4/delimitacion.svg', 50, 'Zonificación'),
  legenda('los-bajios-leyenda-06-trocha', 'Trocha', '/assets/legends/cap4/trocha.svg', 60, 'Zonificación'),
]
