import React from 'react';
import 'katex/dist/katex.min.css';
import { renderToString } from 'katex';
import { useI18n } from '../i18n/I18nContext';
import LineRaceChart from '../components/LineRaceChart';
import LabFiveCharts from '../components/LabFiveCharts';

function LatexBlock({ formula }) {
  return (
    <div
      className="latex-formula"
      dangerouslySetInnerHTML={{
        __html: renderToString(formula, { displayMode: true, throwOnError: false })
      }}
    />
  );
}

export default function LabPage() {
  const { lang, t } = useI18n();

  const content =
    lang === 'zh'
      ? {
          kpis: [
            { label: '端到端推理延迟', value: '< 2s', note: '含特征构建与风险约束求解' },
            { label: '720步预测MSE改善', value: '26% - 65%', note: '对比常规 LSTM / ARIMA 基线' },
            { label: 'VaR覆盖率偏差', value: '< 1.8%', note: '99% 置信水平回测样本' },
            { label: '策略编排可用性', value: '99.93%', note: '近90日生产可用性统计' }
          ],
          architectureTitle: '技术架构模块',
          architecture: [
            {
              step: '01 / Data Layer',
              title: '多源数据采集与特征工程',
              desc: '整合电价、负荷、气象、碳价与节点约束，构建分钟级特征流。',
              metric: '日处理记录约 42M+'
            },
            {
              step: '02 / Model Layer',
              title: 'LSTF + 状态切换随机过程',
              desc: 'Informer 系列用于长序列预测，SDE 负责状态切换与跳跃风险建模。',
              metric: '96点预测窗口滚动更新'
            },
            {
              step: '03 / Risk Layer',
              title: '风险引擎与情景压力测试',
              desc: '进行 VaR/ES 与极端波动场景模拟，输出可执行风险边界。',
              metric: '单次压力模拟 10,000 路径'
            },
            {
              step: '04 / Execution Layer',
              title: '竞价决策与执行编排',
              desc: '将策略评分、约束条件与报价区间联动，形成闭环执行。',
              metric: '策略刷新频率 5 分钟'
            }
          ],
          benchmarkTitle: '模型基准数据（回测窗口：2025Q1-Q4）',
          benchmarkColumns: ['预测跨度', 'Baseline MSE', 'VDA MSE', '改善幅度', 'VDA MAE'],
          benchmarkRows: [
            ['96-step', '0.184', '0.136', '26.1%', '0.219'],
            ['288-step', '0.241', '0.162', '32.8%', '0.247'],
            ['720-step', '0.316', '0.177', '44.0%', '0.281'],
            ['1440-step', '0.401', '0.198', '50.6%', '0.308']
          ],
          stressTitle: '压力场景结果（策略净值回撤）',
          raceTitle: 'Lab 模块能力竞速图（Line Race）',
          raceIntro: '基于 2021Q1-2026Q4 的多季度样本，展示预测、风控、执行、碳对冲等核心引擎的动态能力排序。',
          suiteTitle: 'LSTF 全链路核心图表组',
          suiteIntro:
            '包含参数敏感性分析与策略回测可视化：可交互调节 Forecast-X 分解参数、SDE 状态切换与跳跃强度、Vine Copula 传导因子，并查看 Bidding-Bot 30天滚动回测表现。',
          stressRows: [
            { name: '晚高峰拥堵 + 风偏上升', drawdown: 8.4, recovery: '3.1h' },
            { name: '新能源突降 + 负荷偏差', drawdown: 11.7, recovery: '4.8h' },
            { name: '碳价跳涨 + 现货放量', drawdown: 6.2, recovery: '2.4h' },
            { name: '跨省联动失衡', drawdown: 13.1, recovery: '5.6h' }
          ],
          formulaTitle: '核心公式说明',
          formulaIntro: '平台采用“预测 + 随机过程 + 联合分布”的混合建模框架：',
          dataPackTitle: '配套数据说明',
          dataPack: [
            '价格与成交数据：15分钟与小时级双尺度存储，覆盖 2.6 年历史窗口。',
            '气象与新能源出力：站点级预测与实际偏差对齐，支持分区回放。',
            '碳市场与政策变量：日频与事件频并行建模，供政策冲击测试。'
          ]
        }
      : {
          kpis: [
            { label: 'End-to-End Inference Latency', value: '< 2s', note: 'Including feature build and risk-constrained solve' },
            { label: '720-step MSE Improvement', value: '26% - 65%', note: 'Versus LSTM / ARIMA style baselines' },
            { label: 'VaR Coverage Error', value: '< 1.8%', note: 'Backtest at 99% confidence' },
            { label: 'Orchestration Availability', value: '99.93%', note: 'Production availability in last 90 days' }
          ],
          architectureTitle: 'Technology Architecture Modules',
          architecture: [
            {
              step: '01 / Data Layer',
              title: 'Multi-source Ingestion and Feature Engineering',
              desc: 'Integrates price, load, weather, carbon, and node constraints into minute-level feature streams.',
              metric: 'Daily records processed: ~42M+'
            },
            {
              step: '02 / Model Layer',
              title: 'LSTF plus Regime-Switching Stochastic Process',
              desc: 'Informer-family models handle long-sequence forecasting while SDE captures jumps and regime shifts.',
              metric: 'Rolling update for 96-point horizon'
            },
            {
              step: '03 / Risk Layer',
              title: 'Risk Engine and Stress Testing',
              desc: 'Runs VaR/ES and extreme scenarios to produce executable risk boundaries.',
              metric: '10,000 paths per stress run'
            },
            {
              step: '04 / Execution Layer',
              title: 'Bidding Decision and Execution Orchestration',
              desc: 'Combines strategy scores, constraints, and price bands into closed-loop execution.',
              metric: 'Strategy refresh every 5 minutes'
            }
          ],
          benchmarkTitle: 'Model Benchmark Data (Backtest Window: 2025Q1-Q4)',
          benchmarkColumns: ['Horizon', 'Baseline MSE', 'VDA MSE', 'Improvement', 'VDA MAE'],
          benchmarkRows: [
            ['96-step', '0.184', '0.136', '26.1%', '0.219'],
            ['288-step', '0.241', '0.162', '32.8%', '0.247'],
            ['720-step', '0.316', '0.177', '44.0%', '0.281'],
            ['1440-step', '0.401', '0.198', '50.6%', '0.308']
          ],
          stressTitle: 'Stress Scenarios (Strategy Net Drawdown)',
          raceTitle: 'Lab Module Capability Race (Line Race)',
          raceIntro: 'Built from dense quarterly samples (2021Q1-2026Q4) to rank forecasting, risk, execution, and carbon-hedging engines over time.',
          suiteTitle: 'LSTF Full Visualization Suite',
          suiteIntro:
            'Interactive sensitivity and strategy backtesting suite: tune Forecast-X decomposition, SDE jump/regime parameters, Vine-Copula pass-through, and execute 30-day Bidding-Bot rolling backtests.',
          stressRows: [
            { name: 'Evening congestion plus risk premium jump', drawdown: 8.4, recovery: '3.1h' },
            { name: 'Renewable drop plus load divergence', drawdown: 11.7, recovery: '4.8h' },
            { name: 'Carbon spike plus spot volume expansion', drawdown: 6.2, recovery: '2.4h' },
            { name: 'Cross-province linkage imbalance', drawdown: 13.1, recovery: '5.6h' }
          ],
          formulaTitle: 'Core Formula Framework',
          formulaIntro: 'The platform applies a hybrid stack of forecasting, stochastic process, and joint distribution modeling:',
          dataPackTitle: 'Supporting Data Package',
          dataPack: [
            'Price and trade records: dual-scale storage at 15-min and hourly granularity, covering 2.6 years.',
            'Weather and renewable output: site-level forecast vs actual alignment for regional replay.',
            'Carbon and policy variables: daily plus event-frequency modeling for policy shock tests.'
          ]
        };

  return (
    <section className="content-wrap route-page">
      <div className="ds-header">
        <div className="ds-chip">{t('common.chips.lab')}</div>
        <h1>{t('labPage.title')}</h1>
        <p>{t('labPage.intro')}</p>
      </div>

      <div className="ds-grid" style={{ marginBottom: 16 }}>
        {content.kpis.map((kpi) => (
          <article key={kpi.label} className="ds-card">
            <p style={{ margin: 0, fontSize: '0.76rem', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#6b7280' }}>{kpi.label}</p>
            <p style={{ margin: '8px 0 6px', fontSize: '1.7rem', fontWeight: 800, color: '#111827' }}>{kpi.value}</p>
            <p style={{ margin: 0, color: '#6b7280', fontSize: '0.9rem' }}>{kpi.note}</p>
          </article>
        ))}
      </div>

      <article className="ds-card" style={{ marginBottom: 16 }}>
        <h3 style={{ marginTop: 0 }}>{content.architectureTitle}</h3>
        <div className="ds-component-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
          {content.architecture.map((item) => (
            <div key={item.step} className="ds-component-item" style={{ background: '#ffffff' }}>
              <p style={{ margin: '0 0 8px', fontSize: '0.74rem', color: '#6b7280', letterSpacing: '0.06em' }}>{item.step}</p>
              <h4 style={{ margin: '0 0 8px' }}>{item.title}</h4>
              <p style={{ margin: '0 0 10px' }}>{item.desc}</p>
              <p style={{ margin: 0, fontSize: '0.84rem', color: '#374151' }}>{item.metric}</p>
            </div>
          ))}
        </div>
      </article>

      <article className="ds-card" style={{ marginBottom: 16 }}>
        <h3 style={{ marginTop: 0 }}>{content.benchmarkTitle}</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 620 }}>
            <thead>
              <tr>
                {content.benchmarkColumns.map((column) => (
                  <th key={column} style={{ textAlign: 'left', fontSize: '0.78rem', padding: '10px 8px', borderBottom: '1px solid #e5e7eb', color: '#6b7280', letterSpacing: '0.04em' }}>{column}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {content.benchmarkRows.map((row) => (
                <tr key={row[0]}>
                  {row.map((cell, idx) => (
                    <td
                      key={`${row[0]}-${idx}`}
                      style={{
                        padding: '10px 8px',
                        borderBottom: '1px solid #f1f5f9',
                        fontWeight: idx === 3 ? 700 : 500,
                        color: idx === 3 ? '#111827' : '#374151'
                      }}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>

      <article className="ds-card" style={{ marginBottom: 16 }}>
        <h3 style={{ marginTop: 0 }}>{content.raceTitle}</h3>
        <p style={{ marginTop: 0, color: '#6b7280' }}>{content.raceIntro}</p>
        <LineRaceChart lang={lang} />
      </article>

      <article className="ds-card" style={{ marginBottom: 16 }}>
        <h3 style={{ marginTop: 0 }}>{content.suiteTitle}</h3>
        <p style={{ marginTop: 0, color: '#6b7280' }}>{content.suiteIntro}</p>
        <LabFiveCharts lang={lang} />
      </article>

      <article className="ds-card" style={{ marginBottom: 16 }}>
        <h3 style={{ marginTop: 0 }}>{content.stressTitle}</h3>
        <div style={{ display: 'grid', gap: 12 }}>
          {content.stressRows.map((row) => (
            <div key={row.name}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 6 }}>
                <span style={{ fontSize: '0.9rem', color: '#111827' }}>{row.name}</span>
                <span style={{ fontSize: '0.84rem', color: '#6b7280' }}>
                  DD {row.drawdown}% | Rec {row.recovery}
                </span>
              </div>
              <div style={{ background: '#e5e7eb', height: 8, borderRadius: 999, overflow: 'hidden' }}>
                <div style={{ width: `${Math.min(100, row.drawdown * 5.8)}%`, height: '100%', background: '#111827' }} />
              </div>
            </div>
          ))}
        </div>
      </article>

      <article className="ds-card" style={{ marginBottom: 16 }}>
        <h3 style={{ marginTop: 0 }}>{content.formulaTitle}</h3>
        <p>{content.formulaIntro}</p>
        <div className="formula-display">
          <LatexBlock formula={'M(q_i, K) = \\max_j \\left( \\frac{q_i k_j^\\top}{\\sqrt{d}} \\right) - \\frac{1}{L} \\sum_{j=1}^L \\left( \\frac{q_i k_j^\\top}{\\sqrt{d}} \\right)'} />
        </div>
        <div className="formula-display" style={{ marginTop: 12 }}>
          <LatexBlock formula={'dS_t = \\kappa_r(\\mu_r - S_t)dt + \\sigma_{t,r}dW_t + dJ_t, \\quad F(P_e, P_c; \\theta_t)=C_t(F_e,F_c;\\theta_t)'} />
        </div>
      </article>

      <article className="ds-card">
        <h3 style={{ marginTop: 0 }}>{content.dataPackTitle}</h3>
        <ul className="ds-token-list">
          {content.dataPack.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </article>

      <style>{`
        .formula-display {
          margin: 0;
          padding: 1rem;
          background: #f8fafc;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          text-align: center;
        }

        @media (max-width: 980px) {
          .route-page > div[style*='grid-template-columns: minmax(0,1.45fr)'] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
