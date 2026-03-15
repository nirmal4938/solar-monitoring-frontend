import React from "react";
import { Stage, Layer, Circle, Text, Line } from "react-konva";

export default function SmartScadaCanvas({ data }) {
  const {
    gridImport,
    solarProduction,
    batteryCharge,
    loadConsumption
  } = data;

  const netEnergy = solarProduction - loadConsumption;

  const riskLevel =
    netEnergy < -200 ? "HIGH" :
    netEnergy < 0 ? "MODERATE" : "LOW";

  const flowColor =
    netEnergy >= 0 ? "#22c55e" : "#ef4444";

  return (
    <Stage width={900} height={500}>
      <Layer>

        {/* LOAD NODE */}
        <Circle x={450} y={250} radius={60} fill="#f3f4f6" stroke="#374151" />
        <Text
          x={400}
          y={230}
          text={`Load\n${loadConsumption} kW`}
          fontSize={16}
        />

        {/* SOLAR NODE */}
        <Circle x={200} y={120} radius={50} fill="#e0f2fe" />
        <Text
          x={160}
          y={100}
          text={`Solar\n${solarProduction} kW`}
          fontSize={14}
        />

        {/* GRID NODE */}
        <Circle x={200} y={380} radius={50} fill="#fef3c7" />
        <Text
          x={165}
          y={360}
          text={`Grid\n${gridImport} kW`}
          fontSize={14}
        />

        {/* BATTERY NODE */}
        <Circle x={700} y={250} radius={50} fill="#dcfce7" />
        <Text
          x={660}
          y={230}
          text={`Battery\n${batteryCharge} kW`}
          fontSize={14}
        />

        {/* FLOW LINES */}
        <Line
          points={[250, 120, 390, 250]}
          stroke={flowColor}
          strokeWidth={Math.abs(netEnergy) / 20}
        />

        <Line
          points={[250, 380, 390, 250]}
          stroke="#f59e0b"
          strokeWidth={gridImport / 20}
        />

        <Line
          points={[510, 250, 650, 250]}
          stroke="#10b981"
          strokeWidth={batteryCharge / 20}
        />

        {/* RISK DISPLAY */}
        <Text
          x={350}
          y={420}
          text={`System Risk Level: ${riskLevel}`}
          fontSize={18}
          fill={
            riskLevel === "HIGH"
              ? "#ef4444"
              : riskLevel === "MODERATE"
              ? "#f59e0b"
              : "#10b981"
          }
        />

      </Layer>
    </Stage>
  );
}