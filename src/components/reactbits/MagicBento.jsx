import { useRef, useEffect, useCallback, useState } from 'react';
import { gsap } from 'gsap';
import './MagicBento.css';
import { div } from 'three/src/nodes/math/OperatorNode';

const DEFAULT_PARTICLE_COUNT = 12;
const DEFAULT_SPOTLIGHT_RADIUS = 300;
const DEFAULT_GLOW_COLOR = '215, 231, 232';
const MOBILE_BREAKPOINT = 768;
const cardData = [
  {
    color: '#f5f5f52d',
    title: 'Spot Price Forecast',
    description: 'Transformer-based 96-point day-ahead price prediction engine.',
    label: 'AI Model'
  },
  {
    color: '#f5f5f52d',
    title: 'Grid Load Analytics',
    description: 'Real-time regional power load monitoring and duck-curve analysis.',
    label: 'Market Data'
  },
  {
    color: '#f5f5f52d',
    title: 'Strategy Backtesting',
    description: 'High-fidelity simulation for quantitative bidding strategies.',
    label: 'Quantitative'
  },
  {
    color: '#f5f5f52d',
    title: 'VPP Aggregation',
    description: 'Distributed energy resource management and dispatch control.',
    label: 'Operations'
  },
  {
    color: '#f5f5f52d',
    title: 'Meteorological AI',
    description: 'Satellite-driven precision wind and solar irradiance forecasting.',
    label: 'Weather'
  },
  {
    color: '#f5f5f52d',
    title: 'Risk Management',
    description: 'Real-time Value-at-Risk (VaR) and exposure monitoring.',
    label: 'Security'
  },
  {
    color: '#f5f5f52d',
    title: 'Arbitrage Engine',
    description: 'Cross-provincial spot market spread capture algorithms.',
    label: 'Trading'
  },
  {
    color: '#f5f5f52d',
    title: 'Carbon Linkage',
    description: 'Carbon emission allowance (CEA) price impact modeling.',
    label: 'Environment'
  }
];

const createParticleElement = (x, y, color = DEFAULT_GLOW_COLOR) => {
  const el = document.createElement('div');
  el.className = 'particle';
  el.style.cssText = `
    position: absolute;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: rgba(${color}, 1);
    box-shadow: 0 0 6px rgba(${color}, 0.6);
    pointer-events: none;
    z-index: 100;
    left: ${x}px;
    top: ${y}px;
  `;
  return el;
};

const calculateSpotlightValues = radius => ({
  proximity: radius * 0.5,
  fadeDistance: radius * 0.75
});

const updateCardGlowProperties = (card, mouseX, mouseY, glow, radius) => {
  const rect = card.getBoundingClientRect();
  const relativeX = ((mouseX - rect.left) / rect.width) * 100;
  const relativeY = ((mouseY - rect.top) / rect.height) * 100;

  card.style.setProperty('--glow-x', `${relativeX}%`);
  card.style.setProperty('--glow-y', `${relativeY}%`);
  card.style.setProperty('--glow-intensity', glow.toString());
  card.style.setProperty('--glow-radius', `${radius}px`);
};

const ParticleCard = ({
  children,
  className = '',
  disableAnimations = false,
  style,
  particleCount = DEFAULT_PARTICLE_COUNT,
  glowColor = DEFAULT_GLOW_COLOR,
  enableTilt = true,
  clickEffect = false,
  enableMagnetism = false
}) => {
  const cardRef = useRef(null);
  const particlesRef = useRef([]);
  const timeoutsRef = useRef([]);
  const isHoveredRef = useRef(false);
  const memoizedParticles = useRef([]);
  const particlesInitialized = useRef(false);
  const magnetismAnimationRef = useRef(null);

  const initializeParticles = useCallback(() => {
    if (particlesInitialized.current || !cardRef.current) return;

    const { width, height } = cardRef.current.getBoundingClientRect();
    memoizedParticles.current = Array.from({ length: particleCount }, () =>
      createParticleElement(Math.random() * width, Math.random() * height, glowColor)
    );
    particlesInitialized.current = true;
  }, [particleCount, glowColor]);

  const clearAllParticles = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    magnetismAnimationRef.current?.kill();

    particlesRef.current.forEach(particle => {
      gsap.to(particle, {
        scale: 0,
        opacity: 0,
        duration: 0.3,
        ease: 'back.in(1.7)',
        onComplete: () => {
          particle.parentNode?.removeChild(particle);
        }
      });
    });
    particlesRef.current = [];
  }, []);

  const animateParticles = useCallback(() => {
    if (!cardRef.current || !isHoveredRef.current) return;

    if (!particlesInitialized.current) {
      initializeParticles();
    }

    memoizedParticles.current.forEach((particle, index) => {
      const timeoutId = setTimeout(() => {
        if (!isHoveredRef.current || !cardRef.current) return;

        const clone = particle.cloneNode(true);
        cardRef.current.appendChild(clone);
        particlesRef.current.push(clone);

        gsap.fromTo(clone, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.7)' });

        gsap.to(clone, {
          x: (Math.random() - 0.5) * 100,
          y: (Math.random() - 0.5) * 100,
          rotation: Math.random() * 360,
          duration: 2 + Math.random() * 2,
          ease: 'none',
          repeat: -1,
          yoyo: true
        });

        gsap.to(clone, {
          opacity: 0.3,
          duration: 1.5,
          ease: 'power2.inOut',
          repeat: -1,
          yoyo: true
        });
      }, index * 100);

      timeoutsRef.current.push(timeoutId);
    });
  }, [initializeParticles]);

  useEffect(() => {
    if (disableAnimations || !cardRef.current) return;

    const element = cardRef.current;

    const handleMouseEnter = () => {
      isHoveredRef.current = true;
      animateParticles();

      if (enableTilt) {
        gsap.to(element, {
          rotateX: 5,
          rotateY: 5,
          duration: 0.3,
          ease: 'power2.out',
          transformPerspective: 1000
        });
      }
    };

    const handleMouseLeave = () => {
      isHoveredRef.current = false;
      clearAllParticles();

      if (enableTilt) {
        gsap.to(element, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.3,
          ease: 'power2.out'
        });
      }

      if (enableMagnetism) {
        gsap.to(element, {
          x: 0,
          y: 0,
          duration: 0.3,
          ease: 'power2.out'
        });
      }
    };

    const handleMouseMove = e => {
      if (!enableTilt && !enableMagnetism) return;

      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      if (enableTilt) {
        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;

        gsap.to(element, {
          rotateX,
          rotateY,
          duration: 0.1,
          ease: 'power2.out',
          transformPerspective: 1000
        });
      }

      if (enableMagnetism) {
        const magnetX = (x - centerX) * 0.05;
        const magnetY = (y - centerY) * 0.05;

        magnetismAnimationRef.current = gsap.to(element, {
          x: magnetX,
          y: magnetY,
          duration: 0.3,
          ease: 'power2.out'
        });
      }
    };

    const handleClick = e => {
      if (!clickEffect) return;

      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const maxDistance = Math.max(
        Math.hypot(x, y),
        Math.hypot(x - rect.width, y),
        Math.hypot(x, y - rect.height),
        Math.hypot(x - rect.width, y - rect.height)
      );

      const ripple = document.createElement('div');
      ripple.style.cssText = `
        position: absolute;
        width: ${maxDistance * 2}px;
        height: ${maxDistance * 2}px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(${glowColor}, 0.4) 0%, rgba(${glowColor}, 0.2) 30%, transparent 70%);
        left: ${x - maxDistance}px;
        top: ${y - maxDistance}px;
        pointer-events: none;
        z-index: 1000;
      `;

      element.appendChild(ripple);

      gsap.fromTo(
        ripple,
        {
          scale: 0,
          opacity: 1
        },
        {
          scale: 1,
          opacity: 0,
          duration: 0.8,
          ease: 'power2.out',
          onComplete: () => ripple.remove()
        }
      );
    };

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);
    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('click', handleClick);

    return () => {
      isHoveredRef.current = false;
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('click', handleClick);
      clearAllParticles();
    };
  }, [animateParticles, clearAllParticles, disableAnimations, enableTilt, enableMagnetism, clickEffect, glowColor]);

  return (
    <div
      ref={cardRef}
      className={`${className} particle-container`}
      style={{ ...style, position: 'relative', overflow: 'hidden' }}
    >
      {children}
    </div>
  );
};

const GlobalSpotlight = ({
  gridRef,
  disableAnimations = false,
  enabled = true,
  spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
  glowColor = DEFAULT_GLOW_COLOR
}) => {
  const spotlightRef = useRef(null);
  const isInsideSection = useRef(false);

  useEffect(() => {
    if (disableAnimations || !gridRef?.current || !enabled) return;

    const spotlight = document.createElement('div');
    spotlight.className = 'global-spotlight';
    spotlight.style.cssText = `
      position: fixed;
      width: 800px;
      height: 800px;
      border-radius: 50%;
      pointer-events: none;
      background: radial-gradient(circle,
        rgba(${glowColor}, 0.15) 0%,
        rgba(${glowColor}, 0.08) 15%,
        rgba(${glowColor}, 0.04) 25%,
        rgba(${glowColor}, 0.02) 40%,
        rgba(${glowColor}, 0.01) 65%,
        transparent 70%
      );
      z-index: 200;
      opacity: 0;
      transform: translate(-50%, -50%);
      mix-blend-mode: screen;
    `;
    document.body.appendChild(spotlight);
    spotlightRef.current = spotlight;

    const handleMouseMove = e => {
      if (!spotlightRef.current || !gridRef.current) return;

      const section = gridRef.current.closest('.bento-section');
      const rect = section?.getBoundingClientRect();
      const mouseInside =
        rect && e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;

      isInsideSection.current = mouseInside || false;
      const cards = gridRef.current.querySelectorAll('.magic-bento-card');

      if (!mouseInside) {
        gsap.to(spotlightRef.current, {
          opacity: 0,
          duration: 0.3,
          ease: 'power2.out'
        });
        cards.forEach(card => {
          card.style.setProperty('--glow-intensity', '0');
        });
        return;
      }

      const { proximity, fadeDistance } = calculateSpotlightValues(spotlightRadius);
      let minDistance = Infinity;

      cards.forEach(card => {
        const cardElement = card;
        const cardRect = cardElement.getBoundingClientRect();
        const centerX = cardRect.left + cardRect.width / 2;
        const centerY = cardRect.top + cardRect.height / 2;
        const distance =
          Math.hypot(e.clientX - centerX, e.clientY - centerY) - Math.max(cardRect.width, cardRect.height) / 2;
        const effectiveDistance = Math.max(0, distance);

        minDistance = Math.min(minDistance, effectiveDistance);

        let glowIntensity = 0;
        if (effectiveDistance <= proximity) {
          glowIntensity = 1;
        } else if (effectiveDistance <= fadeDistance) {
          glowIntensity = (fadeDistance - effectiveDistance) / (fadeDistance - proximity);
        }

        updateCardGlowProperties(cardElement, e.clientX, e.clientY, glowIntensity, spotlightRadius);
      });

      gsap.to(spotlightRef.current, {
        left: e.clientX,
        top: e.clientY,
        duration: 0.1,
        ease: 'power2.out'
      });

      const targetOpacity =
        minDistance <= proximity
          ? 0.8
          : minDistance <= fadeDistance
            ? ((fadeDistance - minDistance) / (fadeDistance - proximity)) * 0.8
            : 0;

      gsap.to(spotlightRef.current, {
        opacity: targetOpacity,
        duration: targetOpacity > 0 ? 0.2 : 0.5,
        ease: 'power2.out'
      });
    };

    const handleMouseLeave = () => {
      isInsideSection.current = false;
      gridRef.current?.querySelectorAll('.magic-bento-card').forEach(card => {
        card.style.setProperty('--glow-intensity', '0');
      });
      if (spotlightRef.current) {
        gsap.to(spotlightRef.current, {
          opacity: 0,
          duration: 0.3,
          ease: 'power2.out'
        });
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      spotlightRef.current?.parentNode?.removeChild(spotlightRef.current);
    };
  }, [gridRef, disableAnimations, enabled, spotlightRadius, glowColor]);

  return null;
};

const BentoCardGrid = ({ children, gridRef }) => (
  <div className="card-grid bento-section" ref={gridRef}>
    {children}
  </div>
);

const useMobileDetection = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
};

const defaultSeedNews = [
  { 
    title: 'VDA Lab Breakthrough: Transformer-XL Precision Reaches 98.4%', 
    link: '#', 
    source: 'VDA Lab', 
    date: '2026-03-17', 
    isHighlight: true,
    summary: 'Our proprietary VDA-Transformer architecture has successfully integrated Long-range Attention with Spatio-temporal Graph Convolutional Networks. In live tests on the Northwest China grid, the Root Mean Square Error (RMSE) for 96-point price forecasting was reduced by 15.2% during extreme weather events.' 
  },
  { 
    title: 'VDA Lab Insight: Deep Reinforcement Learning Optimizes VPP Bidding', 
    link: '#', 
    source: 'VDA Lab', 
    date: '2026-03-17', 
    isHighlight: true,
    summary: 'VDA researchers released a new DRL agent for Virtual Power Plants (VPP). By simulating 50,000+ market scenarios, the agent identified non-linear arbitrage opportunities in the intraday market, achieving a 2.8 Sharpe Ratio in backtesting.' 
  },
  { 
    title: 'NVIDIA Launches RTX PowerMaster: A GPU Designed for Grid Topology', 
    link: '#', 
    source: 'Hardware Insider', 
    date: '2026-03-16', 
    isHighlight: false,
    summary: 'The new specialized Tensor cores optimize matrix operations for power flow analysis. Monte Carlo simulations for 10,000 random paths now complete in 1.2 seconds, allowing quantitative traders to perform high-frequency risk hedging before market clearing.' 
  },
  { 
    title: 'State Grid Issues Spring Load Warning: PV Penetration Hits 45%', 
    link: '#', 
    source: 'SGCC', 
    date: '2026-03-16', 
    isHighlight: false,
    summary: 'A "Deep Duck Curve" is expected in East China today. SGCC advises VPPs to deploy 500MW of upward regulation to counter the net load drop after 14:00. Current reserve capacity is hovering at a critical 8.5% margin.' 
  },
  { 
    title: 'VDA Lab Alert: 72-Hour Consecutive Negative Pricing Detected in Shandong', 
    link: '#', 
    source: 'VDA Lab', 
    date: '2026-03-15', 
    isHighlight: true,
    summary: 'Due to a major spring cyclone, wind output hit record highs while industrial load remained low. VDA systems registered clearing prices hitting the -100 RMB/MWh floor. Several thermal units were forced into deep cycling mode.' 
  },
  { 
    title: 'Carbon-Power Price Linkage Mechanism Pilot Expands to 5 Provinces', 
    link: '#', 
    source: 'Finance Daily', 
    date: '2026-03-15', 
    isHighlight: false,
    summary: 'Thermal units are now required to include CEA costs in their spot bids. With national carbon prices exceeding 120 RMB/ton, high-emission plants are shifting down the merit order, increasing the green energy premium.' 
  },
  { 
    title: 'V2G Standard 2.0 Released: EV-Grid Interoperability Simplified', 
    link: '#', 
    source: 'IEEE Standard', 
    date: '2026-03-14', 
    isHighlight: false,
    summary: 'The new IEEE protocol unifies bidirectional charging interfaces. EV manufacturers must now provide State of Charge (SoC) data to grid dispatchers, clearing technical hurdles for cars to act as "mobile power banks."' 
  },
  { 
    title: 'VDA Lab Research: Privacy-Preserving TEE for Load Data Sharing', 
    link: '#', 
    source: 'VDA Lab', 
    date: '2026-03-14', 
    isHighlight: true,
    summary: 'Using Trusted Execution Environments (TEE), VDA Lab has developed a framework for secure load modeling without exposing raw industrial secrets. This allows grid centers to build accurate models while protecting corporate data privacy.' 
  },
  { 
    title: 'Hydrogen Storage Demonstration Project Achieves 1,000 Hours in Ningxia', 
    link: '#', 
    source: 'Tech Review', 
    date: '2026-03-13', 
    isHighlight: false,
    summary: 'Utilizing PEM electrolysis to convert excess wind power into hydrogen, this project addresses the seasonal limitations of lithium batteries. The Round-Trip Efficiency (RTE) has improved to a stable 65%.' 
  },
  { 
    title: 'Tesla Megapack Deploys 2GWh Battery Array in South Australia', 
    link: '#', 
    source: 'CleanEnergy', 
    date: '2026-03-13', 
    isHighlight: false,
    summary: 'The largest storage project in the Southern Hemisphere is now operational. Featuring Grid-forming Inverters, the system can establish grid voltage independently of thermal units, supporting high-RE penetration.' 
  },
  { 
    title: 'VDA Lab Whitepaper: AI-Driven Predictive Maintenance for Substation Safety', 
    link: '#', 
    source: 'VDA Lab', 
    date: '2026-03-12', 
    isHighlight: true,
    summary: 'By deploying ultrasonic and infrared AI sensors, the VDA system successfully predicted a bushing failure 48 hours in advance at a 220kV substation, preventing millions in potential outage damages.' 
  },
  { 
    title: 'European VPPs Successfully Enter Cross-Border FCR Markets', 
    link: '#', 
    source: 'EnerTech', 
    date: '2026-03-12', 
    isHighlight: false,
    summary: '50,000 residential batteries across Germany and the Netherlands are now aggregating to respond to frequency fluctuations. Blockchain-based settlement ensures millisecond confirmation for ancillary services.' 
  },
  { 
    title: 'Offshore Wind Clusters Upgrade to Intelligent Wake Coordination', 
    link: '#', 
    source: 'Wind Power', 
    date: '2026-03-11', 
    isHighlight: false,
    summary: 'New AI coordination algorithms sacrifice partial output from upwind turbines to optimize inflow for downwind units. Real-world tests show a total plant generation increase of 8.2%.' 
  },
  { 
    title: 'Saudi Neom Green City Achieves 100% Zero-Carbon Real-Time Supply', 
    link: '#', 
    source: 'Middle East Eye', 
    date: '2026-03-11', 
    isHighlight: false,
    summary: 'Supported by 10GW of PV and 5GW of Wind, Neom’s "Super Brain" processes 100 million data points per second to match desalination plant loads with fluctuating renewable supply.' 
  },
  { 
    title: 'VDA Lab Forecast: El Niño to Drive Summer Spot Prices to 580 RMB/MWh', 
    link: '#', 
    source: 'VDA Lab', 
    date: '2026-03-10', 
    isHighlight: true,
    summary: 'Remote sensing indicates anomalous warming in the Pacific. VDA’s climate model predicts a 12-day increase in extreme heat days. Every 1°C rise is expected to add 4GW of cooling load to the Central China Grid.' 
  },
  { 
    title: 'Solid-State Battery Production Ramps Up: Discharge Rate Reaches 10C', 
    link: '#', 
    source: 'Battery Blog', 
    date: '2026-03-10', 
    isHighlight: false,
    summary: 'Breakthroughs in solid electrolytes have solved dendrite issues at high rates. This allows storage stations to respond like capacitors to grid shocks, vital for low-inertia power systems.' 
  },
  { 
    title: 'Hydropower Volatility Hits 10-Year High in Southwest Regions', 
    link: '#', 
    source: 'Climate Watch', 
    date: '2026-03-09', 
    isHighlight: false,
    summary: 'Accelerated glacial melting is causing extreme runoff fluctuations. VDA systems warn that frequency regulation in Sichuan and Yunnan will face severe challenges this quarter.' 
  },
  { 
    title: 'VDA Lab Report: National Unified Market and Inter-Provincial Spot Trading', 
    link: '#', 
    source: 'VDA Lab', 
    date: '2026-03-09', 
    isHighlight: true,
    summary: 'Inter-provincial spot trading has officially entered full-scale operation. Surplus green power can now flow to high-price zones in real-time, reducing regional price disparities by up to 30%.' 
  },
  { 
    title: 'Deep Reinforcement Learning (DRL) for Robust Frequency Control', 
    link: '#', 
    source: 'Science Journal', 
    date: '2026-03-08', 
    isHighlight: false,
    summary: 'MIT researchers proposed an "Adversarial Training" framework. The DRL controller maintains 49.8-50.2Hz frequency even under cyber-attacks or sensor failures, outperforming traditional PID controllers.' 
  },
  { 
    title: 'Llama-4 Micro-tuned for VDA-Agent Outperforms Human Traders', 
    link: '#', 
    source: 'FinAI', 
    date: '2026-03-08', 
    isHighlight: false,
    summary: 'An AI agent trained on electricity market policy documents captured 40% more non-linear arbitrage opportunities than traditional linear models during a 30-day live trading simulation.' 
  }
];

const MagicBento = ({
  textAutoHide = true,
  enableStars = true,
  enableSpotlight = true,
  enableBorderGlow = true,
  disableAnimations = false,
  spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
  particleCount = DEFAULT_PARTICLE_COUNT,
  enableTilt = false,
  glowColor = DEFAULT_GLOW_COLOR,
  clickEffect = true,
  enableMagnetism = true,
  // news props
  newsFeedUrl = null, // optional RSS/Atom feed URL (will be fetched via proxy if needed)
  newsItems = null // optional array of news items {title, link, source, date, summary}
}) => {
  const gridRef = useRef(null);
  const isMobile = useMobileDetection();
  const shouldDisableAnimations = disableAnimations || isMobile;
  const [news, setNews] = useState(newsItems || defaultSeedNews);

  useEffect(() => {
    let cancelled = false;

    const parseXml = xmlText => {
      try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(xmlText, 'application/xml');
        const items = Array.from(doc.querySelectorAll('item, entry')).slice(0, 8).map(node => {
          const title = node.querySelector('title')?.textContent || 'Untitled';
          const link = node.querySelector('link')?.getAttribute('href') || node.querySelector('link')?.textContent || '#';
          const pubDate = node.querySelector('pubDate')?.textContent || node.querySelector('updated')?.textContent || '';
          const desc = node.querySelector('description')?.textContent || node.querySelector('summary')?.textContent || '';
          const source = node.querySelector('source')?.textContent || '';
          return { title: title.trim(), link: link.trim(), date: pubDate.trim(), summary: desc.trim(), source: source.trim() };
        });
        return items;
      } catch (e) {
        return [];
      }
    };

    const fetchFeed = async url => {
      try {
        // Prefer proxy endpoint if available under same origin
        const proxyPrefix = '/rss?url=';
        const fetchUrl = url.startsWith('http') ? `${proxyPrefix}${encodeURIComponent(url)}` : url;
        const res = await fetch(fetchUrl);
        if (!res.ok) throw new Error('Fetch failed');
        const text = await res.text();
        const items = parseXml(text);
        if (!cancelled && items.length) setNews(items);
      } catch (err) {
        // ignore - keep fallback
      }
    };

    if (newsFeedUrl) {
      fetchFeed(newsFeedUrl);
    }

    return () => { cancelled = true; };
  }, [newsFeedUrl]);

  return (
    <>
      {enableSpotlight && (
        <GlobalSpotlight
          gridRef={gridRef}
          disableAnimations={shouldDisableAnimations}
          enabled={enableSpotlight}
          spotlightRadius={spotlightRadius}
          glowColor={glowColor}
        />
      )}

      <BentoCardGrid gridRef={gridRef}>
        {cardData.map((card, index) => {
          const baseClassName = `magic-bento-card ${textAutoHide ? 'magic-bento-card--text-autohide' : ''} ${enableBorderGlow ? 'magic-bento-card--border-glow' : ''}`;
          const cardProps = {
            className: baseClassName,
            style: {
              backgroundColor: card.color,
              '--glow-color': glowColor
            }
          };

          if (enableStars) {
            return (
              <ParticleCard
                key={index}
                {...cardProps}
                disableAnimations={shouldDisableAnimations}
                particleCount={particleCount}
                glowColor={glowColor}
                enableTilt={enableTilt}
                clickEffect={clickEffect}
                enableMagnetism={enableMagnetism}
              >
                <div className="magic-bento-card__header">
                  <div className="magic-bento-card__label">{card.label}</div>
                </div>
                <div className="magic-bento-card__content">
                  <h2 className="magic-bento-card__title">{card.title}</h2>
                  <p className="magic-bento-card__description">{card.description}</p>
                </div>
              </ParticleCard>
            );
          }

          return (
            <div
              key={index}
              {...cardProps}
              ref={el => {
                if (!el) return;

                const handleMouseMove = e => {
                  if (shouldDisableAnimations) return;

                  const rect = el.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const y = e.clientY - rect.top;
                  const centerX = rect.width / 2;
                  const centerY = rect.height / 2;

                  if (enableTilt) {
                    const rotateX = ((y - centerY) / centerY) * -10;
                    const rotateY = ((x - centerX) / centerX) * 10;
                    gsap.to(el, {
                      rotateX,
                      rotateY,
                      duration: 0.1,
                      ease: 'power2.out',
                      transformPerspective: 1000
                    });
                  }

                  if (enableMagnetism) {
                    const magnetX = (x - centerX) * 0.05;
                    const magnetY = (y - centerY) * 0.05;
                    gsap.to(el, {
                      x: magnetX,
                      y: magnetY,
                      duration: 0.3,
                      ease: 'power2.out'
                    });
                  }
                };

                const handleMouseLeave = () => {
                  if (shouldDisableAnimations) return;

                  if (enableTilt) {
                    gsap.to(el, {
                      rotateX: 0,
                      rotateY: 0,
                      duration: 0.3,
                      ease: 'power2.out'
                    });
                  }

                  if (enableMagnetism) {
                    gsap.to(el, {
                      x: 0,
                      y: 0,
                      duration: 0.3,
                      ease: 'power2.out'
                    });
                  }
                };

                const handleClick = e => {
                  if (!clickEffect || shouldDisableAnimations) return;

                  const rect = el.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const y = e.clientY - rect.top;

                  const maxDistance = Math.max(
                    Math.hypot(x, y),
                    Math.hypot(x - rect.width, y),
                    Math.hypot(x, y - rect.height),
                    Math.hypot(x - rect.width, y - rect.height)
                  );

                  const ripple = document.createElement('div');
                  ripple.style.cssText = `
                    position: absolute;
                    width: ${maxDistance * 2}px;
                    height: ${maxDistance * 2}px;
                    border-radius: 50%;
                    background: radial-gradient(circle, rgba(${glowColor}, 0.4) 0%, rgba(${glowColor}, 0.2) 30%, transparent 70%);
                    left: ${x - maxDistance}px;
                    top: ${y - maxDistance}px;
                    pointer-events: none;
                    z-index: 1000;
                  `;

                  el.appendChild(ripple);

                  gsap.fromTo(
                    ripple,
                    {
                      scale: 0,
                      opacity: 1
                    },
                    {
                      scale: 1,
                      opacity: 0,
                      duration: 0.8,
                      ease: 'power2.out',
                      onComplete: () => ripple.remove()
                    }
                  );
                };

                el.addEventListener('mousemove', handleMouseMove);
                el.addEventListener('mouseleave', handleMouseLeave);
                el.addEventListener('click', handleClick);
              }}
            >
              <div className="magic-bento-card__header">
                <div className="magic-bento-card__label">{card.label}</div>
              </div>
              <div className="magic-bento-card__content">
                <h2 className="magic-bento-card__title">{card.title}</h2>
                <p className="magic-bento-card__description">{card.description}</p>
              </div>
            </div>
          );
        })}
      </BentoCardGrid>
      {/* News panel inserted below the grid */}
      <div className="magic-bento-news">
        <div className="magic-bento-news__header">Latest news</div>
        <ul className="magic-bento-news__list">
          {news && news.map((n, i) => (
            <li key={i} className={`magic-bento-news__item ${n.source === 'VDA Lab' ? 'vda-lab-highlight' : ''}`}>
              <a href={n.link || '#'} target="_blank" rel="noreferrer" className="magic-bento-news__link">
                <div className="magic-bento-news__title">{n.title}</div>
                <div className="magic-bento-news__meta">{n.source || n.date}</div>
                <div className="magic-bento-news__summary">{n.summary}</div>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default MagicBento;
