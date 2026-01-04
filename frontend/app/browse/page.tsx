'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function BrowsePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('all')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedLab, setSelectedLab] = useState<any>(null)
  const [savedLabIds, setSavedLabIds] = useState<number[]>([])

  const toggleSave = (labId: number, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent card click
    setSavedLabIds(prev =>
      prev.includes(labId)
        ? prev.filter(id => id !== labId)
        : [...prev, labId]
    )
  }

  // Mock lab data
  const labs = [
    {
      id: 1,
      name: "Dr. Smith's Lab",
      pi: "Dr. Jennifer Smith",
      department: "Neuroscience",
      description: "Seeking undergraduate researchers for computational neuroscience lab focusing on neural network modeling and brain-computer interfaces.",
      positions: 3,
      paid: true,
      timeCommitment: "10-15 hrs/week",
      skills: ["Python", "MATLAB", "Data Analysis"],
      tags: ["Research", "AI/ML"]
    },
    {
      id: 2,
      name: "Computational Biology Lab",
      pi: "Dr. Michael Chen",
      department: "Life Sciences",
      description: "Looking for motivated students to work on genomic data analysis and protein structure prediction using machine learning.",
      positions: 2,
      paid: true,
      timeCommitment: "12-20 hrs/week",
      skills: ["Python", "R", "Bioinformatics"],
      tags: ["Research", "Data Science"]
    },
    {
      id: 3,
      name: "Robotics & AI Lab",
      pi: "Dr. Sarah Johnson",
      department: "Engineering",
      description: "Join our team working on autonomous systems and computer vision. Experience with ROS and deep learning frameworks preferred.",
      positions: 1,
      paid: true,
      timeCommitment: "15-20 hrs/week",
      skills: ["C++", "Python", "ROS", "TensorFlow"],
      tags: ["Engineering", "AI/ML"]
    },
    {
      id: 4,
      name: "Social Psychology Research",
      pi: "Dr. Amanda Rodriguez",
      department: "Psychology",
      description: "Research assistants needed for studies on social cognition and decision-making. No prior experience required.",
      positions: 4,
      paid: false,
      timeCommitment: "8-10 hrs/week",
      skills: ["SPSS", "Research Methods"],
      tags: ["Research", "Social Science"]
    },
    {
      id: 5,
      name: "Quantum Computing Lab",
      pi: "Dr. James Park",
      department: "Physics",
      description: "Explore quantum algorithms and quantum machine learning. Strong math background required.",
      positions: 2,
      paid: true,
      timeCommitment: "10-15 hrs/week",
      skills: ["Python", "Linear Algebra", "Quantum Mechanics"],
      tags: ["Research", "Physics"]
    },
    {
      id: 6,
      name: "Environmental Science Lab",
      pi: "Dr. Maria Garcia",
      department: "Life Sciences",
      description: "Field and lab work studying climate change impacts on coastal ecosystems. Weekend fieldwork required.",
      positions: 3,
      paid: false,
      timeCommitment: "10-12 hrs/week",
      skills: ["Field Work", "Data Collection", "GIS"],
      tags: ["Environmental", "Field Work"]
    }
  ]

  // Filter labs based on search and filters
  const filteredLabs = labs.filter(lab => {
    const matchesSearch = lab.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         lab.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         lab.department.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesDepartment = selectedDepartment === 'all' || lab.department === selectedDepartment
    const matchesType = selectedType === 'all' ||
                       (selectedType === 'paid' && lab.paid) ||
                       (selectedType === 'unpaid' && !lab.paid)

    return matchesSearch && matchesDepartment && matchesType
  })

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F9F7F2' }}>
      {/* Navigation */}
      <nav className="border-b backdrop-blur-sm bg-white/70 sticky top-0 z-50" style={{ borderColor: '#E2E8F0' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold" style={{ color: '#0B2341', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              Catalyst
            </Link>
            <div className="flex items-center gap-6">
              <Link
                href="/dashboard"
                className="text-sm font-medium hover:opacity-70 transition"
                style={{ color: '#334155' }}
              >
                Dashboard
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
                JD
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with Search */}
      <section className="border-b" style={{ borderColor: '#E2E8F0', backgroundColor: '#FFFFFF' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1
            className="text-5xl md:text-6xl font-bold mb-4"
            style={{
              fontFamily: "'Fraunces', serif",
              letterSpacing: '-0.02em'
            }}
          >
            <span className="text-3xl md:text-4xl" style={{ color: '#0B2341' }}>browse</span>{' '}
            <span style={{ color: '#2563EB' }}>Research Positions</span>
          </h1>
          <p className="text-xl mb-8" style={{ color: '#64748B' }}>
            Discover your next research opportunity at UCLA
          </p>

          {/* Search Bar */}
          <div className="relative max-w-2xl">
            <input
              type="text"
              placeholder="Search by lab name, department, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-4 rounded-xl text-lg border-2 focus:outline-none focus:border-blue-500 transition-colors"
              style={{
                borderColor: '#E2E8F0',
                color: '#0B2341'
              }}
            />
            <svg
              className="absolute right-6 top-1/2 -translate-y-1/2 w-6 h-6"
              fill="none"
              stroke="#64748B"
              viewBox="0 0 24 24"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </section>

      {/* Main Content: Filters + Lab Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row gap-8">

          {/* Sidebar Filters */}
          <aside className="md:w-64 shrink-0">
            <div className="sticky top-24 space-y-6">

              {/* Department Filter */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: '#64748B' }}>
                  Department
                </h3>
                <div className="space-y-2">
                  {['all', 'Neuroscience', 'Life Sciences', 'Engineering', 'Psychology', 'Physics'].map(dept => (
                    <button
                      key={dept}
                      onClick={() => setSelectedDepartment(dept)}
                      className="w-full text-left px-4 py-2 rounded-lg font-medium transition-colors"
                      style={{
                        backgroundColor: selectedDepartment === dept ? 'rgba(37, 99, 235, 0.1)' : 'transparent',
                        color: selectedDepartment === dept ? '#2563EB' : '#334155'
                      }}
                    >
                      {dept === 'all' ? 'All Departments' : dept}
                    </button>
                  ))}
                </div>
              </div>

              {/* Type Filter */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: '#64748B' }}>
                  Position Type
                </h3>
                <div className="space-y-2">
                  {[
                    { value: 'all', label: 'All Positions' },
                    { value: 'paid', label: 'Paid Only' },
                    { value: 'unpaid', label: 'Unpaid / Credit' }
                  ].map(type => (
                    <button
                      key={type.value}
                      onClick={() => setSelectedType(type.value)}
                      className="w-full text-left px-4 py-2 rounded-lg font-medium transition-colors"
                      style={{
                        backgroundColor: selectedType === type.value ? 'rgba(37, 99, 235, 0.1)' : 'transparent',
                        color: selectedType === type.value ? '#2563EB' : '#334155'
                      }}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Results Count */}
              <div className="pt-4 border-t" style={{ borderColor: '#E2E8F0' }}>
                <p className="text-sm font-medium" style={{ color: '#64748B' }}>
                  Showing <span style={{ color: '#2563EB', fontWeight: 'bold' }}>{filteredLabs.length}</span> positions
                </p>
              </div>

            </div>
          </aside>

          {/* Lab Cards Grid */}
          <main className="flex-1">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredLabs.map(lab => (
                <div
                  key={lab.id}
                  className="bg-white rounded-2xl p-6 border transition-all hover:-translate-y-2 hover:shadow-xl cursor-pointer"
                  style={{ borderColor: '#E2E8F0' }}
                >
                  {/* Lab Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold mb-1" style={{ color: '#0B2341', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                        {lab.name}
                      </h3>
                      <p className="text-sm font-medium" style={{ color: '#64748B' }}>
                        {lab.pi} • {lab.department}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className="px-3 py-1 rounded-full text-xs font-bold shrink-0"
                        style={{
                          backgroundColor: 'rgba(37, 99, 235, 0.1)',
                          color: '#2563EB'
                        }}
                      >
                        {lab.positions} Open
                      </span>
                      <button
                        onClick={(e) => toggleSave(lab.id, e)}
                        className="p-2 rounded-lg transition hover:bg-gray-100"
                        title={savedLabIds.includes(lab.id) ? "Remove from saved" : "Save for later"}
                      >
                        {savedLabIds.includes(lab.id) ? (
                          <svg className="w-5 h-5" fill="#2563EB" stroke="#2563EB" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="#64748B" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm mb-4 leading-relaxed" style={{ color: '#334155' }}>
                    {lab.description}
                  </p>

                  {/* Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-xs" style={{ color: '#64748B' }}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{lab.timeCommitment}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs" style={{ color: '#64748B' }}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{lab.paid ? 'Paid position' : 'Course credit available'}</span>
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {lab.skills.map(skill => (
                      <span
                        key={skill}
                        className="px-2 py-1 rounded text-xs font-medium"
                        style={{ backgroundColor: 'rgba(37, 99, 235, 0.08)', color: '#2563EB' }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* CTA */}
                  <button
                    onClick={() => setSelectedLab(lab)}
                    className="w-full py-3 rounded-lg font-bold text-sm transition hover:opacity-80"
                    style={{ background: '#2563EB', color: '#FFFFFF' }}
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>

            {/* No Results */}
            {filteredLabs.length === 0 && (
              <div className="text-center py-16">
                <p className="text-xl font-medium mb-2" style={{ color: '#64748B' }}>
                  No positions found
                </p>
                <p className="text-sm" style={{ color: '#94A3B8' }}>
                  Try adjusting your filters or search query
                </p>
              </div>
            )}
          </main>

        </div>
      </div>

      {/* Modal Popup */}
      {selectedLab && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedLab(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            style={{ border: '1px solid #E2E8F0' }}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b px-8 py-6 flex items-start justify-between" style={{ borderColor: '#E2E8F0' }}>
              <div className="flex-1">
                <h2
                  className="text-3xl font-bold mb-2"
                  style={{ color: '#0B2341', fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                >
                  {selectedLab.name}
                </h2>
                <p className="text-lg font-medium" style={{ color: '#64748B' }}>
                  {selectedLab.pi} • {selectedLab.department}
                </p>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={(e) => toggleSave(selectedLab.id, e)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title={savedLabIds.includes(selectedLab.id) ? "Remove from saved" : "Save for later"}
                >
                  {savedLabIds.includes(selectedLab.id) ? (
                    <svg className="w-6 h-6" fill="#2563EB" stroke="#2563EB" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6" fill="none" stroke="#64748B" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  )}
                </button>
                <button
                  onClick={() => setSelectedLab(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  style={{ color: '#64748B' }}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="px-8 py-6 space-y-6">

              {/* Open Positions Badge */}
              <div>
                <span
                  className="inline-block px-4 py-2 rounded-full text-sm font-bold"
                  style={{
                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                    color: '#2563EB'
                  }}
                >
                  {selectedLab.positions} Open Position{selectedLab.positions > 1 ? 's' : ''}
                </span>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-bold mb-3" style={{ color: '#0B2341', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  About This Position
                </h3>
                <p className="text-base leading-relaxed" style={{ color: '#334155' }}>
                  {selectedLab.description}
                </p>
              </div>

              {/* Position Details */}
              <div>
                <h3 className="text-lg font-bold mb-3" style={{ color: '#0B2341', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  Position Details
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(37, 99, 235, 0.1)' }}>
                      <svg className="w-5 h-5" fill="none" stroke="#2563EB" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium" style={{ color: '#64748B' }}>Time Commitment</p>
                      <p className="text-base font-semibold" style={{ color: '#0B2341' }}>{selectedLab.timeCommitment}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(37, 99, 235, 0.1)' }}>
                      <svg className="w-5 h-5" fill="none" stroke="#2563EB" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium" style={{ color: '#64748B' }}>Compensation</p>
                      <p className="text-base font-semibold" style={{ color: '#0B2341' }}>
                        {selectedLab.paid ? 'Paid Position' : 'Course Credit Available'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(37, 99, 235, 0.1)' }}>
                      <svg className="w-5 h-5" fill="none" stroke="#2563EB" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium" style={{ color: '#64748B' }}>Department</p>
                      <p className="text-base font-semibold" style={{ color: '#0B2341' }}>{selectedLab.department}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Required Skills */}
              <div>
                <h3 className="text-lg font-bold mb-3" style={{ color: '#0B2341', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  Required Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedLab.skills.map((skill: string) => (
                    <span
                      key={skill}
                      className="px-3 py-2 rounded-lg text-sm font-medium"
                      style={{ backgroundColor: 'rgba(37, 99, 235, 0.08)', color: '#2563EB' }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div>
                <h3 className="text-lg font-bold mb-3" style={{ color: '#0B2341', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  Research Areas
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedLab.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="px-3 py-2 rounded-lg text-sm font-medium border"
                      style={{ borderColor: '#E2E8F0', color: '#334155' }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white border-t px-8 py-6 flex gap-4" style={{ borderColor: '#E2E8F0' }}>
              <Link
                href="/apply"
                className="flex-1 py-4 rounded-xl font-bold text-lg transition hover:opacity-80 text-center"
                style={{ background: '#2563EB', color: '#FFFFFF' }}
              >
                Apply Now
              </Link>
              <button
                onClick={(e) => toggleSave(selectedLab.id, e)}
                className="px-6 py-4 rounded-xl font-bold text-lg transition flex items-center gap-2"
                style={{
                  backgroundColor: savedLabIds.includes(selectedLab.id) ? 'rgba(37, 99, 235, 0.1)' : '#FFFFFF',
                  color: savedLabIds.includes(selectedLab.id) ? '#2563EB' : '#64748B',
                  border: '1px solid #E2E8F0'
                }}
              >
                {savedLabIds.includes(selectedLab.id) ? (
                  <>
                    <svg className="w-5 h-5" fill="#2563EB" stroke="#2563EB" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                    Saved
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                    Save for Later
                  </>
                )}
              </button>
              <button
                onClick={() => setSelectedLab(null)}
                className="px-6 py-4 rounded-xl font-bold text-lg transition hover:bg-gray-100"
                style={{ color: '#64748B', border: '1px solid #E2E8F0' }}
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  )
}
