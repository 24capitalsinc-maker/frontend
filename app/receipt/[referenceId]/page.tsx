'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { format } from 'date-fns'
import { CheckCircle2, Clock, XCircle, Landmark, Globe, Shield, ShieldCheck } from 'lucide-react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

const COLORS = {
    primary: '#1a0d08',
    gold: '#d4af37',
    accent: '#fcf9f5',
}

interface ReceiptData {
    referenceId: string
    amount: number
    currency: string
    type: 'debit' | 'credit'
    status: 'pending' | 'success' | 'failed'
    routingProtocol: string
    receiverAccountNumber: string
    receiverName: string
    description?: string
    jurisdiction?: string
    createdAt: string
    detailLabel?: string
}

export default function PublicReceiptPage() {
    const params = useParams()
    const referenceId = params?.referenceId as string
    const [receipt, setReceipt] = useState<ReceiptData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        if (!referenceId) return
        fetch(`${API_URL}/transactions/receipt/${referenceId}`)
            .then(async (res) => {
                if (!res.ok) throw new Error('Receipt not found')
                return res.json()
            })
            .then((data) => setReceipt(data))
            .catch(() => setError('This receipt could not be found or may have expired.'))
            .finally(() => setLoading(false))
    }, [referenceId])

    if (loading) {
        return (
            <main style={{ backgroundColor: COLORS.primary }} className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-6">
                    <div className="w-10 h-10 border-2 rounded-full animate-spin" style={{ borderColor: COLORS.gold, borderTopColor: 'transparent' }} />
                    <p className="text-[10px] font-bold uppercase tracking-[0.4em] animate-pulse" style={{ color: COLORS.gold }}>
                        Retrieving Receipt…
                    </p>
                </div>
            </main>
        )
    }

    if (error || !receipt) {
        return (
            <main style={{ backgroundColor: COLORS.primary }} className="min-h-screen flex items-center justify-center p-6">
                <div className="flex flex-col items-center gap-6 text-center max-w-sm">
                    <div className="w-16 h-16 border flex items-center justify-center" style={{ borderColor: 'rgba(212,175,55,0.2)' }}>
                        <XCircle size={28} style={{ color: 'rgba(212,175,55,0.5)' }} />
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.4em]" style={{ color: COLORS.gold }}>Receipt Unavailable</p>
                    <p className="text-sm font-light" style={{ color: 'rgba(252,249,245,0.4)' }}>{error}</p>
                </div>
            </main>
        )
    }

    const isDebit = receipt.type === 'debit'
    const currencySymbol = receipt.currency === 'USD' ? '$' : receipt.currency === 'EUR' ? '€' : '£'
    const statusColor = receipt.status === 'success' ? COLORS.gold : receipt.status === 'pending' ? 'rgba(96,165,250,0.9)' : 'rgba(239,68,68,0.9)'
    const statusBorderColor = receipt.status === 'success' ? 'rgba(212,175,55,0.2)' : receipt.status === 'pending' ? 'rgba(96,165,250,0.3)' : 'rgba(239,68,68,0.3)'
    const statusText = receipt.status === 'pending' ? 'Pending // Awaiting Admin Approval' : receipt.status === 'failed' ? 'Failed // Transaction Rejected' : 'Settlement Authenticated'

    return (
        <main style={{ backgroundColor: COLORS.primary }} className="min-h-screen flex items-center justify-center p-4 md:p-8">
            <div className="w-full max-w-md">
                {/* Official Badge */}
                <div className="flex items-center justify-center gap-3 mb-8">
                    <div className="h-[1px] flex-1" style={{ backgroundColor: 'rgba(212,175,55,0.15)' }} />
                    <p className="text-[9px] font-bold uppercase tracking-[0.4em]" style={{ color: 'rgba(212,175,55,0.5)' }}>
                        Optima Nexgen
                    </p>
                    <div className="h-[1px] flex-1" style={{ backgroundColor: 'rgba(212,175,55,0.15)' }} />
                </div>

                {/* Receipt Card */}
                <div className="relative border overflow-hidden" style={{ backgroundColor: COLORS.primary, borderColor: 'rgba(212,175,55,0.2)' }}>
                    {/* Top gold bar */}
                    <div className="h-1 w-full" style={{ backgroundColor: COLORS.gold }} />

                    {/* Dot pattern bg */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(212,175,55,0.5) 1px, transparent 0)', backgroundSize: '32px 32px' }} />

                    <div className="p-8 md:p-12 relative z-10">
                        {/* Header */}
                        <div className="mb-8">
                            <p className="text-[8px] font-bold uppercase tracking-[0.4em] mb-2" style={{ color: 'rgba(212,175,55,0.5)' }}>Official Records</p>
                            <h1 className="text-3xl font-light tracking-tighter" style={{ color: COLORS.accent }}>
                                Transaction <span style={{ color: COLORS.gold }}>Receipt.</span>
                            </h1>
                        </div>

                        {/* Status + Amount */}
                        <div className="flex flex-col items-center justify-center py-8 mb-8 border-y" style={{ borderColor: 'rgba(212,175,55,0.08)', backgroundColor: 'rgba(212,175,55,0.02)' }}>
                            <div className="w-14 h-14 border flex items-center justify-center mb-5" style={{ borderColor: statusBorderColor, backgroundColor: COLORS.primary }}>
                                {receipt.status === 'pending' && <Clock size={24} style={{ color: statusColor }} />}
                                {receipt.status === 'success' && <CheckCircle2 size={24} style={{ color: statusColor }} />}
                                {receipt.status === 'failed' && <XCircle size={24} style={{ color: statusColor }} />}
                            </div>
                            <p className="text-4xl font-light tracking-tighter tabular-nums mb-3" style={{ color: COLORS.accent }}>
                                {isDebit ? '-' : '+'}{currencySymbol}{receipt.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </p>
                            <p className="text-[9px] font-bold uppercase tracking-[0.3em]" style={{ color: statusColor }}>
                                {statusText}
                            </p>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-2 gap-y-7 gap-x-4 mb-8">
                            <div className="space-y-1">
                                <p className="text-[8px] font-bold uppercase tracking-[0.2em]" style={{ color: 'rgba(252,249,245,0.2)' }}>Protocol</p>
                                <div className="flex items-center gap-2">
                                    {receipt.routingProtocol === 'Domestic' && <Landmark size={12} style={{ color: 'rgba(212,175,55,0.6)' }} />}
                                    {receipt.routingProtocol === 'International' && <Globe size={12} style={{ color: 'rgba(212,175,55,0.6)' }} />}
                                    {receipt.routingProtocol === 'Offshore' && <Shield size={12} style={{ color: 'rgba(212,175,55,0.6)' }} />}
                                    <p className="text-[10px] font-medium uppercase tracking-widest" style={{ color: COLORS.accent }}>{receipt.routingProtocol}</p>
                                </div>
                            </div>
                            <div className="space-y-1 text-right">
                                <p className="text-[8px] font-bold uppercase tracking-[0.2em]" style={{ color: 'rgba(252,249,245,0.2)' }}>Date</p>
                                <p className="text-[10px] font-medium uppercase tracking-widest" style={{ color: COLORS.accent }}>
                                    {format(new Date(receipt.createdAt), 'MMM dd, yyyy')}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[8px] font-bold uppercase tracking-[0.2em]" style={{ color: 'rgba(252,249,245,0.2)' }}>Reference ID</p>
                                <p className="text-[9px] font-mono tracking-widest uppercase" style={{ color: 'rgba(212,175,55,0.8)' }}>{receipt.referenceId}</p>
                            </div>
                            <div className="space-y-1 text-right">
                                <p className="text-[8px] font-bold uppercase tracking-[0.2em]" style={{ color: 'rgba(252,249,245,0.2)' }}>Beneficiary</p>
                                <p className="text-[10px] font-medium uppercase tracking-widest truncate" style={{ color: COLORS.accent }}>{receipt.receiverAccountNumber}</p>
                            </div>
                            <div className="space-y-1 col-span-2">
                                <p className="text-[8px] font-bold uppercase tracking-[0.2em]" style={{ color: 'rgba(252,249,245,0.2)' }}>Institutional Note</p>
                                <p className="text-[10px] font-light leading-relaxed italic" style={{ color: 'rgba(252,249,245,0.5)' }}>
                                    "{receipt.description || 'Institutional Distribution'}"
                                </p>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="pt-6 border-t flex items-center justify-between" style={{ borderColor: 'rgba(212,175,55,0.1)' }}>
                            <div className="flex items-center gap-2">
                                <ShieldCheck size={14} style={{ color: 'rgba(212,175,55,0.3)' }} />
                                <p className="text-[7px] font-bold uppercase tracking-[0.4em]" style={{ color: 'rgba(252,249,245,0.2)' }}>Vault Security Alpha-7</p>
                            </div>
                            <p className="text-[7px] font-bold uppercase tracking-[0.3em]" style={{ color: 'rgba(252,249,245,0.15)' }}>
                                {format(new Date(receipt.createdAt), 'HH:mm:ss')} UTC
                            </p>
                        </div>
                    </div>

                    {/* Security strip */}
                    <div className="py-2 px-8 border-t overflow-hidden whitespace-nowrap opacity-20" style={{ backgroundColor: 'rgba(212,175,55,0.03)', borderColor: 'rgba(212,175,55,0.1)' }}>
                        <span className="text-[6px] font-serif uppercase tracking-[1em]" style={{ color: 'rgba(212,175,55,0.3)' }}>
                            AUTH_TX_{receipt.referenceId.slice(-4).toUpperCase()}_SECURE_VAULT_ENCRYPTED_LEDGER_BUFFER
                        </span>
                    </div>
                </div>

                {/* Disclaimer */}
                <p className="text-center text-[8px] font-bold uppercase tracking-[0.3em] mt-8" style={{ color: 'rgba(252,249,245,0.1)' }}>
                    This receipt is an official record issued by Optima Nexgen Banking.
                </p>
            </div>
        </main>
    )
}
