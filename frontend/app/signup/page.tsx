'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SignupPage() {
  const [userType, setUserType] = useState<'student' | 'professor'>('student')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleGoogleSignup = () => {
    const clientId = '529638946148-gpe8svjr1cj7l8fpvtqrjmvj5snb3daa.apps.googleusercontent.com'
    const redirectUri = 'https://catalyst-indol-beta.vercel.app/auth/callback'
    const scope = 'openid email profile'

    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${clientId}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `response_type=code&` +
      `scope=${encodeURIComponent(scope)}&` +
      `access_type=offline&` +
      `prompt=consent`

    window.location.href = googleAuthUrl
  }

  const handleSignup = async () => {
    setError('')

    // Show loading state
    setError('Creating account (this may take up to 60 seconds)...')

    // Validation
    if (!fullName || !email || !password) {
      setError('All fields are required')
      return
    }

    // Email validation for students
    if (userType === 'student') {
      if (!email.endsWith('@ucla.edu') && !email.endsWith('@g.ucla.edu')) {
        setError('Students must use a UCLA email (@ucla.edu or @g.ucla.edu)')
        return
      }
    }

    try {
      // Call backend API with extended timeout (60s for cold start)
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 60000)

      const response = await fetch('https://catalyst-research-match.onrender.com/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName,
          email,
          password,
          userType,
        }),
        signal: controller.signal
      })

      clearTimeout(timeoutId)
      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to create account')
        return
      }

      // Store user info in localStorage
      localStorage.setItem('userId', data.user.id)
      localStorage.setItem('userEmail', data.user.email)
      localStorage.setItem('userType', data.user.userType)
      localStorage.setItem('userName', data.user.fullName)

      // Redirect based on user type
      if (userType === 'professor') {
        router.push('/create-lab')
      } else {
        router.push('/student/dashboard')
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        setError('Server is waking up (this can take up to 60 seconds). Please wait and try again.')
      } else {
        setError('Connection failed. Please refresh the page and try again.')
      }
      console.error('Signup error:', err)
    }
  }

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        backgroundColor: '#F1F5F9',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {/* Logo at top left */}
      <div
        style={{
          position: 'absolute',
          top: '32px',
          left: '32px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}
      >
        <h1
          style={{
            color: '#1E293B',
            fontFamily: '"Playfair Display", serif',
            fontSize: '28px',
            fontWeight: 600,
            letterSpacing: '-0.5px'
          }}
        >
          Catalyst
        </h1>
      </div>

      {/* Back to Browse link */}
      <div
        style={{
          position: 'absolute',
          top: '32px',
          right: '32px'
        }}
      >
        <Link
          href="/browse"
          style={{
            color: '#081028',
            fontFamily: '"Work Sans", sans-serif',
            fontSize: '14px',
            textDecoration: 'none'
          }}
        >
          ← Back to Browse
        </Link>
      </div>

      {/* Signup Form */}
      <div
        style={{
          width: '450px',
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          padding: '40px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
        }}
      >
        <h2
          style={{
            color: '#081028',
            fontFamily: '"Work Sans", sans-serif',
            fontSize: '28px',
            fontWeight: 600,
            marginBottom: '8px'
          }}
        >
          Create Account
        </h2>
        <p
          style={{
            color: '#64748B',
            fontFamily: '"Work Sans", sans-serif',
            fontSize: '14px',
            marginBottom: '24px'
          }}
        >
          Connect UCLA students with research opportunities
        </p>

        {/* Google Sign Up Button */}
        <button
          onClick={handleGoogleSignup}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '8px',
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            fontFamily: '"Work Sans", sans-serif',
            fontSize: '14px',
            fontWeight: 500,
            cursor: 'pointer',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            transition: 'background-color 0.15s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F8FAFC'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
            <path d="M9.003 18c2.43 0 4.467-.806 5.956-2.183l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.96v2.332C2.44 15.983 5.485 18 9.003 18z" fill="#34A853"/>
            <path d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71 0-.593.102-1.17.282-1.71V4.958H.957C.347 6.173 0 7.548 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
            <path d="M9.003 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.464.891 11.426 0 9.003 0 5.485 0 2.44 2.017.96 4.958L3.967 7.29c.708-2.127 2.692-3.71 5.036-3.71z" fill="#EA4335"/>
          </svg>
          <span style={{ color: '#081028' }}>Continue with Google</span>
        </button>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#E2E8F0' }} />
          <span style={{ padding: '0 16px', color: '#94A3B8', fontSize: '13px', fontFamily: '"Work Sans", sans-serif' }}>
            OR
          </span>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#E2E8F0' }} />
        </div>

        {/* User Type Selection */}
        <div style={{ marginBottom: '20px' }}>
          <label
            style={{
              color: '#081028',
              fontFamily: '"Work Sans", sans-serif',
              fontSize: '14px',
              fontWeight: 500,
              display: 'block',
              marginBottom: '8px'
            }}
          >
            I am a:
          </label>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => setUserType('student')}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: '8px',
                border: `2px solid ${userType === 'student' ? '#F97316' : '#E2E8F0'}`,
                backgroundColor: userType === 'student' ? '#FFF7ED' : '#FFFFFF',
                color: '#081028',
                fontFamily: '"Work Sans", sans-serif',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Student
            </button>
            <button
              onClick={() => setUserType('professor')}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: '8px',
                border: `2px solid ${userType === 'professor' ? '#F97316' : '#E2E8F0'}`,
                backgroundColor: userType === 'professor' ? '#FFF7ED' : '#FFFFFF',
                color: '#081028',
                fontFamily: '"Work Sans", sans-serif',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Professor
            </button>
          </div>
        </div>

        {/* Full Name */}
        <div style={{ marginBottom: '20px' }}>
          <label
            style={{
              color: '#081028',
              fontFamily: '"Work Sans", sans-serif',
              fontSize: '14px',
              fontWeight: 500,
              display: 'block',
              marginBottom: '8px'
            }}
          >
            Full Name
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="John Doe"
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid #E2E8F0',
              fontSize: '14px',
              fontFamily: '"Work Sans", sans-serif',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Email */}
        <div style={{ marginBottom: '20px' }}>
          <label
            style={{
              color: '#081028',
              fontFamily: '"Work Sans", sans-serif',
              fontSize: '14px',
              fontWeight: 500,
              display: 'block',
              marginBottom: '8px'
            }}
          >
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={userType === 'student' ? 'your.name@ucla.edu' : 'professor@ucla.edu'}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid #E2E8F0',
              fontSize: '14px',
              fontFamily: '"Work Sans", sans-serif',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
          {userType === 'student' && (
            <p style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>
              Must be a UCLA email (@ucla.edu or @g.ucla.edu)
            </p>
          )}
        </div>

        {/* Password */}
        <div style={{ marginBottom: '24px' }}>
          <label
            style={{
              color: '#081028',
              fontFamily: '"Work Sans", sans-serif',
              fontSize: '14px',
              fontWeight: 500,
              display: 'block',
              marginBottom: '8px'
            }}
          >
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid #E2E8F0',
              fontSize: '14px',
              fontFamily: '"Work Sans", sans-serif',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Error Message */}
        {error && (
          <div
            style={{
              padding: '12px',
              borderRadius: '8px',
              backgroundColor: '#FEE2E2',
              border: '1px solid #FCA5A5',
              marginBottom: '20px'
            }}
          >
            <p style={{ color: '#DC2626', fontSize: '14px', fontFamily: '"Work Sans", sans-serif' }}>
              {error}
            </p>
          </div>
        )}

        {/* Create Account Button */}
        <button
          onClick={handleSignup}
          style={{
            width: '100%',
            padding: '14px',
            borderRadius: '8px',
            backgroundColor: '#F97316',
            color: '#FFFFFF',
            fontFamily: '"Work Sans", sans-serif',
            fontSize: '16px',
            fontWeight: 600,
            border: 'none',
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#EA580C'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F97316'}
        >
          Create Account
        </button>

        {/* Sign In Link */}
        <p
          style={{
            textAlign: 'center',
            marginTop: '20px',
            color: '#64748B',
            fontSize: '14px',
            fontFamily: '"Work Sans", sans-serif'
          }}
        >
          Already have an account?{' '}
          <Link
            href="/login"
            style={{
              color: '#F97316',
              textDecoration: 'none',
              fontWeight: 500
            }}
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
