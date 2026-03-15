export async function fetchGenerationData(
  plantId,
  date,
  timezone
) {
  const res = await fetch(
    `http://localhost:5000/api/generation?plant_id=${plantId}&date=${date}&tz=${timezone}&order=asc`
  );

  return res.json();
}

export async function fetchConsumptionData(
  plantId,
  date,
  timezone
) {
  const res = await fetch(
    `http://localhost:5000/api/consumption?plant_id=${plantId}&date=${date}&tz=${timezone}&order=asc`
  );

  return res.json();
}
