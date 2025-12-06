import { createFileRoute, Link } from '@tanstack/react-router'
import { StandardLayout } from '../layouts/StandardLayout'
import { Button } from '../components'
import { Briefcase, Users, Zap, Shield, Search, TrendingUp } from 'lucide-react'

export const Route = createFileRoute('/')({ component: HomePage })

function HomePage() {
  const features = [
    {
      icon: <Briefcase size={40} />,
      title: 'Post Jobs Easily',
      description: 'Create and manage job postings in minutes. Reach qualified candidates faster.',
    },
    {
      icon: <Users size={40} />,
      title: 'Find Top Talent',
      description: 'Connect with skilled professionals ready to join your team.',
    },
    {
      icon: <Search size={40} />,
      title: 'Smart Matching',
      description: 'Our algorithm matches the right candidates with the right opportunities.',
    },
    {
      icon: <Shield size={40} />,
      title: 'Secure Platform',
      description: 'Your data is protected with enterprise-level security measures.',
    },
    {
      icon: <Zap size={40} />,
      title: 'Fast Hiring',
      description: 'Streamlined process helps you hire faster than traditional methods.',
    },
    {
      icon: <TrendingUp size={40} />,
      title: 'Grow Your Career',
      description: 'Access thousands of job opportunities and advance your career.',
    },
  ]

  return (
    <StandardLayout showAuth={true}>
      {/* Hero Section */}
      <section className="relative py-20 px-6 overflow-hidden" style={{ backgroundColor: '#4a2c49' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6" style={{ color: '#f8eee7' }}>
              Welcome to CEPATHIRE
            </h1>
            <p className="text-xl md:text-2xl mb-4" style={{ color: '#f8eee7', opacity: 0.9 }}>
              Connect Talent with Opportunity
            </p>
            <p className="text-lg mb-8 max-w-2xl mx-auto" style={{ color: '#f8eee7', opacity: 0.8 }}>
              Whether you're looking to hire the best talent or find your dream job,
              CEPATHIRE makes it fast, easy, and efficient.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/auth/register">
                <Button variant="secondary" size="lg">
                  Get Started
                </Button>
              </Link>
              <Link to="/auth/login">
                <Button variant="outline" size="lg">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4" style={{ color: '#94618e' }}>
              Why Choose CEPATHIRE?
            </h2>
            <p className="text-lg" style={{ color: '#94618e', opacity: 0.8 }}>
              Everything you need for successful hiring and job searching
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 rounded-2xl transition-all duration-300 hover:scale-105"
                style={{
                  backgroundColor: '#ffffff',
                  border: '2px solid #d1c4cc',
                }}
              >
                <div
                  className="mb-4 inline-block p-4 rounded-full"
                  style={{ backgroundColor: '#f8eee7', color: '#94618e' }}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3" style={{ color: '#94618e' }}>
                  {feature.title}
                </h3>
                <p style={{ color: '#94618e', opacity: 0.7 }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6" style={{ backgroundColor: '#f8eee7' }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4" style={{ color: '#94618e' }}>
            Ready to Get Started?
          </h2>
          <p className="text-lg mb-8" style={{ color: '#94618e', opacity: 0.8 }}>
            Join thousands of employers and job seekers already using CEPATHIRE
          </p>
          <div className="flex justify-center">
            <Link to="/auth/register">
              <Button variant="primary" size="lg">
                Create Your Account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4" style={{ color: '#94618e' }}>
              Meet Our Team
            </h2>
            <p className="text-lg" style={{ color: '#94618e', opacity: 0.8 }}>
              The talented developers behind CEPATHIRE
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: 'Haziq Ilham',
                role: 'Full Stack Developer',
                image: '/members/haziq.jpeg',
                linkedin: 'haziq-ilham'
              },
              {
                name: 'Muhammad Wafiq',
                role: 'Full Stack Developer',
                image: '/members/wafiq.jpeg',
                linkedin: 'muhammad-wafiq-bin-shukri-wafiqi'
              },
              {
                name: 'Afrina',
                role: 'Full Stack Developer',
                image: '/members/afrina.jpeg',
                linkedin: ''
              },
              {
                name: 'Imran',
                role: 'Full Stack Developer',
                image: '/members/imran.jpg',
                linkedin: ''
              }
            ].map((member) => {
              const content = (
                <>
                  <div
                    className="w-48 h-48 mx-auto mb-4 rounded-full overflow-hidden"
                    style={{
                      backgroundColor: '#f8eee7',
                      border: '4px solid #94618e',
                    }}
                  >
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-bold mb-2" style={{ color: '#94618e' }}>
                    {member.name}
                  </h3>
                  <p style={{ color: '#94618e', opacity: 0.7 }}>
                    {member.role}
                  </p>
                </>
              )

              return (
                <div
                  key={member.name}
                  className="text-center transition-all duration-300 hover:scale-105"
                >
                  {member.linkedin ? (
                    <a
                      href={`https://www.linkedin.com/in/${member.linkedin}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      {content}
                    </a>
                  ) : (
                    <div>{content}</div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="text-5xl font-bold mb-2" style={{ color: '#94618e' }}>
                10K+
              </div>
              <div className="text-lg" style={{ color: '#94618e', opacity: 0.7 }}>
                Active Jobs
              </div>
            </div>
            <div className="p-6">
              <div className="text-5xl font-bold mb-2" style={{ color: '#94618e' }}>
                50K+
              </div>
              <div className="text-lg" style={{ color: '#94618e', opacity: 0.7 }}>
                Job Seekers
              </div>
            </div>
            <div className="p-6">
              <div className="text-5xl font-bold mb-2" style={{ color: '#94618e' }}>
                5K+
              </div>
              <div className="text-lg" style={{ color: '#94618e', opacity: 0.7 }}>
                Companies
              </div>
            </div>
          </div>
        </div>
      </section>
    </StandardLayout>
  )
}
