import { useMemo, useState } from 'react';
import { jsPDF } from 'jspdf';
import { useI18n } from '../i18n/I18nContext';

const MODULES = [
  { key: 'market', en: 'Market Intelligence', zh: '市场情报层', weight: 1.15 },
  { key: 'trading', en: 'Trading and Execution', zh: '交易执行层', weight: 1.35 },
  { key: 'risk', en: 'Risk and Carbon', zh: '风险与碳管理层', weight: 1.05 },
  { key: 'vpp', en: 'Virtual Plant Orchestration', zh: '虚拟电厂编排', weight: 1.5 },
  { key: 'api', en: 'API and Integration', zh: 'API 与系统集成', weight: 0.9 }
];

const ADDONS = [
  { key: 'marl', en: 'MARL Strategy Package', zh: 'MARL 策略包', weight: 0.8 },
  { key: 'tee', en: 'TEE Privacy Module', zh: 'TEE 隐私计算模块', weight: 0.65 },
  { key: 'oncall', en: '24x7 Operational On-Call', zh: '7x24 运维值守', weight: 0.75 }
];

const BUDGET_FACTORS = {
  under_500k: 0.8,
  from_500k_to_1m: 1,
  from_1m_to_3m: 1.22,
  above_3m: 1.45,
  undecided: 1
};

const TIMELINE_FACTORS = {
  urgent_1m: 1.35,
  normal_3m: 1,
  long_6m: 0.9,
  strategic_12m: 0.82
};

const INTEGRATION_FACTORS = {
  greenfield: 0.95,
  partial: 1.1,
  complex: 1.35
};

const initialForm = {
  companyName: '',
  companyType: '',
  contactName: '',
  jobTitle: '',
  email: '',
  phone: '',
  region: '',
  marketScope: '',
  timeline: 'normal_3m',
  annualVolume: '',
  selectedModules: [],
  selectedAddons: [],
  integrationComplexity: 'partial',
  budgetBand: 'undecided',
  objectives: '',
  complianceNeeds: '',
  preferredContact: 'email',
  ndaRequired: false,
  agreeTerms: false,
  attachments: []
};

function createReferenceId() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `VDAQ-${yyyy}${mm}${dd}-${rand}`;
}

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export default function GetQuotePage() {
  const { lang } = useI18n();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);

  const text =
    lang === 'zh'
      ? {
          chip: 'GET QUOTE',
          title: '报价申请',
          intro: '填写以下信息后可直接提交需求。系统会生成参考编号并进入商务与技术评估流程。',
          sectionOrg: 'A. 机构与联系人',
          sectionScope: 'B. 项目范围与模块',
          sectionCommercial: 'C. 商务与合规',
          sectionConfirm: 'D. 提交确认',
          companyName: '公司名称',
          companyType: '公司类型',
          contactName: '联系人',
          jobTitle: '职位',
          email: '邮箱',
          phone: '电话/WhatsApp',
          region: '目标区域',
          marketScope: '目标市场范围',
          timeline: '期望上线周期',
          annualVolume: '年交易电量（MWh）',
          modules: '核心模块选择',
          addons: '可选增强包',
          integrationComplexity: '集成复杂度',
          budgetBand: '预算区间（CNY）',
          objectives: '核心目标与痛点',
          complianceNeeds: '合规与审计要求',
          preferredContact: '优先沟通方式',
          ndaRequired: '需要先签署 NDA',
          agreeTerms: '我确认信息真实，并同意后续商务与条款流程',
          attachments: '附件（可选，最多 3 个）',
          submit: '提交报价请求',
          submitting: '提交中...',
          summaryTitle: '报价预估摘要',
          completion: '表单完成度',
          estimatedRange: '预估年度服务区间',
          slaTitle: '响应 SLA',
          sla1: '标准请求：1-3 个工作日反馈',
          sla2: '复杂部署：安排专项技术评审',
          sla3: '商务邮箱：zzhangmf@connect.ust.hk',
          receiptTitle: '提交成功',
          receiptText: '你的请求已进入评估队列。请保存以下参考编号：',
          downloadPdf: '下载 PDF 报价需求单',
          autoDownloadHint: 'PDF 已自动生成下载，如被浏览器拦截可点击下方按钮重试。',
          validationTitle: '请先修正以下字段：',
          companyTypeOptions: [
            { value: '', label: '请选择' },
            { value: 'utility', label: '发电/售电主体' },
            { value: 'industrial', label: '工商业用户' },
            { value: 'aggregator', label: '聚合商/虚拟电厂' },
            { value: 'fund', label: '投资/资管机构' },
            { value: 'other', label: '其他' }
          ],
          marketOptions: [
            { value: '', label: '请选择' },
            { value: 'spot_only', label: '现货市场' },
            { value: 'spot_plus_carbon', label: '现货 + 碳市场' },
            { value: 'province_cross', label: '省内 + 跨省联动' }
          ],
          timelineOptions: [
            { value: 'urgent_1m', label: '1个月内（紧急）' },
            { value: 'normal_3m', label: '3个月内（标准）' },
            { value: 'long_6m', label: '6个月内（分阶段）' },
            { value: 'strategic_12m', label: '12个月（战略建设）' }
          ],
          budgetOptions: [
            { value: 'under_500k', label: '50万以下' },
            { value: 'from_500k_to_1m', label: '50万 - 100万' },
            { value: 'from_1m_to_3m', label: '100万 - 300万' },
            { value: 'above_3m', label: '300万以上' },
            { value: 'undecided', label: '暂未确定' }
          ],
          integrationOptions: [
            { value: 'greenfield', label: '新建系统（低耦合）' },
            { value: 'partial', label: '部分系统对接（中等）' },
            { value: 'complex', label: '复杂多系统改造（高）' }
          ],
          contactOptions: [
            { value: 'email', label: '邮件' },
            { value: 'phone', label: '电话会议' },
            { value: 'onsite', label: '线下沟通' }
          ],
          requiredLabel: '必填'
        }
      : {
          chip: 'GET QUOTE',
          title: 'Quote Request',
          intro: 'Submit detailed requirements directly through this form. A reference ID will be generated for commercial and technical evaluation.',
          sectionOrg: 'A. Organization and Contact',
          sectionScope: 'B. Scope and Modules',
          sectionCommercial: 'C. Commercial and Compliance',
          sectionConfirm: 'D. Submission Confirmation',
          companyName: 'Company Name',
          companyType: 'Company Type',
          contactName: 'Contact Name',
          jobTitle: 'Job Title',
          email: 'Email',
          phone: 'Phone / WhatsApp',
          region: 'Target Region',
          marketScope: 'Market Scope',
          timeline: 'Expected Timeline',
          annualVolume: 'Annual Traded Volume (MWh)',
          modules: 'Core Module Selection',
          addons: 'Optional Add-ons',
          integrationComplexity: 'Integration Complexity',
          budgetBand: 'Budget Band (CNY)',
          objectives: 'Key Objectives and Pain Points',
          complianceNeeds: 'Compliance and Audit Requirements',
          preferredContact: 'Preferred Contact Method',
          ndaRequired: 'NDA required before detail sharing',
          agreeTerms: 'I confirm the information is valid and agree to follow-up commercial terms',
          attachments: 'Attachments (optional, max 3 files)',
          submit: 'Submit Quote Request',
          submitting: 'Submitting...',
          summaryTitle: 'Quote Estimate Summary',
          completion: 'Form Completion',
          estimatedRange: 'Estimated Annual Service Range',
          slaTitle: 'Response SLA',
          sla1: 'Standard requests: response within 1-3 business days',
          sla2: 'Complex deployment: dedicated technical review scheduled',
          sla3: 'Business email: charleswx61@outlook.com',
          receiptTitle: 'Submission Received',
          receiptText: 'Your request is now in evaluation queue. Save this reference ID:',
          downloadPdf: 'Download PDF Quote Request',
          autoDownloadHint: 'The PDF was auto-generated for download. If blocked by browser, click the button below to retry.',
          validationTitle: 'Please fix the following fields first:',
          companyTypeOptions: [
            { value: '', label: 'Select' },
            { value: 'utility', label: 'Generation / Retail Utility' },
            { value: 'industrial', label: 'Industrial / Commercial User' },
            { value: 'aggregator', label: 'Aggregator / VPP' },
            { value: 'fund', label: 'Investment / Asset Manager' },
            { value: 'other', label: 'Other' }
          ],
          marketOptions: [
            { value: '', label: 'Select' },
            { value: 'spot_only', label: 'Spot Market' },
            { value: 'spot_plus_carbon', label: 'Spot + Carbon Market' },
            { value: 'province_cross', label: 'Intra + Inter Province' }
          ],
          timelineOptions: [
            { value: 'urgent_1m', label: 'Within 1 month (urgent)' },
            { value: 'normal_3m', label: 'Within 3 months (standard)' },
            { value: 'long_6m', label: 'Within 6 months (phased)' },
            { value: 'strategic_12m', label: '12 months (strategic build)' }
          ],
          budgetOptions: [
            { value: 'under_500k', label: 'Below 500k' },
            { value: 'from_500k_to_1m', label: '500k - 1M' },
            { value: 'from_1m_to_3m', label: '1M - 3M' },
            { value: 'above_3m', label: 'Above 3M' },
            { value: 'undecided', label: 'Undecided' }
          ],
          integrationOptions: [
            { value: 'greenfield', label: 'Greenfield (low coupling)' },
            { value: 'partial', label: 'Partial integration (medium)' },
            { value: 'complex', label: 'Complex multi-system retrofit (high)' }
          ],
          contactOptions: [
            { value: 'email', label: 'Email' },
            { value: 'phone', label: 'Call' },
            { value: 'onsite', label: 'On-site meeting' }
          ],
          requiredLabel: 'Required'
        };

  const toggleItem = (key, value) => {
    setForm((prev) => {
      const list = prev[key];
      if (list.includes(value)) {
        return { ...prev, [key]: list.filter((item) => item !== value) };
      }
      return { ...prev, [key]: [...list, value] };
    });
  };

  const completion = useMemo(() => {
    const checks = [
      form.companyName.trim().length > 1,
      form.contactName.trim().length > 1,
      isEmail(form.email),
      form.region.trim().length > 1,
      form.marketScope.trim().length > 0,
      form.objectives.trim().length > 10,
      form.selectedModules.length > 0,
      form.agreeTerms
    ];
    const done = checks.filter(Boolean).length;
    return Math.round((done / checks.length) * 100);
  }, [form]);

  const estimate = useMemo(() => {
    const moduleWeight = form.selectedModules
      .map((key) => MODULES.find((m) => m.key === key)?.weight || 0)
      .reduce((a, b) => a + b, 0);

    const addonWeight = form.selectedAddons
      .map((key) => ADDONS.find((a) => a.key === key)?.weight || 0)
      .reduce((a, b) => a + b, 0);

    const annualVolumeFactor = form.annualVolume && Number(form.annualVolume) > 0 ? Math.min(Number(form.annualVolume) / 800000, 2.2) : 1;
    const budgetFactor = BUDGET_FACTORS[form.budgetBand] || 1;
    const timelineFactor = TIMELINE_FACTORS[form.timeline] || 1;
    const integrationFactor = INTEGRATION_FACTORS[form.integrationComplexity] || 1;

    const score = (moduleWeight + addonWeight + 0.9) * annualVolumeFactor * budgetFactor * timelineFactor * integrationFactor;
    const low = Math.max(180000, Math.round(score * 190000));
    const high = Math.max(low + 80000, Math.round(score * 290000));

    return {
      low,
      high,
      score
    };
  }, [form]);

  const validate = () => {
    const nextErrors = {};
    if (!form.companyName.trim()) nextErrors.companyName = true;
    if (!form.contactName.trim()) nextErrors.contactName = true;
    if (!isEmail(form.email)) nextErrors.email = true;
    if (!form.region.trim()) nextErrors.region = true;
    if (!form.marketScope) nextErrors.marketScope = true;
    if (form.selectedModules.length === 0) nextErrors.selectedModules = true;
    if (!form.objectives.trim() || form.objectives.trim().length < 10) nextErrors.objectives = true;
    if (!form.agreeTerms) nextErrors.agreeTerms = true;

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const generateQuotePdf = (payload) => {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();
    const left = 48;
    const right = pageWidth - 48;
    let y = 56;

    const writeLine = (line, options = {}) => {
      const { size = 10, weight = 'normal', gap = 16 } = options;
      doc.setFont('helvetica', weight);
      doc.setFontSize(size);
      const wrapped = doc.splitTextToSize(String(line), right - left);
      doc.text(wrapped, left, y);
      y += wrapped.length * (size + 3) + gap;
      if (y > 780) {
        doc.addPage();
        y = 56;
      }
    };

    const selectedModules = MODULES
      .filter((item) => payload.form.selectedModules.includes(item.key))
      .map((item) => (lang === 'zh' ? item.zh : item.en));

    const selectedAddons = ADDONS
      .filter((item) => payload.form.selectedAddons.includes(item.key))
      .map((item) => (lang === 'zh' ? item.zh : item.en));

    writeLine('VDA LAB - Quote Request Sheet', { size: 16, weight: 'bold', gap: 10 });
    writeLine(`Reference ID: ${payload.referenceId}`, { size: 11, weight: 'bold', gap: 4 });
    writeLine(`Submitted At: ${new Date(payload.submittedAt).toLocaleString()}`, { size: 10, gap: 10 });

    writeLine('A. Organization and Contact', { size: 12, weight: 'bold', gap: 6 });
    writeLine(`Company Name: ${payload.form.companyName || '-'}`, { gap: 4 });
    writeLine(`Company Type: ${payload.form.companyType || '-'}`, { gap: 4 });
    writeLine(`Contact Name: ${payload.form.contactName || '-'}`, { gap: 4 });
    writeLine(`Job Title: ${payload.form.jobTitle || '-'}`, { gap: 4 });
    writeLine(`Email: ${payload.form.email || '-'}`, { gap: 4 });
    writeLine(`Phone: ${payload.form.phone || '-'}`, { gap: 10 });

    writeLine('B. Scope and Technical Modules', { size: 12, weight: 'bold', gap: 6 });
    writeLine(`Target Region: ${payload.form.region || '-'}`, { gap: 4 });
    writeLine(`Market Scope: ${payload.form.marketScope || '-'}`, { gap: 4 });
    writeLine(`Timeline: ${payload.form.timeline || '-'}`, { gap: 4 });
    writeLine(`Annual Traded Volume (MWh): ${payload.form.annualVolume || '-'}`, { gap: 4 });
    writeLine(`Core Modules: ${selectedModules.length > 0 ? selectedModules.join(', ') : '-'}`, { gap: 4 });
    writeLine(`Optional Add-ons: ${selectedAddons.length > 0 ? selectedAddons.join(', ') : '-'}`, { gap: 10 });

    writeLine('C. Commercial and Compliance', { size: 12, weight: 'bold', gap: 6 });
    writeLine(`Integration Complexity: ${payload.form.integrationComplexity || '-'}`, { gap: 4 });
    writeLine(`Budget Band: ${payload.form.budgetBand || '-'}`, { gap: 4 });
    writeLine(`Preferred Contact: ${payload.form.preferredContact || '-'}`, { gap: 4 });
    writeLine(`NDA Required: ${payload.form.ndaRequired ? 'Yes' : 'No'}`, { gap: 4 });
    writeLine(`Compliance Notes: ${payload.form.complianceNeeds || '-'}`, { gap: 4 });
    writeLine(`Objectives: ${payload.form.objectives || '-'}`, { gap: 4 });
    writeLine(`Attachments: ${payload.form.attachments.length > 0 ? payload.form.attachments.join(', ') : '-'}`, { gap: 10 });

    writeLine('D. Estimate Snapshot', { size: 12, weight: 'bold', gap: 6 });
    writeLine(`Estimated Annual Service Range: CNY ${payload.estimate.low.toLocaleString()} - ${payload.estimate.high.toLocaleString()}`, { gap: 4 });
    writeLine(`Form Completion: ${completion}%`, { gap: 4 });
    writeLine('Generated by VDA Quote Workflow (UI Submission).', { size: 9, gap: 4 });

    doc.save(`${payload.referenceId}-quote-request.pdf`);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitResult(null);

    await new Promise((resolve) => {
      setTimeout(resolve, 1100);
    });

    const referenceId = createReferenceId();
    const payload = {
      referenceId,
      submittedAt: new Date().toISOString(),
      form,
      estimate
    };

    try {
      const key = 'vda_quote_requests';
      const raw = window.localStorage.getItem(key);
      const data = raw ? JSON.parse(raw) : [];
      data.unshift(payload);
      window.localStorage.setItem(key, JSON.stringify(data.slice(0, 15)));
    } catch (_error) {
      // Ignore local storage failures.
    }

    setIsSubmitting(false);
    setSubmitResult(payload);
    generateQuotePdf(payload);
  };

  const inputStyle = (hasError) => ({
    width: '100%',
    padding: '10px 12px',
    border: `1px solid ${hasError ? '#ef4444' : '#d1d5db'}`,
    background: '#ffffff',
    color: '#111827',
    borderRadius: 6,
    outline: 'none'
  });

  return (
    <section className="content-wrap route-page">
      <div className="ds-header">
        <div className="ds-chip">{text.chip}</div>
        <h1>{text.title}</h1>
        <p>{text.intro}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.45fr) minmax(0,0.9fr)', gap: 16 }}>
        <form className="ds-card" onSubmit={handleSubmit} noValidate>
          <h3 style={{ marginTop: 0 }}>{text.sectionOrg}</h3>
          <div className="ds-grid" style={{ gridTemplateColumns: '1fr 1fr', marginBottom: 12 }}>
            <label>
              <div style={{ fontSize: '0.82rem', marginBottom: 6 }}>{text.companyName} ({text.requiredLabel})</div>
              <input
                type="text"
                value={form.companyName}
                onChange={(e) => setForm((prev) => ({ ...prev, companyName: e.target.value }))}
                style={inputStyle(errors.companyName)}
              />
            </label>

            <label>
              <div style={{ fontSize: '0.82rem', marginBottom: 6 }}>{text.companyType}</div>
              <select
                value={form.companyType}
                onChange={(e) => setForm((prev) => ({ ...prev, companyType: e.target.value }))}
                style={inputStyle(false)}
              >
                {text.companyTypeOptions.map((option) => (
                  <option key={option.value || 'none'} value={option.value}>{option.label}</option>
                ))}
              </select>
            </label>

            <label>
              <div style={{ fontSize: '0.82rem', marginBottom: 6 }}>{text.contactName} ({text.requiredLabel})</div>
              <input
                type="text"
                value={form.contactName}
                onChange={(e) => setForm((prev) => ({ ...prev, contactName: e.target.value }))}
                style={inputStyle(errors.contactName)}
              />
            </label>

            <label>
              <div style={{ fontSize: '0.82rem', marginBottom: 6 }}>{text.jobTitle}</div>
              <input
                type="text"
                value={form.jobTitle}
                onChange={(e) => setForm((prev) => ({ ...prev, jobTitle: e.target.value }))}
                style={inputStyle(false)}
              />
            </label>

            <label>
              <div style={{ fontSize: '0.82rem', marginBottom: 6 }}>{text.email} ({text.requiredLabel})</div>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                style={inputStyle(errors.email)}
              />
            </label>

            <label>
              <div style={{ fontSize: '0.82rem', marginBottom: 6 }}>{text.phone}</div>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                style={inputStyle(false)}
              />
            </label>
          </div>

          <h3>{text.sectionScope}</h3>
          <div className="ds-grid" style={{ gridTemplateColumns: '1fr 1fr', marginBottom: 12 }}>
            <label>
              <div style={{ fontSize: '0.82rem', marginBottom: 6 }}>{text.region} ({text.requiredLabel})</div>
              <input
                type="text"
                value={form.region}
                onChange={(e) => setForm((prev) => ({ ...prev, region: e.target.value }))}
                style={inputStyle(errors.region)}
                placeholder={lang === 'zh' ? '例如：华东、山东、跨省联动' : 'e.g. East China, Shandong, cross-province'}
              />
            </label>

            <label>
              <div style={{ fontSize: '0.82rem', marginBottom: 6 }}>{text.marketScope} ({text.requiredLabel})</div>
              <select
                value={form.marketScope}
                onChange={(e) => setForm((prev) => ({ ...prev, marketScope: e.target.value }))}
                style={inputStyle(errors.marketScope)}
              >
                {text.marketOptions.map((option) => (
                  <option key={option.value || 'none'} value={option.value}>{option.label}</option>
                ))}
              </select>
            </label>

            <label>
              <div style={{ fontSize: '0.82rem', marginBottom: 6 }}>{text.timeline}</div>
              <select
                value={form.timeline}
                onChange={(e) => setForm((prev) => ({ ...prev, timeline: e.target.value }))}
                style={inputStyle(false)}
              >
                {text.timelineOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </label>

            <label>
              <div style={{ fontSize: '0.82rem', marginBottom: 6 }}>{text.annualVolume}</div>
              <input
                type="number"
                min="0"
                step="1000"
                value={form.annualVolume}
                onChange={(e) => setForm((prev) => ({ ...prev, annualVolume: e.target.value }))}
                style={inputStyle(false)}
              />
            </label>
          </div>

          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: '0.82rem', marginBottom: 8 }}>{text.modules} ({text.requiredLabel})</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {MODULES.map((module) => (
                <label key={module.key} style={{ border: `1px solid ${errors.selectedModules ? '#ef4444' : '#e5e7eb'}`, borderRadius: 8, padding: '8px 10px' }}>
                  <input
                    type="checkbox"
                    checked={form.selectedModules.includes(module.key)}
                    onChange={() => toggleItem('selectedModules', module.key)}
                    style={{ marginRight: 8 }}
                  />
                  {lang === 'zh' ? module.zh : module.en}
                </label>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: '0.82rem', marginBottom: 8 }}>{text.addons}</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {ADDONS.map((addon) => (
                <label key={addon.key} style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: '8px 10px' }}>
                  <input
                    type="checkbox"
                    checked={form.selectedAddons.includes(addon.key)}
                    onChange={() => toggleItem('selectedAddons', addon.key)}
                    style={{ marginRight: 8 }}
                  />
                  {lang === 'zh' ? addon.zh : addon.en}
                </label>
              ))}
            </div>
          </div>

          <h3>{text.sectionCommercial}</h3>
          <div className="ds-grid" style={{ gridTemplateColumns: '1fr 1fr', marginBottom: 12 }}>
            <label>
              <div style={{ fontSize: '0.82rem', marginBottom: 6 }}>{text.integrationComplexity}</div>
              <select
                value={form.integrationComplexity}
                onChange={(e) => setForm((prev) => ({ ...prev, integrationComplexity: e.target.value }))}
                style={inputStyle(false)}
              >
                {text.integrationOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </label>

            <label>
              <div style={{ fontSize: '0.82rem', marginBottom: 6 }}>{text.budgetBand}</div>
              <select
                value={form.budgetBand}
                onChange={(e) => setForm((prev) => ({ ...prev, budgetBand: e.target.value }))}
                style={inputStyle(false)}
              >
                {text.budgetOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </label>
          </div>

          <label style={{ display: 'block', marginBottom: 12 }}>
            <div style={{ fontSize: '0.82rem', marginBottom: 6 }}>{text.objectives} ({text.requiredLabel})</div>
            <textarea
              rows={4}
              value={form.objectives}
              onChange={(e) => setForm((prev) => ({ ...prev, objectives: e.target.value }))}
              style={inputStyle(errors.objectives)}
            />
          </label>

          <label style={{ display: 'block', marginBottom: 12 }}>
            <div style={{ fontSize: '0.82rem', marginBottom: 6 }}>{text.complianceNeeds}</div>
            <textarea
              rows={3}
              value={form.complianceNeeds}
              onChange={(e) => setForm((prev) => ({ ...prev, complianceNeeds: e.target.value }))}
              style={inputStyle(false)}
            />
          </label>

          <div className="ds-grid" style={{ gridTemplateColumns: '1fr 1fr', marginBottom: 12 }}>
            <label>
              <div style={{ fontSize: '0.82rem', marginBottom: 6 }}>{text.preferredContact}</div>
              <select
                value={form.preferredContact}
                onChange={(e) => setForm((prev) => ({ ...prev, preferredContact: e.target.value }))}
                style={inputStyle(false)}
              >
                {text.contactOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </label>

            <label>
              <div style={{ fontSize: '0.82rem', marginBottom: 6 }}>{text.attachments}</div>
              <input
                type="file"
                multiple
                onChange={(e) => {
                  const files = Array.from(e.target.files || []).slice(0, 3);
                  setForm((prev) => ({ ...prev, attachments: files.map((f) => f.name) }));
                }}
                style={inputStyle(false)}
              />
            </label>
          </div>

          <h3>{text.sectionConfirm}</h3>
          <label style={{ display: 'block', marginBottom: 8 }}>
            <input
              type="checkbox"
              checked={form.ndaRequired}
              onChange={(e) => setForm((prev) => ({ ...prev, ndaRequired: e.target.checked }))}
              style={{ marginRight: 8 }}
            />
            {text.ndaRequired}
          </label>

          <label style={{ display: 'block', marginBottom: 12, color: errors.agreeTerms ? '#ef4444' : '#111827' }}>
            <input
              type="checkbox"
              checked={form.agreeTerms}
              onChange={(e) => setForm((prev) => ({ ...prev, agreeTerms: e.target.checked }))}
              style={{ marginRight: 8 }}
            />
            {text.agreeTerms}
          </label>

          {Object.keys(errors).length > 0 ? (
            <div style={{ marginBottom: 12, border: '1px solid #ef4444', background: '#fef2f2', color: '#991b1b', borderRadius: 8, padding: '10px 12px' }}>
              {text.validationTitle}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              width: '100%',
              border: '1px solid #111827',
              background: '#111827',
              color: '#ffffff',
              borderRadius: 8,
              padding: '12px 14px',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              fontWeight: 700
            }}
          >
            {isSubmitting ? text.submitting : text.submit}
          </button>
        </form>

        <aside style={{ display: 'grid', gap: 16, alignSelf: 'start' }}>
          <article className="ds-card">
            <h3 style={{ marginTop: 0 }}>{text.summaryTitle}</h3>
            <p style={{ marginBottom: 8 }}>{text.completion}: {completion}%</p>
            <div style={{ height: 8, borderRadius: 999, background: '#e5e7eb', overflow: 'hidden', marginBottom: 12 }}>
              <div style={{ width: `${completion}%`, height: '100%', background: '#111827' }} />
            </div>
            <p style={{ marginBottom: 4 }}>{text.estimatedRange}</p>
            <p style={{ marginTop: 0, fontSize: '1.25rem', fontWeight: 800 }}>
              CNY {estimate.low.toLocaleString()} - {estimate.high.toLocaleString()}
            </p>
            {form.attachments.length > 0 ? (
              <p style={{ marginBottom: 0, color: '#6b7280' }}>
                {lang === 'zh' ? '已附文件：' : 'Attached files: '} {form.attachments.join(', ')}
              </p>
            ) : null}
          </article>

          <article className="ds-card">
            <h3 style={{ marginTop: 0 }}>{text.slaTitle}</h3>
            <ul className="ds-token-list" style={{ marginBottom: 0 }}>
              <li>{text.sla1}</li>
              <li>{text.sla2}</li>
              <li>{text.sla3}</li>
            </ul>
          </article>

          {submitResult ? (
            <article className="ds-card" style={{ border: '1px solid #16a34a', background: '#f0fdf4' }}>
              <h3 style={{ marginTop: 0, color: '#166534' }}>{text.receiptTitle}</h3>
              <p style={{ color: '#166534' }}>{text.receiptText}</p>
              <p style={{ marginBottom: 0, fontWeight: 800, letterSpacing: '0.04em', color: '#166534' }}>{submitResult.referenceId}</p>
              <p style={{ color: '#166534', marginTop: 8 }}>{text.autoDownloadHint}</p>
              <button
                type="button"
                onClick={() => generateQuotePdf(submitResult)}
                style={{
                  marginTop: 6,
                  border: '1px solid #166534',
                  background: '#166534',
                  color: '#ffffff',
                  borderRadius: 6,
                  padding: '8px 10px',
                  cursor: 'pointer',
                  fontWeight: 700
                }}
              >
                {text.downloadPdf}
              </button>
            </article>
          ) : null}
        </aside>
      </div>
    </section>
  );
}
