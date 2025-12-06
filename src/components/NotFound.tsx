import { useNavigate } from '@tanstack/react-router'
import { Home, ArrowLeft } from 'lucide-react'
import { Button } from './Button'

export const NotFound = () => {
    const navigate = useNavigate()

    return (
        <div
            className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
            style={{
                background: 'linear-gradient(135deg, #f8eee7 0%, #ffffff 100%)'
            }}
        >
            {/* Decorative circles */}
            <div
                className="absolute top-20 left-10 w-64 h-64 rounded-full opacity-10"
                style={{ backgroundColor: '#94618e' }}
            />
            <div
                className="absolute bottom-20 right-10 w-96 h-96 rounded-full opacity-10"
                style={{ backgroundColor: '#94618e' }}
            />
            <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-5"
                style={{ backgroundColor: '#94618e' }}
            />

            <div className="text-center relative z-10 max-w-2xl">
                {/* 404 with gradient */}
                <h1
                    className="text-8xl md:text-9xl font-bold mb-6"
                    style={{
                        background: 'linear-gradient(135deg, #94618e 0%, #7a4f73 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                    }}
                >
                    404
                </h1>

                <h2
                    className="text-3xl md:text-4xl font-bold mb-4"
                    style={{ color: '#94618e' }}
                >
                    Oops! Page Not Found
                </h2>

                <p
                    className="text-lg mb-10 max-w-md mx-auto"
                    style={{ color: '#94618e', opacity: 0.7 }}
                >
                    The page you're looking for doesn't exist or has been moved.
                </p>

                {/* Centered Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button
                        variant="primary"
                        size="lg"
                        onClick={() => navigate({ to: '/' })}
                    >
                        <Home size={20} />
                        Go Home
                    </Button>

                    <Button
                        variant="outline"
                        size="lg"
                        onClick={() => window.history.back()}
                    >
                        <ArrowLeft size={20} />
                        Go Back
                    </Button>
                </div>
            </div>
        </div>
    )
}
