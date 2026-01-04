'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function PIDashboard() {
  const [selectedFilter, setSelectedFilter] = useState('all')

  // Mock PI data
  const piData = {
    name: "Dr. Jennifer Smith",
    lab: "Computational Neuroscience Lab",
    department: "Computer Science",
    initials: "JS"
  }

  // Mock metrics
  const metrics = [
    { label: "Total Applications", value: "47", change: "+12 this week", positive: true },
    { label: "Active Positions", value: "3", change: "2 closing soon", positive: false },
    { label: "Response Rate", value: "89%", change: "+5% from last month", positive: true },
    { label: "Positions Filled", value: "8", change: "This academic year", positive: true }
  ]

  // Mock recent applications
  const recentApplications = [
    {
      id: 1,
      studentName: "Jane Doe",
      position: "Neural Network Modeling RA",
      gpa: "3.8",
      major: "Computer Science",
      year: "Junior",
      status: "pending",
      appliedDate: "2 hours ago",
      skills: ["Python", "TensorFlow", "MATLAB"]
    },
    {
      id: 2,
      studentName: "Michael Chen",
      position: "BCI Research Assistant",
      gpa: "3.9",
      major: "Cognitive Science",
      year: "Senior",
      status: "pending",
      appliedDate: "5 hours ago",
      skills: ["Python", "Data Analysis", "Research Design"]
    },
    {
      id: 3,
      studentName: "Sarah Johnson",
      position: "Neural Network Modeling RA",
      gpa: "3.7",
      major: "Neuroscience",
      year: "Sophomore",
      status: "pending",
      appliedDate: "1 day ago",
      skills: ["MATLAB", "Statistics", "Lab Experience"]
    },
    {
      id: 4,
      studentName: "Alex Kim",
      position: "Data Analysis RA",
      gpa: "3.95",
      major: "Statistics",
      year: "Junior",
      status: "shortlisted",
      appliedDate: "2 days ago",
      skills: ["R", "Python", "Machine Learning"]
    },
    {
      id: 5,
      studentName: "Emily Rodriguez",
      position: "BCI Research Assistant",
      gpa: "3.6",
      major: "Bioengineering",
      year: "Senior",
      status: "reviewed",
      appliedDate: "3 days ago",
      skills: ["Signal Processing", "Python", "Hardware"]
    }
  ]

  // Mock active positions
  const activePositions = [
    {
      id: 1,
      title: "Neural Network Modeling RA",
      applications: 18,
      posted: "2 weeks ago",
      deadline: "In 2 weeks",
      status: "active"
    },
    {
      id: 2,
      title: "BCI Research Assistant",
      applications: 15,
      posted: "1 week ago",
      deadline: "In 3 weeks",
      status: "active"
    },
    {
      id: 3,
      title: "Data Analysis RA",
      applications: 14,
      posted: "3 weeks ago",
      deadline: "In 3 days",
      status: "closing-soon"
    }
  ]

  const filteredApplications = selectedFilter === 'all'
    ? recentApplications
    : recentApplications.filter(app => app.status === selectedFilter)

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'pending': return '#F59E0B'
      case 'shortlisted': return '#10B981'
      case 'reviewed': return '#6366F1'
      case 'rejected': return '#EF4444'
      default: return '#64748B'
    }
  }

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1)
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
                className="text-sm font-medium transition"
                style={{ color: '#2563EB' }}
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
                className="text-sm font-medium hover:opacity-70 transition"
                style={{ color: '#334155' }}
              >
                Applications
              </Link>
              <Link
                href="/pi-messages"
                className="text-sm font-medium hover:opacity-70 transition"
                style={{ color: '#334155' }}
              >
                Messages
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
            Welcome back, {piData.name.split(' ')[1]}
          </h1>
          <p className="text-lg" style={{ color: '#64748B' }}>
            {piData.lab} • {piData.department}
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl p-6 shadow-sm border"
              style={{ borderColor: '#E2E8F0' }}
            >
              <p className="text-sm font-medium mb-1" style={{ color: '#64748B' }}>
                {metric.label}
              </p>
              <p className="text-3xl font-bold mb-2" style={{ color: '#0B2341', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                {metric.value}
              </p>
              <p
                className="text-sm font-medium flex items-center gap-1"
                style={{ color: metric.positive ? '#10B981' : '#F59E0B' }}
              >
                {metric.positive ? '↑' : '→'} {metric.change}
              </p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <Link
            href="/pi-opportunities/new"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition hover:opacity-80 shadow-sm"
            style={{ backgroundColor: '#2563EB', color: '#FFFFFF' }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Post New Opportunity
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Recent Applications */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border" style={{ borderColor: '#E2E8F0' }}>

              {/* Header */}
              <div className="p-6 border-b" style={{ borderColor: '#E2E8F0' }}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold" style={{ color: '#0B2341', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                    Recent Applications
                  </h2>
                  <Link
                    href="/pi-applications"
                    className="text-sm font-medium hover:opacity-70 transition"
                    style={{ color: '#2563EB' }}
                  >
                    View All →
                  </Link>
                </div>

                {/* Filters */}
                <div className="flex gap-2 flex-wrap">
                  {['all', 'pending', 'shortlisted', 'reviewed'].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setSelectedFilter(filter)}
                      className="px-4 py-2 rounded-lg text-sm font-medium transition"
                      style={{
                        backgroundColor: selectedFilter === filter ? '#2563EB' : 'transparent',
                        color: selectedFilter === filter ? '#FFFFFF' : '#64748B',
                        border: selectedFilter === filter ? 'none' : '1px solid #E2E8F0'
                      }}
                    >
                      {filter.charAt(0).toUpperCase() + filter.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Applications List */}
              <div className="divide-y" style={{ borderColor: '#E2E8F0' }}>
                {filteredApplications.map((app) => (
                  <div key={app.id} className="p-6 hover:bg-gray-50 transition">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-bold mb-1" style={{ color: '#0B2341' }}>
                          {app.studentName}
                        </h3>
                        <p className="text-sm mb-1" style={{ color: '#64748B' }}>
                          {app.major} • {app.year} • GPA: {app.gpa}
                        </p>
                        <p className="text-sm font-medium" style={{ color: '#334155' }}>
                          Applied for: {app.position}
                        </p>
                      </div>
                      <div className="text-right">
                        <span
                          className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-2"
                          style={{
                            backgroundColor: `${getStatusColor(app.status)}20`,
                            color: getStatusColor(app.status)
                          }}
                        >
                          {getStatusLabel(app.status)}
                        </span>
                        <p className="text-xs" style={{ color: '#94A3B8' }}>
                          {app.appliedDate}
                        </p>
                      </div>
                    </div>

                    {/* Skills */}
                    <div className="flex gap-2 mb-4 flex-wrap">
                      {app.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 rounded-lg text-xs font-medium"
                          style={{ backgroundColor: '#F1F5F9', color: '#334155' }}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Link
                        href={`/pi-applications/${app.id}`}
                        className="flex-1 text-center px-4 py-2 rounded-lg text-sm font-bold transition hover:opacity-80"
                        style={{ backgroundColor: '#2563EB', color: '#FFFFFF' }}
                      >
                        Review Application
                      </Link>
                      <button
                        className="px-4 py-2 rounded-lg text-sm font-medium transition hover:bg-gray-100"
                        style={{ border: '1px solid #E2E8F0', color: '#334155' }}
                      >
                        Message
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Active Positions Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border p-6" style={{ borderColor: '#E2E8F0' }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold" style={{ color: '#0B2341', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  Active Positions
                </h2>
                <Link
                  href="/pi-opportunities"
                  className="text-sm font-medium hover:opacity-70 transition"
                  style={{ color: '#2563EB' }}
                >
                  Manage
                </Link>
              </div>

              <div className="space-y-4">
                {activePositions.map((position) => (
                  <div
                    key={position.id}
                    className="p-4 rounded-lg border"
                    style={{ borderColor: '#E2E8F0' }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-sm font-bold pr-2" style={{ color: '#0B2341' }}>
                        {position.title}
                      </h3>
                      {position.status === 'closing-soon' && (
                        <span
                          className="px-2 py-1 rounded text-xs font-bold shrink-0"
                          style={{ backgroundColor: '#FEF3C7', color: '#D97706' }}
                        >
                          Closing Soon
                        </span>
                      )}
                    </div>
                    <p className="text-sm mb-3" style={{ color: '#64748B' }}>
                      {position.applications} applications • Posted {position.posted}
                    </p>
                    <div className="flex items-center justify-between text-xs">
                      <span style={{ color: '#94A3B8' }}>
                        Deadline: {position.deadline}
                      </span>
                      <Link
                        href={`/pi-opportunities/${position.id}`}
                        className="font-medium hover:opacity-70 transition"
                        style={{ color: '#2563EB' }}
                      >
                        View →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
