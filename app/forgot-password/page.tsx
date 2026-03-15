'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, ArrowLeft, Shield, Loader2, CheckCircle2 } from 'lucide-react'
import Navbar from '@/components/Navbar'

import { useAuthStore } from '@/store/useAuthStore'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const schema = z.object({
    email: z.string().email('Please enter a valid email address'),
})

type Phase = 'form' | 'sent'

export default function ForgotPasswordPage() {
    const [phase, setPhase] = useState<Phase>('form')
    const [loading, setLoading] = useState(false)
    const [submittedEmail, setSubmittedEmail] = useState('')
    const { user } = useAuthStore()
    const router = useRouter()

    useEffect(() => {
        if (user) {
            router.replace('/dashboard')
        }
    }, [user, router])

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(schema)
    })

    const onSubmit = async (data: any) => {
        setLoading(true)
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })
            setSubmittedEmail(data.email)
            setPhase('sent')
        } catch (error) {
            console.error('Password Reset Error:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="min-h-screen bg-primary flex flex-col relative overflow-x-hidden font-sans">
            {/* Editorial background */}
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
                    {/* Back to Login */}
                    <Link
                        href="/login"
                        className="inline-flex items-center gap-2 text-accent/40 hover:text-gold text-[10px] uppercase tracking-[0.25em] font-bold transition-colors mb-8"
                    >
                        <ArrowLeft size={12} />
                        Back to Login
                    </Link>

                    <div className="bg-primary-light border border-gold/20 relative overflow-hidden">
                        {/* Corner accent */}
                        <div className="absolute top-0 left-0 w-16 h-[2px] bg-gold" />
                        <div className="absolute top-0 left-0 w-[2px] h-16 bg-gold" />

                        <div className="p-10 md:p-12">
                            <AnimatePresence mode="wait">
                                {/* ===== FORM PHASE ===== */}
                                {phase === 'form' && (
                                    <motion.div
                                        key="form"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        {/* Header */}
                                        <div className="mb-10 pb-8 border-b border-gold/10">
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="w-9 h-9 bg-primary border border-gold/30 flex items-center justify-center">
                                                    <Mail size={14} className="text-gold" />
                                                </div>
                                                <span className="text-gold font-mono text-[10px] tracking-[0.3em] uppercase">Account Recovery</span>
                                            </div>
                                            <h2 className="text-3xl font-light text-accent mb-3 tracking-tight">
                                                Reset Password.
                                            </h2>
                                            <p className="text-accent/50 font-light text-sm leading-relaxed">
                                                Enter the email address linked to your Capital24 account and we'll send you a secure reset link.
                                            </p>
                                        </div>

                                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold uppercase tracking-[0.25em] text-accent/40 block">
                                                    Email Address
                                                </label>
                                                <input
                                                    {...register('email')}
                                                    type="email"
                                                    autoFocus
                                                    className="w-full bg-primary border border-gold/20 focus:border-gold px-5 py-4 outline-none transition-colors text-accent placeholder:text-accent/20 font-light text-sm"
                                                    placeholder="client@capital24.com"
                                                />
                                                {errors.email && (
                                                    <p className="text-red-400 text-xs mt-1">{errors.email.message as string}</p>
                                                )}
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="w-full bg-gold text-primary font-bold tracking-[0.2em] uppercase py-5 hover:bg-gold-dark transition-colors flex items-center justify-center gap-3 disabled:opacity-50 text-sm"
                                            >
                                                {loading
                                                    ? <><Loader2 className="animate-spin" size={18} /> Sending Reset Link…</>
                                                    : <><Mail size={16} /> Send Reset Link</>
                                                }
                                            </button>
                                        </form>

                                        <div className="mt-8 pt-6 border-t border-gold/10 text-center">
                                            <p className="text-xs text-accent/40 uppercase tracking-[0.15em]">
                                                Remembered it?{' '}
                                                <Link href="/login" className="text-gold font-bold ml-1 hover:text-gold-dark transition-colors">
                                                    Back to Login
                                                </Link>
                                            </p>
                                        </div>
                                    </motion.div>
                                )}

                                {/* ===== SUCCESS PHASE ===== */}
                                {phase === 'sent' && (
                                    <motion.div
                                        key="sent"
                                        initial={{ opacity: 0, scale: 0.96 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="text-center flex flex-col items-center gap-6 py-8"
                                    >
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: 'spring', stiffness: 280, damping: 22, delay: 0.1 }}
                                            className="w-20 h-20 bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center"
                                        >
                                            <CheckCircle2 size={36} className="text-green-400" strokeWidth={1.5} />
                                        </motion.div>

                                        <div>
                                            <h3 className="text-2xl font-light text-accent mb-3">Check your inbox.</h3>
                                            <p className="text-accent/50 text-sm font-light leading-relaxed">
                                                If <span className="text-gold font-medium">{submittedEmail}</span> is registered with Capital24, you'll receive a password reset link within a few minutes.
                                            </p>
                                        </div>

                                        <div className="w-full bg-primary border border-gold/10 p-5 text-left space-y-2">
                                            <p className="text-[10px] text-gold uppercase tracking-widest font-bold mb-3">What to do next</p>
                                            {[
                                                "Check your inbox (and spam folder) for an email from noreply@capital24.com",
                                                "Click the secure reset link in the email — it expires in 15 minutes",
                                                "Create a new strong password and log back in",
                                            ].map((step, i) => (
                                                <div key={i} className="flex items-start gap-3">
                                                    <span className="text-gold font-mono text-xs shrink-0 mt-0.5">{i + 1}.</span>
                                                    <span className="text-accent/60 text-xs leading-relaxed">{step}</span>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="flex flex-col gap-3 w-full pt-2">
                                            <button
                                                onClick={() => setPhase('form')}
                                                className="w-full border border-gold/20 text-accent/50 py-4 text-xs uppercase tracking-widest hover:border-gold/40 hover:text-gold transition-colors"
                                            >
                                                Use a Different Email
                                            </button>
                                            <Link
                                                href="/login"
                                                className="w-full bg-gold text-primary py-4 text-xs font-bold uppercase tracking-widest text-center hover:bg-gold-dark transition-colors"
                                            >
                                                Return to Login
                                            </Link>
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
