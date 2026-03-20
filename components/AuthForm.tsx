'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import api from '@/lib/api'
import { useAuthStore } from '@/store/useAuthStore'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Loader2, Shield, Lock, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'

const schema = z.object({
    name: z.string().min(2, 'Full name is required').optional(),
    email: z.string().email('Valid email is required'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    phoneNumber: z.string().min(10, 'Valid phone number is required').optional(),
    dateOfBirth: z.string().min(1, 'Date of birth is required').optional(),
    address: z.string().min(5, 'Residential address is required').optional(),
    gender: z.string().min(1, 'Please select a gender').optional(),
    occupation: z.string().min(2, 'Occupation is required').optional(),
})

export default function AuthForm({ type }: { type: 'login' | 'register' }) {
    const [step, setStep] = useState(1)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const setAuth = useAuthStore((state) => state.setAuth)
    const router = useRouter()

    const { register, handleSubmit, formState: { errors }, trigger } = useForm({
        resolver: zodResolver(schema)
    })

    const nextStep = async () => {
        let fields: any[] = []
        if (step === 1) fields = ['name', 'email', 'password']
        if (step === 2) fields = ['phoneNumber', 'dateOfBirth', 'gender']

        const isValid = await trigger(fields)
        if (isValid) setStep(prev => prev + 1)
    }

    const prevStep = () => setStep(prev => prev - 1)

    const onSubmit = async (data: any) => {
        setLoading(true)
        setError('')
        try {
            const endpoint = type === 'login' ? '/auth/login' : '/auth/register'
            const res = await api.post(endpoint, data)
            if (type === 'login') {
                setAuth(res.data, res.data.accessToken, res.data.refreshToken)
                router.push('/dashboard')
            } else {
                // Registration: store userId so the verify page can use it
                sessionStorage.setItem('verifyUserId', res.data.userId)
                sessionStorage.removeItem('captcha_verified')
                router.push('/verify-email')
            }
        } catch (err: any) {
            if (type === 'login' && err.response?.status === 403 && err.response?.data?.isUnverified) {
                // Handle unverified account during login
                sessionStorage.setItem('verifyUserId', err.response.data.userId)
                router.push('/verify-email')
                return
            }
            setError(err.response?.data?.message || 'Authentication failed. Please verify your credentials.')
            if (type === 'register') setStep(1)
        } finally {
            setLoading(false)
        }
    }

    const inputClasses = "w-full bg-primary/40 border border-gold/10 focus:border-gold/50 px-5 py-4 outline-none transition-all duration-300 text-accent placeholder:text-accent/20 font-light text-sm backdrop-blur-sm focus:bg-primary/60"
    const labelClasses = "text-[10px] font-bold uppercase tracking-[0.25em] text-gold/50 block mb-2"

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full max-w-xl"
        >
            <div className="bg-primary-light/40 border border-gold/20 backdrop-blur-2xl relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                {/* Visual accents */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full blur-3xl -mr-16 -mt-16" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-gold/5 rounded-full blur-3xl -ml-16 -mb-16" />

                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

                <div className="p-10 md:p-14">
                    {/* Header */}
                    <div className="mb-12">
                        <div className="flex justify-between items-center mb-8">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-primary/60 border border-gold/30 flex items-center justify-center rounded-sm">
                                    <Shield size={16} className="text-gold" />
                                </div>
                                <div className="h-4 w-[1px] bg-gold/20 mr-1"></div>
                                <span className="text-gold font-bold text-[10px] tracking-[0.4em] uppercase">optimanexgen Secure</span>
                            </div>
                            {type === 'register' && (
                                <div className="flex gap-2">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className={`h-1 w-6 transition-all duration-500 ${step >= i ? 'bg-gold' : 'bg-gold/10'}`} />
                                    ))}
                                </div>
                            )}
                        </div>
                        <h2 className="text-4xl font-light text-accent mb-4 tracking-tighter">
                            {type === 'login' ? 'Welcome Back.' : step === 1 ? 'Start Your Journey.' : step === 2 ? 'Personal Details.' : 'Finalize Profile.'}
                        </h2>
                        <p className="text-accent/40 font-light text-sm tracking-wide">
                            {type === 'login'
                                ? 'Authenticate your session to access premium features.'
                                : `Phase ${step} of 3: Establishing your secure digital banking identity.`}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                        {type === 'login' ? (
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className={labelClasses}>Email Address</label>
                                    <input {...register('email')} type="email" className={inputClasses} placeholder="client@optimanexgen.org" />
                                    {errors.email && <p className="text-red-400 text-[10px] uppercase font-bold tracking-widest mt-1">{errors.email.message as string}</p>}
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center mb-1">
                                        <label className={labelClasses}>Secret Key</label>
                                        <Link href="/forgot-password" className="text-[10px] uppercase tracking-widest text-gold/40 hover:text-gold transition-colors">Recover Account?</Link>
                                    </div>
                                    <div className="relative">
                                        <input type={showPassword ? 'text' : 'password'} {...register('password')} className={inputClasses} placeholder="••••••••••••" />
                                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-accent/20 hover:text-gold">
                                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                    {errors.password && <p className="text-red-400 text-[10px] uppercase font-bold tracking-widest mt-1">{errors.password.message as string}</p>}
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6 min-h-[320px]">
                                {step === 1 && (
                                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                                        <div className="space-y-2">
                                            <label className={labelClasses}>Legal Full Name</label>
                                            <input {...register('name')} className={inputClasses} placeholder="Jonathan Sterling" />
                                            {errors.name && <p className="text-red-400 text-[10px] mt-1">{errors.name.message as string}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <label className={labelClasses}>Primary Email</label>
                                            <input {...register('email')} type="email" className={inputClasses} placeholder="client@optimanexgen.org" />
                                            {errors.email && <p className="text-red-400 text-[10px] mt-1">{errors.email.message as string}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <label className={labelClasses}>Secure Password</label>
                                            <div className="relative">
                                                <input {...register('password')} type={showPassword ? 'text' : 'password'} className={inputClasses} placeholder="Minimum 6 characters" />
                                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-accent/20 hover:text-gold">
                                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                                </button>
                                            </div>
                                            {errors.password && <p className="text-red-400 text-[10px] mt-1">{errors.password.message as string}</p>}
                                        </div>
                                    </motion.div>
                                )}

                                {step === 2 && (
                                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className={labelClasses}>Phone Number</label>
                                                <input {...register('phoneNumber')} className={inputClasses} placeholder="+1 (555) 000-0000" />
                                                {errors.phoneNumber && <p className="text-red-400 text-[10px] mt-1">{errors.phoneNumber.message as string}</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <label className={labelClasses}>Date of Birth</label>
                                                <input {...register('dateOfBirth')} type="date" className={inputClasses} />
                                                {errors.dateOfBirth && <p className="text-red-400 text-[10px] mt-1">{errors.dateOfBirth.message as string}</p>}
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className={labelClasses}>Gender Recognition</label>
                                            <select {...register('gender')} className={`${inputClasses} appearance-none cursor-pointer`}>
                                                <option value="" className="bg-primary">Select Gender</option>
                                                <option value="Male" className="bg-primary">Male</option>
                                                <option value="Female" className="bg-primary">Female</option>
                                                <option value="Other" className="bg-primary">Other / Private</option>
                                            </select>
                                            {errors.gender && <p className="text-red-400 text-[10px] mt-1">{errors.gender.message as string}</p>}
                                        </div>
                                    </motion.div>
                                )}

                                {step === 3 && (
                                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                                        <div className="space-y-2">
                                            <label className={labelClasses}>Residential Address</label>
                                            <input {...register('address')} className={inputClasses} placeholder="123 Editorial Ave, New York, NY" />
                                            {errors.address && <p className="text-red-400 text-[10px] mt-1">{errors.address.message as string}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <label className={labelClasses}>Current Occupation</label>
                                            <input {...register('occupation')} className={inputClasses} placeholder="e.g. Finance Director, Software Engineer" />
                                            {errors.occupation && <p className="text-red-400 text-[10px] mt-1">{errors.occupation.message as string}</p>}
                                        </div>
                                        <div className="p-5 border border-gold/10 bg-gold/5 flex items-start gap-4">
                                            <Shield size={18} className="text-gold mt-1 shrink-0" />
                                            <p className="text-[10px] leading-relaxed text-accent/50 uppercase tracking-widest">
                                                By finalizing, you agree to optimanexgen's premium banking <Link href="/terms" className="text-gold hover:underline">terms</Link> and institutional <Link href="/privacy" className="text-gold hover:underline">privacy standards</Link>.
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        )}

                        {error && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 border border-red-500/30 bg-red-500/5 text-red-400 text-[10px] font-bold tracking-widest uppercase text-center">
                                {error}
                            </motion.div>
                        )}

                        <div className="flex gap-4 pt-4">
                            {type === 'register' && step > 1 && (
                                <button type="button" onClick={prevStep} className="flex-1 border border-gold/30 text-gold font-bold tracking-[0.2em] uppercase py-5 hover:bg-gold/5 transition-all text-xs">
                                    Previous
                                </button>
                            )}

                            <button
                                type={type === 'login' || step === 3 ? 'submit' : 'button'}
                                onClick={type === 'register' && step < 3 ? nextStep : undefined}
                                disabled={loading}
                                className="flex-[2] bg-gold text-primary font-bold tracking-[0.3em] uppercase py-5 hover:bg-gold-dark transition-all flex items-center justify-center gap-3 disabled:opacity-50 text-xs shadow-lg shadow-gold/10"
                            >
                                {loading ? <Loader2 className="animate-spin" size={16} /> : (
                                    <>
                                        {type === 'login' ? 'Authenticate' : step === 3 ? 'Establish Account' : 'Continue'}
                                        <Lock size={14} className="opacity-50" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="mt-12 pt-8 border-t border-gold/10 text-center">
                        <Link href={type === 'login' ? '/verify' : '/login'} className="text-[10px] text-accent/30 uppercase tracking-[0.2em] hover:text-gold transition-colors group">
                            {type === 'login' ? "Don't have an account?" : "Already a premium member?"}
                            <span className="text-gold font-bold ml-2 group-hover:underline">{type === 'login' ? 'Join optimanexgen' : 'Secure Sign In'}</span>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="mt-8 flex items-center justify-center gap-6 text-accent/20">
                <div className="h-[1px] w-12 bg-gold/10" />
                <span className="text-[9px] uppercase tracking-[0.4em] font-medium">Verified by Financial Conduct Authority</span>
                <div className="h-[1px] w-12 bg-gold/10" />
            </div>
        </motion.div>
    )
}
