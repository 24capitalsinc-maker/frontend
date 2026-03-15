import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, Copy, Check } from 'lucide-react'
import { useState } from 'react'

interface DashboardCardProps {
    title: string
    value: string | number
    icon: any
    subtitle?: string
    isSensitive?: boolean
    isVisible?: boolean
    onToggle?: () => void
    isCopyable?: boolean
}

export default function DashboardCard({
    title,
    value,
    icon: Icon,
    subtitle,
    isSensitive,
    isVisible,
    onToggle,
    isCopyable
}: DashboardCardProps) {
    const [copied, setCopied] = useState(false)

    const handleCopy = (e: React.MouseEvent) => {
        e.stopPropagation()
        navigator.clipboard.writeText(String(value))
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true as const }}
            transition={{ duration: 1 }}
            className="group"
        >
            <div className="bg-primary/40 backdrop-blur-3xl border border-gold/20 p-10 h-full relative overflow-hidden transition-all duration-1000 hover:border-gold/50 shadow-2xl group-hover:bg-primary/60">
                {/* Prestige Textures */}
                <div className="absolute inset-0 bg-silk opacity-10 pointer-events-none" />
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full blur-3xl -mr-16 -mt-16 transition-all duration-1000 group-hover:bg-gold/15" />

                {/* Architectural Accents */}
                <div className="absolute top-0 left-0 w-16 h-[1px] bg-gold/20" />
                <div className="absolute top-0 left-0 w-[1px] h-16 bg-gold/20" />

                <div className="flex justify-between items-start relative z-10 mb-10">
                    <div>
                        <p className="text-[10px] uppercase font-bold tracking-[0.3em] text-accent/40 group-hover:text-gold transition-colors duration-700">{title}</p>
                    </div>
                    <div className="flex items-center gap-4">
                        {isSensitive && onToggle && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onToggle();
                                }}
                                className="w-8 h-8 rounded-full border border-gold/10 flex items-center justify-center hover:bg-gold/10 hover:border-gold/30 transition-all duration-500 text-gold/40 hover:text-gold"
                                title={isVisible ? "Hide details" : "Show details"}
                            >
                                {isVisible ? <EyeOff size={14} /> : <Eye size={14} />}
                            </button>
                        )}
                        <div className="w-12 h-12 bg-primary/40 border border-gold/10 flex items-center justify-center transition-all duration-1000 group-hover:border-gold group-hover:rotate-[360deg] shadow-inner">
                            <Icon size={18} className="text-gold/40 group-hover:text-gold transition-colors duration-700" strokeWidth={1} />
                        </div>
                    </div>
                </div>

                <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-4">
                        <AnimatePresence mode="wait">
                            <motion.h3
                                key={isVisible ? 'visible' : 'hidden'}
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                transition={{ duration: 0.3 }}
                                className="text-4xl font-medium text-accent tracking-tighter transition-all duration-700 group-hover:tracking-normal"
                            >
                                {isSensitive && !isVisible ? "••••••••" : value}
                            </motion.h3>
                        </AnimatePresence>
                        {isCopyable && (!isSensitive || isVisible) && (
                            <button
                                onClick={handleCopy}
                                className="p-2 text-gold/30 hover:text-gold transition-colors"
                                title="Copy to clipboard"
                            >
                                {copied ? <Check size={16} /> : <Copy size={16} />}
                            </button>
                        )}
                    </div>
                    {subtitle && (
                        <div className="flex items-center gap-3">
                            <div className="h-[1px] w-6 bg-gold/20" />
                            <p className="text-[10px] uppercase font-bold tracking-[0.1em] text-gold/50">{subtitle}</p>
                        </div>
                    )}
                </div>

                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
                    <div className="text-[9px] text-gold/30 font-mono tracking-widest uppercase">Verified Ledger</div>
                </div>
            </div>
        </motion.div>
    )
}
