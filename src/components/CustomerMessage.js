import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { deleteMessage, getAllMessages } from '../services/message'
import { FaUser, FaEnvelope, FaClock, FaTrash, FaTimes, FaCheck } from 'react-icons/fa'
import { toast } from 'react-toastify'
import ROLE from '../common/role'

const CustomerMessage = () => {
  const dispatch = useDispatch()
  const { messages, loading } = useSelector((state) => state.message)
  const [showConfirm, setShowConfirm] = useState(false)
  const [messageToDelete, setMessageToDelete] = useState(null)

  const user = useSelector(state => state?.user?.user);

  useEffect(() => {
    dispatch(getAllMessages())
  }, [dispatch])

  const handleDeleteClick = (id) => {
    setMessageToDelete(id)
    setShowConfirm(true)
  }

  const handleConfirmDelete = async () => {
    try {
      const success = await dispatch(deleteMessage(messageToDelete))
      if (success) {
        toast.success('Message deleted successfully')
      }
    } catch (error) {
      toast.error('Failed to delete message')
    } finally {
      setShowConfirm(false)
      setMessageToDelete(null)
    }
  }

  const handleCancelDelete = () => {
    setShowConfirm(false)
    setMessageToDelete(null)
  }

  return (
    <div className="p-4 relative">
      <h1 className="text-2xl font-bold mb-6">Customer Messages</h1>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {messages?.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500">No messages found</p>
            </div>
          ) : (
            messages?.map((message) => (
              <div key={message._id} className="bg-white rounded-lg shadow p-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="bg-emerald-100 p-3 rounded-full">
                      <FaUser className="text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{message.name}</h3>
                      <p className="text-sm text-gray-500">{message.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <FaClock />
                    <span>{new Date(message.createdAt).toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="mt-4 pl-14">
                  <h4 className="font-medium text-gray-800">{message.subject}</h4>
                  <p className="mt-2 text-gray-600">{message.message}</p>
                </div>
                {(user?.role === ROLE.ADMIN || user?.role === ROLE.MANAGER) && (
                <div className="mt-4 flex justify-end">
                  <button 
                    onClick={() => handleDeleteClick(message._id)}
                    className="text-red-500 hover:text-red-700 flex items-center gap-1"
                  >
                    <FaTrash />
                    <span>Delete</span>
                  </button>
                </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold">Confirm Deletion</h3>
              <button 
                onClick={handleCancelDelete}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>
            <p className="mb-6">Are you sure you want to delete this message?</p>
            <div className="flex justify-end gap-3">
              
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-2"
              >
                <FaCheck />
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CustomerMessage