import { useI18n } from '../i18n/I18nContext';

export default function AboutPage() {
  const { t } = useI18n();
  const pillars = t('about.pillars', []);
  const principles = t('about.principles', []);
  const milestones = t('about.milestones', []);
  const swatches = t('about.swatches', []);

  return (
    <section className="content-wrap route-page">
      <div className="ds-header">
        <div className="ds-chip">{t('common.chips.about')}</div>
        <h1>{t('about.title')}</h1>
        <p>{t('about.intro')}</p>
      </div>

      <div className="ds-grid">
        {pillars.map((pillar) => (
          <article key={pillar.title} className="ds-card">
            <h3>{pillar.title}</h3>
            <p>{pillar.desc}</p>
          </article>
        ))}
      </div>

      <div className="ds-card ds-swatch-card">
        <h3>{t('about.whatWeSolve')}</h3>
        <div className="ds-swatches">
          {swatches.map((item) => (
            <div key={item.label} className="ds-swatch"><span>{item.label}</span><code>{item.value}</code></div>
          ))}
        </div>
      </div>

      <div className="ds-card">
        <h3>{t('about.operatingPrinciples')}</h3>
        <ul className="ds-token-list">
          {principles.map((principle) => (
            <li key={principle}>{principle}</li>
          ))}
        </ul>
      </div>

      <div className="ds-card">
        <h3>{t('about.milestonesTitle')}</h3>
        <div className="ds-component-grid">
          {milestones.map((m) => (
            <div key={m.year} className="ds-component-item">
              <h4>{m.year}</h4>
              <p>{m.item}</p>
            </div>
          ))}
        </div>
      </div>

      <p className="ds-note">{t('about.note')}</p>
    </section>
  );
}
