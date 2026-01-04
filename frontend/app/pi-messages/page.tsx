'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function PIMessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState(1)
  const [messageText, setMessageText] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  // Mock PI data
  const piData = {
    name: "Dr. Jennifer Smith",
    lab: "Computational Neuroscience Lab",
    initials: "JS"
  }

  // Mock conversations data
  const conversations = [
    {
      id: 1,
      studentName: "Jane Doe",
      studentInitials: "JD",
      context: "Neural Network Modeling RA - Applicant",
      lastMessage: "Thank you so much! I'm very excited about this opportunity.",
      timestamp: "1 hour ago",
      unread: true,
      avatar: null
    },
    {
      id: 2,
      studentName: "David Park",
      studentInitials: "DP",
      context: "Neural Network Modeling RA - Current RA",
      lastMessage: "I've finished analyzing the dataset from last week's experiment.",
      timestamp: "3 hours ago",
      unread: true,
      avatar: null
    },
    {
      id: 3,
      studentName: "Michael Chen",
      studentInitials: "MC",
      context: "BCI Research Assistant - Applicant",
      lastMessage: "I would love to schedule an interview at your convenience.",
      timestamp: "1 day ago",
      unread: false,
      avatar: null
    },
    {
      id: 4,
      studentName: "Emily Rodriguez",
      studentInitials: "ER",
      context: "BCI Research Assistant - Interview Scheduled",
      lastMessage: "Perfect! I'll see you Tuesday at 2 PM in Boelter 3400.",
      timestamp: "2 days ago",
      unread: false,
      avatar: null
    },
    {
      id: 5,
      studentName: "Alex Kim",
      studentInitials: "AK",
      context: "Data Analysis RA - Applicant",
      lastMessage: "I have experience with both R and Python for statistical analysis.",
      timestamp: "3 days ago",
      unread: false,
      avatar: null
    }
  ]

  // Mock messages for selected conversation
  const messages = [
    {
      id: 1,
      sender: "pi",
      senderName: "Dr. Jennifer Smith",
      text: "Hi Jane, thank you for your application to our Computational Neuroscience Lab. I was impressed by your background in Python and data analysis.",
      timestamp: "2 days ago at 10:30 AM"
    },
    {
      id: 2,
      sender: "student",
      senderName: "Jane Doe",
      text: "Thank you so much, Dr. Smith! I'm very excited about the opportunity to work on neural network modeling and BCI research.",
      timestamp: "2 days ago at 2:15 PM"
    },
    {
      id: 3,
      sender: "student",
      senderName: "Jane Doe",
      text: "I have completed coursework in computational modeling and have experience with MATLAB from a previous research project.",
      timestamp: "2 days ago at 2:16 PM"
    },
    {
      id: 4,
      sender: "pi",
      senderName: "Dr. Jennifer Smith",
      text: "That's excellent! Your experience aligns well with what we're looking for. I'd like to discuss the position further with you. Are you available for an interview next week?",
      timestamp: "1 day ago at 9:00 AM"
    },
    {
      id: 5,
      sender: "student",
      senderName: "Jane Doe",
      text: "Yes, I'm available next week! Tuesday or Thursday afternoon would work best for me.",
      timestamp: "1 day ago at 11:30 AM"
    },
    {
      id: 6,
      sender: "pi",
      senderName: "Dr. Jennifer Smith",
      text: "Great! Let's schedule for Tuesday at 2 PM in Boelter Hall, Room 3400. I'll send you a calendar invite shortly.",
      timestamp: "1 day ago at 1:00 PM"
    },
    {
      id: 7,
      sender: "student",
      senderName: "Jane Doe",
      text: "Thank you so much! I'm very excited about this opportunity.",
      timestamp: "1 hour ago"
    }
  ]

  const currentConversation = conversations.find(c => c.id === selectedConversation)

  const filteredConversations = conversations.filter(conv =>
    conv.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.context.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!messageText.trim()) return

    // In production, send message to backend
    console.log('Sending message:', messageText)
    alert('Message sent!')
    setMessageText('')
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F9F7F2' }}>
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
                href="/pi-messages"
                className="text-sm font-medium transition"
                style={{ color: '#2563EB' }}
              >
                Messages
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
      <div className="flex-1 flex overflow-hidden">

        {/* Sidebar - Conversations List */}
        <aside className="w-96 border-r bg-white flex flex-col" style={{ borderColor: '#E2E8F0' }}>

          {/* Header */}
          <div className="p-6 border-b" style={{ borderColor: '#E2E8F0' }}>
            <h1
              className="text-3xl font-bold mb-4"
              style={{
                color: '#0B2341',
                fontFamily: "'Fraunces', serif",
                letterSpacing: '-0.02em'
              }}
            >
              Messages
            </h1>

            {/* Search */}
            <div className="relative">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" fill="none" stroke="#64748B" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none focus:border-blue-500 transition-colors"
                style={{ borderColor: '#E2E8F0', color: '#0B2341' }}
              />
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setSelectedConversation(conv.id)}
                className="w-full p-4 border-b transition-colors hover:bg-gray-50 text-left"
                style={{
                  borderColor: '#E2E8F0',
                  backgroundColor: selectedConversation === conv.id ? 'rgba(37, 99, 235, 0.05)' : 'transparent'
                }}
              >
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold shrink-0" style={{ backgroundColor: '#2563EB', color: '#FFFFFF' }}>
                    {conv.studentInitials}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-bold truncate" style={{ color: '#0B2341' }}>
                          {conv.studentName}
                        </h3>
                        <p className="text-xs truncate" style={{ color: '#64748B' }}>
                          {conv.context}
                        </p>
                      </div>
                      <span className="text-xs ml-2 shrink-0" style={{ color: '#94A3B8' }}>
                        {conv.timestamp}
                      </span>
                    </div>
                    <p className="text-sm truncate" style={{ color: conv.unread ? '#0B2341' : '#64748B', fontWeight: conv.unread ? 600 : 400 }}>
                      {conv.lastMessage}
                    </p>
                  </div>

                  {/* Unread Indicator */}
                  {conv.unread && (
                    <div className="w-2 h-2 rounded-full shrink-0 mt-2" style={{ backgroundColor: '#2563EB' }}></div>
                  )}
                </div>
              </button>
            ))}

            {filteredConversations.length === 0 && (
              <div className="text-center py-12 px-4">
                <svg className="w-12 h-12 mx-auto mb-3" fill="none" stroke="#94A3B8" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <p className="text-sm" style={{ color: '#64748B' }}>No conversations found</p>
              </div>
            )}
          </div>
        </aside>

        {/* Main Chat Area */}
        <main className="flex-1 flex flex-col bg-white">

          {currentConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-6 border-b" style={{ borderColor: '#E2E8F0' }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold" style={{ backgroundColor: '#2563EB', color: '#FFFFFF' }}>
                      {currentConversation.studentInitials}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold" style={{ color: '#0B2341', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                        {currentConversation.studentName}
                      </h2>
                      <p className="text-sm" style={{ color: '#64748B' }}>
                        {currentConversation.context}
                      </p>
                    </div>
                  </div>
                  <Link
                    href={`/pi-applications/${currentConversation.id}`}
                    className="px-4 py-2 rounded-lg text-sm font-medium transition hover:bg-gray-100"
                    style={{ border: '1px solid #E2E8F0', color: '#334155' }}
                  >
                    View Application
                  </Link>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4" style={{ backgroundColor: '#F9F7F2' }}>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'pi' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-lg ${message.sender === 'pi' ? 'order-2' : 'order-1'}`}>
                      <div
                        className="rounded-2xl px-4 py-3 shadow-sm"
                        style={{
                          backgroundColor: message.sender === 'pi' ? '#2563EB' : '#FFFFFF',
                          color: message.sender === 'pi' ? '#FFFFFF' : '#0B2341',
                          borderRadius: message.sender === 'pi' ? '20px 20px 4px 20px' : '20px 20px 20px 4px'
                        }}
                      >
                        <p className="text-sm leading-relaxed">{message.text}</p>
                      </div>
                      <p className="text-xs mt-1 px-2" style={{ color: '#94A3B8' }}>
                        {message.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="p-6 border-t" style={{ borderColor: '#E2E8F0' }}>
                <form onSubmit={handleSendMessage} className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    className="flex-1 px-4 py-3 rounded-lg border focus:outline-none focus:border-blue-500 transition-colors"
                    style={{ borderColor: '#E2E8F0', color: '#0B2341' }}
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-lg font-bold transition hover:opacity-80 flex items-center gap-2"
                    style={{ backgroundColor: '#2563EB', color: '#FFFFFF' }}
                  >
                    <span>Send</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </form>

                {/* Quick Actions */}
                <div className="flex gap-2 mt-3">
                  <button
                    type="button"
                    className="text-sm font-medium px-3 py-2 rounded-lg transition hover:bg-gray-100 flex items-center gap-2"
                    style={{ color: '#64748B' }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                    Attach File
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center" style={{ backgroundColor: '#F9F7F2' }}>
              <div className="text-center">
                <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="#94A3B8" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p className="text-lg font-semibold mb-2" style={{ color: '#0B2341' }}>
                  Select a conversation
                </p>
                <p className="text-sm" style={{ color: '#64748B' }}>
                  Choose a conversation from the list to start messaging
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
