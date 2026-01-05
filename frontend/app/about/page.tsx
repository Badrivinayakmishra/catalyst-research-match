'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function AboutPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs = [
    {
      question: "Do I need research experience to apply?",
      answer: "Nope! A lot of labs are specifically looking for students who are just getting started. If a position says it requires prior experience, it'll say so in the description. Otherwise, you're good to apply."
    },
    {
      question: "Is this only for science majors?",
      answer: "Not at all. Labs across all departments use Catalyst - humanities, social sciences, engineering, you name it. There's research happening in pretty much every field at UCLA."
    },
    {
      question: "How many hours a week do I need to commit?",
      answer: "It depends on the position. Some labs want 10 hours a week, others are fine with 5. Most positions will tell you the expected time commitment upfront. Pick something that actually fits your schedule."
    },
    {
      question: "Can I get paid or course credit?",
      answer: "Some positions are paid, some are for credit (199 or departmental equivalent), and some are volunteer. Each posting will specify what's offered. Filter by what works for you."
    },
    {
      question: "What if I don't hear back from a lab?",
      answer: "Professors get busy, especially during certain times of the quarter. Give it about a week, then it's totally fine to send a follow-up. You can also keep applying to other positions - don't put all your eggs in one basket."
    },
    {
      question: "Can I work in multiple labs?",
      answer: "You can, but make sure you're not overcommitting yourself. Most students stick to one lab so they can actually dive deep into the work instead of spreading themselves too thin."
    },
    {
      question: "When should I start looking?",
      answer: "Start of the quarter is usually when most positions open up, but labs post throughout the year. Some professors plan ahead for the next quarter, so there's no bad time to browse."
    },
    {
      question: "Do I need to be in a specific year?",
      answer: "First-years are welcome to apply! Some labs prefer students who have a few quarters left before graduating (so they can stick around longer), but plenty of opportunities exist for everyone."
    },
    {
      question: "What should I include in my application?",
      answer: "Be honest about what you're interested in and why you want to work in that specific lab. PIs can tell when you're just copy-pasting generic statements. Mention a paper they published or a project that caught your eye."
    },
    {
      question: "Is Catalyst officially affiliated with UCLA?",
      answer: "We're an independent platform made to help students and professors connect more easily. We're not run by the university, but we work with UCLA labs and students."
    },
    {
      question: "How do I delete my account?",
      answer: "Go to your profile settings and scroll to the bottom. There's a button to delete your account. All your data will be removed."
    },
    {
      question: "What if I have issues with the site?",
      answer: "Reach out to us through the contact page or email us. We're a small team but we'll get back to you as soon as we can."
    }
  ]

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F9F7F2' }}>
      {/* Navigation */}
      <nav className="border-b backdrop-blur-sm bg-white/70" style={{ borderColor: '#E2E8F0' }}>
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
        {/* How It Works Section */}
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

        {/* FAQ Section */}
        <div className="mt-20 mb-12">
          <h2
            className="text-5xl font-bold mb-4"
            style={{ color: '#0B2341', fontFamily: 'Fraunces, serif' }}
          >
            FAQ
          </h2>
          <p className="text-xl mb-12" style={{ color: '#64748B' }}>
            Common questions about finding research at UCLA.
          </p>

          {/* FAQ Accordion */}
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="rounded-xl overflow-hidden transition-all"
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E2E8F0'
                }}
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full px-6 py-5 text-left flex justify-between items-center hover:bg-opacity-50 transition"
                  style={{ backgroundColor: openIndex === index ? 'rgba(37, 99, 235, 0.05)' : 'transparent' }}
                >
                  <span className="text-lg font-bold" style={{ color: '#0B2341' }}>
                    {faq.question}
                  </span>
                  <svg
                    className="w-6 h-6 transition-transform"
                    style={{
                      transform: openIndex === index ? 'rotate(180deg)' : 'rotate(0deg)',
                      color: '#2563EB'
                    }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openIndex === index && (
                  <div className="px-6 pb-5">
                    <p className="text-lg leading-relaxed" style={{ color: '#334155' }}>
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
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
