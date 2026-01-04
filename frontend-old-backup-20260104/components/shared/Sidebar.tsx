'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface SidebarProps {
  activeItem?: string
  onItemClick?: (item: string) => void
}

export default function Sidebar({ activeItem = 'ChatBot', onItemClick }: SidebarProps) {
  const handleClick = (item: string) => {
    if (onItemClick) {
      onItemClick(item)
    }
  }

  return (
    <div 
      className="h-full bg-primary flex flex-col py-6"
      style={{ width: '280px' }}
    >
      <div className="px-6">
        {/* Logo */}
        <div className="mb-8">
          <Link href="/">
            <div className="flex items-center gap-3 cursor-pointer">
              <div style={{ width: '41px', height: '51px', aspectRatio: '41/51' }}>
                <Image 
                  src="/owl.png" 
                  alt="2nd Brain Logo" 
                  width={41} 
                  height={51}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <h1
                style={{
                  color: '#081028',
                  fontFamily: '"Work Sans", sans-serif',
                  fontSize: '20px',
                  fontWeight: 600,
                  lineHeight: '22px',
                  whiteSpace: 'nowrap'
                }}
              >
                2nd Brain
              </h1>
            </div>
          </Link>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search for..."
            className="w-full h-[42px] px-4 rounded bg-primary border border-border text-sm outline-none"
          />
        </div>

        {/* Menu Items */}
        <div className="space-y-1">
          <Link href="/">
            <div 
              onClick={() => handleClick('Knowledge Dashboard')}
              className={`flex items-center gap-3 px-4 py-3 rounded cursor-pointer transition-colors ${
                activeItem === 'Knowledge Dashboard' ? 'bg-[#FFE2BF]' : 'hover:bg-secondary'
              }`}
            >
              <div style={{ width: '14px', height: '14px', flexShrink: 0 }}>
                <Image src="/Home.svg" alt="Home" width={14} height={14} />
              </div>
              <span className="text-neutral-800 text-sm font-medium font-sans">
                Knowledge Dashboard
              </span>
            </div>
          </Link>

          <Link href="/training-guides">
            <div 
              onClick={() => handleClick('Training Guides')}
              className={`flex items-center gap-3 px-4 py-3 rounded cursor-pointer transition-colors ${
                activeItem === 'Training Guides' ? 'bg-[#FFE2BF]' : 'hover:bg-secondary'
              }`}
            >
              <div style={{ width: '14px', height: '14px', flexShrink: 0 }}>
                <Image src="/Training.png" alt="Training" width={14} height={14} />
              </div>
              <span className="text-neutral-800 text-sm font-medium font-sans">
                Training Guides
              </span>
            </div>
          </Link>

          <Link href="/documents">
            <div 
              onClick={() => handleClick('Documents')}
              className={`flex items-center gap-3 px-4 py-3 rounded cursor-pointer transition-colors ${
                activeItem === 'Documents' ? 'bg-[#FFE2BF]' : 'hover:bg-secondary'
              }`}
            >
              <div style={{ width: '14px', height: '14px', flexShrink: 0 }}>
                <Image src="/documents.png" alt="Documents" width={14} height={14} />
              </div>
              <span className="text-neutral-800 text-sm font-medium font-sans">
                Documents
              </span>
            </div>
          </Link>

          <Link href="/">
            <div 
              onClick={() => handleClick('ChatBot')}
              className={`flex items-center gap-3 px-4 py-3 rounded cursor-pointer transition-colors ${
                activeItem === 'ChatBot' ? 'bg-[#FFE2BF]' : 'hover:bg-secondary'
              }`}
            >
              <div style={{ width: '14px', height: '14px', flexShrink: 0 }}>
                <Image src="/Chatbot.png" alt="ChatBot" width={14} height={14} />
              </div>
              <span className="text-neutral-800 text-sm font-medium font-sans">
                ChatBot
              </span>
            </div>
          </Link>

          <Link href="/projects">
            <div
              onClick={() => handleClick('Projects')}
              className={`flex items-center gap-3 px-4 py-3 rounded cursor-pointer transition-colors ${
                activeItem === 'Projects' ? 'bg-[#FFE2BF]' : 'hover:bg-secondary'
              }`}
            >
              <div style={{ width: '14px', height: '14px', flexShrink: 0 }}>
                <Image src="/Project.svg" alt="Projects" width={14} height={14} />
              </div>
              <span className="text-neutral-800 text-sm font-medium font-sans">
                Projects
              </span>
            </div>
          </Link>

          <Link href="/knowledge-gaps">
            <div
              onClick={() => handleClick('Knowledge Gaps')}
              className={`flex items-center gap-3 px-4 py-3 rounded cursor-pointer transition-colors ${
                activeItem === 'Knowledge Gaps' ? 'bg-[#FFE2BF]' : 'hover:bg-secondary'
              }`}
            >
              <div style={{ width: '14px', height: '14px', flexShrink: 0 }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 1C3.686 1 1 3.686 1 7s2.686 6 6 6 6-2.686 6-6-2.686-6-6-6zm0 10.5a.75.75 0 110-1.5.75.75 0 010 1.5zm.75-3a.75.75 0 01-1.5 0V5.75a.75.75 0 011.5 0V8.5z" fill="#081028"/>
                </svg>
              </div>
              <span className="text-neutral-800 text-sm font-medium font-sans">
                Knowledge Gaps
              </span>
            </div>
          </Link>
        </div>
      </div>

      {/* Spacer */}
      <div className="flex-1"></div>

      {/* Bottom Menu */}
      <div className="px-6 space-y-1">
        <div 
          onClick={() => handleClick('Users')}
          className={`flex items-center gap-3 px-4 py-3 rounded cursor-pointer transition-colors ${
            activeItem === 'Users' ? 'bg-[#FFE2BF]' : 'hover:bg-secondary'
          }`}
        >
          <div style={{ width: '14px', height: '14px', flexShrink: 0 }}>
            <Image src="/User.png" alt="Users" width={14} height={14} />
          </div>
          <span className="text-neutral-800 text-sm font-medium font-sans">
            Users
          </span>
        </div>

        <div 
          onClick={() => handleClick('Feedback')}
          className={`flex items-center gap-3 px-4 py-3 rounded cursor-pointer transition-colors ${
            activeItem === 'Feedback' ? 'bg-[#FFE2BF]' : 'hover:bg-secondary'
          }`}
        >
          <div style={{ width: '14px', height: '14px', flexShrink: 0 }}>
            <Image src="/feedback.png" alt="Feedback" width={14} height={14} />
          </div>
          <span className="text-neutral-800 text-sm font-medium font-sans">
            Feedback
          </span>
        </div>

        <Link href="/integrations">
          <div 
            onClick={() => handleClick('Integrations')}
            className={`flex items-center gap-3 px-4 py-3 rounded cursor-pointer transition-colors ${
              activeItem === 'Integrations' ? 'bg-[#FFE2BF]' : 'hover:bg-secondary'
            }`}
          >
            <div style={{ width: '14px', height: '14px', flexShrink: 0 }}>
              <Image src="/Integrations.png" alt="Integrations" width={14} height={14} />
            </div>
            <span className="text-neutral-800 text-sm font-medium font-sans">
              Integrations
            </span>
          </div>
        </Link>

        <Link href="/settings">
          <div 
            onClick={() => handleClick('Settings')}
            className={`flex items-center gap-3 px-4 py-3 rounded cursor-pointer transition-colors ${
              activeItem === 'Settings' ? 'bg-[#FFE2BF]' : 'hover:bg-secondary'
            }`}
          >
            <div style={{ width: '14px', height: '14px', flexShrink: 0 }}>
              <Image src="/Settings.png" alt="Settings" width={14} height={14} />
            </div>
            <span className="text-neutral-800 text-sm font-medium font-sans">
              Settings
            </span>
          </div>
        </Link>

        {/* User Profile */}
        <div className="flex items-center gap-3 px-4 py-3 mt-4">
          <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
            <Image src="/Maya.png" alt="Rishit" width={40} height={40} />
          </div>
          <div>
            <div className="text-neutral-800 text-sm font-medium">Rishit</div>
            <div className="text-gray-500 text-xs">Account settings</div>
          </div>
        </div>
      </div>
    </div>
  )
}
