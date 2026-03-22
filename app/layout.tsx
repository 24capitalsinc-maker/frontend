import './globals.css'
import { Outfit, Inter } from 'next/font/google'
import { Toaster } from 'sonner'
import FaviconSync from '@/components/FaviconSync'

const outfit = Outfit({
    subsets: ['latin'],
    weight: ['300', '400', '500', '600', '700', '800', '900'],
    variable: '--font-outfit',
})

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
})

export const metadata = {
    title: 'optimanexgen | Elite Digital Banking',
    description: 'Pro production-level digital banking application',
    icons: {
        icon: '/logo.png',
        shortcut: '/logo.png',
        apple: '/logo.png',
    }
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" className={`${outfit.variable} ${inter.variable} overflow-x-hidden max-w-[100vw] text-ellipsis`} data-scroll-behavior="smooth">
            <body className="bg-primary text-slate-100 font-sans antialiased overflow-x-hidden max-w-[100vw]">
                <FaviconSync />
                <Toaster richColors position="top-right" closeButton />
                {children}
            </body>
        </html>
    )
}
