'use client'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Check } from 'lucide-react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export interface Option {
    value: string
    label: string
    icon?: React.ReactNode
}

interface SmoothSelectProps {
    options: Option[]
    value: string
    onChange: (value: string) => void
    label?: string
    placeholder?: string
    className?: string
    icon?: React.ReactNode
}

export default function SmoothSelect({
    options,
    value,
    onChange,
    label,
    placeholder = 'Select an option',
    className,
    icon: TriggerIcon
}: SmoothSelectProps) {
    const [isOpen, setIsOpen] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)
    const activeOption = options.find(opt => opt.value === value)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <div className={cn("space-y-4 relative w-full", className)} ref={containerRef}>
            {label && (
                <div className="flex items-center gap-3 text-gold/40 mb-2">
                    {TriggerIcon}
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em]">{label}</label>
                </div>
            )}

            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between bg-primary/20 border-b border-gold/20 p-4 focus:border-gold outline-none transition-all group"
            >
                <div className="flex items-center gap-4">
                    {activeOption?.icon && <div className="text-gold/60">{activeOption.icon}</div>}
                    <span className={cn(
                        "text-lg font-light tracking-tight transition-colors",
                        activeOption ? "text-accent" : "text-accent/20"
                    )}>
                        {activeOption ? activeOption.label : placeholder}
                    </span>
                </div>
                <ChevronDown
                    size={16}
                    className={cn(
                        "text-gold/40 transition-transform duration-500",
                        isOpen && "rotate-180 text-gold"
                    )}
                />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                        className="absolute z-[300] left-0 right-0 mt-2 bg-primary/95 backdrop-blur-3xl border border-gold/10 shadow-2xl overflow-hidden"
                    >
                        <div className="py-2 max-h-[300px] overflow-y-auto no-scrollbar">
                            {options.map((option, index) => (
                                <motion.button
                                    key={option.value}
                                    type="button"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.03 }}
                                    onClick={() => {
                                        onChange(option.value)
                                        setIsOpen(false)
                                    }}
                                    className={cn(
                                        "w-full flex items-center justify-between px-6 py-4 transition-all hover:bg-gold/10 group/item",
                                        value === option.value ? "bg-gold/5" : "bg-transparent"
                                    )}
                                >
                                    <div className="flex items-center gap-4 text-left">
                                        {option.icon && <div className="text-gold/40 group-hover/item:text-gold transition-colors">{option.icon}</div>}
                                        <span className={cn(
                                            "text-sm tracking-[0.1em] transition-colors uppercase font-medium",
                                            value === option.value ? "text-gold" : "text-accent/60 group-hover/item:text-accent"
                                        )}>
                                            {option.label}
                                        </span>
                                    </div>
                                    {value === option.value && (
                                        <Check size={14} className="text-gold" />
                                    )}
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
