import React from 'react';
import { Link } from 'react-router-dom';
import SloganImg1 from '../../logo.png';
import SloganImg2 from '../../Full name.png';
import SloganImg3 from '../../Slogan.svg.png';
import TextType from '../components/reactbits/TextType';
import MagicRings from '../components/reactbits/MagicRings';
import TradingChart from '../components/TradingChart';
import AnimatedBarChart from '../components/AnimatedBarChart';
import MagicBento from '../components/reactbits/MagicBento';
import { useI18n } from '../i18n/I18nContext';

const SloganImages = ({ count = 5 }) => {
  const imgs = [SloganImg1, SloganImg2, SloganImg3];
  const items = [];
  // create repeated sequence for smooth looping
  const repeats = Math.max(3, count);
  for (let r = 0; r < repeats; r++) {
    for (let i = 0; i < imgs.length; i++) {
      items.push(imgs[i]);
    }
  }

  const doubled = items.concat(items);

  return (
    <div className="slogan-track-wrap">
      <div className="slogan-track" role="presentation">
        {doubled.map((src, idx) => (
          <img
            key={`${idx}-${src}`}
            src={src}
            alt={`slogan-${idx}`}
            className="slogan-item-giant"
            style={{ filter: 'invert(1) brightness(2)' }}
          />
        ))}
      </div>
    </div>
  );
};

const GlobalHardcoreStyle = () => (
  <style>{`
    :root {
      --cyber-white: rgba(255, 255, 255, 0.85);
      --glass-bg: rgba(255, 255, 255, 0.03);
      --glass-border: rgba(255, 255, 255, 0.12);
    }

    body, html {
      background-color: #000 !important;
      margin: 0;
      padding: 0;
      color: #fff;
      font-family: Arial, Helvetica, sans-serif;
      overflow-x: hidden;
      letter-spacing: 0.05em;
    }


    .btn-outline {
    background: rgba(255, 255, 255, 0.05) !important;
    backdrop-filter: blur(12px) saturate(180%) !important;
    -webkit-backdrop-filter: blur(12px) saturate(180%);
    color: #fff;
    font-size: 1rem;
    font-family: Arial, Helvetica, sans-serif;
    letter-spacing: 0.12em;
    border: 1px solid rgba(255, 255, 255, 0.2) !important;
    padding: 12px 30px;
    text-decoration: none;
    font-weight: 900;
    text-transform: uppercase;
    transition: all 0.3s ease !important;
    display: inline-block;
    border-radius: 50px; 
}

    .btn-outline:hover {
      background: rgba(255, 255, 255, 0.15) !important;
      border-color: rgba(255, 255, 255, 0.4) !important;
      transform: translateY(-2px);
    }

    .slogan-bar-wrap {
      width: 100vw;
      overflow: hidden;
      background: transparent !important;
      padding: 60px 0;
      border-top: none;
      border-bottom: none;
      display: flex;
      z-index: 10;
    }

    .slogan-track-wrap { width: 100%; overflow: hidden; }

    .slogan-track {
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      will-change: transform;
      align-items: center;
      gap: 40px;
      animation: marquee 28s linear infinite;
    }

    @keyframes marquee {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }

    .slogan-item-giant {
      height: 250px;
      margin: 0 40px;
      flex-shrink: 0;
      object-fit: contain;
    }
    
    .magic-rings-container {
      position: fixed !important;
      inset: 0;
      width: 100vw;
      height: 100vh;
      z-index: 0 !important;
      pointer-events: none;
      background: transparent !important;
    }

    section {
      position: relative;
      z-index: 10;
    }

    .dark-zone, section, .insights-shell, .slogan-bar-wrap, .slogan-track-wrap {
      background: transparent !important;
    }

    .dark-zone {
      position: relative;
      z-index: 10;
      background: transparent !important;
    }

    .insights-shell {
      background: transparent !important;
      color: #fff;
      border-top: none;
      border-bottom: none;
      padding: 80px 40px;
      position: relative;
      z-index: 5;
    }

    .insights-wrap {
      max-width: 1600px;
      margin: 0 auto;
    }

    .insights-title {
      font-size: clamp(2.1rem, 5vw, 4.5rem);
      margin: 16px 0 14px;
      font-weight: 900;
      line-height: 1.05;
      letter-spacing: 0.01em;
      background: none;
      color: #fff;
      -webkit-text-stroke: 0.6px #fff;
      text-transform: uppercase;
    }

    .insights-sub {
      max-width: 900px;
      color: #666;
      font-size: 1.03rem;
      line-height: 1.75;
      margin-bottom: 30px;
    }

    .insights-grid-3 {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 14px;
      margin-bottom: 24px;
    }

    .insights-card {
      background: var(--glass-bg) !important;
      backdrop-filter: blur(12px) saturate(150%);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid var(--glass-border) !important;
      border-radius: 0 !important;
      padding: 24px;
      position: relative;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .insights-card::before {
      content: "";
      position: absolute;
      top: -1px; left: -1px;
      width: 10px; height: 10px;
      border-top: 2px solid #fff;
      border-left: 2px solid #fff;
    }

    .insights-card h3 {
      margin: 0 0 8px;
      font-size: 1.15rem;
      color: #fff;
      letter-spacing: 0.02em;
    }

    .insights-card p {
      margin: 0;
      color: var(--cyber-white);
      font-size: 0.93rem;
      line-height: 1.65;
    }

    .insights-split {
      display: grid;
      grid-template-columns: 1.35fr 1fr;
      gap: 14px;
      margin-bottom: 14px;
    }

    .insights-kpi {
      background: rgba(255, 255, 255, 0.03) !important;
      backdrop-filter: blur(8px);
      border: 1px solid rgba(255, 255, 255, 0.1) !important;
      border-radius: 0;
      padding: 22px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
    }

    .insights-kpi .label {
      font-size: 0.78rem;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #fff;
      margin-bottom: 8px;
    }

    .insights-kpi .value {
      font-size: 2.6rem;
      font-weight: 900;
      color: #fff;
      line-height: 1;
    }

    .insights-kpi .tag {
      margin-top: 10px;
      background: transparent;
      border: 1px solid #333;
      color: #fff;
      font-size: 0.75rem;
      padding: 4px 10px;
      border-radius: 0;
    }

    .insights-flow {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 14px;
      margin-top: 14px;
    }

    .insights-divider-title {
      margin: 28px 0 14px;
      padding-left: 12px;
      border-left: 3px solid #fff;
      font-size: 1.15rem;
      color: #f8fafc;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }

    .insights-cost-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px;
      margin-top: 8px;
    }

    .insights-bars {
      display: grid;
      gap: 10px;
      margin-top: 8px;
    }

    .insights-bar-row {
      display: grid;
      gap: 6px;
    }

    .insights-bar-label {
      font-size: 0.78rem;
      color: #666;
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }

    .insights-stack {
      display: flex;
      height: 22px;
      border-radius: 0;
      overflow: hidden;
      border: 1px solid #333;
      background: #000;
    }

    .insights-legends {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 10px;
      font-size: 0.78rem;
      color: #666;
    }

    .insights-legends span {
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }

    .insights-dot {
      width: 9px;
      height: 9px;
      border-radius: 0;
      display: inline-block;
      border: 1px solid #333;
      background: #fff;
    }

    .insights-card:hover {
      background: rgba(255, 255, 255, 0.1) !important;
      border-color: rgba(255, 255, 255, 0.4) !important;
      transform: translateY(-5px);
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    }

    .insights-card:hover h3 { color: #fff !important; }
    .insights-card:hover p { color: var(--cyber-white) !important; }
    .insights-card:hover .insights-vol-fill { background: linear-gradient(90deg,#000,#444) !important; }

    .hero-title, .insights-title {
      color: #fff;
      text-shadow: 0 0 20px rgba(255,255,255,0.2);
    }

    .hero-grid {
      width: min(1240px, 94vw);
      margin: 0 auto;
      display: grid;
      grid-template-columns: minmax(240px, 0.82fr) minmax(420px, 1.18fr);
      grid-template-areas:
        "brand type"
        "actions actions";
      align-items: center;
      align-content: center;
      column-gap: clamp(20px, 4.4vw, 76px);
      row-gap: clamp(10px, 2.2vh, 26px);
      position: relative;
      overflow: visible;
    }

    .hero-grid::before {
      content: "";
      position: absolute;
      left: 0;
      right: 0;
      bottom: -18px;
      height: 1px;
      background: linear-gradient(90deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.42), rgba(255, 255, 255, 0.08));
    }

    .hero-name-large {
      grid-area: brand;
      margin: 0;
      font-size: clamp(3.2rem, 7.4vw, 7rem);
      font-weight: 900;
      line-height: 0.84;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: rgba(255, 255, 255, 0.12);
      -webkit-text-stroke: 1px rgba(255, 255, 255, 0.92);
      text-shadow: 0 0 26px rgba(255, 255, 255, 0.14);
      user-select: none;
      pointer-events: none;
      display: grid;
      justify-items: center;
      gap: 0.01em;
      transform: skewX(-7deg);
    }

    .hero-name-vda {
      display: block;
      transform: translateX(-0.14em);
    }

    .hero-name-lab {
      display: block;
      margin-left: 1.62ch;
      color: #4ACC29;
      -webkit-text-stroke: 1px rgba(74, 204, 41, 0.92);
      text-shadow: 0 0 22px rgba(74, 204, 41, 0.56);
    }

    .hero-type-shell {
      width: min(100%, 980px);
      min-height: clamp(92px, 13vw, 190px);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto;
      padding: 0.08em 0 0.18em;
      overflow: visible;
    }

    .hero-type-shell .text-type {
      width: auto;
      max-width: 100%;
      display: inline-block;
      text-align: center;
      white-space: normal;
      line-height: 1.08;
    }

    .hero-title {
      grid-area: type;
      margin: 0 !important;
      font-size: clamp(1.8rem, 3.6vw, 4rem) !important;
      font-weight: 600 !important;
      line-height: 1.08;
      text-align: center;
      letter-spacing: 0.02em;
    }

    .hero-actions {
      grid-area: actions;
      justify-self: center;
    }

    .hero-cta-row {
      justify-content: center !important;
      flex-direction: row;
      align-items: center;
      gap: 14px !important;
      width: auto;
    }

    .hero-cta-row .btn-outline {
      min-width: 172px;
      text-align: center;
    }

    @media (max-width: 768px) {
      .hero-grid {
        grid-template-columns: 1fr;
        grid-template-areas:
          "brand"
          "type"
          "actions";
        row-gap: 14px;
      }

      .hero-name-large {
        font-size: clamp(2.1rem, 12vw, 4rem);
        letter-spacing: 0.06em;
        justify-items: center;
        transform: none;
      }

      .hero-type-shell {
        min-height: clamp(70px, 18vw, 110px);
        justify-content: center;
      }

      .hero-type-shell .text-type,
      .hero-title {
        text-align: center;
      }

      .hero-actions {
        justify-self: center;
      }

      .hero-cta-row {
        justify-content: center !important;
        flex-direction: row;
        align-items: center;
        flex-wrap: wrap;
      }
    }

    .insights-renew-grid {
      display: grid;
      grid-template-columns: 1.2fr 1fr;
      gap: 14px;
      margin-top: 8px;
    }

    .insights-vol-bars {
      display: grid;
      gap: 12px;
      margin-top: 10px;
    }

    .insights-vol-row {
      display: grid;
      grid-template-columns: 82px 1fr 56px;
      align-items: center;
      gap: 10px;
      font-size: 0.82rem;
      color: #666;
    }

    .insights-vol-meter {
      height: 14px;
      border-radius: 999px;
      background: #111827;
      border: 1px solid #334155;
      overflow: hidden;
    }

    .insights-vol-fill {
      height: 100%;
      background: linear-gradient(90deg, #fff, #ccc);
    }

    .insights-card--vda {
      min-height: 160px;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    @media (max-width: 1100px) {
      .insights-grid-3 {
        grid-template-columns: 1fr;
      }

      .insights-split {
        grid-template-columns: 1fr;
      }

      .insights-flow {
        grid-template-columns: 1fr;
      }

      .insights-cost-grid {
        grid-template-columns: 1fr;
      }

      .insights-renew-grid {
        grid-template-columns: 1fr;
      }
    }

    /* TeamSection shrink to 70% on desktop, auto-adapt on small screens */
    .team-section {
      transform: scale(0.7);
      transform-origin: top center;
      gap: 50px;
      padding: 24px 12px;
      max-width: 1000px;
      margin: 0 auto;
    }

    @media (max-width: 900px) {
      .team-section {
        transform: none !important;
        gap: 16px !important;
        padding: 20px 12px !important;
      }

      .team-section > div {
        flex: 1 1 100% !important;
        max-width: 100% !important;
      }
    }

    /* Mobile specific adjustments */
    @media (max-width: 768px) {
      .insights-grid { grid-template-columns: 1fr !important; gap: 16px !important; }
      .insights-title { font-size: 2.5rem !important; line-height: 1.1; }
      .slogan-item-giant { height: 140px !important; margin: 0 18px !important; }
      .btn-outline { padding: 12px 22px !important; }
      .team-section { transform: none !important; }
      .team-section { flex-direction: column !important; align-items: center !important; gap: 60px !important; }
      .team-section > div { width: 100% !important; max-width: 340px !important; }
      .insights-shell { padding: 40px 18px !important; }
    }
  `}</style>
);

const TRANSPARENT_BG_STYLE = { background: 'transparent' };
const CONTAINER_1200_CENTER_STYLE = { maxWidth: 1200, margin: '0 auto' };
const CORE_ACCESS_SECTION_STYLE = { padding: '80px 20px', position: 'relative', zIndex: 5 };
const LAB_SECTION_STYLE = { background: 'transparent', padding: '100px 0', minHeight: '100vh', display: 'block' };

export default function HomePage() {
  const { lang, t } = useI18n();
  const insightStages = t('homePage.trading.insightStages');
  const costRows = t('homePage.trading.costRows');
  const tradingCards = t('homePage.trading.cards');
  const coreCards = t('homePage.coreCards');
  const vdaItems = t('homePage.vdaItems');
  const vdaGroups = t('homePage.vdaGroups');
  const [isMobile, setIsMobile] = React.useState(typeof window !== 'undefined' && window.innerWidth < 768);
  React.useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const heroSectionStyle = {
    height: isMobile ? 'calc(100vh - 60px)' : 'calc(100vh - 84px)',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'transparent',
    color: '#ffffff',
    fontFamily: 'var(--font-family-primary), Arial, Helvetica, sans-serif'
  };

  const heroContentStyle = {
    position: 'relative',
    textAlign: 'center',
    zIndex: 1,
    padding: '40px',
    background: 'transparent',
    backdropFilter: 'none',
    borderRadius: '24px'
  };

  const heroButtonRowStyle = {
    display: 'flex',
    gap: isMobile ? '16px' : '20px',
    justifyContent: 'center'
  };

  const aboutCardInlineStyle = {
    background: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid #333',
    backdropFilter: 'none'
  };

  const whiteCardTitleStyle = { marginTop: 0, color: '#fff' };
  const whiteCardDescStyle = { marginTop: '8px', color: '#fff' };
  const vdaGroupTitleStyle = {
    margin: '0 0 12px',
    color: '#fff',
    fontSize: isMobile ? '1.05rem' : '1.15rem',
    letterSpacing: '0.04em',
    textTransform: 'uppercase'
  };

  const getVdaGroupCardSpan = (index) => {
    if (isMobile) return 'span 1';
    if (index === 0) return 'span 6';
    return 'span 2';
  };

  const getVdaTitleStyle = {
    fontSize: isMobile ? '1.2rem' : '1.4rem',
    margin: 0,
    marginBottom: '8px',
    fontWeight: 800,
    color: '#fff'
  };

  const vdaDescStyle = {
    margin: 0,
    lineHeight: 1.5,
    color: '#fff'
  };

  const aboutIndexStyle = {
    width: 30,
    height: 30,
    borderRadius: 0,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    fontSize: '0.86rem',
    fontWeight: 900,
    color: '#000',
    border: '1px solid #333',
    background: '#fff'
  };

  const aboutH4Style = {
    margin: '0 0 6px',
    fontSize: '1rem',
    color: '#fff'
  };

  const aboutListStyle = {
    margin: 0,
    paddingLeft: 16,
    fontSize: '0.88rem',
    lineHeight: 1.7,
    color: '#fff'
  };

  const vdaItemMap = vdaItems.reduce((acc, item) => {
    acc[item.label] = item;
    return acc;
  }, {});

  return (
    <>
      <GlobalHardcoreStyle />

      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}>
        <MagicRings
          color="#ffffff"
          colorTwo="#4a5d48"
          ringCount={isMobile ? 4 : 10}
          speed={0.8}
          attenuation={10}
          lineThickness={1.5}
          baseRadius={0.4}
          radiusStep={0.15}
          opacity={0.6}
          followMouse={!isMobile}
        />
      </div>
      <div className="dark-zone" style={TRANSPARENT_BG_STYLE}>
      
        <div style={TRANSPARENT_BG_STYLE}>
          <section
            className="hero-hardcore hero-section"
            style={heroSectionStyle}
          >
            <div style={heroContentStyle}>
              <div className="hero-grid">
                <p className="hero-name-large"><span className="hero-name-vda">VDA</span><span className="hero-name-lab">LAB</span></p>
                <h1 className="hero-title" style={{ fontSize: '2vw', fontWeight: '400', marginBottom: '40px' }}>
                  <span className="hero-type-shell">
                    <TextType
                      text={lang === 'zh' ? ['预 判', '超 额 收 益', '顺 势 交 易'] : ["A N T I C I P A T E", "A L P H A", "T R A D E  T H E  F L O W"]}
                      typingSpeed={60}
                      cursorBlinkDuration={0.3}
                      stabilizeWidth
                    />
                  </span>
                </h1>

                <div className="hero-actions">
                  <div style={heroButtonRowStyle} className="hero-cta-row">
                    <Link to="/get-quote" className="btn-outline">
                      {t('homePage.hero.quoteButton')}
                    </Link>
                    <Link to="/about" className="btn-outline">
                      {t('homePage.hero.aboutButton')}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
            <section id="power-news-section" style={{ padding: '40px', background: 'transparent', marginTop: '20px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <h3 style={{ fontSize: isMobile ? '2.6rem' : '4rem', color: '#fff', marginBottom: '12px' }}>{t('homePage.powerNewsTitle')}
          </h3>
          <MagicBento 
            textAutoHide={true}
            enableStars
            enableSpotlight
            enableBorderGlow={true}
            enableTilt={false}
            enableMagnetism={false}
            clickEffect
            spotlightRadius={100}
            particleCount={12}
            glowColor="132, 0, 255"
            disableAnimations={false}
          />
        </div>
      </section>        
      <section id="trading-solutions" className="insights-shell">
        <div className="insights-wrap">

          <h2 className="insights-title">{t('homePage.trading.title')}</h2>

          <p className="insights-sub">
            {t('homePage.trading.intro')}
          </p>

          <div className="insights-split">
            <div className="insights-card">
              <h3>{t('homePage.trading.chartTitle')}</h3>
              <p style={{ marginBottom: 12 }}>
                {t('homePage.trading.chartDesc')}
              </p>
              <div style={{ minHeight: isMobile ? 300 : 420 }}>
                <TradingChart />
              </div>
            </div>

            <div className="insights-kpi">
              <div className="label">{t('homePage.trading.maxSpread')}</div>
              <div className="value">¥1.5/kWh</div>
              <div className="tag">{t('homePage.trading.maxSpreadTag')}</div>
              <p style={{ marginTop: 14, color: '#94a3b8', fontSize: '0.85rem', lineHeight: 1.7 }}>
                {t('homePage.trading.maxSpreadNote')}
              </p>
            </div>
          </div>

          <div className="insights-grid-3">
            {tradingCards.map((item) => (
              <div key={item.title} className="insights-card">
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="insights-flow">
            {insightStages.map((s) => (
              <div key={s.idx} className="insights-card" style={aboutCardInlineStyle}>
                <div className="idx" style={aboutIndexStyle}>{s.idx}</div>
                <h4 style={aboutH4Style}>{s.title}</h4>
                <ul style={aboutListStyle}>
                  {s.items.map((it, i) => <li key={i}>{it}</li>)}
                </ul>
              </div>
            ))}
          </div>

          <h3 className="insights-divider-title">{t('homePage.trading.costStackTitle')}</h3>
          <div className="insights-cost-grid">
            <div className="insights-card">
              <h3>{t('homePage.trading.costCompositionTitle')}</h3>
              <p>{t('homePage.trading.costCompositionDesc')}</p>

              <div className="insights-bars">
                {costRows.map((row) => {
                  const total = row.e + row.c + row.g + row.p;
                  return (
                    <div key={row.label} className="insights-bar-row">
                      <div className="insights-bar-label">{row.label}</div>
                      <div className="insights-stack">
                        <div style={{ width: `${(row.e / total) * 100}%`, background: '#fff' }} />
                        <div style={{ width: `${(row.c / total) * 100}%`, background: '#ccc' }} />
                        <div style={{ width: `${(row.g / total) * 100}%`, background: '#999' }} />
                        <div style={{ width: `${(row.p / total) * 100}%`, background: '#666' }} />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="insights-legends">
                <span><i className="insights-dot" style={{ background: '#fff' }} />{t('homePage.trading.legends.energy')}</span>
                <span><i className="insights-dot" style={{ background: '#ccc' }} />{t('homePage.trading.legends.capacity')}</span>
                <span><i className="insights-dot" style={{ background: '#aaa' }} />{t('homePage.trading.legends.greenCarbon')}</span>
                <span><i className="insights-dot" style={{ background: '#666' }} />{t('homePage.trading.legends.gridPolicy')}</span>
              </div>
            </div>

            <div className="insights-card">
              <h3>{t('homePage.trading.businessSignalTitle')}</h3>
              <p>{t('homePage.trading.businessSignalDesc')}</p>
            </div>
          </div>

          <h3 className="insights-divider-title">{t('homePage.trading.renewablesVolumeTitle')}</h3>
          <div className="insights-renew-grid">
            <div className="insights-card">
              <h3>{t('homePage.trading.correlationTitle')}</h3>
              <p style={{ marginBottom: 10 }}>
                {t('homePage.trading.correlationDesc')}
              </p>

              <div className="insights-card">
                  <h3>{t('homePage.trading.strategySimulationTitle')}</h3>
                  <p style={{ marginBottom: 20 }}>
                    {t('homePage.trading.strategySimulationDesc')}
                  </p>

                  <div style={{ background: '#000000', border: '1px solid #1a1a1a', padding: '10px' }}>
                    <AnimatedBarChart />
                  </div>
                </div>
            </div>

            <div className="insights-card">
              <h3>{t('homePage.trading.volumeGrowthTitle')}</h3>
              <p style={{ marginBottom: 10 }}>{t('homePage.trading.volumeGrowthDesc')}</p>
              <div className="insights-vol-bars">
                {[
                  { year: '2024', value: 260, pct: 18 },
                  { year: '2025', value: 500, pct: 51 },
                  { year: '2026[est]', value: 680, pct: 80 }
                ].map((row) => (
                  <div key={row.year} className="insights-vol-row">
                    <span>{row.year}</span>
                    <div className="insights-vol-meter">
                      <div className="insights-vol-fill" style={{ width: `${row.pct}%` }} />
                    </div>
                    <span>{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="technical-resources" className="insights-shell" style={CORE_ACCESS_SECTION_STYLE}>
        <div className="insights-wrap" style={CONTAINER_1200_CENTER_STYLE}>
          <p className="insights-divider-title" style={{fontSize: '80px', fontWeight: 'bold', fontFamily: 'Arial, sans-serif', textAlign: 'center' }}>{t('homePage.coreAccessTitle')}</p>

          <div className="insights-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', marginTop: '24px' }}>
            {coreCards.map((item) => (
              <div key={item.title} className="insights-card" style={aboutCardInlineStyle}>
                <h3 style={whiteCardTitleStyle}>{item.title}</h3>
                <p style={whiteCardDescStyle}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section id="infrastructure-status" className="insights-shell" style={LAB_SECTION_STYLE}>
        <p className="insights-divider-title" style={{
          fontSize: 'min(80px, 12vw)',
          fontWeight: 'bold',
          fontFamily: 'Arial, sans-serif',
          textAlign: 'center',
          margin: '40px 0',
          color: '#fff'
        }}>
          {t('homePage.labHeading')}
        </p>

        <div style={{ ...CONTAINER_1200_CENTER_STYLE, padding: '40px 20px' }}>
          <div style={{ display: 'grid', gap: '26px' }}>
            {vdaGroups.map((group) => {
              const groupItems = group.labels
                .map((label) => vdaItemMap[label])
                .filter(Boolean);

              return (
                <div key={group.title}>
                  <h3 style={vdaGroupTitleStyle}>{group.title}</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(12, minmax(0, 1fr))', gap: '16px', alignItems: 'stretch' }}>
                    {groupItems.map((it, index) => (
                      <div
                        key={it.label}
                        className="insights-card insights-card--vda"
                        style={{
                          ...aboutCardInlineStyle,
                          padding: isMobile ? '18px' : '24px',
                          gridColumn: getVdaGroupCardSpan(index)
                        }}
                      >
                        <h3 style={getVdaTitleStyle}>{it.label}</h3>
                        <p style={vdaDescStyle}>{it.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>


      <section className="slogan-bar-wrap">
        <SloganImages count={5} />
      </section>
      
      <footer
        id="institutional-footer"
        style={{
          padding: isMobile ? '60px 20px 30px' : '100px 80px 40px',
          background: '#000',
          color: '#666',
          borderTop: '1px solid #1a1a1a',
          fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
        }}
      >
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr 1fr',
              gap: isMobile ? '28px' : '64px',
              marginBottom: isMobile ? '54px' : '80px'
            }}
          >
            <div style={{ gridColumn: 'span 1' }}>
              <div style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 700, letterSpacing: '2px', marginBottom: '20px' }}>
                {t('homePage.footer.headline')}
              </div>
              <p style={{ fontSize: '1rem', lineHeight: 1.85, color: '#b3aaaa', maxWidth: 460, margin: 0 }}>
                {t('homePage.footer.description')}
              </p>
            </div>

            <div>
              <div style={{ color: '#eee', fontSize: '1rem', fontWeight: 800, letterSpacing: '1.5px', marginBottom: '25px', textTransform: 'uppercase' }}>
                {t('homePage.footer.coreTitle')}
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.82rem', lineHeight: 2.4 }}>
                {t('homePage.footer.coreLinks').map((label) => (
                  <li key={label}><a href="#trading-solutions" style={{ color: '#8a8a8a', textDecoration: 'none' }}>{label}</a></li>
                ))}
              </ul>
            </div>

            <div>
              <div style={{ color: '#eee', fontSize: '1rem', fontWeight: 800, letterSpacing: '1.5px', marginBottom: '25px', textTransform: 'uppercase' }}>
                {t('homePage.footer.systemTitle')}
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.82rem', lineHeight: 2.4 }}>
                <li><a href="#technical-resources" style={{ color: '#8a8a8a', textDecoration: 'none' }}>{t('homePage.footer.systemLinks')[0]}</a></li>
                <li><a href="#technical-resources" style={{ color: '#8a8a8a', textDecoration: 'none' }}>{t('homePage.footer.systemLinks')[1]}</a></li>
                <li><a href="#infrastructure-status" style={{ color: '#8a8a8a', textDecoration: 'none' }}>{t('homePage.footer.systemLinks')[2]}</a></li>
                <li><Link to="/lab" style={{ color: '#8a8a8a', textDecoration: 'none' }}>{t('homePage.footer.systemLinks')[3]}</Link></li>
              </ul>
            </div>
          </div>

          <div style={{ padding: '30px 0', borderTop: '1px solid #111', borderBottom: '1px solid #111' }}>
            <p style={{ fontSize: '0.72rem', lineHeight: 1.9, color: '#626262', textAlign: 'justify', margin: 0, letterSpacing: '0.04em' }}>
              {t('homePage.footer.legal')}
            </p>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: isMobile ? 'flex-start' : 'center',
              flexDirection: isMobile ? 'column' : 'row',
              gap: isMobile ? '14px' : '30px',
              paddingTop: '30px',
              fontSize: '0.7rem',
              letterSpacing: '1px'
            }}
          >
            <div style={{ color: '#666' }}>
              {t('homePage.footer.copyright')} <span style={{ color: '#666' }}>{t('homePage.footer.globalOps')}</span>
            </div>
            <div style={{ display: 'flex', gap: isMobile ? '14px' : '30px', color: '#666', flexWrap: 'wrap' }}>
              <Link to="/privacy-policy" style={{ color: '#666', textDecoration: 'none' }}>{t('homePage.footer.privacyPolicy')}</Link>
              <Link to="/terms-of-use" style={{ color: '#666', textDecoration: 'none' }}>{t('homePage.footer.termsOfService')}</Link>
              <span style={{ color: '#fff' }}>{t('homePage.footer.buildTag')}</span>
            </div>
          </div>
        </div>
      </footer>
      </div>
    </>

  );
}