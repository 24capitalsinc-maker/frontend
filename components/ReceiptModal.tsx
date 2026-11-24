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
    
    const simpleStatus = transaction.status === 'pending'
        ? 'Pending'
        : transaction.status === 'failed'
            ? 'Failed'
            : 'Successful'

    const statusColor = transaction.status === 'pending'
        ? 'rgba(96,165,250,0.95)'
        : transaction.status === 'failed'
            ? 'rgba(239,68,68,0.95)'
            : COLORS.gold

    const protocolDisplay = transaction.routingProtocol === 'Domestic'
        ? 'Domestic Transfer'
        : transaction.routingProtocol === 'Offshore'
            ? 'International Transfer'
            : `${transaction.routingProtocol} Transfer`

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

    // --- Download: programmatic standard A4 PDF (no DOM capture, 100% visible & concise) ---
    const handleDownloadPDF = () => {
        const loadingToast = toast.loading('Generating receipt document...')

        try {
            // Standard A4 document (595.28 x 841.89 pt)
            const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' })
            const pageW = doc.internal.pageSize.getWidth()
            const pageH = doc.internal.pageSize.getHeight()

            // Dark luxury background
            doc.setFillColor(26, 13, 8)
            doc.rect(0, 0, pageW, pageH, 'F')

            // Centered receipt card dimensions
            const cardW = 440
            const cardX = (pageW - cardW) / 2
            const startContentY = 70
            let cardY = startContentY
            const padX = 36

            // Top accent gold bar on the card
            doc.setFillColor(212, 175, 55)
            doc.rect(cardX, cardY, cardW, 4, 'F')
            cardY += 28

            // Brand Header
            doc.setFont('helvetica', 'bold')
            doc.setFontSize(11)
            doc.setTextColor(212, 175, 55)
            doc.text('OPTIMA NEXGEN BANKING', pageW / 2, cardY, { align: 'center' })
            cardY += 16

            doc.setFont('helvetica', 'normal')
            doc.setFontSize(8)
            doc.setTextColor(197, 168, 128)
            doc.text('TRANSACTION RECEIPT', pageW / 2, cardY, { align: 'center' })
            cardY += 24

            // Divider
            doc.setDrawColor(212, 175, 55)
            doc.setLineWidth(0.5)
            doc.line(cardX + padX, cardY, cardX + cardW - padX, cardY)
            cardY += 26

            // Amount
            const sign = isDebit ? '-' : '+'
            const amountStr = `${sign}${currencySymbol}${transaction.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
            doc.setFont('helvetica', 'bold')
            doc.setFontSize(26)
            doc.setTextColor(255, 255, 255)
            doc.text(amountStr, pageW / 2, cardY, { align: 'center' })
            cardY += 18

            // Simple Status (Pending / Successful / Failed)
            const statusR = transaction.status === 'pending' ? 96 : transaction.status === 'failed' ? 248 : 212
            const statusG = transaction.status === 'pending' ? 165 : transaction.status === 'failed' ? 113 : 175
            const statusB = transaction.status === 'pending' ? 250 : transaction.status === 'failed' ? 113 : 55

            doc.setFontSize(9)
            doc.setFont('helvetica', 'bold')
            doc.setTextColor(statusR, statusG, statusB)
            doc.text(simpleStatus.toUpperCase(), pageW / 2, cardY, { align: 'center' })
            cardY += 26

            // Divider
            doc.setDrawColor(212, 175, 55)
            doc.setLineWidth(0.4)
            doc.line(cardX + padX, cardY, cardX + cardW - padX, cardY)
            cardY += 22

            // Detail rows
            const rows: [string, string][] = [
                ['Reference ID', transaction.referenceId],
                ['Date & Time', format(new Date(transaction.createdAt), 'MMM dd, yyyy  HH:mm')],
                ['Transfer Type', protocolDisplay],
                ['Transfer Direction', isDebit ? 'Debit (Outgoing)' : 'Credit (Incoming)'],
                ['Currency', transaction.currency || 'USD'],
                ['Recipient Name', transaction.receiverName || 'Account Holder'],
                ['Recipient Account', transaction.receiverAccountNumber || 'N/A'],
                ['Status', simpleStatus],
                ['Note', transaction.description || 'Transfer'],
            ]

            const leftColX = cardX + padX
            const rightColX = cardX + cardW - padX
            const colWidth = 220

            for (const [label, val] of rows) {
                // Label (Left)
                doc.setFontSize(8)
                doc.setFont('helvetica', 'bold')
                doc.setTextColor(197, 168, 128) // Bright legible golden-tan
                doc.text(label.toUpperCase(), leftColX, cardY)

                // Value (Right)
                doc.setFontSize(9)
                doc.setFont('helvetica', 'normal')
                doc.setTextColor(255, 255, 255) // Pure bright white
                const lines = doc.splitTextToSize(val, colWidth)
                doc.text(lines, rightColX, cardY, { align: 'right' })

                cardY += Math.max(18, lines.length * 12 + 6)
            }

            cardY += 10

            // Divider
            doc.setDrawColor(212, 175, 55)
            doc.setLineWidth(0.4)
            doc.line(cardX + padX, cardY, cardX + cardW - padX, cardY)
            cardY += 20

            // Online verification link
            doc.setFontSize(7.5)
            doc.setFont('helvetica', 'bold')
            doc.setTextColor(197, 168, 128)
            doc.text('VERIFY THIS RECEIPT ONLINE:', leftColX, cardY)
            cardY += 12

            doc.setFontSize(7.5)
            doc.setFont('helvetica', 'normal')
            doc.setTextColor(212, 175, 55)
            doc.text(getReceiptUrl(), leftColX, cardY)
            cardY += 24

            // Security footer inside card
            doc.setFontSize(7)
            doc.setFont('helvetica', 'normal')
            doc.setTextColor(160, 145, 130)
            doc.text('Official receipt issued by Optima Nexgen Banking. Verified secure transaction.', pageW / 2, cardY, { align: 'center' })
            cardY += 24

            // Draw outer border for the card
            const totalCardH = cardY - startContentY
            doc.setDrawColor(212, 175, 55)
            doc.setLineWidth(0.8)
            doc.rect(cardX, startContentY, cardW, totalCardH, 'D')

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
                            borderColor: 'rgba(212, 175, 55, 0.25)',
                            scrollbarWidth: 'none'
                        }}
                    >
                        {/* Decorative background elements */}
                        <div className="absolute top-0 right-0 w-48 h-48 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" style={{ backgroundColor: 'rgba(212, 175, 55, 0.05)' }} />

                        {/* Top Accent Bar */}
                        <div className="h-1 w-full" style={{ backgroundColor: COLORS.gold, boxShadow: '0 0 10px rgba(212, 175, 55, 0.3)' }} />

                        <div className="p-6 md:p-10 relative z-10">
                            {/* Header */}
                            <div className="flex justify-between items-start mb-8">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-1.5 mb-1">
                                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS.gold }} />
                                        <p className="text-[9px] font-bold uppercase tracking-[0.25em]" style={{ color: 'rgba(212, 175, 55, 0.8)' }}>Receipt</p>
                                    </div>
                                    <h2 className="text-2xl font-light tracking-tighter" style={{ color: COLORS.accent }}>
                                        Transaction <span style={{ color: COLORS.gold }}>Receipt.</span>
                                    </h2>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-1.5 transition-colors border rounded-sm hover:bg-gold/10"
                                    style={{
                                        color: 'rgba(252, 249, 245, 0.4)',
                                        borderColor: 'rgba(252, 249, 245, 0.1)',
                                        backgroundColor: 'rgba(252, 249, 245, 0.05)'
                                    }}
                                >
                                    <X size={16} strokeWidth={1.5} />
                                </button>
                            </div>

                            {/* Status Icon & Amount */}
                            <div className="flex flex-col items-center justify-center mb-8 py-6 border-y" style={{ backgroundColor: 'rgba(212, 175, 55, 0.02)', borderColor: 'rgba(212, 175, 55, 0.1)' }}>
                                <div className="w-12 h-12 border flex items-center justify-center mb-4 shadow-inner relative" style={{
                                    backgroundColor: COLORS.primary,
                                    borderColor: transaction.status === 'pending' ? 'rgba(96, 165, 250, 0.4)' : transaction.status === 'failed' ? 'rgba(239, 68, 68, 0.4)' : 'rgba(212, 175, 55, 0.3)'
                                }}>
                                    {transaction.status === 'pending' && <Clock size={22} style={{ color: 'rgba(96, 165, 250, 0.95)' }} className="relative z-10" />}
                                    {transaction.status === 'failed' && <XCircle size={22} style={{ color: 'rgba(239, 68, 68, 0.95)' }} className="relative z-10" />}
                                    {transaction.status === 'success' && <CheckCircle2 size={22} style={{ color: COLORS.gold }} className="relative z-10" />}
                                </div>
                                <p className="text-3xl font-light tracking-tighter tabular-nums" style={{ color: COLORS.accent }}>
                                    {isDebit ? '-' : '+'}{currencySymbol}{transaction.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </p>
                                <p className="text-[10px] font-bold uppercase tracking-[0.25em] mt-2" style={{ color: statusColor }}>
                                    {simpleStatus}
                                </p>
                            </div>

                            {/* Details Grid */}
                            <div className="grid grid-cols-2 gap-y-6 gap-x-4 mb-8">
                                <div className="space-y-1">
                                    <p className="text-[8px] font-bold uppercase tracking-[0.2em]" style={{ color: 'rgba(252, 249, 245, 0.4)' }}>Transfer Type</p>
                                    <div className="flex items-center gap-2">
                                        {transaction.routingProtocol === 'Domestic' && <Landmark size={12} style={{ color: 'rgba(212, 175, 55, 0.8)' }} />}
                                        {transaction.routingProtocol === 'International' && <Globe size={12} style={{ color: 'rgba(212, 175, 55, 0.8)' }} />}
                                        {transaction.routingProtocol === 'Offshore' && <Shield size={12} style={{ color: 'rgba(212, 175, 55, 0.8)' }} />}
                                        <p className="text-[10px] font-medium uppercase tracking-wider" style={{ color: COLORS.accent }}>{protocolDisplay}</p>
                                    </div>
                                </div>
                                <div className="space-y-1 text-right">
                                    <p className="text-[8px] font-bold uppercase tracking-[0.2em]" style={{ color: 'rgba(252, 249, 245, 0.4)' }}>Date</p>
                                    <p className="text-[10px] font-medium uppercase tracking-wider" style={{ color: COLORS.accent }}>
                                        {format(new Date(transaction.createdAt), 'MMM dd, yyyy')}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[8px] font-bold uppercase tracking-[0.2em]" style={{ color: 'rgba(252, 249, 245, 0.4)' }}>Reference ID</p>
                                    <p className="text-[10px] font-mono tracking-wider uppercase" style={{ color: 'rgba(212, 175, 55, 0.9)' }}>{transaction.referenceId}</p>
                                </div>
                                <div className="space-y-1 text-right">
                                    <p className="text-[8px] font-bold uppercase tracking-[0.2em]" style={{ color: 'rgba(252, 249, 245, 0.4)' }}>Recipient Account</p>
                                    <p className="text-[10px] font-medium uppercase tracking-wider truncate" style={{ color: COLORS.accent }}>{transaction.receiverAccountNumber}</p>
                                </div>
                                {transaction.receiverName && (
                                    <div className="space-y-1 col-span-2">
                                        <p className="text-[8px] font-bold uppercase tracking-[0.2em]" style={{ color: 'rgba(252, 249, 245, 0.4)' }}>Recipient Name</p>
                                        <p className="text-[10px] font-medium uppercase tracking-wider" style={{ color: COLORS.accent }}>{transaction.receiverName}</p>
                                    </div>
                                )}
                                <div className="space-y-1 col-span-2">
                                    <p className="text-[8px] font-bold uppercase tracking-[0.2em]" style={{ color: 'rgba(252, 249, 245, 0.4)' }}>Note</p>
                                    <p className="text-[10px] font-light leading-relaxed italic line-clamp-2" style={{ color: 'rgba(252, 249, 245, 0.7)' }}>"{transaction.description || 'Transfer'}"</p>
                                </div>
                            </div>

                            {/* Footer / Actions */}
                            <div className="pt-6 border-t" style={{ borderColor: 'rgba(212, 175, 55, 0.15)' }}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <ShieldCheck size={14} style={{ color: 'rgba(212, 175, 55, 0.6)' }} />
                                        <p className="text-[8px] font-bold uppercase tracking-[0.25em]" style={{ color: 'rgba(252, 249, 245, 0.4)' }}>Secure Bank Transfer</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={handleShare}
                                            className="p-2 transition-colors border border-transparent hover:border-gold/20 rounded-sm"
                                            style={{ color: 'rgba(252, 249, 245, 0.6)' }}
                                            title="Copy shareable receipt link"
                                        >
                                            <Share2 size={15} strokeWidth={1.5} />
                                        </button>
                                        <button
                                            onClick={handleDownloadPDF}
                                            className="p-2 px-3 transition-colors border border-transparent font-bold uppercase text-[9px] tracking-widest flex items-center gap-2 hover:border-gold/20 rounded-sm"
                                            style={{ color: 'rgba(252, 249, 245, 0.8)' }}
                                            title="Download PDF receipt"
                                        >
                                            <Download size={15} strokeWidth={1.5} />
                                            PDF
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}
