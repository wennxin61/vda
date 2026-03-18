import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import GooeyNav from './reactbits/GooeyNav';
import FullNameLogo from '../../Full name.png';
import { useI18n } from '../i18n/I18nContext';

export default function Layout() {
  const { lang, t, toggleLang } = useI18n();
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    let rafId = 0;
    let lenis = null;
    let cancelled = false;

    (async () => {
      const mod = await import('lenis');
      if (cancelled) return;
      const Lenis = mod.default;
      lenis = new Lenis({
        duration: 1.06,
        wheelMultiplier: 0.92,
        smoothWheel: true,
        smoothTouch: false
      });

      const raf = (time) => {
        lenis.raf(time);
        rafId = window.requestAnimationFrame(raf);
      };

      rafId = window.requestAnimationFrame(raf);
    })();

    return () => {
      cancelled = true;
      if (rafId) window.cancelAnimationFrame(rafId);
      if (lenis) lenis.destroy();
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const targets = Array.from(
      document.querySelectorAll(
        '.route-page h1, .route-page .ds-header > p, .ds-card, .ds-component-item, .ds-swatch, .insights-card, .app-footer p'
      )
    );

    if (!targets.length) return undefined;

    targets.forEach((node, idx) => {
      node.classList.add('vda-reveal');
      node.style.setProperty('--reveal-delay', `${Math.min(idx % 8, 7) * 54}ms`);
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.16,
        rootMargin: '0px 0px -6% 0px'
      }
    );

    targets.forEach((node) => observer.observe(node));

    return () => {
      observer.disconnect();
      targets.forEach((node) => {
        node.classList.remove('vda-reveal', 'is-visible');
        node.style.removeProperty('--reveal-delay');
      });
    };
  }, [location.pathname]);

  const navItems = [
    { to: '/', label: t('layout.nav.home') },
    { to: '/lab', label: t('layout.nav.lab') },
    { to: '/vdesk', label: t('layout.nav.vdesk') },
    { to: '/about', label: t('layout.nav.about') },
    { to: '/contact', label: t('layout.nav.contact') }
  ];

  return (
    <div className={`app-shell${isHome ? ' is-home' : ''}`}>
      <header className={`site-header${isHome ? ' is-home' : ''}`}>
        <nav className="navbar">
          <div className="logo">
            <img src={FullNameLogo} alt={t('layout.logoAlt')} className="site-logo" />
          </div>
          <GooeyNav
            items={navItems}
            particleCount={15}
            particleDistances={[90, 10]}
            particleR={100}
            initialActiveIndex={0}
            animationTime={600}
            timeVariance={300}
            colors={[1, 2, 3, 1, 2, 3, 1, 4]}
          />
          <button
            type="button"
            onClick={toggleLang}
            aria-label={t('layout.switchLang')}
            className="lang-toggle"
            style={{
              marginLeft: 14,
              border: '1px solid rgba(0,0,0,0.15)',
              background: '#fff',
              color: '#111',
              fontSize: 12,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              padding: '8px 10px',
              borderRadius: 999,
              cursor: 'pointer'
            }}
          >
            {lang === 'zh' ? t('layout.langToggle.zhMode') : t('layout.langToggle.enMode')}
          </button>
        </nav>
      </header>

      <AnimatePresence mode="wait" initial={false}>
        <motion.main
          key={location.pathname}
          className={`route-transition-shell${isHome ? ' is-home' : ''}`}
          initial={{ opacity: 0, y: 14, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
          transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>

      <footer className="app-footer">
        <p>{t('layout.footer')}</p>
      </footer>
    </div>
  );
}
