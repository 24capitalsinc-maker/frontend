'use client'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    if (totalPages <= 1) return null

    const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

    // Helper to determine which pages to show (basic implementation)
    const visiblePages = pages.filter(page => {
        if (totalPages <= 7) return true
        if (page === 1 || page === totalPages) return true
        if (Math.abs(page - currentPage) <= 1) return true
        return false
    })

    return (
        <div className="flex items-center justify-between px-6 md:px-10 py-6 border-t border-gold/10 bg-gold/[0.02]">
            <p className="text-[10px] font-bold text-accent/30 uppercase tracking-[0.2em]">
                Showing Page <span className="text-gold">{currentPage}</span> of <span className="text-gold">{totalPages}</span>
            </p>

            <div className="flex items-center gap-2">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="w-10 h-10 border border-gold/10 flex items-center justify-center text-gold/40 hover:text-gold hover:border-gold/30 disabled:opacity-20 disabled:hover:text-gold/40 disabled:hover:border-gold/10 transition-all"
                >
                    <ChevronLeft size={16} />
                </button>

                <div className="flex items-center gap-1">
                    {pages.map((page, index) => {
                        const isVisible = visiblePages.includes(page)
                        const showEllipsis = index > 0 && isVisible && !visiblePages.includes(pages[index - 1])

                        return (
                            <div key={page} className="flex items-center gap-1">
                                {showEllipsis && <span className="text-accent/20 px-1">...</span>}
                                {isVisible && (
                                    <button
                                        onClick={() => onPageChange(page)}
                                        className={`w-10 h-10 text-[10px] font-bold uppercase tracking-widest transition-all ${currentPage === page
                                                ? 'bg-gold text-primary border border-gold'
                                                : 'text-accent/40 border border-gold/5 hover:border-gold/20 hover:text-accent'
                                            }`}
                                    >
                                        {page}
                                    </button>
                                )}
                            </div>
                        )
                    })}
                </div>

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="w-10 h-10 border border-gold/10 flex items-center justify-center text-gold/40 hover:text-gold hover:border-gold/30 disabled:opacity-20 disabled:hover:text-gold/40 disabled:hover:border-gold/10 transition-all"
                >
                    <ChevronRight size={16} />
                </button>
            </div>
        </div>
    )
}
