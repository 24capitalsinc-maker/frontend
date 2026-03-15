'use client'
import Navbar from '@/components/Navbar'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { User, Shield, Zap, Smartphone, ArrowRight, ShieldCheck, CheckCircle2, TrendingUp, PiggyBank, CreditCard, Clock } from 'lucide-react'
import Footer from '@/components/Footer'

export default function PersonalPage() {
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
                            <span className="text-xs font-bold uppercase tracking-[0.3em] text-gold">Private Wealth</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-light text-accent tracking-tighter mb-8 leading-[1.1]">
                            Banking tailored to <br /><span className="font-medium text-gold">Your Ambition.</span>
                        </h1>
                        <p className="text-lg text-accent/60 mb-10 leading-relaxed font-light">
                            Zero fees. Interest on your checking. Early direct deposits. Instant peer transfers. This is what modern personal banking should feel like.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-5">
                            <Link href="/verify" className="bg-gold text-primary px-10 py-5 font-medium text-sm tracking-widest uppercase hover:bg-gold-dark transition-colors inline-flex items-center justify-center">Create an Account</Link>
                            <Link href="/login" className="px-10 py-5 text-sm tracking-widest uppercase text-accent border border-gold hover:bg-gold/5 transition-colors inline-flex items-center justify-center gap-3">
                                <ShieldCheck size={16} className="text-gold" /> Sign In
                            </Link>
                        </div>
                        <div className="mt-10 flex gap-8">
                            {[{ v: "$0", l: "Monthly Fees" }, { v: "5.24%", l: "Savings APY" }, { v: "2 Days", l: "Early Paycheck" }].map((b, i) => (
                                <div key={i}>
                                    <p className="text-gold text-2xl font-light">{b.v}</p>
                                    <p className="text-accent/40 text-[10px] uppercase tracking-widest">{b.l}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" as const }} className="hidden lg:block">
                        <div className="bg-primary-light border border-gold/20 p-10 flex flex-col gap-6">
                            <div className="flex justify-between items-center border-b border-gold/10 pb-6">
                                <div>
                                    <p className="text-[10px] text-gold uppercase tracking-[0.3em] mb-1">Checking</p>
                                    <p className="text-accent/40 text-xs font-mono">**** 2941</p>
                                </div>
                                <TrendingUp size={18} className="text-green-400" />
                            </div>
                            <div>
                                <p className="text-xs text-accent/40 uppercase tracking-widest mb-2">Available Balance</p>
                                <p className="text-4xl font-light text-accent tracking-tight">$14,290.50</p>
                                <p className="text-green-400 text-xs mt-2 font-mono">+ $1,200.00 INBOUND</p>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-primary border border-gold/10 p-4">
                                    <p className="text-[10px] text-accent/40 uppercase tracking-widest mb-1">Vault APY</p>
                                    <p className="text-xl font-mono text-gold">5.24%</p>
                                </div>
                                <div className="bg-primary border border-gold/10 p-4">
                                    <p className="text-[10px] text-accent/40 uppercase tracking-widest mb-1">Cashback</p>
                                    <p className="text-xl font-mono text-accent">$84.20</p>
                                </div>
                            </div>
                            <div className="space-y-2">
                                {[
                                    { name: "Salary Direct Deposit", amount: "+$5,500.00", time: "Yesterday", type: "in" },
                                    { name: "Whole Foods Market", amount: "-$84.20", time: "Today", type: "out" },
                                    { name: "Vault Transfer", amount: "-$500.00", time: "Today", type: "out" },
                                ].map((tx, i) => (
                                    <div key={i} className="flex justify-between items-center p-3 hover:bg-primary/50 transition-colors">
                                        <div>
                                            <p className="text-accent text-sm">{tx.name}</p>
                                            <p className="text-accent/30 text-xs">{tx.time}</p>
                                        </div>
                                        <span className={`font-mono text-sm ${tx.type === 'in' ? 'text-green-400' : 'text-accent/70'}`}>{tx.amount}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Products */}
            <section className="py-24 px-4 md:px-12 bg-primary-light border-y border-gold/10">
                <div className="max-w-7xl mx-auto">
                    <motion.div {...fadeIn} className="text-center mb-16">
                        <p className="text-gold font-mono text-[10px] tracking-[0.3em] uppercase mb-4">Products</p>
                        <h2 className="text-4xl font-light text-accent tracking-tighter">Everything you need, <span className="text-gold font-medium">nothing you don't.</span></h2>
                    </motion.div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { icon: <PiggyBank size={28} />, title: "Savings Vault", value: "5.24% APY", desc: "Earn the highest yield on the market with no lockup period and daily interest accrual." },
                            { icon: <CreditCard size={28} />, title: "Debit Card", value: "Zero Fees", desc: "Free metal debit card with worldwide ATM access, zero foreign transaction fees, and real-time spend notifications." },
                            { icon: <Zap size={28} />, title: "Instant Transfers", value: "Under 60s", desc: "Send money to any Capital24 member instantly using just their email or phone number." },
                            { icon: <Clock size={28} />, title: "Early Paycheck", value: "2 Days Early", desc: "Get your direct deposit up to 48 hours earlier than traditional banks through our instant routing system." },
                        ].map((p, i) => (
                            <motion.div key={i} whileHover={{ y: -4 }} {...fadeIn} className="bg-primary border border-gold/10 hover:border-gold/30 p-8 group transition-all">
                                <div className="w-14 h-14 border border-gold/20 flex items-center justify-center text-gold mb-6 group-hover:bg-gold group-hover:text-primary transition-all">{p.icon}</div>
                                <div className="text-gold font-mono text-lg mb-1">{p.value}</div>
                                <h3 className="text-xl font-medium text-accent mb-3 group-hover:text-gold transition-colors">{p.title}</h3>
                                <p className="text-accent/50 text-sm leading-relaxed">{p.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Capital24 */}
            <section className="py-24 px-4 md:px-12 bg-primary border-b border-gold/10">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <motion.div {...fadeIn}>
                        <p className="text-gold font-mono text-[10px] tracking-[0.3em] uppercase mb-6">Why Capital24</p>
                        <h2 className="text-3xl md:text-4xl font-light text-accent tracking-tighter mb-8 leading-tight">
                            A completely <span className="text-gold font-medium">frictionless</span> financial ecosystem.
                        </h2>
                        <p className="text-accent/50 font-light mb-10 leading-relaxed">
                            Traditional banks rely on confusing fee structures and manual processes to generate profit. Capital24 is built differently — every product we offer is designed to save you money, not cost you money.
                        </p>
                        <ul className="space-y-5">
                            {[
                                { title: "No Minimums or Monthly Fees", desc: "Keep 100% of what is yours. No fee ever." },
                                { title: "Get Paid 2 Days Early", desc: "Lightning network routing credits faster." },
                                { title: "FDIC Insured to $250,000", desc: "Your deposits are fully protected." },
                                { title: "24/7 Live Human Support", desc: "Not bots. Real people, around the clock." },
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-4">
                                    <CheckCircle2 size={20} className="text-gold shrink-0 mt-1" strokeWidth={1.5} />
                                    <div>
                                        <h4 className="text-accent font-medium text-sm mb-1">{item.title}</h4>
                                        <p className="text-accent/40 text-xs font-light">{item.desc}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    <motion.div {...fadeIn}>
                        <div className="bg-primary-light border border-gold/20 p-10">
                            <h3 className="text-accent font-light text-lg mb-8 pb-4 border-b border-gold/10">Capital24 vs. Traditional Bank</h3>
                            <div className="space-y-4">
                                {[
                                    { feature: "Monthly maintenance fee", us: "Free", them: "$12-25/mo" },
                                    { feature: "Minimum balance requirement", us: "$0", them: "$500-1,500" },
                                    { feature: "Foreign transaction fees", us: "0%", them: "3%" },
                                    { feature: "ATM fees worldwide", us: "Free", them: "$2.50-5.00" },
                                    { feature: "Early direct deposit", us: "2 days early", them: "On payday" },
                                    { feature: "Savings interest (APY)", us: "5.24%", them: "0.01-0.05%" },
                                ].map((row, i) => (
                                    <div key={i} className="grid grid-cols-3 gap-4 py-3 border-b border-gold/5 text-sm">
                                        <span className="text-accent/50 col-span-1 text-xs">{row.feature}</span>
                                        <span className="text-gold font-mono text-center font-bold">{row.us}</span>
                                        <span className="text-accent/30 font-mono text-right">{row.them}</span>
                                    </div>
                                ))}
                                <div className="pt-2 grid grid-cols-3 gap-4 text-[10px] uppercase tracking-widest text-accent/30">
                                    <span></span>
                                    <span className="text-gold text-center">Capital24</span>
                                    <span className="text-right">Traditional Bank</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 px-4 md:px-12 bg-gold text-center">
                <motion.div {...fadeIn} className="max-w-3xl mx-auto">
                    <h2 className="text-4xl font-light text-primary tracking-tighter mb-6">The future of personal <span className="font-bold">banking.</span></h2>
                    <p className="text-primary/70 mb-10 font-light">Opens in 3 minutes. Zero credit score impact.</p>
                    <Link href="/verify" className="bg-primary text-gold px-12 py-5 font-bold tracking-[0.2em] uppercase inline-flex items-center gap-4 hover:bg-primary-light transition-colors">
                        Open Account Today <ArrowRight size={18} />
                    </Link>
                </motion.div>
            </section>

            <Footer />
        </main>
    )
}
