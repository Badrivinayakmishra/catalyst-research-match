'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [userType, setUserType] = useState<'student' | 'professor'>('student')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async () => {
    setError('')

    if (!email || !password) {
      setError('Please enter both email and password')
      return
    }

    try {
      // Call backend API to login
      const response = await fetch('https://catalyst-research-match.onrender.com/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Invalid email or password')
        return
      }

      // Store user info in localStorage
      localStorage.setItem('userId', data.user.id)
      localStorage.setItem('userEmail', data.user.email)
      localStorage.setItem('userType', data.user.userType)
      localStorage.setItem('userName', data.user.fullName)

      // Redirect based on user type
      if (data.user.userType === 'professor') {
        router.push('/create-lab')
      } else {
        router.push('/student/dashboard')
      }
    } catch (err) {
      setError('Failed to connect to server. Please try again.')
      console.error('Login error:', err)
    }
  }

  const handleGoogleLogin = () => {
    const clientId = '893876692420-jd9rr5frf91v80sktnsq285qmqbk9vdd.apps.googleusercontent.com'
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

  const handleAccessKnowledge = () => {
    // This is for the old 2nd Brain functionality - keeping for backwards compatibility
    router.push('/integrations')
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
            color: '#64748B',
            fontFamily: '"Work Sans", sans-serif',
            fontSize: '14px',
            textDecoration: 'none'
          }}
        >
          ← Back to browse
        </Link>
      </div>

      {/* Login Card */}
      <div
        style={{
          width: '420px',
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          padding: '48px 40px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
        }}
      >
        <h2
          style={{
            color: '#1E293B',
            fontFamily: '"Work Sans", sans-serif',
            fontSize: '28px',
            fontWeight: 600,
            marginBottom: '8px'
          }}
        >
          Welcome back
        </h2>
        <p
          style={{
            color: '#64748B',
            fontFamily: '"Work Sans", sans-serif',
            fontSize: '14px',
            marginBottom: '24px'
          }}
        >
          Sign in to continue to Catalyst
        </p>

        {/* Google Sign In Button */}
        <button
          onClick={handleGoogleLogin}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '6px',
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
          <span style={{ color: '#1E293B' }}>Continue with Google</span>
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
        <div style={{ marginBottom: '24px' }}>
          <label
            style={{
              color: '#1E293B',
              fontFamily: '"Work Sans", sans-serif',
              fontSize: '13px',
              fontWeight: 500,
              display: 'block',
              marginBottom: '8px'
            }}
          >
            I am a
          </label>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => setUserType('student')}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '6px',
                border: `2px solid ${userType === 'student' ? '#1E293B' : '#E2E8F0'}`,
                backgroundColor: userType === 'student' ? '#F8FAFC' : '#FFFFFF',
                color: '#1E293B',
                fontFamily: '"Work Sans", sans-serif',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
            >
              Student
            </button>
            <button
              onClick={() => setUserType('professor')}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '6px',
                border: `2px solid ${userType === 'professor' ? '#1E293B' : '#E2E8F0'}`,
                backgroundColor: userType === 'professor' ? '#F8FAFC' : '#FFFFFF',
                color: '#1E293B',
                fontFamily: '"Work Sans", sans-serif',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
            >
              Professor
            </button>
          </div>
        </div>

        {/* Email input */}
        <div style={{ marginBottom: '20px' }}>
          <label
            style={{
              color: '#1E293B',
              fontFamily: '"Work Sans", sans-serif',
              fontSize: '13px',
              fontWeight: 500,
              display: 'block',
              marginBottom: '8px'
            }}
          >
            Email address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your.name@ucla.edu"
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '6px',
              border: '1px solid #E2E8F0',
              fontSize: '14px',
              fontFamily: '"Work Sans", sans-serif',
              outline: 'none',
              boxSizing: 'border-box',
              backgroundColor: '#FFFFFF'
            }}
          />
        </div>

        {/* Password input */}
        <div style={{ marginBottom: '8px' }}>
          <label
            style={{
              color: '#1E293B',
              fontFamily: '"Work Sans", sans-serif',
              fontSize: '13px',
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
            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            placeholder="Enter your password"
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '6px',
              border: '1px solid #E2E8F0',
              fontSize: '14px',
              fontFamily: '"Work Sans", sans-serif',
              outline: 'none',
              boxSizing: 'border-box',
              backgroundColor: '#FFFFFF'
            }}
          />
        </div>

        {/* Forgot password link */}
        <div style={{ marginBottom: '24px', textAlign: 'right' }}>
          <Link
            href="/forgot-password"
            style={{
              color: '#64748B',
              fontSize: '13px',
              fontFamily: '"Work Sans", sans-serif',
              textDecoration: 'none'
            }}
          >
            Forgot password?
          </Link>
        </div>

        {/* Error Message */}
        {error && (
          <div
            style={{
              padding: '12px',
              borderRadius: '6px',
              backgroundColor: '#FEE2E2',
              border: '1px solid #FCA5A5',
              marginBottom: '20px'
            }}
          >
            <p style={{ color: '#DC2626', fontSize: '13px', fontFamily: '"Work Sans", sans-serif' }}>
              {error}
            </p>
          </div>
        )}

        {/* Sign In Button */}
        <button
          onClick={handleLogin}
          style={{
            width: '100%',
            padding: '14px',
            borderRadius: '6px',
            backgroundColor: '#1E293B',
            color: '#FFFFFF',
            fontFamily: '"Work Sans", sans-serif',
            fontSize: '15px',
            fontWeight: 600,
            border: 'none',
            cursor: 'pointer',
            marginBottom: '20px',
            transition: 'background-color 0.15s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0F172A'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1E293B'}
        >
          Sign in
        </button>

        {/* Sign Up Link */}
        <p
          style={{
            textAlign: 'center',
            color: '#64748B',
            fontFamily: '"Work Sans", sans-serif',
            fontSize: '14px',
            marginTop: '16px'
          }}
        >
          Don't have an account?{' '}
          <Link
            href="/signup"
            style={{
              color: '#1E293B',
              textDecoration: 'none',
              fontWeight: 600
            }}
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
