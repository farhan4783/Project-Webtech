import { useEffect, useState } from 'react'

function Navbar({ onLoginClick }) {
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 100)
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const scrollToSection = (e, href) => {
        e.preventDefault()
        const target = document.querySelector(href)
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            })
        }
    }

    return (
        <nav className={`navbar ${scrolled ? 'scrolled' : ''}`} id="navbar">
            <div className="nav-container">
                <div className="logo">
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                        <rect width="40" height="40" rx="10" fill="url(#logo-gradient)" />
                        <path d="M12 20L18 26L28 14" stroke="white" strokeWidth="3" strokeLinecap="round"
                            strokeLinejoin="round" />
                        <defs>
                            <linearGradient id="logo-gradient" x1="0" y1="0" x2="40" y2="40">
                                <stop offset="0%" stopColor="#6366f1" />
                                <stop offset="100%" stopColor="#8b5cf6" />
                            </linearGradient>
                        </defs>
                    </svg>
                    <span className="logo-text">FinanceFlow</span>
                </div>
                <ul className="nav-links">
                    <li><a href="#features" onClick={(e) => scrollToSection(e, '#features')}>Features</a></li>
                    <li><a href="#how-it-works" onClick={(e) => scrollToSection(e, '#how-it-works')}>How It Works</a></li>
                    <li><a href="#testimonials" onClick={(e) => scrollToSection(e, '#testimonials')}>Testimonials</a></li>
                    <li><a href="#pricing" onClick={(e) => scrollToSection(e, '#pricing')}>Pricing</a></li>
                </ul>
                <div className="nav-cta">
                    <button className="btn-secondary" onClick={onLoginClick}>Login</button>
                    <button className="btn-primary" onClick={onLoginClick}>Get Started</button>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
