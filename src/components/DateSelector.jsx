export default function DateSelector({ date, onChange }) {
  return (
    <div style={{ marginBottom: 10 }}>
      📅{" "}
      <input
        type="date"
        value={date}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}