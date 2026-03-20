'use client'
import Navbar from '@/components/Navbar'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, Phone, Mail, Shield, ChevronDown, ArrowRight, Clock, Globe, Headphones, CheckCircle2 } from 'lucide-react'
import { useState } from 'react'
import Footer from '@/components/Footer'

export default function SupportPage() {
    const fadeIn = {
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true as const },
        transition: { duration: 0.8, ease: "easeOut" as const }
    }
    const [openFaq, setOpenFaq] = useState<number | null>(null)

    const faqs = [
        { q: "How do I open a optimanexgen account?", a: "Simply click 'Open Account', complete our secure 3-minute form, verify your identity with a government-issued ID, and fund your account. You'll be banking within the hour." },
        { q: "Is my money safe with optimanexgen?", a: "Yes. optimanexgen deposits are FDIC insured up to $250,000 per depositor. All data is encrypted with AES-256, and our systems undergo annual SOC 2 Type II audits." },
        { q: "How do I send an international wire transfer?", a: "Log into your dashboard, select 'Transfers', choose 'International Wire', enter the recipient's SWIFT/BIC code and IBAN/account number. Wires typically settle within 1-4 business hours." },
        { q: "What are the fees for foreign currency conversion?", a: "Standard accounts use mid-market rates plus a 0.5% conversion fee. Signature and Reserve cardholders enjoy zero FX fees on all foreign currency transactions." },
        { q: "How do I dispute a transaction?", a: "In your dashboard or mobile app, locate the transaction, tap 'Dispute', and complete the brief form. We'll freeze the charge immediately and investigate within 24 hours." },
        { q: "Can I manage multiple accounts from one dashboard?", a: "Yes. All personal and business accounts linked to your profile are accessible from one unified dashboard with real-time consolidated balance and transaction views." },
        { q: "How do I increase my transfer limits?", a: "Contact your Relationship Manager or use the in-app limit upgrade request. Identity verification and a brief compliance review are required for increases above $25,000/day." },
        { q: "What happens if my card is lost or stolen?", a: "Instantly freeze your card from the app or web dashboard. Call our 24/7 hotline for emergency card cancellation and expedited replacement, typically delivered within 48 hours." },
    ]

    return (
        <main className="min-h-screen bg-primary flex flex-col font-sans relative overflow-x-hidden">
            <Navbar />

            {/* Hero */}
            <section className="relative min-h-[70vh] flex items-center justify-center pt-32 pb-20 px-4 md:px-12">
                <div className="absolute inset-0 z-0 opacity-20 mix-blend-overlay pointer-events-none"
                    style={{ backgroundImage: "url('https://static.wixstatic.com/media/c837a6_51db7f706561479b9f9f7570f739e702~mv2.png')", backgroundSize: 'cover', backgroundPosition: 'center' }} />
                <div className="absolute inset-0 z-0 bg-gradient-to-t from-primary via-primary/95 to-primary/60 pointer-events-none" />

                <div className="max-w-4xl w-full mx-auto relative z-10 text-center">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: "easeOut" as const }}>
                        <div className="inline-flex items-center justify-center gap-3 mb-8 border border-gold/20 px-4 py-2">
                            <span className="text-xs font-bold uppercase tracking-[0.3em] text-gold">24/7 Concierge</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-light text-accent tracking-tighter mb-8 leading-[1.1]">
                            Global <span className="font-medium text-gold">Support.</span>
                        </h1>
                        <p className="text-lg text-accent/60 mb-10 leading-relaxed font-light max-w-2xl mx-auto">
                            Our dedicated concierge team and specialist advisors are available around the clock to assist with account queries, urgent disputes, and large transaction authorizations.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-5">
                            <Link href="/login" className="bg-gold text-primary px-10 py-5 font-medium text-sm tracking-widest uppercase hover:bg-gold-dark transition-colors inline-flex items-center justify-center gap-3">
                                <MessageCircle size={16} /> Start Live Chat
                            </Link>
                            <a href="tel:+15552400000" className="px-10 py-5 text-sm tracking-widest uppercase text-accent border border-gold hover:bg-gold/5 transition-colors inline-flex items-center justify-center gap-3">
                                <Phone size={16} className="text-gold" /> Call Now
                            </a>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Contact Methods */}
            <section className="py-24 px-4 md:px-12 bg-primary-light border-y border-gold/10">
                <div className="max-w-7xl mx-auto">
                    <motion.div {...fadeIn} className="text-center mb-16">
                        <h2 className="text-4xl font-light text-accent tracking-tighter">Reach us <span className="text-gold font-medium">your way.</span></h2>
                    </motion.div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            {
                                icon: <MessageCircle size={32} />, title: "Secure Messaging", badge: "Fastest",
                                desc: "Encrypted in-app messaging with a live concierge. Average response: under 2 minutes.",
                                meta: "Available 24/7 · Encrypted end-to-end",
                                action: "Open Chat", href: "/login"
                            },
                            {
                                icon: <Phone size={32} />, title: "Global Hotline", badge: "Urgent",
                                desc: "Speak directly with a specialist for fraud alerts, account locks, or large transfer authorizations.",
                                meta: "+1 (555) 240-0000 · Available 24/7",
                                action: "Call Now", href: "tel:+15552400000"
                            },
                            {
                                icon: <Mail size={32} />, title: "Email Concierge", badge: "Detailed",
                                desc: "For non-urgent documentation requests, compliance queries, or formal complaint submissions.",
                                meta: "support@optimanexgen.org · Reply within 4 hours",
                                action: "Use Contact Form", href: "/contact"
                            },
                        ].map((c, i) => (
                            <motion.div key={i} whileHover={{ y: -4 }} {...fadeIn} className="bg-primary border border-gold/10 hover:border-gold/30 p-10 flex flex-col gap-5 group transition-all">
                                <div className="flex justify-between items-start">
                                    <div className="w-14 h-14 border border-gold/20 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-primary transition-all">{c.icon}</div>
                                    <span className="text-[10px] text-primary bg-gold px-2 py-1 font-bold uppercase tracking-widest">{c.badge}</span>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-medium text-accent mb-3 group-hover:text-gold transition-colors">{c.title}</h3>
                                    <p className="text-accent/50 text-sm leading-relaxed mb-4">{c.desc}</p>
                                    <p className="text-accent/30 text-xs uppercase tracking-widest">{c.meta}</p>
                                </div>
                                <a href={c.href} className="text-gold text-xs uppercase tracking-widest font-bold flex items-center gap-2 hover:gap-4 transition-all w-fit">
                                    {c.action} <ArrowRight size={12} />
                                </a>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SLA / Response Standards */}
            <section className="py-24 px-4 md:px-12 bg-primary border-b border-gold/10">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <motion.div {...fadeIn}>
                        <p className="text-gold font-mono text-[10px] tracking-[0.3em] uppercase mb-6">Service Standards</p>
                        <h2 className="text-3xl md:text-4xl font-light text-accent tracking-tighter mb-8 leading-tight">
                            We hold ourselves to <span className="text-gold font-medium">exceptional standards.</span>
                        </h2>
                        <ul className="space-y-5">
                            {[
                                { title: "Live chat response", time: "< 2 minutes" },
                                { title: "Phone pickup time", time: "< 30 seconds" },
                                { title: "Email response SLA", time: "< 4 hours" },
                                { title: "Fraud dispute resolution", time: "< 24 hours" },
                                { title: "Account unlock requests", time: "< 15 minutes" },
                                { title: "Wire recall resolution", time: "< 48 hours" },
                            ].map((item, i) => (
                                <li key={i} className="flex justify-between items-center py-3 border-b border-gold/5">
                                    <div className="flex items-center gap-3">
                                        <CheckCircle2 size={16} className="text-gold shrink-0" />
                                        <span className="text-accent/70 text-sm">{item.title}</span>
                                    </div>
                                    <span className="text-gold font-mono text-sm">{item.time}</span>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                    <motion.div {...fadeIn} className="grid grid-cols-2 gap-4">
                        {[
                            { icon: <Headphones size={28} />, label: "Languages", value: "28 Supported" },
                            { icon: <Globe size={28} />, label: "Coverage", value: "Global 24/7" },
                            { icon: <Clock size={28} />, label: "Avg. Chat Response", value: "< 2 min" },
                            { icon: <Shield size={28} />, label: "Dispute Rate Won", value: "98.4%" },
                        ].map((stat, i) => (
                            <div key={i} className="bg-primary-light border border-gold/10 hover:border-gold/30 p-8 flex flex-col items-center text-center gap-4 group transition-all">
                                <div className="w-14 h-14 border border-gold/20 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-primary transition-all">{stat.icon}</div>
                                <p className="text-2xl text-gold font-light">{stat.value}</p>
                                <p className="text-accent/40 text-[10px] uppercase tracking-widest">{stat.label}</p>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-24 px-4 md:px-12 bg-primary-light border-b border-gold/10">
                <div className="max-w-4xl mx-auto">
                    <motion.div {...fadeIn} className="text-center mb-16">
                        <p className="text-gold font-mono text-[10px] tracking-[0.3em] uppercase mb-4">Knowledge Base</p>
                        <h2 className="text-4xl font-light text-accent tracking-tighter">Frequently Asked <span className="text-gold font-medium">Questions.</span></h2>
                    </motion.div>
                    <div className="space-y-2">
                        {faqs.map((faq, i) => (
                            <motion.div
                                key={i}
                                {...fadeIn}
                                className="border border-gold/10 hover:border-gold/25 transition-colors overflow-hidden"
                            >
                                <button
                                    className="w-full flex justify-between items-center px-8 py-6 text-left gap-6"
                                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                >
                                    <span className="text-accent font-medium text-sm leading-snug">{faq.q}</span>
                                    <ChevronDown
                                        size={18}
                                        className={`text-gold shrink-0 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`}
                                    />
                                </button>
                                <AnimatePresence initial={false}>
                                    {openFaq === i && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="px-8 pb-6 text-accent/60 text-sm leading-relaxed border-t border-gold/5 pt-4">
                                                {faq.a}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 px-4 md:px-12 bg-gold text-center">
                <motion.div {...fadeIn} className="max-w-3xl mx-auto">
                    <h2 className="text-4xl font-light text-primary tracking-tighter mb-6">Still have <span className="font-bold">questions?</span></h2>
                    <p className="text-primary/70 mb-10 font-light">Our team is online right now and ready to help.</p>
                    <Link href="/login" className="bg-primary text-gold px-12 py-5 font-bold tracking-[0.2em] uppercase inline-flex items-center gap-4 hover:bg-primary-light transition-colors">
                        <MessageCircle size={18} /> Start a Conversation
                    </Link>
                </motion.div>
            </section>

            <Footer />
        </main>
    )
}
