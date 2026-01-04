'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ApplyPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    coverLetter: '',
    availability: '',
    startDate: '',
    additionalInfo: ''
  })

  // Mock lab data (would come from URL params or state)
  // This data would be uploaded by the PI from their side of the portal
  const lab = {
    name: "Dr. Smith's Lab",
    pi: "Dr. Jennifer Smith",
    department: "Neuroscience",
    positions: 3,
    timeCommitment: "10-15 hrs/week",
    paid: true,
    compensation: "$18/hour",
    location: "Gonda Building, Room 3357",

    // PI-uploaded content
    overview: "Our lab focuses on understanding the neural mechanisms underlying learning and memory. We use a combination of computational modeling, neuroimaging, and behavioral experiments to investigate how the brain processes and stores information. We are particularly interested in the role of sleep in memory consolidation and how neural plasticity changes across the lifespan.",

    researchAreas: [
      "Computational Neuroscience",
      "Memory Consolidation",
      "Neural Plasticity",
      "Sleep & Cognition"
    ],

    responsibilities: [
      "Assist with data collection and analysis using Python and MATLAB",
      "Conduct literature reviews on memory consolidation research",
      "Help prepare stimuli and experimental protocols",
      "Participate in weekly lab meetings and journal clubs",
      "Maintain detailed records of experimental procedures"
    ],

    qualifications: [
      "Strong programming skills (Python preferred)",
      "Background in neuroscience, psychology, or related field",
      "GPA of 3.5 or higher",
      "Ability to commit for at least 2 academic quarters",
      "Experience with data analysis (preferred but not required)"
    ],

    benefits: [
      "Co-authorship opportunities on publications",
      "Mentorship from graduate students and postdocs",
      "Training in advanced research methods",
      "Letter of recommendation for graduate school",
      "Flexible hours to accommodate class schedule"
    ],

    website: "https://neuroscience.ucla.edu/smith-lab",
    email: "jsmith@mednet.ucla.edu"
  }

  const getWordCount = (text: string) => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Application submitted:', formData)
    alert('Application submitted successfully!')
    router.push('/dashboard')
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
                href="/browse"
                className="text-sm font-medium hover:opacity-70 transition"
                style={{ color: '#334155' }}
              >
                Browse Labs
              </Link>
              <Link
                href="/dashboard"
                className="text-sm font-medium hover:opacity-70 transition"
                style={{ color: '#334155' }}
              >
                Dashboard
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

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

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
            Apply to <span style={{ color: '#2563EB' }}>{lab.name}</span>
          </h1>
          <p className="text-lg" style={{ color: '#64748B' }}>
            {lab.pi} • {lab.department}
          </p>
        </div>

        {/* Lab Information Section - PI Uploaded Content */}
        <div className="space-y-6 mb-8">

          {/* Quick Stats */}
          <div className="bg-white rounded-2xl p-6 border" style={{ borderColor: '#E2E8F0' }}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(37, 99, 235, 0.1)' }}>
                  <svg className="w-5 h-5" fill="none" stroke="#2563EB" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-medium" style={{ color: '#64748B' }}>Time</p>
                  <p className="text-sm font-bold" style={{ color: '#0B2341' }}>{lab.timeCommitment}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(37, 99, 235, 0.1)' }}>
                  <svg className="w-5 h-5" fill="none" stroke="#2563EB" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-medium" style={{ color: '#64748B' }}>Compensation</p>
                  <p className="text-sm font-bold" style={{ color: '#0B2341' }}>{lab.compensation}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(37, 99, 235, 0.1)' }}>
                  <svg className="w-5 h-5" fill="none" stroke="#2563EB" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-medium" style={{ color: '#64748B' }}>Location</p>
                  <p className="text-sm font-bold" style={{ color: '#0B2341' }}>{lab.location}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(37, 99, 235, 0.1)' }}>
                  <svg className="w-5 h-5" fill="none" stroke="#2563EB" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-medium" style={{ color: '#64748B' }}>Openings</p>
                  <p className="text-sm font-bold" style={{ color: '#0B2341' }}>{lab.positions} positions</p>
                </div>
              </div>
            </div>
          </div>

          {/* Lab Overview */}
          <div className="bg-white rounded-2xl p-8 border" style={{ borderColor: '#E2E8F0' }}>
            <h3 className="text-xl font-bold mb-4" style={{ color: '#0B2341', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              Lab Overview
            </h3>
            <p className="text-base leading-relaxed" style={{ color: '#334155' }}>
              {lab.overview}
            </p>

            {/* Research Areas */}
            <div className="mt-6">
              <h4 className="text-sm font-semibold mb-3" style={{ color: '#0B2341' }}>
                Research Areas
              </h4>
              <div className="flex flex-wrap gap-2">
                {lab.researchAreas.map((area, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 rounded-lg text-sm font-medium"
                    style={{ backgroundColor: 'rgba(37, 99, 235, 0.1)', color: '#2563EB' }}
                  >
                    {area}
                  </span>
                ))}
              </div>
            </div>

            {/* Contact Info */}
            <div className="mt-6 pt-6 border-t" style={{ borderColor: '#E2E8F0' }}>
              <div className="flex flex-wrap gap-6">
                <a
                  href={`mailto:${lab.email}`}
                  className="flex items-center gap-2 text-sm font-medium hover:opacity-70 transition"
                  style={{ color: '#2563EB' }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {lab.email}
                </a>
                <a
                  href={lab.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm font-medium hover:opacity-70 transition"
                  style={{ color: '#2563EB' }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                  Lab Website
                </a>
              </div>
            </div>
          </div>

          {/* Responsibilities & Qualifications */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Responsibilities */}
            <div className="bg-white rounded-2xl p-8 border" style={{ borderColor: '#E2E8F0' }}>
              <h3 className="text-xl font-bold mb-4" style={{ color: '#0B2341', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                Responsibilities
              </h3>
              <ul className="space-y-3">
                {lab.responsibilities.map((item, index) => (
                  <li key={index} className="flex gap-3">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5" style={{ backgroundColor: 'rgba(37, 99, 235, 0.1)' }}>
                      <svg className="w-3 h-3" fill="none" stroke="#2563EB" viewBox="0 0 24 24" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-sm" style={{ color: '#334155' }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Qualifications */}
            <div className="bg-white rounded-2xl p-8 border" style={{ borderColor: '#E2E8F0' }}>
              <h3 className="text-xl font-bold mb-4" style={{ color: '#0B2341', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                Qualifications
              </h3>
              <ul className="space-y-3">
                {lab.qualifications.map((item, index) => (
                  <li key={index} className="flex gap-3">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5" style={{ backgroundColor: 'rgba(37, 99, 235, 0.1)' }}>
                      <svg className="w-3 h-3" fill="none" stroke="#2563EB" viewBox="0 0 24 24" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-sm" style={{ color: '#334155' }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Benefits */}
          <div className="bg-white rounded-2xl p-8 border" style={{ borderColor: '#E2E8F0' }}>
            <h3 className="text-xl font-bold mb-4" style={{ color: '#0B2341', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              What You'll Gain
            </h3>
            <ul className="grid md:grid-cols-2 gap-3">
              {lab.benefits.map((item, index) => (
                <li key={index} className="flex gap-3">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
                    <svg className="w-3 h-3" fill="none" stroke="#10B981" viewBox="0 0 24 24" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm" style={{ color: '#334155' }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Application Form Divider */}
        <div className="mb-8">
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px" style={{ backgroundColor: '#E2E8F0' }}></div>
            <h2
              className="text-2xl font-bold"
              style={{
                color: '#0B2341',
                fontFamily: "'Fraunces', serif",
                letterSpacing: '-0.02em'
              }}
            >
              Your Application
            </h2>
            <div className="flex-1 h-px" style={{ backgroundColor: '#E2E8F0' }}></div>
          </div>
        </div>

        {/* Application Form */}
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Statement of Purpose / Cover Letter */}
          <div className="bg-white rounded-2xl p-8 border" style={{ borderColor: '#E2E8F0' }}>
            <h3 className="text-xl font-bold mb-2" style={{ color: '#0B2341', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              Statement of Purpose
            </h3>
            <p className="text-sm mb-4" style={{ color: '#64748B' }}>
              Tell the PI why you're interested in this position and what you can contribute (200 words max)
            </p>
            <textarea
              value={formData.coverLetter}
              onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
              required
              rows={8}
              className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:border-blue-500 transition-colors resize-none"
              style={{ borderColor: '#E2E8F0', color: '#0B2341' }}
              placeholder="Dear Dr. Smith,&#10;&#10;I am writing to express my interest in joining your computational neuroscience lab..."
            />
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs" style={{ color: getWordCount(formData.coverLetter) > 200 ? '#EF4444' : '#94A3B8' }}>
                {getWordCount(formData.coverLetter)} / 200 words
              </p>
              {getWordCount(formData.coverLetter) > 200 && (
                <p className="text-xs font-semibold" style={{ color: '#EF4444' }}>
                  Please reduce to 200 words or less
                </p>
              )}
            </div>
          </div>

          {/* Availability & Start Date */}
          <div className="bg-white rounded-2xl p-8 border" style={{ borderColor: '#E2E8F0' }}>
            <h3 className="text-xl font-bold mb-6" style={{ color: '#0B2341', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              Availability
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#0B2341' }}>
                  Hours per Week
                </label>
                <select
                  value={formData.availability}
                  onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:border-blue-500 transition-colors"
                  style={{ borderColor: '#E2E8F0', color: '#0B2341' }}
                >
                  <option value="">Select hours</option>
                  <option value="5-10">5-10 hours/week</option>
                  <option value="10-15">10-15 hours/week</option>
                  <option value="15-20">15-20 hours/week</option>
                  <option value="20+">20+ hours/week</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#0B2341' }}>
                  Preferred Start Date
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:border-blue-500 transition-colors"
                  style={{ borderColor: '#E2E8F0', color: '#0B2341' }}
                />
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-white rounded-2xl p-8 border" style={{ borderColor: '#E2E8F0' }}>
            <h3 className="text-xl font-bold mb-2" style={{ color: '#0B2341', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              Additional Information
            </h3>
            <p className="text-sm mb-4" style={{ color: '#64748B' }}>
              Anything else you'd like the PI to know? (Optional)
            </p>
            <textarea
              value={formData.additionalInfo}
              onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:border-blue-500 transition-colors resize-none"
              style={{ borderColor: '#E2E8F0', color: '#0B2341' }}
              placeholder="Previous research experience, relevant coursework, technical skills..."
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4">
            <Link
              href="/browse"
              className="px-8 py-4 rounded-lg font-bold transition hover:bg-gray-100 flex items-center justify-center"
              style={{ color: '#64748B', border: '1px solid #E2E8F0' }}
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="flex-1 py-4 rounded-lg font-bold text-lg transition hover:opacity-80"
              style={{ background: '#2563EB', color: '#FFFFFF' }}
            >
              Submit Application
            </button>
          </div>

          {/* Disclaimer */}
          <p className="text-xs text-center" style={{ color: '#94A3B8' }}>
            By submitting this application, you agree to share your information with the lab PI and research team.
          </p>

        </form>

      </div>
    </div>
  )
}
