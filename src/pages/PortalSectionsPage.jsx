import { useI18n } from '../i18n/I18nContext';

export default function PortalSectionsPage() {
  const { t } = useI18n();
  const cards = t('portalSectionsPage.cards', []);

  return (
    <section className="content-wrap route-page">
      <div className="ds-header">
        <div className="ds-chip">{t('common.chips.portalSections')}</div>
        <h1>{t('portalSectionsPage.title')}</h1>
        <p>{t('portalSectionsPage.intro')}</p>
      </div>

      <div className="ds-grid">
        {cards.map((card) => (
          <article key={card.title} className="ds-card">
            <h3>{card.title}</h3>
            <p>{card.desc}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
