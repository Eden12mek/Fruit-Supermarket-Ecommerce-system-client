import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { setUserDetails } from '../store/userSlice'
import { CgClose } from "react-icons/cg";
import { MdDelete, MdModeEdit } from "react-icons/md";
import SummaryApi from '../common'

const ManagerProfile = () => {
  const user = useSelector(state => state?.user?.user)
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    profilePic: ''
  })

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        profilePic: user.profilePic || ''
      })
    }
  }, [user])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const response = await fetch(SummaryApi.updateUser.url, {
        method: SummaryApi.updateUser.method,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      
      const data = await response.json()
      
      if (data.success) {
        toast.success(data.message)
        dispatch(setUserDetails(data.data)) 
        setIsEditMode(false)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-120px)]">
        <div className="text-center">Please login to view your profile</div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-120px)] p-2">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl text-center font-bold text-gray-800 w-full">Manager Profile</h2>
          <button 
            onClick={() => setIsEditMode(!isEditMode)}
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            {isEditMode ? <CgClose /> : <MdModeEdit/>}
          </button>
        </div>

        <div className="flex flex-col items-center mb-6">
          {formData.profilePic ? (
            <img 
              src={formData.profilePic} 
              alt="Profile" 
              className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center border-2 border-gray-300">
              <span className="text-4xl text-gray-600">
                {user.name?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
          )}
        </div>

        {isEditMode ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-4">
  <div className="w-1/2">
    <label className="block text-gray-700 mb-1 text-sm">First Name</label>
    <input
      type="text"
      name="firstName"
      value={formData.firstName}
      onChange={handleInputChange}
      className="w-full p-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      required
    />
  </div>
  <div className="w-1/2">
    <label className="block text-gray-700 mb-1 text-sm">Last Name</label>
    <input
      type="text"
      name="lastName"
      value={formData.lastName}
      onChange={handleInputChange}
      className="w-full p-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      required
    />
  </div>
</div>


            <div>
              <label className="block text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
                disabled
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Profile Picture URL</label>
              <input
                type="url"
                name="profilePic"
                value={formData.profilePic}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/profile.jpg"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Role</label>
              <input
                type="text"
                value={user.role || 'user'}
                className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed capitalize"
                disabled
              />
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 text-white py-2 rounded hover:bg-emerald-700 transition-colors disabled:opacity-70"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded">
              <h3 className="text-sm font-semibold text-gray-500">First Name</h3>
              <p className="text-lg text-gray-800">{user.firstName}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <h3 className="text-sm font-semibold text-gray-500">Last Name</h3>
              <p className="text-lg text-gray-800">{user.lastName}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded">
              <h3 className="text-sm font-semibold text-gray-500">Email</h3>
              <p className="text-lg text-gray-800">{user.email}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded">
              <h3 className="text-sm font-semibold text-gray-500">Role</h3>
              <p className="text-lg text-gray-800 capitalize">{user.role || 'user'}</p>
            </div>
          </div>
        )}
        
      </div>
    </div>
  )
}

export default ManagerProfile