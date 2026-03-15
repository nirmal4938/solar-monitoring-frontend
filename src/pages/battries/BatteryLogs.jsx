import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TabView, TabPanel } from "primereact/tabview";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { ProgressBar } from "primereact/progressbar";
import { Tag } from "primereact/tag";
import { Carousel } from "primereact/carousel";
import { Chart } from "primereact/chart";
import { Timeline } from "primereact/timeline";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";

export const BatteryLogs = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const toast = useRef(null);

    const [headerSticky, setHeaderSticky] = useState(false);
    const [batteryDetails, setBatteryDetails] = useState({});
    const [batteryLogs, setBatteryLogs] = useState([]);
    const [maintenanceLogs, setMaintenanceLogs] = useState([]);
    const [aiMetrics, setAiMetrics] = useState(null);
    const [alerts, setAlerts] = useState([]);

    useEffect(() => {
        const handleScroll = () => setHeaderSticky(window.scrollY > 40);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const kpis = [
        { label: "Total Capacity", value: batteryDetails?.totalCapacity },
        { label: "Usable Capacity", value: batteryDetails?.usableCapacity },
        { label: "Max Charge Power", value: batteryDetails?.maxChargePower },
        { label: "Max Discharge Power", value: batteryDetails?.maxDischargePower },
        { label: "Health", value: batteryDetails?.healthPct, type: "progress" },
        { label: "Active Alerts", value: <Tag value={alerts?.length || 0} severity="danger" /> },
    ];

    const radarData = {
        labels: ['Efficiency', 'Arbitrage', 'Peak Shaving', 'Health', 'Overall'],
        datasets: [{
            label: 'AI Scores',
            data: [
                aiMetrics?.efficiencyScore,
                aiMetrics?.arbitrageScore,
                aiMetrics?.peakShavingScore,
                aiMetrics?.healthScore,
                aiMetrics?.overallScore
            ],
            backgroundColor: 'rgba(30,58,175,0.3)',
            borderColor: '#1e3a8a',
            borderWidth: 2
        }]
    };

    return (
        <div className="bb-page">

            <Toast ref={toast} />

            {/* HEADER */}
            <div className={`bb-header ${headerSticky ? 'bb-header-sticky' : ''}`}>
                <div className="bb-header-left">
                    <div className="bb-breadcrumb">
                        <i className="pi pi-home"></i>
                        <span>Batteries</span>
                        <i className="pi pi-angle-right"></i>
                        <span className="current">{batteryDetails?.name || "Battery Logs"}</span>
                    </div>
                    <div className="bb-title-row">
                        <h1 className="bb-title">{batteryDetails?.name || "Battery Logs & Insights"}</h1>
                        <span className={`bb-status-dot ${batteryDetails?.status?.toLowerCase() || 'idle'}`}></span>
                    </div>
                    <div className="bb-header-meta">
                        <Tag value={batteryDetails?.status} icon="pi pi-bolt" severity="info" rounded />
                        <span className="bb-meta-item"><i className="pi pi-map-marker"></i>{batteryDetails?.plantName}</span>
                        <span className="bb-meta-item"><i className="pi pi-chart-line"></i>{batteryDetails?.totalCapacity} kWh</span>
                    </div>
                </div>
                <div className="bb-actions">
                    <Button icon="pi pi-arrow-left" label="Back" className="p-button-text p-button-sm"
                        onClick={() => navigate("/batteries")} />
                    <Button icon="pi pi-pencil" label="Edit Battery" className="p-button-sm CTA-Button"
                        onClick={() => navigate(`/batteries/edit/${id}`)} rounded />
                    <Button icon="pi pi-bell" className="p-button-text"
                        onClick={() => toast.current.show({ severity:'info', summary:'Alerts', detail:'You have new alerts', life: 3000 })}/>
                </div>
            </div>

            {/* KPI Carousel */}
            <Carousel
                value={kpis}
                numVisible={3}
                numScroll={1}
                className="bb-carousel"
                itemTemplate={(item) => (
                    <Card className="bb-card-xxl bb-hover-glow">
                        <div className="bb-kpi-content">
                            <span className="bb-card-label">{item.label}</span>
                            {item.type === "progress"
                                ? <ProgressBar value={item.value || 0} showValue className="bb-progressbar bb-progress-animated" />
                                : <strong className="bb-card-value">{item.value}</strong>
                            }
                        </div>
                    </Card>
                )}
            />

            {/* TABS */}
            <TabView className="bb-tabs bb-tabs-giant">
                <TabPanel header="Basic Info">
                    <div className="formgrid grid bb-grid-giant">
                        <InputText label="Battery Name" value={batteryDetails?.name} disabled className="glass-input"/>
                        <InputText label="Plant" value={batteryDetails?.plantName} disabled className="glass-input"/>
                        <Tag value={batteryDetails?.status} severity="success" className="p-4 w-full text-center pulse-tag"/>
                        <ProgressBar value={batteryDetails?.healthPct || 0} showValue className="h-5 border-round neon-progress"/>
                        <InputNumber label="Total Capacity" value={batteryDetails?.totalCapacity} disabled className="glass-input"/>
                        <InputNumber label="Usable Capacity" value={batteryDetails?.usableCapacity} disabled className="glass-input"/>
                    </div>
                </TabPanel>

                <TabPanel header="Specifications">
                    <div className="formgrid grid bb-grid-giant">
                        <InputNumber label="Max Charge Power" value={batteryDetails?.maxChargePower} disabled className="glass-input"/>
                        <InputNumber label="Max Discharge Power" value={batteryDetails?.maxDischargePower} disabled className="glass-input"/>
                        <InputNumber label="Round Trip Efficiency" value={batteryDetails?.roundTripEfficiency} disabled className="glass-input"/>
                        <InputNumber label="Depth of Discharge" value={batteryDetails?.depthOfDischarge} disabled className="glass-input"/>
                    </div>
                </TabPanel>

                <TabPanel header="Financial Metrics">
                    <div className="formgrid grid bb-grid-giant">
                        <InputNumber label="Arbitrage Savings ($)" value={batteryDetails?.arbitrageSavings} disabled className="glass-input"/>
                        <InputNumber label="Demand Charge Savings ($)" value={batteryDetails?.demandChargeSavings} disabled className="glass-input"/>
                        <InputNumber label="Degradation Cost ($)" value={batteryDetails?.degradationCost} disabled className="glass-input"/>
                        <InputNumber label="Adjusted Net Bill Impact ($)" value={batteryDetails?.adjustedNetBillImpact} disabled className="glass-input"/>
                    </div>
                </TabPanel>

                <TabPanel header="Charge/Discharge Logs">
                    <DataTable value={batteryLogs} paginator rows={10} stripedRows stickyHeader scrollable scrollHeight="500px"
                        rowHover expandedRows={batteryLogs} rowExpansionTemplate={(data) => (
                            <Card className="bb-log-card">
                                <p><strong>Details:</strong> {JSON.stringify(data)}</p>
                                <Button icon="pi pi-pencil" label="Edit" className="p-button-sm p-mr-2"/>
                                <Button icon="pi pi-trash" label="Delete" className="p-button-sm p-button-danger"/>
                            </Card>
                        )}>
                        <Column expander style={{ width: '3em' }} />
                        <Column field="timestamp" header="Timestamp" sortable/>
                        <Column field="charge_kw" header="Charge (kW)" sortable/>
                        <Column field="discharge_kw" header="Discharge (kW)" sortable/>
                        <Column field="soc_percent" header="SOC (%)" sortable/>
                        <Column field="battery_temperature_c" header="Temperature (°C)" sortable/>
                        <Column field="cycle_count" header="Cycle Count" sortable/>
                        <Column field="status" header="Status" sortable/>
                    </DataTable>
                </TabPanel>

                <TabPanel header="Maintenance Logs">
                    <DataTable value={maintenanceLogs} paginator rows={5} stripedRows stickyHeader scrollable scrollHeight="400px">
                        <Column field="performed_at" header="Performed At" sortable/>
                        <Column field="issue_description" header="Issue" sortable/>
                        <Column field="action_taken" header="Action Taken" sortable/>
                        <Column field="cost" header="Cost ($)" sortable/>
                    </DataTable>
                </TabPanel>

                <TabPanel header="AI Metrics">
                    <Chart type="radar" data={radarData} className="radar-glow"/>
                </TabPanel>

                <TabPanel header="Alerts Timeline">
                    <Timeline value={alerts} align="alternate" className="custom-timeline"
                        content={(item) => (
                            <Card className="bb-alert-card pulse-card">
                                <Tag value={item.severity} severity={item.severity.toLowerCase()} />
                                <p>{item.message}</p>
                                <small>{item.triggeredAt}</small>
                            </Card>
                        )}
                    />
                </TabPanel>
            </TabView>

            <style>{`
                .bb-page { padding:40px; background: linear-gradient(160deg, #f0f4ff, #e0f7ff); min-height:100vh; }
                .bb-header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:40px; background:rgba(255,255,255,0.9); backdrop-filter: blur(10px); border-radius:18px; padding:24px; transition: all 0.4s ease; }
                .bb-header-sticky { position:sticky; top:0; z-index:200; box-shadow:0 12px 32px rgba(0,0,0,0.25); }
                .bb-title { font-size:36px; font-weight:900; color:#1e3a8a; }
                .bb-breadcrumb span { font-size:14px; color:#64748b; }
                .bb-header-meta span { font-size:16px; margin-right:12px; }
                .bb-actions .p-button { font-weight:600; }
                .bb-carousel .p-carousel-item { padding:16px; }
                .bb-card-xxl { padding:36px 28px; border-radius:28px; background:linear-gradient(135deg, #ffffff, #a3c2f7); box-shadow:0 12px 36px rgba(0,0,0,0.25); transition: transform 0.4s ease, box-shadow 0.4s ease; display:flex; flex-direction:column; justify-content:center; align-items:center; min-height:260px; }
                .bb-hover-glow:hover { transform: translateY(-10px) scale(1.05); box-shadow:0 20px 48px rgba(0,0,0,0.3); }
                .bb-card-label { font-size:20px; font-weight:700; color:#334155; text-transform:uppercase; }
                .bb-card-value { font-size:42px; font-weight:900; color:#1e3a8a; }
                .bb-progressbar.bb-progress-animated { transition: all 1s ease; height:16px; border-radius:12px; }
                .bb-grid-giant > * { min-width:360px; margin-bottom:28px; }
                .glass-input .p-inputtext, .glass-input .p-inputnumber { backdrop-filter: blur(12px); background: rgba(255,255,255,0.2); border:1px solid rgba(255,255,255,0.4); border-radius:16px; padding:12px; color:#1e3a8a; font-weight:600; }
                .pulse-tag { animation: pulse 2s infinite; font-size:16px; }
                .pulse-card { animation: pulse 1.8s infinite; border-radius:18px; box-shadow:0 8px 28px rgba(0,0,0,0.2); }
                .radar-glow canvas { filter: drop-shadow(0 0 10px rgba(30,58,175,0.6)); }
                @keyframes pulse { 0%{ transform:scale(1); } 50%{ transform:scale(1.03); } 100%{ transform:scale(1); } }
                .neon-progress .p-progressbar-value { background: linear-gradient(90deg, #3b82f6, #1e3a8a); }
            `}</style>
        </div>
    );
};