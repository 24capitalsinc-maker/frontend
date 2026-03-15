'use client'
import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import AdminSidebar from '@/components/AdminSidebar'
import api from '@/lib/api'
import { Users, Search, Shield, ShieldOff, UserCheck, UserX, Mail, Hash, AlertCircle, X, Landmark } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Footer from '@/components/Footer'
import { toast } from 'sonner'
import Pagination from '@/components/Pagination'
import { useMemo } from 'react'

export default function AdminUsersPage() {
    const [users, setUsers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 8
    const [selectedUser, setSelectedUser] = useState<any>(null)
    const [isFreezeModalOpen, setIsFreezeModalOpen] = useState(false)
    const [freezeReason, setFreezeReason] = useState('')
    const [isBalanceModalOpen, setIsBalanceModalOpen] = useState(false)
    const [adjustedBalance, setAdjustedBalance] = useState('')

    useEffect(() => {
        fetchUsers()
    }, [])

    const fetchUsers = async () => {
        try {
            const res = await api.get('/admin/users')
            setUsers(res.data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleToggleFreeze = async (userId: string, currentStatus: boolean, reason: string = '') => {
        try {
            const newStatus = !currentStatus;
            await api.patch('/admin/user-status', {
                userId,
                isFrozen: newStatus,
                reason: newStatus ? reason : ''
            })

            const updatedUsers = users.map(u => u._id === userId ? { ...u, isFrozen: newStatus, freezeReason: newStatus ? reason : '' } : u);
            setUsers(updatedUsers)

            if (selectedUser?._id === userId) {
                setSelectedUser({ ...selectedUser, isFrozen: newStatus, freezeReason: newStatus ? reason : '' })
            }

            if (newStatus) {
                setIsFreezeModalOpen(false)
                setFreezeReason('')
                toast.success('Account Sequestration Initialized: Fund access suspended.')
            } else {
                toast.success('Institutional Access Restored: Portfolio activity enabled.')
            }
        } catch (err) {
            console.error(err)
            toast.error('Protocol Failure: Unable to update entity status.')
        }
    }

    const handleUpdateBalance = async () => {
        if (!selectedUser) return
        try {
            const amount = parseFloat(adjustedBalance)
            if (isNaN(amount)) {
                toast.error('Invalid Capital Value: Numerical input required.')
                return
            }

            await api.patch('/admin/user-balance', {
                userId: selectedUser._id,
                accountBalance: amount
            })

            const updatedUsers = users.map(u => u._id === selectedUser._id ? { ...u, accountBalance: amount } : u);
            setUsers(updatedUsers)
            setSelectedUser({ ...selectedUser, accountBalance: amount })

            setIsBalanceModalOpen(false)
            setAdjustedBalance('')
            toast.success('Liquidity Profile Synchronized: Vault balance updated.')
        } catch (err) {
            console.error(err)
            toast.error('Vault Access Error: Unable to persist liquidity adjustment.')
        }
    }

    const filteredUsers = useMemo(() => {
        return users.filter(u =>
            u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.accountNumber?.includes(searchTerm)
        )
    }, [users, searchTerm])

    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)

    const currentUsers = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage
        return filteredUsers.slice(start, start + itemsPerPage)
    }, [filteredUsers, currentPage])

    const handleSearchChange = (val: string) => {
        setSearchTerm(val)
        setCurrentPage(1)
    }

    if (loading) return null

    return (
        <div className="min-h-screen bg-primary flex flex-col font-sans selection:bg-gold/30">
            <Navbar />

            <div className="flex flex-1 pt-20 md:pt-24 lg:pt-24">
                <AdminSidebar />
                <div className="flex-1 min-w-0 w-full overflow-hidden p-4 sm:p-6 md:p-10 lg:p-12 z-10">
                    <header className="mb-14 border-b border-gold/10 pb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <span className="text-[10px] text-red-500 font-bold uppercase tracking-[0.3em]">Module USR-ADMIN</span>
                                <div className="h-[1px] w-8 bg-red-500/20"></div>
                            </div>
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-light text-accent tracking-tighter">
                                Manage <span className="text-red-500 font-medium">Users.</span>
                            </h1>
                            <p className="text-accent/40 mt-3 text-xs sm:text-sm tracking-wide font-light">Comprehensive oversight of all users, account statuses, and fund access.</p>
                        </div>

                        <div className="relative w-full md:w-80">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/40" size={16} />
                            <input
                                type="text"
                                placeholder="Search by Name, Email or Account No..."
                                value={searchTerm}
                                onChange={(e) => handleSearchChange(e.target.value)}
                                className="w-full bg-primary-light/10 border border-gold/10 pl-11 pr-4 py-4 text-[10px] tracking-widest uppercase text-accent focus:outline-none focus:border-gold/30 transition-all"
                            />
                        </div>
                    </header>

                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
                        <div className="xl:col-span-2">
                            <div className="bg-primary-light/10 border border-gold/10 relative overflow-hidden">
                                <div className="overflow-x-auto w-full scrollbar-thin scrollbar-thumb-gold/20 scrollbar-track-transparent">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-gold/5 border-b border-gold/10 text-nowrap">
                                                <th className="px-6 md:px-10 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-accent/50">User / Account Holder</th>
                                                <th className="px-6 md:px-10 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-accent/50">Status</th>
                                                <th className="px-6 md:px-10 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-accent/50 text-right">Balance</th>
                                                <th className="px-6 md:px-10 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-accent/50 text-right">View</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gold/5">
                                            {currentUsers.map((u) => (
                                                <tr
                                                    key={u._id}
                                                    onClick={() => setSelectedUser(u)}
                                                    className={`hover:bg-gold/[0.02] transition-all text-nowrap cursor-pointer group ${selectedUser?._id === u._id ? 'bg-gold/[0.03]' : ''}`}
                                                >
                                                    <td className="px-6 md:px-10 py-8">
                                                        <div className="flex flex-col">
                                                            <span className="text-accent font-light text-base md:text-lg tracking-tight">{u.name}</span>
                                                            <span className="text-[10px] text-accent/30 font-bold uppercase tracking-[0.2em]">{u.email}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 md:px-10 py-8">
                                                        <span className={`px-3 py-1 text-[9px] font-bold uppercase tracking-widest border transition-all ${u.isFrozen
                                                            ? 'bg-red-500/10 border-red-500/20 text-red-400'
                                                            : 'bg-green-500/10 border-green-500/20 text-green-400'}`}>
                                                            {u.isFrozen ? 'Suspended' : 'Active'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 md:px-10 py-8 text-right font-light text-accent text-lg">
                                                        ${u.accountBalance.toLocaleString()}
                                                    </td>
                                                    <td className="px-6 md:px-10 py-8 text-right">
                                                        <button
                                                            className="text-gold/40 hover:text-gold transition-colors"
                                                        >
                                                            <Users size={16} />
                                                        </button>
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
                        </div>


                        <div className="xl:col-span-1">
                            <AnimatePresence mode="wait">
                                {selectedUser ? (
                                    <motion.div
                                        key={selectedUser._id}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        className="bg-primary-light/10 border border-gold/10 p-8 md:p-10 sticky top-24"
                                    >
                                        <div className="flex justify-between items-start mb-10">
                                            <div className="w-16 h-16 bg-gold/5 border border-gold/20 flex items-center justify-center rounded-sm">
                                                <Shield size={32} className="text-gold/60" />
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] font-bold text-accent/30 uppercase tracking-[0.3em] mb-1">User ID</p>
                                                <p className="text-[10px] font-mono text-gold tracking-widest">{selectedUser._id.substring(0, 12).toUpperCase()}</p>
                                            </div>
                                        </div>

                                        <h3 className="text-2xl font-light text-accent tracking-tighter mb-2">{selectedUser.name}</h3>
                                        <div className="flex items-center gap-2 mb-8">
                                            <span className="text-[10px] text-accent/40 font-bold uppercase tracking-widest">{selectedUser.occupation || 'Standard User'}</span>
                                        </div>

                                        <div className="space-y-6 mb-10">
                                            <div className="flex items-center gap-4 text-accent/60">
                                                <Mail size={14} className="text-gold/40" />
                                                <span className="text-xs tracking-wide">{selectedUser.email}</span>
                                            </div>
                                            <div className="flex items-center gap-4 text-accent/60">
                                                <Hash size={14} className="text-gold/40" />
                                                <span className="text-xs tracking-wide font-mono">{selectedUser.accountNumber}</span>
                                            </div>
                                        </div>

                                        <div className="p-6 bg-gold/5 border border-gold/10 rounded-sm mb-10 flex justify-between items-center group">
                                            <div>
                                                <p className="text-[10px] font-bold text-gold/40 uppercase tracking-[0.3em] mb-2">Available Balance</p>
                                                <p className="text-3xl font-light text-accent tracking-tighter">${selectedUser.accountBalance.toLocaleString()}</p>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    setAdjustedBalance(selectedUser.accountBalance.toString())
                                                    setIsBalanceModalOpen(true)
                                                }}
                                                className="px-4 py-2 border border-gold/20 text-gold text-[8px] font-bold uppercase tracking-widest hover:bg-gold hover:text-primary transition-all opacity-0 group-hover:opacity-100"
                                            >
                                                Adjust Capital
                                            </button>
                                        </div>

                                        <div className="space-y-4">
                                            <button
                                                onClick={() => {
                                                    if (selectedUser.isFrozen) {
                                                        handleToggleFreeze(selectedUser._id, true, '')
                                                    } else {
                                                        setIsFreezeModalOpen(true)
                                                    }
                                                }}
                                                className={`w-full py-5 text-[10px] font-bold uppercase tracking-[0.3em] transition-all duration-500 border ${selectedUser.isFrozen
                                                    ? 'bg-green-600 text-white border-green-500 shadow-[0_10px_20px_rgba(22,163,74,0.2)]'
                                                    : 'bg-red-600 text-white border-red-500 shadow-[0_10px_20px_rgba(220,38,38,0.2)]'}`}
                                            >
                                                <div className="flex items-center justify-center gap-3">
                                                    {selectedUser.isFrozen ? <UserCheck size={16} /> : <UserX size={16} />}
                                                    {selectedUser.isFrozen ? 'Restore Account Access' : 'Suspend User Account'}
                                                </div>
                                            </button>

                                            {/* Reason Display for Frozen Users */}
                                            {selectedUser.isFrozen && selectedUser.freezeReason && (
                                                <div className="mt-4 p-4 bg-red-500/5 border border-red-500/10 rounded-sm">
                                                    <p className="text-[9px] font-bold text-red-400 uppercase tracking-widest mb-1">Audit Reason</p>
                                                    <p className="text-xs text-accent/60 leading-relaxed italic">"{selectedUser.freezeReason}"</p>
                                                </div>
                                            )}

                                            <div className="pt-8 border-t border-gold/10 mt-8">
                                                <p className="text-[10px] font-bold text- gold/40 uppercase tracking-[0.3em] mb-6">Velocity Controls</p>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="text-[9px] text-accent/30 uppercase tracking-[0.2em] block mb-2">Daily Limit</label>
                                                        <input
                                                            type="number"
                                                            defaultValue={selectedUser.limits?.dailyTransfer || 5000}
                                                            onBlur={async (e) => {
                                                                const val = parseInt(e.target.value);
                                                                try {
                                                                    await api.patch('/admin/user-limits', { userId: selectedUser._id, dailyTransfer: val });
                                                                    fetchUsers();
                                                                } catch (err) { console.error(err); }
                                                            }}
                                                            className="w-full bg-primary border border-gold/10 px-3 py-3 text-xs text-accent focus:border-gold outline-none transition-all"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-[9px] text-accent/30 uppercase tracking-[0.2em] block mb-2">Monthly Limit</label>
                                                        <input
                                                            type="number"
                                                            defaultValue={selectedUser.limits?.monthlyTransfer || 50000}
                                                            onBlur={async (e) => {
                                                                const val = parseInt(e.target.value);
                                                                try {
                                                                    await api.patch('/admin/user-limits', { userId: selectedUser._id, monthlyTransfer: val });
                                                                    fetchUsers();
                                                                } catch (err) { console.error(err); }
                                                            }}
                                                            className="w-full bg-primary border border-gold/10 px-3 py-3 text-xs text-accent focus:border-gold outline-none transition-all"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <div className="bg-primary-light/5 border border-gold/5 p-10 text-center flex flex-col items-center justify-center h-full min-h-[400px]">
                                        <div className="w-16 h-16 bg-gold/5 border border-dashed border-gold/20 flex items-center justify-center rounded-sm mb-6 opacity-40">
                                            <ShieldOff size={32} className="text-gold" />
                                        </div>
                                        <p className="text-[10px] font-bold text-accent/20 uppercase tracking-[0.4em]">Awaiting Entity Selection</p>
                                    </div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>

            {/* SEQUESTRATION MODAL */}
            <AnimatePresence>
                {isFreezeModalOpen && selectedUser && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsFreezeModalOpen(false)}
                            className="absolute inset-0 bg-primary/95 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-lg bg-primary-light border border-red-500/20 overflow-hidden"
                        >
                            <div className="h-1 w-full bg-red-600" />
                            <div className="p-8 md:p-12">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-12 h-12 bg-red-500/10 border border-red-500/20 flex items-center justify-center rounded-full">
                                        <AlertCircle size={24} className="text-red-500" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-light text-accent tracking-tighter">Account Sequestration.</h2>
                                        <p className="text-[10px] text-accent/30 font-bold uppercase tracking-[0.3em]">Module SEC-FRZ-01</p>
                                    </div>
                                </div>
                                <div className="p-4 bg-red-500/5 border border-red-500/10 rounded-sm mb-10">
                                    <p className="text-xs text-accent/60 leading-relaxed font-light">
                                        You are initiating a full sequestration of <span className="text-accent font-medium">{selectedUser.name}'s</span> fund access.
                                        The user will retain dashboard visibility but will be blocked from all capital movement protocols.
                                    </p>
                                </div>
                                <div className="space-y-3 mb-10">
                                    <label className="text-[10px] font-bold text-accent/30 uppercase tracking-widest block">Audit Reason / Justification</label>
                                    <textarea
                                        autoFocus
                                        value={freezeReason}
                                        onChange={(e) => setFreezeReason(e.target.value)}
                                        placeholder="e.g., Identifying suspicious institutional routing protocols..."
                                        className="w-full bg-primary border border-gold/10 focus:border-red-500/40 p-4 min-h-[120px] text-xs text-accent outline-none transition-all font-light leading-relaxed"
                                    />
                                    <p className="text-[9px] text-accent/20 italic">This reason will be visible to the user upon transaction rejection.</p>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gold/10">
                                    <button
                                        onClick={() => setIsFreezeModalOpen(false)}
                                        className="flex-1 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-accent/40 hover:text-accent transition-colors border border-gold/10"
                                    >
                                        Cancel Protocol
                                    </button>
                                    <button
                                        onClick={() => handleToggleFreeze(selectedUser._id, false, freezeReason)}
                                        disabled={!freezeReason.trim()}
                                        className="flex-1 py-4 text-[10px] font-bold uppercase tracking-[0.2em] bg-red-600 text-white shadow-[0_10px_20px_rgba(220,38,38,0.2)] hover:bg-red-700 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                    >
                                        Initiate Sequestration
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* LIQUIDITY ADJUSTMENT MODAL */}
            <AnimatePresence>
                {isBalanceModalOpen && selectedUser && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsBalanceModalOpen(false)}
                            className="absolute inset-0 bg-primary/95 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-lg bg-primary-light border border-gold/20 overflow-hidden"
                        >
                            <div className="h-1 w-full bg-gold" />
                            <div className="p-8 md:p-12">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-12 h-12 bg-gold/10 border border-gold/20 flex items-center justify-center rounded-full text-gold">
                                        <Landmark size={24} />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-light text-accent tracking-tighter">Liquidity Adjustment.</h2>
                                        <p className="text-[10px] text-accent/30 font-bold uppercase tracking-[0.3em]">Module LIQ-MOD-04</p>
                                    </div>
                                </div>
                                <div className="p-4 bg-gold/5 border border-gold/10 rounded-sm mb-10">
                                    <p className="text-xs text-accent/60 leading-relaxed font-light">
                                        You are modifying the core capital reserve for <span className="text-accent font-medium">{selectedUser.name}</span>.
                                        This change will be reflected immediately across all institutional ledgers.
                                    </p>
                                </div>
                                <div className="space-y-3 mb-10">
                                    <label className="text-[10px] font-bold text-accent/30 uppercase tracking-widest block">New Account Balance ($)</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/40 text-sm">$</span>
                                        <input
                                            type="number"
                                            autoFocus
                                            value={adjustedBalance}
                                            onChange={(e) => setAdjustedBalance(e.target.value)}
                                            className="w-full bg-primary border border-gold/10 focus:border-gold p-4 pl-8 text-lg text-accent outline-none transition-all font-light"
                                        />
                                    </div>
                                    <p className="text-[9px] text-accent/20 italic">Current institutional record: ${selectedUser.accountBalance.toLocaleString()}</p>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gold/10">
                                    <button
                                        onClick={() => setIsBalanceModalOpen(false)}
                                        className="flex-1 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-accent/40 hover:text-accent transition-colors border border-gold/10"
                                    >
                                        Dismiss
                                    </button>
                                    <button
                                        onClick={handleUpdateBalance}
                                        className="flex-1 py-4 text-[10px] font-bold uppercase tracking-[0.2em] bg-gold text-primary shadow-[0_10px_20px_rgba(212,175,55,0.2)] hover:bg-gold-dark transition-all"
                                    >
                                        Confirm Adjustment
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <div className="z-20">
                <Footer />
            </div>
        </div>
    )
}
