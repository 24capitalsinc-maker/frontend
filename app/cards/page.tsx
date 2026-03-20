'use client'
import Navbar from '@/components/Navbar'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { CreditCard, Globe, Shield, Star, ArrowRight, CheckCircle2, Zap, Gift, Plane, Lock } from 'lucide-react'
import Footer from '@/components/Footer'

export default function CardsPage() {
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
                            <span className="text-xs font-bold uppercase tracking-[0.3em] text-gold">Premium Cards</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-light text-accent tracking-tighter mb-8 leading-[1.1]">
                            Cards that <br /><span className="font-medium text-gold">Define You.</span>
                        </h1>
                        <p className="text-lg text-accent/60 mb-10 leading-relaxed font-light">
                            From everyday cashback to elite travel rewards and metal cards reserved for high-net-worth members — optimanexgen has the card to match your lifestyle.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-5">
                            <Link href="/verify" className="bg-gold text-primary px-10 py-5 font-medium text-sm tracking-widest uppercase hover:bg-gold-dark transition-colors inline-flex items-center justify-center">Apply Now</Link>
                            <Link href="#compare" className="px-10 py-5 text-sm tracking-widest uppercase text-accent border border-gold hover:bg-gold/5 transition-colors inline-flex items-center justify-center gap-3">
                                Compare Cards
                            </Link>
                        </div>
                    </motion.div>

                    {/* Card Visual */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" as const }} className="hidden lg:flex flex-col gap-6">
                        {/* Reserve Card */}
                        <div className="relative w-full aspect-[1.6/1] bg-gradient-to-br from-gold/80 via-gold to-gold-dark border border-gold/30 p-8 flex flex-col justify-between group hover:scale-105 transition-transform duration-500">
                            <div className="flex justify-between items-start">
                                <span className="text-primary font-light text-xs uppercase tracking-[0.3em]">optimanexgen</span>
                                <span className="text-primary font-bold text-xs uppercase tracking-widest">Reserve</span>
                            </div>
                            <div>
                                <p className="text-primary/70 text-sm font-mono tracking-[0.3em] mb-3">**** **** **** 9182</p>
                                <p className="text-primary font-medium text-sm uppercase tracking-widest">Jonathan Sterling</p>
                            </div>
                        </div>
                        {/* Black Card */}
                        <div className="relative w-4/5 ml-auto aspect-[1.6/1] bg-primary-light border border-gold/20 p-8 flex flex-col justify-between hover:border-gold/40 transition-colors duration-500">
                            <div className="flex justify-between items-start">
                                <span className="text-accent/60 font-light text-xs uppercase tracking-[0.3em]">optimanexgen</span>
                                <span className="text-accent/60 text-xs uppercase tracking-widest">Black</span>
                            </div>
                            <div>
                                <p className="text-accent/40 text-sm font-mono tracking-[0.3em] mb-3">**** **** **** 4451</p>
                                <p className="text-accent/60 text-xs uppercase tracking-widest">Virtual Ready</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Card Comparison */}
            <section id="compare" className="py-24 px-4 md:px-12 bg-primary-light border-y border-gold/10">
                <div className="max-w-7xl mx-auto">
                    <motion.div {...fadeIn} className="text-center mb-16">
                        <p className="text-gold font-mono text-[10px] tracking-[0.3em] uppercase mb-4">Card Portfolio</p>
                        <h2 className="text-4xl md:text-5xl font-light text-accent tracking-tighter">Find your <span className="text-gold font-medium">perfect card.</span></h2>
                    </motion.div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            {
                                name: "Everyday", tier: "Standard", color: "border-gold/20", cardBg: "bg-primary",
                                annualFee: "Free", apr: "16.99%", rewards: "1% cashback on all purchases", highlights: [
                                    "Free instant virtual card", "1% unlimited cashback", "Zero foreign transaction fees", "Real-time spend alerts", "Apple Pay & Google Pay", "Free ATM withdrawals (2/mo)"
                                ]
                            },
                            {
                                name: "Signature", tier: "Premium", color: "border-gold", cardBg: "bg-primary-light", highlight: true,
                                annualFee: "$99/yr", apr: "14.99%", rewards: "2X points on dining & travel", highlights: [
                                    "Metal physical card", "2X points dining & travel", "1% cashback all else", "Priority Concierge 24/7", "$200 annual travel credit", "Lounge access (2 passes/yr)"
                                ]
                            },
                            {
                                name: "Reserve", tier: "Elite", color: "border-gold/20 bg-gradient-to-br from-gold/10 to-primary",
                                annualFee: "$499/yr", apr: "12.99%", rewards: "4X points on all travel worldwide", highlights: [
                                    "Titanium card by invitation", "4X points on all travel", "Unlimited lounge access", "Dedicated relationship banker", "$600 annual travel credit", "Zero FX fees globally"
                                ]
                            },
                        ].map((card, i) => (
                            <motion.div key={i} {...fadeIn} className={`border p-10 flex flex-col ${card.color} ${card.highlight ? 'ring-1 ring-gold' : ''}`}>
                                {card.highlight && <div className="text-[10px] text-primary bg-gold font-bold uppercase tracking-widest px-3 py-1 w-fit mb-6">Best Value</div>}
                                <div className="mb-2">
                                    <p className="text-[10px] text-gold uppercase tracking-[0.3em] mb-1">{card.tier}</p>
                                    <h3 className="text-2xl font-light text-accent">{card.name}</h3>
                                </div>
                                <div className="py-6 border-y border-gold/10 my-6">
                                    <p className="text-gold text-2xl font-mono mb-1">{card.annualFee}</p>
                                    <p className="text-accent/40 text-xs uppercase tracking-widest">Annual fee · {card.apr} APR</p>
                                </div>
                                <p className="text-accent/60 text-sm mb-6 font-light">&ldquo;{card.rewards}&rdquo;</p>
                                <ul className="space-y-3 mb-10 flex-1">
                                    {card.highlights.map((h, j) => (
                                        <li key={j} className="flex items-center gap-3 text-accent/60 text-sm">
                                            <CheckCircle2 size={14} className="text-gold shrink-0" />
                                            {h}
                                        </li>
                                    ))}
                                </ul>
                                <Link href="/verify" className={`w-full py-4 text-center text-sm font-bold uppercase tracking-widest transition-colors ${card.highlight ? 'bg-gold text-primary hover:bg-gold-dark' : 'border border-gold/30 text-gold hover:bg-gold/5'}`}>
                                    Apply Now
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Reserve Benefits Deep Dive */}
            <section className="py-24 px-4 md:px-12 bg-primary border-b border-gold/10">
                <div className="max-w-7xl mx-auto">
                    <motion.div {...fadeIn} className="mb-16">
                        <p className="text-gold font-mono text-[10px] tracking-[0.3em] uppercase mb-4">Reserve Card</p>
                        <h2 className="text-4xl md:text-5xl font-light text-accent tracking-tighter">The ultimate <span className="text-gold font-medium">status symbol.</span></h2>
                    </motion.div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { icon: <Plane size={28} />, label: "4X Travel Points", desc: "Earn 4 points per $1 on flights, hotels, and transport globally." },
                            { icon: <Gift size={28} />, label: "Unlimited Lounge Access", desc: "Over 1,400 airport lounges worldwide via Priority Pass membership." },
                            { icon: <Globe size={28} />, label: "Zero FX Fees", desc: "Spend in any currency anywhere in the world with no conversion markup." },
                            { icon: <Shield size={28} />, label: "Travel Insurance", desc: "Comprehensive trip cancellation, lost baggage, and medical coverage." },
                        ].map((b, i) => (
                            <motion.div key={i} whileHover={{ y: -4 }} {...fadeIn} className="bg-primary-light border border-gold/10 hover:border-gold/30 p-8 group transition-all">
                                <div className="w-14 h-14 border border-gold/20 flex items-center justify-center text-gold mb-6 group-hover:bg-gold group-hover:text-primary transition-all">{b.icon}</div>
                                <h3 className="text-lg font-medium text-accent mb-3 group-hover:text-gold transition-colors">{b.label}</h3>
                                <p className="text-accent/50 text-sm leading-relaxed">{b.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 px-4 md:px-12 bg-gold text-center">
                <motion.div {...fadeIn} className="max-w-3xl mx-auto">
                    <h2 className="text-4xl font-light text-primary tracking-tighter mb-6">Ready to carry something <span className="font-bold">exceptional?</span></h2>
                    <p className="text-primary/70 mb-10 font-light">Apply in under 60 seconds. Instant decision. Soft credit pull only.</p>
                    <Link href="/verify" className="bg-primary text-gold px-12 py-5 font-bold tracking-[0.2em] uppercase inline-flex items-center gap-4 hover:bg-primary-light transition-colors">
                        Apply for Your Card <ArrowRight size={18} />
                    </Link>
                </motion.div>
            </section>

            <Footer />
        </main>
    )
}
