'use client'
import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, ChevronLeft, ChevronRight } from 'lucide-react'

interface Testimonial {
    name: string
    role: string
    text: string
    avatar: string
}

interface TestimonialCarouselProps {
    testimonials: Testimonial[]
}

export default function TestimonialCarousel({ testimonials }: TestimonialCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [direction, setDirection] = useState(0)

    const slideVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 1000 : -1000,
            opacity: 0
        })
    }

    const swipeConfidenceThreshold = 10000
    const swipePower = (offset: number, velocity: number) => {
        return Math.abs(offset) * velocity
    }

    const paginate = useCallback((newDirection: number) => {
        setDirection(newDirection)
        setCurrentIndex((prevIndex) => (prevIndex + newDirection + testimonials.length) % testimonials.length)
    }, [testimonials.length])

    useEffect(() => {
        const timer = setInterval(() => {
            paginate(1)
        }, 8000)
        return () => clearInterval(timer)
    }, [paginate])

    return (
        <div className="relative w-full max-w-5xl mx-auto overflow-hidden px-4 py-12">
            <div className="relative h-[450px] sm:h-[400px] flex items-center justify-center">
                <AnimatePresence initial={false} custom={direction}>
                    <motion.div
                        key={currentIndex}
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            x: { type: "spring", stiffness: 300, damping: 30 },
                            opacity: { duration: 0.5 }
                        }}
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={1}
                        onDragEnd={(e, { offset, velocity }) => {
                            const swipe = swipePower(offset.x, velocity.x)

                            if (swipe < -swipeConfidenceThreshold) {
                                paginate(1)
                            } else if (swipe > swipeConfidenceThreshold) {
                                paginate(-1)
                            }
                        }}
                        className="absolute w-full"
                    >
                        <div className="bg-primary-dark/30 border border-gold/10 hover:border-gold/30 p-8 sm:p-12 flex flex-col gap-8 sm:gap-10 transition-all duration-700 group relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gold/20 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-1000" />

                            <div className="flex justify-center gap-1 opacity-60">
                                {[1, 2, 3, 4, 5].map((j) => (
                                    <Star key={j} size={12} className="text-gold fill-gold" />
                                ))}
                            </div>

                            <p className="text-accent/60 text-lg sm:text-2xl leading-[1.6] font-light italic text-center max-w-3xl mx-auto">
                                &ldquo;{testimonials[currentIndex].text}&rdquo;
                            </p>

                            <div className="flex flex-col items-center gap-6 pt-8 border-t border-gold/10">
                                <div className="w-14 h-14 bg-primary border border-gold/20 flex items-center justify-center text-gold font-sans font-light text-sm tracking-widest uppercase">
                                    {testimonials[currentIndex].avatar}
                                </div>
                                <div className="text-center">
                                    <p className="text-accent font-medium text-base tracking-tight">{testimonials[currentIndex].name}</p>
                                    <p className="text-gold/50 text-[10px] uppercase tracking-[0.4em] font-medium mt-1">{testimonials[currentIndex].role}</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Navigation Controls */}
            <div className="flex justify-center items-center gap-8 mt-12">
                <button
                    onClick={() => paginate(-1)}
                    className="w-12 h-12 border border-gold/20 flex items-center justify-center text-gold hover:bg-gold hover:text-primary transition-all group"
                    aria-label="Previous testimonial"
                >
                    <ChevronLeft size={20} className="group-active:scale-90 transition-transform" />
                </button>

                <div className="flex gap-3">
                    {testimonials.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => {
                                setDirection(i > currentIndex ? 1 : -1)
                                setCurrentIndex(i)
                            }}
                            className={`w-2 h-2 rounded-full transition-all duration-500 ${i === currentIndex ? 'bg-gold w-8' : 'bg-gold/20 hover:bg-gold/40'
                                }`}
                            aria-label={`Go to slide ${i + 1}`}
                        />
                    ))}
                </div>

                <button
                    onClick={() => paginate(1)}
                    className="w-12 h-12 border border-gold/20 flex items-center justify-center text-gold hover:bg-gold hover:text-primary transition-all group"
                    aria-label="Next testimonial"
                >
                    <ChevronRight size={20} className="group-active:scale-90 transition-transform" />
                </button>
            </div>
        </div>
    )
}
