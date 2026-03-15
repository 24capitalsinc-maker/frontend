'use client'
import Navbar from '@/components/Navbar'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle2, Home, Car, Briefcase, GraduationCap, Percent, Clock, Shield, TrendingDown } from 'lucide-react'
import Footer from '@/components/Footer'

export default function LoansPage() {
    const fadeIn = {
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true as const },
        transition: { duration: 0.8, ease: "easeOut" as const }
    }

    return (
        <main className="min-h-screen bg-primary flex flex-col font-sans relative overflow-x-hidden">
            <Navbar />

            {/* Hero */}
            <section className="relative min-h-[90vh] flex items-center justify-center pt-32 pb-20 px-4 md:px-12">
                <div className="absolute inset-0 z-0 opacity-20 mix-blend-overlay pointer-events-none"
                    style={{ backgroundImage: "url('https://static.wixstatic.com/media/c837a6_51db7f706561479b9f9f7570f739e702~mv2.png')", backgroundSize: 'cover', backgroundPosition: 'center' }} />
                <div className="absolute inset-0 z-0 bg-gradient-to-t from-primary via-primary/95 to-primary/60 pointer-events-none" />

                <div className="max-w-6xl w-full mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, ease: "easeOut" as const }}>
                        <div className="inline-flex items-center gap-3 mb-8 border-l-2 border-gold pl-4">
                            <span className="text-xs font-bold uppercase tracking-[0.3em] text-gold">Smart Lending</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-light text-accent tracking-tighter mb-8 leading-[1.1]">
                            Capital when <br /><span className="font-medium text-gold">you need it.</span>
                        </h1>
                        <p className="text-lg text-accent/60 mb-10 leading-relaxed font-light">
                            Fixed rates from 4.9% APR. Same-day funding. Zero origination fees. Whether it's a personal loan, mortgage, or business credit — our lending team is ready.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-5">
                            <Link href="/verify" className="bg-gold text-primary px-10 py-5 font-medium text-sm tracking-widest uppercase hover:bg-gold-dark transition-colors inline-flex items-center justify-center">Apply for a Loan</Link>
                            <Link href="#rates" className="px-10 py-5 text-sm tracking-widest uppercase text-accent border border-gold hover:bg-gold/5 transition-colors inline-flex items-center justify-center gap-3">
                                View Current Rates
                            </Link>
                        </div>
                        <div className="mt-10 flex gap-8">
                            {[{ v: "4.9%", l: "From APR" }, { v: "$0", l: "Origination Fee" }, { v: "Same Day", l: "Funding" }].map((b, i) => (
                                <div key={i}>
                                    <p className="text-gold text-2xl font-light">{b.v}</p>
                                    <p className="text-accent/40 text-[10px] uppercase tracking-widest">{b.l}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" as const }} className="hidden lg:block">
                        <div className="bg-primary-light border border-gold/20 p-10">
                            <h3 className="text-accent/60 text-xs uppercase tracking-widest mb-8 pb-4 border-b border-gold/10">Loan Calculator</h3>
                            <div className="space-y-6 mb-8">
                                {[
                                    { label: "Loan Amount", value: "$25,000", pct: 60 },
                                    { label: "Interest Rate (APR)", value: "6.49%", pct: 30 },
                                    { label: "Loan Term", value: "36 months", pct: 50 },
                                ].map((item, i) => (
                                    <div key={i}>
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="text-accent/50 uppercase tracking-widest text-xs">{item.label}</span>
                                            <span className="text-gold font-mono">{item.value}</span>
                                        </div>
                                        <div className="h-1 bg-primary rounded-full overflow-hidden">
                                            <div className="h-full bg-gold rounded-full" style={{ width: `${item.pct}%` }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="bg-primary border border-gold/20 p-6 mt-6">
                                <p className="text-accent/40 text-[10px] uppercase tracking-widest mb-2">Estimated Monthly Payment</p>
                                <p className="text-4xl font-light text-gold font-mono">$763.48</p>
                                <p className="text-accent/30 text-xs mt-2">Total repayment: $27,485.28 · Save $1,200 vs. competitor rates</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Loan Products */}
            <section className="py-24 px-4 md:px-12 bg-primary-light border-y border-gold/10">
                <div className="max-w-7xl mx-auto">
                    <motion.div {...fadeIn} className="text-center mb-16">
                        <p className="text-gold font-mono text-[10px] tracking-[0.3em] uppercase mb-4">Loan Products</p>
                        <h2 className="text-4xl font-light text-accent tracking-tighter">Credit lines tailored to <span className="text-gold font-medium">scale with you.</span></h2>
                    </motion.div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { icon: <Home size={28} />, title: "Mortgage", range: "$100K–$5M", rate: "From 4.9% APR", desc: "Purchase, refinance, or home equity lines with competitive fixed and adjustable rates." },
                            { icon: <Car size={28} />, title: "Auto Loan", range: "$5K–$150K", rate: "From 5.9% APR", desc: "New or used vehicle financing with flexible terms from 24 to 84 months." },
                            { icon: <Briefcase size={28} />, title: "Personal Loan", range: "$1K–$100K", rate: "From 6.49% APR", desc: "Unsecured loans for any purpose — debt consolidation, home improvement, travel." },
                            { icon: <GraduationCap size={28} />, title: "Student Loan", range: "$5K–$200K", rate: "From 3.99% APR", desc: "Refinance federal or private student loans at lower rates and simplify repayment." },
                        ].map((l, i) => (
                            <motion.div key={i} whileHover={{ y: -4 }} {...fadeIn} className="bg-primary border border-gold/10 hover:border-gold/30 p-8 group transition-all">
                                <div className="w-14 h-14 border border-gold/20 flex items-center justify-center text-gold mb-6 group-hover:bg-gold group-hover:text-primary transition-all">{l.icon}</div>
                                <h3 className="text-xl font-medium text-accent mb-2 group-hover:text-gold transition-colors">{l.title}</h3>
                                <div className="flex gap-4 mb-4">
                                    <span className="text-gold text-xs font-mono">{l.rate}</span>
                                    <span className="text-accent/30 text-xs font-mono">{l.range}</span>
                                </div>
                                <p className="text-accent/50 text-sm leading-relaxed">{l.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Current Rates Table */}
            <section id="rates" className="py-24 px-4 md:px-12 bg-primary border-b border-gold/10">
                <div className="max-w-7xl mx-auto">
                    <motion.div {...fadeIn} className="mb-16">
                        <p className="text-gold font-mono text-[10px] tracking-[0.3em] uppercase mb-4">Current Rates</p>
                        <h2 className="text-4xl font-light text-accent tracking-tighter">Transparent. <span className="text-gold font-medium">Competitive.</span> Fixed.</h2>
                    </motion.div>
                    <div className="bg-primary-light border border-gold/20 overflow-hidden">
                        <div className="grid grid-cols-4 px-8 py-4 border-b border-gold/10 text-[10px] text-accent/40 uppercase tracking-[0.2em] font-bold">
                            <span>Loan Type</span>
                            <span className="text-right">Min. APR</span>
                            <span className="text-right">Max. APR</span>
                            <span className="text-right">Max. Term</span>
                        </div>
                        {[
                            { type: "Personal Loan", min: "6.49%", max: "24.99%", term: "84 months" },
                            { type: "Home Mortgage (Fixed)", min: "4.90%", max: "7.20%", term: "30 years" },
                            { type: "Home Equity Loan", min: "5.50%", max: "9.75%", term: "20 years" },
                            { type: "Auto Loan (New)", min: "5.90%", max: "12.50%", term: "84 months" },
                            { type: "Auto Loan (Used)", min: "7.25%", max: "15.99%", term: "72 months" },
                            { type: "Student Refinance", min: "3.99%", max: "8.50%", term: "25 years" },
                            { type: "Business Line of Credit", min: "7.50%", max: "18.00%", term: "60 months" },
                        ].map((row, i) => (
                            <div key={i} className="grid grid-cols-4 px-8 py-4 border-b border-gold/5 hover:bg-gold/5 transition-colors">
                                <span className="text-accent text-sm">{row.type}</span>
                                <span className="text-right text-green-400 font-mono text-sm">{row.min}</span>
                                <span className="text-right text-accent/50 font-mono text-sm">{row.max}</span>
                                <span className="text-right text-accent/50 text-sm">{row.term}</span>
                            </div>
                        ))}
                        <div className="px-8 py-4 text-[10px] text-accent/30 uppercase tracking-widest">
                            Rates effective March 14, 2026. Subject to creditworthiness. All rates are fixed unless noted.
                        </div>
                    </div>
                </div>
            </section>

            {/* Process */}
            <section className="py-24 px-4 md:px-12 bg-primary-light border-b border-gold/10">
                <div className="max-w-7xl mx-auto">
                    <motion.div {...fadeIn} className="text-center mb-16">
                        <h2 className="text-4xl font-light text-accent tracking-tighter">Approved in <span className="text-gold font-medium">minutes, not days.</span></h2>
                    </motion.div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-0">
                        {[
                            { step: "01", title: "Apply Online", desc: "Complete a simple 5-minute application. No paperwork. Soft credit pull only." },
                            { step: "02", title: "Instant Decision", desc: "Our AI credit engine delivers an approval decision in under 3 minutes." },
                            { step: "03", title: "Review Offer", desc: "Compare rate, term, and monthly payment options. No pressure, no obligation." },
                            { step: "04", title: "Get Funded", desc: "Accept your offer and receive funds directly to your Capital24 account today." },
                        ].map((s, i) => (
                            <motion.div key={i} {...fadeIn} className="p-10 border border-gold/10 hover:border-gold/30 transition-colors relative group">
                                <div className="text-gold/10 font-mono text-7xl font-bold absolute top-4 right-4 leading-none select-none">{s.step}</div>
                                <h3 className="text-xl font-medium text-accent mb-3 group-hover:text-gold transition-colors">{s.title}</h3>
                                <p className="text-accent/50 text-sm leading-relaxed">{s.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 px-4 md:px-12 bg-gold text-center">
                <motion.div {...fadeIn} className="max-w-3xl mx-auto">
                    <h2 className="text-4xl font-light text-primary tracking-tighter mb-6">Check your rate in <span className="font-bold">60 seconds.</span></h2>
                    <p className="text-primary/70 mb-10 font-light">No impact to your credit score. No commitment required.</p>
                    <Link href="/verify" className="bg-primary text-gold px-12 py-5 font-bold tracking-[0.2em] uppercase inline-flex items-center gap-4 hover:bg-primary-light transition-colors">
                        Check My Rate <ArrowRight size={18} />
                    </Link>
                </motion.div>
            </section>

            <Footer />
        </main>
    )
}
