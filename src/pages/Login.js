import React, { useContext, useState } from 'react'
import loginIcons from '../assest/signin2.gif'
import { FaEye, FaEyeSlash, FaEnvelope, FaLock } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import SummaryApi from '../common';
import { toast } from 'react-toastify';
import Context from '../context';

const Login = () => {
    const [showPassword, setShowPassword] = useState(false)
    const [data, setData] = useState({
        email: "",
        password: ""
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const navigate = useNavigate()
    const { fetchUserDetails, fetchUserAddToCart } = useContext(Context)

    const handleOnChange = (e) => {
        const { name, value } = e.target
        setData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const dataResponse = await fetch(SummaryApi.signIn.url, {
                method: SummaryApi.signIn.method,
                credentials: 'include',
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify(data)
            })

            const dataApi = await dataResponse.json()

            if (dataApi.success) {
                toast.success(dataApi.message)
                await fetchUserDetails()
                await fetchUserAddToCart()
                navigate('/')
            } else {
                toast.error(dataApi.message)
            }
        } catch (error) {
            toast.error("Something went wrong. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <section className="h-full bg-gradient-to-br from-green-50 via-lime-50 to-yellow-50 flex items-center justify-center p-4 pt-20 pb-20">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden w-full max-w-md">
                {/* Form Header */}
                <div className="bg-gray-400 py-4 px-6">
                    <h2 className="text-2xl font-bold text-white text-center">Welcome Back</h2>
                </div>

                <div className="p-6">
                    {/* Logo */}
                    <div className="flex flex-col items-center mb-6">
                        <div className="w-20 h-20 mx-auto">
                            <img src={loginIcons} alt="login icons" className="w-full h-full object-contain" />
                        </div>
                    </div>

                    {/* Login Form */}
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div className="space-y-1">
                            <div className="relative">
                                <input
                                    type="email"
                                    placeholder="Email"
                                    name="email"
                                    value={data.email}
                                    onChange={handleOnChange}
                                    required
                                    className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                                />
                                <FaEnvelope className="absolute left-3 top-3.5 text-gray-400" />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Password"
                                    value={data.password}
                                    name="password"
                                    onChange={handleOnChange}
                                    required
                                    className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                                />
                                <FaLock className="absolute left-3 top-3.5 text-gray-400" />
                                <button
                                    type="button"
                                    className="absolute right-3 top-3.5 text-gray-400 hover:text-emerald-600"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                            <Link 
                                to={'/forgot-password'} 
                                className="block w-fit ml-auto text-sm text-emerald-600 hover:text-emerald-800 hover:underline"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        <div className="flex justify-center ">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={` py-1 px-4 border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all rounded-2xl ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {isSubmitting ? 'Logging in...' : 'Login'}
                        </button>
                        </div>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Don't have an account?{' '}
                            <Link
                                to="/sign-up"
                                className="text-emerald-600 hover:text-emerald-800 font-medium hover:underline"
                            >
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Login