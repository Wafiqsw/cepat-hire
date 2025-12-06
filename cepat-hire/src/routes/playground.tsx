import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Button, Input, Checkbox, Radio, Modal, ModalActions, ImagePlaceholder, AvatarPlaceholder, JobCard, JobForm, WalletCard, WorkHistoryCard, ApplicantCard, PaymentCard } from '../components'
import { User, Building2, Camera } from 'lucide-react'

export const Route = createFileRoute('/playground')({
  component: RouteComponent,
})

function RouteComponent() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    bio: '',
    country: '',
    newsletter: false,
    gender: '',
  })

  const [modals, setModals] = useState({
    success: false,
    fail: false,
    archive: false,
    default: false,
  })

  const [jobFormOpen, setJobFormOpen] = useState(false)
  const [editingJob, setEditingJob] = useState<any>(null)

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: '#f8eee7' }}>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-2" style={{ color: '#94618e' }}>
          Component Playground
        </h1>
        <p className="text-lg mb-8" style={{ color: '#94618e', opacity: 0.8 }}>
          Explore all CEPATHIRE components with the purple & cream theme
        </p>

        {/* Buttons Section */}
        <section className="mb-12 p-6 rounded-lg shadow-lg" style={{ backgroundColor: '#ffffff' }}>
          <h2 className="text-2xl font-bold mb-4" style={{ color: '#94618e' }}>
            Buttons
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3" style={{ color: '#94618e' }}>Variants</h3>
              <div className="flex flex-wrap gap-3">
                <Button variant="primary">Primary Button</Button>
                <Button variant="secondary">Secondary Button</Button>
                <Button variant="outline">Outline Button</Button>
                <Button variant="ghost">Ghost Button</Button>
                <Button variant="danger">Danger Button</Button>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3" style={{ color: '#94618e' }}>Sizes</h3>
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="primary" size="sm">Small</Button>
                <Button variant="primary" size="md">Medium</Button>
                <Button variant="primary" size="lg">Large</Button>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3" style={{ color: '#94618e' }}>States</h3>
              <div className="flex flex-wrap gap-3">
                <Button variant="primary" loading>Loading...</Button>
                <Button variant="secondary" disabled>Disabled</Button>
                <Button variant="outline" fullWidth>Full Width Button</Button>
              </div>
            </div>
          </div>
        </section>

        {/* Inputs Section */}
        <section className="mb-12 p-6 rounded-lg shadow-lg" style={{ backgroundColor: '#ffffff' }}>
          <h2 className="text-2xl font-bold mb-4" style={{ color: '#94618e' }}>
            Input Fields
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Full Name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              helperText="This is a helper text"
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="your.email@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />

            <Input
              label="Password"
              type="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              helperText="Password must be at least 8 characters"
            />

            <Input
              as="select"
              label="Country"
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              options={[
                { value: '', label: 'Select a country' },
                { value: 'us', label: 'United States' },
                { value: 'uk', label: 'United Kingdom' },
                { value: 'ca', label: 'Canada' },
                { value: 'au', label: 'Australia' },
              ]}
            />

            <div className="md:col-span-2">
              <Input
                as="textarea"
                label="Bio"
                placeholder="Tell us about yourself..."
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={4}
              />
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3" style={{ color: '#94618e' }}>Input Sizes</h3>
            <div className="space-y-3">
              <Input size="sm" placeholder="Small input" />
              <Input size="md" placeholder="Medium input" />
              <Input size="lg" placeholder="Large input" />
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3" style={{ color: '#94618e' }}>Error State</h3>
            <Input
              label="Username"
              placeholder="Enter username"
              error="This username is already taken"
            />
          </div>
        </section>

        {/* Checkboxes & Radios Section */}
        <section className="mb-12 p-6 rounded-lg shadow-lg" style={{ backgroundColor: '#ffffff' }}>
          <h2 className="text-2xl font-bold mb-4" style={{ color: '#94618e' }}>
            Checkboxes & Radio Buttons
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3" style={{ color: '#94618e' }}>Checkboxes</h3>
              <div className="space-y-2">
                <Checkbox label="Subscribe to newsletter" />
                <Checkbox label="I agree to terms and conditions" />
                <Checkbox label="Send me promotional emails" defaultChecked />
              </div>

              <div className="mt-4">
                <p className="text-sm mb-2" style={{ color: '#94618e' }}>Sizes:</p>
                <div className="flex gap-4">
                  <Checkbox label="Small" size="sm" />
                  <Checkbox label="Medium" size="md" />
                  <Checkbox label="Large" size="lg" />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3" style={{ color: '#94618e' }}>Radio Buttons</h3>
              <div className="space-y-2">
                <Radio
                  label="Male"
                  name="gender"
                  value="male"
                  checked={formData.gender === 'male'}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                />
                <Radio
                  label="Female"
                  name="gender"
                  value="female"
                  checked={formData.gender === 'female'}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                />
                <Radio
                  label="Other"
                  name="gender"
                  value="other"
                  checked={formData.gender === 'other'}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                />
              </div>

              <div className="mt-4">
                <p className="text-sm mb-2" style={{ color: '#94618e' }}>Sizes:</p>
                <div className="flex gap-4">
                  <Radio label="Small" name="size-demo" size="sm" />
                  <Radio label="Medium" name="size-demo" size="md" />
                  <Radio label="Large" name="size-demo" size="lg" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Form Example */}
        <section className="mb-12 p-6 rounded-lg shadow-lg" style={{ backgroundColor: '#ffffff' }}>
          <h2 className="text-2xl font-bold mb-4" style={{ color: '#94618e' }}>
            Complete Form Example
          </h2>

          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="First Name" placeholder="John" required />
              <Input label="Last Name" placeholder="Doe" required />
            </div>

            <Input
              label="Email"
              type="email"
              placeholder="john.doe@example.com"
              required
            />

            <Input
              label="Phone Number"
              type="tel"
              placeholder="+1 (555) 123-4567"
            />

            <Input
              as="select"
              label="Department"
              required
              options={[
                { value: '', label: 'Select department' },
                { value: 'engineering', label: 'Engineering' },
                { value: 'marketing', label: 'Marketing' },
                { value: 'sales', label: 'Sales' },
                { value: 'hr', label: 'Human Resources' },
              ]}
            />

            <Input
              as="textarea"
              label="Message"
              placeholder="Tell us more about your inquiry..."
              rows={4}
            />

            <Checkbox label="I agree to the privacy policy" />

            <div className="flex gap-3 pt-4">
              <Button variant="primary" type="submit">Submit Application</Button>
              <Button variant="outline" type="button">Clear Form</Button>
            </div>
          </form>
        </section>

        {/* Job Cards Section */}
        <section className="mb-12 p-6 rounded-lg shadow-lg" style={{ backgroundColor: '#ffffff' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold" style={{ color: '#94618e' }}>
              Job Cards
            </h2>
            <Button
              variant="primary"
              onClick={() => {
                setEditingJob(null)
                setJobFormOpen(true)
              }}
            >
              + Create New Job
            </Button>
          </div>

          <div className="space-y-8">
            {/* Employer View */}
            <div>
              <h3 className="text-lg font-semibold mb-4" style={{ color: '#94618e' }}>Employer View</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <JobCard
                  variant="employer"
                  job={{
                    id: '1',
                    title: 'Senior Frontend Developer',
                    company: 'CEPATHIRE Inc.',
                    location: 'San Francisco, CA',
                    type: 'Full-time',
                    salary: '$120k - $150k',
                    postedDate: '2 days ago',
                    description: 'We are looking for an experienced frontend developer to join our team and help build amazing user experiences.',
                  }}
                  onEdit={(id) => {
                    setEditingJob({
                      id: '1',
                      title: 'Senior Frontend Developer',
                      company: 'CEPATHIRE Inc.',
                      location: 'San Francisco, CA',
                      type: 'Full-time',
                      salary: '$120k - $150k',
                      description: 'We are looking for an experienced frontend developer to join our team and help build amazing user experiences.',
                      requirements: 'Strong React skills, TypeScript experience, 5+ years of frontend development',
                      benefits: 'Health insurance, 401k, unlimited PTO',
                      isRemote: false,
                      isActive: true,
                    })
                    setJobFormOpen(true)
                  }}
                  onDelete={(id) => console.log('Delete job:', id)}
                />
                <JobCard
                  variant="employer"
                  job={{
                    id: '2',
                    title: 'UX/UI Designer',
                    company: 'CEPATHIRE Inc.',
                    location: 'Remote',
                    type: 'Contract',
                    salary: '$80k - $100k',
                    postedDate: '5 days ago',
                    description: 'Join our design team to create beautiful and intuitive interfaces for our products.',
                  }}
                  onEdit={(id) => {
                    setEditingJob({
                      id: '2',
                      title: 'UX/UI Designer',
                      company: 'CEPATHIRE Inc.',
                      location: 'Remote',
                      type: 'Contract',
                      salary: '$80k - $100k',
                      description: 'Join our design team to create beautiful and intuitive interfaces for our products.',
                      requirements: 'Portfolio required, Figma expertise, strong UX principles',
                      benefits: 'Flexible hours, remote work, design tools budget',
                      isRemote: true,
                      isActive: true,
                    })
                    setJobFormOpen(true)
                  }}
                  onDelete={(id) => console.log('Delete job:', id)}
                />
              </div>
            </div>

            {/* Seeker View */}
            <div>
              <h3 className="text-lg font-semibold mb-4" style={{ color: '#94618e' }}>Job Seeker View</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <JobCard
                  variant="seeker"
                  job={{
                    id: '3',
                    title: 'Backend Engineer',
                    company: 'Tech Solutions Ltd.',
                    location: 'New York, NY',
                    type: 'Full-time',
                    salary: '$130k - $160k',
                    postedDate: '1 day ago',
                    description: 'Build scalable backend systems and APIs. Work with modern technologies and cloud infrastructure.',
                  }}
                  onApply={(id) => console.log('Apply to job:', id)}
                  onSave={(id) => console.log('Save job:', id)}
                />
                <JobCard
                  variant="seeker"
                  job={{
                    id: '4',
                    title: 'Product Manager',
                    company: 'Innovation Corp',
                    location: 'Austin, TX',
                    type: 'Full-time',
                    salary: '$110k - $140k',
                    postedDate: '3 days ago',
                    description: 'Lead product strategy and work with cross-functional teams to deliver exceptional products.',
                  }}
                  onApply={(id) => console.log('Apply to job:', id)}
                  onSave={(id) => console.log('Save job:', id)}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Image Placeholders Section */}
        <section className="mb-12 p-6 rounded-lg shadow-lg" style={{ backgroundColor: '#ffffff' }}>
          <h2 className="text-2xl font-bold mb-4" style={{ color: '#94618e' }}>
            Image Placeholders
          </h2>

          <div className="space-y-8">
            {/* Shapes */}
            <div>
              <h3 className="text-lg font-semibold mb-4" style={{ color: '#94618e' }}>Shapes</h3>
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex flex-col items-center gap-2">
                  <ImagePlaceholder shape="circle" size="md" />
                  <span className="text-sm" style={{ color: '#94618e' }}>Circle</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <ImagePlaceholder shape="square" size="md" />
                  <span className="text-sm" style={{ color: '#94618e' }}>Square</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <ImagePlaceholder shape="rounded" size="md" />
                  <span className="text-sm" style={{ color: '#94618e' }}>Rounded</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <ImagePlaceholder shape="rectangle" size="md" />
                  <span className="text-sm" style={{ color: '#94618e' }}>Rectangle</span>
                </div>
              </div>
            </div>

            {/* Sizes */}
            <div>
              <h3 className="text-lg font-semibold mb-4" style={{ color: '#94618e' }}>Sizes</h3>
              <div className="flex flex-wrap items-end gap-6">
                <div className="flex flex-col items-center gap-2">
                  <ImagePlaceholder size="sm" />
                  <span className="text-sm" style={{ color: '#94618e' }}>Small</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <ImagePlaceholder size="md" />
                  <span className="text-sm" style={{ color: '#94618e' }}>Medium</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <ImagePlaceholder size="lg" />
                  <span className="text-sm" style={{ color: '#94618e' }}>Large</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <ImagePlaceholder size="xl" />
                  <span className="text-sm" style={{ color: '#94618e' }}>Extra Large</span>
                </div>
              </div>
            </div>

            {/* With Icons and Text */}
            <div>
              <h3 className="text-lg font-semibold mb-4" style={{ color: '#94618e' }}>Custom Icons & Text</h3>
              <div className="flex flex-wrap items-center gap-6">
                <ImagePlaceholder
                  size="md"
                  icon={<User size={32} style={{ color: '#94618e' }} />}
                  text="User Photo"
                />
                <ImagePlaceholder
                  size="md"
                  icon={<Building2 size={32} style={{ color: '#94618e' }} />}
                  text="Company Logo"
                />
                <ImagePlaceholder
                  size="md"
                  uploadable
                  text="Click to Upload"
                  onUpload={(file) => console.log('Uploaded:', file.name)}
                />
              </div>
            </div>

            {/* Avatars */}
            <div>
              <h3 className="text-lg font-semibold mb-4" style={{ color: '#94618e' }}>Avatar Placeholders</h3>
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex flex-col items-center gap-2">
                  <AvatarPlaceholder name="John Doe" size="md" />
                  <span className="text-sm" style={{ color: '#94618e' }}>With Name</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <AvatarPlaceholder size="md" type="user" />
                  <span className="text-sm" style={{ color: '#94618e' }}>User Icon</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <AvatarPlaceholder size="md" type="company" />
                  <span className="text-sm" style={{ color: '#94618e' }}>Company Icon</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <AvatarPlaceholder
                    name="Sarah Smith"
                    size="md"
                    uploadable
                    onUpload={(file) => console.log('Avatar uploaded:', file.name)}
                  />
                  <span className="text-sm" style={{ color: '#94618e' }}>Uploadable</span>
                </div>
              </div>
            </div>

            {/* Different Sizes */}
            <div>
              <h3 className="text-lg font-semibold mb-4" style={{ color: '#94618e' }}>Avatar Sizes</h3>
              <div className="flex flex-wrap items-end gap-6">
                <AvatarPlaceholder name="AB" size="sm" />
                <AvatarPlaceholder name="CD" size="md" />
                <AvatarPlaceholder name="EF" size="lg" />
                <AvatarPlaceholder name="GH" size="xl" />
              </div>
            </div>
          </div>
        </section>

        {/* Wallet, Work History & Applicants Section */}
        <section className="mb-12 p-6 rounded-lg shadow-lg" style={{ backgroundColor: '#ffffff' }}>
          <h2 className="text-2xl font-bold mb-6" style={{ color: '#94618e' }}>
            Additional Components
          </h2>

          <div className="space-y-8">
            {/* Wallet Card */}
            <div>
              <h3 className="text-lg font-semibold mb-4" style={{ color: '#94618e' }}>Wallet Component</h3>
              <div className="max-w-md">
                <WalletCard
                  balance={15750.50}
                  currency="RM"
                  onWithdraw={() => console.log('Withdraw clicked')}
                />
              </div>
            </div>

            {/* Work History */}
            <div>
              <h3 className="text-lg font-semibold mb-4" style={{ color: '#94618e' }}>Work History Cards</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <WorkHistoryCard
                  work={{
                    id: '1',
                    position: 'Senior Software Engineer',
                    company: 'Tech Corp Malaysia',
                    location: 'Kuala Lumpur, Malaysia',
                    startDate: 'Jan 2021',
                    endDate: 'Dec 2023',
                    description: 'Led development of microservices architecture and mentored junior developers.',
                    isCurrentJob: false,
                  }}
                  onClick={(id) => console.log('View work history:', id)}
                />
                <WorkHistoryCard
                  work={{
                    id: '2',
                    position: 'Full Stack Developer',
                    company: 'Innovation Labs',
                    location: 'Penang, Malaysia',
                    startDate: 'Mar 2023',
                    endDate: '',
                    description: 'Building scalable web applications using React and Node.js.',
                    isCurrentJob: true,
                  }}
                  onClick={(id) => console.log('View work history:', id)}
                />
              </div>
            </div>

            {/* Applicants */}
            <div>
              <h3 className="text-lg font-semibold mb-4" style={{ color: '#94618e' }}>Applicant Cards</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ApplicantCard
                  applicant={{
                    id: '1',
                    name: 'Ahmad Ibrahim',
                    email: 'ahmad.ibrahim@email.com',
                    phone: '+60 12-345 6789',
                    location: 'Kuala Lumpur',
                    position: 'Frontend Developer',
                    experience: '5 years experience',
                    appliedDate: 'Dec 1, 2024',
                    status: 'pending',
                  }}
                  onViewDetails={(id) => console.log('View applicant:', id)}
                  onAccept={(id) => console.log('Accept applicant:', id)}
                  onReject={(id) => console.log('Reject applicant:', id)}
                />
                <ApplicantCard
                  applicant={{
                    id: '2',
                    name: 'Siti Nurhaliza',
                    email: 'siti.nur@email.com',
                    phone: '+60 11-234 5678',
                    location: 'Selangor',
                    position: 'UX Designer',
                    experience: '3 years experience',
                    appliedDate: 'Nov 28, 2024',
                    status: 'shortlisted',
                  }}
                  onViewDetails={(id) => console.log('View applicant:', id)}
                  onAccept={(id) => console.log('Accept applicant:', id)}
                  onReject={(id) => console.log('Reject applicant:', id)}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Payment Cards Section */}
        <section className="mb-12 p-6 rounded-lg shadow-lg" style={{ backgroundColor: '#ffffff' }}>
          <h2 className="text-2xl font-bold mb-6" style={{ color: '#94618e' }}>
            Payment List
          </h2>

          {/* Usage Example */}
          <div className="mb-6 space-y-4">
            <div className="p-4 rounded-lg" style={{ backgroundColor: '#f8eee7', borderLeft: '4px solid #94618e' }}>
              <h3 className="text-lg font-semibold mb-2" style={{ color: '#94618e' }}>
                📦 Installation & Import
              </h3>
              <pre className="text-xs sm:text-sm overflow-x-auto p-4 rounded" style={{ backgroundColor: '#ffffff' }}>
                <code style={{ color: '#94618e' }}>{`import { PaymentCard } from '../components'`}</code>
              </pre>
            </div>

            <div className="p-4 rounded-lg" style={{ backgroundColor: '#f8eee7', borderLeft: '4px solid #94618e' }}>
              <h3 className="text-lg font-semibold mb-2" style={{ color: '#94618e' }}>
                🎯 Basic Usage
              </h3>
              <pre className="text-xs sm:text-sm overflow-x-auto p-4 rounded" style={{ backgroundColor: '#ffffff' }}>
                <code style={{ color: '#94618e' }}>{`<PaymentCard
  payment={{
    id: '1',
    amount: 5000.00,
    currency: 'RM',
    status: 'completed', // 'completed' | 'pending' | 'ongoing' | 'cancelled'
    date: 'Dec 3, 2024',
    description: 'Monthly salary payment',
    paymentMethod: 'Bank Transfer',
    transactionId: 'TXN-2024-001234',
    recipient: 'Ahmad Ibrahim',
  }}
  onViewDetails={(id) => console.log('View:', id)}
  onDownloadReceipt={(id) => console.log('Download:', id)}
/>`}</code>
              </pre>
            </div>

            <div className="p-4 rounded-lg" style={{ backgroundColor: '#f8eee7', borderLeft: '4px solid #94618e' }}>
              <h3 className="text-lg font-semibold mb-2" style={{ color: '#94618e' }}>
                📋 List Implementation
              </h3>
              <pre className="text-xs sm:text-sm overflow-x-auto p-4 rounded" style={{ backgroundColor: '#ffffff' }}>
                <code style={{ color: '#94618e' }}>{`// Display multiple payments in a list
<div className="space-y-4">
  {payments.map(payment => (
    <PaymentCard
      key={payment.id}
      payment={payment}
      onViewDetails={handleViewDetails}
      onDownloadReceipt={handleDownload}
    />
  ))}
</div>`}</code>
              </pre>
            </div>

            <div className="p-4 rounded-lg" style={{ backgroundColor: '#f8eee7', borderLeft: '4px solid #94618e' }}>
              <h3 className="text-lg font-semibold mb-2" style={{ color: '#94618e' }}>
                ⚙️ Props Interface
              </h3>
              <pre className="text-xs sm:text-sm overflow-x-auto p-4 rounded" style={{ backgroundColor: '#ffffff' }}>
                <code style={{ color: '#94618e' }}>{`interface PaymentCardProps {
  payment: {
    id: string
    amount: number
    currency?: string              // Default: 'RM'
    status: 'completed' | 'pending' | 'ongoing' | 'cancelled'
    date: string
    description?: string
    paymentMethod?: string
    transactionId?: string
    recipient?: string
  }
  onViewDetails?: (id: string) => void
  onDownloadReceipt?: (id: string) => void  // Only shown for 'completed' status
  className?: string
}`}</code>
              </pre>
            </div>

            <div className="p-4 rounded-lg" style={{ backgroundColor: '#f8eee7', borderLeft: '4px solid #16a34a' }}>
              <h3 className="text-lg font-semibold mb-2" style={{ color: '#16a34a' }}>
                💡 Real Implementation Example
              </h3>
              <p className="text-sm mb-2" style={{ color: '#94618e', opacity: 0.8 }}>
                Check out the full implementation at:
              </p>
              <ul className="text-sm space-y-1" style={{ color: '#94618e' }}>
                <li>• <code className="px-2 py-1 rounded" style={{ backgroundColor: '#ffffff' }}>/employer/payments</code> - Employer payment management</li>
                <li>• <code className="px-2 py-1 rounded" style={{ backgroundColor: '#ffffff' }}>/seeker/payments</code> - Job seeker earnings tracker</li>
              </ul>
            </div>
          </div>

          <div className="space-y-4">
            <PaymentCard
              payment={{
                id: '1',
                amount: 5000.00,
                currency: 'RM',
                status: 'completed',
                date: 'Dec 3, 2024',
                description: 'Monthly salary payment for November 2024',
                paymentMethod: 'Bank Transfer',
                transactionId: 'TXN-2024-001234',
                recipient: 'Ahmad Ibrahim',
              }}
              onViewDetails={(id) => console.log('View payment details:', id)}
              onDownloadReceipt={(id) => console.log('Download receipt:', id)}
            />
            <PaymentCard
              payment={{
                id: '2',
                amount: 3500.00,
                currency: 'RM',
                status: 'pending',
                date: 'Dec 5, 2024',
                description: 'Project milestone payment',
                paymentMethod: 'Online Banking',
                transactionId: 'TXN-2024-001235',
                recipient: 'Siti Nurhaliza',
              }}
              onViewDetails={(id) => console.log('View payment details:', id)}
              onDownloadReceipt={(id) => console.log('Download receipt:', id)}
            />
            <PaymentCard
              payment={{
                id: '3',
                amount: 1200.50,
                currency: 'RM',
                status: 'ongoing',
                date: 'Dec 6, 2024',
                description: 'Freelance work payment - Website design',
                paymentMethod: 'E-Wallet',
                recipient: 'Lee Wei Ming',
              }}
              onViewDetails={(id) => console.log('View payment details:', id)}
            />
            <PaymentCard
              payment={{
                id: '4',
                amount: 2800.00,
                currency: 'RM',
                status: 'cancelled',
                date: 'Nov 28, 2024',
                description: 'Payment cancelled due to contract termination',
                paymentMethod: 'Bank Transfer',
                transactionId: 'TXN-2024-001180',
                recipient: 'John Doe',
              }}
              onViewDetails={(id) => console.log('View payment details:', id)}
            />
            <PaymentCard
              payment={{
                id: '5',
                amount: 7500.00,
                currency: 'RM',
                status: 'completed',
                date: 'Dec 1, 2024',
                description: 'Consultation fee for December',
                paymentMethod: 'Credit Card',
                transactionId: 'TXN-2024-001200',
                recipient: 'Tech Solutions Ltd.',
              }}
              onViewDetails={(id) => console.log('View payment details:', id)}
              onDownloadReceipt={(id) => console.log('Download receipt:', id)}
            />
            <PaymentCard
              payment={{
                id: '6',
                amount: 450.00,
                currency: 'RM',
                status: 'pending',
                date: 'Dec 6, 2024',
                description: 'Reimbursement for office supplies',
                paymentMethod: 'Bank Transfer',
              }}
              onViewDetails={(id) => console.log('View payment details:', id)}
            />
          </div>
        </section>

        {/* Modals Section */}
        <section className="mb-12 p-6 rounded-lg shadow-lg" style={{ backgroundColor: '#ffffff' }}>
          <h2 className="text-2xl font-bold mb-4" style={{ color: '#94618e' }}>
            Modals
          </h2>

          <div className="flex flex-wrap gap-3">
            <Button
              variant="primary"
              onClick={() => setModals({ ...modals, success: true })}
            >
              Show Success Modal
            </Button>

            <Button
              variant="danger"
              onClick={() => setModals({ ...modals, fail: true })}
            >
              Show Fail Modal
            </Button>

            <Button
              variant="secondary"
              onClick={() => setModals({ ...modals, archive: true })}
            >
              Show Archive Modal
            </Button>

            <Button
              variant="outline"
              onClick={() => setModals({ ...modals, default: true })}
            >
              Show Default Modal
            </Button>
          </div>
        </section>
      </div>

      {/* Modal Components */}
      <Modal
        isOpen={modals.success}
        onClose={() => setModals({ ...modals, success: false })}
        variant="success"
        title="Success!"
      >
        <p className="mb-6 text-base" style={{ color: '#94618e', opacity: 0.9 }}>
          Your action has been completed successfully. The changes have been saved and you can now proceed.
        </p>
        <ModalActions align="center">
          <Button
            variant="primary"
            onClick={() => setModals({ ...modals, success: false })}
          >
            Awesome!
          </Button>
        </ModalActions>
      </Modal>

      <Modal
        isOpen={modals.fail}
        onClose={() => setModals({ ...modals, fail: false })}
        variant="fail"
        title="Error Occurred"
      >
        <p className="mb-6 text-base" style={{ color: '#94618e', opacity: 0.9 }}>
          Something went wrong while processing your request. Please try again later or contact support if the problem persists.
        </p>
        <ModalActions align="center">
          <Button
            variant="outline"
            onClick={() => setModals({ ...modals, fail: false })}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => setModals({ ...modals, fail: false })}
          >
            Retry
          </Button>
        </ModalActions>
      </Modal>

      <Modal
        isOpen={modals.archive}
        onClose={() => setModals({ ...modals, archive: false })}
        variant="archive"
        title="Archive Item?"
      >
        <p className="mb-6 text-base" style={{ color: '#94618e', opacity: 0.9 }}>
          Are you sure you want to archive this item? You can restore it later from the archive section.
        </p>
        <ModalActions align="center">
          <Button
            variant="outline"
            onClick={() => setModals({ ...modals, archive: false })}
          >
            Cancel
          </Button>
          <Button
            variant="secondary"
            onClick={() => setModals({ ...modals, archive: false })}
          >
            Archive
          </Button>
        </ModalActions>
      </Modal>

      <Modal
        isOpen={modals.default}
        onClose={() => setModals({ ...modals, default: false })}
        variant="default"
        title="Information"
      >
        <p className="mb-6 text-base" style={{ color: '#94618e', opacity: 0.9 }}>
          This is a default modal without any specific variant. It uses the standard purple and cream color theme.
        </p>
        <ModalActions align="center">
          <Button
            variant="primary"
            onClick={() => setModals({ ...modals, default: false })}
          >
            Got it
          </Button>
        </ModalActions>
      </Modal>

      {/* Job Form */}
      <JobForm
        isOpen={jobFormOpen}
        onClose={() => {
          setJobFormOpen(false)
          setEditingJob(null)
        }}
        mode={editingJob ? 'edit' : 'create'}
        initialData={editingJob}
        onSubmit={(data) => {
          console.log('Job form submitted:', data)
          setEditingJob(null)
        }}
      />
    </div>
  )
}
