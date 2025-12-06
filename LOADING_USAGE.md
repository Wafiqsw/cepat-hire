# Loading Components Usage Guide

This project includes a comprehensive set of loading components for consistent loading states across the application.

## Components

### 1. Loading Component
Basic loading spinner with optional text.

```tsx
import { Loading } from './components/Loading'

// Basic usage
<Loading />

// With custom size
<Loading size="lg" />

// With text
<Loading size="md" text="Loading data..." />

// Full screen overlay
<Loading fullScreen text="Please wait..." />

// Sizes: 'sm' | 'md' | 'lg' | 'xl'
```

### 2. LoadingOverlay Component
Full-screen loading overlay with backdrop.

```tsx
import { LoadingOverlay } from './components/Loading'

function MyComponent() {
  const [isLoading, setIsLoading] = useState(false)

  return (
    <>
      <LoadingOverlay isLoading={isLoading} text="Fetching data..." />
      {/* Your content */}
    </>
  )
}
```

### 3. Skeleton Component
Placeholder loading skeletons for content.

```tsx
import { Skeleton } from './components/Loading'

// Single skeleton
<Skeleton variant="card" />

// Multiple skeletons
<Skeleton variant="text" count={3} />

// Custom className
<Skeleton variant="rectangle" className="h-48" />

// Variants: 'card' | 'text' | 'circle' | 'rectangle'
```

### 4. Spinner Component
Inline spinner for buttons and small spaces.

```tsx
import { Spinner } from './components/Loading'

<button disabled={isLoading}>
  {isLoading ? <Spinner size={16} /> : 'Submit'}
</button>

// Custom color
<Spinner size={20} color="#94618e" />
```

## Examples

### API Data Fetching

```tsx
function Dashboard() {
  const data = useQuery(api.getData)

  if (!data) {
    return (
      <div>
        <h1>Dashboard</h1>
        <Skeleton variant="card" count={3} />
        <Loading size="lg" text="Loading dashboard..." />
      </div>
    )
  }

  return <div>{/* render data */}</div>
}
```

### Form Submission

```tsx
function MyForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      await submitData()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <LoadingOverlay isLoading={isSubmitting} text="Submitting..." />
      <form onSubmit={handleSubmit}>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Spinner size={16} color="#ffffff" />
              <span className="ml-2">Submitting...</span>
            </>
          ) : (
            'Submit'
          )}
        </button>
      </form>
    </>
  )
}
```

### Skeleton Loading Pattern

```tsx
function JobList() {
  const jobs = useQuery(api.jobs.list)

  if (!jobs) {
    return (
      <div className="space-y-4">
        <Skeleton variant="card" className="h-48" count={3} />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {jobs.map(job => <JobCard key={job.id} job={job} />)}
    </div>
  )
}
```

## Best Practices

1. **Use Skeleton loaders** for content that will be replaced (cards, lists, text)
2. **Use Loading spinner** for centered loading states or empty states
3. **Use LoadingOverlay** for blocking operations (form submissions, deletions)
4. **Use Spinner** for inline loading states (buttons, badges)

## Colors

Default color scheme matches the app theme:
- Primary: `#94618e`
- Background: `#f8eee7`
- Error: `#dc2626`
