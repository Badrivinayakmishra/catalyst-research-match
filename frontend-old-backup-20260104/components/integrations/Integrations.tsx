'use client'

import React, { useState, useEffect } from 'react'
import Sidebar from '../shared/Sidebar'
import Image from 'next/image'
import axios from 'axios'

const API_BASE = 'http://localhost:5003/api'

interface Integration {
  id: string
  name: string
  logo: string
  description: string
  category: string
  connected: boolean
  isOAuth?: boolean
}

const integrations: Integration[] = [
  {
    id: 'teams',
    name: 'Microsoft Teams',
    logo: '/teams.png',
    description: 'Teams is integrates chat, video meetings for workplace communication.',
    category: 'Conversations',
    connected: false
  },
  {
    id: 'slack',
    name: 'Slack',
    logo: '/slack.png',
    description: 'Slack is a messaging platform that streamlines team communication.',
    category: 'Conversations',
    connected: false
  },
  {
    id: 'github',
    name: 'Github',
    logo: '/github.png',
    description: 'GitHub is a web-based platform for collaborative software development.',
    category: 'Coding',
    connected: true
  },
  {
    id: 'gmail',
    name: 'Gmail',
    logo: '/gmail.png',
    description: 'Connect your Gmail to import emails into your knowledge base.',
    category: 'Conversations',
    connected: false,
    isOAuth: true
  },
  {
    id: 'powerpoint',
    name: 'Microsoft Powerpoint',
    logo: '/powerpoint.png',
    description: 'PowerPoint is a presentation software used to create slideshows',
    category: 'Documents & Recordings',
    connected: false
  },
  {
    id: 'excel',
    name: 'Microsoft Excel',
    logo: '/excel.png',
    description: 'Excel learns your patterns, organizing your data to save you time.',
    category: 'Documents & Recordings',
    connected: false
  }
]

const IntegrationCard = ({ integration, onToggleConnect }: { integration: Integration; onToggleConnect: (id: string) => void }) => {
  return (
    <div 
      className={`flex flex-col items-start gap-2 ${
        integration.connected ? 'bg-[#FFE2BF]' : 'bg-secondary'
      }`}
      style={{
        width: '100%',
        padding: '32px',
        borderRight: '1px solid #D4D4D8',
        borderBottom: '1px solid #D4D4D8',
        margin: 0,
        boxSizing: 'border-box'
      }}
    >
      {/* Logo */}
      <div style={{ width: '40px', height: '37px', aspectRatio: '40/37' }}>
        <Image 
          src={integration.logo} 
          alt={integration.name}
          width={40}
          height={37}
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
      </div>

      {/* Name */}
      <h3 
        style={{
          color: '#18181B',
          fontFamily: 'Geist, sans-serif',
          fontSize: '18px',
          fontWeight: 500,
          marginTop: '8px'
        }}
      >
        {integration.name}
      </h3>

      {/* Description - 2 lines */}
      <p 
        style={{
          width: '264px',
          color: '#71717A',
          fontFamily: 'Inter, sans-serif',
          fontSize: '14px',
          fontWeight: 400,
          lineHeight: '20px',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}
      >
        {integration.description}
      </p>

      {/* Buttons */}
      <div className="flex items-center gap-2 mt-4">
        <button 
          onClick={() => onToggleConnect(integration.id)}
          className={`flex items-center justify-center gap-[6px]`}
          style={{
            padding: '6px 12px',
            borderRadius: '375px',
            border: '0.75px solid #D4D4D8',
            backgroundColor: integration.connected ? '#000000' : '#FFF3E4',
            boxShadow: '0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.05)',
            cursor: 'pointer'
          }}
        >
          <span 
            style={{
              color: integration.connected ? '#FFFFFF' : '#1E293B',
              fontFamily: 'Inter, sans-serif',
              fontSize: '12px',
              fontWeight: 400
            }}
          >
            {integration.connected ? 'Connected' : 'Connect'}
          </span>
          {integration.connected && (
            <div 
              style={{
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                backgroundColor: '#10B981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <span style={{ color: 'white', fontSize: '10px' }}>✓</span>
            </div>
          )}
        </button>

        <button 
          className="flex items-center gap-1"
          style={{
            color: '#1E293B',
            fontFamily: 'Inter, sans-serif',
            fontSize: '12px',
            fontWeight: 400
          }}
        >
          Integrations details
          <span>→</span>
        </button>
      </div>
    </div>
  )
}

export default function Integrations() {
  const [activeItem, setActiveItem] = useState('Integrations')
  const [activeTab, setActiveTab] = useState('All Integrations')
  const [integrationsState, setIntegrationsState] = useState(integrations)
  const [isConnecting, setIsConnecting] = useState<string | null>(null)
  const [syncStatus, setSyncStatus] = useState<string | null>(null)

  const categories = ['All Integrations', 'Conversations', 'Coding', 'Documents & Recordings']

  // Check Gmail status on mount
  useEffect(() => {
    checkGmailStatus()

    // Listen for OAuth callback messages
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'GMAIL_CONNECTED') {
        if (event.data.success) {
          setIntegrationsState(prev =>
            prev.map(int =>
              int.id === 'gmail' ? { ...int, connected: true } : int
            )
          )
          setSyncStatus('Gmail connected! You can now sync your emails.')
        } else {
          setSyncStatus(`Connection failed: ${event.data.error}`)
        }
        setIsConnecting(null)
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  const checkGmailStatus = async () => {
    try {
      const response = await axios.get(`${API_BASE}/connectors/gmail/status`)
      if (response.data.connected) {
        setIntegrationsState(prev =>
          prev.map(int =>
            int.id === 'gmail' ? { ...int, connected: true } : int
          )
        )
      }
    } catch (error) {
      console.error('Error checking Gmail status:', error)
    }
  }

  const connectGmail = async () => {
    setIsConnecting('gmail')
    setSyncStatus(null)

    try {
      // Get auth URL from backend
      const response = await axios.get(`${API_BASE}/connectors/gmail/auth`)

      if (response.data.success && response.data.auth_url) {
        // Open OAuth popup
        const popup = window.open(
          response.data.auth_url,
          'Gmail Authorization',
          'width=600,height=700,scrollbars=yes'
        )

        // Check if popup was blocked
        if (!popup) {
          setSyncStatus('Popup blocked! Please allow popups for this site.')
          setIsConnecting(null)
        }
      } else {
        setSyncStatus(`Error: ${response.data.error}`)
        setIsConnecting(null)
      }
    } catch (error: any) {
      setSyncStatus(`Connection error: ${error.message}`)
      setIsConnecting(null)
    }
  }

  const disconnectGmail = async () => {
    try {
      await axios.post(`${API_BASE}/connectors/gmail/disconnect`)
      setIntegrationsState(prev =>
        prev.map(int =>
          int.id === 'gmail' ? { ...int, connected: false } : int
        )
      )
      setSyncStatus('Gmail disconnected.')
    } catch (error) {
      console.error('Error disconnecting Gmail:', error)
    }
  }

  const syncGmail = async () => {
    setSyncStatus('Syncing emails...')
    try {
      const response = await axios.post(`${API_BASE}/connectors/gmail/sync`)
      if (response.data.success) {
        setSyncStatus(`Synced ${response.data.documents_synced} emails successfully!`)
      } else {
        setSyncStatus(`Sync failed: ${response.data.error}`)
      }
    } catch (error: any) {
      setSyncStatus(`Sync error: ${error.message}`)
    }
  }

  const toggleConnect = async (id: string) => {
    const integration = integrationsState.find(i => i.id === id)

    // Handle Gmail OAuth
    if (id === 'gmail') {
      if (integration?.connected) {
        await disconnectGmail()
      } else {
        await connectGmail()
      }
      return
    }

    // Handle other integrations (placeholder)
    setIntegrationsState(prev =>
      prev.map(int =>
        int.id === id ? { ...int, connected: !int.connected } : int
      )
    )
  }
  
  const getFilteredIntegrations = () => {
    if (activeTab === 'All Integrations') return integrationsState
    return integrationsState.filter(i => i.category === activeTab)
  }

  const filteredIntegrations = getFilteredIntegrations()

  return (
    <div className="flex h-screen bg-primary overflow-hidden">
      {/* Sidebar */}
      <Sidebar activeItem={activeItem} onItemClick={setActiveItem} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 bg-primary">
          <div>
            <h1 
              style={{
                color: '#18181B',
                fontFamily: 'Geist, sans-serif',
                fontSize: '36px',
                fontWeight: 600,
                letterSpacing: '-0.72px',
                marginBottom: '8px'
              }}
            >
              Integrations
            </h1>
            <p 
              style={{
                color: '#71717A',
                fontFamily: 'Geist, sans-serif',
                fontSize: '18px',
                fontWeight: 300,
                lineHeight: '22px',
                letterSpacing: '0.18px'
              }}
            >
              Select and connect tools you use to integrate with your KnowledgeVault
            </p>
          </div>

          {/* Toggle View */}
          <div 
            className="flex items-center gap-2"
            style={{
              padding: '2px',
              borderRadius: '500px',
              border: '1px solid #D4D4D8',
              backgroundColor: '#FFF'
            }}
          >
            <button className="p-2 rounded-full hover:bg-gray-100">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <rect x="3" y="3" width="6" height="6" rx="1"/>
                <rect x="11" y="3" width="6" height="6" rx="1"/>
                <rect x="3" y="11" width="6" height="6" rx="1"/>
                <rect x="11" y="11" width="6" height="6" rx="1"/>
              </svg>
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <rect x="3" y="4" width="14" height="2" rx="1"/>
                <rect x="3" y="9" width="14" height="2" rx="1"/>
                <rect x="3" y="14" width="14" height="2" rx="1"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-8 pb-4 bg-primary">
          <div className="flex items-center gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveTab(category)}
                className={`flex items-center gap-2 ${
                  activeTab === category ? 'bg-secondary' : 'hover:bg-secondary'
                }`}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  transition: 'background-color 0.2s'
                }}
              >
                <span 
                  style={{
                    color: '#18181B',
                    fontFamily: 'Geist, sans-serif',
                    fontSize: '14px',
                    fontWeight: 400
                  }}
                >
                  {category}
                </span>
                {category === 'All Integrations' && (
                  <div 
                    style={{
                      display: 'flex',
                      width: '25px',
                      height: '25px',
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: '500px',
                      backgroundColor: '#FFF',
                      fontSize: '12px',
                      fontWeight: 500
                    }}
                  >
                    6
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Integrations Grid - 3 columns, no gaps */}
        <div className="flex-1 overflow-y-auto px-8 py-6 bg-primary">
          {/* Status Message */}
          {syncStatus && (
            <div
              className="mb-4 p-4 rounded-lg"
              style={{
                maxWidth: '1100px',
                backgroundColor: syncStatus.includes('error') || syncStatus.includes('failed') || syncStatus.includes('Failed')
                  ? '#FEE2E2'
                  : syncStatus.includes('Syncing')
                    ? '#FEF3C7'
                    : '#D1FAE5',
                border: '1px solid',
                borderColor: syncStatus.includes('error') || syncStatus.includes('failed') || syncStatus.includes('Failed')
                  ? '#FCA5A5'
                  : syncStatus.includes('Syncing')
                    ? '#FCD34D'
                    : '#6EE7B7'
              }}
            >
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px' }}>
                {syncStatus}
              </p>
            </div>
          )}

          {/* Gmail Sync Button (when connected) */}
          {integrationsState.find(i => i.id === 'gmail')?.connected && (
            <div className="mb-4" style={{ maxWidth: '1100px' }}>
              <button
                onClick={syncGmail}
                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
                style={{
                  backgroundColor: '#4285F4',
                  color: 'white',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  fontWeight: 500
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12a9 9 0 11-6.219-8.56" />
                </svg>
                Sync Gmail Emails
              </button>
            </div>
          )}

          <div
            className="grid grid-cols-3 gap-0"
            style={{
              maxWidth: '1100px',
              border: '1px solid #D4D4D8',
              borderRadius: '12px',
              overflow: 'hidden',
              display: 'grid'
            }}
          >
            {filteredIntegrations.map(integration => (
              <IntegrationCard
                key={integration.id}
                integration={integration}
                onToggleConnect={toggleConnect}
              />
            ))}
          </div>

          {/* Terms and Conditions */}
          <div className="mt-12 text-center">
            <a
              href="#"
              style={{
                color: '#71717A',
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
                textDecoration: 'underline'
              }}
            >
              Read our terms and Conditions ↗
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
