/**
 * 🔗 FULL DOC LINK — Botón "Ver documento completo"
 * =================================================
 * - Link externo (target="_blank", rel="noopener")
 * - Estilo link subrayado (consistente con ModalActions .link)
 * - No cierra el modal
 */

import styles from './FullDocLink.module.css';

export interface FullDocLinkProps {
  href: string;
  label?: string;
  className?: string;
}

export function FullDocLink({ href, label = 'Ver documento completo', className }: FullDocLinkProps) {
  return (
    <a
      className={`${styles.link} ${className || ''}`}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      {label}
    </a>
  );
}