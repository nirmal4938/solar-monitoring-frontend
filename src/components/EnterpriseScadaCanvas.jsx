// import {
//   Stage,
//   Layer,
//   Rect,
//   Text,
//   Line,
//   Circle,
//   Group,
//   Path
// } from "react-konva";
// import { useEffect, useRef, useState } from "react";

// const VIRTUAL_WIDTH = 1300;
// const VIRTUAL_HEIGHT = 700;

// /* ========================================================= */
// /* ================= SHARED GLASS RING ===================== */
// /* ========================================================= */

// const GlassRing = ({ color, glow }) => (
//   <Circle
//     radius={70}
//     stroke={color}
//     strokeWidth={4}
//     shadowColor={glow ? color : undefined}
//     shadowBlur={glow ? 30 : 0}
//   />
// );

// /* ========================================================= */
// /* ================= SOLAR PANEL =========================== */
// /* ========================================================= */

// const SolarPanelIcon = ({ x, y, power, alert }) => (
//   <Group x={x} y={y}>
//     <GlassRing color="#38bdf8" glow={alert} />

//     <Circle y={-55} radius={10} fill="#38bdf8" />
//     {[...Array(8)].map((_, i) => (
//       <Line
//         key={i}
//         points={[0, -55, 0, -75]}
//         stroke="#38bdf8"
//         strokeWidth={2}
//         rotation={(360 / 8) * i}
//       />
//     ))}

//     <Group rotation={-15}>
//       <Rect
//         x={-40}
//         y={-10}
//         width={80}
//         height={50}
//         fill="#0ea5e9"
//         stroke="#38bdf8"
//         strokeWidth={3}
//         cornerRadius={4}
//       />
//     </Group>

//     <Text
//       text={`${power.toFixed(0)} kW`}
//       y={85}
//       width={140}
//       align="center"
//       offsetX={70}
//       fill="#38bdf8"
//     />
//   </Group>
// );

// /* ========================================================= */
// /* ================= LOAD ================================= */
// /* ========================================================= */

// const LoadIcon = ({ x, y, power, alert }) => (
//   <Group x={x} y={y}>
//     <GlassRing color="#f97316" glow={alert} />

//     <Path
//       data="M-35 10 L0 -25 L35 10 L35 40 L-35 40 Z"
//       stroke="#f97316"
//       strokeWidth={3}
//     />

//     <Rect
//       x={-10}
//       y={20}
//       width={20}
//       height={20}
//       stroke="#f97316"
//       strokeWidth={2}
//     />

//     <Text
//       text={`${power.toFixed(0)} kW`}
//       y={90}
//       width={140}
//       align="center"
//       offsetX={70}
//       fill="#f97316"
//     />
//   </Group>
// );

// /* ========================================================= */
// /* ================= BATTERY =============================== */
// /* ========================================================= */

// const BatteryIcon = ({ x, y, soc, alert }) => {
//   const fillHeight = (soc / 100) * 70;

//   return (
//     <Group x={x} y={y}>
//       <GlassRing color="#a78bfa" glow={alert} />

//       <Rect
//         x={-25}
//         y={-35}
//         width={50}
//         height={70}
//         stroke="#a78bfa"
//         strokeWidth={3}
//         cornerRadius={6}
//       />

//       <Rect
//         x={-8}
//         y={-45}
//         width={16}
//         height={8}
//         fill="#a78bfa"
//         cornerRadius={2}
//       />

//       <Rect
//         x={-21}
//         y={35 - fillHeight}
//         width={42}
//         height={fillHeight}
//         fill={
//           soc < 20
//             ? "#ef4444"
//             : soc < 50
//             ? "#f59e0b"
//             : "#22c55e"
//         }
//         cornerRadius={4}
//       />

//       <Text
//         text={`${soc.toFixed(0)} %`}
//         y={90}
//         width={140}
//         align="center"
//         offsetX={70}
//         fill="#a78bfa"
//       />
//     </Group>
//   );
// };

// /* ========================================================= */
// /* ================= GRID ================================= */
// /* ========================================================= */

// const GridIcon = ({ x, y, power, alert }) => (
//   <Group x={x} y={y}>
//     <GlassRing color="#ef4444" glow={alert} />

//     <Path
//       data="
//         M0 -35 
//         L18 30 
//         L8 30 
//         L15 50 
//         L-15 50 
//         L-8 30 
//         L-18 30 Z
//         M-25 -5 L25 -5
//         M-18 10 L18 10
//       "
//       stroke="#ef4444"
//       strokeWidth={3}
//     />

//     <Text
//       text={`${power.toFixed(0)} kW`}
//       y={90}
//       width={140}
//       align="center"
//       offsetX={70}
//       fill="#ef4444"
//     />
//   </Group>
// );

// /* ========================================================= */
// /* ================= MAIN ================================= */
// /* ========================================================= */

// export default function EnterpriseScadaCanvas({
//   totalGeneration = 0,
//   totalConsumption = 0
// }) {
//   const containerRef = useRef(null);
//   const [scale, setScale] = useState(1);

//   const [produced, setProduced] = useState(totalGeneration);
//   const [consumed, setConsumed] = useState(totalConsumption);
//   const [soc, setSoc] = useState(60);
//   const [flowTick, setFlowTick] = useState(0);
//   const [clock, setClock] = useState(new Date());

//   const lastFrame = useRef(performance.now());

//   /* Responsive */
//   useEffect(() => {
//     const resize = () => {
//       if (!containerRef.current) return;
//       setScale(containerRef.current.offsetWidth / VIRTUAL_WIDTH);
//     };
//     resize();
//     window.addEventListener("resize", resize);
//     return () => window.removeEventListener("resize", resize);
//   }, []);

//   /* Real-Time Loop */
//   useEffect(() => {
//     let frame;

//     const animate = (now) => {
//       const delta = (now - lastFrame.current) / 1000;
//       lastFrame.current = now;

//       const nowDate = new Date();
//       setClock(nowDate);

//       const hour =
//         nowDate.getHours() +
//         nowDate.getMinutes() / 60;

//       /* Solar Model */
//       const solarPeak = 900;
//       const solar =
//         Math.max(
//           0,
//           solarPeak *
//             Math.sin((Math.PI * (hour - 6)) / 12)
//         );

//       /* Load Model */
//       const baseLoad = 500;
//       const eveningBoost =
//         hour > 18 && hour < 23 ? 250 : 0;
//       const load =
//         baseLoad +
//         120 * Math.sin(hour / 3) +
//         eveningBoost;

//       /* Battery Physics */
//       const net = solar - load;
//       const capacity = 1000; // kWh
//       const maxRate = 200; // kW

//       const batteryPower = Math.max(
//         -maxRate,
//         Math.min(maxRate, net)
//       );

//       let newSoc =
//         soc +
//         (batteryPower * delta) / capacity * 100;

//       newSoc = Math.max(0, Math.min(100, newSoc));

//       setProduced(solar);
//       setConsumed(load);
//       setSoc(newSoc);
//       setFlowTick((t) => (t + 1) % 100);

//       frame = requestAnimationFrame(animate);
//     };

//     frame = requestAnimationFrame(animate);
//     return () => cancelAnimationFrame(frame);
//   }, [soc]);

//   const net = produced - consumed;
//   const imported = net < 0 ? Math.abs(net) : 0;
//   const exported = net > 0 ? net : 0;

//   const renderFlow = (start, end, magnitude, color, reverse = false) => {
//     if (magnitude < 10) return null;

//     const dx = end[0] - start[0];
//     const dy = end[1] - start[1];

//     return [...Array(6)].map((_, i) => {
//       const t = ((flowTick + i * 15) % 100) / 100;
//       const progress = reverse ? 1 - t : t;
//       return (
//         <Circle
//           key={i}
//           x={start[0] + dx * progress}
//           y={start[1] + dy * progress}
//           radius={4}
//           fill={color}
//         />
//       );
//     });
//   };

//   return (
//     <div
//       ref={containerRef}
//       style={{
//         width: "100%",
//         background:
//           "linear-gradient(135deg,#050b18,#0f172a)"
//       }}
//     >
//       <Stage
//         width={VIRTUAL_WIDTH}
//         height={VIRTUAL_HEIGHT}
//         scaleX={scale}
//         scaleY={scale}
//       >
//         <Layer>

//           {/* Clock */}
//           <Text
//             text={clock.toLocaleString()}
//             x={950}
//             y={20}
//             fill="#94a3b8"
//             fontSize={20}
//           />

//           {/* Lines */}
//           <Line points={[300, 200, 650, 360]} stroke="#38bdf8" strokeWidth={3} />
//           <Line points={[1000, 200, 650, 360]} stroke="#a78bfa" strokeWidth={3} />
//           <Line points={[300, 550, 650, 360]} stroke="#ef4444" strokeWidth={3} />

//           {/* Nodes */}
//           <SolarPanelIcon x={300} y={200} power={produced} alert={produced < 200} />
//           <LoadIcon x={650} y={360} power={consumed} alert={consumed > 850} />
//           <BatteryIcon x={1000} y={200} soc={soc} alert={soc < 20} />
//           <GridIcon x={300} y={550} power={imported || exported} alert={imported > 500} />

//           {/* Flows */}
//           {renderFlow([300, 200], [650, 360], produced, "#38bdf8")}
//           {renderFlow([300, 550], [650, 360], imported, "#ef4444")}
//           {renderFlow([650, 360], [300, 550], exported, "#22c55e", true)}

//         </Layer>
//       </Stage>
//     </div>
//   );
// }


import {
  Stage,
  Layer,
  Rect,
  Text,
  Line,
  Circle,
  Group,
  Path
} from "react-konva";
import { useEffect, useRef, useState } from "react";

const VIRTUAL_WIDTH = 1300;
const VIRTUAL_HEIGHT = 700;

/* ========================================================= */
/* ================= SHARED GLASS RING ===================== */
/* ========================================================= */

const GlassRing = ({ color, glow }) => (
  <Circle
    radius={70}
    stroke={color}
    strokeWidth={4}
    shadowColor={glow ? color : undefined}
    shadowBlur={glow ? 30 : 0}
  />
);

/* ========================================================= */
/* ================= SOLAR ================================= */
/* ========================================================= */

const SolarPanelIcon = ({ x, y, power, alert }) => (
  <Group x={x} y={y}>
    <GlassRing color="#38bdf8" glow={alert} />

    <Circle y={-55} radius={10} fill="#38bdf8" />
    {[...Array(8)].map((_, i) => (
      <Line
        key={i}
        points={[0, -55, 0, -75]}
        stroke="#38bdf8"
        strokeWidth={2}
        rotation={(360 / 8) * i}
      />
    ))}

    <Group rotation={-15}>
      <Rect
        x={-40}
        y={-10}
        width={80}
        height={50}
        fill="#0ea5e9"
        stroke="#38bdf8"
        strokeWidth={3}
        cornerRadius={4}
      />
    </Group>

    <Text
      text={`${power?.toFixed(0) ?? 0} kW`}
      y={85}
      width={140}
      align="center"
      offsetX={70}
      fill="#38bdf8"
    />
  </Group>
);

/* ========================================================= */
/* ================= LOAD ================================== */
/* ========================================================= */

const LoadIcon = ({ x, y, power, alert }) => (
  <Group x={x} y={y}>
    <GlassRing color="#f97316" glow={alert} />

    <Path
      data="M-35 10 L0 -25 L35 10 L35 40 L-35 40 Z"
      stroke="#f97316"
      strokeWidth={3}
    />

    <Rect
      x={-10}
      y={20}
      width={20}
      height={20}
      stroke="#f97316"
      strokeWidth={2}
    />

    <Text
      text={`${power?.toFixed(0) ?? 0} kW`}
      y={90}
      width={140}
      align="center"
      offsetX={70}
      fill="#f97316"
    />
  </Group>
);

/* ========================================================= */
/* ================= BATTERY =============================== */
/* ========================================================= */

const BatteryIcon = ({ x, y, soc, alert }) => {
  const fillHeight = ((soc ?? 0) / 100) * 70;

  return (
    <Group x={x} y={y}>
      <GlassRing color="#a78bfa" glow={alert} />

      <Rect
        x={-25}
        y={-35}
        width={50}
        height={70}
        stroke="#a78bfa"
        strokeWidth={3}
        cornerRadius={6}
      />

      <Rect
        x={-8}
        y={-45}
        width={16}
        height={8}
        fill="#a78bfa"
        cornerRadius={2}
      />

      <Rect
        x={-21}
        y={35 - fillHeight}
        width={42}
        height={fillHeight}
        fill={
          soc < 20
            ? "#ef4444"
            : soc < 50
            ? "#f59e0b"
            : "#22c55e"
        }
        cornerRadius={4}
      />

      <Text
        text={`${soc?.toFixed(0) ?? 0} %`}
        y={90}
        width={140}
        align="center"
        offsetX={70}
        fill="#a78bfa"
      />
    </Group>
  );
};

/* ========================================================= */
/* ================= GRID ================================= */
/* ========================================================= */

const GridIcon = ({ x, y, power, alert }) => (
  <Group x={x} y={y}>
    <GlassRing color="#ef4444" glow={alert} />

    <Path
      data="
        M0 -35 
        L18 30 
        L8 30 
        L15 50 
        L-15 50 
        L-8 30 
        L-18 30 Z
        M-25 -5 L25 -5
        M-18 10 L18 10
      "
      stroke="#ef4444"
      strokeWidth={3}
    />

    <Text
      text={`${power?.toFixed(0) ?? 0} kW`}
      y={90}
      width={140}
      align="center"
      offsetX={70}
      fill="#ef4444"
    />
  </Group>
);

/* ========================================================= */
/* ================= MAIN PURE RENDER ====================== */
/* ========================================================= */

export default function EnterpriseScadaCanvas({ data 
 }) {
    console.log("scada-----", data)
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [flowTick, setFlowTick] = useState(0);

  /* Responsive Scaling */
  useEffect(() => {
    const resize = () => {
      if (!containerRef.current) return;
      setScale(containerRef.current.offsetWidth / VIRTUAL_WIDTH);
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  /* Flow animation only (visual) */
  useEffect(() => {
    const interval = setInterval(() => {
      setFlowTick((t) => (t + 1) % 100);
    }, 60);
    return () => clearInterval(interval);
  }, []);

  if (!data) return null;

  const { nodes, flows, systemHealth, timestamp } = data;

  const produced = nodes?.solar?.power ?? 0;
  const consumed = nodes?.load?.power ?? 0;
  const soc = nodes?.battery?.soc ?? 0;
  const gridPower = nodes?.grid?.power ?? 0;

  const solarAlert = nodes?.solar?.alarms?.length > 0;
  const loadAlert = nodes?.load?.status === "critical";
  const batteryAlert = soc < 20;
  const gridAlert = nodes?.grid?.status === "fault";

  const renderFlow = (start, end, magnitude, color, reverse = false) => {
    if (!magnitude || magnitude < 5) return null;

    const dx = end[0] - start[0];
    const dy = end[1] - start[1];

    return [...Array(6)].map((_, i) => {
      const t = ((flowTick + i * 15) % 100) / 100;
      const progress = reverse ? 1 - t : t;
      return (
        <Circle
          key={i}
          x={start[0] + dx * progress}
          y={start[1] + dy * progress}
          radius={4}
          fill={color}
        />
      );
    });
  };
const WeatherCard = ({ x, y, timestamp, scada_data }) => {
  const [pulse, setPulse] = useState(0);

  const hour = new Date(timestamp).getHours();
  const isMorning = hour >= 5 && hour <= 6;

  const skyGradient = isMorning
    ? [0, "#ff9966", 0.4, "#ff5e62", 1, "#3a6186"]
    : [0, "#4f46e5", 0.4, "#3b82f6", 1, "#0f172a"];

  const glowIntensity = isMorning ? 0.9 : 0.3;

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse((p) => (p + 0.04) % (Math.PI * 2));
    }, 60);
    return () => clearInterval(interval);
  }, []);

  const sunRadius = 24 + Math.sin(pulse) * 2;
  const haloRadius = sunRadius + 18;

  return (
    <Group x={x} y={y}>
      {/* Background */}
      <Rect
        width={300}
        height={340}
        cornerRadius={24}
        fillLinearGradientStartPoint={{ x: 0, y: 0 }}
        fillLinearGradientEndPoint={{ x: 0, y: 340 }}
        fillLinearGradientColorStops={skyGradient}
        shadowColor="#000"
        shadowBlur={30}
        shadowOpacity={0.35}
      />

      {/* Sun Glow */}
      <Circle
        x={220}
        y={75}
        radius={haloRadius}
        fillRadialGradientStartPoint={{ x: 0, y: 0 }}
        fillRadialGradientEndPoint={{ x: 0, y: 0 }}
        fillRadialGradientColorStops={[
          0, `rgba(255,220,120,${glowIntensity * 0.5})`,
          0.6, `rgba(255,180,80,${glowIntensity * 0.25})`,
          1, "rgba(0,0,0,0)"
        ]}
      />

      {/* Sun Core */}
      <Circle
        x={220}
        y={75}
        radius={sunRadius}
        fill="#FFD76A"
        shadowColor="#FFC94A"
        shadowBlur={25 * glowIntensity}
      />

      {/* Single Professional Cloud */}
      <Group x={200} y={95} opacity={0.9}>
        <Circle radius={18} fill="white" />
        <Circle x={18} radius={22} fill="white" />
        <Circle x={40} radius={16} fill="white" />
      </Group>

      {/* Location */}
      <Text
        text={scada_data?.location || "Plant Location"}
        x={20}
        y={25}
        fontSize={20}
        fontStyle="bold"
        fill="white"
      />

      {/* Time */}
      <Text
        text={new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        x={20}
        y={55}
        fontSize={14}
        fill="rgba(255,255,255,0.85)"
      />

      {/* Condition */}
      <Text
        text={scada_data?.condition || "Sunny"}
        x={20}
        y={95}
        fontSize={22}
        fontStyle="bold"
        fill="white"
      />

      {/* Temperature */}
      <Text
        text={`${scada_data?.temperature ?? 27}°C`}
        x={20}
        y={130}
        fontSize={48}
        fontStyle="bold"
        fill="white"
      />

      {/* Secondary Info */}
      <Text
        text={`Feels like ${scada_data?.feels_like ?? 30}°`}
        x={20}
        y={190}
        fontSize={14}
        fill="rgba(255,255,255,0.9)"
      />
      <Text
        text={`AQI: ${scada_data?.aqi ?? 96}`}
        x={20}
        y={215}
        fontSize={14}
        fill="rgba(255,255,255,0.9)"
      />
      <Text
        text={`Wind: ${scada_data?.wind ?? 3} km/h`}
        x={20}
        y={240}
        fontSize={14}
        fill="rgba(255,255,255,0.9)"
      />
      <Text
        text={`Humidity: ${scada_data?.humidity ?? 46}%`}
        x={20}
        y={265}
        fontSize={14}
        fill="rgba(255,255,255,0.9)"
      />
      <Text
        text={`Pressure: ${scada_data?.pressure ?? 1011} mb`}
        x={20}
        y={290}
        fontSize={14}
        fill="rgba(255,255,255,0.9)"
      />
    </Group>
  );
};

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        background: "linear-gradient(135deg,#050b18,#0f172a)"
      }}
    >
      <Stage
        width={VIRTUAL_WIDTH}
        height={VIRTUAL_HEIGHT}
        scaleX={scale}
        scaleY={scale}
      >
        <Layer>

          {/* Timestamp */}
          <Text
            text={timestamp}
            x={950}
            y={20}
            fill="#94a3b8"
            fontSize={20}
          />

          {/* Lines */}
          <Line points={[300, 200, 650, 360]} stroke="#38bdf8" strokeWidth={3} />
          <Line points={[1000, 200, 650, 360]} stroke="#a78bfa" strokeWidth={3} />
          <Line points={[300, 550, 650, 360]} stroke="#ef4444" strokeWidth={3} />

          {/* Nodes */}
          <SolarPanelIcon x={300} y={200} power={produced} alert={solarAlert} />
          <LoadIcon x={650} y={360} power={consumed} alert={loadAlert} />
          <BatteryIcon x={1000} y={200} soc={soc} alert={batteryAlert} />
          <GridIcon x={300} y={550} power={gridPower} alert={gridAlert} />

          {/* Flows */}
          {renderFlow([300,200],[650,360],flows?.solarToLoad,"#38bdf8")}
          {renderFlow([1000,200],[650,360],flows?.batteryToLoad,"#a78bfa")}
          {renderFlow([300,550],[650,360],flows?.gridToLoad,"#ef4444")}
       
        <WeatherCard  x={980} y={330} timestamp={data.timestamp} scada_data={data}/>
        </Layer>
      </Stage>
    </div>
  );
}
