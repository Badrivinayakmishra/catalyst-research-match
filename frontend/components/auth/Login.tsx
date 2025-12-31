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

  const handleLogin = () => {
    setError('')

    if (!email || !password) {
      setError('Please enter both email and password')
      return
    }

    // Store user info in localStorage
    localStorage.setItem('userEmail', email)
    localStorage.setItem('userType', userType)

    // Redirect based on user type
    if (userType === 'professor') {
      router.push('/create-lab')
    } else {
      router.push('/student/dashboard')
    }
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
            marginBottom: '32px'
          }}
        >
          Sign in to continue to Catalyst
        </p>

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
            href="#"
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
