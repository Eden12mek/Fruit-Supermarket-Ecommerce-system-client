import React from 'react'
import Swal from 'sweetalert2'
import SummaryApi from '../common'

const AdminDeleteCategory = ({ categoryData, onClose, fetchData }) => {
  const handleDeleteCategory = async () => {
    try {
      const response = await fetch(SummaryApi.deleteCategory.url, {
        method: SummaryApi.deleteCategory.method,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          _id: categoryData._id  // Changed from categoryId to _id to match backend
        })
      })

      const data = await response.json()

      if (data.success) {
        Swal.fire({
          title: 'Deleted!',
          text: data.message,
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          fetchData()
          onClose()
        })
      } else {
        throw new Error(data.message)
      }
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: error.message || 'An error occurred while deleting the category',
        icon: 'error',
        confirmButtonText: 'OK'
      })
    }
  }

  React.useEffect(() => {
    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete "${categoryData?.categoryName}". This action cannot be undone!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        handleDeleteCategory()
      } else {
        onClose()
      }
    })
  }, [])

  return null
}

export default AdminDeleteCategory