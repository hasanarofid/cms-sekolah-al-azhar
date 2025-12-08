import React from 'react'
import { useScrollAnimation } from '../hooks/useScrollAnimation'

interface ScrollItemProps {
  children: React.ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade'
}

/**
 * Komponen untuk menerapkan efek scroll animation pada elemen individual
 * Digunakan untuk stagger effect pada elemen-elemen di dalam section
 */
export function ScrollItem({
  children,
  className = '',
  delay = 0,
  direction = 'up',
}: ScrollItemProps) {
  const { elementRef, isVisible } = useScrollAnimation({
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px',
    triggerOnce: true,
  })

  const getTransform = () => {
    switch (direction) {
      case 'up':
        return 'translateY(20px)'
      case 'down':
        return 'translateY(-20px)'
      case 'left':
        return 'translateX(-20px)'
      case 'right':
        return 'translateX(20px)'
      case 'fade':
        return 'translateY(0)'
      default:
        return 'translateY(20px)'
    }
  }

  const style: React.CSSProperties = {
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0) translateX(0)' : getTransform(),
    transition: `opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${delay}s, transform 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${delay}s`,
    willChange: isVisible ? 'auto' : 'opacity, transform',
  }

  return (
    <div ref={elementRef} className={className} style={style}>
      {children}
    </div>
  )
}

