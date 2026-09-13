export default function PlaceholderTab({ icon, title, description }) {
  return (
    <div className="placeholder-tab">
      <div style={{ fontSize: 40, marginBottom: 12 }}>{icon}</div>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
}
