function CTASection() {
    return (
        <section className="cta-section">
            <div className="container">
                <div className="cta-card">
                    <div className="cta-content">
                        <h2 className="cta-title">Ready to transform your finances?</h2>
                        <p className="cta-description">Join thousands of users who have taken control of their financial future
                        </p>
                        <div className="cta-buttons">
                            <button className="btn-hero btn-primary">
                                Get Started Free
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2"
                                        strokeLinecap="round" />
                                </svg>
                            </button>
                            <button className="btn-hero btn-outline">Schedule Demo</button>
                        </div>
                    </div>
                    <div className="cta-visual">
                        <div className="cta-users">
                            <div className="user-avatars">
                                <div className="avatar" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                                </div>
                                <div className="avatar" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
                                </div>
                                <div className="avatar" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
                                </div>
                                <div className="avatar" style={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }}>
                                </div>
                                <div className="avatar-count">+10K</div>
                            </div>
                            <div className="users-text">
                                <div className="rating">
                                    ★★★★★
                                </div>
                                <div className="users-description">Loved by 10,000+ users</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default CTASection
