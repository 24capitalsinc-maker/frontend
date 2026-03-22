'use client'
import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'
import DashboardCard from '@/components/DashboardCard'
import TransactionTable from '@/components/TransactionTable'
import Link from 'next/link';
import { Wallet, CreditCard, ShieldHalf, ArrowDownUp, ArrowRight } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore'
import { motion } from 'framer-motion'
import api from '@/lib/api'
import { useRouter } from 'next/navigation'
import Footer from '@/components/Footer'

export default function DashboardPage() {
    const { user, accessToken } = useAuthStore()
    const [profile, setProfile] = useState<any>(null)
    const [transactions, setTransactions] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [showSensitiveInfo, setShowSensitiveInfo] = useState(true)
    const router = useRouter()

    useEffect(() => {
        if (!accessToken) {
            router.push('/login')
            return
        }

        const fetchProfile = async () => {
            try {
                const [profileRes, transactionsRes] = await Promise.all([
                    api.get('/users/profile'),
                    api.get('/transactions/my')
                ])
                setProfile(profileRes.data)
                setTransactions(transactionsRes.data)
            } catch (err: any) {
                if (err.response?.status === 401) {
                    router.push('/login')
                }
            } finally {
                setLoading(false)
            }
        }

        fetchProfile()
    }, [accessToken, router])

    if (loading) return (
        <main className="min-h-screen bg-primary flex items-center justify-center">
            <div className="flex flex-col items-center gap-6">
                <div className="w-12 h-12 border-2 border-gold border-t-transparent rounded-full animate-spin" />
                <p className="text-gold text-[10px] font-bold tracking-[0.4em] uppercase animate-pulse">Synchronizing Secure Session</p>
            </div>
        </main>
    )

    return (
        <main className="min-h-screen bg-primary flex flex-col relative overflow-hidden">
            {/* Background Texture Overlay */}
            <div className="absolute inset-0 bg-silk opacity-10 pointer-events-none z-0" />
            <div className="absolute inset-0 bg-noise opacity-20 pointer-events-none z-0" />

            <Navbar />

            <div className="flex flex-1 pt-20 relative z-10">
                <Sidebar />

                <div className="flex-1 min-w-0 p-6 md:p-12 overflow-y-auto">
                    <header className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-10 border-b border-gold/10 pb-16">
                        <div className="max-w-3xl">
                            <div className="flex items-center gap-4 mb-6">
                                <span className="bg-gold/10 text-gold text-[9px] font-bold px-4 py-2 border border-gold/20 uppercase tracking-[0.4em]">Executive Member // Private Wealth</span>
                                <div className="h-[1px] w-12 bg-gold/20"></div>
                            </div>
                            <h1 className="text-prestige text-3xl sm:text-4xl md:text-7xl text-accent leading-none">
                                Account <span className="text-gold font-medium">Dashboard.</span>
                            </h1>
                            <p className="text-accent/30 mt-6 text-sm tracking-widest font-light">Welcome back, {profile?.name}. Your institutional portfolios are synchronized across all global meridians.</p>
                        </div>

                        <div className="flex items-center gap-8">
                            <div className="text-right hidden md:block border-r border-gold/10 pr-8">
                                <p className="text-[9px] text-accent/20 uppercase tracking-[0.4em] mb-2 font-bold">Session Integrity</p>
                                <div className="text-[10px] font-bold text-gold uppercase tracking-[0.2em] flex items-center gap-2 justify-end">
                                    <div className="w-1 h-1 bg-gold rounded-full animate-pulse" /> Secure
                                </div>
                            </div>
                            <button onClick={() => router.push('/transfer')} className="group relative bg-gold text-primary px-10 py-5 font-bold text-[10px] tracking-[0.3em] uppercase transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-gold/10 overflow-hidden">
                                <span className="relative z-10">Send Money</span>
                                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                            </button>
                        </div>
                    </header>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-20">
                        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-8">
                            <DashboardCard
                                title="Total Balance"
                                value={`$${profile?.accountBalance?.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                                icon={Wallet}
                                subtitle="Sovereign Vault A-1"
                                isSensitive={true}
                                isVisible={showSensitiveInfo}
                                onToggle={() => setShowSensitiveInfo(!showSensitiveInfo)}
                            />
                            <DashboardCard
                                title="Account Number"
                                value={profile?.accountNumber}
                                icon={CreditCard}
                                subtitle={`${profile?.accountType} Layer // ${profile?.currency}`}
                                isSensitive={true}
                                isVisible={showSensitiveInfo}
                                onToggle={() => setShowSensitiveInfo(!showSensitiveInfo)}
                                isCopyable={true}
                            />
                            <DashboardCard
                                title="Security Mesh"
                                value={profile?.isFrozen ? "RESTRICTED" : "VERIFIED"}
                                icon={ShieldHalf}
                                subtitle={profile?.isFrozen ? "Intervention Protocol Active" : "AES-256 Quantum Shield Active"}
                            />
                        </div>

                        {/* Market Ticker */}
                        <div className="bg-primary/40 backdrop-blur-3xl border border-gold/20 p-8 flex flex-col justify-between group overflow-hidden relative shadow-2xl">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                            <div>
                                <p className="text-[9px] text-gold font-bold uppercase tracking-[0.4em] mb-6 border-b border-gold/10 pb-4">Institutional Ticker</p>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-[10px]">
                                        <span className="text-accent/30 font-light tracking-widest uppercase">XAU / USD</span>
                                        <span className="text-gold font-bold tabular-nums tracking-tighter">$2,164.20</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[10px]">
                                        <span className="text-accent/30 font-light tracking-widest uppercase">EUR / USD</span>
                                        <span className="text-accent font-bold tabular-nums tracking-tighter">1.0842</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[10px]">
                                        <span className="text-accent/30 font-light tracking-widest uppercase">GBP / USD</span>
                                        <span className="text-accent font-bold tabular-nums tracking-tighter">1.2654</span>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-8 flex items-center justify-between opacity-30">
                                <p className="text-[7px] text-accent/60 uppercase tracking-[0.4em] font-bold">Real-time settlement</p>
                                <div className="w-1 h-1 bg-gold rounded-full animate-pulse" />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        <div className="lg:col-span-2 space-y-12">
                            {/* Global Liquidity Distribution */}
                            <div className="bg-primary/40 backdrop-blur-3xl border border-gold/10 p-10 relative overflow-hidden group shadow-2xl">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 border-b border-gold/5 pb-8 gap-4">
                                    <h2 className="text-xl sm:text-2xl font-light text-accent tracking-tighter">Global <span className="text-gold font-medium">Liquidity Distribution.</span></h2>
                                    <span className="text-[8px] text-accent/20 uppercase tracking-[0.5em] font-bold">Protocol Alpha-7</span>
                                </div>

                                <div className="space-y-12">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
                                        <div className="group/item cursor-help">
                                            <p className="text-2xl sm:text-3xl font-medium text-accent mb-2 tracking-tight">$72,400.00</p>
                                            <p className="text-[10px] text-gold font-bold uppercase tracking-[0.2em] mb-4">New York Ledger</p>
                                            <div className="h-[2px] w-full bg-gold/20 rounded-full overflow-hidden">
                                                <motion.div initial={{ width: 0 }} whileInView={{ width: '80%' }} transition={{ duration: 2 }} className="h-full bg-gold" />
                                            </div>
                                        </div>
                                        <div className="group/item cursor-help">
                                            <p className="text-2xl sm:text-3xl font-medium text-accent/60 mb-2 tracking-tight">€45,100.00</p>
                                            <p className="text-[10px] text-accent/40 font-bold uppercase tracking-[0.2em] mb-4">Zurich Ledger</p>
                                            <div className="h-[2px] w-full bg-gold/5 rounded-full overflow-hidden">
                                                <motion.div initial={{ width: 0 }} whileInView={{ width: '40%' }} transition={{ duration: 2 }} className="h-full bg-accent/20" />
                                            </div>
                                        </div>
                                        <div className="group/item cursor-help">
                                            <p className="text-2xl sm:text-3xl font-medium text-accent/60 mb-2 tracking-tight">£28,950.00</p>
                                            <p className="text-[10px] text-accent/40 font-bold uppercase tracking-[0.2em] mb-4">London Ledger</p>
                                            <div className="h-[2px] w-full bg-gold/5 rounded-full overflow-hidden">
                                                <motion.div initial={{ width: 0 }} whileInView={{ width: '30%' }} transition={{ duration: 2 }} className="h-full bg-accent/20" />
                                            </div>
                                        </div>
                                        <div className="group/item cursor-help">
                                            <p className="text-2xl sm:text-3xl font-medium text-accent/60 mb-2 tracking-tight">S$12,000.00</p>
                                            <p className="text-[10px] text-accent/40 font-bold uppercase tracking-[0.2em] mb-4">Singapore Ledger</p>
                                            <div className="h-[2px] w-full bg-gold/5 rounded-full overflow-hidden">
                                                <motion.div initial={{ width: 0 }} whileInView={{ width: '15%' }} transition={{ duration: 2 }} className="h-full bg-accent/20" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-8 bg-gold/5 border border-gold/10 flex items-center justify-between group-hover:bg-gold/[0.08] transition-colors duration-500">
                                        <div className="flex items-center gap-6">
                                            <div className="relative">
                                                <div className="w-3 h-3 rounded-full bg-gold animate-ping absolute inset-0" />
                                                <div className="w-3 h-3 rounded-full bg-gold relative z-10" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-accent mb-1 uppercase tracking-widest">Optimization Protocol Enabled</p>
                                                <p className="text-[8px] text-accent/30 font-bold uppercase tracking-[0.3em]">Algorithmic Rebalancing Active // Cayman Hub</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-bold text-gold uppercase tracking-[0.4em] underline underline-offset-8">Authorized</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Insight Section */}
                            <div className="bg-primary/40 backdrop-blur-3xl border border-gold/10 p-10 relative overflow-hidden group shadow-2xl">
                                <div className="flex justify-between items-center mb-12 border-b border-gold/5 pb-8">
                                    <h2 className="text-2xl font-light text-accent tracking-tighter">Capital <span className="text-gold font-medium">Flow Insights.</span></h2>
                                    <select className="bg-transparent text-[8px] text-gold uppercase tracking-[0.4em] font-bold border border-gold/20 px-4 py-2 outline-none cursor-pointer hover:border-gold/50 transition-colors select-institutional">
                                        <option value="Q1">Q1 2026 // ADVISORY</option>
                                        <option value="Q4">Q4 2025 // HISTORICAL</option>
                                    </select>
                                </div>
                                <div className="h-60 flex items-end gap-3 px-4">
                                    {[65, 40, 85, 30, 95, 55, 75].map((h, i) => (
                                        <div key={i} className="flex-1 flex flex-col items-center gap-6 group/bar">
                                            <div className="relative w-full flex justify-center">
                                                <motion.div
                                                    initial={{ height: 0 }}
                                                    whileInView={{ height: `${h}%` }}
                                                    transition={{ duration: 1.5, delay: i * 0.1 }}
                                                    className="w-full bg-gradient-to-t from-gold/5 via-gold/20 to-gold/40 border-t border-gold/60 relative overflow-hidden group-hover/bar:to-gold transition-all duration-700"
                                                >
                                                    <div className="absolute inset-0 bg-silk size-full opacity-20" />
                                                </motion.div>
                                            </div>
                                            <span className="text-[8px] text-accent/20 font-bold uppercase tracking-[0.4em] group-hover/bar:text-gold transition-colors">{['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'][i]}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-12 pt-10 border-t border-gold/5 flex justify-between items-center">
                                    <div className="flex gap-16">
                                        <div>
                                            <p className="text-[10px] text-accent/40 uppercase tracking-[0.2em] mb-2 font-bold">Peak Utilization</p>
                                            <p className="text-sm font-medium text-accent tracking-tight">Friday // $1,240.24</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-accent/40 uppercase tracking-[0.2em] mb-2 font-bold">Mean Daily Flow</p>
                                            <p className="text-sm font-medium text-accent tracking-tight">$420,00</p>
                                        </div>
                                    </div>
                                    <Link href="/transactions" className="text-gold text-[10px] font-bold uppercase tracking-[0.3em] group-hover:gap-6 transition-all flex items-center gap-4 border-b border-gold/20 pb-2">
                                        Detailed Ledger <ArrowDownUp size={12} />
                                    </Link>
                                </div>
                            </div>

                            <div className="bg-primary/40 backdrop-blur-3xl border border-gold/10 p-10 shadow-2xl">
                                <div className="flex justify-between items-center mb-12 border-b border-gold/5 pb-8">
                                    <h2 className="text-2xl font-light text-accent tracking-tighter">Recent <span className="text-gold font-medium">Activity Logs.</span></h2>
                                    <span className="text-[8px] text-accent/20 uppercase tracking-[0.5em] font-bold">End-to-End Encrypted</span>
                                </div>
                                <div className="space-y-6">
                                    <TransactionTable transactions={transactions} itemsPerPage={5} />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-12">
                            <div className="group relative bg-primary items-center justify-center p-10 border border-gold/30 shadow-3xl overflow-hidden min-h-[400px] flex flex-col">
                                <div className="absolute inset-0 bg-gold opacity-10 group-hover:opacity-20 transition-opacity duration-700" />
                                <div className="absolute inset-0 bg-silk opacity-10" />
                                <div className="relative z-10 text-center">
                                    <p className="text-gold text-[8px] font-bold uppercase tracking-[0.6em] mb-6">Immediate Execution</p>
                                    <h2 className="text-prestige text-5xl text-accent mb-8 leading-tight">Global <br /><span className="text-gold">Wealth Transfer.</span></h2>
                                    <p className="text-accent/40 text-[10px] leading-relaxed mb-12 font-light max-w-xs mx-auto">
                                        Execute cross-border settlements with institutional spread and immediate finality.
                                    </p>
                                    <button onClick={() => router.push('/transfer')} className="group/btn relative w-full bg-gold text-primary text-[10px] font-bold py-6 uppercase tracking-[0.4em] overflow-hidden transition-transform hover:scale-105 active:scale-95 shadow-2xl shadow-gold/20">
                                        <span className="relative z-10">Initialize Wire</span>
                                        <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700" />
                                    </button>
                                </div>
                                <ArrowDownUp size={180} className="absolute -bottom-16 -right-16 text-gold opacity-5 rotate-12 group-hover:rotate-0 transition-all duration-1000" />
                            </div>

                            <div className="bg-primary/40 backdrop-blur-3xl border border-gold/10 p-10 shadow-2xl">
                                <div className="text-[9px] text-gold font-bold uppercase tracking-[0.5em] mb-10 border-b border-gold/10 pb-4">Client Dossier</div>
                                <div className="space-y-8">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] text-accent/30 font-bold uppercase tracking-[0.3em]">Telemetry Link</span>
                                        <span className="text-[10px] text-accent font-bold tracking-widest">{profile?.phoneNumber || "UNLINKED"}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] text-accent/30 font-bold uppercase tracking-[0.3em]">Temporal Marker</span>
                                        <span className="text-[10px] text-accent font-bold tracking-widest">{profile?.dateOfBirth || "RESTRICTED"}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] text-accent/30 font-bold uppercase tracking-[0.3em]">Legal Seat</span>
                                        <span className="text-[10px] text-accent truncate max-w-[140px] text-right font-bold">{profile?.address || "GLOBAL"}</span>
                                    </div>
                                </div>
                                <button onClick={() => router.push('/settings')} className="w-full mt-12 text-[8px] font-bold text-gold uppercase tracking-[0.5em] flex items-center justify-center gap-3 hover:gap-6 transition-all border border-gold/20 py-4 hover:bg-gold/5 transition-colors">
                                    Modify Dossier <ArrowRight size={12} />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="mt-32 -mx-6 md:-mx-12">
                        <Footer />
                    </div>
                </div>
            </div>
        </main>
    )
}
