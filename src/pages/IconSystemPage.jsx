import { useI18n } from '../i18n/I18nContext';

export default function IconSystemPage() {
  const { t } = useI18n();
  const categories = t('iconSystemPage.categories', []);
  const guidelines = t('iconSystemPage.guidelines', []);

  return (
    <section className="content-wrap route-page">
      <div className="ds-header">
        <div className="ds-chip">{t('common.chips.iconSystem')}</div>
        <h1>{t('iconSystemPage.title')}</h1>
        <p>{t('iconSystemPage.intro')}</p>
      </div>

      <div className="ds-grid">
        <article className="ds-card">
          <h3>{t('iconSystemPage.categoriesTitle')}</h3>
          <ul className="ds-token-list">
            {categories.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
        <article className="ds-card">
          <h3>{t('iconSystemPage.guidelinesTitle')}</h3>
          <ul className="ds-token-list">
            {guidelines.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  );
}
