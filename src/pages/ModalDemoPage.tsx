import { MODALS } from '@content/modals'
import { useUIStore } from '@stores/index.ts'
import { IconButton } from '@components/modal/IconButton'
import styles from './ModalDemoPage.module.css'

export function ModalDemoPage() {
  const openModal = useUIStore((s) => s.openModal)

  const grouped = Object.entries(
    Object.values(MODALS).reduce<Record<string, typeof MODALS[keyof typeof MODALS][]>>(
      (acc, modal) => {
        ;(acc[modal.variant] ??= []).push(modal)
        return acc
      },
      {},
    ),
  )

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Sistema de Modales — Maqueta</h1>
      <p className={styles.subtitle}>
        3 tamaños responsive (small / medium / large) · 5 layouts (text,
        gallery, datasheet, alert, feature). Abre los modales desde aquí o
        desde los triggers sobre el mapa.
      </p>

      {grouped.map(([variant, modals]) => (
        <section key={variant} className={styles.section}>
          <h2 className={styles.sectionTitle}>
            {variant} <span className={styles.count}>({modals.length})</span>
          </h2>
          <div className={styles.grid}>
            {modals.map((modal) => (
              <article
                key={modal.id}
                className={`${styles.card} ${styles[variant]}`}
              >
                <h3 className={styles.cardTitle}>{modal.title}</h3>
                <p className={styles.cardLayout}>layout · {modal.layout}</p>
                <IconButton
                  icon={modal.icon}
                  label={modal.title}
                  frame={modal.trigger.frame}
                  onClick={() => openModal(modal)}
                />
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}