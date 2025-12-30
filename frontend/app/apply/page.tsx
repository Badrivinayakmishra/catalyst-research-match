'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function ApplyPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const labId = searchParams.get('labId')

  // Personal Information
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')

  // Education
  const [school, setSchool] = useState('UCLA')
  const [major, setMajor] = useState('')
  const [gpa, setGpa] = useState('')
  const [graduationDate, setGraduationDate] = useState('')
  const [yearInSchool, setYearInSchool] = useState('')

  // Application Materials
  const [resume, setResume] = useState<File | null>(null)
  const [transcript, setTranscript] = useState<File | null>(null)
  const [statementOfInterest, setStatementOfInterest] = useState('')

  // Availability
  const [hoursPerWeek, setHoursPerWeek] = useState('')
  const [startDate, setStartDate] = useState('')
  const [availability, setAvailability] = useState<string[]>([])

  // Additional Information
  const [previousResearch, setPreviousResearch] = useState('')
  const [relevantCourses, setRelevantCourses] = useState('')
  const [skills, setSkills] = useState('')

  // References (optional)
  const [referenceName, setReferenceName] = useState('')
  const [referenceEmail, setReferenceEmail] = useState('')
  const [referenceRelationship, setReferenceRelationship] = useState('')

  // State
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

  const handleAvailabilityToggle = (day: string) => {
    setAvailability(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    )
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'resume' | 'transcript') => {
    if (e.target.files && e.target.files[0]) {
      if (type === 'resume') {
        setResume(e.target.files[0])
      } else {
        setTranscript(e.target.files[0])
      }
    }
  }

  const handleSubmit = async () => {
    setError('')
    setIsSubmitting(true)

    // Validation
    if (!firstName || !lastName || !email || !phone || !major || !gpa || !graduationDate) {
      setError('Please fill in all required fields')
      setIsSubmitting(false)
      return
    }

    if (!resume) {
      setError('Please upload your resume')
      setIsSubmitting(false)
      return
    }

    if (!statementOfInterest || statementOfInterest.length < 100) {
      setError('Statement of Interest must be at least 100 characters')
      setIsSubmitting(false)
      return
    }

    // TODO: Call backend API to submit application
    // For now, simulate success
    setTimeout(() => {
      // Redirect to browse with success message
      router.push('/browse?submitted=true')
    }, 1500)
  }

  return (
    <div
      style={{
        width: '100vw',
        minHeight: '100vh',
        backgroundColor: '#F8FAFC'
      }}
    >
      {/* Header */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #E2E8F0',
          padding: '20px 40px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          zIndex: 100
        }}
      >
        <h1
          style={{
            color: '#081028',
            fontFamily: '"Work Sans", sans-serif',
            fontSize: '20px',
            fontWeight: 600
          }}
        >
          Catalyst - Research Application
        </h1>
        <Link
          href="/browse"
          style={{
            color: '#64748B',
            fontFamily: '"Work Sans", sans-serif',
            fontSize: '14px',
            textDecoration: 'none'
          }}
        >
          ← Back to Browse
        </Link>
      </div>

      {/* Application Form */}
      <div
        style={{
          maxWidth: '800px',
          margin: '40px auto',
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          padding: '48px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}
      >
        <h2
          style={{
            color: '#081028',
            fontFamily: '"Work Sans", sans-serif',
            fontSize: '32px',
            fontWeight: 700,
            marginBottom: '8px'
          }}
        >
          Research Position Application
        </h2>
        <p
          style={{
            color: '#64748B',
            fontFamily: '"Work Sans", sans-serif',
            fontSize: '16px',
            marginBottom: '40px'
          }}
        >
          Please complete all required fields marked with *
        </p>

        {/* Personal Information Section */}
        <div style={{ marginBottom: '40px' }}>
          <h3
            style={{
              color: '#081028',
              fontFamily: '"Work Sans", sans-serif',
              fontSize: '20px',
              fontWeight: 600,
              marginBottom: '20px',
              paddingBottom: '8px',
              borderBottom: '2px solid #F97316'
            }}
          >
            Personal Information
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label style={labelStyle}>First Name *</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="John"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Last Name *</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Doe"
                style={inputStyle}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={labelStyle}>Email *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john.doe@ucla.edu"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Phone Number *</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(310) 555-0100"
                style={inputStyle}
              />
            </div>
          </div>
        </div>

        {/* Education Section */}
        <div style={{ marginBottom: '40px' }}>
          <h3
            style={{
              color: '#081028',
              fontFamily: '"Work Sans", sans-serif',
              fontSize: '20px',
              fontWeight: 600,
              marginBottom: '20px',
              paddingBottom: '8px',
              borderBottom: '2px solid #F97316'
            }}
          >
            Education
          </h3>

          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>School/University *</label>
            <input
              type="text"
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              placeholder="UCLA"
              style={inputStyle}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label style={labelStyle}>Major/Field of Study *</label>
              <input
                type="text"
                value={major}
                onChange={(e) => setMajor(e.target.value)}
                placeholder="Computer Science"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Year in School *</label>
              <select
                value={yearInSchool}
                onChange={(e) => setYearInSchool(e.target.value)}
                style={inputStyle}
              >
                <option value="">Select year</option>
                <option value="Freshman">Freshman</option>
                <option value="Sophomore">Sophomore</option>
                <option value="Junior">Junior</option>
                <option value="Senior">Senior</option>
                <option value="Graduate">Graduate Student</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={labelStyle}>GPA *</label>
              <input
                type="text"
                value={gpa}
                onChange={(e) => setGpa(e.target.value)}
                placeholder="3.85"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Expected Graduation Date *</label>
              <input
                type="month"
                value={graduationDate}
                onChange={(e) => setGraduationDate(e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>
        </div>

        {/* Application Materials Section */}
        <div style={{ marginBottom: '40px' }}>
          <h3
            style={{
              color: '#081028',
              fontFamily: '"Work Sans", sans-serif',
              fontSize: '20px',
              fontWeight: 600,
              marginBottom: '20px',
              paddingBottom: '8px',
              borderBottom: '2px solid #F97316'
            }}
          >
            Application Materials
          </h3>

          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Resume/CV *</label>
            <div style={fileUploadStyle}>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => handleFileChange(e, 'resume')}
                style={{ display: 'none' }}
                id="resume-upload"
              />
              <label htmlFor="resume-upload" style={fileUploadLabelStyle}>
                {resume ? resume.name : 'Choose file or drag here'}
              </label>
              <p style={{ fontSize: '12px', color: '#64748B', marginTop: '8px' }}>
                Accepted formats: PDF, DOC, DOCX (Max 5MB)
              </p>
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Transcript (Optional)</label>
            <div style={fileUploadStyle}>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => handleFileChange(e, 'transcript')}
                style={{ display: 'none' }}
                id="transcript-upload"
              />
              <label htmlFor="transcript-upload" style={fileUploadLabelStyle}>
                {transcript ? transcript.name : 'Choose file or drag here'}
              </label>
            </div>
          </div>

          <div>
            <label style={labelStyle}>Statement of Interest *</label>
            <p style={{ fontSize: '14px', color: '#64748B', marginBottom: '8px' }}>
              Tell us why you're interested in this research position and what you hope to learn (minimum 100 characters)
            </p>
            <textarea
              value={statementOfInterest}
              onChange={(e) => setStatementOfInterest(e.target.value)}
              placeholder="I am interested in this position because..."
              style={{
                ...inputStyle,
                minHeight: '150px',
                resize: 'vertical',
                fontFamily: '"Work Sans", sans-serif'
              }}
            />
            <p style={{ fontSize: '12px', color: '#64748B', marginTop: '4px', textAlign: 'right' }}>
              {statementOfInterest.length} characters
            </p>
          </div>
        </div>

        {/* Availability Section */}
        <div style={{ marginBottom: '40px' }}>
          <h3
            style={{
              color: '#081028',
              fontFamily: '"Work Sans", sans-serif',
              fontSize: '20px',
              fontWeight: 600,
              marginBottom: '20px',
              paddingBottom: '8px',
              borderBottom: '2px solid #F97316'
            }}
          >
            Availability
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label style={labelStyle}>Hours Per Week *</label>
              <select
                value={hoursPerWeek}
                onChange={(e) => setHoursPerWeek(e.target.value)}
                style={inputStyle}
              >
                <option value="">Select hours</option>
                <option value="5-10">5-10 hours</option>
                <option value="10-15">10-15 hours</option>
                <option value="15-20">15-20 hours</option>
                <option value="20+">20+ hours</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Start Date *</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Available Days *</label>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '8px' }}>
              {daysOfWeek.map(day => (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleAvailabilityToggle(day)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: `2px solid ${availability.includes(day) ? '#F97316' : '#E2E8F0'}`,
                    backgroundColor: availability.includes(day) ? '#FFF7ED' : '#FFFFFF',
                    color: availability.includes(day) ? '#F97316' : '#64748B',
                    fontFamily: '"Work Sans", sans-serif',
                    fontSize: '14px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Experience Section */}
        <div style={{ marginBottom: '40px' }}>
          <h3
            style={{
              color: '#081028',
              fontFamily: '"Work Sans", sans-serif',
              fontSize: '20px',
              fontWeight: 600,
              marginBottom: '20px',
              paddingBottom: '8px',
              borderBottom: '2px solid #F97316'
            }}
          >
            Experience & Skills
          </h3>

          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Previous Research Experience (Optional)</label>
            <textarea
              value={previousResearch}
              onChange={(e) => setPreviousResearch(e.target.value)}
              placeholder="Describe any previous research experience..."
              style={{
                ...inputStyle,
                minHeight: '100px',
                resize: 'vertical',
                fontFamily: '"Work Sans", sans-serif'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Relevant Coursework</label>
            <input
              type="text"
              value={relevantCourses}
              onChange={(e) => setRelevantCourses(e.target.value)}
              placeholder="e.g., Machine Learning, Data Structures, Statistics"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Skills & Technologies</label>
            <input
              type="text"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="e.g., Python, R, TensorFlow, Data Analysis"
              style={inputStyle}
            />
          </div>
        </div>

        {/* Reference Section */}
        <div style={{ marginBottom: '40px' }}>
          <h3
            style={{
              color: '#081028',
              fontFamily: '"Work Sans", sans-serif',
              fontSize: '20px',
              fontWeight: 600,
              marginBottom: '20px',
              paddingBottom: '8px',
              borderBottom: '2px solid #F97316'
            }}
          >
            Reference (Optional)
          </h3>

          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Reference Name</label>
            <input
              type="text"
              value={referenceName}
              onChange={(e) => setReferenceName(e.target.value)}
              placeholder="Dr. Jane Smith"
              style={inputStyle}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={labelStyle}>Reference Email</label>
              <input
                type="email"
                value={referenceEmail}
                onChange={(e) => setReferenceEmail(e.target.value)}
                placeholder="professor@ucla.edu"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Relationship</label>
              <input
                type="text"
                value={referenceRelationship}
                onChange={(e) => setReferenceRelationship(e.target.value)}
                placeholder="Professor, Advisor, etc."
                style={inputStyle}
              />
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div
            style={{
              padding: '16px',
              borderRadius: '8px',
              backgroundColor: '#FEE2E2',
              border: '1px solid #FCA5A5',
              marginBottom: '24px'
            }}
          >
            <p style={{ color: '#DC2626', fontSize: '14px', fontFamily: '"Work Sans", sans-serif' }}>
              {error}
            </p>
          </div>
        )}

        {/* Submit Button */}
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end' }}>
          <button
            onClick={() => router.push('/browse')}
            style={{
              padding: '14px 32px',
              borderRadius: '8px',
              backgroundColor: '#FFFFFF',
              color: '#64748B',
              fontFamily: '"Work Sans", sans-serif',
              fontSize: '16px',
              fontWeight: 600,
              border: '1px solid #E2E8F0',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            style={{
              padding: '14px 32px',
              borderRadius: '8px',
              backgroundColor: isSubmitting ? '#9CA3AF' : '#F97316',
              color: '#FFFFFF',
              fontFamily: '"Work Sans", sans-serif',
              fontSize: '16px',
              fontWeight: 600,
              border: 'none',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s'
            }}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Application'}
          </button>
        </div>
      </div>
    </div>
  )
}

const labelStyle: React.CSSProperties = {
  color: '#081028',
  fontFamily: '"Work Sans", sans-serif',
  fontSize: '14px',
  fontWeight: 600,
  display: 'block',
  marginBottom: '8px'
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px',
  borderRadius: '8px',
  border: '1px solid #E2E8F0',
  fontSize: '14px',
  fontFamily: '"Work Sans", sans-serif',
  outline: 'none',
  boxSizing: 'border-box'
}

const fileUploadStyle: React.CSSProperties = {
  borderRadius: '8px',
  border: '2px dashed #E2E8F0',
  padding: '24px',
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'border-color 0.2s'
}

const fileUploadLabelStyle: React.CSSProperties = {
  color: '#64748B',
  fontFamily: '"Work Sans", sans-serif',
  fontSize: '14px',
  cursor: 'pointer',
  display: 'block'
}
