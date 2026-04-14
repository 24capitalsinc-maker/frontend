'use client'
import { useEffect, useRef } from 'react'
import { useAuthStore } from '@/store/useAuthStore'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

const INACTIVITY_TIMEOUT = 30 * 60 * 1000 // 30 minutes

export default function InactivityHandler() {
    const { user, logout } = useAuthStore()
    const router = useRouter()
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)

    const resetTimer = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }

        if (user) {
            timeoutRef.current = setTimeout(() => {
                handleLogout()
            }, INACTIVITY_TIMEOUT)
        }
    }

    const handleLogout = () => {
        logout()
        router.push('/login')
        toast.warning('Session Security Protocol', {
            description: 'Your session has been terminated due to 30 minutes of institutional inactivity. Please re-authenticate.',
            duration: 8000
        })
    }

    useEffect(() => {
        // Events that reset the inactivity timer
        const events = [
            'mousedown',
            'mousemove',
            'keypress',
            'scroll',
            'touchstart'
        ]

        const eventHandler = () => resetTimer()

        if (user) {
            resetTimer()
            events.forEach(event => {
                window.addEventListener(event, eventHandler)
            })
        }

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }
            events.forEach(event => {
                window.removeEventListener(event, eventHandler)
            })
        }
    }, [user])

    return null
}
