import type { LegendItem } from '../../../types/layer'
import { legenda } from '../shared'

export const LEGENDS: LegendItem[] = [
  legenda('intro-cap4-leyenda-monocultivo', 'Monocultivo de caña de azúcar', 'monocultivo-azucar.svg', 10),
  legenda('intro-cap4-leyenda-areas-urbanas', 'Áreas urbanas', 'area-urbana.svg', 20),
  legenda('intro-cap4-leyenda-fincas-tradicionales', 'Fincas tradicionales, cultivos diversos y bosques', 'finca-tradicional.svg', 30),
  {
    ...legenda('intro-cap4-leyenda-cuerpos-agua', 'Cuerpos de agua', 'rios-principales.svg', 40),
    icon: '/assets/legends/rios-principales.svg',
  },
  legenda('intro-cap4-leyenda-curvas-nivel', 'Curvas de nivel', 'curva-nivel.svg', 50),
  legenda('intro-cap4-leyenda-agropalenke', 'Fincas tradicionales Agropalenke soberanía de vida', 'palenke.svg', 60),
]
