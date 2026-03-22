'use client'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { motion } from 'framer-motion'
import { Gavel, Globe, Briefcase, Info } from 'lucide-react'

export default function TermsPage() {
    return (
        <main className="min-h-screen bg-primary flex flex-col relative overflow-hidden font-sans">
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
                style={{ backgroundImage: "url('https://static.wixstatic.com/media/c837a6_51db7f706561479b9f9f7570f739e702~mv2.png')", backgroundSize: 'cover' }} />

            <Navbar />

            <div className="flex-1 pt-24 sm:pt-32 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-12 relative z-10">
                <div className="max-w-4xl mx-auto">
                    <header className="mb-12 sm:mb-20">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <span className="bg-gold/10 text-gold text-[10px] font-bold px-4 py-1.5 uppercase tracking-[0.3em] border border-gold/20">
                                    Legal Framework
                                </span>
                                <div className="h-[1px] w-12 bg-gold/20"></div>
                            </div>
                            <h1 className="text-3xl sm:text-4xl md:text-6xl font-light text-accent tracking-tighter mb-6">
                                Terms of <span className="text-gold font-medium">Service.</span>
                            </h1>
                            <p className="text-accent/40 text-sm md:text-lg font-light tracking-wide max-w-2xl leading-relaxed">
                                The governing protocols and legal stipulations for entities accessing the optimanexgen institutional banking network.
                            </p>
                        </motion.div>
                    </header>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 mb-16 sm:mb-20">
                        <div className="p-6 sm:p-8 bg-primary-light/20 border border-gold/10">
                            <Gavel className="text-gold mb-6" size={24} />
                            <h3 className="text-accent font-medium uppercase tracking-widest text-xs mb-4">Jurisdictional Governance</h3>
                            <p className="text-accent/40 text-xs leading-relaxed font-light">
                                All institutional interactions are governed by the Sovereign District legal code, providing a neutral and high-security framework for global capital movements.
                            </p>
                        </div>
                        <div className="p-6 sm:p-8 bg-primary-light/20 border border-gold/10">
                            <Briefcase className="text-gold mb-6" size={24} />
                            <h3 className="text-accent font-medium uppercase tracking-widest text-xs mb-4">Institutional Eligibility</h3>
                            <p className="text-accent/40 text-xs leading-relaxed font-light">
                                Access to the optimanexgen network is restricted to verified entities that meet our strict diagnostic liquidity and ethical compliance standards.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-16 prose prose-invert max-w-none">
                        <section className="space-y-6">
                            <h2 className="text-xl md:text-2xl font-light text-accent tracking-tight flex items-center gap-4 border-b border-gold/10 pb-4">
                                <span className="text-gold font-mono text-sm">01.</span> Account Governance
                            </h2>
                            <p className="text-accent/50 text-sm leading-relaxed font-light">
                                Entities must maintain accurate identity markers. Failure to synchronize entity data with our KYC protocol may result in immediate account sequestration. Users are responsible for maintaining the confidentiality of their diagnostic access keys.
                            </p>
                        </section>

                        <section className="space-y-6">
                            <h2 className="text-xl md:text-2xl font-light text-accent tracking-tight flex items-center gap-4 border-b border-gold/10 pb-4">
                                <span className="text-gold font-mono text-sm">02.</span> Capital Movement Protocols
                            </h2>
                            <p className="text-accent/50 text-sm leading-relaxed font-light">
                                Transfer instructions are finalized upon the 4-second institutional routing delay. Revocation after finalization is only possible through a verified manual diagnostic appeal. optimanexgen reserves the right to delay settlements pending internal audit.
                            </p>
                        </section>

                        <section className="space-y-6">
                            <h2 className="text-xl md:text-2xl font-light text-accent tracking-tight flex items-center gap-4 border-b border-gold/10 pb-4">
                                <span className="text-gold font-mono text-sm">03.</span> Liability Limitations
                            </h2>
                            <p className="text-accent/50 text-sm leading-relaxed font-light">
                                optimanexgen provides high-prestige routing rails but does not accept liability for external sovereign regulatory actions or network volatility outside our primary diagnostic nodes.
                            </p>
                        </section>

                        <section className="space-y-6">
                            <h2 className="text-xl md:text-2xl font-light text-accent tracking-tight flex items-center gap-4 border-b border-gold/10 pb-4">
                                <span className="text-gold font-mono text-sm">04.</span> Termination of Access
                            </h2>
                            <p className="text-accent/50 text-sm leading-relaxed font-light">
                                Protocol violations, including suspicious institutional routing or account mirroring, will lead to permanent sequestration of assets and reporting to the Sovereign Governance Node.
                            </p>
                        </section>
                    </div>

                    <footer className="mt-24 pt-10 border-t border-gold/10 flex justify-between items-center text-[9px] text-accent/20 uppercase tracking-[0.3em]">
                        <p>Institutional Record: March 2026</p>
                        <p>System Ver: 4.1.0-LEGAL</p>
                    </footer>
                </div>
            </div>

            <Footer />
        </main>
    )
}
