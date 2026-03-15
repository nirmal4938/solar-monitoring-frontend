import React, { useRef } from "react";
import html2pdf from "html2pdf.js";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { Chip } from "primereact/chip";

const ResumeBuilder = () => {
  const resumeRef = useRef(null);

  const downloadPDF = () => {
    const opt = {
      margin: 0.15,
      filename: "Nirmal_Kumar_MERN_Developer_Resume.pdf",
      image: { type: "jpeg", quality: 1 },
      html2canvas: {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        letterRendering: true,
        logging: false,
        scrollY: 0,
      },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };
    html2pdf().set(opt).from(resumeRef.current).save();
  };

  const skills = {
    backend: ["Node.js","Express","GraphQL","REST API"],
    frontend: ["React","TypeScript","JavaScript"],
    database: ["MongoDB","PostgreSQL","MySQL","Sequelize"],
    architecture: ["Microservices","Multi-Tenant Systems","SaaS Platforms"],
    devops: ["Docker","GitHub Actions","GitLab CI","Linux","AWS Basics"],
    messaging: ["MQTT","Redis","Real-Time Systems"],
  };

  const renderChips = (items) =>
    items.map((skill, i) => (
      <Chip
        key={i}
        label={<span style={{ color: "#000" }}>{skill}</span>}
        className="resume-chip mr-1 mb-1"
      />
    ));

  const roleTech = (techs) =>
    techs.map((t, i) => (
      <Chip
        key={i}
        label={<span style={{ color: "#000" }}>{t}</span>}
        className="resume-chip mr-1 mb-1 p-chip-secondary"
      />
    ));

  return (
    <div className="p-3 surface-ground">
      <style>
        {`
/* ===== TIMELINE ===== */
.border-left-2{
  border-left:2px solid #d1d5db;
  padding-left:10px;
  page-break-inside: avoid;
}

/* ===== CHIPS ===== */
.resume-chip{
  font-size:12px !important;
  padding:2px 8px !important;
  border-radius:5px !important;
  background-color: #e0e0e0 !important;
  color: #000000 !important;
}
.p-chip{
  display:inline-flex !important;
  align-items:center !important;
  justify-content:center !important;
  line-height:1.2 !important;
  font-size:12px !important;
}
.p-chip .p-chip-text{
  display:inline-block !important;
  font-size:12px !important;
  line-height:1.1 !important;
  white-space:nowrap !important;
  color: #000000 !important;
}

/* ===== TYPOGRAPHY ===== */
.resume-page{
  line-height:1.2;
  max-height: 285mm; /* ensures fits 1 A4 page */
}
.resume-page h1{ font-size:28px; page-break-inside: avoid; }
.resume-page h2{ font-size:19px; margin-bottom:4px; page-break-inside: avoid; }
.resume-page h3{ font-size:16px; margin-bottom:3px; page-break-inside: avoid; }
.resume-page h4{ font-size:14px; margin-bottom:2px; }
.resume-page p{ font-size:13px; margin-bottom:4px; }
.resume-page ul{ font-size:12px; line-height:1.3; margin-top:3px; margin-bottom:4px; page-break-inside: avoid; }
.resume-page li{ margin-bottom:2px; }
.resume-page .text-sm{ font-size:12px !important; }
.resume-page .text-xs{ font-size:11px !important; }

/* ===== SPACING ===== */
.resume-page .mb-4{ margin-bottom:8px !important; }
.resume-page .mb-3{ margin-bottom:5px !important; }
.resume-page .mt-3{ margin-top:4px !important; }
.resume-page .mt-2{ margin-top:2px !important; }
.resume-page .p-5{ padding:14px !important; }

/* ===== GRID FLEX ===== */
.grid{
  display:flex;
  gap:8px;
}
.col-4{ flex: 1 1 26%; }
.col-8{ flex: 1 1 72%; }
        `}
      </style>

      <div className="flex justify-content-center mb-2">
        <Button
          label="Download Resume PDF"
          icon="pi pi-download"
          className="p-button-sm"
          onClick={downloadPDF}
        />
      </div>

      <div
        ref={resumeRef}
        className="surface-card shadow-2 border-round p-5 resume-page"
        style={{ width: "210mm", margin: "auto" }}
      >

        {/* HEADER */}
        <div className="mb-2">
          <h1 className="font-bold m-0">Nirmal Kumar</h1>
          <div className="text-sm text-600"> MERN Stack Developer</div>
<div className="flex flex-wrap items-center gap-2 text-sm text-700 mt-1">
  <div className="flex items-center gap-1">
    <i className="pi pi-map-marker" style={{ fontSize: "12px" }}></i>
    <span>India</span>
  </div>

  <div className="flex items-center gap-1">
    <i className="pi pi-envelope" style={{ fontSize: "12px" }}></i>
    <span>kumarnirmal9330@gmail.com</span>
  </div>

  <div className="flex items-center gap-1">
    <i className="pi pi-phone" style={{ fontSize: "12px" }}></i>
    <span>7678229735</span>
  </div>

  <div className="flex items-center gap-1">
    <i className="pi pi-linkedin" style={{ fontSize: "12px" }}></i>
    <span>linkedin.com/in/nirmal-kumar-139295324</span>
  </div>

  <div className="flex items-center gap-1">
    <i className="pi pi-github" style={{ fontSize: "12px" }}></i>
    <span>github.com/nirmal4938</span>
  </div>
</div>
        </div>

        <Divider />

        <div className="grid gap-0">

          {/* LEFT COLUMN */}
          <div className="col-4 pr-2">
            <h3 className="font-semibold mb-1">Core Skills</h3>
            <Divider className="my-1" />
            <h4 className="font-semibold">Backend</h4>
            {renderChips(skills.backend)}
            <h4 className="font-semibold mt-1">Frontend</h4>
            {renderChips(skills.frontend)}
            <h4 className="font-semibold mt-1">Database</h4>
            {renderChips(skills.database)}
            <h4 className="font-semibold mt-1">Architecture</h4>
            {renderChips(skills.architecture)}
            <h4 className="font-semibold mt-1">DevOps</h4>
            {renderChips(skills.devops)}
            <h4 className="font-semibold mt-1">Messaging</h4>
            {renderChips(skills.messaging)}

            <Divider className="my-1" />
            <h3 className="font-semibold mb-1">Certifications</h3>
            <ul className="pl-3">
              <li>HackerRank JavaScript Certification</li>
              <li>HackerRank Node.js Certification</li>
              <li>HackerRank SQL Certification</li>
              <li>Apollo GraphQL Developer Certification</li>
            </ul>

            <Divider className="my-1" />
            <h3 className="font-semibold mb-1">Interests</h3>
            <ul className="pl-3">
              <li>Open Source Exploration</li>
              <li>Clean Code & Refactoring</li>
            </ul>
          </div>

          {/* RIGHT COLUMN */}
          <div className="col-8">
            <h2 className="font-semibold mb-1">Professional Summary</h2>
            <p>
              Senior MERN Stack Developer with 5+ years of experience building scalable
              full-stack applications using React, Node.js, MongoDB, PostgreSQL and GraphQL.
            </p>
            <p>
              Experienced in building real-time systems, SaaS platforms,
              microservices architectures and high-performance APIs.
            </p>

            <Divider className="my-1" />

            <h2 className="font-semibold mb-1">Professional Experience</h2>
            <div className="border-left-2">
              <div className="mb-2">
                <h3 className="font-semibold">Senior MERN Stack Developer</h3>
                <div className="text-xs text-600 mb-1">KayJayGlobal Pvt Ltd | Oct 2024 – Feb 2026</div>
                <div className="mb-1">{roleTech(["Node.js","GraphQL","MongoDB","MQTT","PostgreSQL"])}</div>
                <ul className="pl-3">
                  <li>Led development of enterprise SaaS platforms.</li>
                  <li>Designed scalable GraphQL APIs and microservices.</li>
                  <li>Integrated real-time MQTT messaging infrastructure.</li>
                  <li>Reduced system latency by 25–30% via optimization.</li>
                </ul>
              </div>

              <div className="mb-2">
                <h3 className="font-semibold">Senior MERN Stack Developer</h3>
                <div className="text-xs text-600 mb-1">Qpaix Infitech Pvt Ltd | Sep 2022 – Sep 2024</div>
                <div className="mb-1">{roleTech(["Node.js","GraphQL","PostgreSQL","MongoDB"])}</div>
                <ul className="pl-3">
                  <li>Developed REST and GraphQL APIs.</li>
                  <li>Optimized backend queries improving API response time.</li>
                  <li>Designed scalable backend architecture.</li>
                </ul>
              </div>

              <div className="mb-2">
                <h3 className="font-semibold">MERN Stack Developer</h3>
                <div className="text-xs text-600 mb-1">PragmaApps & Technology Pvt Ltd | Dec 2019 – Aug 2022</div>
                <div className="mb-1">{roleTech(["React","Node.js","MongoDB","Redux"])}</div>
                <ul className="pl-3">
                  <li>Built full-stack MERN applications.</li>
                  <li>Improved page performance by 30%.</li>
                  <li>Implemented lazy loading and code splitting.</li>
                </ul>
              </div>
            </div>

            <Divider className="my-1" />

            <h2 className="font-semibold mb-1">Achievements</h2>
            <ul className="pl-3">
              <li>5+ years delivering scalable enterprise MERN platforms.</li>
              <li>Reduced application latency by up to 30%.</li>
              <li>Designed microservices and real-time systems.</li>
              <li>Mentored developers and improved engineering standards.</li>
            </ul>

            <Divider className="my-1" />

<h2 className="font-semibold mb-1">Key Projects</h2>
<div className="border-left-2 mb-2">

  <div className="mb-2">
    <h3 className="font-semibold">Solar Plant Monitoring System</h3>
    <div className="text-xs text-600 mb-1">React, Node.js, GraphQL, MQTT, MongoDB</div>
    <ul className="pl-3">
      <li>Real-time telemetry and performance tracking of solar plants.</li>
      <li>Automated fault detection & predictive maintenance alerts.</li>
      <li>Optimized energy yield through smart analytics dashboards.</li>
    </ul>
  </div>

</div>

            <Divider className="my-1" />

            <h2 className="font-semibold mb-1">Education</h2>
            <ul className="pl-3">
              <li>
                <strong>Bachelor of Technology (B.Tech) in IT</strong>, CTAE Udaipur, 2020
              </li>
            </ul>

          </div>

        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;