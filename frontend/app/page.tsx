'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to browse page by default
    router.push('/browse')
  }, [router])

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#FFF3E4'
    }}>
      <p style={{ fontFamily: '"Work Sans", sans-serif', fontSize: '18px', color: '#64748B' }}>
        Redirecting...
      </p>
    </div>
  )
}
