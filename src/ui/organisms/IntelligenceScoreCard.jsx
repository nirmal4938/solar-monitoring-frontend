import { Card } from "primereact/card";

export default function IntelligenceScoreCard({ scores }) {
  return (
    <Card className="shadow-2 border-round-xl">
      <h4>AI Intelligence</h4>
      <div className="grid mt-3">
        <div className="col-6">Energy: {scores.energy_efficiency_score}</div>
        <div className="col-6">Reliability: {scores.reliability_score}</div>
        <div className="col-6">Anomaly: {scores.anomaly_score}</div>
        <div className="col-6">Overall: {scores.overall_intelligence_score}</div>
      </div>
    </Card>
  );
}