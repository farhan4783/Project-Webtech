import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import './dashboard.css';

export default function RealityLens() {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Topbar title="Reality Lens Analysis" />
        <div className="reality-lens-content">
          <div className="reality-lens-container">
            <div className="product-image-container">
              <div className="product-image-placeholder">
                <div className="phone-icon">📱</div>
              </div>
            </div>

            <div className="reality-overlay price-tag-overlay">
              <div className="overlay-label">Price Tag:</div>
              <div className="overlay-value">₹1,30,000</div>
            </div>

            <div className="reality-overlay real-cost-overlay">
              <div className="overlay-label">REAL COST:</div>
              <div className="overlay-value">420 Hours of your work</div>
            </div>

            <div className="reality-overlay impact-overlay">
              <div className="overlay-label">IMPACT:</div>
              <div className="overlay-value">Wipes out</div>
              <div className="overlay-value">80% of Emergency</div>
              <div className="overlay-value">Fund</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
