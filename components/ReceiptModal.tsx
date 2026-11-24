'use client'
import { useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Download, Share2, CheckCircle2, Clock, XCircle, ShieldCheck, Landmark, Globe, Shield } from 'lucide-react'
import { format } from 'date-fns'
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
        receiverName?: string
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
    const currencySymbol = transaction.currency === 'USD' ? '$' : transaction.currency === 'EUR' ? '€' : '£'
    const statusColor = transaction.status === 'pending'
        ? 'rgba(96,165,250,0.9)'
        : transaction.status === 'failed'
            ? 'rgba(239,68,68,0.9)'
            : COLORS.gold

    const getReceiptUrl = () => {
        const base = typeof window !== 'undefined' ? window.location.origin : 'https://www.optimanexgen.org'
        return `${base}/receipt/${transaction.referenceId}`
    }

    // --- Share: copies the dedicated receipt URL ---
    const handleShare = async () => {
        const receiptUrl = getReceiptUrl()
        const shareData = {
            title: `Optima Nexgen Receipt: ${transaction.referenceId}`,
            text: `Transaction receipt for ${transaction.currency} ${transaction.amount.toLocaleString()} — Reference: ${transaction.referenceId}`,
            url: receiptUrl,
        }

        try {
            if (navigator.share) {
                await navigator.share(shareData)
            } else {
                await navigator.clipboard.writeText(receiptUrl)
                toast.success('Receipt link copied to clipboard')
            }
        } catch (error) {
            // User cancelled share — no action needed
        }
    }

    // --- Download: programmatic PDF via jsPDF (no DOM capture) ---
    const handleDownloadPDF = () => {
        const loadingToast = toast.loading('Generating receipt document...')

        try {
            const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' })
            const pageW = doc.internal.pageSize.getWidth()
            const margin = 48
            const contentW = pageW - margin * 2

            // Dark background
            doc.setFillColor(26, 13, 8)
            doc.rect(0, 0, pageW, doc.internal.pageSize.getHeight(), 'F')

            // Gold top bar
            doc.setFillColor(212, 175, 55)
            doc.rect(0, 0, pageW, 4, 'F')

            let y = 48

            // Logo / brand
            doc.setTextColor(212, 175, 55)
            doc.setFontSize(7)
            doc.setFont('helvetica', 'bold')
            doc.text('OPTIMA NEXGEN BANKING', pageW / 2, y, { align: 'center' })
            y += 10
            doc.setTextColor(212, 175, 55)
            doc.setFontSize(6)
            doc.text('OFFICIAL RECORDS', pageW / 2, y, { align: 'center' })
            y += 28

            // Title
            doc.setTextColor(252, 249, 245)
            doc.setFontSize(24)
            doc.setFont('helvetica', 'normal')
            doc.text('Transaction Receipt', margin, y)
            y += 36

            // Divider
            doc.setDrawColor(212, 175, 55)
            doc.setLineWidth(0.5)
            doc.line(margin, y, pageW - margin, y)
            y += 24

            // Amount
            const sign = isDebit ? '-' : '+'
            const amountStr = `${sign}${currencySymbol}${transaction.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
            doc.setFontSize(32)
            doc.setFont('helvetica', 'light')
            doc.setTextColor(252, 249, 245)
            doc.text(amountStr, pageW / 2, y, { align: 'center' })
            y += 18

            // Status label
            const statusText = transaction.status === 'pending'
                ? 'PENDING // AWAITING ADMIN APPROVAL'
                : transaction.status === 'failed'
                    ? 'FAILED // TRANSACTION REJECTED'
                    : 'SETTLEMENT AUTHENTICATED'
            const statusR = transaction.status === 'pending' ? 96 : transaction.status === 'failed' ? 239 : 212
            const statusG = transaction.status === 'pending' ? 165 : transaction.status === 'failed' ? 68 : 175
            const statusB = transaction.status === 'pending' ? 250 : transaction.status === 'failed' ? 68 : 55
            doc.setFontSize(7)
            doc.setFont('helvetica', 'bold')
            doc.setTextColor(statusR, statusG, statusB)
            doc.text(statusText, pageW / 2, y, { align: 'center' })
            y += 32

            // Divider
            doc.setDrawColor(212, 175, 55)
            doc.setLineWidth(0.3)
            doc.line(margin, y, pageW - margin, y)
            y += 24

            // Detail rows
            const rows: [string, string][] = [
                ['Reference ID', transaction.referenceId],
                ['Date', format(new Date(transaction.createdAt), 'MMM dd, yyyy — HH:mm:ss')],
                ['Protocol', transaction.routingProtocol],
                ['Type', isDebit ? 'Debit (Outgoing)' : 'Credit (Incoming)'],
                ['Currency', transaction.currency],
                ['Beneficiary Account', transaction.receiverAccountNumber],
                ['Beneficiary Name', transaction.receiverName || 'N/A'],
                ['Note', transaction.description || 'Institutional Distribution'],
            ]

            if (transaction.jurisdiction) {
                rows.splice(3, 0, ['Jurisdiction', transaction.jurisdiction])
            }

            for (const [label, value] of rows) {
                doc.setFontSize(7)
                doc.setFont('helvetica', 'bold')
                doc.setTextColor(252, 249, 245, 0.35)
                doc.setTextColor(120, 100, 80)
                doc.text(label.toUpperCase(), margin, y)

                doc.setFontSize(9)
                doc.setFont('helvetica', 'normal')
                doc.setTextColor(252, 249, 245)
                const lines = doc.splitTextToSize(value, contentW - 10)
                doc.text(lines, pageW - margin, y, { align: 'right' })
                y += lines.length > 1 ? lines.length * 13 + 10 : 22
            }

            y += 8
            // Final divider
            doc.setDrawColor(212, 175, 55)
            doc.setLineWidth(0.3)
            doc.line(margin, y, pageW - margin, y)
            y += 20

            // Share link
            doc.setFontSize(7)
            doc.setFont('helvetica', 'bold')
            doc.setTextColor(120, 100, 80)
            doc.text('VERIFY RECEIPT ONLINE', margin, y)
            y += 13
            doc.setFontSize(7)
            doc.setFont('helvetica', 'normal')
            doc.setTextColor(212, 175, 55)
            doc.text(getReceiptUrl(), margin, y)
            y += 28

            // Footer
            doc.setFontSize(6)
            doc.setFont('helvetica', 'bold')
            doc.setTextColor(80, 60, 40)
            doc.text('This is an official receipt issued by Optima Nexgen Banking. Vault Security Alpha-7.', pageW / 2, y, { align: 'center' })

            doc.save(`OptimaNexgen_Receipt_${transaction.referenceId.slice(-8)}.pdf`)

            toast.dismiss(loadingToast)
            toast.success('Receipt downloaded successfully')
        } catch (error) {
            console.error('PDF generation error:', error)
            toast.dismiss(loadingToast)
            toast.error('Failed to generate receipt document')
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

                        {/* Static bg pattern */}
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
                                <div className="w-12 h-12 border flex items-center justify-center mb-4 shadow-inner relative" style={{
                                    backgroundColor: COLORS.primary,
                                    borderColor: transaction.status === 'pending' ? 'rgba(96, 165, 250, 0.3)' : transaction.status === 'failed' ? 'rgba(239,68,68,0.3)' : 'rgba(212, 175, 55, 0.1)'
                                }}>
                                    <div className="absolute inset-0 animate-pulse" style={{ backgroundColor: transaction.status === 'pending' ? 'rgba(96, 165, 250, 0.05)' : 'rgba(212, 175, 55, 0.05)' }} />
                                    {transaction.status === 'pending' && <Clock size={20} style={{ color: 'rgba(96, 165, 250, 0.9)' }} className="relative z-10" />}
                                    {transaction.status === 'failed' && <XCircle size={20} style={{ color: 'rgba(239,68,68,0.9)' }} className="relative z-10" />}
                                    {transaction.status === 'success' && <CheckCircle2 size={20} style={{ color: COLORS.gold }} className="relative z-10" />}
                                </div>
                                <p className="text-3xl font-light tracking-tighter tabular-nums" style={{ color: COLORS.accent }}>
                                    {isDebit ? '-' : '+'}{currencySymbol}{transaction.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </p>
                                <p className="text-[9px] font-bold uppercase tracking-[0.3em] mt-2" style={{ color: statusColor }}>
                                    {transaction.status === 'pending' ? 'Pending // Awaiting Admin Approval' : transaction.status === 'failed' ? 'Failed // Transaction Rejected' : 'Settlement Authenticated'}
                                </p>
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
                            <div className="pt-6 border-t" style={{ borderColor: 'rgba(212, 175, 55, 0.1)' }}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <ShieldCheck size={14} style={{ color: 'rgba(212, 175, 55, 0.3)' }} />
                                        <p className="text-[7px] font-bold uppercase tracking-[0.4em]" style={{ color: 'rgba(252, 249, 245, 0.2)' }}>Vault Security Alpha-7</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={handleShare}
                                            className="p-2 transition-colors border border-transparent hover:border-gold/20"
                                            style={{ color: 'rgba(252, 249, 245, 0.4)' }}
                                            title="Copy shareable receipt link"
                                        >
                                            <Share2 size={14} strokeWidth={1} />
                                        </button>
                                        <button
                                            onClick={handleDownloadPDF}
                                            className="p-2 px-3 transition-colors border border-transparent font-bold uppercase text-[9px] tracking-widest flex items-center gap-2 hover:border-gold/20"
                                            style={{ color: 'rgba(252, 249, 245, 0.4)' }}
                                            title="Download PDF receipt"
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
