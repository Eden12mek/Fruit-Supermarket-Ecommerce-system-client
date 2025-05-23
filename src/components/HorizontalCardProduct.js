import React, { useContext, useEffect, useRef, useState } from 'react'
import fetchCategoryWiseProduct from '../helpers/fetchCategoryWiseProduct'
import displayINRCurrency from '../helpers/displayCurrency'
import { FaAngleLeft, FaAngleRight, FaStar, FaRegStar, FaStarHalfAlt, FaShoppingCart } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import addToCart from '../helpers/addToCart'
import Context from '../context'

const HorizontalCardProduct = ({ category, heading }) => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const loadingList = new Array(4).fill(null)
    const scrollElement = useRef()
    const { fetchUserAddToCart } = useContext(Context)

    const handleAddToCart = async (e, id) => {
        e.preventDefault()
        await addToCart(e, id)
        fetchUserAddToCart()
    }

    const fetchData = async () => {
        setLoading(true)
        const categoryProduct = await fetchCategoryWiseProduct(category)
        setLoading(false)
        setData(categoryProduct?.data || [])
    }

    useEffect(() => {
        fetchData()
    }, [category])

    const scrollRight = () => {
        scrollElement.current.scrollLeft += 320
    }

    const scrollLeft = () => {
        scrollElement.current.scrollLeft -= 320
    }

    const renderRatingStars = () => {
        return (
            <div className="flex items-center">
                {[...Array(4)].map((_, i) => (
                    <FaStar key={`full-${i}`} className="text-yellow-400 text-sm" />
                ))}
                <FaStarHalfAlt className="text-yellow-400 text-sm" />
                
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 my-8 relative">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">{heading}</h2>
                <div className="flex gap-2">
                    <button 
                        className="bg-white p-2 rounded-full shadow-md hover:bg-gray-50 transition-colors"
                        onClick={scrollLeft}
                    >
                        <FaAngleLeft className="text-gray-600" />
                    </button>
                    <button 
                        className="bg-white p-2 rounded-full shadow-md hover:bg-gray-50 transition-colors"
                        onClick={scrollRight}
                    >
                        <FaAngleRight className="text-gray-600" />
                    </button>
                </div>
            </div>

            <div 
                className="flex items-stretch gap-6 overflow-x-auto scroll-smooth scrollbar-hide pb-4"
                ref={scrollElement}
            >
                {loading ? (
                    loadingList.map((_, index) => (
                        <div key={index} className="flex-shrink-0 w-72 h-48 bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
                            <div className="flex h-full">
                                <div className="w-1/3 bg-gray-200"></div>
                                <div className="w-2/3 p-4 flex flex-col justify-between">
                                    <div>
                                        <div className="h-5 bg-gray-200 rounded mb-2 w-3/4"></div>
                                        <div className="h-4 bg-gray-200 rounded mb-3 w-1/2"></div>
                                    </div>
                                    <div>
                                        <div className="flex mb-2">
                                            {[...Array(5)].map((_, i) => (
                                                <div key={i} className="w-4 h-4 bg-gray-200 rounded-full mr-1"></div>
                                            ))}
                                        </div>
                                        <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                                        <div className="h-8 bg-gray-300 rounded-full"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    data.map((product) => (
                        <Link 
                            to={`product/${product?._id}`} 
                            key={product?._id}
                            className="flex-shrink-0 w-72 h-48 bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 border border-gray-100"
                        >
                            <div className="flex h-full">
                                <div className="w-1/3 bg-gray-100 flex items-center justify-center p-2">
                                    <img 
                                        src={product.productImage[0]} 
                                        className="object-contain h-full transition-transform duration-300 hover:scale-105"
                                        alt={product.productName}
                                    />
                                </div>
                                <div className="w-2/3 p-4 flex flex-col justify-between">
                                    <div>
                                        <h3 className="font-semibold text-gray-800 capitalize line-clamp-2 mb-1">
                                            {product.productName}
                                        </h3>
                                        <p className="text-xs text-gray-500 capitalize mb-2">
                                            {product.category}
                                        </p>
                                        {renderRatingStars()}
                                    </div>
                                    <div>
                                        <div className="flex items-center mb-2">
                                            <span className="text-lg font-bold text-red-600">
                                                {displayINRCurrency(product.sellingPrice)}
                                            </span>
                                            
                                        </div>
                                        <button 
                                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-full flex items-center justify-center gap-2 transition-all"
                                            onClick={(e) => handleAddToCart(e, product._id)}
                                        >
                                            <FaShoppingCart className="text-sm" />
                                            <span className="text-sm font-medium">Add to Cart</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    )
}

export default HorizontalCardProduct