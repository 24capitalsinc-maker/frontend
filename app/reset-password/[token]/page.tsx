'use client'
import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, Shield, Loader2, CheckCircle2, AlertCircle, ArrowRight, Eye, EyeOff } from 'lucide-react'
import Navbar from '@/components/Navbar'

const schema = z.object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(8, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
})

type Phase = 'form' | 'success'

export default function ResetPasswordPage() {
    const params = useParams()
    const router = useRouter()
    const [phase, setPhase] = useState<Phase>('form')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(schema)
    })

    const onSubmit = async (data: any) => {
        setLoading(true)
        setError('')
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/auth/reset-password/${params.token}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password: data.password }),
            })

            if (!response.ok) {
                const result = await response.json()
                throw new Error(result.message || 'Verification failed')
            }

            setPhase('success')
        } catch (error: any) {
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="min-h-screen bg-primary flex flex-col relative overflow-hidden font-sans">
            {/* Background */}
            <div className="absolute inset-0 z-0 opacity-15 mix-blend-overlay pointer-events-none"
                style={{ backgroundImage: "url('https://static.wixstatic.com/media/c837a6_51db7f706561479b9f9f7570f739e702~mv2.png')", backgroundSize: 'cover', backgroundPosition: 'center' }} />
            <div className="absolute inset-0 z-0 bg-gradient-to-br from-primary via-primary to-primary-light/40 pointer-events-none" />

            <Navbar />

            <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10 pt-32">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-full max-w-md"
                >
                    <div className="bg-primary-light border border-gold/20 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-16 h-[2px] bg-gold" />
                        <div className="absolute top-0 left-0 w-[2px] h-16 bg-gold" />

                        <div className="p-10 md:p-12">
                            <AnimatePresence mode="wait">
                                {phase === 'form' ? (
                                    <motion.div
                                        key="form"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        <div className="mb-10 pb-8 border-b border-gold/10">
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="w-9 h-9 bg-primary border border-gold/30 flex items-center justify-center">
                                                    <Lock size={14} className="text-gold" />
                                                </div>
                                                <span className="text-gold font-mono text-[10px] tracking-[0.3em] uppercase">Secure Reset</span>
                                            </div>
                                            <h2 className="text-3xl font-light text-accent mb-3 tracking-tight">
                                                New Access.
                                            </h2>
                                            <p className="text-accent/50 font-light text-sm leading-relaxed">
                                                Establish a new secure password for your optimanexgen institutional portfolio.
                                            </p>
                                        </div>

                                        {error && (
                                            <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-400">
                                                <AlertCircle size={16} />
                                                <p className="text-xs uppercase tracking-widest font-bold">{error}</p>
                                            </div>
                                        )}

                                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold uppercase tracking-[0.25em] text-accent/40 block">
                                                    New Password
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        {...register('password')}
                                                        type={showPassword ? 'text' : 'password'}
                                                        autoFocus
                                                        className="w-full bg-primary border border-gold/20 focus:border-gold px-5 py-4 outline-none transition-colors text-accent font-light text-sm"
                                                        placeholder="••••••••"
                                                    />
                                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-accent/20 hover:text-gold">
                                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                                    </button>
                                                </div>
                                                {errors.password && (
                                                    <p className="text-red-400 text-xs mt-1">{errors.password.message as string}</p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold uppercase tracking-[0.25em] text-accent/40 block">
                                                    Confirm New Password
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        {...register('confirmPassword')}
                                                        type={showConfirmPassword ? 'text' : 'password'}
                                                        className="w-full bg-primary border border-gold/20 focus:border-gold px-5 py-4 outline-none transition-colors text-accent font-light text-sm"
                                                        placeholder="••••••••"
                                                    />
                                                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-accent/20 hover:text-gold">
                                                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                                    </button>
                                                </div>
                                                {errors.confirmPassword && (
                                                    <p className="text-red-400 text-xs mt-1">{errors.confirmPassword.message as string}</p>
                                                )}
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="w-full bg-gold text-primary font-bold tracking-[0.2em] uppercase py-5 hover:bg-gold-dark transition-colors flex items-center justify-center gap-3 disabled:opacity-50 text-sm"
                                            >
                                                {loading
                                                    ? <><Loader2 className="animate-spin" size={18} /> Updating Credentials…</>
                                                    : <><CheckCircle2 size={16} /> Update Password</>
                                                }
                                            </button>
                                        </form>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="success"
                                        initial={{ opacity: 0, scale: 0.96 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="text-center flex flex-col items-center gap-8 py-8"
                                    >
                                        <div className="w-20 h-20 bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center">
                                            <CheckCircle2 size={36} className="text-green-400" strokeWidth={1.5} />
                                        </div>

                                        <div>
                                            <h3 className="text-2xl font-light text-accent mb-3">Secured.</h3>
                                            <p className="text-accent/50 text-sm font-light leading-relaxed">
                                                Your password has been successfully updated. Your institutional access has been restored.
                                            </p>
                                        </div>

                                        <Link
                                            href="/login"
                                            className="w-full bg-gold text-primary py-4 text-sm font-bold uppercase tracking-[0.2em] text-center hover:bg-gold-dark transition-colors flex items-center justify-center gap-3 group"
                                        >
                                            Continue to Account
                                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                        </Link>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    <div className="flex items-center justify-center gap-3 mt-8 text-accent/25">
                        <Shield size={12} />
                        <span className="text-[10px] uppercase tracking-[0.3em] font-medium">Sovereign Encryption Active</span>
                        <Shield size={12} />
                    </div>
                </motion.div>
            </div>
        </main>
    )
}
