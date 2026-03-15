import React, { useEffect, useState, useRef } from "react";
import ReactECharts from "echarts-for-react";

export const RealtimeScadaChart = ({ scadaStream }) => {
  const chartRef = useRef(null);
  const [data, setData] = useState([]);

  // Real-time SCADA update
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const newPoint = {
        time: now.getTime(), // timestamp (important!)
        value: scadaStream?.power ?? 50 + Math.random() * 20
      };

      setData(prev => {
        const updated = [...prev, newPoint];

        // Keep last 2 minutes (rolling window)
        const twoMinutesAgo = now.getTime() - 120000;
        return updated.filter(d => d.time >= twoMinutesAgo);
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [scadaStream]);

  const option = {
    backgroundColor: "transparent",
    animation: true,
    tooltip: {
      trigger: "axis",
      formatter: params => {
        const p = params[0];
        return `
          <strong>${new Date(p.value[0]).toLocaleTimeString()}</strong><br/>
          Power: ${p.value[1].toFixed(2)} kW
        `;
      }
    },
    grid: { left: 50, right: 30, top: 40, bottom: 50 },
    xAxis: {
      type: "time",
      boundaryGap: false,
      axisLine: { lineStyle: { color: "#94a3b8" } },
      splitLine: { show: false }
    },
    yAxis: {
      type: "value",
      name: "kW",
      axisLine: { lineStyle: { color: "#94a3b8" } },
      splitLine: {
        lineStyle: {
          color: "#e5e7eb"
        }
      }
    },
    series: [
      {
        name: "Live Power",
        type: "line",
        smooth: true,
        showSymbol: false,
        lineStyle: {
          width: 3,
          color: "#2563eb"
        },
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: "rgba(37,99,235,0.4)" },
              { offset: 1, color: "rgba(37,99,235,0.05)" }
            ]
          }
        },
        data: data.map(d => [d.time, d.value])
      }
    ]
  };

  return (
    <ReactECharts
      ref={chartRef}
      option={option}
      style={{ height: 350, width: "100%" }}
      notMerge={true}
      lazyUpdate={true}
    />
  );
};