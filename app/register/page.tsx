'use client'
import AuthForm from '@/components/AuthForm'
import Navbar from '@/components/Navbar'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
    const router = useRouter()
    const [verified, setVerified] = useState(false)

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const ok = sessionStorage.getItem('captcha_verified') === 'true'
            if (!ok) {
                router.replace('/verify')
            } else {
                setVerified(true)
            }
        }
    }, [router])

    if (!verified) {
        // Render nothing while the redirect happens
        return (
            <main className="min-h-screen bg-primary flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-primary flex flex-col relative overflow-x-hidden">
            {/* Editorial background texture */}
            <div
                className="absolute inset-0 z-0 opacity-10 mix-blend-overlay pointer-events-none"
                style={{
                    backgroundImage: "url('https://static.wixstatic.com/media/c837a6_51db7f706561479b9f9f7570f739e702~mv2.png')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            />
            <div className="absolute inset-0 z-0 bg-gradient-to-br from-primary via-primary to-primary-light/40 pointer-events-none" />

            <Navbar />

            <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 relative z-10">
                <AuthForm type="register" />
            </div>
        </main>
    )
}
