'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import api from '@/lib/api'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, Globe, Shield, Landmark, AlertCircle, CheckCircle2, ArrowRight, ShieldCheck, Info } from 'lucide-react'
import ReceiptModal from './ReceiptModal'

const schema = z.object({
    receiverAccountNumber: z.string().min(5, 'Valid account number is required'),
    amount: z.number().min(1, 'Minimum transfer amount is $1'),
    description: z.string().optional().or(z.literal('')),
    currency: z.string(),
    routingProtocol: z.enum(['Domestic', 'Other', 'Offshore']),
    swiftCode: z.string().optional().or(z.literal('')),
    iban: z.string().optional().or(z.literal('')),
    jurisdiction: z.string().optional().or(z.literal('')),
}).superRefine((data, ctx) => {
    if (data.routingProtocol === 'Other') {
        if (!data.swiftCode || data.swiftCode.length < 8) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Valid SWIFT/BIC code is required for Other Banks',
                path: ['swiftCode'],
            });
        }
    }
});

type TransferFormData = z.infer<typeof schema>;

export default function TransferForm() {
    const [loading, setLoading] = useState(false)
    const [step, setStep] = useState<'input' | 'confirm' | 'processing'>('input')
    const [receiptData, setReceiptData] = useState<any>(null)
    const [showReceipt, setShowReceipt] = useState(false)
    const [error, setError] = useState('')
    const [protocol, setProtocol] = useState<'Domestic' | 'Other' | 'Offshore'>('Domestic')

    const { register, handleSubmit, reset, setValue, watch, trigger, formState: { errors } } = useForm<TransferFormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            receiverAccountNumber: '',
            amount: 0,
            routingProtocol: 'Domestic',
            currency: 'USD',
            description: '',
            swiftCode: '',
            iban: '',
            jurisdiction: 'Zurich'
        }
    })

    const formData = watch()
    const currentCurrency = watch('currency')

    useEffect(() => {
        setValue('routingProtocol', protocol)
    }, [protocol, setValue])

    const handleInitialSubmit = async () => {
        const isValid = await trigger()
        if (isValid) {
            setStep('confirm')
        }
    }

    const executeTransfer = async () => {
        setLoading(true)
        setError('')
        try {
            const data = formData
            const payload = {
                ...data,
                // Map frontend 'Other' back to 'International' if backend expects it, 
                // but let's assume we update backend or keep it as matches.
                // Re-checking backend enum: ['Domestic', 'International', 'Offshore']
                routingProtocol: data.routingProtocol === 'Other' ? 'International' : data.routingProtocol
            };

            if (payload.routingProtocol === 'Offshore' && (!payload.description || payload.description === '')) {
                payload.description = `Institutional Private Settlement // ${payload.jurisdiction || 'Secure Vault'}`;
            }

            const res = await api.post('/transactions/transfer', payload)

            // Start the 4-second delay as requested
            setStep('processing')

            setTimeout(() => {
                setReceiptData(res.data)
                setShowReceipt(true)
                setStep('input')
                reset()
                setProtocol('Domestic')
                setLoading(false)
            }, 4000)

        } catch (err: any) {
            setError(err.response?.data?.message || 'Transaction failed. Please verify beneficiary details.')
            setStep('input')
            setLoading(false)
        }
    }

    if (step === 'confirm') {
        return (
            <div className="bg-primary/40 backdrop-blur-3xl border border-gold/20 p-10 md:p-16 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                <div className="mb-12">
                    <p className="text-gold font-bold text-[10px] tracking-[0.4em] uppercase mb-4">Verification Phase</p>
                    <h3 className="text-3xl md:text-4xl font-light text-accent tracking-tighter mb-4">Confirm <span className="text-gold">Transfer.</span></h3>
                    <div className="h-[1px] w-full bg-gold/10 mt-6" />
                </div>

                <div className="space-y-8 mb-12">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 py-6 border-b border-gold/5">
                        <div className="space-y-1">
                            <p className="text-[9px] text-accent/30 font-bold uppercase tracking-[0.3em]">Protocol</p>
                            <p className="text-accent font-medium tracking-widest">{protocol === 'Domestic' ? 'Domestic / Same Bank' : protocol === 'Other' ? 'Other Banks' : 'Offshore'}</p>
                        </div>
                        <div className="space-y-1 text-left sm:text-right">
                            <p className="text-[9px] text-accent/30 font-bold uppercase tracking-[0.3em]">Amount</p>
                            <p className="text-xl sm:text-2xl font-light text-gold tracking-tight">{currentCurrency} {formData.amount.toLocaleString()}</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 py-6 border-b border-gold/5">
                        <div className="space-y-1">
                            <p className="text-[9px] text-accent/30 font-bold uppercase tracking-[0.3em]">Beneficiary Account</p>
                            <p className="text-accent font-medium tracking-widest">{formData.receiverAccountNumber}</p>
                        </div>
                        {formData.swiftCode && (
                            <div className="space-y-1 text-right">
                                <p className="text-[9px] text-accent/30 font-bold uppercase tracking-[0.3em]">SWIFT / BIC</p>
                                <p className="text-accent font-medium tracking-widest uppercase">{formData.swiftCode}</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-gold/5 border border-gold/10 p-6 flex items-start gap-4 mb-12">
                    <Info size={16} className="text-gold mt-1" />
                    <p className="text-[10px] text-accent/60 leading-relaxed font-light">
                        By confirming this transaction, you authorize the immediate allocation of capital from your institutional vault to the specified beneficiary. This action is recorded on the permanent financial ledger.
                    </p>
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                    <button
                        onClick={() => setStep('input')}
                        className="flex-1 border border-gold/20 text-accent/60 font-bold tracking-[0.2em] uppercase py-5 hover:bg-gold/5 transition-all text-[10px]"
                    >
                        Back to Edit
                    </button>
                    <button
                        onClick={executeTransfer}
                        disabled={loading}
                        className="flex-[2] bg-gold text-primary font-bold tracking-[0.3em] uppercase py-5 hover:bg-gold-dark transition-all flex items-center justify-center gap-3 shadow-2xl shadow-gold/20 text-[10px]"
                    >
                        {loading ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
                        Execute Settlement
                    </button>
                </div>
            </div>
        )
    }

    if (step === 'processing') {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-primary/40 backdrop-blur-3xl border border-gold/20 p-20 flex flex-col items-center justify-center text-center space-y-12 min-h-[500px]"
            >
                <div className="relative">
                    <div className="w-24 h-24 border border-gold/20 rounded-full animate-[spin_4s_linear_infinite] flex items-center justify-center">
                        <div className="w-2 h-2 bg-gold rounded-full absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-[0_0_15px_rgba(212,175,55,1)]" />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Landmark size={32} className="text-gold/20" />
                    </div>
                </div>
                <div className="space-y-6">
                    <p className="text-gold font-bold text-[10px] tracking-[0.5em] uppercase animate-pulse">Routing Protocol Active</p>
                    <h3 className="text-3xl font-light text-accent tracking-tighter">Your transfer is <span className="text-gold">on the way.</span></h3>
                    <p className="text-accent/30 text-xs font-light max-w-xs mx-auto leading-relaxed">Securing institutional rails and authenticating multi-party settlement credentials…</p>
                </div>
            </motion.div>
        )
    }

    return (
        <div className="bg-primary-light/10 border border-gold/10 p-10 md:p-16 relative group overflow-hidden transition-all duration-1000 hover:border-gold/30">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

            <ReceiptModal
                isOpen={showReceipt}
                onClose={() => setShowReceipt(false)}
                transaction={receiptData}
            />

            <div className="mb-14">
                <p className="text-gold font-bold text-[10px] tracking-[0.4em] uppercase mb-4">Secure Funds Transfer</p>
                <h3 className="text-3xl md:text-4xl font-light text-accent tracking-tighter mb-4">Transfer <span className="text-gold">Funds.</span></h3>
                <div className="h-[1px] w-full bg-gold/10 mt-6" />
            </div>

            <div className="mb-14">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent/50 block mb-6">Transfer Type</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                        type="button"
                        onClick={() => setProtocol('Domestic')}
                        className={`p-6 border flex flex-col items-center gap-3 transition-all duration-500 ${protocol === 'Domestic' ? 'border-gold bg-gold/10 shadow-[0_0_20px_rgba(203,161,110,0.1)]' : 'border-gold/10 hover:border-gold/30 bg-primary/50 opacity-40 hover:opacity-100'}`}
                    >
                        <Landmark size={20} className={protocol === 'Domestic' ? 'text-gold' : 'text-accent/50'} />
                        <span className={`text-[9px] font-bold tracking-widest uppercase text-center ${protocol === 'Domestic' ? 'text-gold' : 'text-accent/50'}`}>Domestic / Same Bank</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setProtocol('Other')}
                        className={`p-6 border flex flex-col items-center gap-3 transition-all duration-500 ${protocol === 'Other' ? 'border-gold bg-gold/10 shadow-[0_0_20px_rgba(203,161,110,0.1)]' : 'border-gold/10 hover:border-gold/30 bg-primary/50 opacity-40 hover:opacity-100'}`}
                    >
                        <Globe size={20} className={protocol === 'Other' ? 'text-gold' : 'text-accent/50'} />
                        <span className={`text-[9px] font-bold tracking-widest uppercase text-center ${protocol === 'Other' ? 'text-gold' : 'text-accent/50'}`}>Other Banks</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setProtocol('Offshore')}
                        className={`p-6 border flex flex-col items-center gap-3 transition-all duration-500 ${protocol === 'Offshore' ? 'border-gold bg-gold/10 shadow-[0_0_20px_rgba(203,161,110,0.1)]' : 'border-gold/10 hover:border-gold/30 bg-primary/50 opacity-40 hover:opacity-100'}`}
                    >
                        <Shield size={20} className={protocol === 'Offshore' ? 'text-gold' : 'text-accent/50'} />
                        <span className={`text-[9px] font-bold tracking-widest uppercase text-center ${protocol === 'Offshore' ? 'text-gold' : 'text-accent/50'}`}>Offshore Private</span>
                    </button>
                </div>
            </div>

            <form onSubmit={handleSubmit(handleInitialSubmit)} className="space-y-12 font-sans">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-4">
                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent/50 block">Recipient Account Number</label>
                        <input
                            {...register('receiverAccountNumber')}
                            className="w-full bg-transparent border-b border-gold/30 p-4 focus:border-gold outline-none transition-colors text-accent placeholder:text-accent/20 font-light text-lg sm:text-xl tracking-wider"
                            placeholder="0000 0000 0000"
                        />
                        {errors.receiverAccountNumber && <p className="text-red-400 text-[10px] font-bold uppercase tracking-wider mt-2">{errors.receiverAccountNumber.message}</p>}
                    </div>

                    <AnimatePresence mode="wait">
                        {protocol === 'Other' && (
                            <motion.div
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                className="space-y-4"
                            >
                                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent/50 block">SWIFT / BIC Code</label>
                                <input
                                    {...register('swiftCode')}
                                    className="w-full bg-transparent border-b border-gold/30 p-4 focus:border-gold outline-none transition-colors text-accent placeholder:text-accent/20 font-light text-xl tracking-wider uppercase"
                                    placeholder="CAP24XXX"
                                />
                                {errors.swiftCode && <p className="text-red-400 text-[10px] font-bold uppercase tracking-wider mt-2">{errors.swiftCode.message}</p>}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="space-y-4">
                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent/50 block">Amount</label>
                        <div className="relative">
                            <span className="absolute left-0 bottom-4 text-xl sm:text-2xl font-light text-gold/40">{currentCurrency === 'USD' ? '$' : currentCurrency === 'EUR' ? '€' : '£'}</span>
                            <input
                                type="number"
                                {...register('amount', { valueAsNumber: true })}
                                className="w-full bg-transparent border-b border-gold/30 pl-8 p-4 focus:border-gold outline-none transition-colors text-gold font-light text-2xl sm:text-4xl tracking-tighter tabular-nums"
                                placeholder="0.00"
                            />
                        </div>
                        {errors.amount && <p className="text-red-400 text-[10px] font-bold uppercase tracking-wider mt-2">{errors.amount.message}</p>}
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent/50 block">Currency</label>
                        <select
                            {...register('currency')}
                            className="w-full select-institutional bg-transparent border-b border-gold/30 p-4 focus:border-gold outline-none transition-colors text-accent font-light text-xl cursor-pointer"
                        >
                            <option value="USD">USD - US Dollar</option>
                            <option value="EUR">EUR - Euro (SEPA)</option>
                            <option value="GBP">GBP - British Pound</option>
                            <option value="CHF">CHF - Swiss Franc</option>
                            <option value="SGD">SGD - Singapore Dollar</option>
                        </select>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent/50 block">
                            {protocol === 'Offshore' ? 'Settlement Jurisdiction' : 'Transfer Note (Optional)'}
                        </label>
                        {protocol === 'Offshore' ? (
                            <select
                                {...register('jurisdiction')}
                                className="w-full select-institutional bg-transparent border-b border-gold/30 p-4 focus:border-gold outline-none transition-colors text-accent font-light text-xl cursor-pointer"
                            >
                                <option value="Zurich">Zurich, Switzerland</option>
                                <option value="Cayman">Cayman Islands</option>
                                <option value="Singapore">Singapore Terminal</option>
                                <option value="Luxembourg">Luxembourg Vault</option>
                            </select>
                        ) : (
                            <input
                                {...register('description')}
                                className="w-full bg-transparent border-b border-gold/30 p-4 focus:border-gold outline-none transition-colors text-accent placeholder:text-accent/20 font-light text-xl"
                                placeholder="Distribution Reference"
                            />
                        )}
                    </div>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-6 border border-red-500/30 bg-red-500/5 text-red-400 text-[10px] font-bold uppercase tracking-widest text-center flex items-center justify-center gap-3"
                    >
                        <AlertCircle size={14} />
                        {error}
                    </motion.div>
                )}

                <div className="pt-10 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-gold/10">
                    <div className="flex items-center gap-4">
                        <div className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse shadow-[0_0_10px_rgba(203,161,110,0.8)]" />
                        <div>
                            <p className="text-[8px] text-accent/30 font-bold uppercase tracking-[0.4em]">Protocol Protocol</p>
                            <p className="text-[10px] text-gold font-bold uppercase tracking-widest leading-none">AES-256 Auth Active</p>
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full md:w-auto bg-gold text-primary font-bold tracking-[0.3em] uppercase px-16 py-6 hover:bg-gold-dark transition-all transform hover:scale-[1.02] active:scale-[0.98] inline-flex items-center justify-center gap-4 disabled:opacity-50 shadow-2xl shadow-gold/20 text-[10px]"
                    >
                        Initialize Transfer <ArrowRight size={16} />
                    </button>
                </div>
            </form>
        </div>
    )
}
