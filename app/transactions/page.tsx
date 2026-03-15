'use client'
import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'
import TransactionTable from '@/components/TransactionTable'
import api from '@/lib/api'
import { Filter } from 'lucide-react'
import Footer from '@/components/Footer'

export default function TransactionsPage() {
    const [transactions, setTransactions] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const res = await api.get('/transactions/my')
                setTransactions(res.data)
            } catch (err) {
                // Handled via UI
            } finally {
                setLoading(false)
            }
        }
        fetchTransactions()
    }, [])

    return (
        <main className="min-h-screen bg-primary flex flex-col relative overflow-x-hidden">
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay" style={{ backgroundImage: "url('https://static.wixstatic.com/media/c837a6_51db7f706561479b9f9f7570f739e702~mv2.png')", backgroundSize: 'cover' }} />

            <Navbar />

            <div className="flex flex-1 pt-24">
                <Sidebar />
                <div className="flex-1 min-w-0 p-4 sm:p-6 md:p-12 z-10 overflow-hidden">
                    <header className="mb-14 flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-gold/10 pb-10">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <span className="bg-gold/10 text-gold text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-gold/20">Audit Grade Ledger</span>
                                <div className="h-[1px] w-8 bg-gold/20"></div>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-light text-accent tracking-tighter">
                                Financial <span className="text-gold font-medium">Ledger.</span>
                            </h1>
                            <p className="text-accent/40 mt-3 text-sm tracking-wide font-light">Comprehensive analysis of your capital flow and institutional history.</p>
                        </div>
                        <button className="flex items-center gap-3 bg-gold/5 border border-gold/20 px-6 py-3 text-[10px] font-bold text-gold uppercase tracking-[0.2em] hover:bg-gold/10 transition-all">
                            <Filter size={14} /> Filter Activity
                        </button>
                    </header>

                    <div className="min-h-[400px]">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-40 gap-6">
                                <div className="w-10 h-10 border-2 border-gold border-t-transparent rounded-full animate-spin" />
                                <p className="text-gold text-[10px] font-bold tracking-[0.4em] uppercase animate-pulse">Decrypting Ledger Data</p>
                            </div>
                        ) : (
                            <TransactionTable transactions={transactions} />
                        )}
                    </div>

                    <div className="mt-24 -mx-6 md:-mx-12">
                        <Footer />
                    </div>
                </div>
            </div>
        </main>
    )
}
