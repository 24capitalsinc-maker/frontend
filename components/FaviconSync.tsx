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
        const logoUrl = settings?.logoUrl || '/logo.png'
        const link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']") || document.createElement('link')
        link.type = 'image/png'
        link.rel = 'shortcut icon'
        link.href = logoUrl + '?v=' + Date.now() // Cache busting
        document.getElementsByTagName('head')[0].appendChild(link)
    }, [settings?.logoUrl])

    return null
}
