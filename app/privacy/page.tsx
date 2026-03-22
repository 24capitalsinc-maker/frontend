'use client'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { motion } from 'framer-motion'
import { Shield, Lock, Eye, FileText } from 'lucide-react'

export default function PrivacyPage() {
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
                                    Governance Node
                                </span>
                                <div className="h-[1px] w-12 bg-gold/20"></div>
                            </div>
                            <h1 className="text-3xl sm:text-4xl md:text-6xl font-light text-accent tracking-tighter mb-6">
                                Privacy <span className="text-gold font-medium">Protocol.</span>
                            </h1>
                            <p className="text-accent/40 text-sm md:text-lg font-light tracking-wide max-w-2xl leading-relaxed">
                                Our commitment to institutional-grade confidentiality and the protection of sovereign financial data.
                                optimanexgen operates under strict diagnostic encryption standards.
                            </p>
                        </motion.div>
                    </header>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 mb-16 sm:mb-20">
                        <div className="p-6 sm:p-8 bg-primary-light/20 border border-gold/10">
                            <Lock className="text-gold mb-6" size={24} />
                            <h3 className="text-accent font-medium uppercase tracking-widest text-xs mb-4">Diagnostic Encryption</h3>
                            <p className="text-accent/40 text-xs leading-relaxed font-light">
                                All financial movements and entity data are protected by AES-256 bit encryption protocols, ensuring that your institutional footprint remains invisible.
                            </p>
                        </div>
                        <div className="p-6 sm:p-8 bg-primary-light/20 border border-gold/10">
                            <Shield className="text-gold mb-6" size={24} />
                            <h3 className="text-accent font-medium uppercase tracking-widest text-xs mb-4">Sovereign Data Rights</h3>
                            <p className="text-accent/40 text-xs leading-relaxed font-light">
                                Entities retain full governance over their liquidity data. optimanexgen does not engage in secondary data monetization or third-party disclosure without explicit authorization.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-16 prose prose-invert max-w-none">
                        <section className="space-y-6">
                            <h2 className="text-xl md:text-2xl font-light text-accent tracking-tight flex items-center gap-4 border-b border-gold/10 pb-4">
                                <span className="text-gold font-mono text-sm">01.</span> Data Acquisition
                            </h2>
                            <p className="text-accent/50 text-sm leading-relaxed font-light">
                                To facilitate institutional banking services, we collect essential identity and financial data. This includes KYC documentation, transaction frequency, and liquidity mapping. This data is stored within segregated vault nodes.
                            </p>
                        </section>

                        <section className="space-y-6">
                            <h2 className="text-xl md:text-2xl font-light text-accent tracking-tight flex items-center gap-4 border-b border-gold/10 pb-4">
                                <span className="text-gold font-mono text-sm">02.</span> Information Usage
                            </h2>
                            <p className="text-accent/50 text-sm leading-relaxed font-light">
                                Your information is utilized exclusively for service synchronization, risk diagnostic reporting, and ensuring the integrity of the banking network. We utilize advanced machine learning to detect protocol violations without exposing underlying data.
                            </p>
                        </section>

                        <section className="space-y-6">
                            <h2 className="text-xl md:text-2xl font-light text-accent tracking-tight flex items-center gap-4 border-b border-gold/10 pb-4">
                                <span className="text-gold font-mono text-sm">03.</span> Entity Governance
                            </h2>
                            <p className="text-accent/50 text-sm leading-relaxed font-light">
                                You have the right to request a full data audit or the sequestration of your institutional records at any time. Our compliance node handles all governance requests within 24 hours of synchronization.
                            </p>
                        </section>
                    </div>

                    <footer className="mt-24 pt-10 border-t border-gold/10 flex justify-between items-center text-[9px] text-accent/20 uppercase tracking-[0.3em]">
                        <p>Last Rotation: March 2026</p>
                        <p>Protocol Version: 4.1.0-CONF</p>
                    </footer>
                </div>
            </div>

            <Footer />
        </main>
    )
}
