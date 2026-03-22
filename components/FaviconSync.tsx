'use client'
import { useEffect } from 'react'
import { useSettingsStore } from '@/store/useSettingsStore'

export default function FaviconSync() {
    const { settings, fetchSettings } = useSettingsStore()

    useEffect(() => {
        if (!settings) {
            fetchSettings()
        }
    }, [settings, fetchSettings])

    useEffect(() => {
        const faviconUrl = settings?.logoUrl || '/favicon.png'
        const link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']") || document.createElement('link')
        link.type = 'image/png'
        link.rel = 'shortcut icon'
        link.href = faviconUrl + '?v=' + Date.now()
        document.getElementsByTagName('head')[0].appendChild(link)
    }, [settings?.logoUrl])

    return null
}
