'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'applications' | 'saved' | 'recommendations'>('applications')

  // Mock user data
  const user = {
    name: "Jane Doe",
    major: "Computer Science",
    year: "Junior",
    gpa: 3.85
  }

  // Mock applications data
  const applications = [
    {
      id: 1,
      labName: "Dr. Smith's Computational Neuroscience Lab",
      pi: "Dr. Jennifer Smith",
      department: "Neuroscience",
      appliedDate: "Dec 15, 2024",
      status: "Under Review",
      statusColor: "#F59E0B"
    },
    {
      id: 2,
      labName: "AI Ethics Research Lab",
      pi: "Dr. Michael Chen",
      department: "Computer Science",
      appliedDate: "Dec 10, 2024",
      status: "Interview Scheduled",
      statusColor: "#2563EB"
    },
    {
      id: 3,
      labName: "Quantum Computing Lab",
      pi: "Dr. Sarah Johnson",
      department: "Physics",
      appliedDate: "Dec 5, 2024",
      status: "Accepted",
      statusColor: "#10B981"
    }
  ]

  // Mock saved labs
  const savedLabs = [
    {
      id: 4,
      name: "Machine Learning Research Lab",
      pi: "Dr. David Park",
      department: "Computer Science",
      timeCommitment: "10-15 hrs/week",
      paid: true,
      openings: 2
    },
    {
      id: 5,
      name: "Climate Change Modeling Lab",
      pi: "Dr. Emily Rodriguez",
      department: "Environmental Science",
      timeCommitment: "15-20 hrs/week",
      paid: false,
      openings: 3
    }
  ]

  // Mock recommendations
  const recommendations = [
    {
      id: 6,
      name: "Natural Language Processing Lab",
      pi: "Dr. James Wilson",
      department: "Computer Science",
      match: 95,
      timeCommitment: "10-15 hrs/week",
      paid: true,
      openings: 1,
      matchReason: "Strong match based on your AI and ML coursework"
    },
    {
      id: 7,
      name: "Human-Computer Interaction Lab",
      pi: "Dr. Lisa Anderson",
      department: "Computer Science",
      match: 88,
      timeCommitment: "10-15 hrs/week",
      paid: true,
      openings: 2,
      matchReason: "Aligns with your design and programming skills"
    },
    {
      id: 8,
      name: "Robotics & Automation Lab",
      pi: "Dr. Robert Kim",
      department: "Engineering",
      match: 82,
      timeCommitment: "15-20 hrs/week",
      paid: true,
      openings: 1,
      matchReason: "Matches your hardware and software experience"
    }
  ]

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
                href="/browse"
                className="text-sm font-medium hover:opacity-70 transition"
                style={{ color: '#334155' }}
              >
                Browse Labs
              </Link>
              <Link
                href="/messages"
                className="text-sm font-medium hover:opacity-70 transition"
                style={{ color: '#334155' }}
              >
                Messages
              </Link>
              <Link
                href="/profile"
                className="w-10 h-10 rounded-full flex items-center justify-center font-bold hover:opacity-80 transition"
                style={{ backgroundColor: '#2563EB', color: '#FFFFFF' }}
                title="Profile Settings"
              >
                {user.name.split(' ').map(n => n[0]).join('')}
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Header */}
        <div className="mb-12">
          <h1
            className="text-4xl md:text-5xl font-bold mb-3"
            style={{
              color: '#0B2341',
              fontFamily: "'Fraunces', serif",
              letterSpacing: '-0.02em'
            }}
          >
            Welcome back, <span style={{ color: '#2563EB' }}>{user.name.split(' ')[0]}</span>
          </h1>
          <p className="text-lg" style={{ color: '#64748B' }}>
            {user.major} • {user.year} • GPA: {user.gpa}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-2xl p-6 border hover:shadow-lg transition-shadow" style={{ borderColor: '#E2E8F0' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium mb-1" style={{ color: '#64748B' }}>Active Applications</p>
                <p className="text-3xl font-bold" style={{ color: '#0B2341', fontFamily: "'Fraunces', serif" }}>
                  {applications.length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(37, 99, 235, 0.1)' }}>
                <svg className="w-6 h-6" fill="none" stroke="#2563EB" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border hover:shadow-lg transition-shadow" style={{ borderColor: '#E2E8F0' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium mb-1" style={{ color: '#64748B' }}>Saved Labs</p>
                <p className="text-3xl font-bold" style={{ color: '#0B2341', fontFamily: "'Fraunces', serif" }}>
                  {savedLabs.length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(37, 99, 235, 0.1)' }}>
                <svg className="w-6 h-6" fill="none" stroke="#2563EB" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border hover:shadow-lg transition-shadow" style={{ borderColor: '#E2E8F0' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium mb-1" style={{ color: '#64748B' }}>Strong Matches (80%+)</p>
                <p className="text-3xl font-bold" style={{ color: '#0B2341', fontFamily: "'Fraunces', serif" }}>
                  12
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(37, 99, 235, 0.1)' }}>
                <svg className="w-6 h-6" fill="none" stroke="#2563EB" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b" style={{ borderColor: '#E2E8F0' }}>
          <button
            onClick={() => setActiveTab('applications')}
            className="px-6 py-3 font-semibold transition-colors relative"
            style={{
              color: activeTab === 'applications' ? '#2563EB' : '#64748B'
            }}
          >
            My Applications
            {activeTab === 'applications' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: '#2563EB' }}></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className="px-6 py-3 font-semibold transition-colors relative"
            style={{
              color: activeTab === 'saved' ? '#2563EB' : '#64748B'
            }}
          >
            Saved Labs
            {activeTab === 'saved' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: '#2563EB' }}></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab('recommendations')}
            className="px-6 py-3 font-semibold transition-colors relative"
            style={{
              color: activeTab === 'recommendations' ? '#2563EB' : '#64748B'
            }}
          >
            Recommendations
            {activeTab === 'recommendations' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: '#2563EB' }}></div>
            )}
          </button>
        </div>

        {/* Applications Tab */}
        {activeTab === 'applications' && (
          <div className="space-y-4">
            {applications.map((app) => (
              <div key={app.id} className="bg-white rounded-2xl p-6 border hover:shadow-lg transition-shadow" style={{ borderColor: '#E2E8F0' }}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2" style={{ color: '#0B2341', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                      {app.labName}
                    </h3>
                    <p className="text-sm mb-3" style={{ color: '#64748B' }}>
                      {app.pi} • {app.department}
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="#64748B" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm" style={{ color: '#64748B' }}>Applied {app.appliedDate}</span>
                      </div>
                      <div className="px-3 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: `${app.statusColor}20`, color: app.statusColor }}>
                        {app.status}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 text-sm font-semibold rounded-lg transition hover:opacity-80" style={{ backgroundColor: 'rgba(37, 99, 235, 0.1)', color: '#2563EB' }}>
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {applications.length === 0 && (
              <div className="text-center py-12">
                <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="#94A3B8" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-lg font-semibold mb-2" style={{ color: '#0B2341' }}>No applications yet</p>
                <p className="text-sm mb-6" style={{ color: '#64748B' }}>Start exploring labs and apply to positions that interest you</p>
                <Link
                  href="/browse"
                  className="inline-block px-6 py-3 rounded-lg font-semibold transition hover:opacity-80"
                  style={{ backgroundColor: '#2563EB', color: '#FFFFFF' }}
                >
                  Browse Labs
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Saved Labs Tab */}
        {activeTab === 'saved' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {savedLabs.map((lab) => (
              <div key={lab.id} className="bg-white rounded-2xl p-6 border hover:shadow-lg transition-shadow" style={{ borderColor: '#E2E8F0' }}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2" style={{ color: '#0B2341', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                      {lab.name}
                    </h3>
                    <p className="text-sm mb-3" style={{ color: '#64748B' }}>
                      {lab.pi} • {lab.department}
                    </p>
                  </div>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                    <svg className="w-5 h-5" fill="#2563EB" stroke="#2563EB" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  </button>
                </div>

                <div className="flex items-center gap-4 mb-4 text-sm" style={{ color: '#64748B' }}>
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {lab.timeCommitment}
                  </div>
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {lab.paid ? 'Paid' : 'Credit'}
                  </div>
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    {lab.openings} openings
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link
                    href={`/apply?lab=${lab.id}`}
                    className="flex-1 text-center px-4 py-2 text-sm font-semibold rounded-lg transition hover:opacity-80"
                    style={{ backgroundColor: '#2563EB', color: '#FFFFFF' }}
                  >
                    Apply Now
                  </Link>
                  <button className="px-4 py-2 text-sm font-semibold rounded-lg transition hover:opacity-80" style={{ backgroundColor: 'rgba(37, 99, 235, 0.1)', color: '#2563EB' }}>
                    View Details
                  </button>
                </div>
              </div>
            ))}

            {savedLabs.length === 0 && (
              <div className="col-span-2 text-center py-12">
                <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="#94A3B8" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                <p className="text-lg font-semibold mb-2" style={{ color: '#0B2341' }}>No saved labs yet</p>
                <p className="text-sm mb-6" style={{ color: '#64748B' }}>Save labs you're interested in to easily find them later</p>
                <Link
                  href="/browse"
                  className="inline-block px-6 py-3 rounded-lg font-semibold transition hover:opacity-80"
                  style={{ backgroundColor: '#2563EB', color: '#FFFFFF' }}
                >
                  Browse Labs
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Recommendations Tab */}
        {activeTab === 'recommendations' && (
          <div className="space-y-4">
            {recommendations.map((lab) => (
              <div key={lab.id} className="bg-white rounded-2xl p-6 border hover:shadow-lg transition-shadow" style={{ borderColor: '#E2E8F0' }}>
                <div className="flex items-start gap-4">
                  {/* Match Score Circle */}
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 rounded-full flex flex-col items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.1), rgba(37, 99, 235, 0.2))' }}>
                      <span className="text-2xl font-bold" style={{ color: '#2563EB', fontFamily: "'Fraunces', serif" }}>
                        {lab.match}%
                      </span>
                      <span className="text-xs font-semibold" style={{ color: '#64748B' }}>Match</span>
                    </div>
                  </div>

                  {/* Lab Info */}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2" style={{ color: '#0B2341', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                      {lab.name}
                    </h3>
                    <p className="text-sm mb-2" style={{ color: '#64748B' }}>
                      {lab.pi} • {lab.department}
                    </p>
                    <div className="inline-block px-3 py-1 rounded-lg text-sm mb-3" style={{ backgroundColor: 'rgba(37, 99, 235, 0.1)', color: '#2563EB' }}>
                      {lab.matchReason}
                    </div>

                    <div className="flex items-center gap-4 text-sm" style={{ color: '#64748B' }}>
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {lab.timeCommitment}
                      </div>
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {lab.paid ? 'Paid' : 'Credit'}
                      </div>
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        {lab.openings} {lab.openings === 1 ? 'opening' : 'openings'}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                      <svg className="w-5 h-5" fill="none" stroke="#64748B" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                      </svg>
                    </button>
                    <Link
                      href={`/apply?lab=${lab.id}`}
                      className="px-4 py-2 text-sm font-semibold rounded-lg transition hover:opacity-80 text-center"
                      style={{ backgroundColor: '#2563EB', color: '#FFFFFF' }}
                    >
                      Apply
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}
