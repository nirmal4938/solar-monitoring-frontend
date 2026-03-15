// /layout/Sidebar.jsx

import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { navConfig } from "./navConfig";
import { classNames } from "primereact/utils";
import "./Sidebar.css";

export default function Sidebar() {
  const location = useLocation();

  function getDefaultOpen() {
    const defaults = {};
    navConfig.forEach(section => {
      if (
        section.children?.some(child =>
          location.pathname.startsWith(child.path)
        )
      ) {
        defaults[section.label] = true;
      }
    });
    return defaults;
  }

  const [openSections, setOpenSections] = useState(getDefaultOpen());

  const toggleSection = (label) => {
    setOpenSections(prev => ({
      ...prev,
      [label]: !prev[label]
    }));
  };

  return (
    <aside className="sidebar">

      {/* FIXED BRAND HEADER */}
      <div className="sidebar-brand-fixed">
        <div className="sidebar-brand">
          <div className="brand-logo">
            <i className="pi pi-sun"></i>
          </div>
          <div>
            <div className="brand-title">SolarOps</div>
            <div className="brand-sub">Carbon Intelligence Platform</div>
          </div>
        </div>
      </div>

      {/* SCROLLABLE NAV */}
      <div className="sidebar-scroll">
        <nav className="sidebar-nav">
          {navConfig.map(section => (
            <div key={section.label} className="nav-section">

              <div
                className="section-header"
                onClick={() => toggleSection(section.label)}
              >
                <i className={classNames(section.icon, "section-icon")} />
                <span className="section-label">{section.label}</span>
                <i
                  className={classNames(
                    "pi",
                    openSections[section.label]
                      ? "pi-chevron-down"
                      : "pi-chevron-right",
                    "chevron"
                  )}
                />
              </div>

              {openSections[section.label] && (
                <div className="section-children">
                  {section.children.map(item => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className={({ isActive }) =>
                        classNames("nav-item", {
                          active: isActive
                        })
                      }
                    >
                      {item.label}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* FOOTER */}
      <div className="sidebar-footer">
        <div className="enterprise-badge">
          Enterprise Carbon Suite • v2.0
        </div>
      </div>

    </aside>
  );
}