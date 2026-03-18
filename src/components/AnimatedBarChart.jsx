import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const AnimatedBarChart = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    const chartDom = chartRef.current;
    const myChart = echarts.init(chartDom, 'dark'); // use built-in dark theme

    const xAxisData = [];
    const data1 = [];
    const data2 = [];
    for (let i = 0; i < 100; i++) {
      xAxisData.push(i);
      data1.push((Math.sin(i / 5) * (i / 5 - 10) + i / 6) * 5);
      data2.push((Math.cos(i / 5) * (i / 5 - 10) + i / 6) * 5);
    }

    const option = {
      backgroundColor: 'transparent', // background transparent to fit dark-zone
      title: {
        text: 'STRATEGY DELTA (AGENT A vs B)',
        left: 'center',
        textStyle: { color: '#fff', fontSize: 14, fontFamily: 'Arial, Helvetica, sans-serif' }
      },
      legend: {
        data: ['Strategy A', 'Strategy B'],
        bottom: 0,
        textStyle: { color: '#666' }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' }
      },
      grid: {
        top: '15%',
        left: '5%',
        right: '5%',
        bottom: '15%',
        containLabel: true
      },
      xAxis: {
        data: xAxisData,
        splitLine: { show: false },
        axisLine: { lineStyle: { color: '#333' } }
      },
      yAxis: {
        splitLine: { lineStyle: { color: '#1a1a1a' } },
        axisLine: { show: false }
      },
      series: [
        {
          name: 'Strategy A',
          type: 'bar',
          data: data1,
          itemStyle: { color: '#62ff29' }, // VDESK signature green
          emphasis: { focus: 'series' },
          animationDelay: (idx) => idx * 10
        },
        {
          name: 'Strategy B',
          type: 'bar',
          data: data2,
          itemStyle: { color: '#ffffff' }, // white contrast
          emphasis: { focus: 'series' },
          animationDelay: (idx) => idx * 10 + 100
        }
      ],
      animationEasing: 'elasticOut',
      animationDelayUpdate: (idx) => idx * 5
    };

    myChart.setOption(option);

    const handleResize = () => myChart.resize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      myChart.dispose();
    };
  }, []);

  return <div ref={chartRef} style={{ width: '100%', height: '300px' }} />;
};

export default AnimatedBarChart;