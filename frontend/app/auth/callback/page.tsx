'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function AuthCallback() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState('')

  useEffect(() => {
    const code = searchParams.get('code')

    if (!code) {
      setError('No authorization code received')
      return
    }

    // Exchange code for user info
    fetch('https://catalyst-research-match.onrender.com/api/auth/google/callback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.user) {
          // Store user info
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
        } else {
          setError(data.error || 'Authentication failed')
        }
      })
      .catch((err) => {
        console.error('OAuth callback error:', err)
        setError('Failed to complete authentication')
      })
  }, [searchParams, router])

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        backgroundColor: '#F1F5F9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <div
        style={{
          width: '420px',
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          padding: '48px 40px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          textAlign: 'center'
        }}
      >
        {error ? (
          <>
            <h2
              style={{
                color: '#DC2626',
                fontFamily: '"Work Sans", sans-serif',
                fontSize: '24px',
                fontWeight: 600,
                marginBottom: '16px'
              }}
            >
              Authentication Error
            </h2>
            <p
              style={{
                color: '#64748B',
                fontFamily: '"Work Sans", sans-serif',
                fontSize: '14px',
                marginBottom: '24px'
              }}
            >
              {error}
            </p>
            <button
              onClick={() => router.push('/login')}
              style={{
                padding: '12px 24px',
                borderRadius: '6px',
                backgroundColor: '#1E293B',
                color: '#FFFFFF',
                fontFamily: '"Work Sans", sans-serif',
                fontSize: '14px',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Back to Login
            </button>
          </>
        ) : (
          <>
            <div
              style={{
                width: '48px',
                height: '48px',
                border: '4px solid #E2E8F0',
                borderTopColor: '#1E293B',
                borderRadius: '50%',
                margin: '0 auto 24px',
                animation: 'spin 1s linear infinite'
              }}
            />
            <h2
              style={{
                color: '#1E293B',
                fontFamily: '"Work Sans", sans-serif',
                fontSize: '24px',
                fontWeight: 600,
                marginBottom: '8px'
              }}
            >
              Completing sign in...
            </h2>
            <p
              style={{
                color: '#64748B',
                fontFamily: '"Work Sans", sans-serif',
                fontSize: '14px'
              }}
            >
              Please wait while we log you in
            </p>
          </>
        )}
      </div>
      <style jsx>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  )
}
