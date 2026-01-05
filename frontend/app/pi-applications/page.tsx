'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function PIApplicationsPage() {
  const router = useRouter()
  const [piData, setPiData] = useState({
    initials: ""
  })

  useEffect(() => {
    // Load user data from localStorage
    const userName = localStorage.getItem('userName') || "Professor"

    // Get initials from name
    const nameParts = userName.split(' ')
    const initials = nameParts.length >= 2
      ? `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase()
      : userName.substring(0, 2).toUpperCase()

    setPiData({
      initials: initials
    })

    // Check if user is logged in
    const userId = localStorage.getItem('userId')
    const userType = localStorage.getItem('userType')

    if (!userId || userType !== 'pi') {
      router.push('/login')
    }
  }, [router])

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F9F7F2' }}>
      {/* Navigation */}
      <nav className="border-b backdrop-blur-sm bg-white/70 sticky top-0 z-40" style={{ borderColor: '#E2E8F0' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold" style={{ color: '#0B2341', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              Catalyst
            </Link>
            <div className="flex items-center gap-6">
              <Link
                href="/pi-dashboard"
                className="text-sm font-medium hover:opacity-70 transition"
                style={{ color: '#334155' }}
              >
                Dashboard
              </Link>
              <Link
                href="/pi-opportunities"
                className="text-sm font-medium hover:opacity-70 transition"
                style={{ color: '#334155' }}
              >
                Opportunities
              </Link>
              <Link
                href="/pi-applications"
                className="text-sm font-medium transition"
                style={{ color: '#2563EB' }}
              >
                Applications
              </Link>
              <Link
                href="/pi-profile"
                className="w-10 h-10 rounded-full flex items-center justify-center font-bold hover:opacity-80 transition"
                style={{ backgroundColor: '#2563EB', color: '#FFFFFF' }}
                title="Lab Profile Settings"
              >
                {piData.initials}
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="mb-8">
          <h1
            className="text-4xl font-bold mb-2"
            style={{
              color: '#0B2341',
              fontFamily: "'Fraunces', serif",
              letterSpacing: '-0.02em'
            }}
          >
            Applications
          </h1>
          <p className="text-lg" style={{ color: '#64748B' }}>
            Review and manage student applications
          </p>
        </div>

        {/* Empty State */}
        <div className="bg-white rounded-2xl shadow-sm border p-12 text-center" style={{ borderColor: '#E2E8F0' }}>
          <div className="max-w-2xl mx-auto">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ backgroundColor: 'rgba(37, 99, 235, 0.1)' }}
            >
              <svg className="w-10 h-10" style={{ color: '#2563EB' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>

            <h2
              className="text-3xl font-bold mb-4"
              style={{ color: '#0B2341', fontFamily: 'Plus Jakarta Sans, sans-serif' }}
            >
              No Applications Yet
            </h2>

            <p className="text-lg mb-8" style={{ color: '#64748B' }}>
              Once you post research opportunities, student applications will appear here for you to review.
            </p>

            <Link
              href="/pi-opportunities/new"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-lg transition hover:opacity-80 shadow-md"
              style={{ backgroundColor: '#2563EB', color: '#FFFFFF' }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Post Your First Opportunity
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}
