import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { useI18n } from '../i18n/I18nContext';

const MODULES = [
  {
    key: 'LSTF_FORECAST_ENGINE',
    zh: 'LSTF预测引擎',
    en: 'LSTF Forecast Engine',
    base: 62,
    trend: 0.72,
    season: 2.8,
    stressBeta: -0.95,
    recoveryBeta: 1.1,
    policyBeta: 0.45,
    latencyBase: 37,
    latencyImprove: 0.42,
    latencyStress: 0.52,
    throughputBase: 132,
    throughputTrend: 2.05,
    throughputStress: -1.35
  },
  {
    key: 'REGIME_SWITCH_SDE',
    zh: '状态切换SDE',
    en: 'Regime Switch SDE',
    base: 58,
    trend: 0.66,
    season: 2.5,
    stressBeta: 0.8,
    recoveryBeta: 0.8,
    policyBeta: 0.35,
    latencyBase: 40,
    latencyImprove: 0.37,
    latencyStress: 0.41,
    throughputBase: 126,
    throughputTrend: 1.92,
    throughputStress: -0.65
  },
  {
    key: 'VAR_ES_RISK_ENGINE',
    zh: 'VaR/ES风险引擎',
    en: 'VaR/ES Risk Engine',
    base: 60,
    trend: 0.74,
    season: 3.1,
    stressBeta: 1.25,
    recoveryBeta: 0.6,
    policyBeta: 0.42,
    latencyBase: 35,
    latencyImprove: 0.34,
    latencyStress: 0.33,
    throughputBase: 121,
    throughputTrend: 1.8,
    throughputStress: -0.4
  },
  {
    key: 'SCENARIO_STRESS_SIM',
    zh: '情景压力模拟器',
    en: 'Scenario Stress Simulator',
    base: 56,
    trend: 0.68,
    season: 3.4,
    stressBeta: 1.48,
    recoveryBeta: 0.72,
    policyBeta: 0.3,
    latencyBase: 43,
    latencyImprove: 0.28,
    latencyStress: 0.7,
    throughputBase: 114,
    throughputTrend: 1.55,
    throughputStress: -0.7
  },
  {
    key: 'BID_OPTIMIZER',
    zh: '报价优化器',
    en: 'Bid Optimizer',
    base: 61,
    trend: 0.79,
    season: 2.9,
    stressBeta: -1.08,
    recoveryBeta: 1.32,
    policyBeta: 0.58,
    latencyBase: 34,
    latencyImprove: 0.45,
    latencyStress: 0.62,
    throughputBase: 138,
    throughputTrend: 2.22,
    throughputStress: -1.5
  },
  {
    key: 'CARBON_HEDGE_ALLOCATOR',
    zh: '碳对冲分配器',
    en: 'Carbon Hedge Allocator',
    base: 54,
    trend: 0.67,
    season: 2.4,
    stressBeta: 0.55,
    recoveryBeta: 0.92,
    policyBeta: 1.36,
    latencyBase: 38,
    latencyImprove: 0.33,
    latencyStress: 0.4,
    throughputBase: 116,
    throughputTrend: 1.7,
    throughputStress: -0.35
  },
  {
    key: 'EXECUTION_ORCHESTRATOR',
    zh: '执行编排器',
    en: 'Execution Orchestrator',
    base: 63,
    trend: 0.64,
    season: 2.1,
    stressBeta: -1.24,
    recoveryBeta: 1.38,
    policyBeta: 0.32,
    latencyBase: 32,
    latencyImprove: 0.39,
    latencyStress: 0.66,
    throughputBase: 145,
    throughputTrend: 2.35,
    throughputStress: -1.72
  },
  {
    key: 'DATA_QUALITY_GUARD',
    zh: '数据质量守护器',
    en: 'Data Quality Guard',
    base: 57,
    trend: 0.73,
    season: 3.0,
    stressBeta: -0.58,
    recoveryBeta: 1.18,
    policyBeta: 0.62,
    latencyBase: 36,
    latencyImprove: 0.36,
    latencyStress: 0.49,
    throughputBase: 128,
    throughputTrend: 1.96,
    throughputStress: -0.95
  }
];

const STRESS_SIGNAL = [0, 1, 2, 3, 5, 8, 10, 8, 6, 4, 3, 2, 1, 1, 1, 0, 1, 2, 2, 3, 2, 1, 1, 0];
const RECOVERY_SIGNAL = [0, 0, 0, 0, 0, 0, 0, 1, 2, 4, 6, 7, 7, 8, 9, 9, 8, 7, 6, 6, 5, 4, 3, 3];
const POLICY_SIGNAL = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 2, 2, 2, 3, 4, 5, 6, 6, 5, 4];

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

const QUARTERS = (() => {
  const values = [];
  for (let year = 2021; year <= 2026; year += 1) {
    for (let q = 1; q <= 4; q += 1) {
      values.push(`${year}-Q${q}`);
    }
  }
  return values;
})();

function createLabDataset(lang) {
  const source = [['CapabilityScore', 'LatencyMs', 'Throughput', 'Module', 'Quarter']];

  MODULES.forEach((module, moduleIndex) => {
    QUARTERS.forEach((quarter, quarterIndex) => {
      const stress = STRESS_SIGNAL[quarterIndex];
      const recovery = RECOVERY_SIGNAL[quarterIndex];
      const policy = POLICY_SIGNAL[quarterIndex];

      const seasonal = Math.sin((quarterIndex + 1) * 0.72 + moduleIndex * 0.44) * module.season;
      const residual = Math.cos((quarterIndex + 1) * 0.33 + moduleIndex * 0.61) * 0.9;

      const score =
        module.base +
        module.trend * quarterIndex +
        seasonal +
        residual +
        stress * module.stressBeta +
        recovery * module.recoveryBeta +
        policy * module.policyBeta;

      const latency =
        module.latencyBase -
        module.latencyImprove * quarterIndex +
        stress * module.latencyStress -
        recovery * 0.16 +
        Math.cos((quarterIndex + 1) * 0.5 + moduleIndex * 0.38) * 1.6;

      const throughput =
        module.throughputBase +
        module.throughputTrend * quarterIndex +
        stress * module.throughputStress +
        recovery * 0.85 +
        Math.sin((quarterIndex + 1) * 0.46 + moduleIndex * 0.19) * 4.2;

      source.push([
        Number(clamp(score, 38, 98).toFixed(2)),
        Number(clamp(latency, 12, 62).toFixed(2)),
        Number(clamp(throughput, 88, 220).toFixed(2)),
        lang === 'zh' ? module.zh : module.en,
        quarter
      ]);
    });
  });

  return source;
}

function buildOption(lang) {
  const datasetWithFilters = [];
  const seriesList = [];

  const source = createLabDataset(lang);

  MODULES.forEach((module) => {
    const moduleName = lang === 'zh' ? module.zh : module.en;
    const datasetId = `dataset_${module.key}`;

    datasetWithFilters.push({
      id: datasetId,
      fromDatasetId: 'dataset_raw',
      transform: {
        type: 'filter',
        config: {
          dimension: 'Module',
          eq: moduleName
        }
      }
    });

    seriesList.push({
      type: 'line',
      datasetId,
      showSymbol: false,
      name: moduleName,
      smooth: true,
      endLabel: {
        show: true,
        formatter: (params) => `${params.value[3]}: ${params.value[0]}`
      },
      labelLayout: {
        moveOverlap: 'shiftY'
      },
      emphasis: {
        focus: 'series'
      },
      encode: {
        x: 'Quarter',
        y: 'CapabilityScore',
        label: ['Module', 'CapabilityScore'],
        itemName: 'Quarter',
        tooltip: ['CapabilityScore', 'LatencyMs', 'Throughput']
      }
    });
  });

  return {
    animationDuration: 12000,
    dataset: [
      {
        id: 'dataset_raw',
        source
      },
      ...datasetWithFilters
    ],
    title: {
      text: lang === 'zh' ? 'LAB能力竞速图（2021-2026）' : 'Lab Capability Race (2021-2026)',
      subtext:
        lang === 'zh'
          ? '含能源危机冲击期、恢复期与碳市场扩围期的阶段性波动'
          : 'Phase-aware fluctuations across crisis, recovery, and carbon-market expansion periods',
      left: 'left',
      textStyle: {
        color: '#111827',
        fontSize: 14,
        fontWeight: 700
      },
      subtextStyle: {
        color: '#6b7280',
        fontSize: 11
      }
    },
    tooltip: {
      order: 'valueDesc',
      trigger: 'axis',
      valueFormatter: (value) => `${value}`
    },
    legend: {
      type: 'scroll',
      top: 28,
      textStyle: {
        color: '#4b5563'
      }
    },
    xAxis: {
      type: 'category',
      name: lang === 'zh' ? '季度' : 'Quarter',
      nameLocation: 'middle',
      nameGap: 28,
      axisLine: {
        lineStyle: {
          color: '#9ca3af'
        }
      }
    },
    yAxis: {
      name: lang === 'zh' ? '能力评分' : 'Capability Score',
      nameTextStyle: {
        color: '#6b7280'
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: '#9ca3af'
        }
      },
      splitLine: {
        lineStyle: {
          color: '#e5e7eb'
        }
      }
    },
    grid: {
      top: 84,
      right: 160,
      left: 36,
      bottom: 36
    },
    series: seriesList
  };
}

export default function LineRaceChart({ lang: langProp }) {
  const { lang: activeLang } = useI18n();
  const lang = langProp || activeLang || 'en';
  const chartRef = useRef(null);

  useEffect(() => {
    const chartDom = chartRef.current;
    if (!chartDom) return undefined;

    const chart = echarts.init(chartDom);
    let cancelled = false;

    chart.showLoading('default', {
      text: lang === 'zh' ? '加载图表数据中...' : 'Loading chart data...'
    });

    if (!cancelled) {
      chart.hideLoading();
      chart.setOption(buildOption(lang), true);
    }

    const handleResize = () => chart.resize();
    window.addEventListener('resize', handleResize);

    return () => {
      cancelled = true;
      window.removeEventListener('resize', handleResize);
      chart.dispose();
    };
  }, [lang]);

  return <div ref={chartRef} style={{ width: '100%', height: 460 }} />;
}
