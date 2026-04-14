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
    Globe, Clock, CreditCard,
    Camera, Edit2
} from 'lucide-react'
import { useRef } from 'react'
import SmoothSelect from '@/components/SmoothSelect'

type Section = 'Identity' | 'Security' | 'Notifications' | 'Global' | 'Management';

export default function SettingsPage() {
    const { user, setUser } = useAuthStore()
    const [mounted, setMounted] = useState(false)
    const [activeSection, setActiveSection] = useState<Section>('Identity')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [formData, setFormData] = useState<any>({})
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                const img = new Image()
                img.onload = () => {
                    const canvas = document.createElement('canvas')
                    const MAX_WIDTH = 400
                    const MAX_HEIGHT = 400
                    let width = img.width
                    let height = img.height

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width
                            width = MAX_WIDTH
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height
                            height = MAX_HEIGHT
                        }
                    }

                    canvas.width = width
                    canvas.height = height
                    const ctx = canvas.getContext('2d')
                    ctx?.drawImage(img, 0, 0, width, height)
                    const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7) // 70% quality
                    setFormData((prev: any) => ({ ...prev, profileImage: compressedBase64 }))
                }
                img.src = reader.result as string
            }
            reader.readAsDataURL(file)
        }
    }

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
                limits: user.limits || { dailyTransfer: 50000, monthlyTransfer: 500000 },
                profileImage: user.profileImage || ''
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

    const handleRequestClosure = async () => {
        if (!confirm('Are you absolutely sure you want to request account closure? This process requires administrative approval.')) return

        setLoading(true)
        try {
            await api.post('/users/request-closure', { reason: 'User initiated from settings' })
            setUser({ ...user, isClosureRequested: true })
            setSuccess(true)
            setTimeout(() => setSuccess(false), 3000)
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to submit closure request')
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
        { id: 'Management', label: 'Account Management', icon: Lock },
    ]

    return (
        <main className="min-h-screen bg-primary flex flex-col relative font-sans">
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay" style={{ backgroundImage: "url('https://static.wixstatic.com/media/c837a6_51db7f706561479b9f9f7570f739e702~mv2.png')", backgroundSize: 'cover' }} />

            <Navbar />

            <div className="flex flex-col lg:flex-row flex-1 pt-20">
                <Sidebar />

                <div className="flex-1 flex flex-col min-h-0 lg:pl-80">
                    {/* Settings Tab Navigation (Horizontal on Desktop) */}
                    <div className="w-full border-b border-gold/10 bg-primary-light/5 flex flex-col overflow-visible">
                        <div className="px-6 md:px-16 pt-10 pb-6">
                            <p className="text-[10px] text-gold font-bold uppercase tracking-[0.4em] mb-8 text-left">Account Settings</p>
                            <div className="flex flex-row items-center gap-1 overflow-x-auto no-scrollbar pb-2 mask-linear">
                                {sections.map((s) => (
                                    <button
                                        key={s.id}
                                        onClick={() => setActiveSection(s.id)}
                                        className={`flex items-center gap-4 px-6 py-4 transition-all duration-500 whitespace-nowrap group relative flex-shrink-0 ${activeSection === s.id ? 'text-accent' : 'text-accent/30 hover:text-accent/60'}`}
                                    >
                                        <s.icon size={14} className={activeSection === s.id ? 'text-gold' : 'text-accent/20'} />
                                        <span className={`text-[10px] uppercase font-bold tracking-[0.2em]`}>
                                            {s.label}
                                        </span>
                                        {activeSection === s.id && (
                                            <motion.div layoutId="activeSettingsTab" className="absolute bottom-0 left-0 right-0 h-[2px] bg-gold" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 p-6 md:p-16 bg-primary-light/5">
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
                                    <div className="space-y-12">
                                        {/* Master Avatar Section */}
                                        <div className="bg-primary-light/10 border border-gold/5 p-10 flex flex-col md:flex-row items-center gap-10 group">
                                            <div className="relative">
                                                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-2 border-gold/20 p-2 relative group-hover:border-gold transition-all duration-700">
                                                    <div className="w-full h-full rounded-full bg-primary/40 flex items-center justify-center overflow-hidden relative border border-gold/10">
                                                        {formData.profileImage ? (
                                                            <img src={formData.profileImage} className="w-full h-full object-cover" alt="Profile" />
                                                        ) : (
                                                            <span className="text-2xl text-gold/20 font-light tracking-widest">{user?.name?.[0]}</span>
                                                        )}
                                                        <div
                                                            onClick={() => fileInputRef.current?.click()}
                                                            className="absolute inset-0 bg-primary/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer gap-2"
                                                        >
                                                            <Camera size={24} className="text-gold" />
                                                            <span className="text-[8px] text-gold font-bold uppercase tracking-widest">Update</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <input
                                                    type="file"
                                                    ref={fileInputRef}
                                                    onChange={handleImageChange}
                                                    accept="image/jpeg,image/png,image/webp,image/jpg"
                                                    className="hidden"
                                                />
                                            </div>
                                            <div className="max-w-md text-center md:text-left">
                                                <h3 className="text-xl font-light text-accent mb-2">Institutional Identity Image</h3>
                                                <p className="text-xs text-accent/40 font-light leading-relaxed mb-6">
                                                    Your profile picture is displayed across the secure ledger and internal communication modules. Recommended: Square WebP or PNG, min 400x400px.
                                                </p>
                                                <button
                                                    onClick={() => fileInputRef.current?.click()}
                                                    className="inline-flex items-center gap-3 text-[10px] text-gold font-bold uppercase tracking-[0.3em] border-b border-gold/20 pb-2 hover:gap-5 transition-all"
                                                >
                                                    Upload New Instrument <Edit2 size={12} />
                                                </button>
                                            </div>
                                        </div>

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
                                                <h3 className="text-xl font-light text-accent mb-2 tracking-tight">Login Password</h3>
                                                <p className="text-xs text-accent/30 uppercase font-bold tracking-widest">Last Changed: {new Date().toLocaleDateString()}</p>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <button className="border border-gold/20 text-gold px-10 py-5 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-gold/5 transition-all flex items-center justify-center gap-4 group">
                                                    <Lock size={14} className="opacity-40 group-hover:opacity-100 transition-opacity" />
                                                    Change Password
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
                                                    {formData.notifications[n.id] ? 'Enabled' : 'Disabled'}
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="space-y-10">
                                    <div className="bg-primary-light/10 border border-gold/5 p-10 grid grid-cols-1 md:grid-cols-3 gap-12">
                                        <SmoothSelect
                                            label="Primary Language"
                                            icon={<Globe size={14} />}
                                            value={formData.preferences?.language}
                                            options={[
                                                { value: 'English', label: 'English' },
                                                { value: 'German', label: 'Deutsch' },
                                                { value: 'French', label: 'Français' },
                                            ]}
                                            onChange={(val) => setFormData({ ...formData, preferences: { ...formData.preferences, language: val } })}
                                        />

                                        <SmoothSelect
                                            label="Time Zone"
                                            icon={<Clock size={14} />}
                                            value={formData.preferences?.timezone}
                                            options={[
                                                { value: 'UTC', label: 'UTC' },
                                                { value: 'CET', label: 'CET (Europe)' },
                                                { value: 'SGT', label: 'SGT (Singapore)' },
                                            ]}
                                            onChange={(val) => setFormData({ ...formData, preferences: { ...formData.preferences, timezone: val } })}
                                        />

                                        <SmoothSelect
                                            label="Base Currency"
                                            icon={<CreditCard size={14} />}
                                            value={formData.preferences?.defaultCurrency}
                                            options={[
                                                { value: 'USD', label: 'USD - US Dollar' },
                                                { value: 'CHF', label: 'CHF - Swiss Franc' },
                                                { value: 'EUR', label: 'EUR - Euro' },
                                            ]}
                                            onChange={(val) => setFormData({ ...formData, preferences: { ...formData.preferences, defaultCurrency: val } })}
                                        />
                                    </div>
                                </div>

                                {activeSection === 'Management' && (
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
                                                    <h3 className="text-[10px] font-bold uppercase tracking-[0.3em]">
                                                        {user?.isClosureRequested ? 'Closure Pending Review' : 'Close Account'}
                                                    </h3>
                                                </div>
                                                <p className="text-sm text-accent/30 font-light leading-relaxed mb-auto pb-10">
                                                    {user?.isClosureRequested
                                                        ? 'An administrative review of your account closure request is currently in progress. You will be notified once the process is finalized.'
                                                        : 'Closing your account will permanently delete all your data. This process requires administrative approval and cannot be undone.'}
                                                </p>
                                                <button
                                                    onClick={handleRequestClosure}
                                                    disabled={loading || user?.isClosureRequested}
                                                    className={`w-full border py-5 text-[10px] font-bold uppercase tracking-[0.3em] transition-all ${user?.isClosureRequested
                                                        ? 'border-gold/20 text-gold/40 cursor-not-allowed'
                                                        : 'border-red-500/30 text-red-400/60 hover:bg-red-500/20 hover:text-red-400'
                                                        }`}
                                                >
                                                    {loading ? (
                                                        <Loader2 className="animate-spin mx-auto" size={16} />
                                                    ) : user?.isClosureRequested ? (
                                                        'Awaiting Administrative Approval'
                                                    ) : (
                                                        'Close My Account'
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>

                    </div>
                </div>
            </div>
        </main>
    )
}
