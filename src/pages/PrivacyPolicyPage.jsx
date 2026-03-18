import { useI18n } from '../i18n/I18nContext';

export default function PrivacyPolicyPage() {
  const { lang } = useI18n();

  return (
    <section className="content-wrap route-page">
      <div className="ds-header">
        <div className="ds-chip">PRIVACY POLICY</div>
        <h1>{lang === 'zh' ? '隐私政策' : 'Privacy Policy'}</h1>
        <p>
          {lang === 'zh'
            ? '本页面说明 VDA Lab 在平台运行中对数据处理与安全控制的基本原则。'
            : 'This page outlines VDA Lab baseline principles for data handling and security controls during platform operations.'}
        </p>
      </div>

      <div className="ds-grid" style={{ gridTemplateColumns: '1fr' }}>
        <article className="ds-card">
          <h3>{lang === 'zh' ? '1. 数据范围' : '1. Data Scope'}</h3>
          <ul className="ds-token-list">
            <li>
              {lang === 'zh'
                ? '我们可能处理账户资料、操作日志、API 调用记录与用户提交的数据集。'
                : 'We may process account profile data, operation logs, API call records, and user-submitted datasets.'}
            </li>
            <li>
              {lang === 'zh'
                ? '数据用途包括系统安全、功能交付、故障排查与合规审计。'
                : 'Data is used for system security, service delivery, incident diagnosis, and compliance auditing.'}
            </li>
          </ul>
        </article>

        <article className="ds-card">
          <h3>{lang === 'zh' ? '2. 安全与控制' : '2. Security Controls'}</h3>
          <ul className="ds-token-list">
            <li>
              {lang === 'zh'
                ? '平台采用访问控制、日志追踪与隔离计算机制（含 TEE 相关实践）保护关键数据流程。'
                : 'The platform applies access control, traceable logging, and isolated computing practices (including TEE-related controls) to protect critical data flows.'}
            </li>
            <li>
              {lang === 'zh'
                ? '用户仍需对其上传数据的合法性、完整性与保密级别负责。'
                : 'Users remain responsible for legality, integrity, and confidentiality classification of uploaded data.'}
            </li>
          </ul>
        </article>

        <article className="ds-card">
          <h3>{lang === 'zh' ? '3. 联系方式' : '3. Contact'}</h3>
          <p style={{ margin: 0 }}>
            {lang === 'zh'
              ? '如涉及隐私或数据请求，请通过 Contact 页面联系 Global Ops。'
              : 'For privacy and data requests, please contact Global Ops through the Contact page.'}
          </p>
        </article>
      </div>
    </section>
  );
}
