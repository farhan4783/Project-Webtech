import { useEffect, useRef } from 'react'

const featuresData = [
    {
        id: 1,
        icon: (
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <rect width="32" height="32" rx="8" fill="url(#icon-gradient-1)" />
                <path d="M16 10V22M10 16H22" stroke="white" strokeWidth="2" strokeLinecap="round" />
                <defs>
                    <linearGradient id="icon-gradient-1" x1="0" y1="0" x2="32" y2="32">
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                </defs>
            </svg>
        ),
        title: 'Smart Analytics',
        description: 'AI-powered insights that help you understand spending patterns and optimize your budget'
    },
    {
        id: 2,
        icon: (
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <rect width="32" height="32" rx="8" fill="url(#icon-gradient-2)" />
                <path d="M21 11L13 19L9 15" stroke="white" strokeWidth="2" strokeLinecap="round" />
                <defs>
                    <linearGradient id="icon-gradient-2" x1="0" y1="0" x2="32" y2="32">
                        <stop offset="0%" stopColor="#ec4899" />
                        <stop offset="100%" stopColor="#f43f5e" />
                    </linearGradient>
                </defs>
            </svg>
        ),
        title: 'Automated Savings',
        description: 'Set it and forget it. Automatically save based on your spending habits and goals'
    },
    {
        id: 3,
        icon: (
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <rect width="32" height="32" rx="8" fill="url(#icon-gradient-3)" />
                <circle cx="16" cy="16" r="6" stroke="white" strokeWidth="2" />
                <defs>
                    <linearGradient id="icon-gradient-3" x1="0" y1="0" x2="32" y2="32">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#14b8a6" />
                    </linearGradient>
                </defs>
            </svg>
        ),
        title: 'Bank-Level Security',
        description: '256-bit encryption and multi-factor authentication keep your data safe'
    },
    {
        id: 4,
        icon: (
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <rect width="32" height="32" rx="8" fill="url(#icon-gradient-4)" />
                <path d="M12 16L15 19L20 13" stroke="white" strokeWidth="2" strokeLinecap="round" />
                <defs>
                    <linearGradient id="icon-gradient-4" x1="0" y1="0" x2="32" y2="32">
                        <stop offset="0%" stopColor="#f59e0b" />
                        <stop offset="100%" stopColor="#f97316" />
                    </linearGradient>
                </defs>
            </svg>
        ),
        title: 'Real-Time Sync',
        description: 'Access your finances anywhere, anytime with instant synchronization across all devices'
    },
    {
        id: 5,
        icon: (
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <rect width="32" height="32" rx="8" fill="url(#icon-gradient-5)" />
                <path d="M16 8V24M8 16H24" stroke="white" strokeWidth="2" strokeLinecap="round" />
                <defs>
                    <linearGradient id="icon-gradient-5" x1="0" y1="0" x2="32" y2="32">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#2563eb" />
                    </linearGradient>
                </defs>
            </svg>
        ),
        title: 'Budget Planning',
        description: 'Create custom budgets and receive alerts when you\'re approaching your limits'
    },
    {
        id: 6,
        icon: (
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <rect width="32" height="32" rx="8" fill="url(#icon-gradient-6)" />
                <circle cx="16" cy="12" r="4" stroke="white" strokeWidth="2" />
                <path d="M10 24C10 20.6863 12.6863 18 16 18C19.3137 18 22 20.6863 22 24" stroke="white"
                    strokeWidth="2" strokeLinecap="round" />
                <defs>
                    <linearGradient id="icon-gradient-6" x1="0" y1="0" x2="32" y2="32">
                        <stop offset="0%" stopColor="#a855f7" />
                        <stop offset="100%" stopColor="#9333ea" />
                    </linearGradient>
                </defs>
            </svg>
        ),
        title: '24/7 Support',
        description: 'Expert support team available around the clock to help with any questions'
    }
]

function FeatureCard({ feature, index }) {
    const cardRef = useRef(null)

    useEffect(() => {
        const card = cardRef.current
        if (!card) return

        const handleMouseMove = (e) => {
            const rect = card.getBoundingClientRect()
            const x = e.clientX - rect.left
            const y = e.clientY - rect.top

            const centerX = rect.width / 2
            const centerY = rect.height / 2

            const rotateX = (y - centerY) / 20
            const rotateY = (centerX - x) / 20

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`
        }

        const handleMouseLeave = () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)'
        }

        card.addEventListener('mousemove', handleMouseMove)
        card.addEventListener('mouseleave', handleMouseLeave)

        return () => {
            card.removeEventListener('mousemove', handleMouseMove)
            card.removeEventListener('mouseleave', handleMouseLeave)
        }
    }, [])

    useEffect(() => {
        const card = cardRef.current
        if (!card) return

        // Intersection Observer for scroll animations
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1'
                        entry.target.style.transform = 'translateY(0)'
                        observer.unobserve(entry.target)
                    }
                })
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -100px 0px'
            }
        )

        card.style.opacity = '0'
        card.style.transform = 'translateY(30px)'
        card.style.transition = `all 0.6s ease ${index * 0.1}s`

        observer.observe(card)

        return () => observer.disconnect()
    }, [index])

    return (
        <div ref={cardRef} className="feature-card" data-feature={feature.id}>
            <div className="feature-icon">
                {feature.icon}
            </div>
            <h3 className="feature-title">{feature.title}</h3>
            <p className="feature-description">{feature.description}</p>
            <a href="#" className="feature-link">
                Learn more
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
            </a>
        </div>
    )
}

function Features() {
    const headerRef = useRef(null)

    useEffect(() => {
        const header = headerRef.current
        if (!header) return

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1'
                        entry.target.style.transform = 'translateY(0)'
                        observer.unobserve(entry.target)
                    }
                })
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -100px 0px'
            }
        )

        header.style.opacity = '0'
        header.style.transform = 'translateY(30px)'
        header.style.transition = 'all 0.8s ease'

        observer.observe(header)

        return () => observer.disconnect()
    }, [])

    return (
        <section className="features" id="features">
            <div className="container">
                <div ref={headerRef} className="section-header">
                    <div className="badge">
                        <span className="badge-dot"></span>
                        Features
                    </div>
                    <h2 className="section-title">Everything you need to <span className="gradient-text">succeed</span></h2>
                    <p className="section-description">Powerful features designed to make financial management effortless</p>
                </div>
                <div className="features-grid">
                    {featuresData.map((feature, index) => (
                        <FeatureCard key={feature.id} feature={feature} index={index} />
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Features
