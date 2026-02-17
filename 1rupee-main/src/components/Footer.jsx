function Footer() {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-brand">
                        <div className="logo">
                            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                                <rect width="40" height="40" rx="10" fill="url(#footer-logo-gradient)" />
                                <path d="M12 20L18 26L28 14" stroke="white" strokeWidth="3" strokeLinecap="round"
                                    strokeLinejoin="round" />
                                <defs>
                                    <linearGradient id="footer-logo-gradient" x1="0" y1="0" x2="40" y2="40">
                                        <stop offset="0%" stopColor="#6366f1" />
                                        <stop offset="100%" stopColor="#8b5cf6" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            <span className="logo-text">FinanceFlow</span>
                        </div>
                        <p className="footer-tagline">Empowering your financial journey</p>
                    </div>
                    <div className="footer-links">
                        <div className="footer-column">
                            <h4>Product</h4>
                            <a href="#">Features</a>
                            <a href="#">Pricing</a>
                            <a href="#">Security</a>
                            <a href="#">Roadmap</a>
                        </div>
                        <div className="footer-column">
                            <h4>Company</h4>
                            <a href="#">About</a>
                            <a href="#">Blog</a>
                            <a href="#">Careers</a>
                            <a href="#">Contact</a>
                        </div>
                        <div className="footer-column">
                            <h4>Resources</h4>
                            <a href="#">Documentation</a>
                            <a href="#">Help Center</a>
                            <a href="#">Community</a>
                            <a href="#">API</a>
                        </div>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; 2026 FinanceFlow. All rights reserved.</p>
                    <div className="footer-legal">
                        <a href="#">Privacy Policy</a>
                        <a href="#">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
