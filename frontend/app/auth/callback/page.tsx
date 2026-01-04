'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    handleCallback()
  }, [])

  const handleCallback = async () => {
    try {
      const code = searchParams.get('code')
      const error = searchParams.get('error')

      if (error) {
        alert(`Google Sign-In error: ${error}`)
        router.push('/login')
        return
      }

      if (!code) {
        alert('No authorization code received')
        router.push('/login')
        return
      }

      // Send code to backend
      const response = await fetch('https://catalyst-research-match.onrender.com/api/auth/google/callback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // Save user info to localStorage
        localStorage.setItem('userId', data.user.id)
        localStorage.setItem('userEmail', data.user.email)
        localStorage.setItem('userType', data.user.userType)
        localStorage.setItem('userName', data.user.fullName)

        // Redirect to dashboard
        if (data.user.userType === 'pi') {
          router.push('/pi-dashboard')
        } else {
          router.push('/dashboard')
        }
      } else {
        alert(data.error || 'Google Sign-In failed')
        router.push('/login')
      }
    } catch (error) {
      console.error('OAuth callback error:', error)
      alert('Failed to complete Google Sign-In')
      router.push('/login')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F9F7F2' }}>
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: '#2563EB' }}></div>
        <p className="mt-4 text-lg font-semibold" style={{ color: '#0B2341' }}>
          Completing Google Sign-In...
        </p>
      </div>
    </div>
  )
}
