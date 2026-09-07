/**
 * 👥 CREDITS PAGE — "Equipos de trabajo" (calca de v17 /credits)
 * ==============================================================
 * Réplica fiel de `CreditsContent.jsx` + `Credits.css`: página standalone
 * (sin chrome del shell), fondo degradado + textura, columna izquierda con
 * descripción, 3 filas que abren los modales de equipos, pills de nodos,
 * logos de apoyo y footer absoluto. Sin scroll: todo contenido en 100dvh.
 *
 * Desvío explícito vs beta live: el fondo es el degradado + `fondo.webp`
 * del código v17 (la foto grupal del beta no existe como asset en v17).
 */

import { Link } from 'react-router-dom'
import { SHELL_ASSETS } from '@components/shell/assets'
import { getModalById } from '@content/modals'
import { useModalStore } from '@stores/modalStore'
import styles from './CreditsPage.module.css'

const BASE = '/assets/modal/entramados'
const TOOLTIP_BG = '/assets/ui/tooltips/fondo-tooltip-4.webp'

interface Location {
  name: string
  link: string
}

const LOCATIONS: Location[] = [
  { name: 'Nodo Suárez', link: 'https://www.unriocauca.com/asocoms/' },
  { name: 'Nodo Villa Rica', link: 'https://www.unriocauca.com/accn/' },
  { name: 'Nodo Oriente de Cali', link: 'https://www.unriocauca.com/accc/' },
  { name: 'Tejido de Transicionantes', link: 'https://www.unriocauca.com/ttvc-tvgr/' },
]

const EQUIPOS: { modalId: string; label: string }[] = [
  { modalId: 'creditos-colaboratorio', label: 'Colaboratorio de Cartografías críticas y codiseño territorial' },
  { modalId: 'creditos-concepcion', label: 'Concepción del atlas, producción cartográfica y textual' },
  { modalId: 'creditos-diseno', label: 'Diseño gráfico y web' },
]

export function CreditsPage() {
  const openModal = useModalStore((s) => s.openModal)

  const openById = (id: string) => {
    const modal = getModalById(id)
    if (modal) openModal(modal)
  }

  return (
    <div className={styles.page}>
      <div className={styles.homeBtns}>
        <Link to="/" className={styles.btnHome} aria-label="Casa">
          <img src={SHELL_ASSETS.buttons.home} alt="Casa" />
          <span className={styles.tooltip}>
            <span>Casa</span>
            <img src={TOOLTIP_BG} alt="" />
          </span>
        </Link>
        <a
          href="https://www.unriocauca.com/"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.btnLogo}
          aria-label="Un río Cauca, muchos mundos"
        >
          <img className={styles.btnLogoBg} src={SHELL_ASSETS.sidebar.fondoIcon} alt="" />
          <img className={styles.btnLogoImg} src={SHELL_ASSETS.buttons.unRioCauca} alt="Un río Cauca, muchos mundos" />
          <span className={styles.tooltip}>
            <span>Un río Cauca</span>
            <img src={TOOLTIP_BG} alt="" />
          </span>
        </a>
      </div>

      <section
        className={styles.top}
        style={{
          background: `linear-gradient(rgba(4, 69, 82, 0.52), rgba(4, 72, 86, 0.6)), url('${BASE}/fondo.webp')`,
        }}
      >
        <div className={styles.container}>
          <Link to="/entramados" className={styles.back} aria-label="Volver">
            <img src={`${BASE}/back.svg`} alt="" />
          </Link>
          <img src={`${BASE}/fondo-mancha.webp`} alt="" className={styles.h1bg} />
          <h1 className={styles.h1}>Equipos de trabajo</h1>

          <div className={styles.description}>
            <p>
              Este atlas es una creación colectiva del Tejido de Transicionantes
              por el Valle Geográfico del Río Cauca (TVGRC) a través de los
              colaboratorios de Cartografías críticas y codiseño territorial,
              Pensamiento para las Transiciones y Narrativas para las
              Transiciones, realizado en el marco del proyecto Diseñando
              transiciones regionales sistémicas en tiempos de emergencia social
              y climática en el sur del valle alto del río Cauca, co-coordinado por María Campo y Arturo Escobar. Con el apoyo
              de: Fundación Henry Luce; One project y Fundación Ford, a través
              del Fondo para la Equidad Étnica y de Género. CEAF - Universidad
              ICESI.
            </p>
            <br />
            <div className={styles.rows}>
              {EQUIPOS.map((equipo) => (
                <div
                  key={equipo.modalId}
                  className={styles.row}
                  onClick={() => openById(equipo.modalId)}
                >
                  <img src={`${BASE}/image-credits.webp`} className={styles.rowIcon} alt="" />
                  <span className={styles.rowText}>{equipo.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.conocer}>
          <span>Conoce sobre los entramados territoriales </span>
        </div>
        <ul className={styles.locations}>
          {LOCATIONS.map((location) => (
            <li key={location.name}>
              <a href={location.link} target="_blank" rel="noopener noreferrer">
                <span className={styles.pill}>{location.name}</span>
              </a>
            </li>
          ))}
        </ul>
        <div className={styles.logos}>
          <img src={`${BASE}/logo-credits-1.webp`} alt="Logo Unriocauca" className={styles.logo1} />
          <img src={`${BASE}/logo-credits-2.webp`} alt="Logo Accn" className={styles.logo2} />
        </div>
      </section>

      <section className={styles.footer}>
        <img src={`${BASE}/footer-img.webp`} alt="Fondo footer" className={styles.footerImg} />
        <div className={styles.footerContent}>
          <p>2025 Atlas Sur del Valle del Alto del Rio Cauca.</p>
          <div className={styles.footerLinks}>
            <button type="button" onClick={() => openById('terminos-condiciones')} aria-label="Términos y condiciones">
              <img className={styles.politicasBtn} src={`${BASE}/politicas.webp`} alt="" />
            </button>
            <p onClick={() => openById('terminos-condiciones')}>Términos &amp; condiciones</p>
          </div>
        </div>
      </section>
    </div>
  )
}
