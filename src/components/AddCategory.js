import React, { useState } from 'react'
import { toast } from 'react-toastify'
import SummaryApi from '../common'

const AddCategory = ({ onClose, fetchData }) => {
  const [categoryName, setCategoryName] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const response = await fetch(SummaryApi.addCategory.url, {
        method: SummaryApi.addCategory.method,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ categoryName })
      })
      
      const data = await response.json()
      
      if (data.success) {
        toast.success(data.message)
        fetchData() // Refresh the category list
        onClose() // Close the modal
        setCategoryName('') // Reset the form
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Add New Category</h2>
          <button 
            onClick={onClose}
            className="w-fit ml-auto text-2xl hover:text-red-600 cursor-pointer"
          >
            &times;
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Category Name</label>
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter category name"
              required
            />
          </div>
          
          <div className="flex justify-end space-x-3">
            
            <button
              type="submit"
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-70"
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddCategory