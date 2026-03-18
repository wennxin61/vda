import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './GooeyNav.css';

const palette = {
  1: '#101010',
  2: '#2f2f2f',
  3: '#5a5a5a',
  4: '#000000'
};

function toHexColor(code) {
  return palette[code] || '#6b7280';
}

export default function GooeyNav({
  items = [],
  particleCount = 14,
  particleDistances = [90, 10],
  particleR = 500,
  initialActiveIndex = 0,
  animationTime = 600,
  timeVariance = 500,
  colors = [1, 2, 3, 1, 2, 3, 1, 4]
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const filterId = useId().replace(/:/g, '');

  const shellRef = useRef(null);
  const buttonRefs = useRef([]);

  const [activeIndex, setActiveIndex] = useState(initialActiveIndex);
  const [highlight, setHighlight] = useState({ left: 0, width: 0 });

  useEffect(() => {
    const routeIndex = items.findIndex((item) => item.to === location.pathname);
    if (routeIndex >= 0) {
      setActiveIndex(routeIndex);
      return;
    }
    if (initialActiveIndex >= 0 && initialActiveIndex < items.length) {
      setActiveIndex(initialActiveIndex);
    }
  }, [items, location.pathname, initialActiveIndex]);

  useLayoutEffect(() => {
    const updateHighlight = () => {
      const target = buttonRefs.current[activeIndex];
      if (!target) return;
      setHighlight({
        left: target.offsetLeft,
        width: target.offsetWidth
      });
    };

    updateHighlight();

    const shell = shellRef.current;
    if (!shell) return;
    const observer = new ResizeObserver(updateHighlight);
    observer.observe(shell);
    window.addEventListener('resize', updateHighlight);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateHighlight);
    };
  }, [activeIndex, items.length]);

  const particles = useMemo(() => {
    const spread = Number(particleDistances?.[0] ?? 90);
    const jitter = Number(particleDistances?.[1] ?? 10);
    const safeCount = Math.max(1, Number(particleCount) || 1);

    return Array.from({ length: safeCount }, (_, i) => {
      const angle = (i / safeCount) * Math.PI * 2;
      const radius = spread * 0.2 + ((i % 3) - 1) * jitter * 0.18;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      const duration = animationTime + (i % 5) * (timeVariance / 4);
      const delay = (i % 7) * 30;
      const scale = 0.55 + (i % 4) * 0.15;
      return {
        x,
        y,
        duration,
        delay,
        scale,
        color: toHexColor(colors[i % colors.length])
      };
    });
  }, [particleCount, particleDistances, animationTime, timeVariance, colors]);

  const handleItemClick = (item, idx) => {
    setActiveIndex(idx);
    if (item.to) {
      navigate(item.to);
      return;
    }
    if (item.href?.startsWith('#')) {
      window.location.hash = item.href;
      return;
    }
    if (item.href) {
      window.location.assign(item.href);
    }
  };

  const cssVars = {
    '--particle-r': `${particleR}px`,
    '--g1': palette[1],
    '--g2': palette[2],
    '--g3': palette[3],
    '--g4': palette[4]
  };

  return (
    <div className="gooey-nav-root" style={cssVars}>
      <svg width="0" height="0" aria-hidden="true">
        <filter id={filterId}>
          <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10"
            result="goo"
          />
          <feBlend in="SourceGraphic" in2="goo" />
        </filter>
      </svg>

      <div ref={shellRef} className="gooey-nav-shell" style={{ filter: `url(#${filterId})` }}>
        <div
          className="gooey-nav-highlight"
          style={{
            transform: `translateX(${highlight.left}px)`,
            width: `${highlight.width}px`,
            transitionDuration: `${animationTime}ms`
          }}
        >
          <div className="gooey-nav-particles">
            {particles.map((p, i) => (
              <span
                key={`p-${i}`}
                className="gooey-particle"
                style={{
                  '--dx': `${p.x}px`,
                  '--dy': `${p.y}px`,
                  '--dur': `${p.duration}ms`,
                  '--delay': `${p.delay}ms`,
                  '--scale': p.scale,
                  '--pc': p.color
                }}
              />
            ))}
          </div>
        </div>

        {items.map((item, idx) => (
          <button
            key={item.to || item.href || item.label}
            ref={(el) => {
              buttonRefs.current[idx] = el;
            }}
            type="button"
            className={`gooey-nav-item ${idx === activeIndex ? 'is-active' : ''}`}
            onClick={() => handleItemClick(item, idx)}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
