'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  })

  // Check if user is already logged in
  useEffect(() => {
    const userId = localStorage.getItem('userId')
    const userType = localStorage.getItem('userType')

    if (userId && userType) {
      // Redirect to appropriate dashboard
      if (userType === 'pi') {
        router.push('/pi-dashboard')
      } else {
        router.push('/dashboard')
      }
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Login attempt:', formData)

    try {
      // Call backend API
      const response = await fetch('https://catalyst-research-match.onrender.com/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // Save user info to localStorage
        localStorage.setItem('userId', data.user.id)
        localStorage.setItem('userEmail', data.user.email)
        localStorage.setItem('userType', data.user.userType)
        localStorage.setItem('userName', data.user.fullName)

        alert('Login successful!')

        // Redirect based on user type
        if (data.user.userType === 'pi') {
          router.push('/pi-dashboard')
        } else {
          router.push('/dashboard')
        }
      } else {
        alert(data.error || 'Login failed. Please check your credentials.')
      }
    } catch (error) {
      console.error('Login error:', error)
      alert('Failed to connect to server. Please try again.')
    }
  }

  const handleGoogleSignIn = () => {
    const clientId = '893876692420-jd9rr5frf91v80sktnsq285qmqbk9vdd.apps.googleusercontent.com'
    const redirectUri = window.location.origin + '/auth/callback'
    const scope = 'email profile'

    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scope)}&access_type=offline`

    window.location.href = googleAuthUrl
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F9F7F2' }}>
      {/* Navigation */}
      <nav className="border-b backdrop-blur-sm bg-white/70" style={{ borderColor: '#E2E8F0' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold" style={{ color: '#0B2341', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              Catalyst
            </Link>
            <div className="flex items-center gap-3">
              <span className="text-sm" style={{ color: '#64748B' }}>Don't have an account?</span>
              <Link
                href="/signup"
                className="px-4 py-2 text-sm font-semibold rounded-lg transition shadow-md hover:shadow-lg"
                style={{ background: '#2563EB', color: '#FFFFFF' }}
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">

          {/* Header */}
          <div className="text-center mb-8">
            <h1
              className="text-4xl md:text-5xl font-bold mb-3"
              style={{
                color: '#0B2341',
                fontFamily: "'Fraunces', serif",
                letterSpacing: '-0.02em'
              }}
            >
              Welcome <span style={{ color: '#2563EB' }}>Back</span>
            </h1>
            <p className="text-lg" style={{ color: '#64748B' }}>
              Sign in to continue your research journey
            </p>
          </div>

          {/* Login Form Card */}
          <div className="bg-white rounded-2xl p-8 shadow-lg" style={{ border: '1px solid #E2E8F0' }}>
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Email Field */}
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#0B2341' }}>
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:border-blue-500 transition-colors"
                  style={{ borderColor: '#E2E8F0', color: '#0B2341' }}
                  placeholder="jane.doe@ucla.edu"
                />
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#0B2341' }}>
                  Password
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:border-blue-500 transition-colors"
                  style={{ borderColor: '#E2E8F0', color: '#0B2341' }}
                  placeholder="••••••••"
                />
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                    className="w-4 h-4 rounded border-2 mr-2 cursor-pointer"
                    style={{ accentColor: '#2563EB' }}
                  />
                  <span className="text-sm font-medium" style={{ color: '#334155' }}>
                    Remember me
                  </span>
                </label>
                <Link
                  href="/forgot-password"
                  className="text-sm font-semibold hover:underline transition"
                  style={{ color: '#2563EB' }}
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 rounded-lg font-bold text-lg transition hover:opacity-80"
                style={{ background: '#2563EB', color: '#FFFFFF' }}
              >
                Sign In
              </button>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t" style={{ borderColor: '#E2E8F0' }}></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-xs font-medium" style={{ color: '#94A3B8' }}>
                    OR
                  </span>
                </div>
              </div>

              {/* Google SSO */}
              <div>
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  className="w-full py-3 rounded-lg font-semibold text-sm transition hover:opacity-90 flex items-center justify-center gap-3"
                  style={{ backgroundColor: '#FFFFFF', color: '#0B2341', border: '1px solid #E2E8F0' }}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Sign in with Google
                </button>
              </div>

            </form>
          </div>

          {/* Sign Up Link */}
          <p className="text-center text-sm mt-6" style={{ color: '#64748B' }}>
            Don't have an account?{' '}
            <Link href="/signup" className="font-semibold hover:underline" style={{ color: '#2563EB' }}>
              Sign up for free
            </Link>
          </p>

        </div>
      </div>
    </div>
  )
}
