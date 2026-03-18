import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as echarts from 'echarts';
import { useI18n } from '../i18n/I18nContext';

function pseudoRand(seed) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

function normalLike(seedA, seedB) {
  return (pseudoRand(seedA) + pseudoRand(seedB) + pseudoRand(seedA + seedB) - 1.5) * 2;
}

function quantile(sortedArr, q) {
  if (!sortedArr.length) return 0;
  const pos = (sortedArr.length - 1) * q;
  const base = Math.floor(pos);
  const rest = pos - base;
  if (sortedArr[base + 1] !== undefined) {
    return sortedArr[base] + rest * (sortedArr[base + 1] - sortedArr[base]);
  }
  return sortedArr[base];
}

function buildForecastXData({ smoothWindow, seasonalPeriod, climateIndex, policyPressure }) {
  const n = 720;
  const x = [];
  const trendTerm = [];
  const seasonal = [];
  const residualTerm = [];
  const truth = [];
  const autoformer = [];
  const tXL = [];
  const lower = [];
  const band = [];

  let trendState = 400;
  const policyDriftBoost = (policyPressure - 50) * 0.004;
  const climateShockBoost = (climateIndex - 50) * 0.08;

  for (let i = 0; i < n; i += 1) {
    x.push(i + 1);

    const drift = -0.5 + pseudoRand(i + 11) * 2.0;
    trendState += drift + policyDriftBoost;

    const dayCycle = 28 * Math.sin((2 * Math.PI * i) / seasonalPeriod);
    const halfDayCycle = 16 * Math.sin((2 * Math.PI * i) / Math.max(4, Math.floor(seasonalPeriod / 2)) + 0.7);
    const season = dayCycle + halfDayCycle;

    const noise = normalLike(i + 101, i + 197) * (4.2 + climateShockBoost * 0.1);
    const gt = trendState + season + noise;

    const autoErr = normalLike(i + 307, i + 433) * 2.1 + Math.sin(i / 48) * 1.1;
    const txlErr = normalLike(i + 509, i + 641) * 4.7 + Math.sin(i / 31) * 2.3;
    const autoPred = trendState + season + autoErr;
    const txlPred = trendState + season + txlErr;

    const ci = 8 + Math.abs(Math.sin(i / 17)) * 6;
    const lb = autoPred - ci;
    const ub = autoPred + ci;

    trendTerm.push(Number(trendState.toFixed(2)));
    seasonal.push(Number(season.toFixed(2)));
    residualTerm.push(Number(noise.toFixed(2)));
    truth.push(Number(gt.toFixed(2)));
    autoformer.push(Number(autoPred.toFixed(2)));
    tXL.push(Number(txlPred.toFixed(2)));
    lower.push(Number(lb.toFixed(2)));
    band.push(Number((ub - lb).toFixed(2)));
  }

  const smoothTrend = [];
  for (let i = 0; i < trendTerm.length; i += 1) {
    const start = Math.max(0, i - smoothWindow + 1);
    const span = trendTerm.slice(start, i + 1);
    smoothTrend.push(Number((span.reduce((a, b) => a + b, 0) / span.length).toFixed(2)));
  }

  return { x, trendTerm: smoothTrend, seasonal, residualTerm, truth, autoformer, tXL, lower, band };
}

function buildProbSparseMatrix(size = 96) {
  const dense = [];
  const sparse = [];
  const labels = Array.from({ length: size }, (_, i) => `${i + 1}`);

  const topUCount = Math.max(1, Math.round(Math.log(size)));
  const topQueries = Array.from({ length: topUCount }, (_, idx) => (idx * 17 + 9) % size);

  for (let r = 0; r < size; r += 1) {
    for (let c = 0; c < size; c += 1) {
      const denseVal = 0.22 + pseudoRand(r * 101 + c * 37) * 0.7;
      dense.push([c, r, Number(denseVal.toFixed(3))]);

      let sparseVal = 0.01 + pseudoRand(r * 19 + c * 13) * 0.04;
      if (topQueries.includes(r)) {
        const dist = Math.abs(r - c);
        if (dist <= 3) {
          sparseVal = 0.7 + pseudoRand(r * 79 + c * 3) * 0.2;
        }
      }

      sparse.push([c, r, Number(sparseVal.toFixed(3))]);
    }
  }

  return { dense, sparse, labels };
}

function buildSdeRegimeData({ jumpIntensity, meanReversion, regimeSwitchProb, climateIndex, runId }) {
  const allPaths = [];
  const n = 220;
  const x = [];
  for (let i = 0; i < n; i += 1) x.push(i + 1);

  const pathCount = 1000;
  const matrixByStep = Array.from({ length: n }, () => []);

  for (let p = 0; p < pathCount; p += 1) {
    const series = [];
    let state = regimeSwitchProb > 0.09 ? 1 : 0;
    let price = 350 + normalLike(p + 17, p + 29) * 8;

    for (let t = 0; t < n; t += 1) {
      const switchRand = pseudoRand((p + 1) * 1000 + t * 13 + runId * 97);
      if (switchRand > 1 - regimeSwitchProb) {
        state = state === 0 ? 1 : 0;
      }

      const mu = state === 0 ? 350 : 320;
      const kappa = state === 0 ? meanReversion : Math.max(0.03, meanReversion * 0.45);
      const sigma = state === 0 ? 4.2 + climateIndex * 0.025 : (42 + climateIndex * 0.21) * jumpIntensity;

      const dW = normalLike((p + 1) * (t + 11 + runId), (p + 7) * (t + 19 + runId));
      const ouStep = kappa * (mu - price) + sigma * dW * 0.12;
      price += ouStep;

      if (state === 1) {
        const jumpProb = pseudoRand((p + 3) * 700 + t * 23 + runId * 131);
        if (jumpProb > 0.93) {
          const negJump = (-100 - pseudoRand(t * 31 + p * 7 + runId * 17) * 60) * jumpIntensity;
          price += negJump;
        } else if (jumpProb < 0.04) {
          const posJump = (90 + pseudoRand(t * 17 + p * 43 + runId * 19) * 110) * jumpIntensity;
          price += posJump;
        }
      }

      price = Math.max(-180, Math.min(780, price));
      const value = Number(price.toFixed(2));
      series.push(value);
      matrixByStep[t].push(value);
    }

    allPaths.push(series);
  }

  const q05 = [];
  const q25 = [];
  const q50 = [];
  const q75 = [];
  const q95 = [];

  for (let t = 0; t < n; t += 1) {
    const sorted = matrixByStep[t].slice().sort((a, b) => a - b);
    q05.push(Number(quantile(sorted, 0.05).toFixed(2)));
    q25.push(Number(quantile(sorted, 0.25).toFixed(2)));
    q50.push(Number(quantile(sorted, 0.5).toFixed(2)));
    q75.push(Number(quantile(sorted, 0.75).toFixed(2)));
    q95.push(Number(quantile(sorted, 0.95).toFixed(2)));
  }

  const sampleStep = Math.max(1, Math.floor(pathCount / 8));
  const samplePaths = [];
  for (let i = 0; i < pathCount; i += sampleStep) {
    if (samplePaths.length >= 8) break;
    samplePaths.push(allPaths[i]);
  }

  return {
    x,
    pathCount,
    q05,
    q25,
    q50,
    q75,
    q95,
    q05ToQ95: q95.map((v, i) => Number((v - q05[i]).toFixed(2))),
    q25ToQ75: q75.map((v, i) => Number((v - q25[i]).toFixed(2))),
    samplePaths,
    var95: q05[n - 1]
  };
}

function buildVineCopulaData({ passThroughFactor, policyPressure }) {
  const points = [];
  const n = 1200;

  for (let i = 0; i < n; i += 1) {
    const t = i / n;
    const theta =
      0.25 +
      0.55 * (0.5 + 0.5 * Math.sin(2 * Math.PI * t * 1.5)) *
      (0.75 + (policyPressure / 100) * 0.5);

    let elec = 320 + normalLike(i + 11, i + 31) * 35;
    if (pseudoRand(i + 901) > 0.85) {
      elec += 120 + pseudoRand(i + 97) * 220;
    }

    const tailBoost = Math.max(0, elec - 470);
    const carbon =
      68 +
      normalLike(i + 131, i + 157) * 7 +
      theta * (elec - 320) * 0.05 * passThroughFactor +
      Math.pow(tailBoost, 1.12) * 0.03;

    points.push([
      Number(elec.toFixed(2)),
      Number(Math.max(25, carbon).toFixed(2)),
      Number(theta.toFixed(3))
    ]);
  }

  return points;
}

function buildBenchmarkData() {
  const lengths = [96, 720, 1440, 3000];
  const transformer = lengths.map((x) => Number((x * x * 0.00011).toFixed(2)));
  const informer = lengths.map((x) => Number((x * Math.log(x) * 0.0035).toFixed(2)));
  const vda = lengths.map((x) => Number((x * Math.log(x) * 0.0035 * 0.4).toFixed(2)));

  return {
    lengths: lengths.map(String),
    transformer,
    informer,
    vda
  };
}

export default function LabFiveCharts({ lang: langProp }) {
  const { lang: activeLang } = useI18n();
  const lang = langProp || activeLang || 'en';
  const refs = useRef([]);
  const [smoothWindow, setSmoothWindow] = useState(24);
  const [seasonalPeriod, setSeasonalPeriod] = useState(24);
  const [jumpIntensity, setJumpIntensity] = useState(1);
  const [meanReversion, setMeanReversion] = useState(0.18);
  const [regimeSwitchProb, setRegimeSwitchProb] = useState(0.05);
  const [passThroughFactor, setPassThroughFactor] = useState(1);
  const [maeTolerance, setMaeTolerance] = useState(7);
  const [soc, setSoc] = useState(55);
  const [modelMode, setModelMode] = useState('vda');
  const [sequenceLength, setSequenceLength] = useState(720);
  const [climateIndex, setClimateIndex] = useState(50);
  const [policyPressure, setPolicyPressure] = useState(50);
  const [runId, setRunId] = useState(1);
  const [backtestId, setBacktestId] = useState(1);
  const [logs, setLogs] = useState([]);

  const benchmark = useMemo(() => buildBenchmarkData(), []);
  const sde = useMemo(
    () =>
      buildSdeRegimeData({
        jumpIntensity,
        meanReversion,
        regimeSwitchProb,
        climateIndex,
        runId
      }),
    [jumpIntensity, meanReversion, regimeSwitchProb, climateIndex, runId]
  );

  function appendLog(line) {
    setLogs((prev) => [
      `${new Date().toLocaleTimeString()} ${line}`,
      ...prev.slice(0, 14)
    ]);
  }

  useEffect(() => {
    const chartInstances = [];

    const makeChart = (index, option) => {
      const node = refs.current[index];
      if (!node) return;
      const chart = echarts.init(node);
      chart.setOption(option);
      chartInstances.push(chart);
    };

    const prediction = buildForecastXData({ smoothWindow, seasonalPeriod, climateIndex, policyPressure });
    makeChart(0, {
      color: ['#111827', '#0ea5e9', '#f59e0b'],
      tooltip: { trigger: 'axis' },
      legend: {
        top: 0,
        data:
          lang === 'zh'
            ? ['真实值', 'Autoformer(Forecast-X)', 'Transformer-XL', '趋势项', '季节项', '95%置信区间']
            : ['Ground Truth', 'Autoformer (Forecast-X)', 'Transformer-XL', 'Trend', 'Seasonal', '95% CI']
      },
      grid: { left: 46, right: 28, top: 44, bottom: 38 },
      xAxis: {
        type: 'category',
        data: prediction.x,
        name: lang === 'zh' ? '时间步' : 'Time Step',
        axisLabel: { showMaxLabel: true }
      },
      yAxis: {
        type: 'value',
        name: lang === 'zh' ? '价格(RMB)' : 'Price (RMB)'
      },
      series: [
        { name: lang === 'zh' ? '真实值' : 'Ground Truth', type: 'line', data: prediction.truth, showSymbol: false, lineStyle: { width: 2.2 } },
        { name: lang === 'zh' ? 'Autoformer(Forecast-X)' : 'Autoformer (Forecast-X)', type: 'line', data: prediction.autoformer, showSymbol: false, lineStyle: { width: 1.9 } },
        { name: lang === 'zh' ? 'Transformer-XL' : 'Transformer-XL', type: 'line', data: prediction.tXL, showSymbol: false, lineStyle: { width: 1.7, type: 'dashed' } },
        { name: lang === 'zh' ? '趋势项' : 'Trend', type: 'line', data: prediction.trendTerm, showSymbol: false, lineStyle: { width: 1.4, type: 'dotted', color: '#6b7280' } },
        { name: lang === 'zh' ? '季节项' : 'Seasonal', type: 'line', data: prediction.seasonal.map((v, i) => Number((v + prediction.trendTerm[i]).toFixed(2))), showSymbol: false, lineStyle: { width: 1.2, color: '#a855f7' } },
        {
          name: lang === 'zh' ? '95%置信区间' : '95% CI',
          type: 'line',
          data: prediction.lower,
          showSymbol: false,
          lineStyle: { opacity: 0 },
          stack: 'ci',
          emphasis: { disabled: true },
          tooltip: { show: false }
        },
        {
          type: 'line',
          data: prediction.band,
          showSymbol: false,
          lineStyle: { opacity: 0 },
          areaStyle: { color: 'rgba(14,165,233,0.18)' },
          stack: 'ci',
          emphasis: { disabled: true },
          tooltip: { show: false }
        }
      ]
    });

    const matrix = buildProbSparseMatrix(96);
    makeChart(1, {
      tooltip: { position: 'top' },
      animation: false,
      grid: [
        { left: '6%', top: 36, width: '40%', height: '74%' },
        { right: '6%', top: 36, width: '40%', height: '74%' }
      ],
      xAxis: [
        { type: 'category', data: matrix.labels, gridIndex: 0, splitArea: { show: false } },
        { type: 'category', data: matrix.labels, gridIndex: 1, splitArea: { show: false } }
      ],
      yAxis: [
        { type: 'category', data: matrix.labels, gridIndex: 0, splitArea: { show: false } },
        { type: 'category', data: matrix.labels, gridIndex: 1, splitArea: { show: false } }
      ],
      visualMap: {
        min: 0,
        max: 1,
        calculable: false,
        orient: 'horizontal',
        left: 'center',
        bottom: 0,
        inRange: { color: ['#f8fafc', '#93c5fd', '#1d4ed8'] }
      },
      title: [
        { text: lang === 'zh' ? 'Vanilla Transformer 稠密注意力' : 'Vanilla Transformer Dense Attention', left: '12%', top: 8, textStyle: { fontSize: 12, fontWeight: 700 } },
        { text: lang === 'zh' ? 'Informer ProbSparse Top-u 稀疏激活' : 'Informer ProbSparse Top-u Sparse Activation', right: '9%', top: 8, textStyle: { fontSize: 12, fontWeight: 700 } }
      ],
      series: [
        { type: 'heatmap', xAxisIndex: 0, yAxisIndex: 0, data: matrix.dense, progressive: 1000 },
        { type: 'heatmap', xAxisIndex: 1, yAxisIndex: 1, data: matrix.sparse, progressive: 1000 }
      ]
    });

    makeChart(2, {
      tooltip: { trigger: 'axis' },
      grid: { left: 50, right: 24, top: 24, bottom: 38 },
      xAxis: { type: 'category', data: sde.x, name: lang === 'zh' ? '时间步' : 'Time Step' },
      yAxis: { type: 'value', name: lang === 'zh' ? '价格(RMB)' : 'Price (RMB)' },
      series: [
        {
          name: 'q05 anchor',
          type: 'line',
          data: sde.q05,
          showSymbol: false,
          stack: 'sde95',
          lineStyle: { opacity: 0 },
          tooltip: { show: false }
        },
        {
          name: lang === 'zh' ? '90%分位带' : '90% Quantile Band',
          type: 'line',
          data: sde.q05ToQ95,
          showSymbol: false,
          stack: 'sde95',
          lineStyle: { opacity: 0 },
          areaStyle: { color: 'rgba(59,130,246,0.14)' }
        },
        {
          name: 'q25 anchor',
          type: 'line',
          data: sde.q25,
          showSymbol: false,
          stack: 'sde50',
          lineStyle: { opacity: 0 },
          tooltip: { show: false }
        },
        {
          name: lang === 'zh' ? '50%分位带' : '50% Quantile Band',
          type: 'line',
          data: sde.q25ToQ75,
          showSymbol: false,
          stack: 'sde50',
          lineStyle: { opacity: 0 },
          areaStyle: { color: 'rgba(59,130,246,0.22)' }
        },
        {
          name: lang === 'zh' ? '中位路径' : 'Median Path',
          type: 'line',
          data: sde.q50,
          showSymbol: false,
          lineStyle: { width: 2.2, color: '#1d4ed8' }
        },
        ...sde.samplePaths.map((series, idx) => ({
          name: `${lang === 'zh' ? '样本路径' : 'Sample Path'} ${idx + 1}`,
          type: 'line',
          data: series,
          showSymbol: false,
          lineStyle: {
            width: 1.1,
            opacity: 0.22,
            color: '#475569'
          }
        }))
      ]
    });

    const copula = buildVineCopulaData({ passThroughFactor, policyPressure });
    makeChart(3, {
      tooltip: {
        formatter: (params) => {
          const [px, cy, theta] = params.value;
          return `${lang === 'zh' ? '电价' : 'Power'}: ${px}<br/>${lang === 'zh' ? '碳价' : 'Carbon'}: ${cy}<br/>theta: ${theta}`;
        }
      },
      grid: { left: 50, right: 28, top: 28, bottom: 44 },
      xAxis: {
        type: 'value',
        name: lang === 'zh' ? '电价 (RMB/MWh)' : 'Power Price (RMB/MWh)'
      },
      yAxis: {
        type: 'value',
        name: lang === 'zh' ? '碳价 (RMB/tCO2)' : 'Carbon Price (RMB/tCO2)'
      },
      visualMap: {
        min: 0.2,
        max: 0.85,
        dimension: 2,
        orient: 'horizontal',
        left: 'center',
        bottom: 4,
        inRange: { color: ['#93c5fd', '#2563eb', '#0f172a'] },
        text: ['theta high', 'theta low']
      },
      series: [
        {
          type: 'scatter',
          data: copula,
          symbolSize: 6,
          itemStyle: { opacity: 0.72 }
        }
      ]
    });

    makeChart(4, {
      tooltip: { trigger: 'axis' },
      legend: {
        top: 0,
        data:
          lang === 'zh'
            ? ['Vanilla Transformer: x^2', 'Informer/Autoformer: x log(x)', 'VDA Optimized: 0.4 x log(x)']
            : ['Vanilla Transformer: x^2', 'Informer/Autoformer: x log(x)', 'VDA Optimized: 0.4 x log(x)']
      },
      grid: { left: 52, right: 36, top: 48, bottom: 40 },
      xAxis: {
        type: 'category',
        data: benchmark.lengths,
        name: lang === 'zh' ? '序列长度' : 'Sequence Length'
      },
      yAxis: [{ type: 'value', name: lang === 'zh' ? '归一化时间开销' : 'Normalized Time Cost' }],
      series: [
        {
          name: 'Vanilla Transformer: x^2',
          type: 'line',
          data: benchmark.transformer,
          showSymbol: true,
          lineStyle: { width: 2.1, color: '#ef4444' }
        },
        {
          name: 'Informer/Autoformer: x log(x)',
          type: 'line',
          data: benchmark.informer,
          showSymbol: true,
          lineStyle: { width: 2.1, color: '#10b981' },
          markPoint: {
            data: [
              {
                coord: ['3000', benchmark.informer[3]],
                value: '< 50ms',
                label: { formatter: lang === 'zh' ? '3000步 < 50ms' : '3000-step < 50ms' }
              }
            ]
          }
        },
        {
          name: 'VDA Optimized: 0.4 x log(x)',
          type: 'line',
          data: benchmark.vda,
          showSymbol: true,
          lineStyle: { width: 2.3, color: '#0ea5e9' }
        }
      ]
    });

    const pnl = [];
    const bids = [];
    let acc = 0;
    for (let d = 1; d <= 30; d += 1) {
      const drift = (soc - 50) * 0.06 - (maeTolerance - 6) * 0.18 + (policyPressure - 50) * 0.02;
      const rnd = normalLike(d + backtestId * 7, d + 100 + backtestId * 13) * 1.8;
      const pnlStep = 4.5 + drift + rnd;
      acc += pnlStep;
      pnl.push(Number(acc.toFixed(2)));

      const bidPrice = 320 + d * 0.9 + rnd * 3 + (climateIndex - 50) * 0.6;
      bids.push([d, Number(bidPrice.toFixed(2))]);
    }

    makeChart(5, {
      tooltip: { trigger: 'axis' },
      legend: {
        top: 0,
        data: lang === 'zh' ? ['PnL 曲线', '报价点位'] : ['PnL Curve', 'Bid Quotes']
      },
      grid: { left: 52, right: 28, top: 42, bottom: 40 },
      xAxis: { type: 'category', data: Array.from({ length: 30 }, (_, i) => `${i + 1}`), name: lang === 'zh' ? '回测天数' : 'Backtest Day' },
      yAxis: { type: 'value', name: lang === 'zh' ? 'PnL / 报价' : 'PnL / Bid' },
      series: [
        { name: lang === 'zh' ? 'PnL 曲线' : 'PnL Curve', type: 'line', data: pnl, showSymbol: false, lineStyle: { color: '#10b981', width: 2.1 } },
        { name: lang === 'zh' ? '报价点位' : 'Bid Quotes', type: 'scatter', data: bids, symbolSize: 7, itemStyle: { color: '#111827' } }
      ]
    });

    const onResize = () => chartInstances.forEach((chart) => chart.resize());
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      chartInstances.forEach((chart) => chart.dispose());
    };
  }, [
    lang,
    smoothWindow,
    seasonalPeriod,
    jumpIntensity,
    meanReversion,
    regimeSwitchProb,
    passThroughFactor,
    maeTolerance,
    soc,
    sde,
    modelMode,
    sequenceLength,
    climateIndex,
    policyPressure,
    runId,
    backtestId,
    benchmark
  ]);

  const currentStandard = Number((sequenceLength * sequenceLength * 0.00011).toFixed(2));
  const currentVda = Number((sequenceLength * Math.log(sequenceLength) * 0.0035 * 0.4).toFixed(2));

  const cards =
    lang === 'zh'
      ? [
          {
            title: '1. Forecast-X (Autoformer / Transformer-XL)',
            desc: '趋势项(斜率自回归) + 季节项(24h与12h双正弦) + 残差项(高斯白噪声) 三层叠加，并给出95%置信区间。'
          },
          {
            title: '2. Informer ProbSparse Attention',
            desc: '96 x 96 注意力矩阵对比：Vanilla 稠密注意力 vs Top-u Query 稀疏激活，展示 O(L^2) -> O(L log L)。'
          },
          {
            title: '3. SDE Regime-Switching Monte Carlo',
            desc: '基荷/尖峰双状态机，95%维持与5%切换，OU回归 + 极端态泊松跳跃，输出多路径可能性边界。'
          },
          {
            title: '4. Vine Copula (电-碳尾部相关)',
            desc: '中段松散、尾部耦合增强的散点分布，使用时变参数 theta 展示政策松紧对相关性的影响。'
          },
          {
            title: '5. Complexity Benchmark',
            desc: '以 96、720、1440、3000 长度对比 x^2、x log(x)、0.4 x log(x) 三条复杂度曲线。'
          },
          {
            title: '6. Bidding-Bot 策略回测沙盘',
            desc: '输入 MAE 容忍度与储能 SoC，执行 30 天滚动回测并查看 PnL 与报价点位。'
          }
        ]
      : [
          {
            title: '1. Forecast-X (Autoformer / Transformer-XL)',
            desc: 'Additive decomposition with autoregressive trend, dual-sine seasonal terms, and Gaussian residual noise.'
          },
          {
            title: '2. Informer ProbSparse Attention',
            desc: 'A 96 x 96 dense-vs-sparse attention comparison highlighting Top-u query activation.'
          },
          {
            title: '3. SDE Regime-Switching Monte Carlo',
            desc: 'Two-state OU dynamics with 95/5 transition and Poisson jumps under extreme regime.'
          },
          {
            title: '4. Vine Copula (Power-Carbon Tail Dependence)',
            desc: 'Loose center and strong upper-tail coupling with a time-varying theta dependency parameter.'
          },
          {
            title: '5. Complexity Benchmark',
            desc: 'Complexity curves at 96, 720, 1440, and 3000 for x^2, x log(x), and 0.4 x log(x).'
          },
          {
            title: '6. Bidding-Bot Backtest Sandbox',
            desc: 'Set MAE tolerance and storage SoC, then execute a 30-day rolling backtest with PnL and bid traces.'
          }
        ];

  const derivationSteps =
    lang === 'zh'
      ? [
          [
            '趋势项采用自回归漂移: T_t = T_(t-1) + delta_t。',
            '季节项叠加双周期: S_t = a sin(2pi t/p) + b sin(2pi t/(p/2) + phi)。',
            '残差 epsilon_t 作为高斯噪声闭合可分解模型。'
          ],
          [
            '先计算每个 query 的稀疏度度量 M(q_i, K)。',
            '仅保留 Top-u query 做精细注意力，u 与 log(L) 同阶。',
            '其余位置低权重近似，复杂度由 O(L^2) 降至 O(L log L)。'
          ],
          [
            '根据转移矩阵在基荷态与尖峰态之间切换，得到 (mu_r, kappa_r, sigma_r)。',
            '每条路径按离散 OU + 跳跃项递推，后台计算 1000 路径。',
            '前端仅渲染分位带与少量样本路径，实现计算和显示分离。'
          ],
          [
            '构造时变 theta_t 反映政策与市场周期驱动。',
            '线性传导项刻画电价向碳价的主路径影响。',
            '尾部增强项放大高电价区间共振，体现 tail dependence。'
          ],
          [
            '标准 Transformer 全注意力近似二次增长。',
            'Informer/Autoformer 近似线性对数增长。',
            'VDA 通过工程优化系数体现推理加速收益。'
          ],
          [
            '用 MAE 容忍度与 SoC 设定风险预算与仓位倾向。',
            '滚动 30 天生成报价与累计收益。',
            '由曲线斜率与回撤段评估策略鲁棒性。'
          ]
        ]
      : [
          [
            'Trend term uses autoregressive drift: T_t = T_(t-1) + delta_t.',
            'Seasonal term combines dual-period sinusoids.',
            'Residual epsilon_t acts as Gaussian-like noise to close decomposition.'
          ],
          [
            'Compute sparsity score M(q_i, K) for each query.',
            'Keep Top-u queries for exact attention, where u scales with log(L).',
            'Approximate the rest with low weights to reduce complexity.'
          ],
          [
            'Switch between base/peak regimes via transition matrix.',
            'Evolve 1000 paths with discretized OU plus jump process in compute layer.',
            'Render only quantile bands and a few sample paths in view layer.'
          ],
          [
            'Construct time-varying theta_t for policy and cycle effects.',
            'Linear pass-through term captures primary power-to-carbon transmission.',
            'Tail amplification models upper-tail dependence.'
          ],
          [
            'Standard transformer full-attention scales quadratically.',
            'Informer/Autoformer scales close to O(L log L).',
            'VDA coefficient captures systems-level acceleration gains.'
          ],
          [
            'Derive risk budget and position bias from MAE tolerance and SoC.',
            'Roll over 30 days to generate bids and cumulative returns.',
            'Inspect robustness through slope and drawdown segments.'
          ]
        ];

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(260px, 320px) minmax(0, 1fr)', gap: 16 }}>
        <article className="ds-card" style={{ marginBottom: 0 }}>
          <h3 style={{ marginTop: 0 }}>{lang === 'zh' ? '全局参数控制台' : 'Global Parameter Console'}</h3>
          <p style={{ color: '#6b7280', marginTop: 0 }}>{lang === 'zh' ? '用于统一驱动气象极端、政策压力、模型模式与序列长度。' : 'Controls climate stress, policy pressure, model mode, and sequence length.'}</p>
          <label style={{ display: 'grid', gap: 6, marginBottom: 10 }}>
            <span>{lang === 'zh' ? `气象极端指数: ${climateIndex}` : `Climate Index: ${climateIndex}`}</span>
            <input type="range" min="0" max="100" value={climateIndex} onChange={(e) => setClimateIndex(Number(e.target.value))} />
          </label>
          <label style={{ display: 'grid', gap: 6, marginBottom: 10 }}>
            <span>{lang === 'zh' ? `政策压力指数: ${policyPressure}` : `Policy Pressure: ${policyPressure}`}</span>
            <input type="range" min="0" max="100" value={policyPressure} onChange={(e) => setPolicyPressure(Number(e.target.value))} />
          </label>
          <label style={{ display: 'grid', gap: 6, marginBottom: 10 }}>
            <span>{lang === 'zh' ? `序列长度 L: ${sequenceLength}` : `Sequence Length L: ${sequenceLength}`}</span>
            <input type="range" min="96" max="3000" step="24" value={sequenceLength} onChange={(e) => setSequenceLength(Number(e.target.value))} />
          </label>
          <label style={{ display: 'grid', gap: 6, marginBottom: 10 }}>
            <span>{lang === 'zh' ? '性能模式' : 'Performance Mode'}</span>
            <select value={modelMode} onChange={(e) => setModelMode(e.target.value)} style={{ padding: '8px 10px', borderRadius: 8, border: '1px solid #d1d5db' }}>
              <option value="standard">Standard Transformer</option>
              <option value="vda">VDA Optimized (Informer)</option>
            </select>
          </label>
          <div style={{ fontSize: 13, color: '#374151', display: 'grid', gap: 5 }}>
            <div>{lang === 'zh' ? `当前 Standard 开销: ${currentStandard}` : `Current Standard Cost: ${currentStandard}`}</div>
            <div>{lang === 'zh' ? `当前 VDA 开销: ${currentVda}` : `Current VDA Cost: ${currentVda}`}</div>
          </div>
        </article>

        <div style={{ display: 'grid', gap: 16 }}>
          {cards.map((card, idx) => (
            <article key={card.title} className="ds-card" style={{ marginBottom: 0 }}>
              <h3 style={{ marginTop: 0 }}>{card.title}</h3>
              <p style={{ color: '#6b7280', marginTop: 0 }}>{card.desc}</p>

              {idx === 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 10, marginBottom: 12 }}>
                  <label style={{ display: 'grid', gap: 6 }}>
                    <span>{lang === 'zh' ? `平滑窗口: ${smoothWindow}` : `Smoothing Window: ${smoothWindow}`}</span>
                    <input type="range" min="8" max="72" value={smoothWindow} onChange={(e) => setSmoothWindow(Number(e.target.value))} />
                  </label>
                  <label style={{ display: 'grid', gap: 6 }}>
                    <span>{lang === 'zh' ? `周期窗口: ${seasonalPeriod}` : `Seasonal Window: ${seasonalPeriod}`}</span>
                    <input type="range" min="12" max="48" value={seasonalPeriod} onChange={(e) => setSeasonalPeriod(Number(e.target.value))} />
                  </label>
                </div>
              )}

              {idx === 2 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(190px,1fr))', gap: 10, marginBottom: 12 }}>
                  <label style={{ display: 'grid', gap: 6 }}>
                    <span>{lang === 'zh' ? `Jump Intensity: ${jumpIntensity.toFixed(2)}` : `Jump Intensity: ${jumpIntensity.toFixed(2)}`}</span>
                    <input type="range" min="0.4" max="2.2" step="0.05" value={jumpIntensity} onChange={(e) => setJumpIntensity(Number(e.target.value))} />
                  </label>
                  <label style={{ display: 'grid', gap: 6 }}>
                    <span>{lang === 'zh' ? `Mean Reversion: ${meanReversion.toFixed(2)}` : `Mean Reversion: ${meanReversion.toFixed(2)}`}</span>
                    <input type="range" min="0.05" max="0.45" step="0.01" value={meanReversion} onChange={(e) => setMeanReversion(Number(e.target.value))} />
                  </label>
                  <label style={{ display: 'grid', gap: 6 }}>
                    <span>{lang === 'zh' ? `Regime Switch: ${(regimeSwitchProb * 100).toFixed(1)}%` : `Regime Switch: ${(regimeSwitchProb * 100).toFixed(1)}%`}</span>
                    <input type="range" min="0.01" max="0.15" step="0.005" value={regimeSwitchProb} onChange={(e) => setRegimeSwitchProb(Number(e.target.value))} />
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setRunId((v) => v + 1);
                      appendLog(
                        `[Simulation] SDE run #${runId + 1} computed ${sde.pathCount} paths; VaR95(t_end)=${sde.var95.toFixed(2)}.`
                      );
                    }}
                    style={{
                      alignSelf: 'end',
                      padding: '10px 12px',
                      border: '1px solid #111827',
                      background: '#111827',
                      color: '#fff',
                      borderRadius: 8,
                      cursor: 'pointer'
                    }}
                  >
                    {lang === 'zh' ? 'Run Simulation' : 'Run Simulation'}
                  </button>
                </div>
              )}

              {idx === 3 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 10, marginBottom: 12 }}>
                  <label style={{ display: 'grid', gap: 6 }}>
                    <span>{lang === 'zh' ? `碳价传导因子: ${passThroughFactor.toFixed(2)}` : `Pass-through Factor: ${passThroughFactor.toFixed(2)}`}</span>
                    <input type="range" min="0.3" max="1.8" step="0.05" value={passThroughFactor} onChange={(e) => setPassThroughFactor(Number(e.target.value))} />
                  </label>
                </div>
              )}

              {idx === 5 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 10, marginBottom: 12 }}>
                  <label style={{ display: 'grid', gap: 6 }}>
                    <span>{lang === 'zh' ? `MAE容忍度: ${maeTolerance.toFixed(1)}` : `MAE Tolerance: ${maeTolerance.toFixed(1)}`}</span>
                    <input type="range" min="2" max="18" step="0.5" value={maeTolerance} onChange={(e) => setMaeTolerance(Number(e.target.value))} />
                  </label>
                  <label style={{ display: 'grid', gap: 6 }}>
                    <span>{lang === 'zh' ? `初始SoC: ${soc.toFixed(1)}%` : `Initial SoC: ${soc.toFixed(1)}%`}</span>
                    <input type="range" min="10" max="95" step="1" value={soc} onChange={(e) => setSoc(Number(e.target.value))} />
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setBacktestId((v) => v + 1);
                      appendLog(`[Backtest] 30-day sandbox executed. MAE=${maeTolerance.toFixed(1)}, SoC=${soc.toFixed(1)}%.`);
                    }}
                    style={{
                      alignSelf: 'end',
                      padding: '10px 12px',
                      border: '1px solid #111827',
                      background: '#111827',
                      color: '#fff',
                      borderRadius: 8,
                      cursor: 'pointer'
                    }}
                  >
                    {lang === 'zh' ? 'Execute Backtest' : 'Execute Backtest'}
                  </button>
                </div>
              )}

              <div
                ref={(el) => {
                  refs.current[idx] = el;
                }}
                style={{ width: '100%', height: idx === 1 ? 460 : 420 }}
              />

              <div style={{ marginTop: 10, padding: '10px 12px', background: '#f8fafc', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 13, color: '#374151' }}>
                {idx === 0 && (
                  <>
                    <div>{lang === 'zh' ? '公式' : 'Formula'}: x_t = T_t + S_t + epsilon_t</div>
                    <div>{lang === 'zh' ? '参数' : 'Params'}: T_t slope drift in [-0.5, 1.5], seasonal windows = {seasonalPeriod}, {Math.floor(seasonalPeriod / 2)}, smoothing = {smoothWindow}</div>
                  </>
                )}
                {idx === 1 && (
                  <>
                    <div>{lang === 'zh' ? '公式' : 'Formula'}: ProbSparse keeps Top-u queries, u ~ O(log L)</div>
                    <div>{lang === 'zh' ? '参数' : 'Params'}: L = 96, active query rows = O(log 96), sparse cell range = [0.01, 0.05]</div>
                  </>
                )}
                {idx === 2 && (
                  <>
                    <div>{lang === 'zh' ? '公式' : 'Formula'}: dS_t = kappa(mu - S_t)dt + sigma dW_t + dJ_t</div>
                    <div>{lang === 'zh' ? '状态转移矩阵' : 'Transition Matrix'}: [[1-p, p], [p, 1-p]], p = {regimeSwitchProb.toFixed(3)}</div>
                  </>
                )}
                {idx === 3 && (
                  <>
                    <div>{lang === 'zh' ? '公式' : 'Formula'}: C_t = C0 + theta_t * beta * (P_t - P0) + tail(P_t)</div>
                    <div>{lang === 'zh' ? '参数' : 'Params'}: theta_t in [0.25, 0.80], pass-through = {passThroughFactor.toFixed(2)}</div>
                  </>
                )}
                {idx === 4 && (
                  <>
                    <div>{lang === 'zh' ? '公式' : 'Formula'}: y1 = x^2, y2 = x log(x), y3 = 0.4 x log(x)</div>
                    <div>{lang === 'zh' ? '参数' : 'Params'}: x in {'{96, 720, 1440, 3000}'}, current L = {sequenceLength}</div>
                  </>
                )}
                {idx === 5 && (
                  <>
                    <div>{lang === 'zh' ? '策略参数' : 'Strategy Params'}: MAE tolerance = {maeTolerance.toFixed(1)}, SoC = {soc.toFixed(1)}%</div>
                    <div>{lang === 'zh' ? '回测窗口' : 'Backtest Window'}: 30-day rolling simulation</div>
                  </>
                )}

                <details style={{ marginTop: 8 }}>
                  <summary style={{ cursor: 'pointer', fontWeight: 600 }}>
                    {lang === 'zh' ? '可折叠推导步骤' : 'Collapsible Derivation Steps'}
                  </summary>
                  <ol style={{ margin: '8px 0 0 18px', padding: 0 }}>
                    {(derivationSteps[idx] || []).map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ol>
                </details>
              </div>
            </article>
          ))}
        </div>
      </div>

      <article className="ds-card" style={{ marginBottom: 0 }}>
        <h3 style={{ marginTop: 0 }}>{lang === 'zh' ? 'Real-time Console' : 'Real-time Console'}</h3>
        <div style={{ background: '#0b1220', color: '#d1e4ff', borderRadius: 8, padding: 12, minHeight: 140, fontFamily: 'Consolas, Monaco, monospace', fontSize: 12, lineHeight: 1.5 }}>
          {logs.length === 0 ? (
            <div>[System] Ready. Use controls and run modules to generate logs.</div>
          ) : (
            logs.map((line) => <div key={line}>{line}</div>)
          )}
        </div>
      </article>
    </div>
  );
}
