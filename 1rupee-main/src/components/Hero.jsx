import { useEffect, useRef, useState } from 'react'

function Hero() {
    const statsRef = useRef(null)
    const dashboardPreviewRef = useRef(null)
    const heroVisualRef = useRef(null)
    const [statValues, setStatValues] = useState({
        users: 0,
        millions: 0,
        satisfaction: 0
    })

    useEffect(() => {
        const animateCounter = (key, target, duration = 2000) => {
            let current = 0
            const increment = target / (duration / 16)
            const timer = setInterval(() => {
                current += increment
                if (current >= target) {
                    current = target
                    clearInterval(timer)
                }
                setStatValues(prev => ({ ...prev, [key]: Math.floor(current) }))
            }, 16)
            return timer
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateCounter('users', 10000)
                        animateCounter('millions', 50)
                        animateCounter('satisfaction', 99)
                        observer.unobserve(entry.target)
                    }
                })
            },
            { threshold: 0.5 }
        )

        if (statsRef.current) {
            observer.observe(statsRef.current)
        }

        return () => {
            if (statsRef.current) {
                observer.unobserve(statsRef.current)
            }
        }
    }, [])

    // Mouse parallax effect for dashboard preview
    useEffect(() => {
        const dashboardPreview = dashboardPreviewRef.current
        if (!dashboardPreview) return

        let animationFrameId

        const handleMouseMove = (e) => {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId)
            }

            animationFrameId = requestAnimationFrame(() => {
                const rect = dashboardPreview.getBoundingClientRect()
                const x = (e.clientX - rect.left) / rect.width
                const y = (e.clientY - rect.top) / rect.height

                const cards = dashboardPreview.querySelectorAll('.preview-card')
                cards.forEach((card, index) => {
                    const depth = (index + 1) * 5
                    const moveX = (x - 0.5) * depth
                    const moveY = (y - 0.5) * depth
                    card.style.transform = `translate(${moveX}px, ${moveY}px)`
                })

                const chips = dashboardPreview.querySelectorAll('.floating-chip')
                chips.forEach((chip, index) => {
                    const depth = (index + 1) * 8
                    const moveX = (x - 0.5) * depth
                    const moveY = (y - 0.5) * depth
                    chip.style.transform = `translate(${moveX}px, ${moveY}px)`
                })
            })
        }

        const handleMouseLeave = () => {
            const cards = dashboardPreview.querySelectorAll('.preview-card')
            cards.forEach(card => {
                card.style.transform = ''
            })

            const chips = dashboardPreview.querySelectorAll('.floating-chip')
            chips.forEach(chip => {
                chip.style.transform = ''
            })
        }

        dashboardPreview.addEventListener('mousemove', handleMouseMove)
        dashboardPreview.addEventListener('mouseleave', handleMouseLeave)

        return () => {
            dashboardPreview.removeEventListener('mousemove', handleMouseMove)
            dashboardPreview.removeEventListener('mouseleave', handleMouseLeave)
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId)
            }
        }
    }, [])

    // Scroll parallax effect for hero visual
    useEffect(() => {
        const heroVisual = heroVisualRef.current
        if (!heroVisual) return

        const handleScroll = () => {
            const scrolled = window.pageYOffset
            heroVisual.style.transform = `translateY(${scrolled * 0.3}px)`
        }

        window.addEventListener('scroll', handleScroll, { passive: true })

        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [])

    return (
        <section className="hero" id="hero">
            <div className="hero-container">
                <div className="hero-content">
                    <div className="badge fade-in-up" style={{ animationDelay: '0.1s' }}>
                        <span className="badge-dot"></span>
                        Trusted by 10,000+ users worldwide
                    </div>
                    <h1 className="hero-title fade-in-up" style={{ animationDelay: '0.2s' }}>
                        Master Your <span className="gradient-text">Financial Future</span>
                    </h1>
                    <p className="hero-description fade-in-up" style={{ animationDelay: '0.3s' }}>
                        Intelligent insights, seamless management, and powerful tools to take control of your finances.
                        Built for the modern age.
                    </p>
                    <div className="hero-cta fade-in-up" style={{ animationDelay: '0.4s' }}>
                        <button className="btn-hero btn-primary">
                            Start Free Trial
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2"
                                    strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                        <button className="btn-hero btn-outline">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path
                                    d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z"
                                    stroke="currentColor" strokeWidth="1.5" />
                                <path d="M8 10L12 8V12L8 10Z" fill="currentColor" />
                            </svg>
                            Watch Demo
                        </button>
                    </div>
                    <div className="hero-stats fade-in-up" style={{ animationDelay: '0.5s' }} ref={statsRef}>
                        <div className="stat-item">
                            <h3 className="stat-number">{statValues.users.toLocaleString()}K+</h3>
                            <p className="stat-label">Active Users</p>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="stat-item">
                            <h3 className="stat-number">{statValues.millions}M+</h3>
                            <p className="stat-label">Million Managed</p>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="stat-item">
                            <h3 className="stat-number">{statValues.satisfaction}%</h3>
                            <p className="stat-label">Satisfaction Rate</p>
                        </div>
                    </div>
                </div>
                <div className="hero-visual fade-in-right" style={{ animationDelay: '0.3s' }} ref={heroVisualRef}>
                    <div className="dashboard-preview" ref={dashboardPreviewRef}>
                        <div className="preview-card card-1">
                            <div className="card-header">
                                <span className="card-title">Total Balance</span>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="url(#card-gradient)" strokeWidth="2"
                                        strokeLinejoin="round" />
                                    <path d="M2 17L12 22L22 17" stroke="url(#card-gradient)" strokeWidth="2"
                                        strokeLinejoin="round" />
                                    <path d="M2 12L12 17L22 12" stroke="url(#card-gradient)" strokeWidth="2"
                                        strokeLinejoin="round" />
                                    <defs>
                                        <linearGradient id="card-gradient" x1="0" y1="0" x2="24" y2="24">
                                            <stop offset="0%" stopColor="#6366f1" />
                                            <stop offset="100%" stopColor="#8b5cf6" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                            </div>
                            <div className="card-amount">$124,832</div>
                            <div className="card-change positive">+12.5% this month</div>
                        </div>
                        <div className="preview-card card-2">
                            <div className="mini-chart">
                                <svg width="100%" height="60" viewBox="0 0 200 60" preserveAspectRatio="none">
                                    <defs>
                                        <linearGradient id="chart-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
                                            <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                                        </linearGradient>
                                    </defs>
                                    <path d="M0,50 L40,35 L80,40 L120,20 L160,25 L200,10" stroke="#6366f1" strokeWidth="2"
                                        fill="none" />
                                    <path d="M0,50 L40,35 L80,40 L120,20 L160,25 L200,10 L200,60 L0,60 Z"
                                        fill="url(#chart-gradient)" />
                                </svg>
                            </div>
                            <div className="card-label">Portfolio Growth</div>
                        </div>
                        <div className="preview-card card-3">
                            <div className="transaction-item">
                                <div className="transaction-icon">
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                        <path d="M10 5V15M5 10H15" stroke="currentColor" strokeWidth="2"
                                            strokeLinecap="round" />
                                    </svg>
                                </div>
                                <div className="transaction-info">
                                    <div className="transaction-name">Salary Deposit</div>
                                    <div className="transaction-date">Today, 9:30 AM</div>
                                </div>
                                <div className="transaction-amount positive">+$5,200</div>
                            </div>
                        </div>
                        <div className="floating-chip chip-1">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M8 1L10.5 6L16 7L12 11L13 16L8 13.5L3 16L4 11L0 7L5.5 6L8 1Z" fill="#fbbf24" />
                            </svg>
                            Secure
                        </div>
                        <div className="floating-chip chip-2">
                            <span className="pulse-dot"></span>
                            Live Sync
                        </div>
                    </div>
                </div>
            </div>
            <div className="scroll-indicator">
                <span>Scroll to explore</span>
                <svg width="24" height="24" viewBox="0 0 24 24">
                    <path d="M12 5V19M12 19L5 12M12 19L19 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                        strokeLinejoin="round" />
                </svg>
            </div>
        </section>
    )
}

export default Hero


