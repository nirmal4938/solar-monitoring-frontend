// src/hooks/useDailySummary.js
import { useEffect, useState } from "react";

export function useDailySummary(plantId, date) {
  const [availability, setAvailability] = useState(0);

  useEffect(() => {
    if (!plantId || !date) return;

    fetch(
      `http://localhost:5000/api/daily-summary?plant_id=${plantId}&date=${date}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (!data?.success) return;

        setAvailability(
          Number(data.data?.availability || 0)
        );
      });
  }, [plantId, date]);

  return { availability };
}