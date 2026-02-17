import '../pages/dashboard.css';

export default function StressRing({ value = 34, label = 'LOW STRESS – You are in control' }) {
  const percentage = value;
  const circumference = 2 * Math.PI * 90; // radius = 90
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="stress-ring-container">
      <svg className="stress-ring" width="240" height="240" viewBox="0 0 240 240">
        <circle
          className="stress-ring-bg"
          cx="120"
          cy="120"
          r="90"
          fill="none"
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth="12"
        />
        <circle
          className="stress-ring-progress"
          cx="120"
          cy="120"
          r="90"
          fill="none"
          stroke="url(#gradient)"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          transform="rotate(-90 120 120)"
          style={{
            filter: 'drop-shadow(0 0 8px rgba(0, 255, 200, 0.6))',
          }}
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00ffc8" />
            <stop offset="100%" stopColor="#0080ff" />
          </linearGradient>
        </defs>
      </svg>
      <div className="stress-ring-content">
        <div className="stress-ring-label">Financial Stress Score</div>
        <div className="stress-ring-value">{value}</div>
        <div className="stress-ring-status">{label}</div>
      </div>
    </div>
  );
}
