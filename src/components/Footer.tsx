import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Github,
} from 'lucide-react'

export const Footer = () => {
  return (
    <footer className="shadow-inner" style={{ backgroundColor: '#f8eee7' }}>
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4" style={{ color: '#94618e' }}>
              CEPATHIRE
            </h3>
            <p className="text-sm mb-4" style={{ color: '#94618e' }}>
              Your trusted partner in finding the perfect talent for your business needs.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm" style={{ color: '#94618e' }}>
                <Mail size={16} />
                <span>contact@cepathire.com</span>
              </div>
              <div className="flex items-center gap-2 text-sm" style={{ color: '#94618e' }}>
                <Phone size={16} />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2 text-sm" style={{ color: '#94618e' }}>
                <MapPin size={16} />
                <span>123 Business St, Suite 100</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-4" style={{ color: '#94618e' }}>
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-sm hover:underline transition-all"
                  style={{ color: '#94618e' }}
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm hover:underline transition-all"
                  style={{ color: '#94618e' }}
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm hover:underline transition-all"
                  style={{ color: '#94618e' }}
                >
                  Services
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm hover:underline transition-all"
                  style={{ color: '#94618e' }}
                >
                  Careers
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm hover:underline transition-all"
                  style={{ color: '#94618e' }}
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm hover:underline transition-all"
                  style={{ color: '#94618e' }}
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* For Job Seekers */}
          <div>
            <h4 className="font-bold mb-4" style={{ color: '#94618e' }}>
              For Job Seekers
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-sm hover:underline transition-all"
                  style={{ color: '#94618e' }}
                >
                  Browse Jobs
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm hover:underline transition-all"
                  style={{ color: '#94618e' }}
                >
                  Job Alerts
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm hover:underline transition-all"
                  style={{ color: '#94618e' }}
                >
                  Resume Builder
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm hover:underline transition-all"
                  style={{ color: '#94618e' }}
                >
                  Career Advice
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm hover:underline transition-all"
                  style={{ color: '#94618e' }}
                >
                  Interview Tips
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm hover:underline transition-all"
                  style={{ color: '#94618e' }}
                >
                  Salary Guide
                </a>
              </li>
            </ul>
          </div>

          {/* For Employers */}
          <div>
            <h4 className="font-bold mb-4" style={{ color: '#94618e' }}>
              For Employers
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-sm hover:underline transition-all"
                  style={{ color: '#94618e' }}
                >
                  Post a Job
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm hover:underline transition-all"
                  style={{ color: '#94618e' }}
                >
                  Search Candidates
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm hover:underline transition-all"
                  style={{ color: '#94618e' }}
                >
                  Pricing Plans
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm hover:underline transition-all"
                  style={{ color: '#94618e' }}
                >
                  Hiring Solutions
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm hover:underline transition-all"
                  style={{ color: '#94618e' }}
                >
                  Employer Resources
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm hover:underline transition-all"
                  style={{ color: '#94618e' }}
                >
                  Recruiter Tools
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t-2" style={{ borderColor: '#94618e' }}>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6">
            {/* Social Links */}
            <div className="flex items-center gap-3 sm:gap-4">
              <a
                href="#"
                className="p-2 rounded-full transition-all duration-200 hover:scale-110"
                style={{ backgroundColor: '#94618e', color: '#f8eee7' }}
                aria-label="Facebook"
              >
                <Facebook size={18} className="sm:w-5 sm:h-5" />
              </a>
              <a
                href="#"
                className="p-2 rounded-full transition-all duration-200 hover:scale-110"
                style={{ backgroundColor: '#94618e', color: '#f8eee7' }}
                aria-label="Twitter"
              >
                <Twitter size={18} className="sm:w-5 sm:h-5" />
              </a>
              <a
                href="#"
                className="p-2 rounded-full transition-all duration-200 hover:scale-110"
                style={{ backgroundColor: '#94618e', color: '#f8eee7' }}
                aria-label="LinkedIn"
              >
                <Linkedin size={18} className="sm:w-5 sm:h-5" />
              </a>
              <a
                href="#"
                className="p-2 rounded-full transition-all duration-200 hover:scale-110"
                style={{ backgroundColor: '#94618e', color: '#f8eee7' }}
                aria-label="Instagram"
              >
                <Instagram size={18} className="sm:w-5 sm:h-5" />
              </a>
              <a
                href="#"
                className="p-2 rounded-full transition-all duration-200 hover:scale-110"
                style={{ backgroundColor: '#94618e', color: '#f8eee7' }}
                aria-label="GitHub"
              >
                <Github size={18} className="sm:w-5 sm:h-5" />
              </a>
            </div>

            {/* Legal Links */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm" style={{ color: '#94618e' }}>
              <a href="#" className="hover:underline transition-all whitespace-nowrap">
                Privacy Policy
              </a>
              <a href="#" className="hover:underline transition-all whitespace-nowrap">
                Terms of Service
              </a>
              <a href="#" className="hover:underline transition-all whitespace-nowrap">
                Cookie Policy
              </a>
            </div>

            {/* Copyright */}
            <div className="text-xs sm:text-sm text-center md:text-left" style={{ color: '#94618e' }}>
              © 2024 CEPATHIRE. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
