'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, CheckCircle2, RefreshCw, ArrowRight, Lock } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Link from 'next/link'
import { useSettingsStore } from '@/store/useSettingsStore'

function generateChallenge() {
    const ops = [
        { a: Math.floor(Math.random() * 15) + 1, b: Math.floor(Math.random() * 10) + 1, op: '+', fn: (a: number, b: number) => a + b },
        { a: Math.floor(Math.random() * 15) + 5, b: Math.floor(Math.random() * 5) + 1, op: '-', fn: (a: number, b: number) => a - b },
        { a: Math.floor(Math.random() * 9) + 2, b: Math.floor(Math.random() * 9) + 2, op: '×', fn: (a: number, b: number) => a * b },
    ]
    const chosen = ops[Math.floor(Math.random() * ops.length)]
    return { ...chosen, answer: chosen.fn(chosen.a, chosen.b) }
}

type Phase = 'checkbox' | 'challenge' | 'verified'

export default function VerifyPage() {
    const router = useRouter()
    const { settings } = useSettingsStore()
    const [phase, setPhase] = useState<Phase>('checkbox')
    const [challenge, setChallenge] = useState(generateChallenge)
    const [answer, setAnswer] = useState('')
    const [error, setError] = useState('')
    const [checkboxAnimating, setCheckboxAnimating] = useState(false)
    const [attempts, setAttempts] = useState(0)

    // If already verified in this session, skip straight to register
    useEffect(() => {
        if (settings && settings.isRegistrationEnabled === false) {
            router.replace('/login')
            return
        }

        if (typeof window !== 'undefined' && sessionStorage.getItem('captcha_verified') === 'true') {
            router.replace('/register')
        }
    }, [router, settings])

    const handleCheckboxClick = useCallback(() => {
        if (phase !== 'checkbox' || checkboxAnimating) return
        setCheckboxAnimating(true)
        // Short pause to mimic reCAPTCHA "checking" animation
        setTimeout(() => {
            setCheckboxAnimating(false)
            setPhase('challenge')
        }, 900)
    }, [phase, checkboxAnimating])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const parsed = parseInt(answer.trim(), 10)
        if (parsed === challenge.answer) {
            setPhase('verified')
            sessionStorage.setItem('captcha_verified', 'true')
            setTimeout(() => router.push('/register'), 1400)
        } else {
            setAttempts(prev => prev + 1)
            setError('Incorrect. Please try again.')
            setAnswer('')
            // Regenerate after 2 failures
            if (attempts >= 1) {
                setChallenge(generateChallenge())
                setAttempts(0)
            }
        }
    }

    const refreshChallenge = () => {
        setChallenge(generateChallenge())
        setAnswer('')
        setError('')
        setAttempts(0)
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
                    {/* Header */}
                    <div className="text-center mb-10">
                        <div className="w-16 h-16 bg-primary-light border border-gold/30 mx-auto flex items-center justify-center mb-6">
                            <Shield size={28} className="text-gold" strokeWidth={1.5} />
                        </div>
                        <p className="text-gold font-mono text-[10px] tracking-[0.3em] uppercase mb-3">Security Verification</p>
                        <h1 className="text-3xl font-light text-accent tracking-tight">Confirm you're human.</h1>
                        <p className="text-accent/40 text-sm mt-3 font-light">Complete the check below to continue to registration.</p>
                    </div>

                    {/* CAPTCHA Card */}
                    <div className="bg-primary-light border border-gold/20 relative overflow-hidden">
                        {/* Gold top accent */}
                        <div className="absolute top-0 left-0 w-16 h-[2px] bg-gold" />
                        <div className="absolute top-0 left-0 w-[2px] h-16 bg-gold" />

                        <div className="p-6 sm:p-8">
                            {/* Brand strip */}
                            <div className="flex justify-between items-center mb-6 pb-5 border-b border-gold/10">
                                <div className="flex items-center gap-2">
                                    <Lock size={12} className="text-gold" />
                                    <span className="text-[10px] text-gold uppercase tracking-[0.3em] font-bold">Capital24 SecureCheck™</span>
                                </div>
                                <span className="text-accent/20 text-[10px] uppercase tracking-widest">v3.1</span>
                            </div>

                            {/* Phase: Checkbox */}
                            <AnimatePresence mode="wait">
                                {phase === 'checkbox' && (
                                    <motion.div key="checkbox"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="flex items-center gap-5 py-4"
                                    >
                                        <button
                                            onClick={handleCheckboxClick}
                                            className={`w-8 h-8 border-2 flex items-center justify-center shrink-0 transition-all duration-300 ${checkboxAnimating ? 'border-gold bg-gold/10' : 'border-gold/40 hover:border-gold'}`}
                                            aria-label="Verify you are not a robot"
                                        >
                                            {checkboxAnimating && (
                                                <motion.div
                                                    animate={{ rotate: 360 }}
                                                    transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                                                >
                                                    <RefreshCw size={14} className="text-gold" />
                                                </motion.div>
                                            )}
                                        </button>
                                        <span className="text-accent text-sm font-medium">
                                            {checkboxAnimating
                                                ? <span className="text-gold text-xs uppercase tracking-widest">Verifying…</span>
                                                : "I'm not a robot"}
                                        </span>
                                    </motion.div>
                                )}

                                {/* Phase: Math Challenge */}
                                {phase === 'challenge' && (
                                    <motion.div key="challenge"
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        <p className="text-accent/50 text-xs uppercase tracking-widest mb-6">Solve the security challenge</p>

                                        {/* Math challenge display */}
                                        <div className="bg-primary border border-gold/20 p-4 sm:p-8 text-center mb-6">
                                            <p className="text-accent/40 text-[9px] sm:text-[10px] uppercase tracking-[0.3em] mb-4">What is the answer?</p>
                                            <div className="flex items-center justify-center gap-3 sm:gap-4">
                                                <span className="text-3xl sm:text-5xl font-light text-accent font-mono">{challenge.a}</span>
                                                <span className="text-xl sm:text-3xl text-gold font-light">{challenge.op}</span>
                                                <span className="text-3xl sm:text-5xl font-light text-accent font-mono">{challenge.b}</span>
                                                <span className="text-xl sm:text-3xl text-accent/30">=</span>
                                                <span className="text-2xl sm:text-4xl text-gold font-mono">?</span>
                                            </div>
                                        </div>

                                        <form onSubmit={handleSubmit} className="space-y-4">
                                            <div>
                                                <input
                                                    type="number"
                                                    value={answer}
                                                    onChange={e => { setAnswer(e.target.value); setError('') }}
                                                    className="w-full bg-primary border border-gold/20 focus:border-gold px-5 py-4 outline-none transition-colors text-accent text-center text-2xl font-mono placeholder:text-accent/20"
                                                    placeholder="Enter your answer"
                                                    autoFocus
                                                />
                                                {error && (
                                                    <motion.p
                                                        initial={{ opacity: 0, y: -4 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        className="text-red-400 text-xs mt-2 text-center"
                                                    >
                                                        {error}
                                                    </motion.p>
                                                )}
                                            </div>
                                            <div className="flex gap-3">
                                                <button
                                                    type="button"
                                                    onClick={refreshChallenge}
                                                    className="border border-gold/20 text-accent/50 p-4 hover:border-gold/40 hover:text-gold transition-colors"
                                                    title="Get a new challenge"
                                                >
                                                    <RefreshCw size={16} />
                                                </button>
                                                <button
                                                    type="submit"
                                                    disabled={!answer}
                                                    className="flex-1 bg-gold text-primary py-4 font-bold tracking-[0.15em] uppercase text-sm hover:bg-gold-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                                >
                                                    Verify <ArrowRight size={16} />
                                                </button>
                                            </div>
                                        </form>
                                    </motion.div>
                                )}

                                {/* Phase: Verified */}
                                {phase === 'verified' && (
                                    <motion.div key="verified"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="py-6 text-center flex flex-col items-center gap-4"
                                    >
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                            className="w-16 h-16 bg-green-500/10 border border-green-500/40 rounded-full flex items-center justify-center"
                                        >
                                            <CheckCircle2 size={32} className="text-green-400" />
                                        </motion.div>
                                        <p className="text-green-400 font-bold uppercase tracking-widest text-sm">Verified!</p>
                                        <p className="text-accent/50 text-xs">Redirecting you to registration…</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Footer brand */}
                            <div className="flex justify-between items-center mt-6 pt-5 border-t border-gold/10">
                                <div className="flex items-center gap-1.5">
                                    <Shield size={10} className="text-gold/60" />
                                    <span className="text-[9px] text-accent/30 uppercase tracking-[0.2em]">Protected by Capital24</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Link href="/privacy" className="text-[9px] text-accent/20 hover:text-accent/40 uppercase tracking-widest transition-colors">Privacy</Link>
                                    <Link href="/terms" className="text-[9px] text-accent/20 hover:text-accent/40 uppercase tracking-widest transition-colors">Terms</Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Back link */}
                    <p className="text-center mt-6 text-accent/30 text-xs uppercase tracking-widest">
                        Already have an account?{' '}
                        <Link href="/login" className="text-gold hover:text-gold-dark transition-colors font-bold">
                            Sign In
                        </Link>
                    </p>
                </motion.div>
            </div>
        </main>
    )
}
