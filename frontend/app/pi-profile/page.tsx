'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function PIProfilePage() {
  // Mock PI data
  const piData = {
    name: "Dr. Jennifer Smith",
    lab: "Computational Neuroscience Lab",
    initials: "JS"
  }

  // Form state
  const [formData, setFormData] = useState({
    // PI Information
    firstName: '',
    lastName: '',
    title: '',
    department: '',
    email: '',
    phone: '',
    officeLocation: '',

    // Lab Information
    labName: '',
    labBuilding: '',
    labRoom: '',
    labWebsite: '',

    // Research Information
    labDescription: '',
    researchAreas: [] as string[],

    // Social/Links
    googleScholar: '',
    personalWebsite: ''
  })

  const [currentResearchArea, setCurrentResearchArea] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const addResearchArea = () => {
    if (currentResearchArea.trim() && formData.researchAreas.length < 10) {
      setFormData(prev => ({
        ...prev,
        researchAreas: [...prev.researchAreas, currentResearchArea.trim()]
      }))
      setCurrentResearchArea('')
    }
  }

  const removeResearchArea = (index: number) => {
    setFormData(prev => ({
      ...prev,
      researchAreas: prev.researchAreas.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In production, send to backend
    console.log('Saving profile:', formData)
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
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center font-bold"
                style={{ backgroundColor: '#2563EB', color: '#FFFFFF' }}
              >
                {piData.initials}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

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
            Lab Profile Settings
          </h1>
          <p className="text-lg" style={{ color: '#64748B' }}>
            Manage your lab information and research profile
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* PI Information */}
          <div className="bg-white rounded-xl shadow-sm border p-8" style={{ borderColor: '#E2E8F0' }}>
            <h2 className="text-2xl font-bold mb-6" style={{ color: '#0B2341', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              Personal Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name */}
              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: '#0B2341' }}>
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:border-blue-500 transition-colors"
                  style={{ borderColor: '#E2E8F0', color: '#0B2341' }}
                />
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: '#0B2341' }}>
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:border-blue-500 transition-colors"
                  style={{ borderColor: '#E2E8F0', color: '#0B2341' }}
                />
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: '#0B2341' }}>
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Assistant Professor"
                  className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:border-blue-500 transition-colors"
                  style={{ borderColor: '#E2E8F0', color: '#0B2341' }}
                />
              </div>

              {/* Department */}
              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: '#0B2341' }}>
                  Department
                </label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:border-blue-500 transition-colors"
                  style={{ borderColor: '#E2E8F0', color: '#0B2341' }}
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: '#0B2341' }}>
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:border-blue-500 transition-colors"
                  style={{ borderColor: '#E2E8F0', color: '#0B2341' }}
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: '#0B2341' }}>
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:border-blue-500 transition-colors"
                  style={{ borderColor: '#E2E8F0', color: '#0B2341' }}
                />
              </div>

              {/* Office Location */}
              <div className="md:col-span-2">
                <label className="block text-sm font-bold mb-2" style={{ color: '#0B2341' }}>
                  Office Location
                </label>
                <input
                  type="text"
                  name="officeLocation"
                  value={formData.officeLocation}
                  onChange={handleChange}
                  placeholder="e.g., Boelter Hall 3551"
                  className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:border-blue-500 transition-colors"
                  style={{ borderColor: '#E2E8F0', color: '#0B2341' }}
                />
              </div>
            </div>
          </div>

          {/* Lab Information */}
          <div className="bg-white rounded-xl shadow-sm border p-8" style={{ borderColor: '#E2E8F0' }}>
            <h2 className="text-2xl font-bold mb-6" style={{ color: '#0B2341', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              Lab Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Lab Name */}
              <div className="md:col-span-2">
                <label className="block text-sm font-bold mb-2" style={{ color: '#0B2341' }}>
                  Lab Name
                </label>
                <input
                  type="text"
                  name="labName"
                  value={formData.labName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:border-blue-500 transition-colors"
                  style={{ borderColor: '#E2E8F0', color: '#0B2341' }}
                />
              </div>

              {/* Lab Building */}
              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: '#0B2341' }}>
                  Lab Building
                </label>
                <input
                  type="text"
                  name="labBuilding"
                  value={formData.labBuilding}
                  onChange={handleChange}
                  placeholder="e.g., Boelter Hall"
                  className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:border-blue-500 transition-colors"
                  style={{ borderColor: '#E2E8F0', color: '#0B2341' }}
                />
              </div>

              {/* Lab Room */}
              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: '#0B2341' }}>
                  Lab Room Number
                </label>
                <input
                  type="text"
                  name="labRoom"
                  value={formData.labRoom}
                  onChange={handleChange}
                  placeholder="e.g., 3400"
                  className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:border-blue-500 transition-colors"
                  style={{ borderColor: '#E2E8F0', color: '#0B2341' }}
                />
              </div>

              {/* Lab Website */}
              <div className="md:col-span-2">
                <label className="block text-sm font-bold mb-2" style={{ color: '#0B2341' }}>
                  Lab Website
                </label>
                <input
                  type="url"
                  name="labWebsite"
                  value={formData.labWebsite}
                  onChange={handleChange}
                  placeholder="https://yourlab.ucla.edu"
                  className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:border-blue-500 transition-colors"
                  style={{ borderColor: '#E2E8F0', color: '#0B2341' }}
                />
              </div>
            </div>
          </div>

          {/* Research Information */}
          <div className="bg-white rounded-xl shadow-sm border p-8" style={{ borderColor: '#E2E8F0' }}>
            <h2 className="text-2xl font-bold mb-6" style={{ color: '#0B2341', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              Research Information
            </h2>

            {/* Lab Description */}
            <div className="mb-6">
              <label className="block text-sm font-bold mb-2" style={{ color: '#0B2341' }}>
                Lab Description
              </label>
              <textarea
                name="labDescription"
                value={formData.labDescription}
                onChange={handleChange}
                rows={6}
                placeholder="Describe your lab's research focus, methodologies, and goals..."
                className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:border-blue-500 transition-colors"
                style={{ borderColor: '#E2E8F0', color: '#0B2341' }}
              />
              <p className="text-xs mt-1" style={{ color: '#64748B' }}>
                This will be visible to students browsing research opportunities
              </p>
            </div>

            {/* Research Areas */}
            <div>
              <label className="block text-sm font-bold mb-2" style={{ color: '#0B2341' }}>
                Research Areas
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={currentResearchArea}
                  onChange={(e) => setCurrentResearchArea(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addResearchArea())}
                  placeholder="e.g., Machine Learning, Neuroscience"
                  className="flex-1 px-4 py-3 rounded-lg border focus:outline-none focus:border-blue-500 transition-colors"
                  style={{ borderColor: '#E2E8F0', color: '#0B2341' }}
                />
                <button
                  type="button"
                  onClick={addResearchArea}
                  className="px-6 py-3 rounded-lg font-bold transition hover:opacity-80"
                  style={{ backgroundColor: '#2563EB', color: '#FFFFFF' }}
                >
                  Add
                </button>
              </div>
              <div className="flex gap-2 flex-wrap">
                {formData.researchAreas.map((area, idx) => (
                  <span
                    key={idx}
                    className="px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
                    style={{ backgroundColor: '#2563EB20', color: '#2563EB' }}
                  >
                    {area}
                    <button
                      type="button"
                      onClick={() => removeResearchArea(idx)}
                      className="hover:opacity-70 font-bold"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Links & Social */}
          <div className="bg-white rounded-xl shadow-sm border p-8" style={{ borderColor: '#E2E8F0' }}>
            <h2 className="text-2xl font-bold mb-6" style={{ color: '#0B2341', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              Links & Social Media
            </h2>

            <div className="space-y-4">
              {/* Google Scholar */}
              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: '#0B2341' }}>
                  Google Scholar Profile
                </label>
                <input
                  type="url"
                  name="googleScholar"
                  value={formData.googleScholar}
                  onChange={handleChange}
                  placeholder="https://scholar.google.com/citations?user=..."
                  className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:border-blue-500 transition-colors"
                  style={{ borderColor: '#E2E8F0', color: '#0B2341' }}
                />
              </div>

              {/* Personal Website */}
              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: '#0B2341' }}>
                  Personal Website
                </label>
                <input
                  type="url"
                  name="personalWebsite"
                  value={formData.personalWebsite}
                  onChange={handleChange}
                  placeholder="https://yourname.com"
                  className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:border-blue-500 transition-colors"
                  style={{ borderColor: '#E2E8F0', color: '#0B2341' }}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-end">
            <Link
              href="/pi-dashboard"
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
              Save Changes
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}
