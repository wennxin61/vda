import { useI18n } from '../i18n/I18nContext';
import ProfileCard from '../components/reactbits/ProfileCard';

const openLinkedIn = () => {
  try { window.open('https://linkedin.com/in/your-profile', '_blank'); } catch (e) {}
};

export default function ContactPage() {
  const { t } = useI18n();
  return (
    <section className="content-wrap route-page">
      <div className="ds-header">
        <div className="ds-chip">{t('common.chips.contact')}</div>
        <h1>{t('contact.title')}</h1>
        <p>{t('contact.intro')}</p>
      </div>

      <div className="ds-grid">
        <article className="ds-card">
          <h3>{t('contact.business')}</h3>
          <ul className="ds-token-list">
            <li>{t('contact.name')}WENHAO XIN</li>
            <li>{t('contact.emailLabel')}: charleswx61@outlook.com</li>
            <li>{t('contact.partnership')}</li>
          </ul>
        </article>
        <article className="ds-card">
          <h3>{t('contact.support')}</h3>
          <ul className="ds-token-list">
            <li>{t('contact.emailLabel')}: littlemonsterzzr@gmail.com</li>
            <li>{t('contact.incident')}</li>
          </ul>
        </article>
      </div>

      <div style={{ marginTop: 28 }}>
        <h2 style={{ marginBottom: 16 }}>{t('contact.teamTitle')}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 18 }}>
          <ProfileCard
            name="Charles Xin"
            title={t('contact.team.chiefTitle')}
            handle="charles w. xin61"
            status={t('contact.team.chiefStatus')}
            contactText={t('contact.team.contactText')}
            avatarUrl="/wechat_20260316191238.png"
            showUserInfo
            enableTilt={true}
            enableMobileTilt
            onContactClick={openLinkedIn}
            behindGlowColor="rgba(132, 0, 255, 0.35)"
            iconUrl="/assets/demo/iconpattern.png"
            behindGlowEnabled
            innerGradient="linear-gradient(145deg, rgba(96, 73, 110, 0.55) 0%, rgba(113, 196, 255, 0.2) 100%)"
          />

          <ProfileCard
            name="Renee Zhang"
            title={t('contact.team.directorTitle')}
            handle="monsterzzr"
            status={t('contact.team.directorStatus')}
            contactText={t('contact.team.contactText')}
            avatarUrl="/wechat_20260316194856.jpg"
            showUserInfo
            enableTilt={true}
            enableMobileTilt
            onContactClick={openLinkedIn}
            behindGlowColor="rgba(0, 242, 255, 0.35)"
            iconUrl="/assets/demo/iconpattern.png"
            behindGlowEnabled
            innerGradient="linear-gradient(145deg, rgba(96, 73, 110, 0.55) 0%, rgba(113, 196, 255, 0.2) 100%)"
          />
        </div>
      </div>
    </section>
  );
}
