'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion';
import { LayoutDashboard, Send, History, Settings, ShieldCheck } from 'lucide-react'
import { useAuthStore } from '@/store/useAuthStore'
import { usePathname } from 'next/navigation'
import { useSettingsStore } from '@/store/useSettingsStore'

export const dashboardLinks = [
    { name: 'Accounts Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Transfer Capital', href: '/transfer', icon: Send },
    { name: 'Financial Ledger', href: '/transactions', icon: History },
    { name: 'System Settings', href: '/settings', icon: Settings },
]

export default function Sidebar() {
    const { user } = useAuthStore()
    const { settings } = useSettingsStore()
    const pathname = usePathname()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const links = [...dashboardLinks]

    if (!mounted) {
        return (
            <aside className="w-80 bg-primary-light/10 border-r border-gold/10 min-h-[calc(100vh-100px)] p-10 hidden lg:block sticky top-24 self-start" />
        )
    }

    return (
        <aside className="w-80 bg-primary/40 backdrop-blur-3xl border-r border-gold/10 min-h-[calc(100vh-100px)] p-12 hidden lg:block sticky top-24 self-start">
            <div className="absolute inset-0 bg-silk opacity-5 pointer-events-none" />
            <div className="flex flex-col h-full relative z-10">
                <div className="flex-1 space-y-12">
                    <div className="flex flex-col gap-3 mb-12">
                        <div className="flex items-center gap-1">
                            <span className="text-gold font-sans text-xl font-light pr-0.5 leading-none">
                                {(settings?.logoText || 'Capital').charAt(0)}
                            </span>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-sans font-light tracking-[0.4em] text-accent uppercase leading-none">
                                    {settings?.logoText || 'Capital'}<span className="text-gold font-medium translate-x-0.5">{settings?.logoAccent || '24'}</span>
                                </span>
                                <span className="text-[5px] text-gold/40 uppercase tracking-[0.6em] font-bold mt-0.5">Digital Banking</span>
                            </div>
                        </div>
                        <div className="h-[1px] w-12 bg-gold/20" />
                    </div>
                    <ul className="space-y-6">
                        {links.map((link) => {
                            const isActive = pathname === link.href
                            return (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className={`group flex items-center gap-6 py-4 transition-all duration-700 relative ${isActive
                                            ? 'text-gold'
                                            : 'text-accent/30 hover:text-accent'
                                            }`}
                                    >
                                        <link.icon size={16} strokeWidth={1} className={isActive ? 'text-gold' : 'group-hover:text-gold transition-colors duration-700'} />
                                        <span className="text-[10px] tracking-[0.3em] font-bold uppercase">{link.name}</span>
                                        {isActive && (
                                            <motion.div layoutId="activeNav" className="absolute -left-12 w-[2px] h-8 bg-gold shadow-[0_0_15px_rgba(212,175,55,0.5)]" />
                                        )}
                                    </Link>
                                </li>
                            )
                        })}
                    </ul>
                </div>

                {/* Account Status */}
                <div className="mt-20 pt-12 border-t border-gold/10 relative">
                    <div className="absolute top-0 left-0 w-12 h-[1px] bg-gold/40" />
                    <div className="flex items-center gap-6 group cursor-help">
                        <div className="w-12 h-12 bg-primary/40 border border-gold/20 flex items-center justify-center transition-all duration-700 group-hover:border-gold shadow-inner">
                            <ShieldCheck size={18} className="text-gold/40 group-hover:text-gold transition-colors duration-700" strokeWidth={1} />
                        </div>
                        <div>
                            <p className="text-[8px] text-accent/20 uppercase font-bold tracking-[0.4em] mb-1">Security Status</p>
                            <p className="text-[10px] text-gold font-bold uppercase tracking-[0.2em]">Verified Connection</p>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    )
}
