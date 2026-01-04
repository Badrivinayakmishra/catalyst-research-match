'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

export default function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [token, setToken] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const tokenParam = searchParams.get('token')
    if (tokenParam) {
      setToken(tokenParam)
    } else {
      setError('Invalid or missing reset token. Please request a new password reset link.')
    }
  }, [searchParams])

  const handleSubmit = async () => {
    setError('')
    setMessage('')

    if (!newPassword || !confirmPassword) {
      setError('Please fill in all fields')
      return
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (!token) {
      setError('Invalid reset token. Please request a new password reset link.')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('https://catalyst-research-match.onrender.com/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          newPassword
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to reset password')
        setLoading(false)
        return
      }

      setMessage('Password reset successful! Redirecting to login...')
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    } catch (err) {
      setError('Failed to connect to server. Please try again.')
      console.error('Reset password error:', err)
    } finally {
      setLoading(false)
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

      {/* Back to Login link */}
      <div
        style={{
          position: 'absolute',
          top: '32px',
          right: '32px'
        }}
      >
        <Link
          href="/login"
          style={{
            color: '#64748B',
            fontFamily: '"Work Sans", sans-serif',
            fontSize: '14px',
            textDecoration: 'none'
          }}
        >
          ← Back to login
        </Link>
      </div>

      {/* Reset Password Card */}
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
          Set New Password
        </h2>
        <p
          style={{
            color: '#64748B',
            fontFamily: '"Work Sans", sans-serif',
            fontSize: '14px',
            marginBottom: '32px'
          }}
        >
          Enter your new password below.
        </p>

        {/* New Password input */}
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
            New Password
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
            disabled={loading || !token}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '6px',
              border: '1px solid #E2E8F0',
              fontSize: '14px',
              fontFamily: '"Work Sans", sans-serif',
              outline: 'none',
              boxSizing: 'border-box',
              backgroundColor: (loading || !token) ? '#F8FAFC' : '#FFFFFF'
            }}
          />
        </div>

        {/* Confirm Password input */}
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
            Confirm Password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="Confirm new password"
            disabled={loading || !token}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '6px',
              border: '1px solid #E2E8F0',
              fontSize: '14px',
              fontFamily: '"Work Sans", sans-serif',
              outline: 'none',
              boxSizing: 'border-box',
              backgroundColor: (loading || !token) ? '#F8FAFC' : '#FFFFFF'
            }}
          />
        </div>

        {/* Success Message */}
        {message && (
          <div
            style={{
              padding: '12px',
              borderRadius: '6px',
              backgroundColor: '#DCFCE7',
              border: '1px solid #86EFAC',
              marginBottom: '20px'
            }}
          >
            <p style={{ color: '#16A34A', fontSize: '13px', fontFamily: '"Work Sans", sans-serif' }}>
              {message}
            </p>
          </div>
        )}

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

        {/* Reset Password Button */}
        <button
          onClick={handleSubmit}
          disabled={loading || !token}
          style={{
            width: '100%',
            padding: '14px',
            borderRadius: '6px',
            backgroundColor: (loading || !token) ? '#94A3B8' : '#1E293B',
            color: '#FFFFFF',
            fontFamily: '"Work Sans", sans-serif',
            fontSize: '15px',
            fontWeight: 600,
            border: 'none',
            cursor: (loading || !token) ? 'not-allowed' : 'pointer',
            marginBottom: '20px',
            transition: 'background-color 0.15s'
          }}
          onMouseEnter={(e) => !loading && token && (e.currentTarget.style.backgroundColor = '#0F172A')}
          onMouseLeave={(e) => !loading && token && (e.currentTarget.style.backgroundColor = '#1E293B')}
        >
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>

        {/* Back to Login Link */}
        <p
          style={{
            textAlign: 'center',
            color: '#64748B',
            fontFamily: '"Work Sans", sans-serif',
            fontSize: '14px',
            marginTop: '16px'
          }}
        >
          Remember your password?{' '}
          <Link
            href="/login"
            style={{
              color: '#1E293B',
              textDecoration: 'none',
              fontWeight: 600
            }}
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
