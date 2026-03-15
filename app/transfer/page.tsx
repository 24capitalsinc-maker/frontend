'use client'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'
import TransferForm from '@/components/TransferForm'
import Footer from '@/components/Footer'

export default function TransferPage() {
    return (
        <main className="min-h-screen bg-primary flex flex-col relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay" style={{ backgroundImage: "url('https://static.wixstatic.com/media/c837a6_51db7f706561479b9f9f7570f739e702~mv2.png')", backgroundSize: 'cover' }} />

            <Navbar />

            <div className="flex flex-1 pt-20">
                <Sidebar />
                <div className="flex-1 min-w-0 p-6 md:p-12 z-10">
                    <div className="max-w-4xl mx-auto">
                        <header className="mb-14 border-b border-gold/10 pb-10">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="bg-gold/10 text-gold text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-gold/20">Secure Channel</span>
                                <div className="h-[1px] w-8 bg-gold/20"></div>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-light text-accent tracking-tighter">
                                Capital <span className="text-gold font-medium">Transfer.</span>
                            </h1>
                            <p className="text-accent/40 mt-3 text-sm tracking-wide font-light max-w-xl">Execute encrypted global wealth transfers with institutional grade security and real-time settlement.</p>
                        </header>

                        <div>
                            <TransferForm />
                        </div>
                    </div>

                    <div className="mt-24 -mx-6 md:-mx-12">
                        <Footer />
                    </div>
                </div>
            </div>
        </main>
    )
}
