import React from 'react'
import { useScrollAnimation } from '../hooks/useScrollAnimation'

interface ScrollAnimationWrapperProps {
  children: React.ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade'
  threshold?: number
  rootMargin?: string
}

export function ScrollAnimationWrapper({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  threshold = 0.15,
  rootMargin = '0px 0px -80px 0px',
}: ScrollAnimationWrapperProps) {
  const { elementRef, isVisible } = useScrollAnimation({
    threshold,
    rootMargin,
    triggerOnce: true,
  })

  const getTransform = () => {
    switch (direction) {
      case 'up':
        return 'translateY(30px)'
      case 'down':
        return 'translateY(-30px)'
      case 'left':
        return 'translateX(-30px)'
      case 'right':
        return 'translateX(30px)'
      case 'fade':
        return 'translateY(0)'
      default:
        return 'translateY(30px)'
    }
  }

  const style: React.CSSProperties = {
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0) translateX(0)' : getTransform(),
    transition: `opacity 0.9s cubic-bezier(0.4, 0, 0.2, 1) ${delay}s, transform 0.9s cubic-bezier(0.4, 0, 0.2, 1) ${delay}s`,
    willChange: isVisible ? 'auto' : 'opacity, transform',
  }

  return (
    <div ref={elementRef} className={className} style={style}>
      {children}
    </div>
  )
}

