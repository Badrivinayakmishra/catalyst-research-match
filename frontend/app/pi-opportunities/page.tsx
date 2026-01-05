'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function PIOpportunitiesPage() {
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Mock PI data
  const piData = {
    name: "Dr. Jennifer Smith",
    lab: "Computational Neuroscience Lab",
    initials: "JS"
  }

  // Mock opportunities
  const opportunities = [
    {
      id: 1,
      title: "Neural Network Modeling RA",
      status: "active",
      applications: 18,
      views: 145,
      posted: "2 weeks ago",
      deadline: "2024-02-15",
      hoursPerWeek: "10-15",
      compensation: "Academic Credit",
      description: "Join our team to work on cutting-edge neural network models..."
    },
    {
      id: 2,
      title: "BCI Research Assistant",
      status: "active",
      applications: 15,
      views: 132,
      posted: "1 week ago",
      deadline: "2024-02-22",
      hoursPerWeek: "15-20",
      compensation: "$18/hour",
      description: "Seeking motivated student to assist with Brain-Computer Interface research..."
    },
    {
      id: 3,
      title: "Data Analysis RA",
      status: "closing-soon",
      applications: 14,
      views: 98,
      posted: "3 weeks ago",
      deadline: "2024-01-25",
      hoursPerWeek: "10-12",
      compensation: "$16/hour",
      description: "Help analyze large datasets from neuroimaging experiments..."
    },
    {
      id: 4,
      title: "Machine Learning Intern",
      status: "filled",
      applications: 32,
      views: 287,
      posted: "2 months ago",
      deadline: "2023-12-10",
      hoursPerWeek: "15-20",
      compensation: "$20/hour",
      description: "Work on ML models for predicting neural activity patterns..."
    },
    {
      id: 5,
      title: "Summer Research Fellow",
      status: "closed",
      applications: 45,
      views: 356,
      posted: "3 months ago",
      deadline: "2023-11-30",
      hoursPerWeek: "40",
      compensation: "$5000 stipend",
      description: "Full-time summer position for advanced computational neuroscience research..."
    }
  ]

  const filteredOpportunities = opportunities.filter(opp => {
    const matchesFilter = selectedFilter === 'all' || opp.status === selectedFilter
    const matchesSearch = opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         opp.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return '#10B981'
      case 'closing-soon': return '#F59E0B'
      case 'filled': return '#6366F1'
      case 'closed': return '#64748B'
      default: return '#64748B'
    }
  }

  const getStatusLabel = (status: string) => {
    return status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  }

  const handleClose = (oppId: number) => {
    console.log(`Closing opportunity ${oppId}`)
  }

  const handleDelete = (oppId: number) => {
    if (confirm('Are you sure you want to delete this opportunity?')) {
      console.log(`Deleting opportunity ${oppId}`)
    }
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
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
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
          <Link
            href="/pi-opportunities/new"
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition hover:opacity-80 shadow-sm"
            style={{ backgroundColor: '#2563EB', color: '#FFFFFF' }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Post New Opportunity
          </Link>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6" style={{ borderColor: '#E2E8F0' }}>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            {/* Search */}
            <div className="flex-1 relative">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" fill="none" stroke="#64748B" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search opportunities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none focus:border-blue-500 transition-colors"
                style={{ borderColor: '#E2E8F0', color: '#0B2341' }}
              />
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 flex-wrap">
            {[
              { value: 'all', label: 'All' },
              { value: 'active', label: 'Active' },
              { value: 'closing-soon', label: 'Closing Soon' },
              { value: 'filled', label: 'Filled' },
              { value: 'closed', label: 'Closed' }
            ].map((filter) => (
              <button
                key={filter.value}
                onClick={() => setSelectedFilter(filter.value)}
                className="px-4 py-2 rounded-lg text-sm font-medium transition"
                style={{
                  backgroundColor: selectedFilter === filter.value ? '#2563EB' : 'transparent',
                  color: selectedFilter === filter.value ? '#FFFFFF' : '#64748B',
                  border: selectedFilter === filter.value ? 'none' : '1px solid #E2E8F0'
                }}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Opportunities List */}
        <div className="space-y-4">
          {filteredOpportunities.map((opp) => (
            <div
              key={opp.id}
              className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition"
              style={{ borderColor: '#E2E8F0' }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold" style={{ color: '#0B2341', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                      {opp.title}
                    </h2>
                    <span
                      className="px-3 py-1 rounded-full text-xs font-bold"
                      style={{
                        backgroundColor: `${getStatusColor(opp.status)}20`,
                        color: getStatusColor(opp.status)
                      }}
                    >
                      {getStatusLabel(opp.status)}
                    </span>
                  </div>
                  <p className="text-sm mb-3" style={{ color: '#64748B' }}>
                    Posted {opp.posted} • Deadline: {new Date(opp.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                  <p className="text-sm mb-4" style={{ color: '#334155' }}>
                    {opp.description}
                  </p>

                  {/* Details Grid */}
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-xs font-medium mb-1" style={{ color: '#64748B' }}>Hours/Week</p>
                      <p className="text-sm font-bold" style={{ color: '#0B2341' }}>{opp.hoursPerWeek}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium mb-1" style={{ color: '#64748B' }}>Compensation</p>
                      <p className="text-sm font-bold" style={{ color: '#0B2341' }}>{opp.compensation}</p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex gap-6 mb-4">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="#64748B" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="text-sm font-medium" style={{ color: '#334155' }}>
                        {opp.applications} applications
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="#64748B" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <span className="text-sm font-medium" style={{ color: '#334155' }}>
                        {opp.views} views
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 flex-wrap">
                <Link
                  href={`/pi-applications?opportunity=${opp.id}`}
                  className="px-4 py-2 rounded-lg text-sm font-bold transition hover:opacity-80"
                  style={{ backgroundColor: '#2563EB', color: '#FFFFFF' }}
                >
                  View Applications ({opp.applications})
                </Link>
                <Link
                  href={`/pi-opportunities/${opp.id}/edit`}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition hover:bg-gray-100"
                  style={{ border: '1px solid #E2E8F0', color: '#334155' }}
                >
                  Edit
                </Link>
                {(opp.status === 'active' || opp.status === 'closing-soon') && (
                  <button
                    onClick={() => handleClose(opp.id)}
                    className="px-4 py-2 rounded-lg text-sm font-medium transition hover:bg-gray-100"
                    style={{ border: '1px solid #E2E8F0', color: '#334155' }}
                  >
                    Close Position
                  </button>
                )}
                <button
                  onClick={() => handleDelete(opp.id)}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition hover:bg-red-50"
                  style={{ border: '1px solid #FEE2E2', color: '#DC2626' }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

          {filteredOpportunities.length === 0 && (
            <div className="bg-white rounded-xl shadow-sm border p-12 text-center" style={{ borderColor: '#E2E8F0' }}>
              <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="#94A3B8" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p className="text-lg font-semibold mb-2" style={{ color: '#0B2341' }}>
                No opportunities found
              </p>
              <p className="text-sm mb-6" style={{ color: '#64748B' }}>
                Try adjusting your filters or search query
              </p>
              <Link
                href="/pi-opportunities/new"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition hover:opacity-80"
                style={{ backgroundColor: '#2563EB', color: '#FFFFFF' }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Post Your First Opportunity
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
