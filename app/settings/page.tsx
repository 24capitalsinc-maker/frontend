'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'
import { useAuthStore } from '@/store/useAuthStore'
import api from '@/lib/api'
import {
    User, Shield, Bell, Settings as SettingsIcon,
    Lock, ChevronRight, Check, Loader2, AlertTriangle,
    Globe, Clock, CreditCard
} from 'lucide-react'
import Footer from '@/components/Footer'

type Section = 'Identity' | 'Security' | 'Notifications' | 'Global' | 'Governance';

export default function SettingsPage() {
    const { user, setUser } = useAuthStore()
    const [mounted, setMounted] = useState(false)
    const [activeSection, setActiveSection] = useState<Section>('Identity')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [formData, setFormData] = useState<any>({})

    useEffect(() => {
        setMounted(true)
        if (user) {
            setFormData({
                name: user.name || '',
                phoneNumber: user.phoneNumber || '',
                address: user.address || '',
                occupation: user.occupation || '',
                twoFactorEnabled: user.twoFactorEnabled || false,
                notifications: user.notifications || { email: true, sms: false, push: true },
                preferences: user.preferences || { language: 'English', timezone: 'UTC', defaultCurrency: 'USD' },
                limits: user.limits || { dailyTransfer: 50000, monthlyTransfer: 500000 }
            })
        }
    }, [user])

    const handleSave = async () => {
        setLoading(true)
        setSuccess(false)
        try {
            const res = await api.put('/users/profile', formData)
            setUser(res.data)
            setSuccess(true)
            setTimeout(() => setSuccess(false), 3000)
        } catch (err) {
            // Handled via UI
        } finally {
            setLoading(false)
        }
    }

    if (!mounted) return null;

    const sections: { id: Section; label: string; icon: any }[] = [
        { id: 'Identity', label: 'Personal Profile', icon: User },
        { id: 'Security', label: 'Security & Access', icon: Shield },
        { id: 'Notifications', label: 'Alert Settings', icon: Bell },
        { id: 'Global', label: 'Language & Currency', icon: SettingsIcon },
        { id: 'Governance', label: 'Account Management', icon: Lock },
    ]

    return (
        <main className="min-h-screen bg-primary flex flex-col relative overflow-hidden font-sans">
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay" style={{ backgroundImage: "url('https://static.wixstatic.com/media/c837a6_51db7f706561479b9f9f7570f739e702~mv2.png')", backgroundSize: 'cover' }} />

            <Navbar />

            <div className="flex flex-1 pt-20 h-[calc(100vh-64px)] overflow-hidden">
                <Sidebar />

                <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                    {/* Inner Sidebar for Settings Sections */}
                    <div className="w-full md:w-80 border-r border-gold/10 bg-primary-light/5 p-6 md:p-10 flex flex-col gap-2 overflow-y-auto">
                        <p className="text-[10px] text-gold font-bold uppercase tracking-[0.4em] mb-10 pl-2 text-center md:text-left">Settings Console</p>
                        {sections.map((s) => (
                            <button
                                key={s.id}
                                onClick={() => setActiveSection(s.id)}
                                className={`w-full flex items-center justify-between p-5 transition-all duration-500 group ${activeSection === s.id ? 'bg-gold/10 border border-gold/20 shadow-[0_0_20px_rgba(203,161,110,0.05)]' : 'hover:bg-gold/5'}`}
                            >
                                <div className="flex items-center gap-4">
                                    <s.icon size={16} className={activeSection === s.id ? 'text-gold' : 'text-accent/30'} />
                                    <span className={`text-[10px] uppercase font-bold tracking-[0.2em] ${activeSection === s.id ? 'text-accent' : 'text-accent/40 group-hover:text-accent/60'}`}>
                                        {s.label}
                                    </span>
                                </div>
                                {activeSection === s.id && <ChevronRight size={14} className="text-gold" />}
                            </button>
                        ))}

                        <div className="mt-auto pt-10 border-t border-gold/5 opacity-50">
                            <p className="text-[8px] text-accent/30 font-bold uppercase tracking-widest text-center md:text-left">System Status: Active</p>
                            <p className="text-[8px] text-gold font-medium uppercase tracking-widest mt-1 text-center md:text-left">Secure Connection Active</p>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 min-w-0 p-6 md:p-16 overflow-y-auto custom-scrollbar bg-primary-light/5">
                        <header className="mb-14 border-b border-gold/10 pb-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
                            <div>
                                <h1 className="text-3xl md:text-5xl font-light text-accent tracking-tighter mb-4">
                                    Account <span className="text-gold">Settings.</span>
                                </h1>
                                <p className="text-accent/40 text-[10px] uppercase font-bold tracking-[0.3em]">Section: {activeSection}</p>
                            </div>
                            <button
                                onClick={handleSave}
                                disabled={loading}
                                className="bg-gold text-primary px-12 py-5 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-gold-dark transition-all disabled:opacity-50 flex items-center gap-3 shadow-xl shadow-gold/10 active:scale-95"
                            >
                                {loading ? <Loader2 size={16} className="animate-spin" /> : success ? <Check size={16} /> : 'Save Profile'}
                            </button>
                        </header>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeSection}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.4 }}
                                className="space-y-12"
                            >
                                {activeSection === 'Identity' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <div className="space-y-8 bg-primary-light/10 border border-gold/5 p-10">
                                            <p className="text-[10px] text-gold font-bold uppercase tracking-[0.3em] mb-6 border-b border-gold/10 pb-4">Personal Information</p>
                                            <div className="space-y-4">
                                                <label className="text-[10px] text-accent/30 font-bold uppercase tracking-widest block">Full Name</label>
                                                <input
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    className="w-full bg-transparent border-b border-gold/20 p-4 focus:border-gold outline-none transition-colors text-accent font-light text-lg tracking-tight"
                                                />
                                            </div>
                                            <div className="space-y-4">
                                                <label className="text-[10px] text-accent/30 font-bold uppercase tracking-widest block">Occupation</label>
                                                <input
                                                    value={formData.occupation}
                                                    onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                                                    className="w-full bg-transparent border-b border-gold/20 p-4 focus:border-gold outline-none transition-colors text-accent font-light text-lg tracking-tight placeholder:text-accent/10"
                                                    placeholder="e.g. Portfolio Manager"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-8 bg-primary-light/10 border border-gold/5 p-10">
                                            <p className="text-[10px] text-gold font-bold uppercase tracking-[0.3em] mb-6 border-b border-gold/10 pb-4">Contact Details</p>
                                            <div className="space-y-4">
                                                <label className="text-[10px] text-accent/30 font-bold uppercase tracking-widest block">Email Address</label>
                                                <input
                                                    disabled
                                                    value={user?.email}
                                                    className="w-full bg-transparent border-b border-gold/10 p-4 outline-none text-accent/40 font-light text-lg tracking-tight selection:bg-gold/10"
                                                />
                                            </div>
                                            <div className="space-y-4">
                                                <label className="text-[10px] text-accent/30 font-bold uppercase tracking-widest block">Phone Number</label>
                                                <input
                                                    value={formData.phoneNumber}
                                                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                                    className="w-full bg-transparent border-b border-gold/20 p-4 focus:border-gold outline-none transition-colors text-accent font-light text-lg tracking-tight"
                                                    placeholder="+X XXX XXX XXXX"
                                                />
                                            </div>
                                        </div>

                                        <div className="md:col-span-2 space-y-4 bg-primary-light/10 border border-gold/5 p-10">
                                            <p className="text-[10px] text-gold font-bold uppercase tracking-[0.3em] mb-6 border-b border-gold/10 pb-4">Home Address</p>
                                            <textarea
                                                value={formData.address}
                                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                                className="w-full bg-transparent border border-gold/10 p-6 focus:border-gold outline-none transition-colors text-accent font-light text-lg tracking-tight h-32 resize-none appearance-none"
                                                placeholder="Provide your full home address..."
                                            />
                                        </div>
                                    </div>
                                )}

                                {activeSection === 'Security' && (
                                    <div className="space-y-10">
                                        <div className="bg-primary-light/10 border border-gold/5 p-10 flex flex-col md:flex-row items-center justify-between gap-10 group hover:border-gold/20 transition-all duration-700">
                                            <div className="max-w-xl">
                                                <h3 className="text-xl font-light text-accent mb-2">Two-Factor Authentication (2FA)</h3>
                                                <p className="text-sm text-accent/40 font-light leading-relaxed">Add an extra layer of security to your account. Recommended for all accounts.</p>
                                            </div>
                                            <button
                                                onClick={() => setFormData({ ...formData, twoFactorEnabled: !formData.twoFactorEnabled })}
                                                className={`w-20 h-10 rounded-full border p-1 transition-all duration-500 relative ${formData.twoFactorEnabled ? 'bg-gold/20 border-gold shadow-[0_0_15px_rgba(203,161,110,0.3)]' : 'bg-primary border-gold/20'}`}
                                            >
                                                <motion.div
                                                    animate={{ x: formData.twoFactorEnabled ? 40 : 0 }}
                                                    className={`w-8 h-8 rounded-full shadow-lg ${formData.twoFactorEnabled ? 'bg-gold' : 'bg-gold/20'}`}
                                                />
                                            </button>
                                        </div>

                                        <div className="bg-primary-light/10 border border-gold/5 p-10 space-y-10">
                                            <div className="border-b border-gold/10 pb-6">
                                                <h3 className="text-xl font-light text-accent mb-2 tracking-tight">Security Token (RSA)</h3>
                                                <p className="text-xs text-accent/30 uppercase font-bold tracking-widest">Last Rotation: {new Date().toLocaleDateString()}</p>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <button className="border border-gold/20 text-gold px-10 py-5 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-gold/5 transition-all flex items-center justify-center gap-4 group">
                                                    <Lock size={14} className="opacity-40 group-hover:opacity-100 transition-opacity" />
                                                    Rotate Security Signature
                                                </button>
                                                <button className="border border-gold/20 text-gold px-10 py-5 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-gold/5 transition-all flex items-center justify-center gap-4 group">
                                                    <Shield size={14} className="opacity-40 group-hover:opacity-100 transition-opacity" />
                                                    Clear All Active Sessions
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeSection === 'Notifications' && (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                        {[
                                            { id: 'email', label: 'Email Alerts', desc: 'Receive account summaries and login alerts via email.' },
                                            { id: 'sms', label: 'SMS Alerts', desc: 'Real-time transaction codes and critical balance alerts via SMS.' },
                                            { id: 'push', label: 'App Notifications', desc: 'Stay updated with important activity directly on your device.' }
                                        ].map((n) => (
                                            <div key={n.id} className="bg-primary-light/10 border border-gold/5 p-10 flex flex-col hover:border-gold/30 transition-all duration-700">
                                                <div className="mb-8">
                                                    <h3 className="text-lg font-light text-accent mb-3 tracking-tight">{n.label}</h3>
                                                    <p className="text-xs text-accent/40 font-light leading-relaxed">{n.desc}</p>
                                                </div>
                                                <button
                                                    onClick={() => setFormData({
                                                        ...formData,
                                                        notifications: { ...formData.notifications, [n.id]: !formData.notifications[n.id] }
                                                    })}
                                                    className={`mt-auto py-4 text-[10px] font-bold uppercase tracking-[0.3em] transition-all border ${formData.notifications[n.id] ? 'bg-gold/10 border-gold/40 text-gold' : 'border-gold/5 text-accent/20 hover:text-accent/40'}`}
                                                >
                                                    {formData.notifications[n.id] ? 'Connection Established' : 'Offline'}
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {activeSection === 'Global' && (
                                    <div className="space-y-10">
                                        <div className="bg-primary-light/10 border border-gold/5 p-10 grid grid-cols-1 md:grid-cols-3 gap-12">
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-3 text-gold/40 mb-2">
                                                    <Globe size={14} />
                                                    <label className="text-[10px] font-bold uppercase tracking-[0.2em]">Primary Language</label>
                                                </div>
                                                <select
                                                    value={formData.preferences?.language}
                                                    onChange={(e) => setFormData({ ...formData, preferences: { ...formData.preferences, language: e.target.value } })}
                                                    className="w-full select-institutional bg-transparent border-b border-gold/20 p-4 focus:border-gold outline-none text-accent font-light text-xl cursor-pointer"
                                                >
                                                    <option value="English">English (Premium)</option>
                                                    <option value="German">Deutsch (Private)</option>
                                                    <option value="French">Français (Swiss)</option>
                                                </select>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="flex items-center gap-3 text-gold/40 mb-2">
                                                    <Clock size={14} />
                                                    <label className="text-[10px] font-bold uppercase tracking-[0.2em]">Time Zone</label>
                                                </div>
                                                <select
                                                    value={formData.preferences?.timezone}
                                                    onChange={(e) => setFormData({ ...formData, preferences: { ...formData.preferences, timezone: e.target.value } })}
                                                    className="w-full select-institutional bg-transparent border-b border-gold/20 p-4 focus:border-gold outline-none text-accent font-light text-xl cursor-pointer"
                                                >
                                                    <option value="UTC">UTC - Global Standard</option>
                                                    <option value="CET">CET - Zurich/Luxembourg</option>
                                                    <option value="SGT">SGT - Singapore Operations</option>
                                                </select>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="flex items-center gap-3 text-gold/40 mb-2">
                                                    <CreditCard size={14} />
                                                    <label className="text-[10px] font-bold uppercase tracking-[0.2em]">Base Currency</label>
                                                </div>
                                                <select
                                                    value={formData.preferences?.defaultCurrency}
                                                    onChange={(e) => setFormData({ ...formData, preferences: { ...formData.preferences, defaultCurrency: e.target.value } })}
                                                    className="w-full select-institutional bg-transparent border-b border-gold/20 p-4 focus:border-gold outline-none text-accent font-light text-xl cursor-pointer"
                                                >
                                                    <option value="USD">USD - Reserve Dollar</option>
                                                    <option value="CHF">CHF - Swiss Franc</option>
                                                    <option value="EUR">EUR - Euro Sovereign</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeSection === 'Governance' && (
                                    <div className="space-y-12">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                            <div className="bg-primary-light/10 border border-gold/5 p-10 space-y-8">
                                                <p className="text-[10px] text-gold font-bold uppercase tracking-[0.4em] mb-4">Transfer Limits</p>
                                                <div className="space-y-6">
                                                    <div>
                                                        <label className="text-[10px] text-accent/30 font-bold uppercase tracking-widest block mb-4">Daily Transfer Limit</label>
                                                        <div className="relative">
                                                            <span className="absolute left-0 bottom-4 text-xl font-light text-gold/40">$</span>
                                                            <input
                                                                type="number"
                                                                value={formData.limits?.dailyTransfer}
                                                                onChange={(e) => setFormData({ ...formData, limits: { ...formData.limits, dailyTransfer: Number(e.target.value) } })}
                                                                className="w-full bg-transparent border-b border-gold/20 pl-8 p-4 focus:border-gold outline-none transition-colors text-gold font-light text-3xl tracking-tighter"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bg-red-500/5 border border-red-500/10 p-10 flex flex-col">
                                                <div className="flex items-center gap-4 mb-8 text-red-500/60">
                                                    <AlertTriangle size={20} />
                                                    <h3 className="text-[10px] font-bold uppercase tracking-[0.3em]">Close Account</h3>
                                                </div>
                                                <p className="text-sm text-accent/30 font-light leading-relaxed mb-auto pb-10">
                                                    Initiating account closure results in permanent loss of all financial records and data. This action is **irreversible**.
                                                </p>
                                                <button className="w-full border border-red-500/30 text-red-400/60 py-5 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-red-500/20 hover:text-red-400 transition-all">
                                                    Close My Account
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>

                        <div className="mt-24 -mx-6 md:-mx-16">
                            <Footer />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
