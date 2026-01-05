'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ProfilePage() {
  const router = useRouter()
  const [activeSection, setActiveSection] = useState<'personal' | 'academic' | 'documents' | 'skills' | 'password' | 'notifications'>('personal')
  const [loading, setLoading] = useState(true)

  // User data from backend
  const [personalInfo, setPersonalInfo] = useState({
    firstName: '',
    lastName: '',
    email: ''
  })

  const [academicInfo, setAcademicInfo] = useState({
    studentId: '',
    major: '',
    year: '',
    gpa: ''
  })

  const [documents, setDocuments] = useState({
    resume: { name: '', uploadedDate: '' },
    transcript: { name: '', uploadedDate: '' }
  })

  const [newResume, setNewResume] = useState<File | null>(null)
  const [newTranscript, setNewTranscript] = useState<File | null>(null)

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const [notifications, setNotifications] = useState({
    applicationUpdates: true,
    newMatches: true,
    messages: true,
    weeklyDigest: false,
    marketingEmails: false
  })

  // Skills from signup
  const allSkills = [
    'Python', 'R', 'MATLAB', 'Java', 'C++',
    'Data Analysis', 'Machine Learning', 'Statistics',
    'Lab Techniques', 'Research Methods', 'Writing',
    'Presentation', 'Teamwork', 'Leadership'
  ]

  const [selectedSkills, setSelectedSkills] = useState<string[]>([])

  const allInterests = [
    'Neuroscience', 'AI/ML', 'Biotechnology', 'Climate Change',
    'Public Health', 'Psychology', 'Physics', 'Chemistry',
    'Social Sciences', 'Engineering', 'Data Science', 'Robotics'
  ]

  const [selectedInterests, setSelectedInterests] = useState<string[]>([])

  // Fetch profile data on mount
  useEffect(() => {
    fetchProfileData()
  }, [])

  const fetchProfileData = async () => {
    try {
      const userId = localStorage.getItem('userId')
      if (!userId) {
        router.push('/login')
        return
      }

      const response = await fetch(`https://catalyst-research-match.onrender.com/api/student/profile?userId=${userId}`)
      const data = await response.json()

      if (response.ok && data.firstName) {
        setPersonalInfo({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          email: data.email || ''
        })

        setAcademicInfo({
          studentId: data.studentId || '',
          major: data.major || '',
          year: data.year || '',
          gpa: data.gpa?.toString() || ''
        })

        // Set skills and interests
        if (data.skills && data.skills.length > 0) {
          setSelectedSkills(data.skills)
        }
        if (data.interests && data.interests.length > 0) {
          setSelectedInterests(data.interests)
        }

        // Set documents if they exist
        if (data.resumeUrl) {
          setDocuments(prev => ({
            ...prev,
            resume: { name: data.resumeUrl.split('/').pop() || 'resume.pdf', uploadedDate: '' }
          }))
        }
        if (data.transcriptUrl) {
          setDocuments(prev => ({
            ...prev,
            transcript: { name: data.transcriptUrl.split('/').pop() || 'transcript.pdf', uploadedDate: '' }
          }))
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev =>
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    )
  }

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev =>
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    )
  }

  const handleFileUpload = (field: 'resume' | 'transcript', file: File | null) => {
    if (file && file.type !== 'application/pdf') {
      alert('Please upload PDF files only')
      return
    }
    if (field === 'resume') {
      setNewResume(file)
    } else {
      setNewTranscript(file)
    }
  }

  const handleSavePersonal = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const userId = localStorage.getItem('userId')
      if (!userId) return

      const response = await fetch('https://catalyst-research-match.onrender.com/api/student/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userId,
          firstName: personalInfo.firstName,
          lastName: personalInfo.lastName,
          email: personalInfo.email
        })
      })

      if (response.ok) {
        alert('Personal information updated!')
        fetchProfileData() // Refresh data
      } else {
        alert('Failed to update profile')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Error updating profile')
    }
  }

  const handleSaveAcademic = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const userId = localStorage.getItem('userId')
      if (!userId) {
        alert('Not logged in')
        return
      }

      const payload = {
        userId: userId,
        studentId: academicInfo.studentId,
        major: academicInfo.major,
        year: academicInfo.year,
        gpa: parseFloat(academicInfo.gpa) || 0
      }

      console.log('Sending academic update:', payload)

      const response = await fetch('https://catalyst-research-match.onrender.com/api/student/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await response.json()
      console.log('Response:', data)

      if (response.ok) {
        alert('Academic information updated!')
        fetchProfileData()
      } else {
        alert(`Failed to update: ${data.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error updating academic info:', error)
      alert(`Error updating academic info: ${error}`)
    }
  }

  const handleSaveDocuments = async (e: React.FormEvent) => {
    e.preventDefault()
    alert('Document upload feature coming soon!')
  }

  const handleSaveSkills = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const userId = localStorage.getItem('userId')
      if (!userId) return

      const response = await fetch('https://catalyst-research-match.onrender.com/api/student/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userId,
          skills: selectedSkills.join(','),
          interests: selectedInterests.join(',')
        })
      })

      if (response.ok) {
        alert('Skills and interests updated!')
        fetchProfileData()
      } else {
        alert('Failed to update skills')
      }
    } catch (error) {
      console.error('Error updating skills:', error)
      alert('Error updating skills')
    }
  }

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Passwords do not match!')
      return
    }
    alert('Password changed successfully!')
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
  }

  const handleSaveNotifications = (e: React.FormEvent) => {
    e.preventDefault()
    alert('Notification preferences updated!')
  }

  const sections = [
    { id: 'personal', label: 'Personal Info', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { id: 'academic', label: 'Academic Info', icon: 'M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z' },
    { id: 'documents', label: 'Documents', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { id: 'skills', label: 'Skills & Interests', icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' },
    { id: 'password', label: 'Password', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
    { id: 'notifications', label: 'Notifications', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' }
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
                href="/dashboard"
                className="text-sm font-medium hover:opacity-70 transition"
                style={{ color: '#334155' }}
              >
                Dashboard
              </Link>
              <Link
                href="/browse"
                className="text-sm font-medium hover:opacity-70 transition"
                style={{ color: '#334155' }}
              >
                Browse Labs
              </Link>
              <button
                onClick={() => {
                  localStorage.clear()
                  router.push('/login')
                }}
                className="text-sm font-medium hover:opacity-70 transition"
                style={{ color: '#334155' }}
              >
                Sign Out
              </button>
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold" style={{ backgroundColor: '#2563EB', color: '#FFFFFF' }}>
                {personalInfo.firstName && personalInfo.lastName ? `${personalInfo.firstName[0]}${personalInfo.lastName[0]}` : 'JD'}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Header */}
        <div className="mb-8">
          <h1
            className="text-4xl md:text-5xl font-bold mb-3"
            style={{
              color: '#0B2341',
              fontFamily: "'Fraunces', serif",
              letterSpacing: '-0.02em'
            }}
          >
            Profile <span style={{ color: '#2563EB' }}>Settings</span>
          </h1>
          <p className="text-lg" style={{ color: '#64748B' }}>
            Manage your account information and preferences
          </p>
        </div>

        <div className="flex gap-8">

          {/* Sidebar Navigation */}
          <aside className="w-64 shrink-0">
            <div className="bg-white rounded-2xl p-4 border sticky top-24" style={{ borderColor: '#E2E8F0' }}>
              <nav className="space-y-1">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id as any)}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left"
                    style={{
                      backgroundColor: activeSection === section.id ? 'rgba(37, 99, 235, 0.1)' : 'transparent',
                      color: activeSection === section.id ? '#2563EB' : '#64748B'
                    }}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={section.icon} />
                    </svg>
                    <span className="text-sm font-semibold">{section.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">

            {/* Personal Info Section */}
            {activeSection === 'personal' && (
              <div className="bg-white rounded-2xl p-8 border" style={{ borderColor: '#E2E8F0' }}>
                <h2 className="text-2xl font-bold mb-6" style={{ color: '#0B2341', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  Personal Information
                </h2>
                <form onSubmit={handleSavePersonal} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold mb-2" style={{ color: '#0B2341' }}>
                        First Name
                      </label>
                      <input
                        type="text"
                        value={personalInfo.firstName}
                        onChange={(e) => setPersonalInfo({ ...personalInfo, firstName: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:border-blue-500 transition-colors"
                        style={{ borderColor: '#E2E8F0', color: '#0B2341' }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2" style={{ color: '#0B2341' }}>
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={personalInfo.lastName}
                        onChange={(e) => setPersonalInfo({ ...personalInfo, lastName: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:border-blue-500 transition-colors"
                        style={{ borderColor: '#E2E8F0', color: '#0B2341' }}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: '#0B2341' }}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={personalInfo.email}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:border-blue-500 transition-colors"
                      style={{ borderColor: '#E2E8F0', color: '#0B2341' }}
                    />
                    <p className="text-xs mt-1" style={{ color: '#94A3B8' }}>
                      Use your UCLA email address
                    </p>
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-lg font-bold transition hover:opacity-80"
                    style={{ backgroundColor: '#2563EB', color: '#FFFFFF' }}
                  >
                    Save Changes
                  </button>
                </form>
              </div>
            )}

            {/* Academic Info Section */}
            {activeSection === 'academic' && (
              <div className="bg-white rounded-2xl p-8 border" style={{ borderColor: '#E2E8F0' }}>
                <h2 className="text-2xl font-bold mb-6" style={{ color: '#0B2341', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  Academic Information
                </h2>
                <form onSubmit={handleSaveAcademic} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: '#0B2341' }}>
                      Student ID
                    </label>
                    <input
                      type="text"
                      value={academicInfo.studentId}
                      onChange={(e) => setAcademicInfo({ ...academicInfo, studentId: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:border-blue-500 transition-colors"
                      style={{ borderColor: '#E2E8F0', color: '#0B2341' }}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold mb-2" style={{ color: '#0B2341' }}>
                        Major
                      </label>
                      <input
                        type="text"
                        value={academicInfo.major}
                        onChange={(e) => setAcademicInfo({ ...academicInfo, major: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:border-blue-500 transition-colors"
                        style={{ borderColor: '#E2E8F0', color: '#0B2341' }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2" style={{ color: '#0B2341' }}>
                        Year
                      </label>
                      <select
                        value={academicInfo.year}
                        onChange={(e) => setAcademicInfo({ ...academicInfo, year: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:border-blue-500 transition-colors"
                        style={{ borderColor: '#E2E8F0', color: '#0B2341' }}
                      >
                        <option value="Freshman">Freshman</option>
                        <option value="Sophomore">Sophomore</option>
                        <option value="Junior">Junior</option>
                        <option value="Senior">Senior</option>
                        <option value="Graduate">Graduate</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: '#0B2341' }}>
                      GPA
                    </label>
                    <input
                      type="text"
                      value={academicInfo.gpa}
                      onChange={(e) => setAcademicInfo({ ...academicInfo, gpa: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:border-blue-500 transition-colors"
                      style={{ borderColor: '#E2E8F0', color: '#0B2341' }}
                      placeholder="3.85"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-lg font-bold transition hover:opacity-80"
                    style={{ backgroundColor: '#2563EB', color: '#FFFFFF' }}
                  >
                    Save Changes
                  </button>
                </form>
              </div>
            )}

            {/* Documents Section */}
            {activeSection === 'documents' && (
              <div className="bg-white rounded-2xl p-8 border" style={{ borderColor: '#E2E8F0' }}>
                <h2 className="text-2xl font-bold mb-6" style={{ color: '#0B2341', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  Documents
                </h2>
                <form onSubmit={handleSaveDocuments} className="space-y-6">

                  {/* Current Resume */}
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: '#0B2341' }}>
                      Resume
                    </label>
                    <div className="bg-gray-50 rounded-lg p-4 mb-3" style={{ borderColor: '#E2E8F0', border: '1px solid #E2E8F0' }}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <svg className="w-8 h-8" fill="none" stroke="#2563EB" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <div>
                            <p className="text-sm font-semibold" style={{ color: '#0B2341' }}>{documents.resume.name}</p>
                            <p className="text-xs" style={{ color: '#64748B' }}>Uploaded {documents.resume.uploadedDate}</p>
                          </div>
                        </div>
                        <a
                          href="#"
                          className="text-sm font-semibold hover:underline"
                          style={{ color: '#2563EB' }}
                        >
                          View
                        </a>
                      </div>
                    </div>
                    <div className="border-2 border-dashed rounded-lg p-6 text-center transition-colors hover:border-blue-500" style={{ borderColor: '#E2E8F0' }}>
                      <input
                        type="file"
                        accept=".pdf,application/pdf"
                        onChange={(e) => handleFileUpload('resume', e.target.files?.[0] || null)}
                        className="hidden"
                        id="new-resume"
                      />
                      <label htmlFor="new-resume" className="cursor-pointer">
                        <svg className="w-10 h-10 mx-auto mb-2" fill="none" stroke="#64748B" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        {newResume ? (
                          <div>
                            <p className="text-sm font-semibold" style={{ color: '#2563EB' }}>{newResume.name}</p>
                            <p className="text-xs mt-1" style={{ color: '#64748B' }}>Click to change</p>
                          </div>
                        ) : (
                          <div>
                            <p className="text-sm font-semibold" style={{ color: '#0B2341' }}>Upload New Resume</p>
                            <p className="text-xs mt-1" style={{ color: '#64748B' }}>PDF only, max 5MB</p>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>

                  {/* Current Transcript */}
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: '#0B2341' }}>
                      Transcript
                    </label>
                    <div className="bg-gray-50 rounded-lg p-4 mb-3" style={{ borderColor: '#E2E8F0', border: '1px solid #E2E8F0' }}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <svg className="w-8 h-8" fill="none" stroke="#2563EB" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <div>
                            <p className="text-sm font-semibold" style={{ color: '#0B2341' }}>{documents.transcript.name}</p>
                            <p className="text-xs" style={{ color: '#64748B' }}>Uploaded {documents.transcript.uploadedDate}</p>
                          </div>
                        </div>
                        <a
                          href="#"
                          className="text-sm font-semibold hover:underline"
                          style={{ color: '#2563EB' }}
                        >
                          View
                        </a>
                      </div>
                    </div>
                    <div className="border-2 border-dashed rounded-lg p-6 text-center transition-colors hover:border-blue-500" style={{ borderColor: '#E2E8F0' }}>
                      <input
                        type="file"
                        accept=".pdf,application/pdf"
                        onChange={(e) => handleFileUpload('transcript', e.target.files?.[0] || null)}
                        className="hidden"
                        id="new-transcript"
                      />
                      <label htmlFor="new-transcript" className="cursor-pointer">
                        <svg className="w-10 h-10 mx-auto mb-2" fill="none" stroke="#64748B" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        {newTranscript ? (
                          <div>
                            <p className="text-sm font-semibold" style={{ color: '#2563EB' }}>{newTranscript.name}</p>
                            <p className="text-xs mt-1" style={{ color: '#64748B' }}>Click to change</p>
                          </div>
                        ) : (
                          <div>
                            <p className="text-sm font-semibold" style={{ color: '#0B2341' }}>Upload New Transcript</p>
                            <p className="text-xs mt-1" style={{ color: '#64748B' }}>PDF only, max 5MB</p>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-3 rounded-lg font-bold transition hover:opacity-80"
                    style={{ backgroundColor: '#2563EB', color: '#FFFFFF' }}
                  >
                    Save Changes
                  </button>
                </form>
              </div>
            )}

            {/* Skills & Interests Section */}
            {activeSection === 'skills' && (
              <div className="bg-white rounded-2xl p-8 border" style={{ borderColor: '#E2E8F0' }}>
                <h2 className="text-2xl font-bold mb-6" style={{ color: '#0B2341', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  Skills & Research Interests
                </h2>
                <form onSubmit={handleSaveSkills} className="space-y-8">

                  {/* Skills */}
                  <div>
                    <label className="block text-sm font-semibold mb-3" style={{ color: '#0B2341' }}>
                      Your Skills
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {allSkills.map((skill) => (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => toggleSkill(skill)}
                          className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                          style={{
                            backgroundColor: selectedSkills.includes(skill) ? '#2563EB' : '#FFFFFF',
                            color: selectedSkills.includes(skill) ? '#FFFFFF' : '#64748B',
                            border: `2px solid ${selectedSkills.includes(skill) ? '#2563EB' : '#E2E8F0'}`
                          }}
                        >
                          {skill}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs mt-2" style={{ color: '#94A3B8' }}>
                      Selected: {selectedSkills.length} skills
                    </p>
                  </div>

                  {/* Research Interests */}
                  <div>
                    <label className="block text-sm font-semibold mb-3" style={{ color: '#0B2341' }}>
                      Research Interests
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {allInterests.map((interest) => (
                        <button
                          key={interest}
                          type="button"
                          onClick={() => toggleInterest(interest)}
                          className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                          style={{
                            backgroundColor: selectedInterests.includes(interest) ? '#2563EB' : '#FFFFFF',
                            color: selectedInterests.includes(interest) ? '#FFFFFF' : '#64748B',
                            border: `2px solid ${selectedInterests.includes(interest) ? '#2563EB' : '#E2E8F0'}`
                          }}
                        >
                          {interest}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs mt-2" style={{ color: '#94A3B8' }}>
                      Selected: {selectedInterests.length} interests
                    </p>
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-3 rounded-lg font-bold transition hover:opacity-80"
                    style={{ backgroundColor: '#2563EB', color: '#FFFFFF' }}
                  >
                    Save Changes
                  </button>
                </form>
              </div>
            )}

            {/* Password Section */}
            {activeSection === 'password' && (
              <div className="bg-white rounded-2xl p-8 border" style={{ borderColor: '#E2E8F0' }}>
                <h2 className="text-2xl font-bold mb-6" style={{ color: '#0B2341', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  Change Password
                </h2>
                <form onSubmit={handleChangePassword} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: '#0B2341' }}>
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      required
                      className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:border-blue-500 transition-colors"
                      style={{ borderColor: '#E2E8F0', color: '#0B2341' }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: '#0B2341' }}>
                      New Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      required
                      className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:border-blue-500 transition-colors"
                      style={{ borderColor: '#E2E8F0', color: '#0B2341' }}
                    />
                    <p className="text-xs mt-1" style={{ color: '#94A3B8' }}>
                      Must be at least 8 characters
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: '#0B2341' }}>
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      required
                      className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:border-blue-500 transition-colors"
                      style={{ borderColor: '#E2E8F0', color: '#0B2341' }}
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-lg font-bold transition hover:opacity-80"
                    style={{ backgroundColor: '#2563EB', color: '#FFFFFF' }}
                  >
                    Change Password
                  </button>
                </form>
              </div>
            )}

            {/* Notifications Section */}
            {activeSection === 'notifications' && (
              <div className="bg-white rounded-2xl p-8 border" style={{ borderColor: '#E2E8F0' }}>
                <h2 className="text-2xl font-bold mb-6" style={{ color: '#0B2341', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  Email Notifications
                </h2>
                <form onSubmit={handleSaveNotifications} className="space-y-6">

                  {/* Application Updates */}
                  <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: '#F9F7F2' }}>
                    <div>
                      <p className="text-sm font-semibold mb-1" style={{ color: '#0B2341' }}>Application Updates</p>
                      <p className="text-xs" style={{ color: '#64748B' }}>Get notified when your application status changes</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifications.applicationUpdates}
                        onChange={(e) => setNotifications({ ...notifications, applicationUpdates: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  {/* New Matches */}
                  <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: '#F9F7F2' }}>
                    <div>
                      <p className="text-sm font-semibold mb-1" style={{ color: '#0B2341' }}>New Lab Matches</p>
                      <p className="text-xs" style={{ color: '#64748B' }}>Receive alerts when new labs match your profile</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifications.newMatches}
                        onChange={(e) => setNotifications({ ...notifications, newMatches: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  {/* Messages */}
                  <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: '#F9F7F2' }}>
                    <div>
                      <p className="text-sm font-semibold mb-1" style={{ color: '#0B2341' }}>Messages</p>
                      <p className="text-xs" style={{ color: '#64748B' }}>Get notified when PIs send you messages</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifications.messages}
                        onChange={(e) => setNotifications({ ...notifications, messages: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  {/* Weekly Digest */}
                  <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: '#F9F7F2' }}>
                    <div>
                      <p className="text-sm font-semibold mb-1" style={{ color: '#0B2341' }}>Weekly Digest</p>
                      <p className="text-xs" style={{ color: '#64748B' }}>Summary of new opportunities every week</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifications.weeklyDigest}
                        onChange={(e) => setNotifications({ ...notifications, weeklyDigest: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  {/* Marketing Emails */}
                  <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: '#F9F7F2' }}>
                    <div>
                      <p className="text-sm font-semibold mb-1" style={{ color: '#0B2341' }}>Platform Updates</p>
                      <p className="text-xs" style={{ color: '#64748B' }}>News about new features and improvements</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifications.marketingEmails}
                        onChange={(e) => setNotifications({ ...notifications, marketingEmails: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-3 rounded-lg font-bold transition hover:opacity-80"
                    style={{ backgroundColor: '#2563EB', color: '#FFFFFF' }}
                  >
                    Save Preferences
                  </button>
                </form>
              </div>
            )}

          </main>
        </div>
      </div>
    </div>
  )
}
