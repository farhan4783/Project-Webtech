import { useEffect, useState } from 'react'
import { authAPI } from '../utils/api'

function LoginModal({ isOpen, onClose }) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose()
            }
        }

        document.addEventListener('keydown', handleEscape)
        return () => document.removeEventListener('keydown', handleEscape)
    }, [isOpen, onClose])

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'auto'
        }

        return () => {
            document.body.style.overflow = 'auto'
        }
    }, [isOpen])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        const formData = new FormData(e.target)
        const email = formData.get('email')
        const password = formData.get('password')

        try {
            const response = await authAPI.login({ email, password })

            if (response.success && response.data.token) {
                // Redirect to dashboard with token
                const params = new URLSearchParams({
                    token: response.data.token,
                    user: JSON.stringify(response.data.user)
                });
                window.location.href = `http://localhost:3001?${params.toString()}`;
            }
        } catch (err) {
            setError(err.message || 'Login failed. Please check your credentials.')
        } finally {
            setLoading(false)
        }
    }

    if (!isOpen) return null

    return (
        <div className="login-modal active">
            <div className="login-overlay" onClick={onClose}></div>
            <div className="login-container">
                <button className="login-close" onClick={onClose}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                </button>

                <div className="login-content">
                    <div className="login-header">
                        <div className="logo">
                            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                                <rect width="40" height="40" rx="10" fill="url(#login-logo-gradient)" />
                                <path d="M12 20L18 26L28 14" stroke="white" strokeWidth="3" strokeLinecap="round"
                                    strokeLinejoin="round" />
                                <defs>
                                    <linearGradient id="login-logo-gradient" x1="0" y1="0" x2="40" y2="40">
                                        <stop offset="0%" stopColor="#6366f1" />
                                        <stop offset="100%" stopColor="#8b5cf6" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>
                        <h2 className="login-title">Welcome Back</h2>
                        <p className="login-subtitle">Sign in to continue to FinanceFlow</p>
                    </div>

                    <div className="login-social">
                        <button className="social-btn" type="button">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path
                                    d="M19.6 10.227c0-.709-.064-1.39-.182-2.045H10v3.868h5.382a4.6 4.6 0 01-1.996 3.018v2.51h3.232c1.891-1.742 2.982-4.305 2.982-7.35z"
                                    fill="#4285F4" />
                                <path
                                    d="M10 20c2.7 0 4.964-.895 6.618-2.423l-3.232-2.509c-.895.6-2.04.955-3.386.955-2.605 0-4.81-1.76-5.595-4.123H1.064v2.59A9.996 9.996 0 0010 20z"
                                    fill="#34A853" />
                                <path
                                    d="M4.405 11.9c-.2-.6-.314-1.24-.314-1.9 0-.66.114-1.3.314-1.9V5.51H1.064A9.996 9.996 0 000 10c0 1.614.386 3.14 1.064 4.49l3.34-2.59z"
                                    fill="#FBBC05" />
                                <path
                                    d="M10 3.977c1.468 0 2.786.505 3.823 1.496l2.868-2.868C14.955.991 12.695 0 10 0 6.09 0 2.71 2.24 1.064 5.51l3.34 2.59C5.191 5.736 7.396 3.977 10 3.977z"
                                    fill="#EA4335" />
                            </svg>
                            Continue with Google
                        </button>
                        <button className="social-btn" type="button">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path
                                    d="M10 0C4.477 0 0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.879V12.89h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.989C16.343 19.129 20 14.99 20 10c0-5.523-4.477-10-10-10z"
                                    fill="#1877F2" />
                            </svg>
                            Continue with Facebook
                        </button>
                    </div>

                    <div className="login-divider">
                        <span>or continue with email</span>
                    </div>

                    <form className="login-form" onSubmit={handleSubmit}>
                        {error && (
                            <div style={{
                                padding: '12px',
                                marginBottom: '16px',
                                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                border: '1px solid rgba(239, 68, 68, 0.3)',
                                borderRadius: '8px',
                                color: '#ef4444',
                                fontSize: '14px'
                            }}>
                                {error}
                            </div>
                        )}

                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <input type="email" id="email" name="email" placeholder="you@example.com" required />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input type="password" id="password" name="password" placeholder="Enter your password" required />
                        </div>

                        <div className="form-options">
                            <label className="checkbox-label">
                                <input type="checkbox" id="remember" name="remember" />
                                <span>Remember me</span>
                            </label>
                            <a href="#" className="forgot-link">Forgot password?</a>
                        </div>

                        <button type="submit" className="btn-primary btn-login" disabled={loading}>
                            {loading ? 'Signing in...' : 'Sign In'}
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2"
                                    strokeLinecap="round" />
                            </svg>
                        </button>
                    </form>

                    <div className="login-signup">
                        Don't have an account? <a href="#" onClick={(e) => { e.preventDefault(); alert('Sign up functionality would go here') }}>Sign up</a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginModal
