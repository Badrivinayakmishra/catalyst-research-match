'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()
  const [userType, setUserType] = useState<'students' | 'labs'>('students')

  // Check if user is already logged in
  useEffect(() => {
    const userId = localStorage.getItem('userId')
    const userType = localStorage.getItem('userType')

    if (userId && userType) {
      // Redirect to appropriate dashboard
      if (userType === 'pi') {
        router.push('/pi-dashboard')
      } else {
        router.push('/dashboard')
      }
    }
  }, [])

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F9F7F2', color: '#0B2341', fontFamily: 'Inter, sans-serif' }}>
      {/* Navigation */}
      <nav className="border-b backdrop-blur-sm bg-white/70 relative z-50" style={{ borderColor: '#E2E8F0' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <Link href="/" className="text-2xl font-bold" style={{ color: '#0B2341', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                Catalyst
              </Link>
              <Link
                href="/about"
                className="text-sm font-medium hover:opacity-70 transition"
                style={{ color: '#334155' }}
              >
                About
              </Link>
            </div>
            <div className="flex gap-3">
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium hover:opacity-70 transition"
                style={{ color: '#334155' }}
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 text-sm font-semibold rounded-lg transition shadow-md hover:shadow-lg"
                style={{
                  background: '#2563EB',
                  color: '#FFFFFF'
                }}
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* HERO SECTION - Split-Vis Layout */}
      <section className="relative max-w-7xl mx-auto px-6 py-24 lg:py-32 grid lg:grid-cols-2 gap-12 items-center">
        {/* Left: Text Content */}
        <div className="relative z-10 text-left">
          {/* User Type Toggle */}
          <div className="inline-flex rounded-lg p-1 mb-6 backdrop-blur-md" style={{ backgroundColor: 'rgba(37, 99, 235, 0.08)', border: '1px solid rgba(37, 99, 235, 0.15)' }}>
            <button
              onClick={() => setUserType('students')}
              className="px-6 py-2 rounded-md text-sm font-semibold transition-all"
              style={{
                background: userType === 'students' ? '#2563EB' : 'transparent',
                color: userType === 'students' ? '#FFFFFF' : '#2563EB',
              }}
            >
              For Students
            </button>
            <button
              onClick={() => setUserType('labs')}
              className="px-6 py-2 rounded-md text-sm font-semibold transition-all"
              style={{
                background: userType === 'labs' ? '#2563EB' : 'transparent',
                color: userType === 'labs' ? '#FFFFFF' : '#2563EB',
              }}
            >
              For Professors
            </button>
          </div>

          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-6 ml-4" style={{ backgroundColor: 'rgba(37, 99, 235, 0.05)', border: '1px solid rgba(37, 99, 235, 0.1)', color: '#2563EB' }}>
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#2563EB' }}></span>
            <span className="text-xs font-bold uppercase tracking-wider">Now open for Winter 2026</span>
          </div>

          {/* Dynamic Headline with Gradient */}
          {userType === 'students' ? (
            <h1
              className="text-6xl lg:text-8xl font-bold mb-6"
              style={{
                color: '#0B2341',
                lineHeight: '0.95',
                fontFamily: "'Fraunces', serif",
                letterSpacing: '-0.04em',
                fontVariationSettings: '"SOFT" 100, "WONK" 1'
              }}
            >
              Research<br />
              <span
                className="text-transparent bg-clip-text"
                style={{
                  backgroundImage: 'linear-gradient(to right, #2563EB, #4F46E5)'
                }}
              >
                starts here.
              </span>
            </h1>
          ) : (
            <h1
              className="text-6xl lg:text-8xl font-bold mb-6"
              style={{
                color: '#0B2341',
                lineHeight: '0.95',
                fontFamily: "'Fraunces', serif",
                letterSpacing: '-0.04em',
                fontVariationSettings: '"SOFT" 100, "WONK" 1'
              }}
            >
              Find your next<br />
              <span
                className="text-transparent bg-clip-text"
                style={{
                  backgroundImage: 'linear-gradient(to right, #2563EB, #4F46E5)'
                }}
              >
                undergrad researcher.
              </span>
            </h1>
          )}

          {/* Dynamic Subheadline */}
          <p className="text-xl mb-8 max-w-lg leading-relaxed" style={{ color: '#64748B' }}>
            {userType === 'students'
              ? 'Connect with UCLA research labs and discover positions that match your interests.'
              : 'Post positions, review applicants, and connect with UCLA students interested in your lab.'}
          </p>

          {/* Dynamic CTAs */}
          <div className="flex gap-4">
            <Link
              href={userType === 'students' ? '/browse' : '/pi-signup'}
              className="px-8 py-4 rounded-xl font-bold text-lg transition-all hover:-translate-y-1"
              style={{
                backgroundColor: '#2563EB',
                color: '#FFFFFF',
                boxShadow: '0 10px 40px rgba(37, 99, 235, 0.3)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 10px 40px rgba(37, 99, 235, 0.5)'}
              onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 10px 40px rgba(37, 99, 235, 0.3)'}
            >
              {userType === 'students' ? 'Find a Lab' : 'Post Position'}
            </Link>
            <Link
              href={userType === 'students' ? '/signup' : '/labs/about'}
              className="px-8 py-4 rounded-xl font-bold text-lg transition-all hover:bg-opacity-70"
              style={{
                backgroundColor: '#FFFFFF',
                color: '#0B2341',
                border: '1px solid #E2E8F0'
              }}
            >
              {userType === 'students' ? 'Sign Up' : 'Learn More'}
            </Link>
          </div>
        </div>

        {/* Right: Floating Glass Card with Interactive Tilt */}
        <div className="relative hidden lg:block" style={{ perspective: '1000px' }}>
          {/* Animated Blobs */}
          <div
            className="absolute top-10 right-10 w-72 h-72 rounded-full opacity-20 blur-3xl animate-blob"
            style={{
              backgroundColor: '#3B82F6',
              mixBlendMode: 'multiply',
              animation: 'blob 7s infinite'
            }}
          ></div>
          <div
            className="absolute -bottom-8 -left-8 w-72 h-72 rounded-full opacity-20 blur-3xl animate-blob"
            style={{
              backgroundColor: '#6366F1',
              mixBlendMode: 'multiply',
              animation: 'blob 7s infinite 2s'
            }}
          ></div>

          {/* Glass Card with Dynamic Tilt */}
          <div
            className="relative z-10 backdrop-blur-xl p-6 rounded-3xl shadow-2xl transition-all duration-300"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.5)',
              transform: 'rotateY(-8deg) rotateX(3deg)'
            }}
            onMouseMove={(e) => {
              const card = e.currentTarget;
              const rect = card.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const y = e.clientY - rect.top;
              const centerX = rect.width / 2;
              const centerY = rect.height / 2;
              const rotateX = (y - centerY) / 10;
              const rotateY = (centerX - x) / 10;
              card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'rotateY(-8deg) rotateX(3deg) scale(1)';
            }}
          >
            {/* Conditional Card Content */}
            {userType === 'students' ? (
              /* Student View: Lab Card */
              <>
                <div className="flex items-start gap-4 mb-4">
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold shrink-0"
                    style={{ backgroundColor: '#2563EB', color: '#FFFFFF' }}
                  >
                    DS
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold mb-1" style={{ color: '#0B2341', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                      Dr. Smith's Lab
                    </h3>
                    <p className="text-sm font-medium mb-2" style={{ color: '#64748B' }}>
                      Neuroscience • Life Sciences
                    </p>
                    <div className="flex items-center gap-2">
                      <span
                        className="px-3 py-1 rounded-full text-xs font-bold"
                        style={{
                          backgroundColor: 'rgba(37, 99, 235, 0.1)',
                          color: '#2563EB'
                        }}
                      >
                        3 Open Positions
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-sm mb-4 leading-relaxed" style={{ color: '#334155' }}>
                  Seeking undergrad researchers for computational neuroscience lab focusing on neural network modeling and brain-computer interfaces.
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-xs" style={{ color: '#64748B' }}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>10-15 hrs/week</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs" style={{ color: '#64748B' }}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Paid position</span>
                  </div>
                </div>
                <div className="flex gap-2 mb-4">
                  <span className="px-2 py-1 rounded text-xs font-medium" style={{ backgroundColor: 'rgba(37, 99, 235, 0.08)', color: '#2563EB' }}>
                    Python
                  </span>
                  <span className="px-2 py-1 rounded text-xs font-medium" style={{ backgroundColor: 'rgba(37, 99, 235, 0.08)', color: '#2563EB' }}>
                    MATLAB
                  </span>
                  <span className="px-2 py-1 rounded text-xs font-medium" style={{ backgroundColor: 'rgba(37, 99, 235, 0.08)', color: '#2563EB' }}>
                    Data Analysis
                  </span>
                </div>
                <button
                  className="w-full py-3 rounded-lg font-bold text-sm transition hover:opacity-80"
                  style={{ background: '#2563EB', color: '#FFFFFF' }}
                >
                  View Details
                </button>
              </>
            ) : (
              /* Labs View: Applicants Dashboard */
              <>
                <h3 className="text-lg font-bold mb-4" style={{ color: '#0B2341', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  Recent Applicants
                </h3>
                <div className="space-y-3 mb-4">
                  {/* Applicant 1 */}
                  <div className="flex items-center justify-between gap-3 p-3 rounded-lg transition-all hover:bg-opacity-70" style={{ backgroundColor: 'rgba(37, 99, 235, 0.06)' }}>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: '#2563EB', color: '#FFFFFF' }}>
                          JD
                        </div>
                        <div>
                          <p className="text-sm font-bold" style={{ color: '#0B2341' }}>Jane Doe</p>
                        </div>
                      </div>
                      <p className="text-xs" style={{ color: '#64748B' }}>3.8 GPA • Neuroscience Major</p>
                      <div className="flex gap-1 mt-1">
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-medium" style={{ backgroundColor: 'rgba(37, 99, 235, 0.1)', color: '#2563EB' }}>
                          Python
                        </span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-medium" style={{ backgroundColor: 'rgba(37, 99, 235, 0.1)', color: '#2563EB' }}>
                          Research
                        </span>
                      </div>
                    </div>
                    <button className="px-3 py-1.5 rounded-md text-xs font-bold transition hover:opacity-80 shrink-0" style={{ background: '#D97706', color: '#FFFFFF' }}>
                      Accept
                    </button>
                  </div>

                  {/* Applicant 2 */}
                  <div className="flex items-center justify-between gap-3 p-3 rounded-lg transition-all hover:bg-opacity-50" style={{ backgroundColor: 'rgba(226, 232, 240, 0.5)' }}>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: '#64748B', color: '#FFFFFF' }}>
                          JS
                        </div>
                        <div>
                          <p className="text-sm font-bold" style={{ color: '#0B2341' }}>John Smith</p>
                        </div>
                      </div>
                      <p className="text-xs" style={{ color: '#64748B' }}>3.9 GPA • CS Major</p>
                      <div className="flex gap-1 mt-1">
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-medium" style={{ backgroundColor: 'rgba(100, 116, 139, 0.1)', color: '#64748B' }}>
                          ML
                        </span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-medium" style={{ backgroundColor: 'rgba(100, 116, 139, 0.1)', color: '#64748B' }}>
                          Stats
                        </span>
                      </div>
                    </div>
                    <button className="px-3 py-1.5 rounded-md text-xs font-bold transition hover:opacity-80 shrink-0" style={{ background: '#2563EB', color: '#FFFFFF' }}>
                      Review
                    </button>
                  </div>

                  {/* Applicant 3 */}
                  <div className="flex items-center justify-between gap-3 p-3 rounded-lg transition-all hover:bg-opacity-50" style={{ backgroundColor: 'rgba(226, 232, 240, 0.5)' }}>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: '#64748B', color: '#FFFFFF' }}>
                          SL
                        </div>
                        <div>
                          <p className="text-sm font-bold" style={{ color: '#0B2341' }}>Sarah Lee</p>
                        </div>
                      </div>
                      <p className="text-xs" style={{ color: '#64748B' }}>3.7 GPA • Bioengineering Major</p>
                      <div className="flex gap-1 mt-1">
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-medium" style={{ backgroundColor: 'rgba(100, 116, 139, 0.1)', color: '#64748B' }}>
                          CAD
                        </span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-medium" style={{ backgroundColor: 'rgba(100, 116, 139, 0.1)', color: '#64748B' }}>
                          Lab
                        </span>
                      </div>
                    </div>
                    <button className="px-3 py-1.5 rounded-md text-xs font-bold transition hover:opacity-80 shrink-0" style={{ background: '#2563EB', color: '#FFFFFF' }}>
                      Review
                    </button>
                  </div>
                </div>
                <button
                  className="w-full py-3 rounded-lg font-bold text-sm transition hover:opacity-80"
                  style={{ background: '#2563EB', color: '#FFFFFF' }}
                >
                  View All Applicants
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Trusted By Section - Marquee */}
      <div className="w-full py-10 overflow-hidden" style={{ backgroundColor: '#F9F7F2' }}>
        <p className="text-center text-xs font-bold uppercase tracking-[0.3em] mb-8" style={{ color: '#94A3B8' }}>
          Departments at UCLA
        </p>

        <div className="relative flex overflow-x-hidden group">
          <div
            className="flex animate-marquee whitespace-nowrap items-center gap-16 grayscale hover:grayscale-0 transition-all duration-500"
            style={{ opacity: 0.6 }}
          >
            <span className="text-xl font-bold" style={{ color: '#0B2341', fontFamily: 'Fraunces, serif' }}>Molecular, Cell & Developmental Biology</span>
            <span className="text-xl font-bold" style={{ color: '#0B2341', fontFamily: 'Fraunces, serif' }}>Microbiology, Immunology & Molecular Genetics</span>
            <span className="text-xl font-bold" style={{ color: '#0B2341', fontFamily: 'Fraunces, serif' }}>Computer Science</span>
            <span className="text-xl font-bold" style={{ color: '#0B2341', fontFamily: 'Fraunces, serif' }}>Psychology</span>
            <span className="text-xl font-bold" style={{ color: '#0B2341', fontFamily: 'Fraunces, serif' }}>Chemistry & Biochemistry</span>
            <span className="text-xl font-bold" style={{ color: '#0B2341', fontFamily: 'Fraunces, serif' }}>Neuroscience</span>
          </div>
          <div
            className="flex animate-marquee whitespace-nowrap items-center gap-16 grayscale hover:grayscale-0 transition-all duration-500"
            style={{ opacity: 0.6 }}
            aria-hidden="true"
          >
            <span className="text-xl font-bold" style={{ color: '#0B2341', fontFamily: 'Fraunces, serif' }}>Molecular, Cell & Developmental Biology</span>
            <span className="text-xl font-bold" style={{ color: '#0B2341', fontFamily: 'Fraunces, serif' }}>Microbiology, Immunology & Molecular Genetics</span>
            <span className="text-xl font-bold" style={{ color: '#0B2341', fontFamily: 'Fraunces, serif' }}>Computer Science</span>
            <span className="text-xl font-bold" style={{ color: '#0B2341', fontFamily: 'Fraunces, serif' }}>Psychology</span>
            <span className="text-xl font-bold" style={{ color: '#0B2341', fontFamily: 'Fraunces, serif' }}>Chemistry & Biochemistry</span>
            <span className="text-xl font-bold" style={{ color: '#0B2341', fontFamily: 'Fraunces, serif' }}>Neuroscience</span>
          </div>
        </div>
      </div>

      {/* CTA Section - Immersive Anchor */}
      <section className="relative py-24 overflow-hidden" style={{ backgroundColor: '#0B2341' }}>
        {/* Engineering Grid Pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}
        ></div>

        {/* Blue Glow Blob */}
        <div
          className="absolute top-0 left-1/2 w-full h-full max-w-3xl rounded-full pointer-events-none blur-[120px]"
          style={{
            backgroundColor: 'rgba(37, 99, 235, 0.2)',
            transform: 'translateX(-50%)'
          }}
        ></div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center">
          {/* Headline with Gradient */}
          <h2
            className="text-5xl md:text-7xl font-bold mb-6 tracking-tight"
            style={{
              color: '#FFFFFF',
              fontFamily: "'Fraunces', serif",
              letterSpacing: '-0.02em'
            }}
          >
            From classroom<br />
            <span
              className="text-transparent bg-clip-text"
              style={{
                backgroundImage: 'linear-gradient(to right, #60A5FA, #818CF8)'
              }}
            >
              to the lab bench.
            </span>
          </h2>

          {/* Subheadline */}
          <p className="text-xl mb-12 max-w-2xl mx-auto" style={{ color: 'rgba(191, 219, 254, 0.8)' }}>
            Be part of the future of UCLA undergraduate research.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/signup"
              className="px-8 py-4 rounded-xl font-bold text-lg transition-transform hover:scale-105 shadow-lg"
              style={{
                backgroundColor: '#2563EB',
                color: '#FFFFFF',
                boxShadow: '0 10px 40px rgba(37, 99, 235, 0.5)'
              }}
            >
              Get Started Now
            </Link>

            <Link
              href="/pi-signup"
              className="px-8 py-4 rounded-xl font-bold text-lg transition-colors flex items-center gap-2"
              style={{
                backgroundColor: 'transparent',
                border: '1px solid rgba(96, 165, 250, 0.3)',
                color: 'rgba(191, 219, 254, 1)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#4ADE80' }}></span>
              Post a Position
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
