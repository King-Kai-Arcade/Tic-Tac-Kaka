export default function Square({ value, onClick }) {
  return (
    <button
      style={{ width: "60px", height: "60px", margin: "0", padding: "0" }}
      onClick={onClick}
    >
      {value}
    </button>
  );
}
