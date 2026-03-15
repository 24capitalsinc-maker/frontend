'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import AdminSidebar from '@/components/AdminSidebar'
import DashboardCard from '@/components/DashboardCard'
import { Users, Repeat, Landmark, ShieldAlert } from 'lucide-react'
import api from '@/lib/api'
import { toast } from 'sonner'
import Footer from '@/components/Footer'
import Pagination from '@/components/Pagination'
import { useMemo } from 'react'

export default function AdminPage() {
    const [metrics, setMetrics] = useState<any>(null)
    const [users, setUsers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 5

    const paginatedUsers = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage
        return users.slice(start, start + itemsPerPage)
    }, [users, currentPage])

    const totalPages = Math.ceil(users.length / itemsPerPage)

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                const [mRes, uRes] = await Promise.all([
                    api.get('/admin/metrics'),
                    api.get('/admin/users')
                ])
                setMetrics(mRes.data)
                setUsers(uRes.data)
            } catch (err) {
                console.error(err)
                toast.error('Failed to synchronize administrative metrics.')
            } finally {
                setLoading(false)
            }
        }
        fetchAdminData()
    }, [])

    if (loading) return (
        <main className="min-h-screen bg-primary flex items-center justify-center">
            <div className="flex flex-col items-center gap-6">
                <div className="w-12 h-12 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-red-500 text-[10px] font-bold tracking-[0.4em] uppercase animate-pulse">Accessing Secure Admin Vault</p>
            </div>
        </main>
    )

    return (
        <main className="min-h-screen bg-primary flex flex-col relative overflow-hidden font-sans">
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay" style={{ backgroundImage: "url('https://static.wixstatic.com/media/c837a6_51db7f706561479b9f9f7570f739e702~mv2.png')", backgroundSize: 'cover' }} />

            <Navbar />

            <div className="flex flex-1 pt-20 md:pt-24 lg:pt-24">
                <AdminSidebar />
                <div className="flex-1 min-w-0 w-full overflow-hidden p-4 sm:p-6 md:p-10 lg:p-12 z-10">
                    <header className="mb-14 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gold/10 pb-10">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <span className="bg-red-500/10 text-red-400 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-red-500/20 flex items-center gap-2">
                                    <ShieldAlert size={10} /> Sovereign Access Active
                                </span>
                                <div className="h-[1px] w-8 bg-red-500/20"></div>
                            </div>
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-light text-accent tracking-tighter">
                                Admin <span className="text-red-500 font-medium">Vault.</span>
                            </h1>
                            <p className="text-accent/40 mt-3 text-xs sm:text-sm tracking-wide font-light">Global monitoring and administrative governance terminal.</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-[10px] text-accent/30 uppercase tracking-[0.3em]">Encrypted Session Level-4</span>
                        </div>
                    </header>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-12 md:mb-16">
                        <DashboardCard
                            title="Total Users"
                            value={metrics?.totalUsers}
                            icon={Users}
                            subtitle="Registered Institutional Clients"
                        />
                        <DashboardCard
                            title="Network Flow"
                            value={metrics?.totalTransactions}
                            icon={Repeat}
                            subtitle="Cumulative Ledger entries"
                        />
                        <DashboardCard
                            title="Bank Reserve"
                            value={`$${metrics?.totalBankBalance?.toLocaleString()}`}
                            icon={Landmark}
                            subtitle="Aggregated Capital Liquidity"
                        />
                    </div>

                    <div className="bg-primary-light/10 border border-gold/10 relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-[1px] bg-gold/10" />
                        <div className="p-6 md:p-10 border-b border-gold/10 flex justify-between items-center">
                            <h2 className="text-xl md:text-2xl font-light text-accent tracking-tight">System <span className="text-gold">Users.</span></h2>
                            <div className="h-0.5 w-8 md:w-12 bg-gold/20" />
                        </div>
                        <div className="overflow-x-auto w-full scrollbar-thin scrollbar-thumb-gold/20 scrollbar-track-transparent">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-gold/5 border-b border-gold/10 text-nowrap">
                                        <th className="px-6 md:px-10 py-5 md:py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-accent/50">Entity</th>
                                        <th className="px-6 md:px-10 py-5 md:py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-accent/50">Account</th>
                                        <th className="px-6 md:px-10 py-5 md:py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-accent/50 text-right">Liquidity</th>
                                        <th className="px-6 md:px-10 py-5 md:py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-accent/50 text-center">Security Status</th>
                                        <th className="px-6 md:px-10 py-5 md:py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-accent/50 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gold/5">
                                    {paginatedUsers.map((u: any) => (
                                        <tr key={u._id} className="hover:bg-gold/5 transition-all group/row text-nowrap">
                                            <td className="px-6 md:px-10 py-6 md:py-8">
                                                <div className="flex flex-col">
                                                    <span className="font-light text-accent text-base md:text-lg tracking-tight">{u.name}</span>
                                                    <span className="text-[10px] text-accent/30 uppercase tracking-[0.2em] font-bold">{u.email}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 md:px-10 py-6 md:py-8">
                                                <span className="text-[10px] text-gold/60 font-bold uppercase tracking-widest border border-gold/10 px-3 py-1 bg-gold/5">
                                                    {u.accountNumber}
                                                </span>
                                            </td>
                                            <td className="px-6 md:px-10 py-6 md:py-8 text-right font-light text-accent text-lg md:text-xl tracking-tight">${u.accountBalance.toLocaleString()}</td>
                                            <td className="px-6 md:px-10 py-6 md:py-8 text-center">
                                                <span className={`px-3 md:px-4 py-1.5 text-[9px] font-bold uppercase tracking-widest transition-all ${u.isFrozen
                                                    ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                                                    : 'bg-gold/10 text-gold border border-gold/20'
                                                    }`}>
                                                    {u.isFrozen ? 'Frozen Asset' : 'Active Flow'}
                                                </span>
                                            </td>
                                            <td className="px-6 md:px-10 py-6 md:py-8 text-right">
                                                <Link
                                                    href="/admin/users"
                                                    className="px-4 md:px-6 py-2.5 md:py-3 text-[10px] font-bold uppercase tracking-[0.2em] border border-gold/10 text-gold hover:bg-gold/5 transition-all inline-block"
                                                >
                                                    Manage Entity
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    </div>

                    <div className="mt-24 -mx-4 sm:-mx-6 md:-mx-10 lg:-mx-12">
                        <Footer />
                    </div>
                </div>
            </div>
        </main>
    )
}
