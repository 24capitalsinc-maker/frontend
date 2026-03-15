'use client'
import Link from 'next/link'
import { useSettingsStore } from '@/store/useSettingsStore'
import { Shield, Mail, Phone, MapPin, Twitter, Linkedin, Instagram, Facebook } from 'lucide-react'

export default function Footer() {
    const { settings } = useSettingsStore()
    const currentYear = new Date().getFullYear()

    return (
        <footer className="bg-primary pt-24 pb-12 border-t border-gold/10 relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none mix-blend-overlay" style={{ backgroundImage: "url('https://static.wixstatic.com/media/c837a6_51db7f706561479b9f9f7570f739e702~mv2.png')", backgroundSize: 'cover' }} />

            <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
                    {/* Brand Section */}
                    <div className="space-y-8">
                        <Link href="/" className="flex items-center gap-3">
                            {settings?.logoUrl ? (
                                <img src={settings.logoUrl} alt={settings.companyName} className="h-8 w-auto object-contain" />
                            ) : (
                                <>
                                    <div className="w-8 h-8 border border-gold/30 rounded flex items-center justify-center">
                                        <span className="text-gold font-serif text-xl pr-0.5">
                                            {(settings?.logoText || 'Capital').charAt(0)}
                                        </span>
                                    </div>
                                    <span className="text-lg font-light tracking-[0.2em] text-accent uppercase">
                                        {settings?.logoText || 'Capital'}<span className="text-gold font-medium">{settings?.logoAccent || '24'}</span>
                                    </span>
                                </>
                            )}
                        </Link>
                        <p className="text-[10px] text-accent/40 uppercase leading-relaxed tracking-widest font-light max-w-xs">
                            Leading the evolution of institutional liquidity and sovereign wealth management through advanced diagnostic protocols.
                        </p>
                        <div className="flex items-center gap-6">
                            {settings?.socialLinks?.twitter && (
                                <Link href={settings.socialLinks.twitter} className="text-accent/30 hover:text-gold transition-colors"><Twitter size={14} /></Link>
                            )}
                            {settings?.socialLinks?.linkedin && (
                                <Link href={settings.socialLinks.linkedin} className="text-accent/30 hover:text-gold transition-colors"><Linkedin size={14} /></Link>
                            )}
                            {settings?.socialLinks?.instagram && (
                                <Link href={settings.socialLinks.instagram} className="text-accent/30 hover:text-gold transition-colors"><Instagram size={14} /></Link>
                            )}
                            {settings?.socialLinks?.facebook && (
                                <Link href={settings.socialLinks.facebook} className="text-accent/30 hover:text-gold transition-colors"><Facebook size={14} /></Link>
                            )}
                        </div>
                    </div>

                    {/* Quick Protocols */}
                    <div className="space-y-8">
                        <h4 className="text-[10px] font-bold text-gold uppercase tracking-[0.4em]">Operations</h4>
                        <ul className="space-y-4">
                            <li><Link href="/business" className="text-[10px] text-accent/50 hover:text-gold transition-colors uppercase tracking-widest">Institutional Banking</Link></li>
                            <li><Link href="/personal" className="text-[10px] text-accent/50 hover:text-gold transition-colors uppercase tracking-widest">Private Equity</Link></li>
                            <li><Link href="/cards" className="text-[10px] text-accent/50 hover:text-gold transition-colors uppercase tracking-widest">Sovereign Cards</Link></li>
                            <li><Link href="/loans" className="text-[10px] text-accent/50 hover:text-gold transition-colors uppercase tracking-widest">Capital Liquidity</Link></li>
                        </ul>
                    </div>

                    {/* Support Node */}
                    <div className="space-y-8">
                        <h4 className="text-[10px] font-bold text-gold uppercase tracking-[0.4em]">Governance</h4>
                        <ul className="space-y-4">
                            <li><Link href="/support" className="text-[10px] text-accent/50 hover:text-gold transition-colors uppercase tracking-widest">Support Portal</Link></li>
                            <li><Link href="/contact" className="text-[10px] text-accent/50 hover:text-gold transition-colors uppercase tracking-widest">Contact Node</Link></li>
                        </ul>
                    </div>

                    {/* Contact Node */}
                    <div className="space-y-8">
                        <h4 className="text-[10px] font-bold text-gold uppercase tracking-[0.4em]">Node Info</h4>
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <Mail size={14} className="text-gold/40 mt-1" />
                                <div>
                                    <p className="text-[10px] text-accent font-light tracking-wide">{settings?.supportEmail || 'support@capital24.com'}</p>
                                    <p className="text-[8px] text-accent/30 uppercase mt-1 tracking-widest font-bold">Encrypted Channel</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <MapPin size={14} className="text-gold/40 mt-1" />
                                <div>
                                    <p className="text-[10px] text-accent font-light tracking-wide">Sovereign District, Node 01</p>
                                    <p className="text-[8px] text-accent/30 uppercase mt-1 tracking-widest font-bold">Global Headquarters</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-12 border-t border-gold/5 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-4">
                        <Shield size={16} className="text-gold/20" />
                        <p className="text-[9px] text-accent/30 uppercase tracking-[0.3em] font-medium">
                            &copy; {currentYear} {settings?.companyName || 'Capital24'} Institutional. All rights reserved.
                        </p>
                    </div>
                    <div className="flex items-center gap-10">
                        <Link href="/privacy" className="text-[8px] text-accent/20 hover:text-accent/50 transition-colors uppercase tracking-[0.4em] font-bold">Privacy Protocol</Link>
                        <Link href="/terms" className="text-[8px] text-accent/20 hover:text-accent/50 transition-colors uppercase tracking-[0.4em] font-bold">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
