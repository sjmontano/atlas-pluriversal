import type { LegendItem } from '../../../types/layer'

// Filas estáticas v17 (menuCapas/Chapter1.jsx): icono plano + nombre,
// anidadas por id de grupo (sin insignia, sin ojo). El ojo del grupo
// alterna su capa; `header: false` en groups.ts oculta el encabezado.

const ICONS = '/assets/legends/un-rio-cauca'

const legenda = (
  id: string,
  name: string,
  icon: string | null,
  order: number,
  group: string,
): LegendItem => ({
  id,
  name,
  ...(icon === null ? {} : { icon: `${ICONS}/${icon}` }),
  bare: true,
  order,
  group,
})

export const LEGENDS: LegendItem[] = [
  legenda('urc-leyenda-parteaguas', 'Parteaguas', 'Parteaguas.webp', 10, 'urc-1'),
  legenda('urc-leyenda-estrellas', 'Estrellas fluviales', 'Estrellas_fluviales.webp', 20, 'urc-1'),
  legenda('urc-leyenda-macizo', 'Macizo', 'Macizo.webp', 30, 'urc-1'),
  legenda('urc-leyenda-cordillera', 'Cordillera', 'cordillera.webp', 40, 'urc-1'),

  legenda('urc-leyenda-planicies', 'Planicies', 'Planicies.webp', 50, 'urc-2'),

  legenda('urc-leyenda-aguas', 'Aguas superficiales', 'AguasSuperficiales2.webp', 60, 'urc-3'),

  legenda('urc-leyenda-paramos', 'Paramos', 'Paramos.webp', 70, 'urc-4'),
  legenda('urc-leyenda-niviales', 'Niviales', 'Niviales.webp', 80, 'urc-4'),
  legenda('urc-leyenda-volcanes', 'Volcanes', 'Volcanes.webp', 90, 'urc-4'),

  legenda('urc-leyenda-alto', 'Alto Cauca', 'AltoCauca.webp', 100, 'urc-5'),
  legenda('urc-leyenda-medio', 'Cauca Medio', 'CaucaMedio.webp', 110, 'urc-5'),
  legenda('urc-leyenda-bajo', 'Bajo Cauca', 'BajoCauca.webp', 120, 'urc-5'),

  legenda('urc-leyenda-vias-principales', 'Vías principales', 'ViasPrincipales.webp', 130, 'urc-6'),
  legenda('urc-leyenda-vias-proyectadas', 'Vías proyectadas', null, 140, 'urc-6'),
  legenda('urc-leyenda-caminos', 'Caminos alternos', 'CaminosAlternos.webp', 150, 'urc-6'),

  legenda('urc-leyenda-areas-metro', 'Áreas metropolitanas', 'AreasMetropolitanas.webp', 160, 'urc-7'),
]
