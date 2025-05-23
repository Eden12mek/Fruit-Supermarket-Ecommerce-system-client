import React, { useEffect, useState } from 'react'
import { CgClose } from "react-icons/cg";
import { toast } from 'react-toastify'
import SummaryApi from '../common'

const AdminEditCategory = ({ categoryData, onClose, fetchData }) => {
  const [data, setData] = useState({
    categoryName: ''
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if(categoryData) {
      setData({
        categoryName: categoryData.categoryName,
        _id: categoryData._id
      })
    }
  }, [categoryData])

  const handleOnChange = (e) => {
    const { name, value } = e.target
    setData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const response = await fetch(SummaryApi.updateCategory.url, {
        method: SummaryApi.updateCategory.method,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      
      const responseData = await response.json()
      
      if (responseData.success) {
        toast.success(responseData.message)
        fetchData()
        onClose()
      } else {
        toast.error(responseData.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='fixed w-full h-full bg-slate-200 bg-opacity-35 top-0 left-0 right-0 bottom-0 flex justify-center items-center z-50'>
      <div className='bg-white p-4 rounded w-full max-w-md'>
        <div className='flex justify-between items-center pb-3'>
          <h2 className='font-bold text-lg'>Edit Category</h2>
          <div className='w-fit ml-auto text-2xl hover:text-red-600 cursor-pointer' onClick={onClose}>
            <CgClose />
          </div>
        </div>

        <form className='grid p-4 gap-4' onSubmit={handleSubmit}>
          <div>
            <label htmlFor='categoryName' className='block text-gray-700 mb-2'>Category Name:</label>
            <input
              type='text'
              id='categoryName'
              name='categoryName'
              placeholder='Enter category name'
              value={data.categoryName}
              onChange={handleOnChange}
              className='w-full p-2 bg-slate-100 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
              required
            />
          </div>

          <button 
            type='submit'
            className='px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-70 w-full'
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Category'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default AdminEditCategory