'use client';

import { useState, useEffect } from 'react';

let cachedIsMobile: boolean | null = null;

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => cachedIsMobile ?? false);

  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 768;
      cachedIsMobile = mobile;
      setIsMobile(mobile);
    };
    check();

    let timeoutId: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(check, 200);
    };

    window.addEventListener('resize', handleResize, { passive: true });
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  return isMobile;
}
