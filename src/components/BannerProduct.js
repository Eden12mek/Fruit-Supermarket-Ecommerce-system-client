import React, { useEffect, useState } from 'react';
import { FaChevronRight, FaChevronLeft } from "react-icons/fa";
import { motion, AnimatePresence } from 'framer-motion';

const BannerProduct = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [direction, setDirection] = useState(1);
    const [isHovered, setIsHovered] = useState(false);

    const slides = [
        {
            title: "Seasonal Fruit Harvest",
            subtitle: "Freshly picked organic fruits delivered daily",
            cta: "Shop Seasonal",
            bgColor: "bg-gradient-to-br from-emerald-600 to-teal-500",
            textColor: "text-white",
            fruitIcon: "🍓",
            image: "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
        },
        {
            title: "Summer Fruit Specials",
            subtitle: "20% off on all berries and tropical fruits",
            cta: "View Offers",
            bgColor: "bg-gradient-to-br from-amber-500 to-orange-500",
            textColor: "text-white",
            fruitIcon: "🍍",
            image: "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
        },
        {
            title: "Organic & Local Produce",
            subtitle: "Support local farmers with our farm-to-table selection",
            cta: "Learn More",
            bgColor: "bg-gradient-to-br from-lime-600 to-green-500",
            textColor: "text-white",
            fruitIcon: "🍎",
            image: "https://images.unsplash.com/photo-1603569283847-aa295f0d016a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
        },
        {
            title: "Juicy Citrus Sale",
            subtitle: "Oranges, lemons, and grapefruits at lowest prices",
            cta: "Buy Now",
            bgColor: "bg-gradient-to-br from-yellow-400 to-orange-400",
            textColor: "text-gray-900",
            fruitIcon: "🍊",
            image: "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
        },
        {
            title: "Fresh Smoothie Packs",
            subtitle: "Pre-cut fruit mixes ready for your blender",
            cta: "Try Today",
            bgColor: "bg-gradient-to-br from-purple-500 to-pink-500",
            textColor: "text-white",
            fruitIcon: "🥭",
            image: "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
        }
    ];

    const nextSlide = () => {
        setDirection(1);
        setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    };

    const prevSlide = () => {
        setDirection(-1);
        setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    };

    useEffect(() => {
        const interval = setInterval(() => {
            if (!isHovered) {
                nextSlide();
            }
        }, 5000);
        return () => clearInterval(interval);
    }, [currentSlide, isHovered]);

    const variants = {
        enter: (direction) => ({
            x: direction > 0 ? '100%' : '-100%',
            opacity: 0
        }),
        center: {
            x: 0,
            opacity: 1,
            transition: { duration: 0.5 }
        },
        exit: (direction) => ({
            x: direction < 0 ? '100%' : '-100%',
            opacity: 0,
            transition: { duration: 0.5 }
        })
    };

    const textVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className=" my-1 ">
            <div 
                className="relative h-80 md:h-96 lg:h-[24rem] w-full rounded-2xl overflow-hidden shadow-2xl"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <AnimatePresence custom={direction} initial={false}>
                    <motion.div
                        key={currentSlide}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        className={`absolute inset-0 ${slides[currentSlide].bgColor} flex flex-col md:flex-row items-center justify-between p-8 md:p-12`}
                    >
                        {/* Background image with overlay */}
                        <div className="absolute inset-0 overflow-hidden">
                            <img 
                                src={slides[currentSlide].image} 
                                alt="Fruit background" 
                                className="w-full h-full object-cover opacity-20"
                            />
                            <div className="absolute inset-0 bg-black/20"></div>
                        </div>

                        {/* Text content */}
                        <div className="relative z-10 max-w-2xl space-y-6 text-center md:text-left">
                            <motion.div
                                initial="hidden"
                                animate="visible"
                                variants={textVariants}
                                transition={{ delay: 0.2 }}
                            >
                                <span className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-white/20 backdrop-blur-sm text-white mb-4">
                                    Fresh & Organic
                                </span>
                            </motion.div>
                            
                            <motion.h1 
                                initial="hidden"
                                animate="visible"
                                variants={textVariants}
                                transition={{ delay: 0.3 }}
                                className={`text-4xl md:text-5xl lg:text-6xl font-bold leading-tight ${slides[currentSlide].textColor}`}
                            >
                                {slides[currentSlide].title}
                            </motion.h1>
                            
                            <motion.p 
                                initial="hidden"
                                animate="visible"
                                variants={textVariants}
                                transition={{ delay: 0.4 }}
                                className={`text-lg md:text-xl lg:text-2xl ${slides[currentSlide].textColor} opacity-90`}
                            >
                                {slides[currentSlide].subtitle}
                            </motion.p>
                            
                            <motion.div
                                initial="hidden"
                                animate="visible"
                                variants={textVariants}
                                transition={{ delay: 0.5 }}
                            >
                                <button
                                    className={`mt-6 px-8 py-3 rounded-full font-semibold text-lg transition-all duration-300 flex items-center ${
                                        slides[currentSlide].textColor === "text-white" 
                                            ? "bg-white text-gray-900 hover:bg-gray-100" 
                                            : "bg-gray-900 text-white hover:bg-gray-800"
                                    } shadow-lg hover:shadow-xl`}
                                >
                                    {slides[currentSlide].cta}
                                    <FaChevronRight className="ml-2" />
                                </button>
                            </motion.div>
                        </div>

                        {/* Fruit icon/decoration */}
                        <motion.div 
                            initial={{ scale: 0, rotate: -30 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ delay: 0.6, type: "spring" }}
                            className="hidden md:block relative z-10 text-9xl lg:text-[12rem] opacity-90"
                        >
                            {slides[currentSlide].fruitIcon}
                        </motion.div>
                    </motion.div>
                </AnimatePresence>

                {/* Navigation Arrows */}
                <button 
                    onClick={prevSlide}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg z-10 transition-all hover:scale-110"
                    aria-label="Previous slide"
                >
                    <FaChevronLeft className="text-gray-800 text-xl" />
                </button>
                <button 
                    onClick={nextSlide}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg z-10 transition-all hover:scale-110"
                    aria-label="Next slide"
                >
                    <FaChevronRight className="text-gray-800 text-xl" />
                </button>

                {/* Indicators */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                setDirection(index > currentSlide ? 1 : -1);
                                setCurrentSlide(index);
                            }}
                            className={`w-2.5 h-2.5 rounded-full transition-all ${
                                index === currentSlide 
                                    ? "bg-white w-8" 
                                    : "bg-white/50 hover:bg-white/70"
                            }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BannerProduct;