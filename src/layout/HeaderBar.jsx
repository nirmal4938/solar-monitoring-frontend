// HeaderBar.jsx

import React, { useEffect, useState, useRef } from "react";
import { Dropdown } from "primereact/dropdown";
import { OverlayPanel } from "primereact/overlaypanel";
import { TieredMenu } from "primereact/tieredmenu";
import { Badge } from "primereact/badge";
import { Divider } from "primereact/divider";
import { classNames } from "primereact/utils";

import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

import "./HeaderBar.css";
import { useEditPlant } from "../hooks/useEditPlant";

export default function HeaderBar({
  organization = { name: "Organization" },
  onPlantChange,
  selectedPlantId,
}) {
  const { plants } = useEditPlant();

  const [selectedPlant, setSelectedPlant] = useState(null);
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);

  const notificationsRef = useRef(null);
  const reportsRef = useRef(null);
  const settingsRef = useRef(null);
  const profileRef = useRef(null);

  /* ---------------------------
     Restore Selected Plant
  --------------------------- */

  useEffect(() => {
    if (!plants) return;

    const saved = localStorage.getItem("selectedPlantId");

    const plant =
      plants.find((p) => p.id === saved) ||
      plants.find((p) => p.id === selectedPlantId);

    if (plant) {
      setSelectedPlant(plant);
    }
  }, [plants, selectedPlantId]);

  /* ---------------------------
     Hide Header On Scroll
  --------------------------- */

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY.current && window.scrollY > 120)
        setHidden(true);
      else setHidden(false);

      lastScrollY.current = window.scrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ---------------------------
     Plant Change
  --------------------------- */

  const handlePlantChange = (e) => {
    const plant = e.value;

    setSelectedPlant(plant);

    if (!plant) return;

    localStorage.setItem("selectedPlantId", plant.id);

    if (onPlantChange) {
      onPlantChange(plant.id);
    }
  };

  /* ---------------------------
     Menus
  --------------------------- */

  const settingsMenuItems = [
    {
      label: "Plant Management",
      items: [{ label: "Add / Edit Plant" }, { label: "Plant Commissioning" }],
    },
    {
      label: "User & Roles",
      items: [{ label: "Manage Users" }, { label: "Assign Roles" }],
    },
    {
      label: "Subscription",
      items: [{ label: "Billing" }, { label: "Upgrade Plan" }],
    },
  ];

  const profileMenuItems = [
    { label: "Profile", icon: "pi pi-user" },
    { label: "Account Settings", icon: "pi pi-cog" },
    { label: "Switch Organization", icon: "pi pi-refresh" },
    { separator: true },
    { label: "Logout", icon: "pi pi-sign-out", style: { color: "#dc2626" } },
  ];

  return (
    <header className={classNames("header", { hidden })}>
      <div className="header-left">
        {/* <div className="org-title">
          {organization?.name}
        </div>

        <Divider layout="vertical" />

        <div className="plant-select">

          <Dropdown
            value={selectedPlant}
            options={plants}
            optionLabel="name"
            placeholder="Select Plant"
            onChange={handlePlantChange}
            filter
            showClear
            className="compact-dropdown"
            itemTemplate={(option) => (
              <div className="plant-option">
                <div className="plant-name">{option.name}</div>
                <div className="plant-meta">
                  {option.capacity_kw} kW • {option.location}
                </div>
              </div>
            )}
          />

          {selectedPlant && (
            <div className="plant-info">
              {selectedPlant.capacity_kw} kW • {selectedPlant.location}
            </div>
          )}

        </div> */}
      </div>

      {/* RIGHT SIDE */}

      <div className="header-right">
        {/* Notifications */}

        <OverlayPanel ref={notificationsRef} showCloseIcon>
          <div className="panel-title">Notifications</div>

          <ul className="panel-list">
            <li>⚡ Inverter Fault</li>
            <li>🔋 Battery Low SOC</li>
            <li>🌤 Weather Alert</li>
          </ul>
        </OverlayPanel>

        <button
          className="icon-btn"
          onClick={(e) => notificationsRef.current.toggle(e)}
        >
          <i className="pi pi-bell text-blue-800"></i>
          <Badge value={3} severity="danger" />
        </button>

        {/* Reports */}

        <OverlayPanel ref={reportsRef} showCloseIcon>
          <div className="panel-title">Reports</div>

          <ul className="panel-list">
            <li>Daily Energy</li>
            <li>Carbon Impact</li>
            <li>ESG Reports</li>
          </ul>
        </OverlayPanel>

        <button
          className="icon-btn"
          onClick={(e) => reportsRef.current.toggle(e)}
        >
          <i className="pi pi-chart-line text-blue-800"></i>
        </button>

        {/* Settings */}

        <TieredMenu
          model={settingsMenuItems}
          popup
          ref={settingsRef}
          className="text-blue-800"
        />

        <button
          className="icon-btn"
          onClick={(e) => settingsRef.current.toggle(e)}
        >
          <i className="pi pi-cog text-blue-800"></i>
        </button>

        {/* Profile */}

        <TieredMenu model={profileMenuItems} popup ref={profileRef} />

        <button
          className="icon-btn"
          onClick={(e) => profileRef.current.toggle(e)}
        >
          <i className="pi pi-user text-blue-800"></i>
        </button>
      </div>
    </header>
  );
}
