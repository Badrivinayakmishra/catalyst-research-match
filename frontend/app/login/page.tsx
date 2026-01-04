'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Login attempt:', formData)
    // Would authenticate with backend here
    // For now, just redirect to dashboard
    alert('Login successful!')
    router.push('/dashboard')
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

              {/* UCLA SSO */}
              <div>
                <button
                  type="button"
                  className="w-full py-3 rounded-lg font-semibold text-sm transition hover:opacity-90 flex items-center justify-center gap-3"
                  style={{ backgroundColor: '#2774AE', color: '#FFFFFF' }}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  Sign in with UCLA SSO
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
