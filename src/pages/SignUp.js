import React, { useState } from 'react'
import loginIcons from '../assest/signin2.gif'
import { FaEye, FaEyeSlash, FaUser, FaEnvelope, FaPhone, FaLock, FaCamera } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import imageTobase64 from '../helpers/imageTobase64';
import SummaryApi from '../common';
import { toast } from 'react-toastify';

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [data, setData] = useState({
    email: "",
    password: "",
    phoneNumber: "",
    firstName: "",
    lastName: "",
    confirmPassword: "",
    profilePic: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  const handleOnChange = (e) => {
    const { name, value } = e.target
    setData((preve) => ({
      ...preve,
      [name]: value
    }))
  }

  const handleUploadPic = async (e) => {
    const file = e.target.files[0]
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size should be less than 2MB")
      return
    }
    
    const imagePic = await imageTobase64(file)
    setData(preve => ({
      ...preve,
      profilePic: imagePic
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    if (data.password !== data.confirmPassword) {
      toast.error("Passwords don't match")
      setIsSubmitting(false)
      return
    }

    try {
      const dataResponse = await fetch(SummaryApi.signUP.url, {
        method: SummaryApi.signUP.method,
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify(data)
      })

      const dataApi = await dataResponse.json()

      if (dataApi.success) {
        toast.success(dataApi.message)
        navigate("/login")
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
    <section className="h-full bg-gradient-to-br from-green-50 via-lime-50 to-yellow-50 flex items-center justify-center p-4 pt-10 pb-10">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden w-full max-w-md">
        {/* Form Header */}
        <div className="bg-gray-400 py-4 px-6">
          <h2 className="text-2xl font-bold text-white text-center">Create Your Account</h2>
        </div>

        <div className="p-6">
          {/* Profile Picture Upload */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative w-24 h-24 rounded-full border-4 border-white shadow-md mb-3">
              <img 
                src={data.profilePic || loginIcons} 
                alt="Profile" 
                className="w-full h-full object-cover rounded-full"
              />
              <label className="absolute bottom-0 right-0 bg-emerald-600 text-white p-2 rounded-full cursor-pointer hover:bg-emerald-700 transition-colors">
                <FaCamera className="text-sm" />
                <input 
                  type="file" 
                  className="hidden" 
                  onChange={handleUploadPic}
                  accept="image/*"
                />
              </label>
            </div>
            <p className="text-sm text-gray-500">Click to upload profile picture</p>
          </div>

          {/* Sign Up Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="First Name"
                    name="firstName"
                    value={data.firstName}
                    onChange={handleOnChange}
                    required
                    className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  />
                  <FaUser className="absolute left-3 top-3 text-gray-400" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Last Name"
                    name="lastName"
                    value={data.lastName}
                    onChange={handleOnChange}
                    required
                    className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  />
                  <FaUser className="absolute left-3 top-3 text-gray-400" />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div className="space-y-1">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Email"
                  name="email"
                  value={data.email}
                  onChange={handleOnChange}
                  required
                  className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                />
                <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="relative">
                <input
                  type="tel"
                  placeholder="Phone Number"
                  name="phoneNumber"
                  value={data.phoneNumber}
                  onChange={handleOnChange}
                  required
                  className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                />
                <FaPhone className="absolute left-3 top-3 text-gray-400" />
              </div>
            </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={data.password}
                  name="password"
                  onChange={handleOnChange}
                  required
                  minLength="6"
                  className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                />
                <FaLock className="absolute left-3 top-3 text-gray-400" />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-gray-400 hover:text-indigo-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={data.confirmPassword}
                  name="confirmPassword"
                  onChange={handleOnChange}
                  required
                  minLength="6"
                  className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                />
                <FaLock className="absolute left-3 top-3 text-gray-400" />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-gray-400 hover:text-indigo-600"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            </div>

            <div className="flex justify-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`py-1 px-4 border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all rounded-2xl mt-5 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? 'Creating Account...' : 'Sign Up'}
            </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-emerald-600 hover:text-emerald-800 font-medium hover:underline"
              >
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SignUp