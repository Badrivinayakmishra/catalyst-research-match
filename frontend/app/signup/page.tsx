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

  const handleSignup = async () => {
    setError('')

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
      // Call backend API to create account
      const response = await fetch('https://catalyst-research-match-1.onrender.com/api/auth/signup', {
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
      })

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
    } catch (err) {
      setError('Failed to connect to server. Please try again.')
      console.error('Signup error:', err)
    }
  }

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        backgroundColor: '#FFF3E4',
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
            color: '#081028',
            fontFamily: '"Work Sans", sans-serif',
            fontSize: '24px',
            fontWeight: 600
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
