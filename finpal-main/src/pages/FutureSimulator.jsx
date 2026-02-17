import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import './dashboard.css';

export default function FutureSimulator() {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Topbar title="Future You Simulator - 5 Year Outlook" />
        <div className="simulator-content">
          <div className="simulator-container">
            <div className="graph-container">
              <svg className="future-graph" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid meet">
                {/* Grid lines */}
                <defs>
                  <linearGradient id="redGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="rgba(255, 0, 0, 0.2)" />
                    <stop offset="100%" stopColor="rgba(255, 0, 0, 0.05)" />
                  </linearGradient>
                  <linearGradient id="greenGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="rgba(0, 255, 0, 0.05)" />
                    <stop offset="100%" stopColor="rgba(0, 255, 0, 0.2)" />
                  </linearGradient>
                </defs>

                {/* Axes */}
                <line x1="50" y1="350" x2="750" y2="350" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="2" />
                <line x1="50" y1="50" x2="50" y2="350" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="2" />

                {/* Labels */}
                <text x="50" y="30" fill="rgba(255, 255, 255, 0.7)" fontSize="14">Today</text>
                <text x="350" y="30" fill="rgba(255, 255, 255, 0.7)" fontSize="14">2026</text>
                <text x="700" y="30" fill="rgba(255, 255, 255, 0.7)" fontSize="14">2028</text>

                {/* Red path (Buy Car Now) */}
                <path
                  d="M 50 250 Q 200 200, 350 180 T 650 220"
                  fill="none"
                  stroke="#ff4444"
                  strokeWidth="3"
                  className="decision-path"
                />
                <path
                  d="M 50 250 Q 200 200, 350 180 T 650 220 L 750 220 L 750 350 L 50 350 Z"
                  fill="url(#redGradient)"
                />

                {/* Green path (Invest & Wait) */}
                <path
                  d="M 50 250 Q 200 260, 350 280 T 650 120"
                  fill="none"
                  stroke="#00ff88"
                  strokeWidth="3"
                  className="decision-path"
                />
                <path
                  d="M 50 250 Q 200 260, 350 280 T 650 120 L 750 120 L 750 350 L 50 350 Z"
                  fill="url(#greenGradient)"
                />

                {/* Decision labels */}
                <text x="200" y="190" fill="#ff4444" fontSize="12" fontWeight="bold">Decision A: Buy Car Now</text>
                <text x="200" y="290" fill="#00ff88" fontSize="12" fontWeight="bold">Decision B: Invest & Wait</text>

                {/* End point markers */}
                <circle cx="650" cy="220" r="6" fill="#ff4444" />
                <circle cx="650" cy="120" r="6" fill="#00ff88" />

                {/* Emojis at end points */}
                <text x="670" y="225" fontSize="24">😩</text>
                <text x="670" y="125" fontSize="24">🤩</text>
                <text x="720" y="115" fontSize="20">💰</text>

                {/* Connecting lines to emojis */}
                <line x1="656" y1="220" x2="675" y2="220" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1" strokeDasharray="3,3" />
                <line x1="656" y1="120" x2="675" y2="120" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1" strokeDasharray="3,3" />
              </svg>
            </div>

            <div className="simulation-result">
              <div className="result-text">
                <strong>Simulation Result:</strong> Buying the car now increases financial stress at age 28 by 65%.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
