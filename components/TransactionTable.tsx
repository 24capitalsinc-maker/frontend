'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { format } from 'date-fns'
import { ArrowUpRight, ArrowDownLeft, Search, ChevronLeft, ChevronRight, Eye } from 'lucide-react'
import ReceiptModal from './ReceiptModal'

interface Transaction {
    _id: string
    type: 'debit' | 'credit'
    amount: number
    currency: string
    description: string
    status: 'success' | 'pending' | 'failed'
    createdAt: string
    referenceId: string
    receiverAccountNumber: string
    routingProtocol: string
    jurisdiction?: string
}

interface TransactionTableProps {
    transactions: Transaction[]
    itemsPerPage?: number
}

export default function TransactionTable({ transactions = [], itemsPerPage = 10 }: TransactionTableProps) {
    const [searchTerm, setSearchTerm] = useState('')
    const [filterType, setFilterType] = useState<'all' | 'debit' | 'credit'>('all')
    const [currentPage, setCurrentPage] = useState(1)
    const [selectedTx, setSelectedTx] = useState<Transaction | null>(null)
    const [showReceipt, setShowReceipt] = useState(false)

    const filteredTransactions = transactions.filter(tx => {
        const matchesSearch =
            (tx.description?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (tx.referenceId?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (tx.receiverAccountNumber?.toLowerCase() || '').includes(searchTerm.toLowerCase())

        const matchesFilter = filterType === 'all' || tx.type === filterType

        return matchesSearch && matchesFilter
    })

    const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const paginatedTransactions = filteredTransactions.slice(startIndex, startIndex + itemsPerPage)

    const handleRowClick = (tx: Transaction) => {
        setSelectedTx(tx)
        setShowReceipt(true)
    }

    return (
        <div className="space-y-6">
            <ReceiptModal
                isOpen={showReceipt}
                onClose={() => setShowReceipt(false)}
                transaction={selectedTx}
            />

            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-10">
                <div className="relative w-full md:w-96 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-accent/20 group-hover:text-gold transition-colors" size={16} />
                    <input
                        type="text"
                        placeholder="Search by reference, account or description..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-primary/20 border border-gold/10 pl-12 pr-4 py-4 text-xs font-bold tracking-widest uppercase focus:border-gold outline-none transition-all placeholder:text-accent/10"
                    />
                </div>

                <div className="flex gap-2">
                    {(['all', 'debit', 'credit'] as const).map((type) => (
                        <button
                            key={type}
                            type="button"
                            onClick={() => { setFilterType(type); setCurrentPage(1); }}
                            className={`px-6 py-4 text-[9px] font-bold uppercase tracking-[0.2em] border transition-all ${filterType === type
                                ? 'bg-gold text-primary border-gold shadow-lg shadow-gold/10'
                                : 'bg-primary/20 border-gold/10 text-accent/40 hover:border-gold/30'
                                }`}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto border border-gold/10 bg-primary/20 backdrop-blur-xl no-scrollbar">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-gold/10 bg-gold/[0.02]">
                            <th className="px-4 sm:px-8 py-6 text-[10px] uppercase font-bold tracking-[0.3em] text-accent/40">Timestamp</th>
                            <th className="px-4 sm:px-8 py-6 text-[10px] uppercase font-bold tracking-[0.3em] text-accent/40">Reference</th>
                            <th className="px-4 sm:px-8 py-6 text-[10px] uppercase font-bold tracking-[0.3em] text-accent/40 hidden sm:table-cell">Registry</th>
                            <th className="px-4 sm:px-8 py-6 text-[10px] uppercase font-bold tracking-[0.3em] text-accent/40 text-right">Volume</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gold/5">
                        <AnimatePresence mode="popLayout">
                            {paginatedTransactions.map((tx) => (
                                <motion.tr
                                    layout
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    key={tx._id}
                                    onClick={() => handleRowClick(tx)}
                                    className="hover:bg-gold/[0.03] transition-colors group cursor-pointer"
                                >
                                    <td className="px-4 sm:px-8 py-6">
                                        <p className="text-[10px] font-bold text-accent group-hover:text-gold transition-colors">{tx.createdAt ? format(new Date(tx.createdAt), 'MMM dd, HH:mm') : 'N/A'}</p>
                                        <p className="text-[8px] text-accent/20 uppercase tracking-widest mt-1">Institutional Time</p>
                                    </td>
                                    <td className="px-4 sm:px-8 py-6">
                                        <div className="flex items-center gap-2 sm:gap-3">
                                            <div className={`p-1.5 sm:p-2 rounded-sm ${tx.type === 'debit' ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'}`}>
                                                {tx.type === 'debit' ? <ArrowUpRight size={12} /> : <ArrowDownLeft size={12} />}
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-accent uppercase tracking-widest">{tx.referenceId}</p>
                                                <p className="text-[8px] text-accent/30 uppercase mt-1 tracking-tighter truncate max-w-[80px] sm:max-w-[150px]">{tx.description}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 sm:px-8 py-6 hidden sm:table-cell">
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className={`w-1 h-1 rounded-full ${tx.status === 'success' ? 'bg-gold animate-pulse' : tx.status === 'pending' ? 'bg-blue-400' : 'bg-red-500'}`} />
                                            <p className="text-[9px] font-bold text-accent/60 uppercase tracking-widest">{tx.status}</p>
                                        </div>
                                        <p className="text-[8px] text-accent/20 font-bold uppercase tracking-widest">Global Node V4</p>
                                    </td>
                                    <td className="px-4 sm:px-8 py-6 text-right">
                                        <p className={`text-[12px] sm:text-sm font-medium tabular-nums ${tx.type === 'debit' ? 'text-accent' : 'text-gold'}`}>
                                            {tx.type === 'debit' ? '-' : '+'}{tx.currency === 'USD' ? '$' : tx.currency === 'EUR' ? '€' : '£'}{tx.amount?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                        </p>
                                        <div className="flex items-center justify-end gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Eye size={10} className="text-gold" />
                                            <p className="text-[8px] text-gold font-bold uppercase tracking-widest">View Receipt</p>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                    </tbody>
                </table>

                {filteredTransactions.length === 0 && (
                    <div className="py-20 text-center space-y-4">
                        <div className="w-12 h-12 border border-gold/10 mx-auto flex items-center justify-center opacity-20">
                            <Search size={20} className="text-gold" />
                        </div>
                        <p className="text-[10px] text-accent/20 font-bold uppercase tracking-[0.4em]">No financial records found in the current buffer</p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-between items-center pt-6">
                    <p className="text-[9px] text-accent/20 font-bold uppercase tracking-[0.3em]">
                        Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredTransactions.length)} of {filteredTransactions.length} Settlements
                    </p>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="p-3 border border-gold/10 text-accent/40 hover:border-gold/30 disabled:opacity-20 transition-all font-bold"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <button
                            type="button"
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="p-3 border border-gold/10 text-accent/40 hover:border-gold/30 disabled:opacity-20 transition-all font-bold"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
