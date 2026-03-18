import { useI18n } from '../i18n/I18nContext';

export default function VdeskPage() {
  const { t } = useI18n();
  const sections = t('vdeskPage.sections');

  return (
    <section className="content-wrap route-page">
      <div className="ds-header">
        <div className="ds-chip">{t('common.chips.vdesk')}</div>
        <h1>{t('vdeskPage.title')}</h1>
        <p>{t('vdeskPage.intro')}</p>
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
    </section>
  );
}
