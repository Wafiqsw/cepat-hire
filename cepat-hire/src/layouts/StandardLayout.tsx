import { ReactNode } from 'react'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'

interface StandardLayoutProps {
  children: ReactNode
}

export const StandardLayout = ({ children }: StandardLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#faf9f7' }}>
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  )
}
