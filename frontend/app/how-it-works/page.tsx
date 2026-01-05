'use client'

import Link from 'next/link'

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F9F7F2' }}>
      {/* Navigation */}
      <nav className="border-b backdrop-blur-sm bg-white/70" style={{ borderColor: '#E2E8F0' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold" style={{ color: '#0B2341', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              Catalyst
            </Link>
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
                style={{ background: '#2563EB', color: '#FFFFFF' }}
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <h1
          className="text-5xl font-bold mb-4"
          style={{ color: '#0B2341', fontFamily: 'Fraunces, serif' }}
        >
          How It Works
        </h1>
        <p className="text-xl mb-12" style={{ color: '#64748B' }}>
          Getting started with research at UCLA is easier than you think.
        </p>

        {/* For Students */}
        <div className="mb-16">
          <h2
            className="text-3xl font-bold mb-8"
            style={{ color: '#0B2341', fontFamily: 'Plus Jakarta Sans, sans-serif' }}
          >
            For Students
          </h2>

          <div className="space-y-8">
            {/* Step 1 */}
            <div className="flex gap-6">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl shrink-0"
                style={{ backgroundColor: '#2563EB', color: '#FFFFFF' }}
              >
                1
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2" style={{ color: '#0B2341' }}>
                  Make an account
                </h3>
                <p className="text-lg leading-relaxed" style={{ color: '#334155' }}>
                  Sign up with your UCLA email. Fill out your profile with your major, GPA, and what kind of research you're into. The more you add, the better your matches will be.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-6">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl shrink-0"
                style={{ backgroundColor: '#2563EB', color: '#FFFFFF' }}
              >
                2
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2" style={{ color: '#0B2341' }}>
                  Browse open positions
                </h3>
                <p className="text-lg leading-relaxed" style={{ color: '#334155' }}>
                  Look through labs that are actually looking for undergrads right now. You can filter by department, time commitment, whether it's paid, stuff like that.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-6">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl shrink-0"
                style={{ backgroundColor: '#2563EB', color: '#FFFFFF' }}
              >
                3
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2" style={{ color: '#0B2341' }}>
                  Apply
                </h3>
                <p className="text-lg leading-relaxed" style={{ color: '#334155' }}>
                  When you find something you like, submit your application through the site. You can upload your resume, transcript, and write a quick note about why you're interested.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex gap-6">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl shrink-0"
                style={{ backgroundColor: '#2563EB', color: '#FFFFFF' }}
              >
                4
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2" style={{ color: '#0B2341' }}>
                  Track your applications
                </h3>
                <p className="text-lg leading-relaxed" style={{ color: '#334155' }}>
                  Check your dashboard to see when PIs view your application or update your status. No more wondering if your email got lost.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* For Professors */}
        <div className="mb-16">
          <h2
            className="text-3xl font-bold mb-8"
            style={{ color: '#0B2341', fontFamily: 'Plus Jakarta Sans, sans-serif' }}
          >
            For Professors
          </h2>

          <div className="space-y-8">
            {/* Step 1 */}
            <div className="flex gap-6">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl shrink-0"
                style={{ backgroundColor: '#1D4ED8', color: '#FFFFFF' }}
              >
                1
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2" style={{ color: '#0B2341' }}>
                  Create your lab profile
                </h3>
                <p className="text-lg leading-relaxed" style={{ color: '#334155' }}>
                  Sign up and tell students what your lab does. Add info about your research areas, recent projects, and what kind of students you're looking for.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-6">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl shrink-0"
                style={{ backgroundColor: '#1D4ED8', color: '#FFFFFF' }}
              >
                2
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2" style={{ color: '#0B2341' }}>
                  Post positions
                </h3>
                <p className="text-lg leading-relaxed" style={{ color: '#334155' }}>
                  List what you need - whether it's someone to help with data analysis, run experiments, or do lit reviews. Specify time commitment, required skills, and whether it's for credit or paid.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-6">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl shrink-0"
                style={{ backgroundColor: '#1D4ED8', color: '#FFFFFF' }}
              >
                3
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2" style={{ color: '#0B2341' }}>
                  Review applications
                </h3>
                <p className="text-lg leading-relaxed" style={{ color: '#334155' }}>
                  See who applied, check out their transcripts and resumes, and reach out to the ones who seem like a good fit. Everything's in one place.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex gap-6">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl shrink-0"
                style={{ backgroundColor: '#1D4ED8', color: '#FFFFFF' }}
              >
                4
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2" style={{ color: '#0B2341' }}>
                  Bring them on board
                </h3>
                <p className="text-lg leading-relaxed" style={{ color: '#334155' }}>
                  Once you find someone you want to work with, update their application status and get them started in your lab.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16 p-12 rounded-2xl" style={{ backgroundColor: 'rgba(37, 99, 235, 0.05)' }}>
          <h3 className="text-3xl font-bold mb-4" style={{ color: '#0B2341' }}>
            Ready to get started?
          </h3>
          <p className="text-lg mb-6" style={{ color: '#64748B' }}>
            Join other UCLA students and professors using Catalyst.
          </p>
          <Link
            href="/signup"
            className="inline-block px-8 py-4 rounded-xl font-bold text-lg transition-transform hover:scale-105"
            style={{ backgroundColor: '#2563EB', color: '#FFFFFF' }}
          >
            Sign Up Now
          </Link>
        </div>
      </div>
    </div>
  )
}
