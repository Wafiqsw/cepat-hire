import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { SeekerLayout } from '../../layouts/SeekerLayout'
import { 
  MapPin, 
  Building2, 
  DollarSign, 
  Clock, 
  Calendar,
  Briefcase,
  ArrowLeft,
  Heart,
  Share2
} from 'lucide-react'

export const Route = createFileRoute('/seeker/JobDetailsModal')({
  component: JobDetailsPage,
})

// Mock job data - should match Home.tsx
const mockJobs = [
  {
    id: '1',
    title: 'Waiter/Waitress',
    company: 'Cafe Delight',
    location: 'Kuala Lumpur, Malaysia',
    type: 'Part-time',
    salary: 'RM 8 - 12/hour',
    postedDate: '2 days ago',
    description: 'Looking for friendly waiters/waitresses for evening shifts at our busy cafe.',
  },
  {
    id: '2',
    title: 'Retail Sales Assistant',
    company: 'Fashion Hub',
    location: 'Penang, Malaysia',
    type: 'Part-time',
    salary: 'RM 1,500 - 2,000',
    postedDate: '1 week ago',
    description: 'Join our team to assist customers and manage store operations on weekends.',
  },
  {
    id: '3',
    title: 'Delivery Rider',
    company: 'QuickFood Delivery',
    location: 'Johor Bahru, Malaysia',
    type: 'Part-time',
    salary: 'RM 10 - 15/hour',
    postedDate: '3 days ago',
    description: 'Flexible hours delivering food to customers. Own motorcycle required.',
  },
  {
    id: '4',
    title: 'Tutor',
    company: 'Smart Learning Center',
    location: 'Selangor, Malaysia',
    type: 'Part-time',
    salary: 'RM 30 - 50/hour',
    postedDate: '5 days ago',
    description: 'Teach students in various subjects. Math and Science tutors needed.',
  },
  {
    id: '5',
    title: 'Cashier',
    company: 'Supermart Express',
    location: 'Kuala Lumpur, Malaysia',
    type: 'Part-time',
    salary: 'RM 1,800 - 2,200',
    postedDate: '1 day ago',
    description: 'Handle cash transactions and provide excellent customer service.',
  },
  {
    id: '6',
    title: 'Barista',
    company: 'Coffee Corner',
    location: 'Penang, Malaysia',
    type: 'Part-time',
    salary: 'RM 9 - 13/hour',
    postedDate: '4 days ago',
    description: 'Make and serve coffee beverages. Experience with espresso machines preferred.',
  },
  {
    id: '7',
    title: 'Event Staff',
    company: 'EventPro Management',
    location: 'Selangor, Malaysia',
    type: 'Part-time',
    salary: 'RM 100 - 150/day',
    postedDate: '2 days ago',
    description: 'Help with event setup, registration, and crowd management on weekends.',
  },
  {
    id: '8',
    title: 'Pet Sitter',
    company: 'Paws & Claws Care',
    location: 'Kuala Lumpur, Malaysia',
    type: 'Part-time',
    salary: 'RM 25 - 40/visit',
    postedDate: '6 days ago',
    description: 'Care for pets while owners are away. Must love animals.',
  },
]

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

function JobDetailsPage() {
  const navigate = useNavigate()
  const searchParams = Route.useSearch() as { jobId?: string }
  const jobId = searchParams.jobId
  
  // Find the job from mockJobs
  const job = mockJobs.find(j => j.id === jobId)
  const details = jobId ? jobDetailsData[jobId] : null

  // If job not found, show error message
  if (!job) {
    return (
      <SeekerLayout>
        <div className="min-h-screen p-8" style={{ backgroundColor: '#49274a' }}>
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4" style={{ color: '#f8eee7' }}>
              Job not found
            </h1>
            <button
              onClick={() => navigate({ to: '/seeker/Home' })}
              className="px-6 py-2 rounded-full font-medium transition-all hover:opacity-80"
              style={{
                backgroundColor: '#94618e',
                color: '#f8eee7',
              }}
            >
              Back to Job List
            </button>
          </div>
        </div>
      </SeekerLayout>
    )
  }

  const handleApply = () => {
    console.log('Applied to job:', jobId)
    alert('Application submitted successfully!')
  }

  const handleSave = () => {
    console.log('Saved job:', jobId)
    alert('Job saved to your favorites!')
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    alert('Job link copied to clipboard!')
  }

  return (
    <SeekerLayout>
      <div
        className="min-h-screen p-4 sm:p-6 lg:p-8 -mx-4 sm:-mx-6 lg:-mx-8 -my-6 sm:-my-8"
        style={{ backgroundColor: '#49274a' }}
      >
        <div className="max-w-5xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigate({ to: '/seeker/Home' })}
            className="flex items-center gap-2 mb-6 px-4 py-2 rounded-full font-medium transition-all hover:opacity-80"
            style={{
              backgroundColor: '#94618e',
              color: '#f8eee7',
            }}
          >
            <ArrowLeft size={20} />
            Back to Jobs
          </button>

          {/* Main Content Card */}
          <div
            className="rounded-2xl p-6 sm:p-8 shadow-lg"
            style={{ backgroundColor: '#94618e' }}
          >
            {/* Header Section */}
            <div className="mb-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h1 className="text-3xl sm:text-4xl font-bold mb-2" style={{ color: '#f8eee7' }}>
                    {job.title}
                  </h1>
                  <div className="flex items-center gap-2 mb-2">
                    <Building2 size={20} style={{ color: '#f8eee7', opacity: 0.8 }} />
                    <span className="text-lg font-medium" style={{ color: '#f8eee7', opacity: 0.9 }}>
                      {job.company}
                    </span>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    className="p-3 rounded-full transition-all hover:opacity-80"
                    style={{ backgroundColor: '#49274a' }}
                    title="Save Job"
                  >
                    <Heart size={20} style={{ color: '#f8eee7' }} />
                  </button>
                  <button
                    onClick={handleShare}
                    className="p-3 rounded-full transition-all hover:opacity-80"
                    style={{ backgroundColor: '#49274a' }}
                    title="Share Job"
                  >
                    <Share2 size={20} style={{ color: '#f8eee7' }} />
                  </button>
                </div>
              </div>

              {/* Job Meta Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <MapPin size={18} style={{ color: '#f8eee7', opacity: 0.7 }} />
                  <span className="text-sm" style={{ color: '#f8eee7', opacity: 0.9 }}>{job.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign size={18} style={{ color: '#f8eee7', opacity: 0.7 }} />
                  <span className="text-sm" style={{ color: '#f8eee7', opacity: 0.9 }}>{job.salary}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase size={18} style={{ color: '#f8eee7', opacity: 0.7 }} />
                  <span className="text-sm" style={{ color: '#f8eee7', opacity: 0.9 }}>{job.type}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={18} style={{ color: '#f8eee7', opacity: 0.7 }} />
                  <span className="text-sm" style={{ color: '#f8eee7', opacity: 0.9 }}>Posted {job.postedDate}</span>
                </div>
              </div>

              {/* Apply Button */}
              <button
                onClick={handleApply}
                className="w-full sm:w-auto px-8 py-3 rounded-full font-bold text-lg transition-all hover:opacity-90"
                style={{
                  backgroundColor: '#f8eee7',
                  color: '#49274a',
                }}
              >
                Apply Now
              </button>
            </div>

            {/* Divider */}
            <div className="border-t-2 mb-6" style={{ borderColor: '#49274a', opacity: 0.3 }} />

            {/* Job Details Sections */}
            <div className="space-y-6">
              {/* Description */}
              <section>
                <h2 className="text-2xl font-bold mb-3" style={{ color: '#f8eee7' }}>
                  About the Role
                </h2>
                <p className="text-base leading-relaxed" style={{ color: '#f8eee7', opacity: 0.9 }}>
                  {details?.fullDescription || job.description}
                </p>
              </section>

              {/* Schedule */}
              {details?.schedule && (
                <section>
                  <h2 className="text-2xl font-bold mb-3 flex items-center gap-2" style={{ color: '#f8eee7' }}>
                    <Clock size={24} />
                    Schedule
                  </h2>
                  <p className="text-base" style={{ color: '#f8eee7', opacity: 0.9 }}>
                    {details.schedule}
                  </p>
                </section>
              )}

              {/* Requirements */}
              {details?.requirements && (
                <section>
                  <h2 className="text-2xl font-bold mb-3" style={{ color: '#f8eee7' }}>
                    Requirements
                  </h2>
                  <ul className="space-y-2">
                    {details.requirements.map((req: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: '#f8eee7' }} />
                        <span style={{ color: '#f8eee7', opacity: 0.9 }}>{req}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Responsibilities */}
              {details?.responsibilities && (
                <section>
                  <h2 className="text-2xl font-bold mb-3" style={{ color: '#f8eee7' }}>
                    Responsibilities
                  </h2>
                  <ul className="space-y-2">
                    {details.responsibilities.map((resp: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: '#f8eee7' }} />
                        <span style={{ color: '#f8eee7', opacity: 0.9 }}>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Benefits */}
              {details?.benefits && (
                <section>
                  <h2 className="text-2xl font-bold mb-3" style={{ color: '#f8eee7' }}>
                    Benefits
                  </h2>
                  <ul className="space-y-2">
                    {details.benefits.map((benefit: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: '#f8eee7' }} />
                        <span style={{ color: '#f8eee7', opacity: 0.9 }}>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Company Description */}
              {details?.companyDescription && (
                <section>
                  <h2 className="text-2xl font-bold mb-3" style={{ color: '#f8eee7' }}>
                    About {job.company}
                  </h2>
                  <p className="text-base leading-relaxed" style={{ color: '#f8eee7', opacity: 0.9 }}>
                    {details.companyDescription}
                  </p>
                </section>
              )}

              {/* Contact Information */}
              {details?.contactEmail && (
                <section>
                  <h2 className="text-2xl font-bold mb-3" style={{ color: '#f8eee7' }}>
                    Contact
                  </h2>
                  <p className="text-base" style={{ color: '#f8eee7', opacity: 0.9 }}>
                    Email: <a href={`mailto:${details.contactEmail}`} className="underline hover:opacity-80">
                      {details.contactEmail}
                    </a>
                  </p>
                </section>
              )}
            </div>

            {/* Bottom Apply Button */}
            <div className="mt-8 pt-6 border-t-2" style={{ borderColor: '#49274a', opacity: 0.3 }}>
              <button
                onClick={handleApply}
                className="w-full px-8 py-3 rounded-full font-bold text-lg transition-all hover:opacity-90"
                style={{
                  backgroundColor: '#f8eee7',
                  color: '#49274a',
                }}
              >
                Apply Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </SeekerLayout>
  )
}