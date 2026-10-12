import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export const ScrollToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY || window.pageYOffset;
          setIsVisible(scrollY > 350);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-20 lg:bottom-6 right-5 z-30 print:hidden animate-in fade-in zoom-in-95 duration-200">
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Scroll smoothly to top of page"
        className="group relative flex items-center justify-center w-11 h-11 rounded-full bg-zinc-900/90 hover:bg-emerald-600 text-zinc-300 hover:text-white border border-zinc-700/80 hover:border-emerald-500 backdrop-blur-md shadow-2xl transition-all hover:scale-105 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
      >
        <ArrowUp className="w-5 h-5 transition-transform group-hover:-translate-y-0.5" aria-hidden="true" />
        <span className="sr-only">Back to Top</span>
      </button>
    </div>
  );
};
