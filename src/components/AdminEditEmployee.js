import React, { useState } from 'react';
import SummaryApi from '../common';
import { toast } from 'react-toastify';

const AdminEditEmployee = ({ userData, onClose, fetchdata }) => {
    const [data, setData] = useState({
        name: userData.name || "",
        email: userData.email || "",
        profilePic: userData.profilePic || "",
        role: userData.role || "ADMIN",
    });
    
    const [loading, setLoading] = useState(false);

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        if (!data.name || !data.email) {
            toast.error("Please fill all required fields");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(SummaryApi.updateUser.url, {
                method: SummaryApi.updateUser.method,
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...data,
                    userId: userData._id
                })
            });
            
            const responseData = await response.json();
            
            if (responseData.success) {
                toast.success("Employee updated successfully!");
                fetchdata();
                onClose();
            } else {
                toast.error(responseData.message);
            }
        } catch (error) {
            toast.error(error.message || "Failed to update employee");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Edit Employee</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        &times;
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Name *
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={data.name}
                            onChange={handleOnChange}
                            className="w-full p-2 border rounded-md"
                            required
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email *
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={data.email}
                            onChange={handleOnChange}
                            className="w-full p-2 border rounded-md"
                            required
                            disabled
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Profile Picture URL
                        </label>
                        <input
                            type="text"
                            name="profilePic"
                            value={data.profilePic}
                            onChange={handleOnChange}
                            className="w-full p-2 border rounded-md"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Role
                        </label>
                        <select
                            name="role"
                            value={data.role}
                            onChange={handleOnChange}
                            className="w-full p-2 border rounded-md"
                            required
                        >
                            <option value="ADMIN">Admin</option>
                            <option value="GENERAL">General</option>
                        </select>
                    </div>
                    
                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                            disabled={loading}
                        >
                            {loading ? 'Updating...' : 'Update Employee'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminEditEmployee;