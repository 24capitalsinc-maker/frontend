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
    title: 'Capital24 | Elite Digital Banking',
    description: 'Pro production-level digital banking application',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" className={`${outfit.variable} ${inter.variable} overflow-x-hidden`} data-scroll-behavior="smooth">
            <body className="bg-primary text-slate-100 font-sans antialiased overflow-x-hidden">
                <FaviconSync />
                <Toaster richColors position="top-right" closeButton />
                {children}
            </body>
        </html>
    )
}
