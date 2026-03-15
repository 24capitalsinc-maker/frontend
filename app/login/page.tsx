'use client'
import AuthForm from '@/components/AuthForm'
import Navbar from '@/components/Navbar'
import Link from 'next/link'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/useAuthStore'

export default function LoginPage() {
    const { user } = useAuthStore()
    const router = useRouter()

    useEffect(() => {
        if (user) {
            router.replace('/dashboard')
        }
    }, [user, router])
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

            <div className="flex-1 flex flex-col items-center justify-center p-6 pt-32 sm:pt-40 md:p-12 md:pt-40 relative z-10">
                <AuthForm type="login" />
            </div>
        </main>
    )
}
