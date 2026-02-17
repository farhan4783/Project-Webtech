import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import StressRing from '../components/StressRing';
import InfoCard from '../components/InfoCard';
import './dashboard.css';

export default function Dashboard() {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Topbar title="Dashboard" />
        <div className="dashboard-content">
          <div className="dashboard-grid">
            <div className="stress-ring-wrapper">
              <StressRing value={34} label="LOW STRESS – You are in control" />
            </div>
            <InfoCard
              title="Safe to Spend"
              value="₹12,500"
              subtitle="available this week"
              icon="ℹ️"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
