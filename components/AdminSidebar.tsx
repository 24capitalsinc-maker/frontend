'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion';
import { ShieldCheck, Users, Activity, Landmark, Gavel } from 'lucide-react'
import { usePathname } from 'next/navigation'

export const adminLinks = [
    { name: 'Admin Home', href: '/admin', icon: ShieldCheck },
    { name: 'Manage Users', href: '/admin/users', icon: Users },
    { name: 'All Transactions', href: '/admin/transactions', icon: Activity },
    { name: 'Liquidity Levels', href: '/admin/liquidity', icon: Landmark },
    { name: 'System Settings', href: '/admin/governance', icon: Gavel },
]

export default function AdminSidebar() {
    const pathname = usePathname()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const links = [...adminLinks]

    if (!mounted) {
        return (
            <aside className="w-80 bg-red-950/5 border-r border-red-500/10 min-h-[calc(100vh-100px)] p-10 hidden lg:block sticky top-24 self-start" />
        )
    }

    return (
        <aside className="w-80 bg-red-950/5 border-r border-red-500/10 min-h-[calc(100vh-100px)] p-10 hidden lg:block sticky top-24 self-start">
            <div className="flex flex-col h-full">
                <div className="flex-1 space-y-10">
                    <div className="flex flex-col gap-2 mb-10">
                        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-red-400/50">Admin Control</p>
                        <div className="h-[1px] w-8 bg-red-400/30" />
                    </div>
                    <ul className="space-y-4">
                        {links.map((link) => {
                            const isActive = pathname === link.href
                            return (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className={`group flex items-center gap-5 py-4 transition-all duration-500 relative ${isActive
                                            ? 'text-red-400'
                                            : 'text-accent/40 hover:text-red-400/80'
                                            }`}
                                    >
                                        <link.icon size={18} strokeWidth={1.5} className={isActive ? 'text-red-400' : 'group-hover:text-red-400 transition-colors duration-500'} />
                                        <span className="text-[10px] tracking-[0.3em] font-bold uppercase">{link.name}</span>
                                        {isActive && (
                                            <motion.div layoutId="activeAdminNav" className="absolute -left-10 w-1 h-8 bg-red-500" />
                                        )}
                                    </Link>
                                </li>
                            )
                        })}
                    </ul>
                </div>

                {/* Secure Status */}
                <div className="mt-20 pt-10 border-t border-red-500/10 relative">
                    <div className="absolute top-0 left-0 w-8 h-[1px] bg-red-500" />
                    <div className="flex items-center gap-4">
                        <div className="w-11 h-11 bg-red-500/5 border border-red-500/20 flex items-center justify-center rounded-sm shadow-[0_0_15px_rgba(239,68,68,0.1)]">
                            <ShieldCheck size={18} className="text-red-500/60" strokeWidth={1.2} />
                        </div>
                        <div>
                            <p className="text-[9px] text-red-400/20 uppercase font-bold tracking-[0.3em] mb-1">Access Level</p>
                            <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest animate-pulse">Administrator Mode</p>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    )
}
