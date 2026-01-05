'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function PISignupPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    department: '',
    title: '',
    labName: '',
    researchAreas: ''
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      console.error('Passwords do not match')
      return
    }

    try {
      const response = await fetch('https://catalyst-research-match.onrender.com/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          userType: 'pi',
          department: formData.department,
          title: formData.title,
          labName: formData.labName,
          researchAreas: formData.researchAreas
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // Save user info
        localStorage.setItem('userId', data.userId)
        localStorage.setItem('userEmail', formData.email)
        localStorage.setItem('userType', 'pi')
        localStorage.setItem('userName', `${formData.firstName} ${formData.lastName}`)

        // Redirect to PI dashboard
        router.push('/pi-dashboard')
      } else {
        console.error('Signup failed:', data.error)
      }
    } catch (error) {
      console.error('Signup error:', error)
    }
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F9F7F2' }}>
      {/* Navigation */}
      <nav className="border-b backdrop-blur-sm bg-white/70" style={{ borderColor: '#E2E8F0' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold" style={{ color: '#0B2341', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              Catalyst
            </Link>
            <div className="flex gap-3">
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium hover:opacity-70 transition"
                style={{ color: '#334155' }}
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-8">
            <h1
              className="text-4xl md:text-5xl font-bold mb-3"
              style={{
                color: '#0B2341',
                fontFamily: "'Fraunces', serif",
                letterSpacing: '-0.02em'
              }}
            >
              Create <span style={{ color: '#2563EB' }}>PI Account</span>
            </h1>
            <p className="text-lg" style={{ color: '#64748B' }}>
              Post positions and find undergraduate researchers
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg" style={{ border: '1px solid #E2E8F0' }}>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#0B2341' }}>
                    First Name
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:border-blue-500 transition-colors"
                    style={{ borderColor: '#E2E8F0' }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#0B2341' }}>
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:border-blue-500 transition-colors"
                    style={{ borderColor: '#E2E8F0' }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#0B2341' }}>
                  UCLA Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:border-blue-500 transition-colors"
                  style={{ borderColor: '#E2E8F0' }}
                  placeholder="professor@ucla.edu"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#0B2341' }}>
                    Password
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:border-blue-500 transition-colors"
                    style={{ borderColor: '#E2E8F0' }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#0B2341' }}>
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:border-blue-500 transition-colors"
                    style={{ borderColor: '#E2E8F0' }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#0B2341' }}>
                    Department
                  </label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:border-blue-500 transition-colors"
                    style={{ borderColor: '#E2E8F0' }}
                    placeholder="Computer Science"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#0B2341' }}>
                    Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:border-blue-500 transition-colors"
                    style={{ borderColor: '#E2E8F0' }}
                    placeholder="Assistant Professor"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#0B2341' }}>
                  Lab Name
                </label>
                <input
                  type="text"
                  value={formData.labName}
                  onChange={(e) => handleInputChange('labName', e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:border-blue-500 transition-colors"
                  style={{ borderColor: '#E2E8F0' }}
                  placeholder="Smith Neuroscience Lab"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#0B2341' }}>
                  Research Areas
                </label>
                <textarea
                  value={formData.researchAreas}
                  onChange={(e) => handleInputChange('researchAreas', e.target.value)}
                  required
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:border-blue-500 transition-colors"
                  style={{ borderColor: '#E2E8F0' }}
                  placeholder="Brief description of your research focus..."
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-xl font-bold text-lg transition-all hover:shadow-xl"
                style={{
                  backgroundColor: '#2563EB',
                  color: '#FFFFFF'
                }}
              >
                Create Account
              </button>
            </form>

            <p className="text-center mt-6 text-sm" style={{ color: '#64748B' }}>
              Already have an account?{' '}
              <Link href="/login" className="font-semibold hover:opacity-70 transition" style={{ color: '#2563EB' }}>
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
