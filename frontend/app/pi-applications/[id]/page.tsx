'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useParams } from 'next/navigation'

export default function ApplicationDetailPage() {
  const params = useParams()
  const applicationId = params.id

  const [status, setStatus] = useState('pending')

  // Mock PI data
  const piData = {
    name: "Dr. Jennifer Smith",
    lab: "Computational Neuroscience Lab",
    initials: "JS"
  }

  // Mock application data (in production, fetch based on applicationId)
  const application = {
    id: applicationId,
    studentName: "Jane Doe",
    studentEmail: "jane.doe@ucla.edu",
    studentPhone: "(310) 555-0123",
    positionId: 1,
    positionTitle: "Neural Network Modeling RA",
    gpa: "3.8",
    major: "Computer Science",
    minor: "Mathematics",
    year: "Junior",
    status: status,
    appliedDate: "2024-01-20",
    skills: ["Python", "TensorFlow", "MATLAB", "PyTorch", "Data Analysis", "Research Design"],
    availability: "15 hours/week",
    graduationDate: "June 2025",
    matchScore: 92,

    // Detailed information
    bio: "I am a junior majoring in Computer Science with a strong interest in computational neuroscience and machine learning. Through my coursework and previous research experiences, I have developed a solid foundation in neural network architectures and their applications to understanding brain function.",

    experience: [
      {
        title: "Undergraduate Research Assistant",
        organization: "UCLA Brain Mapping Center",
        duration: "Sept 2023 - Present",
        description: "Analyzing fMRI data using Python and contributing to research on visual cortex processing. Developed preprocessing pipelines and assisted with statistical analysis of neuroimaging data."
      },
      {
        title: "Software Engineering Intern",
        organization: "Tech Startup Inc.",
        duration: "Summer 2023",
        description: "Built machine learning models for predictive analytics. Implemented neural networks using TensorFlow and PyTorch for classification tasks."
      }
    ],

    coursework: [
      "CS 161: Fundamentals of Artificial Intelligence",
      "CS 188: Machine Learning",
      "MATH 142: Mathematical Modeling",
      "PSYCH 116: Cognitive Neuroscience",
      "CS 174A: Computer Graphics"
    ],

    statement: "I am writing to express my strong interest in the Neural Network Modeling Research Assistant position in your Computational Neuroscience Lab. Your recent work on understanding neural representations through deep learning models aligns perfectly with my academic interests and career goals.\n\nThrough my coursework in artificial intelligence and machine learning, I have developed a strong foundation in neural network architectures, including CNNs, RNNs, and transformers. In my current position at the UCLA Brain Mapping Center, I have been working with fMRI data to study visual cortex processing, which has given me hands-on experience with neuroimaging data analysis and statistical methods.\n\nI am particularly excited about your lab's approach to using computational models to understand biological neural networks. I believe my programming skills in Python and experience with TensorFlow and PyTorch would allow me to contribute meaningfully to your research projects. I am eager to learn more about brain-computer interfaces and neural decoding, areas where I see tremendous potential for impact.\n\nI am available to commit 15 hours per week to this position and can adjust my schedule to accommodate lab meetings and project deadlines. Thank you for considering my application.",

    resumeUrl: "/resumes/jane-doe-resume.pdf"
  }

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus)
    console.log(`Changed application status to ${newStatus}`)
  }

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
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Back Button */}
        <Link
          href="/pi-applications"
          className="inline-flex items-center gap-2 text-sm font-medium mb-6 hover:opacity-70 transition"
          style={{ color: '#2563EB' }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Applications
        </Link>

        {/* Header Card */}
        <div className="bg-white rounded-xl shadow-sm border p-8 mb-6" style={{ borderColor: '#E2E8F0' }}>
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start gap-6">
              {/* Avatar */}
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center font-bold text-3xl shrink-0"
                style={{ backgroundColor: '#2563EB', color: '#FFFFFF' }}
              >
                {application.studentName.split(' ').map(n => n[0]).join('')}
              </div>

              {/* Student Info */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <h1 className="text-3xl font-bold" style={{ color: '#0B2341', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                    {application.studentName}
                  </h1>
                  <span
                    className="px-3 py-1 rounded-full text-xs font-bold"
                    style={{
                      backgroundColor: `${getStatusColor(status)}20`,
                      color: getStatusColor(status)
                    }}
                  >
                    {getStatusLabel(status)}
                  </span>
                  <span
                    className="px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"
                    style={{
                      backgroundColor: application.matchScore >= 90 ? '#10B98120' : application.matchScore >= 80 ? '#3B82F620' : '#F59E0B20',
                      color: application.matchScore >= 90 ? '#10B981' : application.matchScore >= 80 ? '#3B82F6' : '#F59E0B'
                    }}
                  >
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    {application.matchScore}% Match
                  </span>
                </div>
                <p className="text-lg mb-2" style={{ color: '#334155' }}>
                  {application.major} {application.minor && `• Minor: ${application.minor}`} • {application.year}
                </p>
                <p className="text-sm mb-2" style={{ color: '#64748B' }}>
                  GPA: {application.gpa} • Graduating {application.graduationDate}
                </p>
                <div className="flex items-center gap-4 text-sm" style={{ color: '#64748B' }}>
                  <a href={`mailto:${application.studentEmail}`} className="flex items-center gap-1 hover:text-blue-600 transition">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {application.studentEmail}
                  </a>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {application.studentPhone}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Position Applied For */}
          <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: '#F1F5F9' }}>
            <p className="text-xs font-medium mb-1" style={{ color: '#64748B' }}>Applied for</p>
            <p className="text-lg font-bold" style={{ color: '#0B2341' }}>{application.positionTitle}</p>
            <p className="text-sm" style={{ color: '#64748B' }}>
              Applied on {new Date(application.appliedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} • Available {application.availability}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 flex-wrap">
            <Link
              href={`/pi-messages?student=${application.id}`}
              className="px-4 py-2 rounded-lg text-sm font-bold transition hover:opacity-80"
              style={{ backgroundColor: '#2563EB', color: '#FFFFFF' }}
            >
              Message Student
            </Link>
            <a
              href={application.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg text-sm font-medium transition hover:bg-gray-100 flex items-center gap-2"
              style={{ border: '1px solid #E2E8F0', color: '#334155' }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download Resume
            </a>

            {status === 'pending' && (
              <>
                <button
                  onClick={() => handleStatusChange('shortlisted')}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition hover:opacity-80"
                  style={{ backgroundColor: '#8B5CF620', color: '#8B5CF6', border: '1px solid #8B5CF6' }}
                >
                  Shortlist
                </button>
                <button
                  onClick={() => handleStatusChange('rejected')}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition hover:bg-red-50"
                  style={{ border: '1px solid #FEE2E2', color: '#DC2626' }}
                >
                  Reject
                </button>
              </>
            )}

            {status === 'shortlisted' && (
              <>
                <button
                  onClick={() => handleStatusChange('interviewed')}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition hover:opacity-80"
                  style={{ backgroundColor: '#3B82F620', color: '#3B82F6', border: '1px solid #3B82F6' }}
                >
                  Mark as Interviewed
                </button>
                <button
                  onClick={() => handleStatusChange('rejected')}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition hover:bg-red-50"
                  style={{ border: '1px solid #FEE2E2', color: '#DC2626' }}
                >
                  Reject
                </button>
              </>
            )}

            {status === 'interviewed' && (
              <>
                <button
                  onClick={() => handleStatusChange('accepted')}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition hover:opacity-80"
                  style={{ backgroundColor: '#10B98120', color: '#10B981', border: '1px solid #10B981' }}
                >
                  Accept
                </button>
                <button
                  onClick={() => handleStatusChange('rejected')}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition hover:bg-red-50"
                  style={{ border: '1px solid #FEE2E2', color: '#DC2626' }}
                >
                  Reject
                </button>
              </>
            )}
          </div>
        </div>

        {/* About */}
        <div className="bg-white rounded-xl shadow-sm border p-8 mb-6" style={{ borderColor: '#E2E8F0' }}>
          <h2 className="text-2xl font-bold mb-4" style={{ color: '#0B2341', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            About
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: '#334155' }}>
            {application.bio}
          </p>
        </div>

        {/* Skills */}
        <div className="bg-white rounded-xl shadow-sm border p-8 mb-6" style={{ borderColor: '#E2E8F0' }}>
          <h2 className="text-2xl font-bold mb-4" style={{ color: '#0B2341', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            Skills
          </h2>
          <div className="flex gap-2 flex-wrap">
            {application.skills.map((skill, idx) => (
              <span
                key={idx}
                className="px-4 py-2 rounded-lg text-sm font-medium"
                style={{ backgroundColor: '#F1F5F9', color: '#334155' }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Experience */}
        <div className="bg-white rounded-xl shadow-sm border p-8 mb-6" style={{ borderColor: '#E2E8F0' }}>
          <h2 className="text-2xl font-bold mb-6" style={{ color: '#0B2341', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            Experience
          </h2>
          <div className="space-y-6">
            {application.experience.map((exp, idx) => (
              <div key={idx}>
                <h3 className="text-lg font-bold mb-1" style={{ color: '#0B2341' }}>
                  {exp.title}
                </h3>
                <p className="text-sm font-medium mb-2" style={{ color: '#2563EB' }}>
                  {exp.organization}
                </p>
                <p className="text-xs mb-2" style={{ color: '#64748B' }}>
                  {exp.duration}
                </p>
                <p className="text-sm leading-relaxed" style={{ color: '#334155' }}>
                  {exp.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Relevant Coursework */}
        <div className="bg-white rounded-xl shadow-sm border p-8 mb-6" style={{ borderColor: '#E2E8F0' }}>
          <h2 className="text-2xl font-bold mb-4" style={{ color: '#0B2341', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            Relevant Coursework
          </h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {application.coursework.map((course, idx) => (
              <li key={idx} className="text-sm flex items-start gap-2" style={{ color: '#334155' }}>
                <span style={{ color: '#2563EB' }}>•</span>
                {course}
              </li>
            ))}
          </ul>
        </div>

        {/* Statement of Interest */}
        <div className="bg-white rounded-xl shadow-sm border p-8" style={{ borderColor: '#E2E8F0' }}>
          <h2 className="text-2xl font-bold mb-4" style={{ color: '#0B2341', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            Statement of Interest
          </h2>
          <div className="text-sm leading-relaxed whitespace-pre-line" style={{ color: '#334155' }}>
            {application.statement}
          </div>
        </div>

      </div>
    </div>
  )
}
