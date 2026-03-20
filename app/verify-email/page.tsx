'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, CheckCircle2, Loader2, ArrowLeft } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Link from 'next/link'
import { useAuthStore } from '@/store/useAuthStore'
import api from '@/lib/api'

export default function VerifyEmailPage() {
    const router = useRouter()
    const { user, setAuth } = useAuthStore()
    const [code, setCode] = useState(['', '', '', '', '', ''])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [phase, setPhase] = useState<'input' | 'success'>('input')
    const inputsRef = useRef<(HTMLInputElement | null)[]>([])

    // If already logged in, redirect to dashboard
    useEffect(() => {
        if (user) router.replace('/dashboard')
    }, [user, router])

    const handleChange = (idx: number, value: string) => {
        // Accept only digits; handle pasting of full code
        if (value.length > 1) {
            const digits = value.replace(/\D/g, '').slice(0, 6).split('')
            const newCode = [...code]
            digits.forEach((d, i) => {
                if (idx + i < 6) newCode[idx + i] = d
            })
            setCode(newCode)
            const next = Math.min(idx + digits.length, 5)
            inputsRef.current[next]?.focus()
            return
        }
        if (!/^\d?$/.test(value)) return
        const newCode = [...code]
        newCode[idx] = value
        setCode(newCode)
        if (value && idx < 5) inputsRef.current[idx + 1]?.focus()
    }

    const handleKeyDown = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !code[idx] && idx > 0) {
            inputsRef.current[idx - 1]?.focus()
        }
    }

    const pinValue = code.join('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (pinValue.length !== 6) {
            setError('Please enter the complete 6-digit code.')
            return
        }
        const userId = sessionStorage.getItem('verifyUserId')
        if (!userId) {
            setError('Session expired. Please register again.')
            return
        }
        setLoading(true)
        setError('')
        try {
            const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
            const res = await fetch(`${apiBase}/api/auth/verify-email`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, code: pinValue }),
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.message || 'Verification failed')

            // Clear the temporary session storage entry
            sessionStorage.removeItem('verifyUserId')

            // Set auth state and redirect to dashboard
            setAuth(data, data.accessToken, data.refreshToken)
            setPhase('success')
            setTimeout(() => router.push('/dashboard'), 1800)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleResend = async () => {
        const userId = sessionStorage.getItem('verifyUserId')
        if (!userId) {
            setError('Session expired. Please register again.')
            return
        }
        setLoading(true)
        setError('')
        try {
            const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
            const res = await fetch(`${apiBase}/api/auth/resend-verification`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId }),
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.message || 'Failed to resend code')

            // Show brief success message
            setError('A new code has been sent.')
            setTimeout(() => setError(''), 3000)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="min-h-screen bg-primary flex flex-col relative overflow-x-hidden font-sans">
            {/* Background */}
            <div className="absolute inset-0 z-0 opacity-15 mix-blend-overlay pointer-events-none"
                style={{ backgroundImage: "url('https://static.wixstatic.com/media/c837a6_51db7f706561479b9f9f7570f739e702~mv2.png')", backgroundSize: 'cover', backgroundPosition: 'center' }} />
            <div className="absolute inset-0 z-0 bg-gradient-to-br from-primary via-primary to-primary-light/40 pointer-events-none" />

            <Navbar />

            <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10 pt-32 sm:pt-40">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-full max-w-md"
                >
                    <Link
                        href="/register"
                        className="inline-flex items-center gap-2 text-accent/40 hover:text-gold text-[10px] uppercase tracking-[0.25em] font-bold transition-colors mb-8"
                    >
                        <ArrowLeft size={12} />
                        Back to Registration
                    </Link>

                    <div className="bg-primary-light border border-gold/20 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-16 h-[2px] bg-gold" />
                        <div className="absolute top-0 left-0 w-[2px] h-16 bg-gold" />

                        <div className="p-6 sm:p-10 md:p-12">
                            <AnimatePresence mode="wait">
                                {phase === 'input' ? (
                                    <motion.div
                                        key="input"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        {/* Header */}
                                        <div className="mb-8 sm:mb-10 pb-6 sm:pb-8 border-b border-gold/10">
                                            <div className="flex items-center gap-3 mb-4 sm:mb-6">
                                                <div className="w-8 h-8 sm:w-9 sm:h-9 bg-primary border border-gold/30 flex items-center justify-center">
                                                    <Shield size={14} className="text-gold" />
                                                </div>
                                                <span className="text-gold font-mono text-[9px] sm:text-[10px] tracking-[0.3em] uppercase">Identity Verification</span>
                                            </div>
                                            <h2 className="text-2xl sm:text-3xl font-light text-accent mb-3 tracking-tight">
                                                Verify Your Account.
                                            </h2>
                                            <p className="text-accent/50 font-light text-xs sm:text-sm leading-relaxed">
                                                A 6-digit verification code has been sent to your registered email address. Enter it below to activate your optimanexgen account.
                                            </p>
                                        </div>

                                        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
                                            {/* 6-digit code inputs */}
                                            <div>
                                                <label className="text-[10px] font-bold uppercase tracking-[0.25em] text-accent/40 block mb-4">
                                                    Verification Code
                                                </label>
                                                <div className="grid grid-cols-6 gap-2 sm:gap-3">
                                                    {code.map((digit, i) => (
                                                        <input
                                                            key={i}
                                                            ref={(el) => { inputsRef.current[i] = el }}
                                                            type="text"
                                                            inputMode="numeric"
                                                            maxLength={6}
                                                            value={digit}
                                                            onChange={(e) => handleChange(i, e.target.value)}
                                                            onKeyDown={(e) => handleKeyDown(i, e)}
                                                            autoFocus={i === 0}
                                                            className="w-full h-12 sm:h-14 text-center text-lg sm:text-xl font-bold text-gold bg-primary border border-gold/20 focus:border-gold outline-none transition-colors tracking-widest"
                                                        />
                                                    ))}
                                                </div>
                                                {error && (
                                                    <p className="text-red-400 text-[10px] sm:text-xs mt-3 font-bold uppercase tracking-widest">{error}</p>
                                                )}
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={loading || pinValue.length !== 6}
                                                className="w-full bg-gold text-primary font-bold tracking-[0.2em] uppercase py-4 sm:py-5 hover:bg-gold-dark transition-colors flex items-center justify-center gap-3 disabled:opacity-50 text-[12px] sm:text-sm"
                                            >
                                                {loading
                                                    ? <><Loader2 className="animate-spin" size={18} /> Verifying…</>
                                                    : <><Shield size={16} /> Verify & Activate Account</>
                                                }
                                            </button>
                                        </form>

                                        <div className="mt-8 pt-6 border-t border-gold/10 text-center">
                                            <p className="text-xs text-accent/40 uppercase tracking-[0.15em]">
                                                Didn't receive the code?{' '}
                                                <button
                                                    type="button"
                                                    onClick={handleResend}
                                                    className="text-gold font-bold ml-1 hover:text-gold-dark transition-colors"
                                                >
                                                    Resend Code
                                                </button>
                                            </p>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="success"
                                        initial={{ opacity: 0, scale: 0.96 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="text-center flex flex-col items-center gap-6 py-8"
                                    >
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: 'spring', stiffness: 280, damping: 22 }}
                                            className="w-20 h-20 bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center"
                                        >
                                            <CheckCircle2 size={36} className="text-green-400" strokeWidth={1.5} />
                                        </motion.div>
                                        <div>
                                            <h3 className="text-2xl font-light text-accent mb-2">Verified.</h3>
                                            <p className="text-accent/50 text-sm">Redirecting you to your dashboard…</p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Trust badge */}
                    <div className="flex items-center justify-center gap-3 mt-6 text-accent/25">
                        <Shield size={12} />
                        <span className="text-[10px] uppercase tracking-[0.3em] font-medium">256-bit SSL Encrypted</span>
                        <Shield size={12} />
                    </div>
                </motion.div>
            </div>
        </main>
    )
}
