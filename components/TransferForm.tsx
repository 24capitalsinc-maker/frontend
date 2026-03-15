'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import api from '@/lib/api'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, Globe, Shield, Landmark } from 'lucide-react'

const schema = z.object({
    receiverAccountNumber: z.string().min(5, 'Valid account number is required'),
    amount: z.number().min(1, 'Minimum transfer amount is $1'),
    description: z.string().optional().or(z.literal('')),
    currency: z.string(),
    routingProtocol: z.enum(['Domestic', 'International', 'Offshore']),
    swiftCode: z.string().optional().or(z.literal('')),
    iban: z.string().optional().or(z.literal('')),
    jurisdiction: z.string().optional().or(z.literal('')),
}).superRefine((data, ctx) => {
    if (data.routingProtocol !== 'Offshore') {
        if (!data.description || data.description.length < 3) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Payment reference is required (min 3 chars)',
                path: ['description'],
            });
        }
    }
    if (data.routingProtocol === 'International') {
        if (!data.swiftCode || data.swiftCode.length < 8) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Valid SWIFT/BIC code is required for International transfers',
                path: ['swiftCode'],
            });
        }
    }
});

type TransferFormData = z.infer<typeof schema>;

export default function TransferForm() {
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState('')
    const [protocol, setProtocol] = useState<'Domestic' | 'International' | 'Offshore'>('Domestic')
    const [refId, setRefId] = useState('')

    const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<TransferFormData>({
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

    const currentCurrency = watch('currency')

    useEffect(() => {
        setValue('routingProtocol', protocol)
    }, [protocol, setValue])

    const onSubmit = async (data: TransferFormData) => {
        setLoading(true)
        setError('')
        try {
            const payload = { ...data };
            if (payload.routingProtocol === 'Offshore' && (!payload.description || payload.description === '')) {
                payload.description = `Institutional Private Settlement // ${payload.jurisdiction || 'Zurich vault'}`;
            }

            const res = await api.post('/transactions/transfer', payload)
            setRefId(res.data.referenceId)
            setSuccess(true)
            setTimeout(() => {
                setSuccess(false)
                reset()
                setProtocol('Domestic')
                setRefId('')
            }, 8000)
        } catch (err: any) {
            setError(err.response?.data?.message || 'Transaction failed. Please verify beneficiary details.')
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-primary-light/10 border border-gold/20 p-20 flex flex-col items-center justify-center text-center space-y-10"
            >
                <div className="w-20 h-20 border border-gold/40 flex items-center justify-center rounded-sm bg-gold/5">
                    <span className="text-gold font-serif text-3xl">C</span>
                </div>
                <div className="space-y-4">
                    <h3 className="text-4xl font-light text-accent tracking-tighter">Transfer <span className="text-gold">Successful.</span></h3>
                    <p className="text-accent/60 font-medium max-w-sm mx-auto leading-relaxed text-sm">Your money is on the way. Funds will be settled shortly.</p>
                </div>
                <div className="h-[1px] w-24 bg-gold/20 mx-auto" />
                <p className="text-[10px] text-gold font-bold uppercase tracking-[0.4em]">Reference ID: {refId}</p>
            </motion.div>
        )
    }

    return (
        <div className="bg-primary-light/10 border border-gold/10 p-10 md:p-16 relative group overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

            <div className="mb-14">
                <p className="text-gold font-bold text-[10px] tracking-[0.4em] uppercase mb-4">Secure Money Transfer</p>
                <h3 className="text-3xl md:text-4xl font-light text-accent tracking-tighter mb-4">Send <span className="text-gold">Money.</span></h3>
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
                        <span className={`text-[10px] font-bold tracking-widest uppercase ${protocol === 'Domestic' ? 'text-gold' : 'text-accent/50'}`}>Domestic Transfer</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setProtocol('International')}
                        className={`p-6 border flex flex-col items-center gap-3 transition-all duration-500 ${protocol === 'International' ? 'border-gold bg-gold/10 shadow-[0_0_20px_rgba(203,161,110,0.1)]' : 'border-gold/10 hover:border-gold/30 bg-primary/50 opacity-40 hover:opacity-100'}`}
                    >
                        <Globe size={20} className={protocol === 'International' ? 'text-gold' : 'text-accent/50'} />
                        <span className={`text-[10px] font-bold tracking-widest uppercase ${protocol === 'International' ? 'text-gold' : 'text-accent/50'}`}>SWIFT / International</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setProtocol('Offshore')}
                        className={`p-6 border flex flex-col items-center gap-3 transition-all duration-500 ${protocol === 'Offshore' ? 'border-gold bg-gold/10 shadow-[0_0_20px_rgba(203,161,110,0.1)]' : 'border-gold/10 hover:border-gold/30 bg-primary/50 opacity-40 hover:opacity-100'}`}
                    >
                        <Shield size={20} className={protocol === 'Offshore' ? 'text-gold' : 'text-accent/50'} />
                        <span className={`text-[10px] font-bold tracking-widest uppercase ${protocol === 'Offshore' ? 'text-gold' : 'text-accent/50'}`}>Offshore Private</span>
                    </button>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-12 font-sans">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-4">
                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent/50 block">Recipient Account</label>
                        <input
                            {...register('receiverAccountNumber')}
                            className="w-full bg-transparent border-b border-gold/30 p-4 focus:border-gold outline-none transition-colors text-accent placeholder:text-accent/20 font-light text-xl tracking-wider"
                            placeholder={protocol === 'International' ? 'IBAN Required' : 'Account Number'}
                        />
                        {errors.receiverAccountNumber && <p className="text-red-400 text-[10px] font-bold uppercase tracking-wider mt-2">{errors.receiverAccountNumber.message}</p>}
                    </div>

                    <AnimatePresence mode="wait">
                        {protocol !== 'Domestic' && (
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
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="space-y-4">
                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent/50 block">Amount</label>
                        <div className="relative">
                            <span className="absolute left-0 bottom-4 text-2xl font-light text-gold/40">{currentCurrency === 'USD' ? '$' : currentCurrency === 'EUR' ? '€' : '£'}</span>
                            <input
                                type="number"
                                {...register('amount', { valueAsNumber: true })}
                                className="w-full bg-transparent border-b border-gold/30 pl-8 p-4 focus:border-gold outline-none transition-colors text-gold font-light text-4xl tracking-tighter tabular-nums"
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
                            <option value="USD">USD - United States Dollar</option>
                            <option value="EUR">EUR - Euro (SEPA)</option>
                            <option value="GBP">GBP - British Pound</option>
                            <option value="CHF">CHF - Swiss Franc</option>
                            <option value="SGD">SGD - Singapore Dollar</option>
                        </select>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent/50 block">
                            {protocol === 'Offshore' ? 'Settlement Jurisdiction' : 'Payment Reference'}
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
                                placeholder="Internal Distribution"
                            />
                        )}
                        {errors.description && <p className="text-red-400 text-[10px] font-bold uppercase tracking-wider mt-2">{errors.description.message}</p>}
                    </div>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-6 border border-red-500/30 bg-red-500/5 text-red-400 text-[10px] font-bold uppercase tracking-widest text-center"
                    >
                        {error}
                    </motion.div>
                )}

                <div className="pt-10 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-gold/10">
                    <div className="flex items-center gap-4">
                        <div className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse shadow-[0_0_10px_rgba(203,161,110,0.8)]" />
                        <div>
                            <p className="text-[8px] text-accent/30 font-bold uppercase tracking-[0.4em]">Transaction Status</p>
                            <p className="text-[10px] text-gold font-bold uppercase tracking-widest leading-none">Security Active</p>
                        </div>
                    </div>
                    <button
                        disabled={loading}
                        className="w-full md:w-auto bg-gold text-primary font-bold tracking-[0.3em] uppercase px-16 py-6 hover:bg-gold-dark transition-all transform hover:scale-[1.02] active:scale-[0.98] inline-flex items-center justify-center gap-4 disabled:opacity-50 shadow-2xl shadow-gold/20"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : 'Confirm Transfer'}
                    </button>
                </div>
            </form>
        </div>
    )
}
