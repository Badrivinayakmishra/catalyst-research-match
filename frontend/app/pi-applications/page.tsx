'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function PIApplicationsPage() {
  const [selectedPosition, setSelectedPosition] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Mock PI data
  const piData = {
    name: "Dr. Jennifer Smith",
    lab: "Computational Neuroscience Lab",
    initials: "JS"
  }

  // Mock applications
  const applications = [
    {
      id: 1,
      studentName: "Jane Doe",
      studentEmail: "jane.doe@ucla.edu",
      positionId: 1,
      positionTitle: "Neural Network Modeling RA",
      gpa: "3.8",
      major: "Computer Science",
      year: "Junior",
      status: "pending",
      appliedDate: "2024-01-20",
      skills: ["Python", "TensorFlow", "MATLAB"],
      availability: "15 hours/week",
      graduationDate: "June 2025",
      matchScore: 92
    },
    {
      id: 2,
      studentName: "Michael Chen",
      studentEmail: "m.chen@ucla.edu",
      positionId: 2,
      positionTitle: "BCI Research Assistant",
      gpa: "3.9",
      major: "Cognitive Science",
      year: "Senior",
      status: "pending",
      appliedDate: "2024-01-20",
      skills: ["Python", "Data Analysis", "Research Design"],
      availability: "20 hours/week",
      graduationDate: "June 2024",
      matchScore: 88
    },
    {
      id: 3,
      studentName: "Sarah Johnson",
      studentEmail: "s.johnson@ucla.edu",
      positionId: 1,
      positionTitle: "Neural Network Modeling RA",
      gpa: "3.7",
      major: "Neuroscience",
      year: "Sophomore",
      status: "shortlisted",
      appliedDate: "2024-01-19",
      skills: ["MATLAB", "Statistics", "Lab Experience"],
      availability: "12 hours/week",
      graduationDate: "June 2026",
      matchScore: 78
    },
    {
      id: 4,
      studentName: "Alex Kim",
      studentEmail: "alex.kim@ucla.edu",
      positionId: 3,
      positionTitle: "Data Analysis RA",
      gpa: "3.95",
      major: "Statistics",
      year: "Junior",
      status: "shortlisted",
      appliedDate: "2024-01-18",
      skills: ["R", "Python", "Machine Learning"],
      availability: "15 hours/week",
      graduationDate: "June 2025",
      matchScore: 95
    },
    {
      id: 5,
      studentName: "Emily Rodriguez",
      studentEmail: "e.rodriguez@ucla.edu",
      positionId: 2,
      positionTitle: "BCI Research Assistant",
      gpa: "3.6",
      major: "Bioengineering",
      year: "Senior",
      status: "interviewed",
      appliedDate: "2024-01-17",
      skills: ["Signal Processing", "Python", "Hardware"],
      availability: "18 hours/week",
      graduationDate: "June 2024",
      matchScore: 85
    },
    {
      id: 6,
      studentName: "David Park",
      studentEmail: "d.park@ucla.edu",
      positionId: 1,
      positionTitle: "Neural Network Modeling RA",
      gpa: "3.85",
      major: "Computer Science",
      year: "Junior",
      status: "accepted",
      appliedDate: "2024-01-15",
      skills: ["Python", "PyTorch", "Deep Learning"],
      availability: "20 hours/week",
      graduationDate: "June 2025",
      matchScore: 96
    },
    {
      id: 7,
      studentName: "Lisa Wang",
      studentEmail: "l.wang@ucla.edu",
      positionId: 3,
      positionTitle: "Data Analysis RA",
      gpa: "3.55",
      major: "Mathematics",
      year: "Sophomore",
      status: "rejected",
      appliedDate: "2024-01-14",
      skills: ["MATLAB", "Statistics"],
      availability: "10 hours/week",
      graduationDate: "June 2026",
      matchScore: 68
    },
    {
      id: 8,
      studentName: "James Martinez",
      studentEmail: "j.martinez@ucla.edu",
      positionId: 2,
      positionTitle: "BCI Research Assistant",
      gpa: "3.75",
      major: "Computer Science",
      year: "Junior",
      status: "pending",
      appliedDate: "2024-01-20",
      skills: ["Python", "Signal Processing", "MATLAB"],
      availability: "15 hours/week",
      graduationDate: "June 2025",
      matchScore: 91
    }
  ]

  // Filter applications
  const filteredApplications = applications.filter(app => {
    const matchesPosition = selectedPosition === 'all' || app.positionId.toString() === selectedPosition
    const matchesStatus = selectedStatus === 'all' || app.status === selectedStatus
    const matchesSearch = app.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         app.major.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         app.positionTitle.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesPosition && matchesStatus && matchesSearch
  })

  const positions = [
    { id: 1, title: "Neural Network Modeling RA" },
    { id: 2, title: "BCI Research Assistant" },
    { id: 3, title: "Data Analysis RA" }
  ]

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'pending': return '#F59E0B'
      case 'shortlisted': return '#8B5CF6'
      case 'interviewed': return '#3B82F6'
      case 'accepted': return '#10B981'
      case 'rejected': return '#EF4444'
      default: return '#64748B'
    }
  }

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1)
  }

  const handleStatusChange = (appId: number, newStatus: string) => {
    console.log(`Changed application ${appId} status to ${newStatus}`)
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

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6" style={{ borderColor: '#E2E8F0' }}>

          {/* Search */}
          <div className="mb-4">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" fill="none" stroke="#64748B" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search by name, major, or position..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none focus:border-blue-500 transition-colors"
                style={{ borderColor: '#E2E8F0', color: '#0B2341' }}
              />
            </div>
          </div>

          {/* Position Filter */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" style={{ color: '#64748B' }}>
              Filter by Position
            </label>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setSelectedPosition('all')}
                className="px-4 py-2 rounded-lg text-sm font-medium transition"
                style={{
                  backgroundColor: selectedPosition === 'all' ? '#2563EB' : 'transparent',
                  color: selectedPosition === 'all' ? '#FFFFFF' : '#64748B',
                  border: selectedPosition === 'all' ? 'none' : '1px solid #E2E8F0'
                }}
              >
                All Positions
              </button>
              {positions.map((position) => (
                <button
                  key={position.id}
                  onClick={() => setSelectedPosition(position.id.toString())}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition"
                  style={{
                    backgroundColor: selectedPosition === position.id.toString() ? '#2563EB' : 'transparent',
                    color: selectedPosition === position.id.toString() ? '#FFFFFF' : '#64748B',
                    border: selectedPosition === position.id.toString() ? 'none' : '1px solid #E2E8F0'
                  }}
                >
                  {position.title}
                </button>
              ))}
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#64748B' }}>
              Filter by Status
            </label>
            <div className="flex gap-2 flex-wrap">
              {[
                { value: 'all', label: 'All' },
                { value: 'pending', label: 'Pending' },
                { value: 'shortlisted', label: 'Shortlisted' },
                { value: 'interviewed', label: 'Interviewed' },
                { value: 'accepted', label: 'Accepted' },
                { value: 'rejected', label: 'Rejected' }
              ].map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setSelectedStatus(filter.value)}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition"
                  style={{
                    backgroundColor: selectedStatus === filter.value ? '#2563EB' : 'transparent',
                    color: selectedStatus === filter.value ? '#FFFFFF' : '#64748B',
                    border: selectedStatus === filter.value ? 'none' : '1px solid #E2E8F0'
                  }}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Applications List */}
        <div className="space-y-4">
          {filteredApplications.map((app) => (
            <div
              key={app.id}
              className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition"
              style={{ borderColor: '#E2E8F0' }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4 flex-1">
                  {/* Avatar */}
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center font-bold text-xl shrink-0"
                    style={{ backgroundColor: '#2563EB', color: '#FFFFFF' }}
                  >
                    {app.studentName.split(' ').map(n => n[0]).join('')}
                  </div>

                  {/* Student Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold" style={{ color: '#0B2341', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                        {app.studentName}
                      </h3>
                      <span
                        className="px-3 py-1 rounded-full text-xs font-bold"
                        style={{
                          backgroundColor: `${getStatusColor(app.status)}20`,
                          color: getStatusColor(app.status)
                        }}
                      >
                        {getStatusLabel(app.status)}
                      </span>
                      <span
                        className="px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"
                        style={{
                          backgroundColor: app.matchScore >= 90 ? '#10B98120' : app.matchScore >= 80 ? '#3B82F620' : '#F59E0B20',
                          color: app.matchScore >= 90 ? '#10B981' : app.matchScore >= 80 ? '#3B82F6' : '#F59E0B'
                        }}
                      >
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        {app.matchScore}% Match
                      </span>
                    </div>
                    <p className="text-sm mb-1" style={{ color: '#64748B' }}>
                      {app.major} • {app.year} • GPA: {app.gpa}
                    </p>
                    <p className="text-sm mb-1" style={{ color: '#64748B' }}>
                      {app.studentEmail}
                    </p>
                    <p className="text-sm font-medium mb-3" style={{ color: '#334155' }}>
                      Applied for: {app.positionTitle}
                    </p>

                    {/* Additional Details */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-xs font-medium mb-1" style={{ color: '#64748B' }}>Availability</p>
                        <p className="text-sm font-bold" style={{ color: '#0B2341' }}>{app.availability}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium mb-1" style={{ color: '#64748B' }}>Graduation</p>
                        <p className="text-sm font-bold" style={{ color: '#0B2341' }}>{app.graduationDate}</p>
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
                  </div>
                </div>

                {/* Applied Date */}
                <div className="text-right shrink-0 ml-4">
                  <p className="text-xs font-medium mb-1" style={{ color: '#64748B' }}>Applied</p>
                  <p className="text-sm" style={{ color: '#334155' }}>
                    {new Date(app.appliedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 flex-wrap">
                <Link
                  href={`/pi-applications/${app.id}`}
                  className="px-4 py-2 rounded-lg text-sm font-bold transition hover:opacity-80"
                  style={{ backgroundColor: '#2563EB', color: '#FFFFFF' }}
                >
                  View Full Application
                </Link>
                <Link
                  href={`/pi-messages?student=${app.id}`}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition hover:bg-gray-100"
                  style={{ border: '1px solid #E2E8F0', color: '#334155' }}
                >
                  Message Student
                </Link>

                {/* Status Change Buttons */}
                {app.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleStatusChange(app.id, 'shortlisted')}
                      className="px-4 py-2 rounded-lg text-sm font-medium transition hover:opacity-80"
                      style={{ backgroundColor: '#8B5CF620', color: '#8B5CF6', border: '1px solid #8B5CF6' }}
                    >
                      Shortlist
                    </button>
                    <button
                      onClick={() => handleStatusChange(app.id, 'rejected')}
                      className="px-4 py-2 rounded-lg text-sm font-medium transition hover:bg-red-50"
                      style={{ border: '1px solid #FEE2E2', color: '#DC2626' }}
                    >
                      Reject
                    </button>
                  </>
                )}

                {app.status === 'shortlisted' && (
                  <>
                    <button
                      onClick={() => handleStatusChange(app.id, 'interviewed')}
                      className="px-4 py-2 rounded-lg text-sm font-medium transition hover:opacity-80"
                      style={{ backgroundColor: '#3B82F620', color: '#3B82F6', border: '1px solid #3B82F6' }}
                    >
                      Mark as Interviewed
                    </button>
                    <button
                      onClick={() => handleStatusChange(app.id, 'rejected')}
                      className="px-4 py-2 rounded-lg text-sm font-medium transition hover:bg-red-50"
                      style={{ border: '1px solid #FEE2E2', color: '#DC2626' }}
                    >
                      Reject
                    </button>
                  </>
                )}

                {app.status === 'interviewed' && (
                  <>
                    <button
                      onClick={() => handleStatusChange(app.id, 'accepted')}
                      className="px-4 py-2 rounded-lg text-sm font-medium transition hover:opacity-80"
                      style={{ backgroundColor: '#10B98120', color: '#10B981', border: '1px solid #10B981' }}
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleStatusChange(app.id, 'rejected')}
                      className="px-4 py-2 rounded-lg text-sm font-medium transition hover:bg-red-50"
                      style={{ border: '1px solid #FEE2E2', color: '#DC2626' }}
                    >
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}

          {filteredApplications.length === 0 && (
            <div className="bg-white rounded-xl shadow-sm border p-12 text-center" style={{ borderColor: '#E2E8F0' }}>
              <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="#94A3B8" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p className="text-lg font-semibold mb-2" style={{ color: '#0B2341' }}>
                No applications found
              </p>
              <p className="text-sm" style={{ color: '#64748B' }}>
                Try adjusting your filters or search query
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
