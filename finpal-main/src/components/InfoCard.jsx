import '../pages/dashboard.css';

export default function InfoCard({ title, value, subtitle, icon }) {
  return (
    <div className="info-card">
      <div className="info-card-header">
        <h3 className="info-card-title">{title}</h3>
        {icon && <span className="info-card-icon">{icon}</span>}
      </div>
      <div className="info-card-value">{value}</div>
      {subtitle && <div className="info-card-subtitle">{subtitle}</div>}
    </div>
  );
}
