import { useI18n } from '../i18n/I18nContext';

const termsContent = {
  en: {
    title: 'Terms of Use',
    effectiveDate: 'Effective Date: March 2026',
    entity: 'Entity: vdalab.ltd (Shanghai, China)',
    intro:
      'Welcome to vdalab.ltd (hereinafter referred to as "VDA Lab"). By accessing our platform, including but not limited to VDesk, Lab, and API Docs, you agree to comply with and be bound by these Terms of Use.',
    sections: [
      {
        heading: '1. Nature of Service',
        body: [
          'VDA Lab operates as a technology and infrastructure provider for decentralized energy markets.',
          'Core layers include: Market Intelligence (RT-Price, Forecast-X, Weather-AI, Grid-Topology), Trading & Execution (Bidding-Bot, Hedge-Master, Storage-Optim), and Risk & Carbon (Risk-Engine, Carbon-Track, Policy-GPT).',
          'VDA Lab is not a financial advisor, broker, or grid dispatcher. Models and strategy outputs are technical assistance only.'
        ]
      },
      {
        heading: '2. No Warranty of Performance (AS IS)',
        body: [
          'All systems, including VDA-Transformer and Alpha Engine, are provided "AS IS" and "AS AVAILABLE".',
          'We do not guarantee accuracy, completeness, execution results, or profitability of forecasts and strategy outputs.',
          'Electricity spot trading contains substantial risk of loss and is affected by weather, congestion, unit availability, and policy changes.'
        ]
      },
      {
        heading: '3. Intellectual Property and Data Privacy',
        body: [
          'All platform architecture, software modules, and brand assets are proprietary to vdalab.ltd unless otherwise stated.',
          'VDA Lab may use secure computing controls (including TEE-related practices) to protect sensitive data processing workflows.',
          'Users are responsible for legality, ownership, and security classification of data submitted through VDesk or APIs.',
          'A limited, non-transferable license is granted for internal business operations only.'
        ]
      },
      {
        heading: '4. Simulation vs Live Deployment',
        body: [
          'Backtesting or simulated outcomes are not indicative of future performance.',
          'Each user remains fully responsible for capital and operational decisions in live markets.',
          'Stress testing in Lab Sandbox is strongly recommended before production deployment.'
        ]
      },
      {
        heading: '5. Prohibited Conduct',
        body: [
          'You must not reverse engineer proprietary modules or attempt unauthorized extraction of model logic.',
          'You must not use VDA tools for market manipulation or unlawful operations.',
          'You must not bypass logging, monitoring, or anomaly tracing controls.'
        ]
      },
      {
        heading: '6. Regional Compliance (Shanghai / China)',
        body: [
          'Use of the platform must comply with applicable laws and regulations of the People\'s Republic of China and applicable market rules.',
          'This includes relevant unified power market requirements, spot trading rules, and carbon-power linkage frameworks where applicable.'
        ]
      },
      {
        heading: '7. Limitation of Liability',
        body: [
          'To the maximum extent permitted by law, VDA Lab and affiliates are not liable for direct or indirect losses caused by market volatility, negative pricing events, renewable curtailment/cannibalization effects, third-party data errors, or infrastructure downtime.',
          'Users acknowledge and accept market and operational uncertainties in all deployment environments.'
        ]
      },
      {
        heading: '8. System Updates and Modifications',
        body: [
          'VDA Lab may update these Terms at any time.',
          'Current Build Tag: 2026_MAR_REV7 / v3.4.1_STABLE.',
          'Continued use after updates constitutes acceptance of revised Terms.'
        ]
      },
      {
        heading: '9. Contact and Dispute Resolution',
        body: [
          'For legal notices or technical inquiries, please use the Contact page and Global Ops channels.',
          'Disputes shall be governed by applicable laws in the jurisdiction of company registration (Shanghai, China), unless mandatory law requires otherwise.'
        ]
      }
    ],
    acknowledgement:
      'By proceeding to actions such as GET QUOTE or accessing RESEARCH HUB functions, you acknowledge that you have read, understood, and agreed to these Terms.',
    note: 'This Terms page is for operational policy display and does not constitute legal advice.'
  },
  zh: {
    title: '使用条款',
    effectiveDate: '生效日期：2026年3月',
    entity: '主体：vdalab.ltd（中国上海）',
    intro:
      '欢迎使用 vdalab.ltd（以下简称“VDA Lab”）。当您访问我们的平台（包括但不限于 VDesk、Lab、API Docs）时，即表示您同意遵守并受本《使用条款》约束。',
    sections: [
      {
        heading: '1. 服务性质',
        body: [
          'VDA Lab 定位为面向分布式能源市场的技术与基础设施提供方。',
          '核心能力包括：市场情报（RT-Price、Forecast-X、Weather-AI、Grid-Topology）、交易执行（Bidding-Bot、Hedge-Master、Storage-Optim）与风险碳管理（Risk-Engine、Carbon-Track、Policy-GPT）。',
          'VDA Lab 不构成金融顾问、经纪机构或电网调度主体；模型与策略输出仅用于技术辅助。'
        ]
      },
      {
        heading: '2. 不保证条款（按现状提供）',
        body: [
          '包括 VDA-Transformer 与 Alpha Engine 在内的全部系统均按“现状（AS IS）”与“可用（AS AVAILABLE）”提供。',
          '我们不对预测准确性、完整性、执行效果或盈利结果作任何保证。',
          '电力现货交易具有显著亏损风险，结果会受到天气、电网拥堵、机组可用性与政策变化等因素影响。'
        ]
      },
      {
        heading: '3. 知识产权与数据隐私',
        body: [
          '除非另有说明，平台架构、软件模块与品牌资产均为 vdalab.ltd 的专有资产。',
          'VDA Lab 可使用包括 TEE 在内的安全计算机制保护敏感数据处理流程。',
          '用户需对其上传至 VDesk 或 API 的数据之合法性、权属与分级负责。',
          '平台仅授予用户不可转让、有限范围的内部业务使用许可。'
        ]
      },
      {
        heading: '4. 仿真与实盘部署',
        body: [
          '回测或模拟结果不代表未来表现。',
          '用户应对自身资金与运营决策承担全部责任。',
          '建议在进入实盘前，先在 Lab Sandbox 完成充分压力测试。'
        ]
      },
      {
        heading: '5. 禁止行为',
        body: [
          '不得逆向工程平台专有模块，不得非法提取模型逻辑。',
          '不得利用平台工具实施市场操纵或其他违法行为。',
          '不得绕过日志、监控与异常追踪机制。'
        ]
      },
      {
        heading: '6. 区域合规（上海 / 中国）',
        body: [
          '平台使用应符合中华人民共和国适用法律法规及相关市场规则。',
          '包括但不限于统一电力市场规则、现货交易规则、以及适用的碳电价格联动机制。'
        ]
      },
      {
        heading: '7. 责任限制',
        body: [
          '在法律允许的最大范围内，VDA Lab 及关联方不对因市场波动、负电价事件、新能源挤压效应、第三方数据误差、或系统停机导致的直接或间接损失承担责任。',
          '用户应充分理解并接受各类市场与运营不确定性。'
        ]
      },
      {
        heading: '8. 系统更新与条款变更',
        body: [
          'VDA Lab 有权随时更新本条款。',
          '当前构建版本：2026_MAR_REV7 / v3.4.1_STABLE。',
          '更新后继续使用平台视为接受修订条款。'
        ]
      },
      {
        heading: '9. 联系与争议解决',
        body: [
          '如有法律通知或技术咨询，请通过 Contact 页面及 Global Ops 渠道联系。',
          '除强制性法律另有规定外，相关争议适用公司注册地（中国上海）相关法律。'
        ]
      }
    ],
    acknowledgement:
      '当您执行“GET QUOTE”或访问“RESEARCH HUB”等功能时，即表示您已阅读、理解并同意本条款。',
    note: '本页面用于展示运营条款，不构成法律意见。'
  }
};

export default function TermsOfUsePage() {
  const { lang } = useI18n();
  const c = lang === 'zh' ? termsContent.zh : termsContent.en;

  return (
    <section className="content-wrap route-page">
      <div className="ds-header">
        <div className="ds-chip">TERMS OF USE</div>
        <h1>{c.title}</h1>
        <p style={{ marginBottom: 6 }}>{c.effectiveDate}</p>
        <p>{c.entity}</p>
      </div>

      <div className="ds-card" style={{ marginBottom: 14 }}>
        <p style={{ margin: 0 }}>{c.intro}</p>
      </div>

      <div className="ds-grid" style={{ gridTemplateColumns: '1fr' }}>
        {c.sections.map((section) => (
          <article key={section.heading} className="ds-card">
            <h3>{section.heading}</h3>
            <ul className="ds-token-list">
              {section.body.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <div className="ds-card" style={{ marginTop: 14 }}>
        <p style={{ marginTop: 0 }}>{c.acknowledgement}</p>
        <p className="ds-note" style={{ marginBottom: 0 }}>{c.note}</p>
      </div>
    </section>
  );
}
