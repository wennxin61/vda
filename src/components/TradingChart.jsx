import React, { useEffect, useRef, useState } from 'react';
import { LineSeries, createChart } from 'lightweight-charts';

const TV_COLORS = {
  background: 'rgba(0, 0, 0, 0.4)',
  text: '#fff',
  grid: 'rgba(255, 255, 255, 0.1)',
  border: 'rgba(255, 255, 255, 0.15)',
  line: '#fff',
  accent: '#62ff29'
};

const random = (min, max) => min + Math.random() * (max - min);

const round2 = (value) => Number(value.toFixed(2));

const gaussian = (x, mean, sigma) => {
  const z = (x - mean) / sigma;
  return Math.exp(-0.5 * z * z);
};

const toUtcSeconds = (date) => Math.floor(date.getTime() / 1000);

const calcPowerPrice = (pointIndex, previousValue) => {
  const hour = pointIndex % 24;
  const morningPeak = 95 * gaussian(hour, 9, 2.1);
  const eveningPeak = 115 * gaussian(hour, 20, 2.4);
  const deepNightValley = -78 * gaussian(hour, 3, 2.6);
  const randomLoad = random(-18, 18);
  const meanRevert = (320 - previousValue) * 0.08;

  return round2(previousValue + morningPeak * 0.08 + eveningPeak * 0.08 + deepNightValley * 0.1 + randomLoad + meanRevert);
};

const generatePowerData = (count = 300) => {
  const data = [];
  const baseDate = new Date(Date.UTC(2026, 2, 14, 0, 0, 0));
  let previousValue = 300;

  for (let i = 0; i < count; i += 1) {
    const date = new Date(baseDate);
    date.setHours(baseDate.getHours() + i);
    const value = calcPowerPrice(i, previousValue);

    data.push({
      time: toUtcSeconds(date),
      value
    });

    previousValue = value;
  }

  return data;
};

const generatePredictedFromActual = (actualData) => {
  if (!Array.isArray(actualData) || actualData.length === 0) return [];
  return actualData.map((p, i) => {
    const prev = actualData[Math.max(0, i - 1)]?.value ?? p.value;
    const trend = (p.value - prev) * 0.65;
    const noise = random(-8, 8);
    return { time: p.time, value: round2(prev + trend + noise) };
  });
};

export default function TradingChart() {
  const chartContainerRef = useRef(null);
  const [rangeInfo, setRangeInfo] = useState({ abs: 0, pct: 0 });

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { color: 'transparent' },
        textColor: TV_COLORS.text
      },
      grid: {
        vertLines: { color: TV_COLORS.grid },
        horzLines: { color: TV_COLORS.grid }
      },
      rightPriceScale: { visible: true, borderColor: TV_COLORS.border },
      timeScale: { borderColor: TV_COLORS.border },
      watermark: { visible: false },
      width: chartContainerRef.current.clientWidth,
      height: 400,
      crosshair: { horzLine: { color: TV_COLORS.border }, vertLine: { color: TV_COLORS.border } },
      handleScale: { axisPressedMouseMove: true, mouseWheel: true, pinch: true },
      handleScroll: { mouseWheel: true, pressedMouseMove: true, horzTouchDrag: true, vertTouchDrag: true },
      localization: { priceFormatter: (p) => p.toFixed(2) }
    });

    const lineSeriesOptions = {
      color: TV_COLORS.line,
      lineWidth: 1.5,
      priceLineColor: TV_COLORS.accent,
      crosshairMarkerVisible: true,
      crosshairMarkerRadius: 3,
      lastValueVisible: true,
      priceLineVisible: true
    };

    const lineSeries =
      typeof chart.addSeries === 'function'
        ? chart.addSeries(LineSeries, lineSeriesOptions)
        : chart.addLineSeries(lineSeriesOptions);

    const predSeriesOptions = {
      color: TV_COLORS.accent,
      lineWidth: 1.5,
      priceLineVisible: false,
      lastValueVisible: true,
      crosshairMarkerVisible: true,
      crosshairMarkerRadius: 2
    };

    const predSeries =
      typeof chart.addSeries === 'function'
        ? chart.addSeries(LineSeries, predSeriesOptions)
        : chart.addLineSeries(predSeriesOptions);

    const mockData = generatePowerData(300);
    lineSeries.setData(mockData);
    predSeries.setData(generatePredictedFromActual(mockData));
    chart.timeScale().fitContent();

    const latestWindow = mockData.slice(-24);
    const maxInWindow = Math.max(...latestWindow.map((p) => p.value));
    const minInWindow = Math.min(...latestWindow.map((p) => p.value));
    const seed = mockData[mockData.length - 1];
    setRangeInfo({
      abs: round2(maxInWindow - minInWindow),
      pct: round2(((maxInWindow - minInWindow) / seed.value) * 100)
    });

    const handleResize = () => {
      chart.applyOptions({ width: chartContainerRef.current.clientWidth });
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, []);

  return (
    <div
      style={{
        width: '100%',
        position: 'sticky',
        top: '100px',
        zIndex: 10,
        pointerEvents: 'auto'
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '10px 15px',
          background: 'rgba(255, 255, 255, 0)',
          backdropFilter: 'blur(8px)',
          borderTopLeftRadius: '8px',
          borderTopRightRadius: '8px',
          color: TV_COLORS.text,
          fontSize: 12,
          border: `1px solid ${TV_COLORS.border}`,
          borderBottom: 'none'
        }}
      >
        <div>24H RANGE: {rangeInfo.abs.toFixed(2)} ({rangeInfo.pct.toFixed(2)}%)</div>
        <div style={{ opacity: 0.8 }}>LIVE MARKET MONITOR</div>
      </div>

      <div
        ref={chartContainerRef}
        style={{
          border: `1px solid ${TV_COLORS.border}`,
          background: 'rgba(0, 0, 0, 0.3)',
          backdropFilter: 'blur(12px)',
          width: '100%',
          overflow: 'hidden'
        }}
      />
    </div>
  );
}
