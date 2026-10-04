import { useEffect, useRef, useState } from 'react'
import styles from './AudioPlayer.module.css'

interface Props {
  src: string
  title: string
  onClose: () => void
  autoPlay?: boolean
}

/**
 * 🎧 AUDIO PLAYER — Port del AudioPlayer de v17/atlas-old.
 * Reproductor flotante (Image 2): cápsula teal con marquee del título,
 * botones −10s / play-pausa / +10s y barra de progreso con tiempos.
 * Lo abre el POI variante `audio` en vez del PoiModal genérico.
 */
export function AudioPlayer({ src, title, onClose, autoPlay = true }: Props) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    const el = audioRef.current
    if (!el) return
    el.src = src
    setCurrentTime(0)
    if (autoPlay) {
      el.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false))
    } else {
      setIsPlaying(false)
    }
  }, [src, autoPlay])

  const togglePlay = () => {
    const el = audioRef.current
    if (!el) return
    if (isPlaying) {
      el.pause()
      setIsPlaying(false)
    } else {
      void el.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false))
    }
  }

  const handleTimeUpdate = () => {
    const el = audioRef.current
    if (!isDragging && el) setCurrentTime(el.currentTime)
  }

  const handleLoadedMetadata = () => {
    const el = audioRef.current
    if (el) setDuration(el.duration)
  }

  const handleSeek = (value: string) => {
    const newTime = Number(value)
    setCurrentTime(newTime)
    if (audioRef.current) audioRef.current.currentTime = newTime
  }

  const skipTime = (seconds: number) => {
    if (audioRef.current) audioRef.current.currentTime += seconds
  }

  const formatTime = (time: number) => {
    if (Number.isNaN(time)) return '0:00'
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
  }

  return (
    <div className={styles.container} role="region" aria-label={`Reproductor: ${title}`}>
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
      />

      <div className={styles.header}>
        <div className={styles.marquee}>
          <div className={styles.marqueeContent}>
            <span>{title}</span>
            <span className={styles.spacer}> &nbsp; - &nbsp; </span>
            <span>{title}</span>
          </div>
        </div>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Cerrar reproductor">
          ✕
        </button>
      </div>

      <div className={styles.controls}>
        <div className={styles.buttons}>
          <button onClick={() => skipTime(-10)} className={styles.skipBtn} title="Retroceder 10 segundos">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 17l-5-5 5-5M18 17l-5-5 5-5" />
            </svg>
            <span className={styles.skipText}>-10</span>
          </button>

          <button onClick={togglePlay} className={styles.playBtn} aria-label={isPlaying ? 'Pausar' : 'Reproducir'}>
            {isPlaying ? (
              <svg className={styles.playerIcon} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : (
              <svg className={styles.playerIcon} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 5V19L19 12L8 5Z" />
              </svg>
            )}
          </button>

          <button onClick={() => skipTime(10)} className={styles.skipBtn} title="Adelantar 10 segundos">
            <span className={styles.skipText}>+10</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M13 17l5-5-5-5M6 17l5-5-5-5" />
            </svg>
          </button>
        </div>

        <div className={styles.progress}>
          <span className={styles.time}>{formatTime(currentTime)}</span>
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={(e) => handleSeek(e.target.value)}
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={(e) => {
              setIsDragging(false)
              handleSeek((e.target as HTMLInputElement).value)
            }}
            onTouchStart={() => setIsDragging(true)}
            onTouchEnd={(e) => {
              setIsDragging(false)
              handleSeek((e.target as HTMLInputElement).value)
            }}
            className={styles.bar}
            aria-label="Progreso del audio"
          />
          <span className={styles.time}>{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  )
}
