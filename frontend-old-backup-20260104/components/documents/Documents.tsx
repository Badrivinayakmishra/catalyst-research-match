'use client'

import React, { useState, useEffect } from 'react'
import Sidebar from '../shared/Sidebar'
import Image from 'next/image'
import axios from 'axios'

const API_BASE = 'http://localhost:5003/api'

interface Document {
  id: string
  name: string
  created: string
  lastModified: string
  type: string
  description: string
  category: 'Meetings' | 'Documents' | 'Personal Items' | 'Other Items'
  selected: boolean
}

const CategoryCard = ({ icon, title, count, active, onClick, color }: any) => (
  <div
    onClick={onClick}
    className={`flex flex-col items-start justify-center gap-1 cursor-pointer transition-all ${
      active ? 'ring-2 ring-[#081028]' : ''
    }`}
    style={{
      width: '243px',
      height: '80px',
      padding: '16px',
      borderRadius: '8px',
      backgroundColor: '#FFE2BF'
    }}
  >
    <div className="flex items-center gap-2 w-full">
      <div
        style={{
          width: '39.816px',
          height: '40px',
          borderRadius: '80px',
          opacity: 0.2,
          backgroundColor: color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}
      >
        <Image 
          src={icon} 
          alt={title} 
          width={20} 
          height={20}
          style={{ opacity: 1 }}
        />
      </div>
      <div className="flex flex-col">
        <span
          style={{
            color: '#081028',
            fontFamily: '"Work Sans", sans-serif',
            fontSize: '16px',
            fontWeight: 500,
            lineHeight: '18px'
          }}
        >
          {title}
        </span>
        <span
          style={{
            color: '#081028',
            fontFamily: '"Work Sans", sans-serif',
            fontSize: '12px',
            fontWeight: 400,
            lineHeight: '18px'
          }}
        >
          {count.toLocaleString()}
        </span>
      </div>
    </div>
  </div>
)

export default function Documents() {
  const [activeItem, setActiveItem] = useState('Documents')
  const [documents, setDocuments] = useState<Document[]>([])
  const [activeCategory, setActiveCategory] = useState<string>('All')
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDocuments()
  }, [])

  // Mock personal documents for demo
  const mockPersonalDocs: Document[] = [
    {
      id: 'personal_1',
      name: 'Family Vacation Planning 2025',
      created: '2025-01-10',
      lastModified: '2025-01-28',
      type: 'Personal Note',
      description: 'Planning details for summer vacation to Hawaii with family',
      category: 'Personal Items',
      selected: false
    },
    {
      id: 'personal_2',
      name: 'Birthday Party Guest List',
      created: '2025-01-05',
      lastModified: '2025-01-25',
      type: 'Personal Note',
      description: 'Guest list and party planning for upcoming birthday celebration',
      category: 'Personal Items',
      selected: false
    },
    {
      id: 'personal_3',
      name: 'Home Renovation Budget',
      created: '2024-12-15',
      lastModified: '2025-01-20',
      type: 'Spreadsheet',
      description: 'Budget tracking for kitchen renovation project',
      category: 'Personal Items',
      selected: false
    },
    {
      id: 'personal_4',
      name: 'Personal Investment Portfolio',
      created: '2024-11-20',
      lastModified: '2025-01-15',
      type: 'Financial Doc',
      description: 'Personal stock and bond investment tracking document',
      category: 'Personal Items',
      selected: false
    },
    {
      id: 'personal_5',
      name: 'Gym Membership & Fitness Goals',
      created: '2025-01-01',
      lastModified: '2025-01-22',
      type: 'Personal Note',
      description: 'New year fitness goals and gym schedule planning',
      category: 'Personal Items',
      selected: false
    },
    {
      id: 'personal_6',
      name: 'Recipe Collection - Italian Dishes',
      created: '2024-10-15',
      lastModified: '2025-01-18',
      type: 'Personal Note',
      description: 'Collection of favorite Italian recipes from grandma',
      category: 'Personal Items',
      selected: false
    }
  ]

  const loadDocuments = async () => {
    try {
      // Load actual emails from the backend
      const response = await axios.get(`${API_BASE}/all-emails`)
      if (response.data.success) {
        const emails = response.data.emails

        // Create documents from emails with categorization
        const docs: Document[] = emails.map((email: any, index: number) => {
          // Categorize based on subject and content
          let category: any = 'Other Items'
          const subject = email.subject?.toLowerCase() || ''
          const content = email.content?.toLowerCase() || ''

          // Meetings - look for meeting keywords
          if (subject.includes('meeting') || subject.includes('schedule') ||
              subject.includes('agenda') || subject.includes('discussion') ||
              content.includes('meeting') || content.includes('conference call')) {
            category = 'Meetings'
          }
          // Documents - look for document/report keywords
          else if (subject.includes('report') || subject.includes('analysis') ||
                   subject.includes('document') || subject.includes('presentation') ||
                   subject.includes('agreement') || subject.includes('contract')) {
            category = 'Documents'
          }
          // Personal - look for personal keywords
          else if (subject.includes('personal') || subject.includes('private') ||
                   email.from?.includes('personal') || subject.includes('lunch') ||
                   subject.includes('dinner') || subject.includes('party')) {
            category = 'Personal Items'
          }

          return {
            id: email.id || `email_${index}`,
            name: email.subject || 'No Subject',
            created: email.date || '2025-01-15',
            lastModified: email.date || '2025-01-15',
            type: 'Email',
            description: email.content ? email.content.substring(0, 80) : 'No content',
            category,
            selected: false
          }
        })

        // Add mock personal documents
        setDocuments([...docs, ...mockPersonalDocs])
      }
    } catch (error) {
      console.error('Error loading documents:', error)
      // Fallback: just use mock personal documents
      setDocuments(mockPersonalDocs)
    } finally {
      setLoading(false)
    }
  }

  const getCategoryCounts = () => {
    return {
      meetings: documents.filter(d => d.category === 'Meetings').length,
      documents: documents.filter(d => d.category === 'Documents').length,
      personal: documents.filter(d => d.category === 'Personal Items').length,
      other: documents.filter(d => d.category === 'Other Items').length
    }
  }

  const getFilteredDocuments = () => {
    if (activeCategory === 'All') return documents
    return documents.filter(d => d.category === activeCategory)
  }

  const getPaginatedDocuments = () => {
    const filtered = getFilteredDocuments()
    const start = (currentPage - 1) * rowsPerPage
    const end = start + rowsPerPage
    return filtered.slice(start, end)
  }

  const toggleDocument = (id: string) => {
    setDocuments(docs => docs.map(d => 
      d.id === id ? { ...d, selected: !d.selected } : d
    ))
  }

  const deleteSelected = () => {
    setDocuments(docs => docs.filter(d => !d.selected))
    setCurrentPage(1) // Reset to first page after deletion
  }

  const hasSelectedDocs = documents.some(d => d.selected)

  const counts = getCategoryCounts()
  const filteredDocs = getFilteredDocuments()
  const paginatedDocs = getPaginatedDocuments()
  const totalPages = Math.ceil(filteredDocs.length / rowsPerPage)

  return (
    <div className="flex h-screen bg-primary overflow-hidden">
      <Sidebar activeItem={activeItem} onItemClick={setActiveItem} />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-4 bg-primary">
          <h1
            style={{
              color: '#081028',
              fontFamily: '"Work Sans", sans-serif',
              fontSize: '20px',
              fontWeight: 600,
              lineHeight: '22px'
            }}
          >
            Knowledge Hub
          </h1>

          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Search for..."
              style={{
                width: '352px',
                height: '42px',
                padding: '0 16px',
                borderRadius: '4px',
                border: '0.6px solid #7E89AC',
                backgroundColor: '#FFE2BF',
                outline: 'none',
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px'
              }}
            />

            <button
              style={{
                display: 'flex',
                width: '137px',
                height: '42px',
                padding: '0 16px',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: '4px',
                backgroundColor: '#FFE2BF',
                border: 'none',
                cursor: 'pointer',
                fontFamily: '"Work Sans", sans-serif',
                fontSize: '14px',
                fontWeight: 500
              }}
            >
              Share
            </button>

            <button
              style={{
                display: 'flex',
                width: '137px',
                height: '42px',
                padding: '0 16px',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: '4px',
                backgroundColor: '#FFE2BF',
                border: 'none',
                cursor: 'pointer',
                fontFamily: '"Work Sans", sans-serif',
                fontSize: '14px',
                fontWeight: 500
              }}
            >
              Add Documents
            </button>
          </div>
        </div>

        {/* Category Cards */}
        <div className="px-8 py-4 bg-primary">
          <div style={{ display: 'inline-flex', alignItems: 'flex-start', gap: '30px' }}>
            <CategoryCard
              icon="/meetings.png"
              title="Meetings"
              count={counts.meetings}
              color="#CB3CFF"
              active={activeCategory === 'Meetings'}
              onClick={() => setActiveCategory('Meetings')}
            />
            <CategoryCard
              icon="/docs.png"
              title="Documents"
              count={counts.documents}
              color="#05C168"
              active={activeCategory === 'Documents'}
              onClick={() => setActiveCategory('Documents')}
            />
            <CategoryCard
              icon="/personal.svg"
              title="Personal Items"
              count={counts.personal}
              color="#FDB52A"
              active={activeCategory === 'Personal Items'}
              onClick={() => setActiveCategory('Personal Items')}
            />
            <CategoryCard
              icon="/other.svg"
              title="Other Items"
              count={counts.other}
              color="#086CD9"
              active={activeCategory === 'Other Items'}
              onClick={() => setActiveCategory('Other Items')}
            />
          </div>
        </div>

        {/* Documents Table */}
        <div className="flex-1 px-8 py-4 bg-primary overflow-hidden flex items-start">
          <div
            style={{
              width: '1060px',
              maxHeight: '668px',
              borderRadius: '12px',
              border: '1px solid #081028',
              backgroundColor: '#FFE2BF',
              boxShadow: '1px 1px 1px 0 rgba(16, 25, 52, 0.40)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              position: 'relative'
            }}
          >
            {/* Delete all button - positioned absolutely */}
            {hasSelectedDocs && (
              <button
                onClick={deleteSelected}
                style={{
                  position: 'absolute',
                  right: '16px',
                  top: '16px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: '#081028',
                  fontFamily: '"Work Sans"',
                  fontSize: '10px',
                  fontWeight: 600,
                  lineHeight: '10px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  backgroundColor: '#FFE2BF',
                  zIndex: 10
                }}
              >
                <div
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '2px',
                    border: '0.6px solid #CB3CFF',
                    backgroundColor: '#CB3CFF',
                    boxShadow: '1px 1px 1px 0 rgba(16, 25, 52, 0.40)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Image src="/check.svg" alt="checked" width={6} height={5} />
                </div>
                Delete all
              </button>
            )}
            
            {/* Table Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '16px',
                borderBottom: '1px solid #000',
                backgroundColor: '#FFE2BF'
              }}
            >
              <div style={{ width: '40px' }}></div>
              <div style={{ flex: 1, color: '#081028', fontFamily: '"Work Sans"', fontSize: '13px', fontWeight: 500 }}>
                Document name
              </div>
              <div style={{ width: '150px', color: '#081028', fontFamily: '"Work Sans"', fontSize: '13px', fontWeight: 500 }}>
                Created
              </div>
              <div style={{ width: '150px', color: '#081028', fontFamily: '"Work Sans"', fontSize: '13px', fontWeight: 500 }}>
                Last Modified
              </div>
              <div style={{ width: '150px', color: '#081028', fontFamily: '"Work Sans"', fontSize: '13px', fontWeight: 500 }}>
                Document Type
              </div>
              <div style={{ width: '200px', color: '#081028', fontFamily: '"Work Sans"', fontSize: '13px', fontWeight: 500 }}>
                Description
              </div>
            </div>

            {/* Table Body */}
            <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
              {loading ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px' }}>
                  <span style={{ fontFamily: '"Work Sans"', fontSize: '14px', color: '#081028' }}>
                    Loading documents...
                  </span>
                </div>
              ) : paginatedDocs.length === 0 ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px' }}>
                  <span style={{ fontFamily: '"Work Sans"', fontSize: '14px', color: '#081028' }}>
                    No documents found. Make sure Flask backend is running.
                  </span>
                </div>
              ) : (
                paginatedDocs.map((doc, index) => (
                  <div
                    key={doc.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '16px',
                      minHeight: '61px',
                      borderBottom: '1px solid #000',
                      backgroundColor: index % 2 === 0 ? '#FFE2BF' : '#FFF3E4'
                    }}
                  >
                    <div style={{ width: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <div
                        onClick={() => toggleDocument(doc.id)}
                        style={{
                          width: '12px',
                          height: '12px',
                          borderRadius: '2px',
                          border: '0.6px solid #CB3CFF',
                          backgroundColor: doc.selected ? '#CB3CFF' : 'transparent',
                          boxShadow: '1px 1px 1px 0 rgba(16, 25, 52, 0.40)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        {doc.selected && (
                          <Image src="/check.svg" alt="checked" width={6} height={5} />
                        )}
                      </div>
                    </div>
                    <div style={{ flex: 1, color: '#081028', fontFamily: '"Work Sans"', fontSize: '13px', fontWeight: 400, lineHeight: '16px' }}>
                      {doc.name}
                    </div>
                    <div style={{ width: '150px', color: '#081028', fontFamily: '"Work Sans"', fontSize: '13px', fontWeight: 400, lineHeight: '16px' }}>
                      {doc.created}
                    </div>
                    <div style={{ width: '150px', color: '#081028', fontFamily: '"Work Sans"', fontSize: '13px', fontWeight: 400, lineHeight: '16px' }}>
                      {doc.lastModified}
                    </div>
                    <div style={{ width: '150px', color: '#081028', fontFamily: '"Work Sans"', fontSize: '13px', fontWeight: 400, lineHeight: '16px' }}>
                      {doc.type}
                    </div>
                    <div style={{ width: '200px', color: '#081028', fontFamily: '"Work Sans"', fontSize: '13px', fontWeight: 400, lineHeight: '16px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {doc.description}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pagination Footer */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px',
                borderTop: '1px solid #000',
                backgroundColor: '#FFE2BF'
              }}
            >
              <span
                style={{
                  color: '#081028',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '12px',
                  fontWeight: 500,
                  lineHeight: '18px'
                }}
              >
                {((currentPage - 1) * rowsPerPage) + 1} - {Math.min(currentPage * rowsPerPage, filteredDocs.length)} of {filteredDocs.length}
              </span>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span
                  style={{
                    color: '#081028',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '12px',
                    fontWeight: 500,
                    lineHeight: '18px'
                  }}
                >
                  Rows per page:
                </span>
                <select
                  value={rowsPerPage}
                  onChange={(e) => setRowsPerPage(Number(e.target.value))}
                  style={{
                    padding: '6px 8px',
                    borderRadius: '4px',
                    border: '0.6px solid #0B1739',
                    backgroundColor: '#FFE2BF',
                    boxShadow: '1px 1px 1px 0 rgba(16, 25, 52, 0.40)',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>

                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  style={{
                    display: 'flex',
                    padding: '6px',
                    borderRadius: '4px',
                    border: '0.6px solid #0B1739',
                    backgroundColor: '#FFE2BF',
                    boxShadow: '1px 1px 1px 0 rgba(16, 25, 52, 0.40)',
                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                    opacity: currentPage === 1 ? 0.5 : 1
                  }}
                >
                  <Image src="/left.svg" alt="Previous" width={16} height={16} />
                </button>

                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  style={{
                    display: 'flex',
                    padding: '6px',
                    borderRadius: '4px',
                    border: '0.6px solid #0B1739',
                    backgroundColor: '#FFE2BF',
                    boxShadow: '1px 1px 1px 0 rgba(16, 25, 52, 0.40)',
                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                    opacity: currentPage === totalPages ? 0.5 : 1
                  }}
                >
                  <Image src="/right.svg" alt="Next" width={16} height={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
