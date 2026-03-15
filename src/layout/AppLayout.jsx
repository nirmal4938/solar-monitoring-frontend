import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import HeaderBar from "./HeaderBar";
import "./AppLayout.css";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";

export default function AppLayout() {

  const { organization } = useAuth();

  const [selectedPlantId, setSelectedPlantId] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("selectedPlantId");
    if (saved) setSelectedPlantId(saved);
  }, []);

  const handlePlantChange = (plantId) => {

    setSelectedPlantId(plantId);

    localStorage.setItem("selectedPlantId", plantId);

  };

  return (
    <div className="app-layout">

      <Sidebar />

      <div className="main-area">

        <HeaderBar
          organization={organization}
          selectedPlantId={selectedPlantId}
          onPlantChange={handlePlantChange}
        />

        <div className="content-area">
          <Outlet />
        </div>

      </div>

    </div>
  );
}