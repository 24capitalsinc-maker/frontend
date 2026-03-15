'use client'
import { format } from 'date-fns'
import { motion, AnimatePresence } from 'framer-motion'
import { Search } from 'lucide-react'
import { useState, useMemo } from 'react'
import Pagination from './Pagination'

export default function TransactionTable({ transactions, itemsPerPage = 10 }: { transactions: any[], itemsPerPage?: number }) {
    const [searchTerm, setSearchTerm] = useState('')
    const [currentPage, setCurrentPage] = useState(1)

    const filteredTransactions = useMemo(() => {
        return transactions.filter(tx =>
            tx.referenceId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tx.description?.toLowerCase().includes(searchTerm.toLowerCase())
        )
    }, [transactions, searchTerm])

    const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage)

    const currentTransactions = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage
        return filteredTransactions.slice(start, start + itemsPerPage)
    }, [filteredTransactions, currentPage])

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value)
        setCurrentPage(1) // Reset to first page on search
    }
    if (!transactions || transactions.length === 0) {
        return (
            <div className="bg-primary-light/10 border border-gold/10 p-32 text-center flex flex-col items-center gap-6">
                <div className="h-0.5 w-12 bg-gold/20" />
                <p className="text-accent/30 text-[10px] font-bold tracking-[0.5em] uppercase">Null Ledger State</p>
                <p className="text-accent/50 text-xs font-light max-w-xs mx-auto">No transaction records detected within the specified vault parameters.</p>
                <div className="h-0.5 w-12 bg-gold/20" />
            </div>
        )
    }

    return (
        <div className="bg-primary/50 border border-gold/20 overflow-hidden">
            <div className="p-6 sm:p-8 md:p-12 border-b border-gold/10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
                <div>
                    <h3 className="text-xl sm:text-2xl font-light text-accent tracking-tight mb-2">Vault Activity</h3>
                    <p className="text-gold font-bold text-[8px] sm:text-[10px] tracking-[0.3em] uppercase opacity-60">Verified Records</p>
                </div>
                <div className="relative w-full lg:w-80">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-accent/40" size={16} />
                    <input
                        placeholder="Search by Reference..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="w-full bg-primary-light/30 border border-gold/10 pl-12 pr-4 py-3 focus:border-gold outline-none transition-colors text-xs font-medium text-accent placeholder:text-accent/30"
                    />
                </div>
            </div>

            <div
                className="overflow-x-auto w-full"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' } as React.CSSProperties}
            >
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gold/5 border-b border-gold/10 text-nowrap">
                            <th className="px-4 sm:px-6 md:px-10 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-accent/50">Jurisdiction</th>
                            <th className="px-4 sm:px-6 md:px-10 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-accent/50">Detail</th>
                            <th className="px-4 sm:px-6 md:px-10 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-accent/50 text-center">Reference ID</th>
                            <th className="px-4 sm:px-6 md:px-10 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-accent/50 text-center">Settlement Date</th>
                            <th className="px-4 sm:px-6 md:px-10 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-accent/50 text-center">Status</th>
                            <th className="px-4 sm:px-6 md:px-10 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-accent/50 text-right">Value (ISO)</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gold/5">
                        <AnimatePresence mode="popLayout">
                            {currentTransactions.map((tx, idx) => (
                                <motion.tr
                                    key={tx._id || idx}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="group hover:bg-gold/5 transition-colors text-nowrap"
                                >
                                    <td className="px-4 sm:px-6 md:px-10 py-8">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-1.5 h-1.5 rounded-full shadow-[0_0_8px_rgba(203,161,110,0.3)] ${tx.routingProtocol === 'Offshore' ? 'bg-gold animate-pulse' : 'bg-gold/40'}`}></div>
                                            <span className="text-[10px] text-accent/60 font-medium tracking-widest uppercase">
                                                {tx.jurisdiction || tx.routingProtocol || 'Domestic'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-4 sm:px-6 md:px-10 py-8">
                                        <p className="text-accent font-light text-lg tracking-tight mb-1 flex items-center gap-3">
                                            {tx.type === 'debit' ? (
                                                <span className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"></span>
                                            ) : (
                                                <span className="w-1.5 h-1.5 rounded-full bg-gold shadow-[0_0_8px_rgba(203,161,110,0.5)]"></span>
                                            )}
                                            {tx.description}
                                        </p>
                                        <p className="text-[9px] font-bold text-accent/20 uppercase tracking-[0.3em] ml-5">
                                            {tx.detailLabel || (
                                                <>
                                                    {tx.routingProtocol ? `${tx.routingProtocol} // ` : ''}
                                                    {tx.type === 'debit' ? 'OUTBOUND TRANSACTION' : 'INBOUND SETTLEMENT'}
                                                </>
                                            )}
                                        </p>
                                    </td>
                                    <td className="px-4 sm:px-6 md:px-10 py-8 text-center">
                                        <span className="text-[10px] text-gold/60 font-medium tracking-[0.2em] border border-gold/10 px-3 py-1 bg-gold/5 rounded-sm">
                                            {tx.referenceId}
                                        </span>
                                    </td>
                                    <td className="px-4 sm:px-6 md:px-10 py-8 text-center">
                                        <p className="text-sm font-light text-accent/80 mb-1">{format(new Date(tx.createdAt), 'MMM dd, yyyy')}</p>
                                        <p className="text-[9px] font-bold text-accent/20 uppercase tracking-[0.2em]">{format(new Date(tx.createdAt), 'HH:mm:ss')}</p>
                                    </td>
                                    <td className="px-4 sm:px-6 md:px-10 py-8 text-center">
                                        <span className={`px-4 py-1.5 text-[9px] font-bold uppercase tracking-widest border transition-all ${tx.status === 'success' || tx.status === 'approved' || tx.status === 'completed'
                                            ? 'bg-green-500/10 border-green-500/20 text-green-400'
                                            : tx.status === 'pending'
                                                ? 'bg-gold/10 border-gold/20 text-gold'
                                                : 'bg-red-500/10 border-red-500/20 text-red-400'
                                            }`}>
                                            {tx.status || 'Pending'}
                                        </span>
                                    </td>
                                    <td className="px-4 sm:px-6 md:px-10 py-8 text-right">
                                        <div className="flex flex-col items-end">
                                            <p className={`text-2xl font-light tracking-tighter ${tx.type === 'debit' ? 'text-accent' : 'text-gold'
                                                }`}>
                                                {tx.type === 'debit' ? '-' : '+'}${tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                            </p>
                                            <p className="text-[9px] font-bold text-accent/20 uppercase tracking-[0.4em]">
                                                {tx.valueLabel || `${tx.currency || 'USD'} // SETTLED`}
                                            </p>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                    </tbody>
                </table>
            </div>
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </div>
    )
}
