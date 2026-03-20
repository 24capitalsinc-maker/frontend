'use client'
import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import AdminSidebar from '@/components/AdminSidebar'
import api from '@/lib/api'
import { motion } from 'framer-motion'
import { Save, AlertTriangle, ShieldCheck, Globe, Mail, Share2, Info } from 'lucide-react'
import Footer from '@/components/Footer'

export default function GovernancePage() {
    const [settings, setSettings] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [message, setMessage] = useState({ type: '', text: '' })

    useEffect(() => {
        fetchSettings()
    }, [])

    const fetchSettings = async () => {
        try {
            const res = await api.get('/admin/settings')
            setSettings(res.data)
        } catch (err) {
            // Handled via UI
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async () => {
        setSaving(true)
        setMessage({ type: '', text: '' })
        try {
            await api.put('/admin/settings', settings)
            setMessage({ type: 'success', text: 'Settings updated successfully.' })
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to save system settings.' })
        } finally {
            setSaving(false)
        }
    }

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setUploading(true)
        setMessage({ type: '', text: '' })

        const formData = new FormData()
        formData.append('logo', file)

        try {
            const res = await api.post('/admin/upload-logo', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            setSettings({ ...settings, logoUrl: res.data.logoUrl })
            setMessage({ type: 'success', text: 'Logo uploaded successfully.' })
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to upload logo.' })
        } finally {
            setUploading(false)
        }
    }

    if (loading) return null

    return (
        <div className="min-h-screen bg-primary flex flex-col font-sans selection:bg-gold/30">
            <Navbar />

            <div className="flex flex-1 pt-20">
                <AdminSidebar />
                <div className="flex-1 min-w-0 w-full overflow-hidden p-4 sm:p-6 md:p-10 lg:p-12 z-10">
                    <header className="mb-14 border-b border-gold/10 pb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <span className="text-[10px] text-red-500 font-bold uppercase tracking-[0.3em]">System Admin</span>
                                <div className="h-[1px] w-8 bg-red-500/20"></div>
                            </div>
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-light text-accent tracking-tighter">
                                System <span className="text-red-500 font-medium">Settings.</span>
                            </h1>
                            <p className="text-accent/40 mt-3 text-xs sm:text-sm tracking-wide font-light">Global system overrides and bank identity management.</p>
                        </div>

                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 text-[10px] font-bold uppercase tracking-[0.2em] transition-all flex items-center gap-3 shadow-[0_10px_20px_rgba(220,38,38,0.2)] disabled:opacity-50"
                        >
                            {saving ? 'Synchronizing...' : (
                                <>
                                    <Save size={14} />
                                    Commit Changes
                                </>
                            )}
                        </button>
                    </header>

                    {message.text && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`mb-10 p-5 border text-xs tracking-widest uppercase font-bold ${message.type === 'success' ? 'bg-green-500/5 border-green-500/20 text-green-400' : 'bg-red-500/5 border-red-500/20 text-red-400'
                                }`}
                        >
                            {message.text}
                        </motion.div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        {/* Operational State */}
                        <div className="space-y-10">
                            <section className="bg-primary-light/10 border border-gold/10 p-8 md:p-10 relative overflow-hidden group">
                                <div className="absolute top-0 left-0 w-8 h-[1px] bg-red-500" />
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-10 h-10 bg-red-500/5 border border-red-500/20 flex items-center justify-center">
                                        <AlertTriangle size={18} className="text-red-500" />
                                    </div>
                                    <h2 className="text-xl font-light tracking-tight text-accent">Operational <span className="text-red-500">State</span></h2>
                                </div>

                                <div className="space-y-8">
                                    <div className="flex items-center justify-between gap-6 p-6 border border-gold/5 bg-gold/[0.02]">
                                        <div>
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-accent mb-1">Maintenance Mode</p>
                                            <p className="text-[9px] text-accent/30 leading-relaxed uppercase tracking-tighter">Suspends user access for global infrastructure upgrades.</p>
                                        </div>
                                        <button
                                            onClick={() => setSettings({ ...settings, isMaintenanceMode: !settings.isMaintenanceMode })}
                                            className={`relative w-14 h-7 transition-all duration-500 rounded-full border ${settings.isMaintenanceMode ? 'bg-red-600 border-red-500' : 'bg-primary border-gold/20'}`}
                                        >
                                            <div className={`absolute top-1 w-4 h-4 rounded-full transition-all duration-500 ${settings.isMaintenanceMode ? 'left-8 bg-white' : 'left-1 bg-gold'}`} />
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-between gap-6 p-6 border border-gold/5 bg-gold/[0.02]">
                                        <div>
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-accent mb-1">User Registration</p>
                                            <p className="text-[9px] text-accent/30 leading-relaxed uppercase tracking-tighter">Enable or disable new account registrations.</p>
                                        </div>
                                        <button
                                            onClick={() => setSettings({ ...settings, isRegistrationEnabled: !settings.isRegistrationEnabled })}
                                            className={`relative w-14 h-7 transition-all duration-500 rounded-full border ${settings.isRegistrationEnabled ? 'bg-green-600 border-green-500' : 'bg-primary border-gold/20'}`}
                                        >
                                            <div className={`absolute top-1 w-4 h-4 rounded-full transition-all duration-500 ${settings.isRegistrationEnabled ? 'left-8 bg-white' : 'left-1 bg-gold'}`} />
                                        </button>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent/50">Maintenance Broadcast</label>
                                        <textarea
                                            value={settings.maintenanceMessage}
                                            onChange={(e) => setSettings({ ...settings, maintenanceMessage: e.target.value })}
                                            className="w-full bg-primary border border-gold/10 p-5 text-accent text-sm font-light focus:outline-none focus:border-red-500 focus:bg-red-500/[0.02] transition-all min-h-[120px]"
                                            placeholder="Broadcast message for maintenance mode..."
                                        />
                                    </div>
                                </div>
                            </section>

                            <section className="bg-primary-light/10 border border-gold/10 p-8 md:p-10 relative overflow-hidden group">
                                <div className="absolute top-0 left-0 w-8 h-[1px] bg-gold" />
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-10 h-10 bg-gold/5 border border-gold/20 flex items-center justify-center">
                                        <ShieldCheck size={18} className="text-gold" />
                                    </div>
                                    <h2 className="text-xl font-light tracking-tight text-accent">Bank <span className="text-gold">Branding</span></h2>
                                </div>

                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-bold uppercase tracking-widest text-accent/30">Logo Base Text</label>
                                            <input
                                                type="text"
                                                value={settings.logoText}
                                                onChange={(e) => setSettings({ ...settings, logoText: e.target.value })}
                                                className="w-full bg-primary border border-gold/10 p-4 text-accent text-xs font-light focus:outline-none focus:border-gold/40 transition-all"
                                                placeholder="e.g. optima"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-bold uppercase tracking-widest text-accent/30">Logo Accent</label>
                                            <input
                                                type="text"
                                                value={settings.logoAccent}
                                                onChange={(e) => setSettings({ ...settings, logoAccent: e.target.value })}
                                                className="w-full bg-primary border border-gold/10 p-4 text-accent text-xs font-light focus:outline-none focus:border-gold/40 transition-all"
                                                placeholder="e.g. nexgen"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-[9px] font-bold uppercase tracking-widest text-accent/30">Iconic Logo Asset</label>
                                        <div className="flex items-start gap-6">
                                            {settings.logoUrl && (
                                                <div className="w-20 h-20 border border-gold/20 bg-primary-light flex items-center justify-center p-2">
                                                    <img src={settings.logoUrl} alt="Bank Logo" className="max-w-full max-h-full object-contain" />
                                                </div>
                                            )}
                                            <div className="flex-1">
                                                <label className="group flex flex-col items-center justify-center w-full h-20 border border-dashed border-gold/20 hover:border-gold/40 transition-all cursor-pointer bg-primary/30">
                                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                        <Save size={14} className="text-gold/40 group-hover:text-gold transition-colors mb-2" />
                                                        <p className="text-[8px] text-accent/40 uppercase tracking-widest">{uploading ? 'Uploading...' : 'Upload Site Logo'}</p>
                                                    </div>
                                                    <input type="file" className="hidden" onChange={handleLogoUpload} disabled={uploading} accept="image/*" />
                                                </label>
                                                <p className="text-[8px] text-accent/20 uppercase tracking-tighter mt-2">Accepted formats: SVG, PNG, ICO, JPG. This will be used for the logo and favicon.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Institutional Identity */}
                        <div className="space-y-10">
                            <section className="bg-primary-light/10 border border-gold/10 p-8 md:p-10 relative overflow-hidden group h-full">
                                <div className="absolute top-0 right-0 w-8 h-[1px] bg-gold" />
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-20 h-20 border border-gold/40 flex items-center justify-center rounded-sm bg-gold/5">
                                        <span className="text-gold font-serif text-3xl">C</span>
                                    </div>
                                    <h2 className="text-xl font-light tracking-tight text-accent">Bank <span className="text-gold">Identity</span></h2>
                                </div>

                                <div className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent/50 flex items-center gap-2">
                                                <ShieldCheck size={12} /> Bank Name
                                            </label>
                                            <input
                                                type="text"
                                                value={settings.companyName}
                                                onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                                                className="w-full bg-primary border border-gold/10 p-4 text-accent text-sm font-light focus:outline-none focus:border-gold/40 transition-all"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent/50 flex items-center gap-2">
                                                <Mail size={12} /> Support Email
                                            </label>
                                            <input
                                                type="email"
                                                value={settings.supportEmail}
                                                onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                                                className="w-full bg-primary border border-gold/10 p-4 text-accent text-sm font-light focus:outline-none focus:border-gold/40 transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-6 pt-6 border-t border-gold/5">
                                        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold/40 flex items-center gap-3">
                                            <Share2 size={12} /> Social Media Links
                                        </p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {Object.keys(settings.socialLinks).map((platform) => (
                                                <div key={platform} className="space-y-2">
                                                    <label className="text-[9px] font-bold uppercase tracking-widest text-accent/30 capitalize">{platform}</label>
                                                    <input
                                                        type="text"
                                                        value={settings.socialLinks[platform]}
                                                        onChange={(e) => setSettings({
                                                            ...settings,
                                                            socialLinks: { ...settings.socialLinks, [platform]: e.target.value }
                                                        })}
                                                        className="w-full bg-primary border border-gold/5 p-3 text-accent text-xs font-light focus:outline-none focus:border-gold/20 transition-all"
                                                        placeholder={`https://${platform}.com/optimanexgen`}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="mt-10 p-6 bg-red-500/5 border border-red-500/10 flex items-start gap-4">
                                        <Info size={16} className="text-red-500 mt-1" />
                                        <p className="text-[9px] text-accent/50 uppercase leading-relaxed tracking-widest font-bold">
                                            Warning: Changes will be applied globally across the entire system.
                                        </p>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </div>

            <div className="z-20">
                <Footer />
            </div>
        </div>
    )
}
