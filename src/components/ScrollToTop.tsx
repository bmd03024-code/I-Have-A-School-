import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Automatically and smoothly scrolls the viewport to top whenever the route changes
 */
export const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    try {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    } catch {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
};
