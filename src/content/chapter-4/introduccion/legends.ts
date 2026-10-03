import type { LegendItem } from '../../../types/layer'

// Leyenda v17 (introduccionCap4, layerMenu.jsx): puramente informativa, sin ojos.
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

  legenda('introduccion-leyenda-01-monocultivo-de-caÃ±a-de-a', 'Monocultivo de caÃ±a de azÃºcar', '/assets/legends/cap4/monocultivoAzucar.svg', 10),
  legenda('introduccion-leyenda-02-Ã¡reas-urbanas', 'Ãreas urbanas', '/assets/legends/cap4/areaUrbana.svg', 20),
  legenda('introduccion-leyenda-03-fincas-tradicionales--cu', 'Fincas tradicionales, cultivos diversos y bosques', '/assets/legends/cap4/fincaTradicional.svg', 30),
  legenda('introduccion-leyenda-04-cuerpos-de-agua', 'Cuerpos de agua', '/assets/legends/cap2-valle/riosPrincipales.svg', 40),
  legenda('introduccion-leyenda-05-curvas-de-nivel', 'Curvas de nivel', '/assets/legends/cap4/curvaNivel.svg', 50),
  legenda('introduccion-leyenda-06-fincas-tradicionales-agr', 'Fincas tradicionales Agropalenke soberanÃ­a de vida', '/assets/legends/cap4/palenke.svg', 60),
]
