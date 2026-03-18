import { useI18n } from '../i18n/I18nContext';

export default function DesignSystemPage() {
  const { t } = useI18n();
  const colors = t('designSystemPage.colors', []);
  const typography = t('designSystemPage.typography', []);

  return (
    <section className="content-wrap route-page">
      <div className="ds-header">
        <div className="ds-chip">{t('common.chips.designSystem')}</div>
        <h1>{t('designSystemPage.title')}</h1>
        <p>{t('designSystemPage.intro')}</p>
      </div>

      <div className="ds-grid">
        <article className="ds-card">
          <h3>{t('designSystemPage.colorTitle')}</h3>
          <ul className="ds-token-list">
            {colors.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
        <article className="ds-card">
          <h3>{t('designSystemPage.typographyTitle')}</h3>
          <ul className="ds-token-list">
            {typography.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  );
}
