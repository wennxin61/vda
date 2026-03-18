import { useI18n } from '../i18n/I18nContext';

export default function ComponentsPage() {
  const { t } = useI18n();
  const cards = t('componentsPage.cards', []);

  return (
    <section className="content-wrap route-page">
      <div className="ds-header">
        <div className="ds-chip">{t('common.chips.components')}</div>
        <h1>{t('componentsPage.title')}</h1>
        <p>{t('componentsPage.intro')}</p>
      </div>

      <div className="ds-component-grid">
        {cards.map((card) => (
          <div key={card.name} className="ds-component-item">
            <h4>{card.name}</h4>
            <p>{card.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
