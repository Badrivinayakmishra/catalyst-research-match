'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function PIOpportunitiesPage() {
  const router = useRouter()
  const [piData, setPiData] = useState({
    initials: ""
  })

  useEffect(() => {
    // Load user data from localStorage
    const userName = localStorage.getItem('userName')

    // Get initials from name - handle undefined/null/empty cases
    let initials = "PI"
    if (userName && userName !== "undefined" && userName !== "null" && userName.trim() !== "") {
      const nameParts = userName.trim().split(' ').filter(part => part.length > 0)
      if (nameParts.length >= 2) {
        initials = `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase()
      } else if (nameParts.length === 1 && nameParts[0].length >= 2) {
        initials = nameParts[0].substring(0, 2).toUpperCase()
      } else if (nameParts.length === 1) {
        initials = nameParts[0][0].toUpperCase() + "P"
      }
    }

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

  const handleSignOut = () => {
    localStorage.clear()
    router.push('/')
  }

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
                className="text-sm font-medium transition"
                style={{ color: '#2563EB' }}
              >
                Opportunities
              </Link>
              <Link
                href="/pi-applications"
                className="text-sm font-medium hover:opacity-70 transition"
                style={{ color: '#334155' }}
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
              <button
                onClick={handleSignOut}
                className="text-sm font-medium hover:opacity-70 transition"
                style={{ color: '#334155' }}
              >
                Sign Out
              </button>
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
            Research Opportunities
          </h1>
          <p className="text-lg" style={{ color: '#64748B' }}>
            Manage your research positions and view applications
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
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>

            <h2
              className="text-3xl font-bold mb-4"
              style={{ color: '#0B2341', fontFamily: 'Plus Jakarta Sans, sans-serif' }}
            >
              No Research Opportunities Posted
            </h2>

            <p className="text-lg mb-8" style={{ color: '#64748B' }}>
              Create your first research opportunity to start receiving applications from talented UCLA students.
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

            <div className="mt-12 pt-8 border-t" style={{ borderColor: '#E2E8F0' }}>
              <p className="text-sm font-medium mb-4" style={{ color: '#64748B' }}>
                Need help creating a position?
              </p>
              <div className="flex gap-4 justify-center">
                <Link
                  href="/about"
                  className="text-sm font-semibold hover:opacity-70 transition"
                  style={{ color: '#2563EB' }}
                >
                  Learn How It Works →
                </Link>
                <Link
                  href="/pi-profile"
                  className="text-sm font-semibold hover:opacity-70 transition"
                  style={{ color: '#2563EB' }}
                >
                  Complete Your Profile →
                </Link>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
