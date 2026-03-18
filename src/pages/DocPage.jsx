import ShinyText from '../components/reactbits/ShinyText';
import { useI18n } from '../i18n/I18nContext';

export default function DocPage() {
  const { t } = useI18n();
  const title = t('common.chips.doc');
  const description = t('docPage.fallbackDescription');
  const sections = t('docPage.sections', []);
  const componentCards = t('docPage.componentCards', []);
  const paletteItems = t('docPage.paletteItems', []);

  return (
    <section className="content-wrap route-page">
      <div className="ds-header">
        <div className="ds-chip">VDA STYLE SPEC</div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>

      <div className="ds-grid">
        {sections.map((section) => (
          <article key={section.title} className="ds-card">
            <h3>{section.title}</h3>
            <ul className="ds-token-list">
              {section.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <div className="ds-card ds-swatch-card">
        <h3>{t('docPage.corePaletteTitle')}</h3>
        <div className="ds-swatches">
          <div className="ds-swatch"><span>{paletteItems[0]}</span><code>#000000</code></div>
          <div className="ds-swatch"><span>{paletteItems[1]}</span><code>rgba(255,255,255,0.04)</code></div>
          <div className="ds-swatch"><span>{paletteItems[2]}</span><code>rgba(255,255,255,0.18)</code></div>
          <div className="ds-swatch"><span>{paletteItems[3]}</span><code>#FFFFFF</code></div>
          <div className="ds-swatch"><span>{paletteItems[4]}</span><code>#9CA3AF</code></div>
        </div>
      </div>

      <div className="ds-card">
        <h3>{t('docPage.componentPriority')}</h3>
        <div className="ds-component-grid">
          {componentCards.map((card) => (
            <div key={card.name} className="ds-component-item">
              <h4>{card.name}</h4>
              <p>{card.usage}</p>
            </div>
          ))}
        </div>
      </div>

      {title === 'Portal Sections' && (
        <div className="ds-shiny-block">
          <ShinyText
            text={t('docPage.shinyText')}
            speed={2.9}
            delay={0.5}
            color="#b5b5b5"
            shineColor="#ffffff"
            spread={150}
            direction="left"
            yoyo={false}
            pauseOnHover={false}
            disabled={false}
          />
        </div>
      )}

      <p className="ds-note">{t('docPage.note')}</p>
    </section>
  );
}
