'use client'
import Link from 'next/link'
import { useAuthStore } from '@/store/useAuthStore'
import { LogOut, User as UserIcon, Menu, X, ChevronRight } from 'lucide-react'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { dashboardLinks } from './Sidebar'
import { adminLinks } from './AdminSidebar'
import { useSettingsStore } from '@/store/useSettingsStore'

export default function Navbar() {
    const { user, logout } = useAuthStore()
    const { settings, fetchSettings } = useSettingsStore()
    const [mounted, setMounted] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const pathname = usePathname()

    useEffect(() => {
        setMounted(true)
        fetchSettings()
        const handleScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const navLinks = [
        { label: 'Home', href: '/' },
        { label: 'Business', href: '/business' },
        { label: 'Personal', href: '/personal' },
        { label: 'Cards', href: '/cards' },
        { label: 'Loans', href: '/loans' },
        { label: 'Support', href: '/support' },
    ]

    const isDashboard = pathname.startsWith('/dashboard') || pathname.startsWith('/transfer') || pathname.startsWith('/transactions') || pathname.startsWith('/settings')
    const isAdmin = pathname.startsWith('/admin')

    const isActive = (href: string) => {
        if (href === '/') return pathname === '/'
        return pathname.startsWith(href)
    }

    return (
        <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-1000 ${scrolled ? 'py-4 bg-primary/80 backdrop-blur-2xl border-b border-gold/10' : 'py-5 bg-transparent'
            }`}>
            <div className="absolute inset-0 bg-silk opacity-5 pointer-events-none" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 flex justify-between items-center relative z-10 w-full">
                {/* Left: Branding */}
                <div className="flex-1 flex justify-start items-center gap-8">
                    <Link href="/" className="flex items-center gap-4 group">
                        {mounted && settings?.logoUrl ? (
                            <img src={settings.logoUrl} alt={settings.companyName} className="h-10 w-auto object-contain transition-transform duration-700 group-hover:scale-105" />
                        ) : (
                            <>
                                <div className="w-12 h-12 border border-gold/20 flex items-center justify-center bg-gold/5 group-hover:border-gold/50 transition-colors duration-700">
                                    <span className="text-gold font-sans text-3xl font-light pr-1 leading-none">
                                        {(settings?.logoText || 'Capital').charAt(0)}
                                    </span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xl font-sans font-light tracking-[0.4em] text-accent uppercase leading-none">
                                        {settings?.logoText || 'Capital'}<span className="text-gold font-medium translate-x-1">{settings?.logoAccent || '24'}</span>
                                    </span>
                                    <span className="text-[7px] text-gold/40 uppercase tracking-[0.6em] font-bold mt-1">Digital Banking</span>
                                </div>
                            </>
                        )}
                    </Link>
                    {isDashboard ? (
                        <div className="hidden md:flex items-center gap-4">
                            <div className="h-[30px] w-px bg-gold/10"></div>
                            <span className="text-[9px] font-bold text-gold uppercase tracking-[0.5em] px-4 py-2 bg-gold/5 border border-gold/10">Executive Portal</span>
                        </div>
                    ) : null}
                </div>

                {/* Center: Desktop Nav Links */}
                <div className="flex-none hidden xl:flex justify-center items-center">
                    {!isDashboard && !isAdmin && (
                        <div className="flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase font-bold">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`px-5 py-2 transition-all duration-500 relative group ${isActive(link.href)
                                        ? 'text-gold'
                                        : 'text-accent/40 hover:text-accent'
                                        }`}
                                >
                                    {link.label}
                                    {/* Active underline indicator */}
                                    <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 h-[1px] bg-gold/60 transition-all duration-700 ${isActive(link.href) ? 'w-8' : 'w-0 group-hover:w-4'
                                        }`} />
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right: Desktop Auth & User Profile */}
                <div className="flex-1 hidden xl:flex justify-end items-center">
                    {mounted && (user ? (
                        <div className="flex items-center gap-8">
                            <Link href="/dashboard" className="text-[10px] font-bold tracking-[0.3em] uppercase text-accent hover:text-gold transition-all duration-500 flex items-center gap-3 group">
                                <div className="w-8 h-8 rounded-full border border-gold/20 flex items-center justify-center group-hover:border-gold transition-colors">
                                    <UserIcon size={14} className="text-gold" />
                                </div>
                                <span className="">{user.name}</span>
                            </Link>
                            <button
                                onClick={logout}
                                className="text-accent/30 hover:text-red-500/80 transition-all duration-500 hover:scale-110"
                            >
                                <LogOut size={18} strokeWidth={1.5} />
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-6">
                            <Link href="/login" className="text-[10px] font-bold tracking-[0.4em] uppercase text-accent/50 hover:text-gold transition-all duration-500 whitespace-nowrap">
                                Sign In
                            </Link>
                            <Link
                                href="/verify"
                                className="group relative bg-gold text-primary px-8 py-3 font-bold tracking-[0.2em] uppercase text-[10px] overflow-hidden shadow-2xl shadow-gold/10 whitespace-nowrap"
                            >
                                <span className="relative z-10">Open Account</span>
                                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                            </Link>
                        </div>
                    ))}
                </div>

                {/* Mobile Toggle */}
                <div className="flex-1 flex xl:hidden justify-end items-center">
                    <button
                        className="text-accent hover:text-gold transition-all duration-500"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X size={24} strokeWidth={1} /> : <Menu size={24} strokeWidth={1} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="xl:hidden absolute top-full left-0 w-full bg-primary border-b border-gold/10"
                    >
                        <div className="px-6 py-10 flex flex-col gap-2 font-light uppercase tracking-[0.15em]">
                            {!isDashboard && !isAdmin && navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`text-lg py-3 border-b border-gold/5 transition-colors flex justify-between items-center ${isActive(link.href)
                                        ? 'text-gold border-gold/20'
                                        : 'text-accent hover:text-gold'
                                        }`}
                                >
                                    {link.label}
                                    {isActive(link.href) && (
                                        <span className="w-2 h-2 rounded-full bg-gold" />
                                    )}
                                </Link>
                            ))}
                            <div className="pt-6 mt-2">
                                {mounted && (user ? (
                                    <Link href="/dashboard" className="bg-gold text-primary p-5 font-medium flex justify-between items-center">
                                        Dashboard <ChevronRight size={20} />
                                    </Link>
                                ) : (
                                    <div className="flex flex-col gap-4">
                                        <Link href="/login" className="border border-gold/30 text-accent p-5 text-center text-sm font-medium hover:bg-gold/5">Sign In</Link>
                                        <Link href="/verify" className="bg-gold text-primary p-5 text-center text-sm font-medium hover:bg-gold-dark">Open an Account</Link>
                                    </div>
                                ))}
                            </div>

                            {/* Mobile Dashboard Contextual Menu */}
                            {(isDashboard || isAdmin) && (
                                <div className="mt-8 pt-8 border-t border-gold/10">
                                    <p className={`text-[10px] font-bold uppercase tracking-[0.3em] mb-6 ${isAdmin ? 'text-red-500/40' : 'text-gold/40'}`}>
                                        {isAdmin ? 'System Governance' : 'Banking Operations'}
                                    </p>
                                    <div className="grid grid-cols-1 gap-2">
                                        {(isAdmin ? adminLinks : dashboardLinks).map((link) => (
                                            <Link
                                                key={link.href}
                                                href={link.href}
                                                onClick={() => setMobileMenuOpen(false)}
                                                className={`flex items-center gap-4 p-4 border transition-all ${pathname === link.href
                                                    ? (isAdmin ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-gold/10 border-gold/20 text-gold')
                                                    : 'border-gold/5 text-accent/60'}`}
                                            >
                                                <span className="text-xs font-bold uppercase tracking-widest">{link.name}</span>
                                            </Link>
                                        ))}

                                        {/* Mobile Logout Action */}
                                        <button
                                            onClick={() => {
                                                logout();
                                                setMobileMenuOpen(false);
                                            }}
                                            className={`flex items-center gap-4 p-4 border border-red-500/20 bg-red-500/5 text-red-400 mt-4 transition-all active:scale-95`}
                                        >
                                            <LogOut size={16} strokeWidth={1.5} />
                                            <span className="text-xs font-bold uppercase tracking-widest">
                                                {isAdmin ? 'Exit Governance' : 'Terminate Session'}
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    )
}
