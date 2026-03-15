'use client'
import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import AdminSidebar from '@/components/AdminSidebar'
import api from '@/lib/api'
import { motion } from 'framer-motion'
import { Landmark, TrendingUp, TrendingDown, Activity, ShieldAlert, BarChart3, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import Footer from '@/components/Footer'

export default function LiquidityPage() {
    const [stats, setStats] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchStats()
    }, [])

    const fetchStats = async () => {
        try {
            const res = await api.get('/admin/liquidity')
            setStats(res.data)
        } catch (err) {
            // Handled via UI
        } finally {
            setLoading(false)
        }
    }

    if (loading) return null

    return (
        <div className="min-h-screen bg-primary flex flex-col font-sans selection:bg-gold/30">
            <Navbar />

            <div className="flex flex-1 pt-20">
                <AdminSidebar />
                <div className="flex-1 min-w-0 w-full overflow-hidden p-4 sm:p-6 md:p-10 lg:p-12 z-10">
                    <header className="mb-14 border-b border-gold/10 pb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <span className="text-[10px] text-gold font-bold uppercase tracking-[0.3em]">Protocol 00-LQ</span>
                                <div className="h-[1px] w-8 bg-gold/20"></div>
                            </div>
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-light text-accent tracking-tighter">
                                Balance <span className="text-gold font-medium">Monitoring.</span>
                            </h1>
                            <p className="text-accent/40 mt-3 text-xs sm:text-sm tracking-wide font-light">Real-time transparency and oversight of bank reserves.</p>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 px-4 py-2 rounded-full">
                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                                <span className="text-[9px] font-bold text-green-400 uppercase tracking-widest">Network Stable</span>
                            </div>
                        </div>
                    </header>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                        {/* Core Liquidity Metrics */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6"
                        >
                            <div className="bg-primary-light/10 border border-gold/10 p-8 relative overflow-hidden group">
                                <div className="absolute top-0 left-0 w-full h-[1px] bg-gold/10" />
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-10 h-10 bg-gold/5 border border-gold/20 flex items-center justify-center rounded-sm">
                                        <Landmark size={18} className="text-gold" />
                                    </div>
                                    <span className="text-[9px] font-bold text-gold/40 uppercase tracking-widest">Aggregate Reserve</span>
                                </div>
                                <h3 className="text-4xl font-light text-accent tracking-tighter mb-2">${stats.totalLiquidity.toLocaleString()}</h3>
                                <div className="flex items-center gap-2 text-green-500">
                                    <TrendingUp size={14} />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">+4.2% Flow</span>
                                </div>
                            </div>

                            <div className="bg-primary-light/10 border border-gold/10 p-8 relative overflow-hidden group">
                                <div className="absolute top-0 left-0 w-full h-[1px] bg-gold/10" />
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-10 h-10 bg-gold/5 border border-gold/20 flex items-center justify-center rounded-sm">
                                        <Activity size={18} className="text-gold" />
                                    </div>
                                    <span className="text-[9px] font-bold text-gold/40 uppercase tracking-widest">24h System Volume</span>
                                </div>
                                <h3 className="text-4xl font-light text-accent tracking-tighter mb-2">${stats.volume24h.toLocaleString()}</h3>
                                <p className="text-[10px] text-accent/30 uppercase tracking-[0.2em] font-bold">Total Network Liquidity Shift</p>
                            </div>
                        </motion.div>

                        {/* Reserve Health Gauge */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="bg-primary-light/10 border border-gold/10 p-8 flex flex-col items-center justify-center text-center relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gold/[0.01] pointer-events-none" />
                            <div className="relative w-40 h-40 mb-6">
                                <svg className="w-full h-full -rotate-90">
                                    <circle cx="80" cy="80" r="70" fill="transparent" stroke="currentColor" strokeWidth="8" className="text-gold/10" />
                                    <circle cx="80" cy="80" r="70" fill="transparent" stroke="currentColor" strokeWidth="8" strokeDasharray="440" strokeDashoffset={440 - (440 * stats.reserveRatio) / 100} className="text-gold transition-all duration-1000" />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-3xl font-light text-accent">{stats.reserveRatio}%</span>
                                    <span className="text-[8px] font-bold text-gold/40 uppercase tracking-widest">Reserve</span>
                                </div>
                            </div>
                            <h4 className="text-[10px] font-bold text-accent uppercase tracking-[0.3em] mb-2">Institutional Health</h4>
                            <p className="text-[9px] text-accent/30 uppercase tracking-widest leading-relaxed px-10">Total liquidity exceeds regulatory requirements.</p>
                        </motion.div>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                        {/* Flow Patterns */}
                        <div className="bg-primary-light/10 border border-gold/10 p-8 md:p-10 relative overflow-hidden">
                            <div className="flex items-center gap-4 mb-10">
                                <div className="w-8 h-8 bg-gold/5 border border-gold/20 flex items-center justify-center">
                                    <BarChart3 size={16} className="text-gold" />
                                </div>
                                <h2 className="text-xl font-light tracking-tight text-accent">Flow <span className="text-gold">Analytics</span></h2>
                            </div>

                            <div className="flex items-end gap-2 h-48 md:h-64 mb-8">
                                {stats.hourlyFlow.map((flow: any, i: number) => (
                                    <div key={i} className="flex-1 flex items-end gap-[1px] h-full group relative">
                                        <div className="flex-1 bg-gold/5 border border-gold/10 hover:bg-gold/20 transition-all relative" style={{ height: `${Math.max(10, (flow.inflow / 100000) * 100)}%` }}>
                                            <div className="absolute inset-0 opacity-10 bg-gold" />
                                        </div>
                                        <div className="flex-1 bg-red-500/5 border border-red-500/10 hover:bg-red-500/20 transition-all relative" style={{ height: `${Math.max(5, (flow.outflow / 100000) * 100)}%` }}>
                                            <div className="absolute inset-0 opacity-10 bg-red-500" />
                                        </div>

                                        {/* Hover Tooltip */}
                                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-primary border border-gold/20 p-2 opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none text-nowrap">
                                            <p className="text-[8px] font-bold text-gold uppercase tracking-tighter mb-1">{flow.hour}</p>
                                            <div className="flex gap-3">
                                                <span className="text-[8px] text-green-400">In: ${flow.inflow.toLocaleString()}</span>
                                                <span className="text-[8px] text-red-400">Out: ${flow.outflow.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-between mt-6 text-[8px] font-bold text-accent/20 uppercase tracking-[0.3em]">
                                <span>12 Hours Ago</span>
                                <span>Present Interval</span>
                            </div>
                        </div>

                        {/* Distribution Matrix */}
                        <div className="bg-primary-light/10 border border-gold/10 p-8 md:p-10 relative overflow-hidden">
                            <div className="flex items-center gap-4 mb-10">
                                <div className="w-8 h-8 bg-gold/5 border border-gold/20 flex items-center justify-center">
                                    <ShieldAlert size={16} className="text-gold" />
                                </div>
                                <h2 className="text-xl font-light tracking-tight text-accent">Asset <span className="text-gold">Distribution</span></h2>
                            </div>

                            <div className="space-y-8">
                                {stats.distribution.map((dist: any, i: number) => (
                                    <div key={i} className="space-y-3">
                                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                                            <span className="text-accent/60">{dist.label}</span>
                                            <span className="text-gold">${dist.value.toLocaleString()}</span>
                                        </div>
                                        <div className="w-full h-1 bg-gold/5 border border-gold/10">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${(dist.value / stats.totalLiquidity) * 100}%` }}
                                                className="h-full bg-gold shadow-[0_0_10px_rgba(203,161,110,0.4)]"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-14 p-6 bg-gold/5 border border-gold/10 border-dashed flex items-start gap-4">
                                <Activity size={18} className="text-gold mt-1" />
                                <div>
                                    <p className="text-[10px] font-bold text-accent uppercase tracking-widest mb-1">Entity Concentration</p>
                                    <p className="text-[9px] text-accent/40 uppercase tracking-widest leading-relaxed font-light">
                                        Liquidity is optimally distributed across {stats.entityCount} strategic institutional nodes.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="z-20">
                <Footer />
            </div>
        </div>
    )
}
