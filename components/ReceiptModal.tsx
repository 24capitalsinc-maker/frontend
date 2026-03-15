'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Download, Share2, CheckCircle2, ShieldCheck, Landmark, Globe, Shield } from 'lucide-react'
import { format } from 'date-fns'

interface ReceiptModalProps {
    isOpen: boolean
    onClose: () => void
    transaction: {
        referenceId: string
        amount: number
        currency: string
        receiverAccountNumber: string
        routingProtocol: string
        description?: string
        createdAt: string | Date
        status: string
        type: 'debit' | 'credit'
        jurisdiction?: string
    } | null
}

export default function ReceiptModal({ isOpen, onClose, transaction }: ReceiptModalProps) {
    if (!transaction) return null

    const isDebit = transaction.type === 'debit'

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-primary/90 backdrop-blur-md"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-lg bg-primary border border-gold/20 shadow-2xl overflow-hidden"
                    >
                        {/* Decorative background elements */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />
                        <div className="absolute inset-0 bg-silk opacity-5 pointer-events-none" />

                        {/* Top Accent Bar */}
                        <div className="h-1.5 w-full bg-gold shadow-[0_0_15px_rgba(212,175,55,0.5)]" />

                        <div className="p-8 sm:p-12 relative z-10">
                            {/* Header */}
                            <div className="flex justify-between items-start mb-12">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
                                        <p className="text-[10px] text-gold font-bold uppercase tracking-[0.4em]">Official Records</p>
                                    </div>
                                    <h2 className="text-3xl font-light text-accent tracking-tighter">Transaction <span className="text-gold">Receipt.</span></h2>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 text-accent/20 hover:text-accent transition-colors border border-accent/5 hover:border-accent/10 bg-accent/5 rounded-sm"
                                >
                                    <X size={20} strokeWidth={1} />
                                </button>
                            </div>

                            {/* Status Icon */}
                            <div className="flex flex-col items-center justify-center mb-12 py-8 bg-gold/[0.03] border-y border-gold/10">
                                <div className="w-16 h-16 bg-primary border border-gold/20 flex items-center justify-center mb-6 shadow-inner relative">
                                    <div className="absolute inset-0 bg-gold/5 animate-pulse" />
                                    <CheckCircle2 size={28} className="text-gold relative z-10" />
                                </div>
                                <p className="text-4xl font-light text-accent tracking-tighter tabular-nums">
                                    {isDebit ? '-' : '+'}{transaction.currency === 'USD' ? '$' : transaction.currency === 'EUR' ? '€' : '£'}{transaction.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </p>
                                <p className="text-[10px] text-accent/40 font-bold uppercase tracking-[0.3em] mt-3">Settlement Authenticated</p>
                            </div>

                            {/* Details Grid */}
                            <div className="grid grid-cols-2 gap-y-10 gap-x-8 mb-12">
                                <div className="space-y-2">
                                    <p className="text-[9px] text-accent/20 font-bold uppercase tracking-[0.3em]">Protocol</p>
                                    <div className="flex items-center gap-2">
                                        {transaction.routingProtocol === 'Domestic' && <Landmark size={14} className="text-gold" />}
                                        {transaction.routingProtocol === 'International' && <Globe size={14} className="text-gold" />}
                                        {transaction.routingProtocol === 'Offshore' && <Shield size={14} className="text-gold" />}
                                        <p className="text-xs font-medium text-accent uppercase tracking-widest">{transaction.routingProtocol}</p>
                                    </div>
                                </div>
                                <div className="space-y-2 text-right">
                                    <p className="text-[9px] text-accent/20 font-bold uppercase tracking-[0.3em]">Settlement Date</p>
                                    <p className="text-xs font-medium text-accent uppercase tracking-widest">
                                        {format(new Date(transaction.createdAt), 'MMM dd, yyyy')}
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-[9px] text-accent/20 font-bold uppercase tracking-[0.3em]">Reference ID</p>
                                    <p className="text-xs font-mono text-gold font-bold tracking-widest uppercase">{transaction.referenceId}</p>
                                </div>
                                <div className="space-y-2 text-right">
                                    <p className="text-[9px] text-accent/20 font-bold uppercase tracking-[0.3em]">Beneficiary</p>
                                    <p className="text-xs font-medium text-accent uppercase tracking-widest truncate">{transaction.receiverAccountNumber}</p>
                                </div>
                                {transaction.jurisdiction && (
                                    <div className="space-y-2 col-span-2">
                                        <p className="text-[9px] text-accent/20 font-bold uppercase tracking-[0.3em]">Jurisdiction</p>
                                        <p className="text-xs font-medium text-accent uppercase tracking-widest">{transaction.jurisdiction}</p>
                                    </div>
                                )}
                                <div className="space-y-2 col-span-2">
                                    <p className="text-[9px] text-accent/20 font-bold uppercase tracking-[0.3em]">Description</p>
                                    <p className="text-xs font-light text-accent/70 leading-relaxed italic">"{transaction.description || 'Institutional Distribution'}"</p>
                                </div>
                            </div>

                            {/* Footer / Actions */}
                            <div className="pt-10 border-t border-gold/10 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <ShieldCheck size={16} className="text-gold/40" />
                                    <p className="text-[8px] text-accent/30 font-bold uppercase tracking-[0.4em]">End-to-End Encrypted Receipt</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <button className="p-3 text-accent/40 hover:text-gold transition-colors border border-transparent hover:border-gold/20 hover:bg-gold/5">
                                        <Share2 size={16} strokeWidth={1.5} />
                                    </button>
                                    <button className="p-3 text-accent/40 hover:text-gold transition-colors border border-transparent hover:border-gold/20 hover:bg-gold/5 font-bold uppercase text-[10px] tracking-widest flex items-center gap-2">
                                        <Download size={16} strokeWidth={1.5} />
                                        PDF
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Security Strip */}
                        <div className="bg-gold/5 py-4 px-12 border-t border-gold/10 flex justify-between items-center overflow-hidden whitespace-nowrap">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <span key={i} className="text-[7px] text-gold/20 font-serif uppercase tracking-[1em] tabular-nums">
                                    AUTH_TX_{transaction.referenceId.slice(-6).toUpperCase()}_SECURE_VAULT_SYSTEM_ALPHA_7
                                </span>
                            ))}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}
