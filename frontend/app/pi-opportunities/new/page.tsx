'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function PostNewOpportunityPage() {
  const router = useRouter()

  // Mock PI data
  const piData = {
    name: "Dr. Jennifer Smith",
    lab: "Computational Neuroscience Lab",
    initials: "JS"
  }

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    responsibilities: '',
    qualifications: '',
    hoursPerWeek: '',
    duration: '',
    compensation: 'Academic Credit',
    compensationAmount: '',
    positions: '1',
    deadline: '',
    startDate: '',
    requiredSkills: [] as string[],
    preferredSkills: [] as string[],
    researchArea: '',
    labLocation: '',
    remote: false
  })

  const [currentSkill, setCurrentSkill] = useState('')
  const [currentPreferredSkill, setCurrentPreferredSkill] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const addSkill = (type: 'required' | 'preferred') => {
    if (type === 'required' && currentSkill.trim()) {
      setFormData(prev => ({
        ...prev,
        requiredSkills: [...prev.requiredSkills, currentSkill.trim()]
      }))
      setCurrentSkill('')
    } else if (type === 'preferred' && currentPreferredSkill.trim()) {
      setFormData(prev => ({
        ...prev,
        preferredSkills: [...prev.preferredSkills, currentPreferredSkill.trim()]
      }))
      setCurrentPreferredSkill('')
    }
  }

  const removeSkill = (type: 'required' | 'preferred', index: number) => {
    if (type === 'required') {
      setFormData(prev => ({
        ...prev,
        requiredSkills: prev.requiredSkills.filter((_, i) => i !== index)
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        preferredSkills: prev.preferredSkills.filter((_, i) => i !== index)
      }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!formData.title || !formData.description || !formData.deadline) {
      console.error('Please fill in all required fields')
      return
    }

    // In production, send to backend
    console.log('Posting opportunity:', formData)
    router.push('/pi-opportunities')
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Back Button */}
        <Link
          href="/pi-opportunities"
          className="inline-flex items-center gap-2 text-sm font-medium mb-6 hover:opacity-70 transition"
          style={{ color: '#2563EB' }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Opportunities
        </Link>

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
            Post New Research Opportunity
          </h1>
          <p className="text-lg" style={{ color: '#64748B' }}>
            Create a new position listing for undergraduate researchers
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Basic Information */}
          <div className="bg-white rounded-xl shadow-sm border p-8" style={{ borderColor: '#E2E8F0' }}>
            <h2 className="text-2xl font-bold mb-6" style={{ color: '#0B2341', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              Basic Information
            </h2>

            {/* Position Title */}
            <div className="mb-6">
              <label className="block text-sm font-bold mb-2" style={{ color: '#0B2341' }}>
                Position Title <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Machine Learning Research Assistant"
                className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:border-blue-500 transition-colors"
                style={{ borderColor: '#E2E8F0', color: '#0B2341' }}
                required
              />
            </div>

            {/* Research Area */}
            <div className="mb-6">
              <label className="block text-sm font-bold mb-2" style={{ color: '#0B2341' }}>
                Research Area
              </label>
              <input
                type="text"
                name="researchArea"
                value={formData.researchArea}
                onChange={handleChange}
                placeholder="e.g., Computational Neuroscience, AI/ML, Data Science"
                className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:border-blue-500 transition-colors"
                style={{ borderColor: '#E2E8F0', color: '#0B2341' }}
              />
            </div>

            {/* Description */}
            <div className="mb-6">
              <label className="block text-sm font-bold mb-2" style={{ color: '#0B2341' }}>
                Position Description <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Provide a brief overview of the position and research focus..."
                rows={5}
                className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:border-blue-500 transition-colors"
                style={{ borderColor: '#E2E8F0', color: '#0B2341' }}
                required
              />
              <p className="text-xs mt-1" style={{ color: '#64748B' }}>
                Describe what the student will be working on and the lab's research focus
              </p>
            </div>

            {/* Responsibilities */}
            <div className="mb-6">
              <label className="block text-sm font-bold mb-2" style={{ color: '#0B2341' }}>
                Key Responsibilities
              </label>
              <textarea
                name="responsibilities"
                value={formData.responsibilities}
                onChange={handleChange}
                placeholder="• Analyze experimental data using Python&#10;• Assist with literature reviews&#10;• Attend weekly lab meetings"
                rows={5}
                className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:border-blue-500 transition-colors"
                style={{ borderColor: '#E2E8F0', color: '#0B2341' }}
              />
            </div>

            {/* Qualifications */}
            <div className="mb-6">
              <label className="block text-sm font-bold mb-2" style={{ color: '#0B2341' }}>
                Qualifications
              </label>
              <textarea
                name="qualifications"
                value={formData.qualifications}
                onChange={handleChange}
                placeholder="• Junior or Senior standing&#10;• GPA of 3.5 or higher&#10;• Strong analytical skills"
                rows={5}
                className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:border-blue-500 transition-colors"
                style={{ borderColor: '#E2E8F0', color: '#0B2341' }}
              />
            </div>
          </div>

          {/* Skills */}
          <div className="bg-white rounded-xl shadow-sm border p-8" style={{ borderColor: '#E2E8F0' }}>
            <h2 className="text-2xl font-bold mb-6" style={{ color: '#0B2341', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              Required Skills
            </h2>

            {/* Required Skills */}
            <div className="mb-6">
              <label className="block text-sm font-bold mb-2" style={{ color: '#0B2341' }}>
                Required Skills
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={currentSkill}
                  onChange={(e) => setCurrentSkill(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill('required'))}
                  placeholder="e.g., Python, MATLAB, Data Analysis"
                  className="flex-1 px-4 py-3 rounded-lg border focus:outline-none focus:border-blue-500 transition-colors"
                  style={{ borderColor: '#E2E8F0', color: '#0B2341' }}
                />
                <button
                  type="button"
                  onClick={() => addSkill('required')}
                  className="px-6 py-3 rounded-lg font-bold transition hover:opacity-80"
                  style={{ backgroundColor: '#2563EB', color: '#FFFFFF' }}
                >
                  Add
                </button>
              </div>
              <div className="flex gap-2 flex-wrap">
                {formData.requiredSkills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
                    style={{ backgroundColor: '#2563EB20', color: '#2563EB' }}
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill('required', idx)}
                      className="hover:opacity-70"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Preferred Skills */}
            <div>
              <label className="block text-sm font-bold mb-2" style={{ color: '#0B2341' }}>
                Preferred Skills (Optional)
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={currentPreferredSkill}
                  onChange={(e) => setCurrentPreferredSkill(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill('preferred'))}
                  placeholder="e.g., Machine Learning, Deep Learning"
                  className="flex-1 px-4 py-3 rounded-lg border focus:outline-none focus:border-blue-500 transition-colors"
                  style={{ borderColor: '#E2E8F0', color: '#0B2341' }}
                />
                <button
                  type="button"
                  onClick={() => addSkill('preferred')}
                  className="px-6 py-3 rounded-lg font-bold transition hover:opacity-80"
                  style={{ backgroundColor: '#2563EB', color: '#FFFFFF' }}
                >
                  Add
                </button>
              </div>
              <div className="flex gap-2 flex-wrap">
                {formData.preferredSkills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
                    style={{ backgroundColor: '#F1F5F9', color: '#334155' }}
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill('preferred', idx)}
                      className="hover:opacity-70"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Position Details */}
          <div className="bg-white rounded-xl shadow-sm border p-8" style={{ borderColor: '#E2E8F0' }}>
            <h2 className="text-2xl font-bold mb-6" style={{ color: '#0B2341', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              Position Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Hours Per Week */}
              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: '#0B2341' }}>
                  Hours Per Week
                </label>
                <input
                  type="text"
                  name="hoursPerWeek"
                  value={formData.hoursPerWeek}
                  onChange={handleChange}
                  placeholder="e.g., 10-15"
                  className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:border-blue-500 transition-colors"
                  style={{ borderColor: '#E2E8F0', color: '#0B2341' }}
                />
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: '#0B2341' }}>
                  Duration
                </label>
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="e.g., 1 Quarter, 1 Year"
                  className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:border-blue-500 transition-colors"
                  style={{ borderColor: '#E2E8F0', color: '#0B2341' }}
                />
              </div>

              {/* Number of Positions */}
              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: '#0B2341' }}>
                  Number of Positions
                </label>
                <input
                  type="number"
                  name="positions"
                  value={formData.positions}
                  onChange={handleChange}
                  min="1"
                  className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:border-blue-500 transition-colors"
                  style={{ borderColor: '#E2E8F0', color: '#0B2341' }}
                />
              </div>

              {/* Lab Location */}
              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: '#0B2341' }}>
                  Lab Location
                </label>
                <input
                  type="text"
                  name="labLocation"
                  value={formData.labLocation}
                  onChange={handleChange}
                  placeholder="e.g., Boelter Hall 3400"
                  className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:border-blue-500 transition-colors"
                  style={{ borderColor: '#E2E8F0', color: '#0B2341' }}
                />
              </div>

              {/* Start Date */}
              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: '#0B2341' }}>
                  Start Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:border-blue-500 transition-colors"
                  style={{ borderColor: '#E2E8F0', color: '#0B2341' }}
                />
              </div>

              {/* Application Deadline */}
              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: '#0B2341' }}>
                  Application Deadline <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:border-blue-500 transition-colors"
                  style={{ borderColor: '#E2E8F0', color: '#0B2341' }}
                  required
                />
              </div>
            </div>

            {/* Remote Option */}
            <div className="mt-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="remote"
                  checked={formData.remote}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-gray-300"
                  style={{ accentColor: '#2563EB' }}
                />
                <span className="text-sm font-medium" style={{ color: '#334155' }}>
                  Remote work possible
                </span>
              </label>
            </div>
          </div>

          {/* Compensation */}
          <div className="bg-white rounded-xl shadow-sm border p-8" style={{ borderColor: '#E2E8F0' }}>
            <h2 className="text-2xl font-bold mb-6" style={{ color: '#0B2341', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              Compensation
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Compensation Type */}
              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: '#0B2341' }}>
                  Compensation Type
                </label>
                <select
                  name="compensation"
                  value={formData.compensation}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:border-blue-500 transition-colors"
                  style={{ borderColor: '#E2E8F0', color: '#0B2341' }}
                >
                  <option value="Academic Credit">Academic Credit</option>
                  <option value="Hourly Wage">Hourly Wage</option>
                  <option value="Stipend">Stipend</option>
                  <option value="Volunteer">Volunteer</option>
                </select>
              </div>

              {/* Compensation Amount */}
              {(formData.compensation === 'Hourly Wage' || formData.compensation === 'Stipend') && (
                <div>
                  <label className="block text-sm font-bold mb-2" style={{ color: '#0B2341' }}>
                    Amount
                  </label>
                  <input
                    type="text"
                    name="compensationAmount"
                    value={formData.compensationAmount}
                    onChange={handleChange}
                    placeholder={formData.compensation === 'Hourly Wage' ? 'e.g., $18/hour' : 'e.g., $5000'}
                    className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:border-blue-500 transition-colors"
                    style={{ borderColor: '#E2E8F0', color: '#0B2341' }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-end">
            <Link
              href="/pi-opportunities"
              className="px-6 py-3 rounded-lg font-bold transition hover:bg-gray-100"
              style={{ border: '1px solid #E2E8F0', color: '#334155' }}
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="px-6 py-3 rounded-lg font-bold transition hover:opacity-80"
              style={{ backgroundColor: '#2563EB', color: '#FFFFFF' }}
            >
              Post Opportunity
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}
