'use client'
import Navbar from '@/components/Navbar'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Briefcase, Globe2, BarChart3, ShieldCheck, ArrowRight, CheckCircle2, Users, Layers, Zap, FileText, Lock, ChevronRight } from 'lucide-react'
import Footer from '@/components/Footer'

export default function BusinessPage() {
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
                    <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, delay: 0.2, ease: "easeOut" as const }}>
                        <div className="inline-flex items-center gap-3 mb-8 border-l-2 border-gold pl-4">
                            <span className="text-xs font-bold uppercase tracking-[0.3em] text-gold">Corporate Solutions</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-light text-accent tracking-tighter mb-8 leading-[1.1]">
                            Banking for the <br /><span className="font-medium text-gold">Modern Enterprise.</span>
                        </h1>
                        <p className="text-lg text-accent/60 mb-10 leading-relaxed font-light">
                            Scale your operations globally with dedicated treasury management, high-volume AP/AR processing, and flawless API integration built for hyper-growth businesses.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-5">
                            <Link href="/verify" className="bg-gold text-primary px-10 py-5 font-medium text-sm tracking-widest uppercase hover:bg-gold-dark transition-colors inline-flex items-center justify-center">Open Business Account</Link>
                            <Link href="/support" className="px-10 py-5 font-medium text-sm tracking-widest uppercase text-accent border border-gold hover:bg-gold/5 transition-colors inline-flex items-center justify-center">Contact Sales</Link>
                        </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" as const }} className="hidden lg:block">
                        <div className="absolute -inset-4 border border-gold/20 -z-10" />
                        <div className="bg-primary-light border border-gold/20 p-10">
                            <div className="flex justify-between items-center border-b border-gold/10 pb-6 mb-8">
                                <h3 className="text-accent text-sm font-light uppercase tracking-widest">Enterprise Dashboard</h3>
                                <span className="text-gold text-[10px] font-mono uppercase tracking-widest">Live</span>
                            </div>
                            <div className="space-y-5 mb-8">
                                {[
                                    { label: "Operating Cash", value: "$4,250,000.00", gold: false },
                                    { label: "Treasury Yield (YTD)", value: "+ 5.24%", gold: true },
                                    { label: "Pending Wires", value: "12 transactions", gold: false },
                                    { label: "Active Virtual Cards", value: "48 issued", gold: false },
                                    { label: "Monthly Payroll", value: "$820,000.00", gold: false },
                                ].map((row, i) => (
                                    <div key={i} className="flex justify-between items-center py-2 border-b border-gold/5">
                                        <span className="text-accent/50 text-sm uppercase tracking-widest">{row.label}</span>
                                        <span className={`font-mono text-sm ${row.gold ? 'text-gold' : 'text-accent'}`}>{row.value}</span>
                                    </div>
                                ))}
                            </div>
                            <button className="w-full border border-gold/30 text-gold py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-gold/5 transition-colors">
                                Access Corporate Vault
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Core Features */}
            <section className="py-24 px-4 md:px-12 bg-primary-light border-y border-gold/10">
                <div className="max-w-7xl mx-auto">
                    <motion.div {...fadeIn} className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-light text-accent tracking-tighter mb-4">Institutional <span className="text-gold font-medium">Infrastructure.</span></h2>
                        <p className="text-accent/50 text-sm uppercase tracking-widest max-w-xl mx-auto">Built for complexity. Designed for scale.</p>
                    </motion.div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { icon: <Globe2 size={24} />, title: "Global Treasury", desc: "Manage multi-currency accounts across 40+ jurisdictions with institutional FX rates." },
                            { icon: <BarChart3 size={24} />, title: "ERP Integration", desc: "Native connectors for NetSuite, QuickBooks, Xero, and SAP. Eliminate manual data entry." },
                            { icon: <ShieldCheck size={24} />, title: "Role-Based Access", desc: "Granular permission tiers. Define 3-layer approval workflows for any transaction type." },
                            { icon: <Users size={24} />, title: "Payroll Management", desc: "Automate multi-currency payroll for global teams. Full tax and compliance reporting." },
                            { icon: <Layers size={24} />, title: "Subsidiary Management", desc: "Control multiple subsidiary accounts from one master dashboard with consolidated reporting." },
                            { icon: <Zap size={24} />, title: "Real-Time Payments", desc: "Sub-second settlement on domestic transfers. International wires in under 4 hours." },
                        ].map((f, i) => (
                            <motion.div key={i} whileHover={{ y: -4 }} className="p-8 border border-gold/10 hover:border-gold/30 transition-all group bg-primary">
                                <div className="w-12 h-12 border border-gold/20 flex items-center justify-center text-gold mb-6 group-hover:bg-gold group-hover:text-primary transition-all">{f.icon}</div>
                                <h3 className="text-xl font-medium text-accent mb-3 group-hover:text-gold transition-colors">{f.title}</h3>
                                <p className="text-accent/50 text-sm leading-relaxed">{f.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Tiers */}
            <section className="py-24 px-4 md:px-12 bg-primary border-b border-gold/10">
                <div className="max-w-7xl mx-auto">
                    <motion.div {...fadeIn} className="text-center mb-16">
                        <p className="text-gold font-mono text-[10px] tracking-[0.3em] uppercase mb-4">Transparent Pricing</p>
                        <h2 className="text-4xl md:text-5xl font-light text-accent tracking-tighter">Plans that <span className="text-gold font-medium">scale with you.</span></h2>
                    </motion.div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            {
                                tier: "Starter", price: "$0", period: "/ month", desc: "Perfect for early-stage startups and sole traders.",
                                features: ["1 Business Account", "50 free transactions/month", "2 user seats", "Standard FX rates", "Email support"],
                                cta: "Start Free", highlight: false
                            },
                            {
                                tier: "Growth", price: "$49", period: "/ month", desc: "For scaling teams with growing transaction volume.",
                                features: ["3 Business Accounts", "500 free transactions/month", "10 user seats", "Preferential FX rates", "Priority support", "ERP integration"],
                                cta: "Get Started", highlight: true
                            },
                            {
                                tier: "Enterprise", price: "Custom", period: "pricing", desc: "Tailored for corporations with complex global needs.",
                                features: ["Unlimited accounts", "Unlimited transactions", "Unlimited user seats", "Institutional FX rates", "Dedicated relationship manager", "Custom API contracts"],
                                cta: "Contact Sales", highlight: false
                            },
                        ].map((plan, i) => (
                            <motion.div key={i} {...fadeIn} className={`border p-10 flex flex-col ${plan.highlight ? 'border-gold bg-primary-light' : 'border-gold/10 bg-primary'}`}>
                                {plan.highlight && <div className="text-[10px] text-primary bg-gold font-bold uppercase tracking-widest px-3 py-1 w-fit mb-6">Most Popular</div>}
                                <h3 className="text-2xl font-light text-accent mb-2">{plan.tier}</h3>
                                <div className="mb-3">
                                    <span className="text-4xl font-light text-gold tracking-tight">{plan.price}</span>
                                    <span className="text-accent/40 text-sm ml-2">{plan.period}</span>
                                </div>
                                <p className="text-accent/50 text-sm mb-8 font-light">{plan.desc}</p>
                                <ul className="space-y-3 mb-10 flex-1">
                                    {plan.features.map((f, j) => (
                                        <li key={j} className="flex items-center gap-3 text-accent/70 text-sm">
                                            <CheckCircle2 size={14} className="text-gold shrink-0" />
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                                <Link href="/verify" className={`w-full py-4 text-center text-sm font-bold uppercase tracking-widest transition-colors ${plan.highlight ? 'bg-gold text-primary hover:bg-gold-dark' : 'border border-gold/30 text-gold hover:bg-gold/5'}`}>
                                    {plan.cta}
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Corporate Cards */}
            <section className="py-24 px-4 md:px-12 bg-primary-light border-b border-gold/10">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <motion.div {...fadeIn}>
                        <p className="text-gold font-mono text-[10px] tracking-[0.3em] uppercase mb-6">Corporate Cards</p>
                        <h2 className="text-3xl md:text-4xl font-light text-accent tracking-tighter mb-8 leading-tight">
                            Unprecedented <span className="text-gold font-medium">expense control.</span>
                        </h2>
                        <ul className="space-y-5">
                            {[
                                "Issue unlimited virtual cards for distinct vendor payments",
                                "Set dynamic spend limits by department, project, or employee",
                                "Real-time expense tracking with automated receipt matching",
                                "1.5% unlimited cash back applied directly to principal balance",
                                "Instant card freeze and dispute filing from the dashboard",
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-4 text-accent/70 text-sm font-light">
                                    <CheckCircle2 size={18} className="text-gold shrink-0 mt-0.5" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                        <Link href="/verify" className="mt-10 inline-flex items-center gap-3 text-gold uppercase tracking-widest text-xs font-bold hover:gap-5 transition-all">
                            Apply for Corporate Card <ArrowRight size={14} />
                        </Link>
                    </motion.div>
                    <motion.div {...fadeIn} className="bg-primary border border-gold/20 p-10">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center pb-4 border-b border-gold/10">
                                <span className="text-accent/50 text-xs uppercase tracking-widest">March 2026 Expenses</span>
                                <span className="text-gold font-mono text-sm">$48,240.00 total</span>
                            </div>
                            {[
                                { dept: "Engineering", amount: "$18,400", pct: 38, color: "bg-gold" },
                                { dept: "Marketing", amount: "$12,200", pct: 25, color: "bg-gold/60" },
                                { dept: "Operations", amount: "$9,800", pct: 20, color: "bg-gold/40" },
                                { dept: "HR & Admin", amount: "$7,840", pct: 17, color: "bg-gold/20" },
                            ].map((item, i) => (
                                <div key={i} className="pt-2">
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-accent/70">{item.dept}</span>
                                        <span className="text-accent font-mono">{item.amount}</span>
                                    </div>
                                    <div className="h-1 bg-primary-light rounded-full overflow-hidden">
                                        <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.pct}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 px-4 md:px-12 bg-gold text-center">
                <motion.div {...fadeIn} className="max-w-3xl mx-auto">
                    <h2 className="text-4xl font-light text-primary tracking-tighter mb-6">Ready to elevate your <span className="font-bold">Enterprise?</span></h2>
                    <p className="text-primary/70 mb-10 font-light">Join industry leaders executing billions through Capital24's fiscal network.</p>
                    <Link href="/verify" className="bg-primary text-gold px-12 py-5 font-bold tracking-[0.2em] uppercase inline-flex items-center gap-4 hover:bg-primary-light transition-colors">
                        Initiate Onboarding <ArrowRight size={18} />
                    </Link>
                </motion.div>
            </section>

            <Footer />
        </main>
    )
}
