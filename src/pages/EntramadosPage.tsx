/**
 * 🧵 ENTRAMADOS PAGE — "Tejidos para el atlas" (calca de v17 /Entramados)
 * =======================================================================
 * Réplica fiel de `entramadosContent.jsx` + `entramados.css`: página standalone
 * (sin chrome del shell), fondo blanco, mancha superior, h2 centrado, h3 con
 * líneas punteadas, marcas a 100px con hover, botones absolutos arriba-derecha
 * y footer absoluto. Sin scroll: todo contenido en 100dvh.
 * Las marcas son solo visualización, igual que en v17 (sin onClick).
 */

import { Link } from 'react-router-dom'
import { SHELL_ASSETS } from '@components/shell/assets'
import { getModalById } from '@content/modals'
import { useModalStore } from '@stores/modalStore'
import styles from './EntramadosPage.module.css'

const BASE = '/assets/modal/entramados'

interface Marca {
  src: string
  alt: string
}

interface Seccion {
  titulo: string
  marcas: Marca[]
}

const SECCIONES: Seccion[] = [
  {
    titulo: 'Suárez',
    marcas: [
      { src: `${BASE}/consejo-rio-ovejas.webp`, alt: 'Logo_Consejo_río_Ovejas.webp' },
      { src: `${BASE}/consejo-municipal-juventud.webp`, alt: 'Consejo municipal de juventud.webp' },
      { src: `${BASE}/asomuafroyo.webp`, alt: 'asomuafroyo.webp' },
      { src: `${BASE}/guardia-cimarrona.webp`, alt: 'Guardia cimarrona.webp' },
      { src: `${BASE}/asoyoge.webp`, alt: 'Asoyoge.webp' },
      { src: `${BASE}/plataforma-juventudes.webp`, alt: 'Plataforma de juventudes.webp' },
    ],
  },
  {
    titulo: 'Villa Rica',
    marcas: [
      { src: `${BASE}/accn.webp`, alt: 'ACCN.webp' },
      { src: `${BASE}/uoafroc.webp`, alt: 'Uoafroc.webp' },
      { src: `${BASE}/consejo-comunitario-territorio.webp`, alt: 'Consejo comunitario territorio y.webp' },
      { src: `${BASE}/fundacion-huellas.webp`, alt: 'Colectivo socio juvenil huellas.webp' },
      { src: `${BASE}/redmunorca.png`, alt: 'Redmunorca.png' },
    ],
  },
  {
    titulo: 'Oriente de Cali',
    marcas: [
      { src: `${BASE}/el-chontaduro.webp`, alt: 'El chontaduro.webp' },
      { src: `${BASE}/afroyoga.webp`, alt: 'Afroyoga.webp' },
      { src: `${BASE}/matamba.webp`, alt: 'matamba.webp' },
      { src: `${BASE}/la-laguna.webp`, alt: 'la laguna.webp' },
      { src: `${BASE}/mujeres-oriente.webp`, alt: 'Matamba.webp' },
      { src: `${BASE}/chicas-comunicativas.webp`, alt: 'Un río Cauca.webp' },
    ],
  },
]

export function EntramadosPage() {
  const openModal = useModalStore((s) => s.openModal)

  const openTerminos = () => {
    const modal = getModalById('terminos-condiciones')
    if (modal) openModal(modal)
  }

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <img className={styles.aguas} src={`${BASE}/fondo-mancha.webp`} alt="" />
        <Link to="/intro" className={styles.back} aria-label="Volver">
          <img src={`${BASE}/back.svg`} alt="" />
        </Link>
        <h1 className={styles.h1}>Tejidos para el atlas</h1>

        <div className={styles.content}>
          <h2 className={styles.h2}>Entramados territoriales</h2>
          {SECCIONES.map((seccion) => (
            <div key={seccion.titulo} className={styles.section}>
              <h3 className={styles.h3}>{seccion.titulo}</h3>
              <div className={styles.images}>
                {seccion.marcas.map((marca) => (
                  <img key={marca.src} src={marca.src} alt={marca.alt} />
                ))}
              </div>
            </div>
          ))}
        </div>

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
            <img src={SHELL_ASSETS.tooltips.fondo} alt="" />
          </span>
        </a>
        <Link to="/credits" className={styles.btnCredits}>
          <img src={`${BASE}/next.svg`} alt="" />
          <h2 className={styles.tejidoText}>Equipos de trabajo</h2>
        </Link>

        <section className={styles.footer}>
          <img src={`${BASE}/footer-img.webp`} alt="Fondo footer" className={styles.footerImg} />
          <div className={styles.footerContent}>
            <p>2025 Atlas Sur del Valle del Alto del Rio Cauca.</p>
            <div className={styles.footerLinks}>
              <button type="button" onClick={openTerminos} aria-label="Términos y condiciones">
                <img className={styles.politicasBtn} src={`${BASE}/politicas.webp`} alt="" />
              </button>
              <p onClick={openTerminos}>Términos &amp; condiciones</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
