'use client'
import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import AdminSidebar from '@/components/AdminSidebar'
import api from '@/lib/api'
import { toast } from 'sonner'
import { Edit2, Save, X, Calendar, DollarSign, ArrowRightLeft, Search } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Footer from '@/components/Footer'
import Pagination from '@/components/Pagination'
import { useMemo } from 'react'

export default function AdminTransactionsPage() {
    const [transactions, setTransactions] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 8
    const [editingTx, setEditingTx] = useState<any>(null)
    const [editForm, setEditForm] = useState<any>({})
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        fetchTransactions()
    }, [])

    const fetchTransactions = async () => {
        try {
            const res = await api.get('/admin/transactions')
            setTransactions(res.data)
        } catch (err) {
            // Handled via UI
        } finally {
            setLoading(false)
        }
    }

    const handleEdit = (tx: any) => {
        setEditingTx(tx)
        setEditForm({
            amount: tx.amount,
            status: tx.status,
            createdAt: tx.createdAt.split('T')[0] + 'T' + tx.createdAt.split('T')[1].substring(0, 5),
            type: tx.type,
            description: tx.description,
            sender: tx.sender?._id || tx.sender || '',
            receiver: tx.receiver?._id || tx.receiver || '',
            receiverAccountNumber: tx.receiverAccountNumber || '',
            currency: tx.currency || 'USD',
            routingProtocol: tx.routingProtocol || 'Domestic',
            swiftCode: tx.swiftCode || '',
            iban: tx.iban || '',
            jurisdiction: tx.jurisdiction || '',
            referenceId: tx.referenceId || '',
            detailLabel: tx.detailLabel || '',
            valueLabel: tx.valueLabel || ''
        })
    }

    const handleUpdate = async () => {
        try {
            const payload = { ...editForm };
            if (!payload.sender || payload.sender === '') delete payload.sender;
            if (!payload.receiver || payload.receiver === '') payload.receiver = null;

            const res = await api.put(`/admin/transactions/${editingTx._id}`, payload)
            setTransactions(transactions.map(t => t._id === editingTx._id ? { ...t, ...res.data } : t))
            setEditingTx(null)
            toast.success('Transaction updated successfully')
        } catch (err) {
            toast.error('Failed to update transaction.')
        }
    }

    const filteredTransactions = useMemo(() => {
        return transactions.filter(tx =>
            tx.sender?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tx.receiver?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tx.referenceId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tx.referenceNumber?.toLowerCase().includes(searchTerm.toLowerCase())
        )
    }, [transactions, searchTerm])

    const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage)

    const currentTransactions = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage
        return filteredTransactions.slice(start, start + itemsPerPage)
    }, [filteredTransactions, currentPage])

    const handleSearchChange = (val: string) => {
        setSearchTerm(val)
        setCurrentPage(1)
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
                                <span className="text-[10px] text-red-500 font-bold uppercase tracking-[0.3em]">Protocol 00-TX</span>
                                <div className="h-[1px] w-8 bg-red-500/20"></div>
                            </div>
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-light text-accent tracking-tighter">
                                All <span className="text-red-500 font-medium">Transactions.</span>
                            </h1>
                            <p className="text-accent/40 mt-3 text-xs sm:text-sm tracking-wide font-light">Manual correction and oversight of the bank ledger.</p>
                        </div>

                        <div className="relative w-full md:w-80">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/40" size={16} />
                            <input
                                type="text"
                                placeholder="Search by Entity or Reference..."
                                value={searchTerm}
                                onChange={(e) => handleSearchChange(e.target.value)}
                                className="w-full bg-primary-light/10 border border-gold/10 pl-11 pr-4 py-4 text-[10px] tracking-widest uppercase text-accent focus:outline-none focus:border-gold/30 transition-all"
                            />
                        </div>
                    </header>

                    <div className="bg-primary-light/10 border border-gold/10 relative overflow-hidden">
                        <div className="overflow-x-auto w-full no-scrollbar">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gold/5 border-b border-gold/10 text-nowrap">
                                        <th className="px-4 sm:px-6 md:px-10 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-accent/50">Timestamp</th>
                                        <th className="px-4 sm:px-6 md:px-10 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-accent/50">Sender / Receiver</th>
                                        <th className="px-4 sm:px-6 md:px-10 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-accent/50">Reference</th>
                                        <th className="px-4 sm:px-6 md:px-10 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-accent/50 text-right">Amount</th>
                                        <th className="px-4 sm:px-6 md:px-10 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-accent/50 text-center">Status</th>
                                        <th className="px-4 sm:px-6 md:px-10 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-accent/50 text-center">Jurisdiction</th>
                                        <th className="px-4 sm:px-6 md:px-10 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-accent/50 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gold/5">
                                    {currentTransactions.map((tx) => (
                                        <tr key={tx._id} className="hover:bg-gold/[0.02] transition-all text-nowrap group">
                                            <td className="px-4 sm:px-6 md:px-10 py-8">
                                                <div className="flex flex-col">
                                                    <span className="text-accent font-light text-sm">{new Date(tx.createdAt).toLocaleDateString()}</span>
                                                    <p className="text-xs text-accent/30 uppercase font-bold tracking-widest">Last Rotation: {new Date().toLocaleDateString()}</p>
                                                </div>
                                            </td>
                                            <td className="px-4 sm:px-6 md:px-10 py-8">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex flex-col">
                                                        <span className="text-accent text-sm font-light">{tx.sender?.name || 'External'}</span>
                                                        <span className="text-[9px] text-gold/40 font-bold uppercase tracking-tighter">Source</span>
                                                    </div>
                                                    <ArrowRightLeft size={12} className="text-gold/20" />
                                                    <div className="flex flex-col">
                                                        <span className="text-accent text-sm font-light">{tx.receiver?.name || 'External'}</span>
                                                        <span className="text-[9px] text-gold/40 font-bold uppercase tracking-tighter">Destination</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 sm:px-6 md:px-10 py-8">
                                                <span className="text-[10px] text-accent/40 font-mono tracking-widest">{tx.referenceNumber || 'TX-' + tx._id.substring(0, 8).toUpperCase()}</span>
                                            </td>
                                            <td className="px-4 sm:px-6 md:px-10 py-8 text-right">
                                                <span className="text-accent font-light text-lg">${tx.amount.toLocaleString()}</span>
                                            </td>
                                            <td className="px-4 sm:px-6 md:px-10 py-8 text-center text-[10px] font-bold uppercase tracking-widest">
                                                <span className={`${tx.status === 'success' ? 'text-green-500' : tx.status === 'pending' ? 'text-gold' : 'text-red-500'}`}>
                                                    {tx.status}
                                                </span>
                                            </td>
                                            <td className="px-4 sm:px-6 md:px-10 py-8 text-center">
                                                <span className="text-[10px] text-accent/60 font-medium tracking-widest uppercase">{tx.jurisdiction || tx.routingProtocol || 'Domestic'}</span>
                                            </td>
                                            <td className="px-4 sm:px-6 md:px-10 py-8 text-right">
                                                <button
                                                    onClick={() => handleEdit(tx)}
                                                    className="p-3 bg-gold/5 border border-gold/10 text-gold hover:bg-gold hover:text-primary transition-all duration-300"
                                                >
                                                    <Edit2 size={14} />
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
            </div>

            {/* Edit Modal */}
            <AnimatePresence>
                {editingTx && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 sm:p-12">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setEditingTx(null)}
                            className="absolute inset-0 bg-primary/95 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-4xl bg-primary border border-gold/20 p-10 shadow-[0_30px_60px_rgba(0,0,0,0.5)] max-h-[90vh] overflow-y-auto no-scrollbar"
                        >
                            <div className="flex justify-between items-start mb-10 pb-6 border-b border-gold/10">
                                <div>
                                    <p className="text-[8px] text-gold font-medium uppercase tracking-widest mt-1 text-center md:text-left">Encryption [AES-256] Active</p>
                                    <h2 className="text-3xl font-light text-accent tracking-tighter">Edit <span className="text-gold">Transfer.</span></h2>
                                </div>
                                <button onClick={() => setEditingTx(null)} className="text-accent/30 hover:text-gold transition-colors">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                                {/* Monetary Section */}
                                <div className="md:col-span-3 border-b border-gold/5 pb-2 mb-2">
                                    <h4 className="text-[10px] text-gold font-bold uppercase tracking-[0.2em]">Monetary Details</h4>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-accent/40 flex items-center gap-2">
                                        <DollarSign size={12} /> Amount
                                    </label>
                                    <input
                                        type="number"
                                        value={editForm.amount}
                                        onChange={(e) => setEditForm({ ...editForm, amount: Number(e.target.value) })}
                                        className="w-full bg-primary-light/10 border border-gold/10 p-4 text-accent text-lg font-light focus:outline-none focus:border-gold/40 transition-all"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-accent/40">Currency</label>
                                    <input
                                        type="text"
                                        value={editForm.currency}
                                        onChange={(e) => setEditForm({ ...editForm, currency: e.target.value.toUpperCase() })}
                                        className="w-full bg-primary-light/10 border border-gold/10 p-4 text-accent text-sm font-light focus:outline-none focus:border-gold/40 transition-all"
                                        placeholder="USD"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-accent/40 flex items-center gap-2">
                                        <Calendar size={12} /> Timestamp
                                    </label>
                                    <input
                                        type="datetime-local"
                                        value={editForm.createdAt}
                                        onChange={(e) => setEditForm({ ...editForm, createdAt: e.target.value })}
                                        className="w-full bg-primary-light/10 border border-gold/10 p-4 text-accent text-sm font-light focus:outline-none focus:border-gold/40 transition-all"
                                    />
                                </div>

                                {/* Routing & Protocol */}
                                <div className="md:col-span-3 border-b border-gold/5 pb-2 mb-2">
                                    <h4 className="text-[10px] text-gold font-bold uppercase tracking-[0.2em]">Routing & Protocol</h4>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-accent/40">Protocol</label>
                                    <select
                                        value={editForm.routingProtocol}
                                        onChange={(e) => setEditForm({ ...editForm, routingProtocol: e.target.value })}
                                        className="w-full select-institutional p-4 text-[10px] font-bold uppercase tracking-[0.15em] cursor-pointer"
                                    >
                                        <option value="Domestic">Domestic Protocol</option>
                                        <option value="International">International Wire</option>
                                        <option value="Offshore">Offshore Settlement</option>
                                    </select>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-accent/40">SWIFT / BIC</label>
                                    <input
                                        type="text"
                                        value={editForm.swiftCode}
                                        onChange={(e) => setEditForm({ ...editForm, swiftCode: e.target.value.toUpperCase() })}
                                        className="w-full bg-primary-light/10 border border-gold/10 p-4 text-accent text-sm font-light focus:outline-none focus:border-gold/40 transition-all"
                                        placeholder="BIC Code"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-accent/40">IBAN / Target</label>
                                    <input
                                        type="text"
                                        value={editForm.iban}
                                        onChange={(e) => setEditForm({ ...editForm, iban: e.target.value.toUpperCase() })}
                                        className="w-full bg-primary-light/10 border border-gold/10 p-4 text-accent text-sm font-light focus:outline-none focus:border-gold/40 transition-all"
                                        placeholder="IBAN Identifier"
                                    />
                                </div>

                                {/* Entity Links */}
                                <div className="md:col-span-3 border-b border-gold/5 pb-2 mb-2">
                                    <h4 className="text-[10px] text-gold font-bold uppercase tracking-[0.2em]">Entity Mapping</h4>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-accent/40">Sender ID</label>
                                    <input
                                        type="text"
                                        value={editForm.sender}
                                        onChange={(e) => setEditForm({ ...editForm, sender: e.target.value })}
                                        className="w-full bg-primary-light/10 border border-gold/10 p-4 text-accent text-[10px] font-mono focus:outline-none focus:border-gold/40 transition-all"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-accent/40">Receiver ID</label>
                                    <input
                                        type="text"
                                        value={editForm.receiver}
                                        onChange={(e) => setEditForm({ ...editForm, receiver: e.target.value })}
                                        className="w-full bg-primary-light/10 border border-gold/10 p-4 text-accent text-[10px] font-mono focus:outline-none focus:border-gold/40 transition-all"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-accent/40">Target Account</label>
                                    <input
                                        type="text"
                                        value={editForm.receiverAccountNumber}
                                        onChange={(e) => setEditForm({ ...editForm, receiverAccountNumber: e.target.value })}
                                        className="w-full bg-primary-light/10 border border-gold/10 p-4 text-accent text-sm font-light focus:outline-none focus:border-gold/40 transition-all"
                                    />
                                </div>

                                {/* Ledger Identity */}
                                <div className="md:col-span-3 border-b border-gold/5 pb-2 mb-2">
                                    <h4 className="text-[10px] text-gold font-bold uppercase tracking-[0.2em]">Ledger Identity</h4>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-accent/40">Reference ID</label>
                                    <input
                                        type="text"
                                        value={editForm.referenceId}
                                        onChange={(e) => setEditForm({ ...editForm, referenceId: e.target.value })}
                                        className="w-full bg-primary-light/10 border border-gold/10 p-4 text-accent text-[10px] font-mono focus:outline-none focus:border-gold/40 transition-all"
                                    />
                                </div>
                                <div className="md:col-span-1 space-y-3">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-accent/40 font-mono italic">Jurisdiction</label>
                                    <input
                                        type="text"
                                        value={editForm.jurisdiction}
                                        onChange={(e) => setEditForm({ ...editForm, jurisdiction: e.target.value })}
                                        className="w-full bg-primary-light/10 border border-gold/10 p-4 text-accent text-sm font-light focus:outline-none focus:border-gold/40 transition-all"
                                        placeholder="e.g. Switzerland"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-accent/40">Detail Label Overlay</label>
                                    <input
                                        type="text"
                                        value={editForm.detailLabel}
                                        onChange={(e) => setEditForm({ ...editForm, detailLabel: e.target.value })}
                                        className="w-full bg-primary-light/10 border border-gold/10 p-4 text-accent text-[10px] font-bold uppercase tracking-widest focus:outline-none focus:border-gold/40 transition-all"
                                        placeholder="International // OUTBOUND"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-accent/40">Value Label Overlay</label>
                                    <input
                                        type="text"
                                        value={editForm.valueLabel}
                                        onChange={(e) => setEditForm({ ...editForm, valueLabel: e.target.value })}
                                        className="w-full bg-primary-light/10 border border-gold/10 p-4 text-accent text-[10px] font-bold uppercase tracking-widest focus:outline-none focus:border-gold/40 transition-all"
                                        placeholder="USD // SETTLED"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-accent/40">Transaction Type</label>
                                    <select
                                        value={editForm.type}
                                        onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
                                        className="w-full select-institutional p-4 text-[10px] font-bold uppercase tracking-widest cursor-pointer"
                                    >
                                        <option value="debit">Debit Outflow</option>
                                        <option value="credit">Credit Inflow</option>
                                    </select>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-accent/40">Current Status</label>
                                    <select
                                        value={editForm.status}
                                        onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                                        className="w-full select-institutional p-4 text-[10px] font-bold uppercase tracking-widest cursor-pointer"
                                    >
                                        <option value="pending">Pending Settlement</option>
                                        <option value="success">Success / Finalized</option>
                                        <option value="failed">Failed / Revoked</option>
                                    </select>
                                </div>
                                <div className="md:col-span-2 space-y-3">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-accent/40">Ledger Description</label>
                                    <input
                                        type="text"
                                        value={editForm.description}
                                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                        className="w-full bg-primary-light/10 border border-gold/10 p-4 text-accent text-sm font-light focus:outline-none focus:border-gold/40 transition-all"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={handleUpdate}
                                className="w-full bg-gold text-primary py-5 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-gold-dark transition-all duration-500 shadow-[0_10px_30px_rgba(203,161,110,0.2)] flex items-center justify-center gap-3"
                            >
                                <Save size={16} />
                                Commit Changes
                            </button>
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
