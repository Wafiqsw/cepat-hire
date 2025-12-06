import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Search } from 'lucide-react'
import { SeekerLayout } from '../../layouts/SeekerLayout'
import { Checkbox } from '../../components'
import { JobCard } from '../../components/JobCard'

export const Route = createFileRoute('/seeker/Home')({
  component: RouteComponent,
})

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




function RouteComponent() {
  const [searchKeyword, setSearchKeyword] = useState('')
  const [selectedJobTypes, setSelectedJobTypes] = useState<string[]>([])
  const [selectedLocations, setSelectedLocations] = useState<string[]>([])
  const [selectedSalaryRanges, setSelectedSalaryRanges] = useState<string[]>([])

  const handleApply = (jobId: string) => {
    console.log('Applied to job:', jobId)
    // TODO: Implement actual apply logic
  }

  const handleSave = (jobId: string) => {
    console.log('Saved job:', jobId)
    // TODO: Implement actual save logic
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
  const filteredJobs = mockJobs.filter((job) => {
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

  return (
    <SeekerLayout>
      <div
        className="min-h-screen p-4 sm:p-6 lg:p-8 -mx-4 sm:-mx-6 lg:-mx-8 -my-6 sm:-my-8"
        style={{ backgroundColor: '#49274a' }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Job List Section */}
            <main className="flex-1">
              {/* Header with Search */}
              <div className="mb-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                  <h1 className="text-3xl font-bold" style={{ color: '#f8eee7' }}>
                    Job List
                  </h1>
                  <p className="text-sm" style={{ color: '#f8eee7', opacity: 0.8 }}>
                    {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'} found
                  </p>
                </div>

                {/* Search Bar */}
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Search size={20} style={{ color: '#f8eee7', opacity: 0.7 }} />
                  </div>
                  <input
                    type="text"
                    placeholder="SEARCH BY KEYWORD"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-full border-2 font-medium text-sm tracking-wide transition-all duration-200 outline-none focus:ring-2"
                    style={{
                      backgroundColor: '#94618e',
                      color: '#f8eee7',
                      borderColor: '#94618e',
                    }}
                  />
                </div>
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
                    />
                  ))}
                </div>
              ) : (
                <div
                  className="text-center py-12 rounded-xl"
                  style={{ backgroundColor: '#94618e' }}
                >
                  <p className="text-xl" style={{ color: '#f8eee7' }}>
                    No jobs found matching your criteria.
                  </p>
                  <p className="text-sm mt-2" style={{ color: '#f8eee7', opacity: 0.7 }}>
                    Try adjusting your filters or search keywords.
                  </p>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </SeekerLayout>
  )
}