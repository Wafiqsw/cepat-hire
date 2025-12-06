import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useQuery, useMutation, useAction } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { Search, MapPin, Building2, DollarSign, Clock, Calendar, Briefcase, Heart, Share2 } from 'lucide-react'
import { SeekerLayout } from '../../layouts/SeekerLayout'
import { useAuth } from '../../contexts/AuthContext'
import type { Id } from '../../../convex/_generated/dataModel'

import { JobCard } from '../../components/JobCard'
import { Modal } from '../../components/Modal'
import { Loading, Skeleton } from '../../components'

export const Route = createFileRoute('/seeker/browse-jobs')({
  component: RouteComponent,
})

// Helper to format relative time
function formatRelativeTime(timestamp: number): string {
  const now = Date.now()
  const diff = now - timestamp
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (days === 0) return 'Today'
  if (days === 1) return '1 day ago'
  if (days < 7) return `${days} days ago`
  if (days < 14) return '1 week ago'
  return `${Math.floor(days / 7)} weeks ago`
}

// Extended job details data
const jobDetailsData: Record<string, any> = {
  '1': {
    fullDescription: 'We are seeking enthusiastic and customer-oriented waiters/waitresses to join our team at Cafe Delight. You will be responsible for providing excellent service to our customers, taking orders, serving food and beverages, and maintaining a clean dining environment.',
    requirements: [
      'Good communication skills',
      'Friendly and professional demeanor',
      'Ability to work in a fast-paced environment',
      'Previous experience preferred but not required',
      'Flexible schedule, including evenings and weekends',
    ],
    responsibilities: [
      'Greet and seat customers',
      'Take food and beverage orders accurately',
      'Serve food and drinks in a timely manner',
      'Handle customer inquiries and complaints professionally',
      'Process payments and maintain cash register',
      'Keep dining area clean and organized',
    ],
    benefits: [
      'Flexible working hours',
      'Staff meals provided',
      'Tips and service charge',
      'Training provided',
    ],
    schedule: 'Evening shifts (5pm - 11pm), 4-5 days per week',
    contactEmail: 'hr@cafedelight.com',
    companyDescription: 'Cafe Delight is a popular neighborhood cafe known for our friendly atmosphere and delicious menu. We pride ourselves on excellent customer service and a supportive work environment.',
  },
  '2': {
    fullDescription: 'Fashion Hub is looking for a dynamic retail sales assistant to help customers find the perfect outfit and provide exceptional shopping experiences. This role is perfect for fashion enthusiasts who enjoy working with people.',
    requirements: [
      'Passion for fashion and retail',
      'Excellent customer service skills',
      'Good communication in English and Bahasa Malaysia',
      'Ability to work weekends',
      'Basic computer skills',
    ],
    responsibilities: [
      'Assist customers with product selection',
      'Maintain store presentation and merchandising',
      'Process sales transactions',
      'Manage inventory and stock replenishment',
      'Handle customer exchanges and returns',
      'Meet sales targets',
    ],
    benefits: [
      'Employee discount on all products',
      'Commission on sales',
      'Career advancement opportunities',
      'Fun and dynamic work environment',
    ],
    schedule: 'Weekends (Saturday & Sunday), 10am - 7pm',
    contactEmail: 'careers@fashionhub.com.my',
    companyDescription: 'Fashion Hub is a leading fashion retailer with stores across Malaysia, offering trendy clothing and accessories for young professionals and fashion-forward individuals.',
  },
  '3': {
    fullDescription: 'Join our growing delivery team and enjoy flexible working hours while earning competitive rates. Perfect for those who want independence and the freedom to manage their own schedule.',
    requirements: [
      'Own motorcycle and valid license',
      'Smartphone with GPS capability',
      'Good knowledge of local areas',
      'Ability to work flexible hours',
      'Customer service oriented',
    ],
    responsibilities: [
      'Pick up orders from restaurants',
      'Deliver food to customers safely and on time',
      'Handle cash and digital payments',
      'Maintain motorcycle in good condition',
      'Provide excellent customer service',
      'Follow safety protocols',
    ],
    benefits: [
      'Flexible working hours',
      'Weekly payouts',
      'Fuel allowance',
      'Insurance coverage',
      'Performance bonuses',
    ],
    schedule: 'Flexible - Choose your own hours, minimum 20 hours per week',
    contactEmail: 'riders@quickfood.com',
    companyDescription: 'QuickFood Delivery is one of the fastest-growing food delivery services in Malaysia, connecting hungry customers with their favorite restaurants.',
  },
  '4': {
    fullDescription: 'Share your knowledge and help students achieve their academic goals. We are looking for passionate tutors who can make learning enjoyable and effective.',
    requirements: [
      'Strong knowledge in Math, Science, or other subjects',
      'Patient and good with children/teenagers',
      'Ability to explain concepts clearly',
      'Minimum SPM or equivalent qualification',
      'Prior tutoring experience is a plus',
    ],
    responsibilities: [
      'Conduct one-on-one or small group tutoring sessions',
      'Prepare lesson plans and materials',
      'Track student progress',
      'Communicate with parents about student development',
      'Assign and review homework',
      'Motivate and encourage students',
    ],
    benefits: [
      'High hourly rate',
      'Flexible schedule',
      'Work from home or at center',
      'Professional development opportunities',
    ],
    schedule: 'Flexible - Weekday evenings and weekends available',
    contactEmail: 'tutors@smartlearning.com.my',
    companyDescription: 'Smart Learning Center has been helping students excel academically for over 10 years. We provide a supportive environment for both tutors and students.',
  },
  '5': {
    fullDescription: 'We are looking for reliable and friendly cashiers to join our team. You will be the last point of contact with customers, ensuring they leave with a positive experience.',
    requirements: [
      'Basic math skills',
      'Honest and trustworthy',
      'Good customer service attitude',
      'Ability to stand for long periods',
      'Previous cashier experience preferred',
    ],
    responsibilities: [
      'Process customer transactions accurately',
      'Handle cash and card payments',
      'Scan items and bag purchases',
      'Answer customer questions',
      'Maintain clean checkout area',
      'Balance cash register at end of shift',
    ],
    benefits: [
      'Employee discount',
      'Medical benefits',
      'Shift allowance',
      'Training provided',
    ],
    schedule: 'Rotating shifts - Morning, afternoon, or evening',
    contactEmail: 'hr@supermart.com.my',
    companyDescription: 'Supermart Express is a trusted neighborhood supermarket chain serving communities across Malaysia with quality products and friendly service.',
  },
  '6': {
    fullDescription: 'Coffee lovers wanted! Join our team and learn the art of coffee making while serving customers in a cozy cafe environment.',
    requirements: [
      'Passion for coffee',
      'Good communication skills',
      'Friendly personality',
      'Willing to learn',
      'Food handling certificate is a plus',
    ],
    responsibilities: [
      'Prepare coffee and other beverages',
      'Operate espresso machines',
      'Take customer orders',
      'Maintain cleanliness of work area',
      'Manage inventory of coffee supplies',
      'Provide excellent customer service',
    ],
    benefits: [
      'Free coffee during shifts',
      'Tips sharing',
      'Barista training provided',
      'Friendly work environment',
    ],
    schedule: 'Part-time shifts available - Morning or afternoon',
    contactEmail: 'jobs@coffeecorner.com.my',
    companyDescription: 'Coffee Corner is a beloved local cafe known for our artisanal coffee and warm, welcoming atmosphere. We take pride in our craft and our community.',
  },
  '7': {
    fullDescription: 'Be part of exciting events! We need energetic and reliable event staff to help make events run smoothly and successfully.',
    requirements: [
      'Energetic and outgoing personality',
      'Good communication skills',
      'Physically fit',
      'Team player',
      'Available on weekends',
    ],
    responsibilities: [
      'Set up event venues',
      'Register attendees',
      'Guide guests',
      'Manage crowd flow',
      'Pack down after events',
      'Assist event coordinators',
    ],
    benefits: [
      'Attractive daily rate',
      'Work at exciting events',
      'Flexible schedule',
      'Networking opportunities',
    ],
    schedule: 'Mostly weekends and evenings, advance schedule provided',
    contactEmail: 'crew@eventpro.com.my',
    companyDescription: 'EventPro Management organizes corporate events, weddings, concerts, and exhibitions. Join us and be part of memorable experiences.',
  },
  '8': {
    fullDescription: 'Love animals? Become a pet sitter and provide care for pets while their owners are away. Perfect for animal lovers looking for flexible work.',
    requirements: [
      'Love for animals',
      'Responsible and reliable',
      'Experience with pets',
      'Own transportation',
      'Available for flexible hours',
    ],
    responsibilities: [
      'Feed and water pets',
      'Take dogs for walks',
      'Administer medication if needed',
      'Play with and exercise pets',
      'Clean litter boxes or cages',
      'Send updates to pet owners',
    ],
    benefits: [
      'Spend time with adorable pets',
      'Flexible schedule',
      'Good pay per visit',
      'Build regular client base',
    ],
    schedule: 'Flexible - Book your own appointments',
    contactEmail: 'care@pawsandclaws.com.my',
    companyDescription: 'Paws & Claws Care provides professional pet sitting services to pet owners who want the best care for their furry friends. Join our community of animal lovers.',
  },
}


function RouteComponent() {
  const [isLoading, setIsLoading] = useState(true)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [selectedJobTypes, setSelectedJobTypes] = useState<string[]>([])
  const [selectedLocations, setSelectedLocations] = useState<string[]>([])
  const [selectedSalaryRanges, setSelectedSalaryRanges] = useState<string[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null)
  const [showApplyModal, setShowApplyModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [aiJobPrompt, setAiJobPrompt] = useState('')
  const [aiActionType, setAiActionType] = useState<'auto-apply' | 'list-jobs'>('list-jobs')
  const [aiPromptSubmitted, setAiPromptSubmitted] = useState(false)

  // Simulate API call
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200)
    return () => clearTimeout(timer)
  }, [])

  const handleApply = (jobId: string) => {
    console.log('Applied to job:', jobId)
    // TODO: Implement actual apply logic
  const [aiStep, setAiStep] = useState<'prompt' | 'results'>('prompt')
  const [aiMatchingJobs, setAiMatchingJobs] = useState<Array<{
    id: string;
    title: string;
    company: string;
    location: string;
    salary: string;
    type: string;
  }>>([])
  const [selectedJobIds, setSelectedJobIds] = useState<string[]>([])
  const [aiResponse, setAiResponse] = useState<string | null>(null)
  const [aiLoading, setAiLoading] = useState(false)
  const { user } = useAuth()

  // Fetch real data from Convex
  const jobs = useQuery(api.jobs.list, { status: 'open' })

  // Get candidate profile linked to authenticated user
  const candidate = useQuery(api.seeker.getCandidateByUserId,
    user?.id ? { userId: user.id as Id<"users"> } : "skip"
  )
  const candidateId = candidate?._id

  // Mutations
  const applyToJob = useMutation(api.seeker.applyToJob)
  const saveJob = useMutation(api.seeker.saveJob)
  const seekerChat = useAction(api.aiAgent.seekerChat)

  // Transform jobs for display
  const jobsForDisplay = jobs?.map((job) => ({
    id: job._id,
    title: job.title,
    company: job.company,
    location: job.location || 'Remote',
    type: job.type || 'Part-time',
    salary: job.salary || 'Competitive',
    postedDate: formatRelativeTime(job.createdAt),
    description: job.description,
    image: job.image,
  })) || []

  const handleApply = async (jobId: string): Promise<boolean> => {
    if (!candidateId) {
      alert('Please complete your profile before applying')
      return false
    }
    try {
      await applyToJob({ candidateId, jobId: jobId as Id<'jobs'> })
      return true
    } catch (error) {
      console.error('Failed to apply:', error)
      alert('Failed to apply. You may have already applied to this job.')
      return false
    }
  }

  const handleSave = async (jobId: string) => {
    if (!candidateId) return
    try {
      await saveJob({ candidateId, jobId: jobId as Id<'jobs'> })
    } catch (error) {
      console.error('Failed to save:', error)
    }
  }

  const handleViewDetails = (jobId: string) => {
    setSelectedJobId(jobId)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedJobId(null)
  }

  // Step 1: Search for matching jobs
  const handleAiSearch = async () => {
    if (!aiJobPrompt.trim() || !candidateId) return

    setAiLoading(true)
    setAiResponse(null)
    setAiMatchingJobs([])
    setSelectedJobIds([])

    try {
      const result = await seekerChat({
        message: aiJobPrompt,
        conversationId: `seeker-${candidateId}`,
        candidateId,
        actionType: 'search',
      })
      setAiResponse(result.response)
      if (result.matchingJobs && result.matchingJobs.length > 0) {
        setAiMatchingJobs(result.matchingJobs)
        setAiStep('results')
      }
    } catch (error) {
      console.error('AI error:', error)
      setAiResponse('Sorry, there was an error processing your request. Please try again.')
    } finally {
      setAiLoading(false)
    }
  }

  // Step 2: Apply to selected jobs
  const handleAiApply = async () => {
    if (selectedJobIds.length === 0 || !candidateId) return

    setAiLoading(true)
    setAiResponse(null)

    try {
      const result = await seekerChat({
        message: aiJobPrompt,
        conversationId: `seeker-${candidateId}`,
        candidateId,
        actionType: 'apply-selected',
        selectedJobIds,
      })
      setAiResponse(result.response)
      // Clear selections after applying
      setSelectedJobIds([])
    } catch (error) {
      console.error('AI error:', error)
      setAiResponse('Sorry, there was an error applying to jobs. Please try again.')
    } finally {
      setAiLoading(false)
    }
  }

  // Reset to search step
  const handleAiReset = () => {
    setAiStep('prompt')
    setAiJobPrompt('')
    setAiMatchingJobs([])
    setSelectedJobIds([])
    setAiResponse(null)
  }

  // Toggle job selection
  const handleJobSelect = (jobId: string) => {
    setSelectedJobIds(prev =>
      prev.includes(jobId)
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    )
  }

  const handleFilterToggle = (
    filterType: 'jobType' | 'location' | 'salary',
    value: string,
    checked: boolean
  ) => {
    const setters = {
      jobType: setSelectedJobTypes,
      location: setSelectedLocations,
      salary: setSelectedSalaryRanges,
    }
    const getters = {
      jobType: selectedJobTypes,
      location: selectedLocations,
      salary: selectedSalaryRanges,
    }

    const setter = setters[filterType]
    const current = getters[filterType]

    if (checked) {
      setter([...current, value])
    } else {
      setter(current.filter((item) => item !== value))
    }
  }

  // Filter jobs based on selected criteria
  const filteredJobs = jobsForDisplay.filter((job) => {
    const matchesSearch = searchKeyword === '' ||
      job.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      job.company.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      job.description.toLowerCase().includes(searchKeyword.toLowerCase())

    const matchesJobType = selectedJobTypes.length === 0 ||
      selectedJobTypes.includes(job.type)

    const matchesLocation = selectedLocations.length === 0 ||
      selectedLocations.some((loc) => job.location.includes(loc))

    return matchesSearch && matchesJobType && matchesLocation
  })

  if (isLoading) {
    return (
      <SeekerLayout>
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row gap-6">
            <main className="flex-1">
              {/* Header Skeleton */}
              <div className="mb-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                  <Skeleton variant="text" className="h-9 w-48" />
                  <Skeleton variant="text" className="h-5 w-32" />
                </div>
                <Skeleton variant="rectangle" className="h-12 w-full rounded-xl" />
              </div>

              {/* AI Section Skeleton */}
              <Skeleton variant="card" className="h-64 mb-6" />

              {/* Job Cards Grid Skeleton */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Skeleton key={i} variant="card" className="h-64" />
                ))}
              </div>

              {/* Loading Indicator */}
              <Loading size="lg" text="Loading job listings..." />
            </main>
  // Loading state
  if (jobs === undefined) {
    return (
      <SeekerLayout>
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-center py-12">
            <div className="animate-pulse text-lg" style={{ color: '#94618e' }}>
              Loading jobs...
            </div>
          </div>
        </div>
      </SeekerLayout>
    )
  }

  return (
    <SeekerLayout>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Job List Section */}
          <main className="flex-1">
            {/* Header with Search */}
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                <h1 className="text-3xl font-bold" style={{ color: '#94618e' }}>
                  Job List
                </h1>
                <p className="text-sm" style={{ color: '#94618e', opacity: 0.6 }}>
                  {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'} found
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <Search size={20} style={{ color: '#94618e', opacity: 0.5 }} />
                </div>
                <input
                  type="text"
                  placeholder="Search by keyword"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border-2 font-medium text-sm transition-all duration-200 outline-none focus:ring-2 focus:ring-offset-2"
                  style={{
                    backgroundColor: '#ffffff',
                    color: '#94618e',
                    borderColor: '#e5e7eb',
                  }}
                />
              </div>
            </div>

            {/* AI Job Assistant Section */}
            <div className="mb-6 p-6 rounded-xl border-2" style={{ backgroundColor: '#ffffff', borderColor: '#94618e' }}>
              <h2 className="text-lg font-bold mb-3" style={{ color: '#94618e' }}>
                🤖 AI Job Assistant
              </h2>

              {/* Step 1: Search Prompt */}
              {aiStep === 'prompt' && (
                <div className="space-y-3">
                  <p className="text-sm mb-4" style={{ color: '#94618e', opacity: 0.6 }}>
                    Describe the job you're looking for and AI will find matching jobs
                  </p>
                  <textarea
                    placeholder="Describe your ideal job... (e.g., 'I'm looking for a part-time waiter job in Kuala Lumpur with flexible hours, preferably near an LRT station.')"
                    value={aiJobPrompt}
                    onChange={(e) => setAiJobPrompt(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border-2 font-medium text-sm transition-all duration-200 outline-none focus:ring-2 focus:ring-offset-2 resize-none"
                    style={{
                      backgroundColor: '#f8eee7',
                      color: '#94618e',
                      borderColor: '#94618e',
                    }}
                  />
                  <button
                    onClick={handleAiSearch}
                    disabled={!aiJobPrompt.trim() || aiLoading}
                    className="w-full px-6 py-3 rounded-full font-bold text-sm transition-all hover:opacity-90 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    style={{
                      backgroundColor: '#94618e',
                      color: '#f8eee7',
                    }}
                  >
                    {aiLoading ? 'Searching...' : '🔍 Find Matching Jobs'}
                  </button>
                </div>
              )}

              {/* Step 2: Results with Selection */}
              {aiStep === 'results' && (
                <div className="space-y-3">
                  <p className="text-sm mb-2" style={{ color: '#94618e', opacity: 0.6 }}>
                    Select jobs you want to apply to:
                  </p>

                  {/* Job List with Checkboxes */}
                  <div className="max-h-64 overflow-y-auto space-y-2 border rounded-lg p-2" style={{ borderColor: '#e5e7eb' }}>
                    {aiMatchingJobs.map((job) => (
                      <label
                        key={job.id}
                        className="flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all hover:bg-opacity-50"
                        style={{
                          backgroundColor: selectedJobIds.includes(job.id) ? '#f8eee7' : '#ffffff',
                          border: selectedJobIds.includes(job.id) ? '2px solid #94618e' : '2px solid #e5e7eb',
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={selectedJobIds.includes(job.id)}
                          onChange={() => handleJobSelect(job.id)}
                          className="mt-1 w-4 h-4 rounded"
                          style={{ accentColor: '#94618e' }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm truncate" style={{ color: '#94618e' }}>
                            {job.title}
                          </p>
                          <p className="text-xs truncate" style={{ color: '#94618e', opacity: 0.7 }}>
                            {job.company}
                          </p>
                          <div className="flex flex-wrap gap-2 mt-1 text-xs" style={{ color: '#94618e', opacity: 0.6 }}>
                            <span>📍 {job.location}</span>
                            <span>💰 {job.salary}</span>
                            <span>📋 {job.type}</span>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={handleAiReset}
                      className="flex-1 px-4 py-2.5 rounded-full font-semibold text-sm transition-all hover:opacity-90 border-2"
                      style={{
                        backgroundColor: 'transparent',
                        color: '#94618e',
                        borderColor: '#94618e',
                      }}
                    >
                      ↩️ Search Again
                    </button>
                    <button
                      onClick={handleAiApply}
                      disabled={selectedJobIds.length === 0 || aiLoading}
                      className="flex-1 px-4 py-2.5 rounded-full font-bold text-sm transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{
                        backgroundColor: '#94618e',
                        color: '#f8eee7',
                      }}
                    >
                      {aiLoading ? 'Applying...' : `⚡ Apply to Selected (${selectedJobIds.length})`}
                    </button>
                  </div>
                </div>
              )}

              {/* Loading State */}
              {aiLoading && (
                <div className="flex items-center gap-2 p-3 rounded-lg animate-pulse mt-3" style={{ backgroundColor: '#fef3c7' }}>
                  <span className="text-sm font-medium" style={{ color: '#d97706' }}>
                    {aiStep === 'prompt' ? 'Finding matching jobs...' : 'Applying to selected jobs...'}
                  </span>
                </div>
              )}

              {/* Response Message */}
              {aiResponse && !aiLoading && (
                <div className="p-4 rounded-lg mt-3" style={{ backgroundColor: '#dcfce7', border: '1px solid #16a34a' }}>
                  <p className="text-sm font-medium mb-2" style={{ color: '#16a34a' }}>
                    AI Response:
                  </p>
                  <p className="text-sm whitespace-pre-wrap" style={{ color: '#15803d' }}>
                    {aiResponse}
                  </p>
                  {aiStep === 'results' && aiMatchingJobs.length === 0 && (
                    <button
                      onClick={handleAiReset}
                      className="mt-3 text-xs underline"
                      style={{ color: '#16a34a' }}
                    >
                      Try a different search
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Job Cards Grid */}
            {filteredJobs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                {filteredJobs.map((job) => (
                  <JobCard
                    key={job.id}
                    variant="seeker"
                    job={job}
                    onApply={handleApply}
                    onSave={handleSave}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </div>
            ) : (
              <div
                className="text-center py-12 rounded-xl border-2"
                style={{ backgroundColor: '#ffffff', borderColor: '#e5e7eb' }}
              >
                <p className="text-xl font-semibold" style={{ color: '#94618e' }}>
                  No jobs found matching your criteria.
                </p>
                <p className="text-sm mt-2" style={{ color: '#94618e', opacity: 0.6 }}>
                  Try adjusting your filters or search keywords.
                </p>
              </div>
            )}
          </main>
        </div>

        {/* Job Details Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          variant="default"
          showIcon={false}
          showCloseButton={true}
        >
          {selectedJobId && (() => {
            const job = jobsForDisplay.find(j => j.id === selectedJobId)
            const details = jobDetailsData[selectedJobId] || {}

            if (!job) return null

            const handleSaveInModal = () => {
              console.log('Saved job:', selectedJobId)
              alert('Job saved to your favorites!')
            }

            const handleShare = () => {
              navigator.clipboard.writeText(window.location.href)
              alert('Job link copied to clipboard!')
            }

            return (
              <div className="text-left max-h-[70vh] overflow-y-auto">
                {/* Header Section */}
                <div className="mb-6">
                  <div className="mb-4">
                    <h1 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: '#94618e' }}>
                      {job.title}
                    </h1>
                    <div className="flex items-center gap-2 mb-3">
                      <Building2 size={18} style={{ color: '#94618e', opacity: 0.8 }} />
                      <span className="text-base font-medium" style={{ color: '#94618e', opacity: 0.9 }}>
                        {job.company}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={handleSaveInModal}
                        className="p-2 rounded-full transition-all hover:opacity-80"
                        style={{ backgroundColor: '#94618e' }}
                        title="Save Job"
                      >
                        <Heart size={18} style={{ color: '#f8eee7' }} />
                      </button>
                      <button
                        onClick={handleShare}
                        className="p-2 rounded-full transition-all hover:opacity-80"
                        style={{ backgroundColor: '#94618e' }}
                        title="Share Job"
                      >
                        <Share2 size={18} style={{ color: '#f8eee7' }} />
                      </button>
                    </div>
                  </div>

                  {/* Job Meta Information */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center gap-2">
                      <MapPin size={16} style={{ color: '#94618e', opacity: 0.7 }} />
                      <span className="text-sm" style={{ color: '#94618e', opacity: 0.9 }}>{job.location}</span>
                    </div>
                    {job.salary && (
                      <div className="flex items-center gap-2">
                        <DollarSign size={16} style={{ color: '#94618e', opacity: 0.7 }} />
                        <span className="text-sm" style={{ color: '#94618e', opacity: 0.9 }}>{job.salary}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Briefcase size={16} style={{ color: '#94618e', opacity: 0.7 }} />
                      <span className="text-sm" style={{ color: '#94618e', opacity: 0.9 }}>{job.type}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} style={{ color: '#94618e', opacity: 0.7 }} />
                      <span className="text-sm" style={{ color: '#94618e', opacity: 0.9 }}>Posted {job.postedDate}</span>
                    </div>
                  </div>

                  {/* Apply Button */}
                  <button
                    onClick={() => {
                      setIsModalOpen(false)
                      setShowApplyModal(true)
                    }}
                    className="w-full px-6 py-2.5 rounded-full font-bold text-base transition-all hover:opacity-90"
                    style={{
                      backgroundColor: '#94618e',
                      color: '#f8eee7',
                    }}
                  >
                    Apply Now
                  </button>
                </div>

                {/* Divider */}
                <div className="border-t-2 mb-4" style={{ borderColor: '#94618e', opacity: 0.3 }} />

                {/* Job Details Sections */}
                <div className="space-y-4 mt-6">
                  {/* Description */}
                  <section>
                    <h2 className="text-xl font-bold mb-2" style={{ color: '#94618e' }}>
                      About the Role
                    </h2>
                    <p className="text-sm leading-relaxed" style={{ color: '#94618e', opacity: 0.9 }}>
                      {details?.fullDescription || job.description}
                    </p>
                  </section>

                  {/* Schedule */}
                  {details?.schedule && (
                    <section>
                      <h2 className="text-xl font-bold mb-2 flex items-center gap-2" style={{ color: '#94618e' }}>
                        <Clock size={20} />
                        Schedule
                      </h2>
                      <p className="text-sm" style={{ color: '#94618e', opacity: 0.9 }}>
                        {details.schedule}
                      </p>
                    </section>
                  )}

                  {/* Requirements */}
                  {details?.requirements && (
                    <section>
                      <h2 className="text-xl font-bold mb-2" style={{ color: '#94618e' }}>
                        Requirements
                      </h2>
                      <ul className="space-y-1.5">
                        {details.requirements.map((req: string, index: number) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: '#94618e' }} />
                            <span className="text-sm" style={{ color: '#94618e', opacity: 0.9 }}>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}

                  {/* Responsibilities */}
                  {details?.responsibilities && (
                    <section>
                      <h2 className="text-xl font-bold mb-2" style={{ color: '#94618e' }}>
                        Responsibilities
                      </h2>
                      <ul className="space-y-1.5">
                        {details.responsibilities.map((resp: string, index: number) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: '#94618e' }} />
                            <span className="text-sm" style={{ color: '#94618e', opacity: 0.9 }}>{resp}</span>
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}

                  {/* Benefits */}
                  {details?.benefits && (
                    <section>
                      <h2 className="text-xl font-bold mb-2" style={{ color: '#94618e' }}>
                        Benefits
                      </h2>
                      <ul className="space-y-1.5">
                        {details.benefits.map((benefit: string, index: number) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: '#94618e' }} />
                            <span className="text-sm" style={{ color: '#94618e', opacity: 0.9 }}>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}

                  {/* Company Description */}
                  {details?.companyDescription && (
                    <section>
                      <h2 className="text-xl font-bold mb-2" style={{ color: '#94618e' }}>
                        About {job.company}
                      </h2>
                      <p className="text-sm leading-relaxed" style={{ color: '#94618e', opacity: 0.9 }}>
                        {details.companyDescription}
                      </p>
                    </section>
                  )}

                  {/* Contact Information */}
                  {details?.contactEmail && (
                    <section>
                      <h2 className="text-xl font-bold mb-2" style={{ color: '#94618e' }}>
                        Contact
                      </h2>
                      <p className="text-sm" style={{ color: '#94618e', opacity: 0.9 }}>
                        Email: <a href={`mailto:${details.contactEmail}`} className="underline hover:opacity-80">
                          {details.contactEmail}
                        </a>
                      </p>
                    </section>
                  )}
                </div>
              </div>
            )
          })()}
        </Modal>

        {/* Apply Confirmation Modal */}
        {selectedJobId && (() => {
          const job = jobsForDisplay.find(j => j.id === selectedJobId)
          if (!job) return null

          return (
            <Modal
              isOpen={showApplyModal}
              onClose={() => setShowApplyModal(false)}
              variant="success"
              title="Apply for this Job?"
            >
              <p className="mb-6 text-base" style={{ color: '#94618e', opacity: 0.9 }}>
                Are you sure you want to apply for the <strong>{job.title}</strong> position at{' '}
                <strong>{job.company}</strong>? Your profile and resume will be submitted to the employer.
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setShowApplyModal(false)}
                  className="px-6 py-2.5 rounded-full font-bold text-base transition-all hover:opacity-90 border-2"
                  style={{
                    backgroundColor: 'transparent',
                    color: '#94618e',
                    borderColor: '#94618e',
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    const success = await handleApply(selectedJobId)
                    setShowApplyModal(false)
                    if (success) {
                      setShowSuccessModal(true)
                    }
                  }}
                  className="px-6 py-2.5 rounded-full font-bold text-base transition-all hover:opacity-90"
                  style={{
                    backgroundColor: '#94618e',
                    color: '#f8eee7',
                  }}
                >
                  Yes, Apply
                </button>
              </div>
            </Modal>
          )
        })()}

        {/* Success Modal */}
        {selectedJobId && (() => {
          const job = jobsForDisplay.find(j => j.id === selectedJobId)
          if (!job) return null

          return (
            <Modal
              isOpen={showSuccessModal}
              onClose={() => {
                setShowSuccessModal(false)
                setSelectedJobId(null)
              }}
              variant="success"
              title="Application Submitted!"
            >
              <p className="mb-6 text-base" style={{ color: '#94618e', opacity: 0.9 }}>
                Your application for the <strong>{job.title}</strong> position at{' '}
                <strong>{job.company}</strong> has been successfully submitted. The employer will review your profile and contact you if you're a good fit.
              </p>
              <div className="flex justify-center">
                <button
                  onClick={() => {
                    setShowSuccessModal(false)
                    setSelectedJobId(null)
                  }}
                  className="px-8 py-2.5 rounded-full font-bold text-base transition-all hover:opacity-90"
                  style={{
                    backgroundColor: '#94618e',
                    color: '#f8eee7',
                  }}
                >
                  OK
                </button>
              </div>
            </Modal>
          )
        })()}
      </div>
    </SeekerLayout>
  )
}
