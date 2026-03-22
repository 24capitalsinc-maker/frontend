"use client"
import Navbar from '@/components/Navbar'
import Link from 'next/link'
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion'
import { Shield, CreditCard, Send, Smartphone, ArrowRight, CheckCircle2, Globe, PlayCircle, Landmark, Star, TrendingUp, Users, Banknote, Clock, Zap, BarChart3, Lock, ChevronRight } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useSettingsStore } from '@/store/useSettingsStore'
import Footer from '@/components/Footer'
import TestimonialCarousel from '@/components/TestimonialCarousel'

export default function HomePage() {
    const { settings, fetchSettings } = useSettingsStore()
    const [mounted, setMounted] = useState(false)

    // Parallax logic
    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)

    const springConfig = { damping: 25, stiffness: 150 }
    const springX = useSpring(mouseX, springConfig)
    const springY = useSpring(mouseY, springConfig)

    const backgroundX = useTransform(springX, [-500, 500], [20, -20])
    const backgroundY = useTransform(springY, [-500, 500], [20, -20])
    const backgroundRotateX = useTransform(springY, [-500, 500], [2, -2])
    const backgroundRotateY = useTransform(springX, [-500, 500], [-2, 2])

    function handleMouseMove(event: React.MouseEvent) {
        const { clientX, clientY, currentTarget } = event
        const { left, top, width, height } = currentTarget.getBoundingClientRect()
        const x = clientX - (left + width / 2)
        const y = clientY - (top + height / 2)
        mouseX.set(x)
        mouseY.set(y)
    }

    useEffect(() => {
        setMounted(true)
        fetchSettings()
    }, [])

    const fadeIn = {
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true as const },
        transition: { duration: 0.8, ease: "easeOut" as const }
    }

    return (
        <main className="min-h-screen bg-primary relative overflow-x-hidden font-sans">
            <Navbar />

            {/* ===== HERO SECTION ===== */}
            <section
                onMouseMove={handleMouseMove}
                className="relative min-h-screen flex items-center justify-center pt-24 sm:pt-32 pb-40 sm:pb-32 px-4 md:px-12 overflow-hidden bg-silk group/hero"
            >
                <div className="absolute inset-0 bg-noise opacity-10 pointer-events-none" />

                <motion.div
                    initial={{ scale: 1.1, opacity: 0 }}
                    animate={{ scale: 1.05, opacity: 0.65 }}
                    style={{
                        backgroundImage: "url('/hero.png')",
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        x: backgroundX,
                        y: backgroundY,
                        rotateX: backgroundRotateX,
                        rotateY: backgroundRotateY,
                        transformPerspective: 1000
                    }}
                    transition={{ duration: 2, ease: "easeOut" }}
                    className="absolute inset-0 z-0 mix-blend-overlay will-change-transform"
                />

                <div className="absolute inset-0 z-0 bg-gradient-to-t from-primary via-primary/40 to-primary/80" />

                <div className="max-w-7xl w-full mx-auto relative z-10">
                    <div className="flex flex-col items-center text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className="inline-flex items-center gap-4 mb-8"
                        >
                            <div className="h-[1px] w-12 bg-gold/50" />
                            <span className="text-xs font-bold uppercase tracking-[0.5em] text-gold-bright">Private Wealth Management</span>
                            <div className="h-[1px] w-12 bg-gold/50" />
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1.2, delay: 0.7 }}
                            className="text-prestige text-4xl sm:text-5xl md:text-7xl lg:text-8xl mb-8 text-accent max-w-5xl"
                        >
                            Where Ambition Meets <br />
                            <span className="text-gold-gradient font-medium italic">Absolute Precision.</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1.5, delay: 1.2 }}
                            className="text-lg md:text-xl text-accent/70 mb-12 leading-relaxed font-normal max-w-2xl"
                        >
                            The pinnacle of digital banking for individual entities and sovereign institutions. Managed by humans, powered by foresight.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 1.5 }}
                            className="flex flex-col sm:flex-row gap-8"
                        >
                            <Link href="/verify" className="group relative bg-gold text-primary px-12 py-6 font-bold text-xs tracking-[0.3em] uppercase transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-gold/20 overflow-hidden">
                                <span className="relative z-10">Create Account</span>
                                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                            </Link>
                            <Link href="#banking" className="px-12 py-6 font-bold text-xs tracking-[0.3em] uppercase text-accent border border-gold/30 hover:border-gold/60 transition-all hover:bg-gold/5 flex items-center justify-center gap-3">
                                Explore Services
                            </Link>
                        </motion.div>
                    </div>
                </div>

                <div className="absolute bottom-8 sm:bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 sm:gap-4 opacity-30">
                    <p className="text-[8px] sm:text-[10px] uppercase tracking-[0.5em] text-accent">Scroll Discovery</p>
                    <div className="w-[1px] h-8 sm:h-16 bg-gradient-to-b from-gold to-transparent" />
                </div>
            </section>

            {/* ===== LIVE STATS BAR ===== */}
            <section className="py-12 px-4 md:px-12 bg-primary-dark border-y border-gold/10 overflow-hidden relative group/stats">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-10 transition-opacity duration-700 group-hover/stats:opacity-20 translate-z-0"
                    style={{ backgroundImage: "url('/stats-bg.png')" }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-primary-dark via-transparent to-primary-dark opacity-80" />
                <div className="absolute inset-0 bg-silk pointer-events-none opacity-20" />
                <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center relative z-10">
                    {[
                        { value: "$4.2B+", label: "Capital Vault Liquidity" },
                        { value: "0.01%", label: "Sovereign Tier Rates" },
                        { value: "100%", label: "Settlement Guarantee" },
                        { value: "24/7", label: "Executive Concierge" },
                    ].map((stat, i) => (
                        <motion.div key={i} {...fadeIn} className="flex flex-col items-center gap-4">
                            <span className="text-2xl md:text-3xl font-sans font-medium text-gold tracking-normal">{stat.value}</span>
                            <div className="h-[1px] w-6 bg-gold/20" />
                            <span className="text-accent/60 text-[9px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.3em] font-semibold">{stat.label}</span>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ===== CORE SERVICES ===== */}
            <section id="banking" className="py-40 px-4 md:px-12 bg-primary relative">
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
                <div className="max-w-7xl mx-auto">
                    <motion.div {...fadeIn} className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-32 border-b border-gold/10 pb-12">
                        <div className="max-w-2xl">
                            <div className="text-gold font-bold text-[10px] tracking-[0.5em] uppercase mb-4">Global Verticals</div>
                            <h2 className="text-prestige text-5xl md:text-7xl text-accent">
                                Institutional <span className="text-gold font-medium">Mastery.</span>
                            </h2>
                        </div>
                        <p className="text-accent/60 max-w-xs text-[11px] uppercase tracking-[0.2em] leading-relaxed font-medium">Architecting the future of wealth through absolute privacy and technical excellence.</p>
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-16">
                        <EditorialFeature number="01" icon={<Send size={18} className="text-gold" />} title="Sovereign Ledger" desc="Execute high-volume wealth transfers across 128 global jurisdictions with real-time settlement and encrypted journaling." />
                        <EditorialFeature number="02" icon={<CreditCard size={18} className="text-gold" />} title="Obsidian Elite" desc="Precision-milled metal instruments with limitless liquidity and bespoke insurance protocols for the high-net-worth individual." />
                        <EditorialFeature number="03" icon={<BarChart3 size={18} className="text-gold" />} title="Yield Optimization" desc="Algorithmic portfolio rebalancing ensuring 5.24% minimum APY through diversifed institutional lending pools." />
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5 }}
                        className="mt-32 relative h-[60vh] overflow-hidden group border border-gold/10"
                    >
                        <div className="absolute inset-0 bg-primary/40 group-hover:bg-primary/20 transition-all duration-1000 z-10" />
                        <img src="/card.png" className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-[3s]" alt="Premium Card Lifestyle" />
                        <div className="absolute bottom-12 left-12 z-20 max-w-md">
                            <h3 className="text-prestige text-4xl text-accent mb-4">Precision in Every <span className="text-gold italic">Touchpoint.</span></h3>
                            <p className="text-accent/60 text-sm font-light leading-relaxed">The Obsidian Elite card is not just a tool; it's a statement of institutional membership.</p>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ===== HUMAN ADVANTAGE ===== */}
            <section className="py-40 px-4 md:px-12 bg-primary-light relative overflow-hidden">
                <div className="absolute inset-0 bg-silk pointer-events-none" />
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                    <motion.div {...fadeIn} className="relative aspect-[4/5] overflow-hidden border border-gold/10 group">
                        <img src="/wealth.png" className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-[5s]" alt="Global Wealth Management" />
                        <div className="absolute inset-0 bg-gradient-to-t from-primary to-transparent opacity-60" />
                    </motion.div>
                    <motion.div {...fadeIn} className="space-y-12">
                        <div>
                            <div className="text-gold font-bold text-[10px] tracking-[0.5em] uppercase mb-4 italic">The Human Advantage</div>
                            <h2 className="text-prestige text-5xl md:text-7xl text-accent mb-8 leading-[1.1]">
                                Elite Advisors. <span className="text-gold italic">Universal Trust.</span>
                            </h2>
                            <p className="text-lg text-accent/50 font-light leading-relaxed">
                                Behind every transaction is a network of professional wealth strategists. While we lead in technology, our core is human judgment—ensuring your wealth is managed with local context and global intelligence.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            {[
                                { title: "Executive Concierge", desc: "A dedicated human liaison for all institutional needs." },
                                { title: "Strategic Oversight", desc: "Expert advisory on global diversification and risk." },
                                { title: "Privacy Guarantee", desc: "Bank-level secrecy protocols for all private entities." },
                                { title: "24/7 Connectivity", desc: "Your wealth, accessible and managed at any meridian." },
                            ].map((item, i) => (
                                <div key={i} className="space-y-2">
                                    <h4 className="text-gold font-medium tracking-tight">{item.title}</h4>
                                    <p className="text-accent/40 text-xs leading-relaxed font-light">{item.desc}</p>
                                </div>
                            ))}
                        </div>

                        <Link href="/support" className="inline-flex items-center gap-4 text-xs font-bold uppercase tracking-[0.3em] text-gold hover:gap-6 transition-all border-b border-gold/20 pb-2">
                            Meet Your Strategy Liaison <ArrowRight size={14} />
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* ===== LIVE CURRENCY MARKET TABLE ===== */}
            <section id="markets" className="py-40 px-4 md:px-12 bg-primary border-b border-gold/10">
                <div className="max-w-7xl mx-auto">
                    <motion.div {...fadeIn} className="mb-20">
                        <p className="text-gold font-bold text-[10px] tracking-[0.5em] uppercase mb-4 italic">Global Settlement Rates</p>
                        <h2 className="text-prestige text-5xl md:text-7xl text-accent mb-6">
                            Institutional <span className="text-gold font-medium italic">Liquidity.</span>
                        </h2>
                        <p className="text-accent/50 text-[10px] uppercase tracking-[0.3em]">Real-time FX Settlement Data · Synchronized every 30 seconds</p>
                    </motion.div>

                    <div className="bg-primary-dark border border-gold/20 overflow-hidden shadow-2xl">
                        {/* Table Header */}
                        <div className="grid grid-cols-4 md:grid-cols-6 gap-4 px-8 py-6 border-b border-gold/10 text-[9px] text-accent/30 uppercase tracking-[0.3em] font-bold bg-primary-light/50">
                            <span className="col-span-2">Currency Pair</span>
                            <span className="text-right">Settlement Rate</span>
                            <span className="text-right hidden md:block">24h Variance</span>
                            <span className="text-right hidden md:block">Session High</span>
                            <span className="text-right">Session Low</span>
                        </div>
                        {[
                            { pair: "USD/EUR", flag1: "🇺🇸", flag2: "🇪🇺", rate: "0.9186", change: "+0.12%", high: "0.9201", low: "0.9148", up: true },
                            { pair: "USD/GBP", flag1: "🇺🇸", flag2: "🇬🇧", rate: "0.7894", change: "-0.08%", high: "0.7921", low: "0.7871", up: false },
                            { pair: "USD/JPY", flag1: "🇺🇸", flag2: "🇯🇵", rate: "149.84", change: "+0.34%", high: "150.12", low: "149.50", up: true },
                            { pair: "USD/CAD", flag1: "🇺🇸", flag2: "🇨🇦", rate: "1.3542", change: "+0.05%", high: "1.3570", low: "1.3510", up: true },
                            { pair: "USD/CHF", flag1: "🇺🇸", flag2: "🇨🇭", rate: "0.8812", change: "-0.21%", high: "0.8854", low: "0.8798", up: false },
                            { pair: "USD/AUD", flag1: "🇺🇸", flag2: "🇦🇺", rate: "1.5324", change: "+0.18%", high: "1.5360", low: "1.5280", up: true },
                            { pair: "USD/NGN", flag1: "🇺🇸", flag2: "🇳🇬", rate: "1,629.50", change: "-0.42%", high: "1,643.00", low: "1,621.00", up: false },
                            { pair: "EUR/GBP", flag1: "🇪🇺", flag2: "🇬🇧", rate: "0.8591", change: "+0.09%", high: "0.8612", low: "0.8573", up: true },
                        ].map((row, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true as const }}
                                transition={{ delay: i * 0.05 }}
                                className="grid grid-cols-4 md:grid-cols-6 gap-4 px-8 py-6 border-b border-gold/5 hover:bg-gold/5 transition-colors group cursor-pointer"
                            >
                                <div className="col-span-2 flex items-center gap-4">
                                    <span className="text-2xl filter saturate-[0.8]">{row.flag1}{row.flag2}</span>
                                    <div>
                                        <p className="text-accent font-mono font-medium text-sm tracking-tight">{row.pair}</p>
                                        <p className="text-accent/20 text-[8px] uppercase tracking-[0.2em]">Institutional Spot</p>
                                    </div>
                                </div>
                                <span className="text-right font-mono text-accent text-sm self-center font-light">{row.rate}</span>
                                <span className={`text-right font-mono text-xs self-center hidden md:block ${row.up ? 'text-green-500/80' : 'text-red-500/80'}`}>
                                    {row.change}
                                </span>
                                <span className="text-right font-mono text-accent/40 text-xs self-center hidden md:block">{row.high}</span>
                                <span className="text-right font-mono text-accent/40 text-xs self-center">{row.low}</span>
                            </motion.div>
                        ))}
                        <div className="px-8 py-6 flex justify-between items-center bg-primary-light/30">
                            <p className="text-[9px] text-accent/20 uppercase tracking-[0.2em] font-light">Verification via ISO 4217 Wealth Standards · Secure Stream Active</p>
                            <Link href="/personal" className="text-gold text-[10px] uppercase tracking-[0.4em] font-bold flex items-center gap-2 hover:gap-6 transition-all italic">
                                Initialize Settlement <ArrowRight size={12} />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== HOW IT WORKS ===== */}
            <section id="how-it-works" className="py-40 px-4 md:px-12 bg-primary border-b border-gold/10 relative">
                <div className="max-w-7xl mx-auto">
                    <motion.div {...fadeIn} className="text-center mb-32">
                        <p className="text-gold font-bold text-[10px] tracking-[0.5em] uppercase mb-4 italic">The Path to Membership</p>
                        <h2 className="text-prestige text-5xl md:text-7xl text-accent mb-6 leading-tight">
                            Access in <span className="text-gold italic">Seconds.</span>
                        </h2>
                        <div className="w-24 h-[1px] bg-gold/30 mx-auto" />
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-gold/10">
                        {[
                            { step: "01", title: "Institutional Entry", desc: "Digital verification protocols completed in under 120 seconds. No legacy latency.", icon: <Users size={24} /> },
                            { step: "02", title: "Capital Injection", desc: "Instant digital settlement. Link your global treasury or wire funds with zero friction.", icon: <Banknote size={24} /> },
                            { step: "03", title: "Total Command", desc: "Activate your Obsidian dashboard and execute global wealth transfers instantly.", icon: <Globe size={24} /> },
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                {...fadeIn}
                                className="relative p-16 border-r border-gold/10 last:border-r-0 hover:bg-gold/5 transition-all duration-700 group overflow-hidden"
                            >
                                <div className="absolute -top-4 -right-4 text-gold/5 font-mono text-[160px] font-bold leading-none select-none italic group-hover:text-gold/10 transition-colors">{item.step}</div>
                                <div className="w-14 h-14 bg-primary-light border border-gold/20 flex items-center justify-center text-gold mb-10 group-hover:scale-110 transition-transform duration-500 relative z-10">
                                    {item.icon}
                                </div>
                                <h3 className="text-3xl font-light text-accent mb-6 tracking-tight relative z-10">{item.title}</h3>
                                <p className="text-accent/40 text-sm leading-relaxed font-light relative z-10">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== SECURITY SECTION ===== */}
            <section className="py-40 px-4 md:px-12 bg-primary-dark relative overflow-hidden">
                <div className="absolute inset-0 bg-noise opacity-20 pointer-events-none" />
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-32 items-center relative z-10">
                    <motion.div {...fadeIn}>
                        <p className="text-gold font-bold text-[10px] tracking-[0.5em] uppercase mb-8 italic">Sovereign Shield Protocols</p>
                        <h2 className="text-prestige text-5xl md:text-7xl text-accent mb-12 leading-[1.1]">
                            Absolute <span className="text-gold italic">Protection.</span>
                        </h2>
                        <ul className="space-y-8">
                            {[
                                { title: "Institutional Coverage", text: "FDIC insured up to $250,000 via our partner network." },
                                { title: "Vault-Grade Encryption", text: "256-bit AES cryptographic standards for all meta-data." },
                                { title: "Biometric Identity", text: "Multi-factor authentication via secure hardware enclaves." },
                                { title: "AI Threat Detection", text: "Predictive anomaly spotting operating in real-time." },
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-6 border-l border-gold/20 pl-8 hover:border-gold transition-colors duration-500">
                                    <div>
                                        <h4 className="text-accent font-medium tracking-tight mb-2">{item.title}</h4>
                                        <p className="text-accent/40 text-sm font-light leading-relaxed">{item.text}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2 }}
                        className="bg-primary/40 backdrop-blur-3xl border border-gold/20 p-20 text-center flex flex-col items-center gap-10 relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-silk opacity-10" />
                        <div className="w-24 h-24 bg-gold/10 border border-gold/30 rounded-full flex items-center justify-center relative z-10">
                            <Shield size={42} className="text-gold" strokeWidth={1} />
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-4xl font-light text-accent mb-4">Zero Compromise</h3>
                            <p className="text-accent/40 text-sm font-light leading-relaxed max-w-xs mx-auto">Our liability guarantee ensures your assets remain sovereign, always.</p>
                        </div>
                        <div className="grid grid-cols-3 gap-8 w-full pt-10 border-t border-gold/10 relative z-10">
                            {[{ val: "$250K", label: "Insured" }, { val: "256-BIT", label: "Cipher" }, { val: "1ms", label: "Latency" }].map((k, i) => (
                                <div key={i} className="text-center">
                                    <p className="text-gold font-sans text-2xl font-light mb-1">{k.val}</p>
                                    <p className="text-accent/20 text-[8px] uppercase tracking-[0.4em] font-medium">{k.label}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ===== CUSTOMER REVIEWS ===== */}
            <section className="py-40 px-4 md:px-12 bg-primary border-b border-gold/10">
                <div className="max-w-7xl mx-auto">
                    <motion.div {...fadeIn} className="mb-24 flex flex-col md:flex-row justify-between items-end gap-12 border-b border-gold/10 pb-12">
                        <div className="max-w-2xl">
                            <p className="text-gold font-bold text-[10px] tracking-[0.5em] uppercase mb-4 italic">Sovereign Voices</p>
                            <h2 className="text-prestige text-5xl md:text-7xl text-accent">
                                Client <span className="text-gold font-medium italic">Testimonials.</span>
                            </h2>
                        </div>
                        <p className="text-accent/40 text-[10px] uppercase tracking-[0.3em] font-medium mb-2">Trusted by 2.8M Institutional Members</p>
                    </motion.div>

                    <TestimonialCarousel
                        testimonials={[
                            {
                                name: "Marcus W.",
                                role: "CFO, Stellar Dynamics",
                                text: "optimanexgen completely transformed our payroll operations. 40 employees across 6 countries — all paid on time, every time. The multi-currency dashboard is exceptional.",
                                avatar: "MW"
                            },
                            {
                                name: "Priya S.",
                                role: "Design Principal, Dubai",
                                text: "The FX rates are genuinely excellent — better than any bank I have used before. The Obsidian card is a masterpiece of precision and absolute reliability.",
                                avatar: "PS"
                            },
                            {
                                name: "James O.",
                                role: "Real Estate Arbitrage",
                                text: "The jumbo mortgage product is staggeringly good. The banker assigned to me was reachable every day of the process. This is Private Wealth at its finest.",
                                avatar: "JO"
                            }
                        ]}
                    />
                </div>
            </section>

            {/* ===== BLOG / INSIGHTS ===== */}
            <section className="py-40 px-4 md:px-12 bg-primary-light border-b border-gold/10 relative">
                <div className="absolute inset-0 bg-silk pointer-events-none opacity-50" />
                <div className="max-w-7xl mx-auto relative z-10">
                    <motion.div {...fadeIn} className="flex flex-col md:flex-row justify-between items-end gap-12 mb-24">
                        <div className="max-w-2xl">
                            <p className="text-gold font-bold text-[10px] tracking-[0.5em] uppercase mb-4 italic">Institutional Intelligence</p>
                            <h2 className="text-prestige text-5xl md:text-7xl text-accent">
                                The Sovereign <span className="text-gold font-medium italic">Dispatch.</span>
                            </h2>
                        </div>
                        <Link href="#" className="text-gold text-[10px] uppercase tracking-[0.4em] font-bold flex items-center gap-3 hover:gap-6 transition-all border-b border-gold/20 pb-2 italic">
                            Full Briefing Archive <ArrowRight size={14} />
                        </Link>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {[
                            {
                                tag: "Global Settlement",
                                title: "Monetary Sovereignty: The Role of Digital Ledgers in 2026 Wealth Management",
                                excerpt: "An editorial analysis on the shift from legacy clearing systems to real-time institutional settlement protocols.",
                                readTime: "8 MIN READ"
                            },
                            {
                                tag: "Yield Alpha",
                                title: "Optimizing Institutional Liquidity: High-Yield Vaults vs. Sovereign Bonds",
                                excerpt: "Comparative research on achieving alpha in a stabilized interest rate environment through algorithmic rebalancing.",
                                readTime: "12 MIN READ"
                            },
                            {
                                tag: "Security Architecture",
                                title: "The Obsidian Standard: Hardened Hardware Enclaves in Private Banking",
                                excerpt: "Technical insights into how optimanexgen utilizes aerospace-grade security for institutional asset protection.",
                                readTime: "6 MIN READ"
                            },
                        ].map((post, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true as const }}
                                transition={{ delay: i * 0.1, duration: 1 }}
                                className="group cursor-pointer flex flex-col border-l border-gold/10 pl-10 hover:border-gold transition-colors duration-700"
                            >
                                <div className="space-y-8">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[8px] text-gold uppercase tracking-[0.4em] font-bold italic">{post.tag}</span>
                                    </div>
                                    <h3 className="text-2xl font-light text-accent group-hover:text-gold transition-colors duration-500 leading-tight tracking-[0.01em]">{post.title}</h3>
                                    <p className="text-accent/40 text-sm leading-relaxed font-light line-clamp-3 italic">{post.excerpt}</p>
                                    <div className="flex justify-between items-center pt-8">
                                        <span className="text-accent/20 text-[8px] uppercase tracking-[0.3em] flex items-center gap-2">
                                            <Clock size={10} /> {post.readTime}
                                        </span>
                                        <span className="text-gold text-[10px] uppercase tracking-[0.4em] font-bold flex items-center gap-2 group-hover:gap-4 transition-all italic">
                                            Read Briefing <ChevronRight size={14} />
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== CTA BANNER ===== */}
            <section className="py-32 sm:py-48 px-4 md:px-12 bg-primary-dark relative overflow-hidden text-center">
                <div className="absolute inset-0 bg-hero opacity-30 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/80 to-transparent" />
                <div className="absolute inset-0 bg-silk opacity-10" />

                <motion.div {...fadeIn} className="max-w-4xl mx-auto relative z-10">
                    <div className="text-gold font-bold text-[10px] tracking-[0.6em] uppercase mb-8 italic">The Sovereign Call</div>
                    <h2 className="text-prestige text-5xl md:text-7xl text-accent mb-12">
                        Bank Without <span className="text-gold italic">Limits.</span>
                    </h2>
                    <p className="text-accent/40 text-xl font-light mb-16 max-w-2xl mx-auto leading-relaxed">
                        Join the world's most elite financial ecosystem. Create your institutional membership in under three minutes.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-12">
                        <Link href="/verify" className="group relative bg-gold text-primary px-16 py-8 font-bold text-xs tracking-[0.4em] uppercase transition-all hover:scale-105 active:scale-95 shadow-3xl shadow-gold/20 overflow-hidden">
                            <span className="relative z-10">Create Account</span>
                            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                        </Link>
                    </div>
                </motion.div>
            </section>

            {/* ===== FOOTER ===== */}
            <Footer />
        </main>
    )
}

function EditorialFeature({ number, icon, title, desc }: { number: string, icon: React.ReactNode, title: string, desc: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true as const }}
            transition={{ duration: 1 }}
            className="group relative"
        >
            <div className="flex justify-between items-start mb-8 border-b border-gold/20 pb-6 transition-colors group-hover:border-gold/50">
                <p className="text-gold font-mono text-[9px] tracking-[0.5em] font-bold">{number} // PROTOCOL</p>
                <div className="group-hover:scale-110 transition-transform duration-500 text-gold">{icon}</div>
            </div>
            <h3 className="text-prestige text-3xl text-accent mb-6 group-hover:text-gold transition-colors duration-500">{title}</h3>
            <p className="text-accent/50 text-sm leading-relaxed font-light">{desc}</p>
        </motion.div>
    );
}
