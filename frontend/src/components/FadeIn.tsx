'use client';

import { useRef, useEffect, useState, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/lib/useMobile';

interface FadeInProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  x?: number;
  /** If true, animates on mount instead of on scroll */
  onMount?: boolean;
}

/**
 * On desktop: uses framer-motion whileInView (rich animations)
 * On mobile: uses CSS class toggle via IntersectionObserver (GPU-friendly, no JS animation frames)
 */
export default function FadeIn({ children, className = '', delay = 0, y = 20, x = 0, onMount = false }: FadeInProps) {
  const isMobile = useIsMobile();
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(onMount ? false : false);

  useEffect(() => {
    if (!isMobile) return;
    if (onMount) {
      const t = setTimeout(() => setVisible(true), delay * 1000);
      return () => clearTimeout(t);
    }
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { rootMargin: '-50px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [isMobile, delay, onMount]);

  if (isMobile) {
    return (
      <div
        ref={ref}
        className={className}
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translate3d(0,0,0)' : `translate3d(${x}px,${y}px,0)`,
          transition: `opacity 0.4s ease ${delay}s, transform 0.4s ease ${delay}s`,
          willChange: visible ? 'auto' : 'opacity, transform',
        }}
      >
        {children}
      </div>
    );
  }

  // Desktop: use framer-motion
  const initial = { opacity: 0, ...(y ? { y } : {}), ...(x ? { x } : {}) };
  const animate = onMount ? { opacity: 1, y: 0, x: 0 } : undefined;
  const whileInView = !onMount ? { opacity: 1, y: 0, x: 0 } : undefined;

  return (
    <motion.div
      className={className}
      initial={initial}
      animate={animate}
      whileInView={whileInView}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay }}
    >
      {children}
    </motion.div>
  );
}
