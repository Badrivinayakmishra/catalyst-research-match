'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function SignupPage() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    // Step 1: Account Info
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',

    // Step 2: UCLA Info
    studentId: '',
    major: '',
    year: '',
    gpa: '',
    resume: null as File | null,
    transcript: null as File | null,

    // Step 3: Skills & Interests
    skills: [] as string[],
    interests: [] as string[]
  })

  const availableSkills = [
    'Python', 'R', 'MATLAB', 'C++', 'Java', 'JavaScript',
    'Data Analysis', 'Machine Learning', 'Statistics',
    'Lab Techniques', 'Research Methods', 'SPSS',
    'CAD', 'Arduino', 'Circuit Design',
    'Molecular Biology', 'Cell Culture', 'Microscopy'
  ]

  const researchInterests = [
    'Neuroscience', 'Artificial Intelligence', 'Robotics',
    'Computational Biology', 'Psychology', 'Physics',
    'Environmental Science', 'Chemistry', 'Bioengineering',
    'Data Science', 'Social Science', 'Economics'
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value })
  }

  const toggleSkill = (skill: string) => {
    if (formData.skills.includes(skill)) {
      setFormData({ ...formData, skills: formData.skills.filter(s => s !== skill) })
    } else {
      setFormData({ ...formData, skills: [...formData.skills, skill] })
    }
  }

  const toggleInterest = (interest: string) => {
    if (formData.interests.includes(interest)) {
      setFormData({ ...formData, interests: formData.interests.filter(i => i !== interest) })
    } else {
      setFormData({ ...formData, interests: [...formData.interests, interest] })
    }
  }

  const handleFileUpload = (field: 'resume' | 'transcript', file: File | null) => {
    if (file && file.type !== 'application/pdf') {
      alert('Please upload PDF files only')
      return
    }
    setFormData({ ...formData, [field]: file })
  }

  const nextStep = () => {
    if (step < 3) setStep(step + 1)
  }

  const prevStep = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleSubmit = () => {
    console.log('Form submitted:', formData)
    // Would send to backend here
    alert('Account created! Welcome to Catalyst.')
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F9F7F2' }}>
      {/* Navigation */}
      <nav className="border-b backdrop-blur-sm bg-white/70" style={{ borderColor: '#E2E8F0' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold" style={{ color: '#0B2341', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              Catalyst
            </Link>
            <div className="flex items-center gap-3">
              <span className="text-sm" style={{ color: '#64748B' }}>Already have an account?</span>
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium hover:opacity-70 transition"
                style={{ color: '#2563EB' }}
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Header */}
        <div className="text-center mb-8">
          <h1
            className="text-4xl md:text-5xl font-bold mb-3"
            style={{
              color: '#0B2341',
              fontFamily: "'Fraunces', serif",
              letterSpacing: '-0.02em'
            }}
          >
            Join <span style={{ color: '#2563EB' }}>Catalyst</span>
          </h1>
          <p className="text-lg" style={{ color: '#64748B' }}>
            Start your research journey at UCLA
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="relative">
            {/* Circles and Labels */}
            <div className="flex justify-between items-start relative z-10">
              {/* Step 1 */}
              <div className="flex flex-col items-center">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm transition-colors mb-3"
                  style={{
                    backgroundColor: step >= 1 ? '#2563EB' : '#E2E8F0',
                    color: step >= 1 ? '#FFFFFF' : '#94A3B8'
                  }}
                >
                  1
                </div>
                <span className="text-xs font-medium" style={{ color: '#64748B' }}>
                  Account
                </span>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm transition-colors mb-3"
                  style={{
                    backgroundColor: step >= 2 ? '#2563EB' : '#E2E8F0',
                    color: step >= 2 ? '#FFFFFF' : '#94A3B8'
                  }}
                >
                  2
                </div>
                <span className="text-xs font-medium" style={{ color: '#64748B' }}>
                  UCLA Info
                </span>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm transition-colors mb-3"
                  style={{
                    backgroundColor: step >= 3 ? '#2563EB' : '#E2E8F0',
                    color: step >= 3 ? '#FFFFFF' : '#94A3B8'
                  }}
                >
                  3
                </div>
                <span className="text-xs font-medium" style={{ color: '#64748B' }}>
                  Skills
                </span>
              </div>
            </div>

            {/* Connector Lines (Behind Circles) */}
            <div className="absolute top-6 left-0 right-0 flex items-center px-6" style={{ zIndex: 0 }}>
              <div
                className="h-1 rounded transition-colors"
                style={{
                  backgroundColor: step > 1 ? '#2563EB' : '#E2E8F0',
                  width: 'calc(50% - 24px)'
                }}
              />
              <div style={{ width: '48px' }} />
              <div
                className="h-1 rounded transition-colors"
                style={{
                  backgroundColor: step > 2 ? '#2563EB' : '#E2E8F0',
                  width: 'calc(50% - 24px)'
                }}
              />
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl p-8 shadow-lg" style={{ border: '1px solid #E2E8F0' }}>

          {/* Step 1: Account Info */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-6" style={{ color: '#0B2341', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                Create Your Account
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#0B2341' }}>
                    First Name
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:border-blue-500 transition-colors"
                    style={{ borderColor: '#E2E8F0' }}
                    placeholder="Jane"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#0B2341' }}>
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:border-blue-500 transition-colors"
                    style={{ borderColor: '#E2E8F0' }}
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#0B2341' }}>
                  UCLA Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:border-blue-500 transition-colors"
                  style={{ borderColor: '#E2E8F0' }}
                  placeholder="jane.doe@ucla.edu"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#0B2341' }}>
                  Password
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:border-blue-500 transition-colors"
                  style={{ borderColor: '#E2E8F0' }}
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#0B2341' }}>
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:border-blue-500 transition-colors"
                  style={{ borderColor: '#E2E8F0' }}
                  placeholder="••••••••"
                />
              </div>
            </div>
          )}

          {/* Step 2: UCLA Info */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-6" style={{ color: '#0B2341', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                UCLA Information
              </h2>

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#0B2341' }}>
                  Student ID
                </label>
                <input
                  type="text"
                  value={formData.studentId}
                  onChange={(e) => handleInputChange('studentId', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:border-blue-500 transition-colors"
                  style={{ borderColor: '#E2E8F0' }}
                  placeholder="123456789"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#0B2341' }}>
                  Major
                </label>
                <input
                  type="text"
                  value={formData.major}
                  onChange={(e) => handleInputChange('major', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:border-blue-500 transition-colors"
                  style={{ borderColor: '#E2E8F0' }}
                  placeholder="Computer Science"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#0B2341' }}>
                    Year
                  </label>
                  <select
                    value={formData.year}
                    onChange={(e) => handleInputChange('year', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:border-blue-500 transition-colors"
                    style={{ borderColor: '#E2E8F0', color: '#0B2341' }}
                  >
                    <option value="">Select year</option>
                    <option value="Freshman">Freshman</option>
                    <option value="Sophomore">Sophomore</option>
                    <option value="Junior">Junior</option>
                    <option value="Senior">Senior</option>
                    <option value="Graduate">Graduate</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#0B2341' }}>
                    GPA
                  </label>
                  <input
                    type="text"
                    value={formData.gpa}
                    onChange={(e) => handleInputChange('gpa', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:border-blue-500 transition-colors"
                    style={{ borderColor: '#E2E8F0' }}
                    placeholder="3.8"
                  />
                </div>
              </div>

              {/* File Uploads */}
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#0B2341' }}>
                  Resume <span style={{ color: '#64748B', fontWeight: 'normal' }}>(PDF only)</span>
                </label>
                <div
                  className="border-2 border-dashed rounded-lg p-6 text-center transition-colors hover:border-blue-500"
                  style={{ borderColor: '#E2E8F0' }}
                >
                  <input
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={(e) => handleFileUpload('resume', e.target.files?.[0] || null)}
                    className="hidden"
                    id="resume-upload"
                  />
                  <label
                    htmlFor="resume-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <svg className="w-10 h-10 mb-2" fill="none" stroke="#64748B" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    {formData.resume ? (
                      <div>
                        <p className="text-sm font-semibold" style={{ color: '#2563EB' }}>
                          {formData.resume.name}
                        </p>
                        <p className="text-xs mt-1" style={{ color: '#64748B' }}>
                          Click to change
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm font-semibold" style={{ color: '#0B2341' }}>
                          Click to upload resume
                        </p>
                        <p className="text-xs mt-1" style={{ color: '#64748B' }}>
                          PDF files only
                        </p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#0B2341' }}>
                  Transcript <span style={{ color: '#64748B', fontWeight: 'normal' }}>(PDF only)</span>
                </label>
                <div
                  className="border-2 border-dashed rounded-lg p-6 text-center transition-colors hover:border-blue-500"
                  style={{ borderColor: '#E2E8F0' }}
                >
                  <input
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={(e) => handleFileUpload('transcript', e.target.files?.[0] || null)}
                    className="hidden"
                    id="transcript-upload"
                  />
                  <label
                    htmlFor="transcript-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <svg className="w-10 h-10 mb-2" fill="none" stroke="#64748B" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    {formData.transcript ? (
                      <div>
                        <p className="text-sm font-semibold" style={{ color: '#2563EB' }}>
                          {formData.transcript.name}
                        </p>
                        <p className="text-xs mt-1" style={{ color: '#64748B' }}>
                          Click to change
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm font-semibold" style={{ color: '#0B2341' }}>
                          Click to upload transcript
                        </p>
                        <p className="text-xs mt-1" style={{ color: '#64748B' }}>
                          PDF files only
                        </p>
                      </div>
                    )}
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Skills & Interests */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2" style={{ color: '#0B2341', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  Skills & Interests
                </h2>
                <p className="text-sm mb-6" style={{ color: '#64748B' }}>
                  Help labs find you by selecting your skills and research interests
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-3" style={{ color: '#0B2341' }}>
                  Technical Skills
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableSkills.map(skill => (
                    <button
                      key={skill}
                      onClick={() => toggleSkill(skill)}
                      className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      style={{
                        backgroundColor: formData.skills.includes(skill) ? '#2563EB' : 'rgba(37, 99, 235, 0.08)',
                        color: formData.skills.includes(skill) ? '#FFFFFF' : '#2563EB',
                        border: formData.skills.includes(skill) ? 'none' : '1px solid transparent'
                      }}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-3" style={{ color: '#0B2341' }}>
                  Research Interests
                </label>
                <div className="flex flex-wrap gap-2">
                  {researchInterests.map(interest => (
                    <button
                      key={interest}
                      onClick={() => toggleInterest(interest)}
                      className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      style={{
                        backgroundColor: formData.interests.includes(interest) ? '#2563EB' : 'rgba(37, 99, 235, 0.08)',
                        color: formData.interests.includes(interest) ? '#FFFFFF' : '#2563EB',
                        border: formData.interests.includes(interest) ? 'none' : '1px solid transparent'
                      }}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-4 mt-8">
            {step > 1 && (
              <button
                onClick={prevStep}
                className="px-6 py-3 rounded-lg font-bold transition hover:bg-gray-100"
                style={{ color: '#64748B', border: '1px solid #E2E8F0' }}
              >
                Back
              </button>
            )}

            {step < 3 ? (
              <button
                onClick={nextStep}
                className="flex-1 py-3 rounded-lg font-bold transition hover:opacity-80"
                style={{ background: '#2563EB', color: '#FFFFFF' }}
              >
                Continue
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="flex-1 py-3 rounded-lg font-bold transition hover:opacity-80"
                style={{ background: '#2563EB', color: '#FFFFFF' }}
              >
                Create Account
              </button>
            )}
          </div>

          {/* Terms */}
          {step === 3 && (
            <p className="text-xs text-center mt-6" style={{ color: '#94A3B8' }}>
              By creating an account, you agree to our{' '}
              <Link href="/terms" className="underline" style={{ color: '#2563EB' }}>
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="underline" style={{ color: '#2563EB' }}>
                Privacy Policy
              </Link>
            </p>
          )}
        </div>

      </div>
    </div>
  )
}
