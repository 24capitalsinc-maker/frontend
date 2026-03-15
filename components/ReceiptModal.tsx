'use client'
import { useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Download, Share2, CheckCircle2, ShieldCheck, Landmark, Globe, Shield } from 'lucide-react'
import { format } from 'date-fns'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import { toast } from 'sonner'

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

const COLORS = {
    primary: '#1a0d08',
    gold: '#d4af37',
    accent: '#fcf9f5',
}

export default function ReceiptModal({ isOpen, onClose, transaction }: ReceiptModalProps) {
    const receiptRef = useRef<HTMLDivElement>(null)

    if (!transaction) return null

    const isDebit = transaction.type === 'debit'

    const handleShare = async () => {
        const shareData = {
            title: `Capital24 Settlement: ${transaction.referenceId}`,
            text: `Settlement of ${transaction.currency} ${transaction.amount.toLocaleString()} to ${transaction.receiverAccountNumber}.`,
            url: window.location.href,
        }

        try {
            if (navigator.share) {
                await navigator.share(shareData)
            } else {
                await navigator.clipboard.writeText(
                    `Capital24 Receipt [${transaction.referenceId}]\nAmount: ${transaction.currency} ${transaction.amount.toLocaleString()}\nBeneficiary: ${transaction.receiverAccountNumber}`
                )
                toast.success('Financial metadata copied to clipboard')
            }
        } catch (error) {
            // Handled via fallback or toast
        }
    }

    const handleDownloadPDF = async () => {
        if (!receiptRef.current) return

        const loadingToast = toast.loading('Generating high-security PDF document...')

        try {
            const element = receiptRef.current

            // Temporary styles to ensure clean capture
            const originalScrollbar = element.style.scrollbarWidth;
            element.style.scrollbarWidth = 'none';

            const canvas = await html2canvas(element, {
                backgroundColor: COLORS.primary,
                scale: 2,
                logging: false,
                useCORS: true,
                allowTaint: true,
                onclone: (doc) => {
                    // Ensure cloned element has no scrollbar visibility issues
                    const el = doc.getElementById('receipt-content');
                    if (el) el.style.overflow = 'visible';
                }
            })

            element.style.scrollbarWidth = originalScrollbar;

            const imgData = canvas.toDataURL('image/png')
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'px',
                format: [canvas.width / 2, canvas.height / 2]
            })

            pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 2, canvas.height / 2)
            pdf.save(`Capital24_Receipt_${transaction.referenceId.slice(-8)}.pdf`)

            toast.dismiss(loadingToast)
            toast.success('Document exported successfully')
        } catch (error) {
            toast.dismiss(loadingToast)
            toast.error('Failed to generate institutional document')
        }
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 backdrop-blur-sm"
                        style={{ backgroundColor: 'rgba(26, 13, 8, 0.4)' }}
                    />

                    {/* Modal Content */}
                    <motion.div
                        id="receipt-content"
                        initial={{ opacity: 0, scale: 0.98, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98, y: 10 }}
                        className="relative w-full max-w-md border overflow-hidden flex flex-col no-scrollbar shadow-2xl"
                        ref={receiptRef}
                        style={{
                            backgroundColor: COLORS.primary,
                            borderColor: 'rgba(212, 175, 55, 0.2)',
                            scrollbarWidth: 'none'
                        }}
                    >
                        {/* Decorative background elements */}
                        <div className="absolute top-0 right-0 w-48 h-48 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" style={{ backgroundColor: 'rgba(212, 175, 55, 0.05)' }} />

                        {/* Static bg pattern to avoid theme resolution */}
                        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(212, 175, 55, 0.05) 1px, transparent 0)', backgroundSize: '40px 40px' }} />

                        {/* Top Accent Bar */}
                        <div className="h-1 w-full" style={{ backgroundColor: COLORS.gold, boxShadow: '0 0 10px rgba(212, 175, 55, 0.3)' }} />

                        <div className="p-6 md:p-10 relative z-10">
                            {/* Header */}
                            <div className="flex justify-between items-start mb-8">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-1.5 mb-1">
                                        <div className="w-1 h-1 rounded-full animate-pulse" style={{ backgroundColor: COLORS.gold }} />
                                        <p className="text-[8px] font-bold uppercase tracking-[0.4em]" style={{ color: 'rgba(212, 175, 55, 0.6)' }}>Official Records</p>
                                    </div>
                                    <h2 className="text-2xl font-light tracking-tighter" style={{ color: COLORS.accent }}>
                                        Transaction <span style={{ color: COLORS.gold }}>Receipt.</span>
                                    </h2>
                                </div>
                                <button
                                    onClick={onClose}
                                    data-html2canvas-ignore="true"
                                    className="p-1.5 transition-colors border rounded-sm"
                                    style={{
                                        color: 'rgba(252, 249, 245, 0.2)',
                                        borderColor: 'rgba(252, 249, 245, 0.05)',
                                        backgroundColor: 'rgba(252, 249, 245, 0.05)'
                                    }}
                                >
                                    <X size={16} strokeWidth={1} />
                                </button>
                            </div>

                            {/* Status Icon & Amount */}
                            <div className="flex flex-col items-center justify-center mb-8 py-6 border-y" style={{ backgroundColor: 'rgba(212, 175, 55, 0.02)', borderColor: 'rgba(212, 175, 55, 0.05)' }}>
                                <div className="w-12 h-12 border flex items-center justify-center mb-4 shadow-inner relative" style={{ backgroundColor: COLORS.primary, borderColor: 'rgba(212, 175, 55, 0.1)' }}>
                                    <div className="absolute inset-0 animate-pulse" style={{ backgroundColor: 'rgba(212, 175, 55, 0.05)' }} />
                                    <CheckCircle2 size={20} style={{ color: COLORS.gold }} className="relative z-10" />
                                </div>
                                <p className="text-3xl font-light tracking-tighter tabular-nums" style={{ color: COLORS.accent }}>
                                    {isDebit ? '-' : '+'}{transaction.currency === 'USD' ? '$' : transaction.currency === 'EUR' ? '€' : '£'}{transaction.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </p>
                                <p className="text-[9px] font-bold uppercase tracking-[0.3em] mt-2" style={{ color: 'rgba(252, 249, 245, 0.3)' }}>Settlement Authenticated</p>
                            </div>

                            {/* Details Grid */}
                            <div className="grid grid-cols-2 gap-y-6 gap-x-4 mb-8">
                                <div className="space-y-1">
                                    <p className="text-[8px] font-bold uppercase tracking-[0.2em]" style={{ color: 'rgba(252, 249, 245, 0.2)' }}>Protocol</p>
                                    <div className="flex items-center gap-2">
                                        {transaction.routingProtocol === 'Domestic' && <Landmark size={12} style={{ color: 'rgba(212, 175, 55, 0.6)' }} />}
                                        {transaction.routingProtocol === 'International' && <Globe size={12} style={{ color: 'rgba(212, 175, 55, 0.6)' }} />}
                                        {transaction.routingProtocol === 'Offshore' && <Shield size={12} style={{ color: 'rgba(212, 175, 55, 0.6)' }} />}
                                        <p className="text-[10px] font-medium uppercase tracking-widest" style={{ color: COLORS.accent }}>{transaction.routingProtocol}</p>
                                    </div>
                                </div>
                                <div className="space-y-1 text-right">
                                    <p className="text-[8px] font-bold uppercase tracking-[0.2em]" style={{ color: 'rgba(252, 249, 245, 0.2)' }}>Settlement Date</p>
                                    <p className="text-[10px] font-medium uppercase tracking-widest" style={{ color: COLORS.accent }}>
                                        {format(new Date(transaction.createdAt), 'MMM dd, yyyy')}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[8px] font-bold uppercase tracking-[0.2em]" style={{ color: 'rgba(252, 249, 245, 0.2)' }}>Reference ID</p>
                                    <p className="text-[10px] font-mono tracking-widest uppercase" style={{ color: 'rgba(212, 175, 55, 0.8)' }}>{transaction.referenceId}</p>
                                </div>
                                <div className="space-y-1 text-right">
                                    <p className="text-[8px] font-bold uppercase tracking-[0.2em]" style={{ color: 'rgba(252, 249, 245, 0.2)' }}>Beneficiary</p>
                                    <p className="text-[10px] font-medium uppercase tracking-widest truncate" style={{ color: COLORS.accent }}>{transaction.receiverAccountNumber}</p>
                                </div>
                                <div className="space-y-1 col-span-2">
                                    <p className="text-[8px] font-bold uppercase tracking-[0.2em]" style={{ color: 'rgba(252, 249, 245, 0.2)' }}>Institutional Note</p>
                                    <p className="text-[10px] font-light leading-relaxed italic line-clamp-2" style={{ color: 'rgba(252, 249, 245, 0.6)' }}>"{transaction.description || 'Institutional Distribution'}"</p>
                                </div>
                            </div>

                            {/* Footer / Actions */}
                            <div className="pt-6 border-t" style={{ borderColor: 'rgba(212, 175, 55, 0.1)' }} data-html2canvas-ignore="true">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <ShieldCheck size={14} style={{ color: 'rgba(212, 175, 55, 0.3)' }} />
                                        <p className="text-[7px] font-bold uppercase tracking-[0.4em]" style={{ color: 'rgba(252, 249, 245, 0.2)' }}>Vault Security Alpha-7</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={handleShare}
                                            className="p-2 transition-colors border border-transparent"
                                            style={{ color: 'rgba(252, 249, 245, 0.4)' }}
                                            title="Share Metadata"
                                        >
                                            <Share2 size={14} strokeWidth={1} />
                                        </button>
                                        <button
                                            onClick={handleDownloadPDF}
                                            className="p-2 px-3 transition-colors border border-transparent font-bold uppercase text-[9px] tracking-widest flex items-center gap-2"
                                            style={{ color: 'rgba(252, 249, 245, 0.4)' }}
                                            title="Download PDF"
                                        >
                                            <Download size={14} strokeWidth={1} />
                                            PDF
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Security Strip */}
                        <div className="py-2 px-10 border-t flex justify-between items-center overflow-hidden whitespace-nowrap opacity-30" style={{ backgroundColor: 'rgba(212, 175, 55, 0.03)', borderColor: 'rgba(212, 175, 55, 0.1)' }}>
                            <span className="text-[6px] font-serif uppercase tracking-[1em] tabular-nums" style={{ color: 'rgba(212, 175, 55, 0.2)' }}>
                                AUTH_TX_{transaction.referenceId.slice(-4).toUpperCase()}_SECURE_VAULT_ENCRYPTED_LEDGER_BUFFER
                            </span>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}
