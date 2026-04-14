'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion';
import { LayoutDashboard, Send, History, Settings, ShieldCheck, LogOut } from 'lucide-react'
import { useAuthStore } from '@/store/useAuthStore'
import { usePathname, useRouter } from 'next/navigation'
import { useSettingsStore } from '@/store/useSettingsStore'

export const dashboardLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Transfer', href: '/transfer', icon: Send },
    { name: 'History', href: '/transactions', icon: History },
    { name: 'Settings', href: '/settings', icon: Settings },
]

export default function Sidebar() {
    const { user, logout } = useAuthStore()
    const { settings } = useSettingsStore()
    const pathname = usePathname()
    const router = useRouter()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const links = [...dashboardLinks]

    if (!mounted) {
        return (
            <aside className="w-80 bg-primary-light/10 border-r border-gold/10 min-h-[calc(100vh-80px)] p-10 hidden lg:block sticky top-20 self-start" />
        )
    }

    return (
        <aside className="w-64 bg-primary/40 backdrop-blur-3xl border-r border-gold/10 h-[calc(100vh-80px)] overflow-y-auto no-scrollbar p-10 hidden lg:block fixed top-20 left-0 z-30">
            <div className="absolute inset-0 bg-silk opacity-5 pointer-events-none" />
            <div className="flex flex-col h-full relative z-10">
                <div className="flex-1 space-y-12">
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

                        {/* Logout Action */}
                        <li>
                            <button
                                onClick={() => {
                                    logout();
                                    router.push('/login');
                                }}
                                className="w-full group flex items-center gap-6 py-4 text-accent/30 hover:text-red-500/80 transition-all duration-700 relative"
                            >
                                <LogOut size={16} strokeWidth={1} className="group-hover:text-red-500 transition-colors duration-700" />
                                <span className="text-[10px] tracking-[0.3em] font-bold uppercase">Logout</span>
                            </button>
                        </li>
                    </ul>
                </div>

                {/* Account Identity */}
                <div className="mt-20 pt-12 border-t border-gold/10 relative">
                    <div className="absolute top-0 left-0 w-12 h-[1px] bg-gold/40" />
                    <div className="flex items-center gap-6 group">
                        <div className="w-12 h-12 rounded-full bg-primary/40 border border-gold/20 flex items-center justify-center transition-all duration-700 group-hover:border-gold shadow-inner overflow-hidden relative">
                            {user?.profileImage ? (
                                <img
                                    src={user.profileImage}
                                    className="w-full h-full object-cover"
                                    alt={user.name}
                                />
                            ) : (
                                <span className="text-[10px] text-gold font-bold uppercase tracking-widest">
                                    {user?.name?.split(' ').map(n => n[0]).join('').substring(0, 2)}
                                </span>
                            )}
                        </div>
                        <div className="min-w-0">
                            <p className="text-[8px] text-accent/20 uppercase font-bold tracking-[0.4em] mb-1 truncate">{user?.name || 'Institutional Client'}</p>
                            <p className="text-[10px] text-gold font-bold uppercase tracking-[0.2em] animate-pulse">Identity Verified</p>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    )
}
