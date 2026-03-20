'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Send, Globe, ShieldCheck, Clock, MessageSquare } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import api from '@/lib/api'
import { toast } from 'sonner'

const contactSchema = z.object({
    name: z.string().min(2, 'Identification required'),
    email: z.string().email('Invalid institutional routing'),
    subject: z.string().min(5, 'Specific subject required'),
    message: z.string().min(10, 'Detailed communication required')
})

type ContactFormValues = z.infer<typeof contactSchema>

export default function ContactPage() {
    const [isSubmitting, setIsSubmitting] = useState(false)

    const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactFormValues>({
        resolver: zodResolver(contactSchema)
    })

    const onSubmit = async (data: ContactFormValues) => {
        setIsSubmitting(true)
        try {
            await api.post('/public/contact', data)
            toast.success('Communication Persisted: Institutional receipt acknowledged.')
            reset()
        } catch (error) {
            toast.error('Transmission Failure: Please retry the secure channel.')
        } finally {
            setIsSubmitting(false)
        }
    }

    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.8, ease: "easeOut" as const }
    }

    return (
        <main className="min-h-screen bg-primary flex flex-col font-sans relative overflow-x-hidden">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-40 pb-20 px-6 lg:px-12 border-b border-gold/10">
                <div className="absolute inset-0 z-0 opacity-10 pointer-events-none mix-blend-overlay"
                    style={{ backgroundImage: "url('https://static.wixstatic.com/media/c837a6_51db7f706561479b9f9f7570f739e702~mv2.png')", backgroundSize: 'cover' }} />

                <div className="max-w-7xl mx-auto relative z-10">
                    <motion.div {...fadeIn}>
                        <p className="text-gold font-mono text-[10px] tracking-[0.4em] uppercase mb-6 flex items-center gap-3">
                            <span className="w-8 h-[1px] bg-gold/30"></span> Secure Communication Node
                        </p>
                        <h1 className="text-5xl md:text-7xl font-light text-accent tracking-tighter mb-8 leading-[1.1]">
                            Institutional <span className="font-medium text-gold">Inquiry.</span>
                        </h1>
                        <p className="text-lg text-accent/50 max-w-2xl font-light leading-relaxed">
                            Access our global network of specialist advisors and institutional relationship managers through our secure encrypted channel.
                        </p>
                    </motion.div>
                </div>
            </section>

            <section className="py-24 px-6 lg:px-12 relative">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-20">

                    {/* Contact Information */}
                    <div className="lg:col-span-5 space-y-12">
                        <motion.div {...fadeIn} transition={{ delay: 0.2 }}>
                            <h2 className="text-[10px] font-bold text-gold uppercase tracking-[0.4em] mb-10">Global Access Nodes</h2>
                            <div className="grid gap-8">
                                {[
                                    { icon: <Globe size={20} />, label: "Headquarters", val: "Sovereign District, Node 01, London" },
                                    { icon: <Mail size={20} />, label: "Encrypted Email", val: "support@optimanexgen.org" },
                                    { icon: <Phone size={20} />, label: "Institutional Hotline", val: "+1 (555) 240-0000" },
                                    { icon: <Clock size={20} />, label: "Availability", val: "24/7 Global Coverage" }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-start gap-6 group">
                                        <div className="w-12 h-12 border border-gold/20 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-primary transition-all duration-500">
                                            {item.icon}
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-accent/30 font-bold uppercase tracking-widest mb-1">{item.label}</p>
                                            <p className="text-accent text-sm font-light">{item.val}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div {...fadeIn} transition={{ delay: 0.4 }} className="p-8 bg-primary-light border border-gold/5 flex gap-6 items-center">
                            <div className="w-16 h-16 bg-gold/5 border border-dashed border-gold/20 flex items-center justify-center text-gold shrink-0">
                                <ShieldCheck size={32} />
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-accent uppercase tracking-widest mb-2">SOC 2 Type II Compliant</h3>
                                <p className="text-xs text-accent/40 font-light leading-relaxed">All communications are encrypted using AES-256 and stored within our sovereign data vaults.</p>
                            </div>
                        </motion.div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-1 border-l border-gold/5 hidden lg:block"></div>

                    <div className="lg:col-span-6">
                        <motion.div {...fadeIn} transition={{ delay: 0.3 }} className="bg-primary-light border border-gold/10 p-8 md:p-12 shadow-2xl">
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-accent/30 uppercase tracking-[0.2em] block">Full Name / Entity</label>
                                        <input
                                            {...register('name')}
                                            className={`w-full bg-primary border ${errors.name ? 'border-red-500' : 'border-gold/10'} focus:border-gold outline-none p-4 text-sm text-accent transition-all font-light`}
                                            placeholder="John Doe / Acme Corp"
                                        />
                                        {errors.name && <p className="text-[9px] text-red-500 uppercase tracking-widest">{errors.name.message}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-accent/30 uppercase tracking-[0.2em] block">Institutional Email</label>
                                        <input
                                            {...register('email')}
                                            className={`w-full bg-primary border ${errors.email ? 'border-red-500' : 'border-gold/10'} focus:border-gold outline-none p-4 text-sm text-accent transition-all font-light`}
                                            placeholder="john@institution.com"
                                        />
                                        {errors.email && <p className="text-[9px] text-red-500 uppercase tracking-widest">{errors.email.message}</p>}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-accent/30 uppercase tracking-[0.2em] block">Inquiry Priority / Subject</label>
                                    <input
                                        {...register('subject')}
                                        className={`w-full bg-primary border ${errors.subject ? 'border-red-500' : 'border-gold/10'} focus:border-gold outline-none p-4 text-sm text-accent transition-all font-light`}
                                        placeholder="Institutional Liquidity Inquiry"
                                    />
                                    {errors.subject && <p className="text-[9px] text-red-500 uppercase tracking-widest">{errors.subject.message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-accent/30 uppercase tracking-[0.2em] block">Communication Payload</label>
                                    <textarea
                                        {...register('message')}
                                        rows={6}
                                        className={`w-full bg-primary border ${errors.message ? 'border-red-500' : 'border-gold/10'} focus:border-gold outline-none p-4 text-sm text-accent transition-all font-light resize-none`}
                                        placeholder="Please provide comprehensive details regarding your inquiry..."
                                    />
                                    {errors.message && <p className="text-[9px] text-red-500 uppercase tracking-widest">{errors.message.message}</p>}
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-gold text-primary py-5 font-bold text-[10px] uppercase tracking-[0.4em] hover:bg-gold-dark transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-4"
                                >
                                    {isSubmitting ? (
                                        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <Send size={14} /> Transmit Protocol
                                        </>
                                    )}
                                </button>
                                <p className="text-[9px] text-accent/20 text-center italic tracking-widest underline underline-offset-4 decoration-gold/20">
                                    By transmitting, you agree to our sovereign data encryption protocols.
                                </p>
                            </form>
                        </motion.div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    )
}
