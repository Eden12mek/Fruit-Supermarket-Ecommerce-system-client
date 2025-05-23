import React, { useState, useEffect } from "react";
import SummaryApi from "../common";
import { toast } from "react-toastify";

const AddEmployee = ({ onClose, fetchdata }) => {
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    profilePic: "",
    phoneNumber: "",
    role: "ADMIN", // Default role is ADMIN (fixed)
  });
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);

  // fetch all roles
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch(SummaryApi.allRole.url, {
          method: SummaryApi.allRole.method,
          credentials: "include",
        });
        const responseData = await response.json();
        if (responseData.success) {
          setRoles(responseData.data);
        } else {
          toast.error(responseData.message || "Failed to fetch roles");
        }
      } catch (error) {
        toast.error("Error fetching roles: " + error.message);
      }
    };

    fetchRoles();
  }, []);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (
      !data.firstName ||
      !data.lastName ||
      !data.email ||
      !data.password ||
      !data.phoneNumber
    ) {
      toast.error("Please fill all required fields");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(SummaryApi.signUP.url, {
        method: SummaryApi.signUP.method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
        }),
      });

      const responseData = await response.json();

      if (responseData.success) {
        toast.success("Employee added successfully!");
        fetchdata();
        onClose();
      } else {
        toast.error(responseData.message);
      }
    } catch (error) {
      toast.error(error.message || "Failed to add employee");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl text-center font-bold w-full">Add New Employee</h2>
          <button
            onClick={onClose}
            className="w-fit ml-auto text-2xl hover:text-red-600 cursor-pointer"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
      <input
        type="text"
        name="firstName"
        value={data.firstName}
        onChange={handleOnChange}
        className="w-full px-3 py-1.5 text-sm border rounded-md"
        required
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
      <input
        type="text"
        name="lastName"
        value={data.lastName}
        onChange={handleOnChange}
        className="w-full px-3 py-1.5 text-sm border rounded-md"
        required
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
      <input
        type="email"
        name="email"
        value={data.email}
        onChange={handleOnChange}
        className="w-full px-3 py-1.5 text-sm border rounded-md"
        required
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
      <input
        type="text"
        name="phoneNumber"
        value={data.phoneNumber}
        onChange={handleOnChange}
        className="w-full px-3 py-1.5 text-sm border rounded-md"
        required
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
      <input
        type="password"
        name="password"
        value={data.password}
        onChange={handleOnChange}
        className="w-full px-3 py-1.5 text-sm border rounded-md"
        required
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture URL</label>
      <input
        type="text"
        name="profilePic"
        value={data.profilePic}
        onChange={handleOnChange}
        className="w-full px-3 py-1.5 text-sm border rounded-md"
      />
    </div>

    <div className="md:col-span-2">
      <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
      <select
        name="role"
        value={data.role}
        onChange={handleOnChange}
        className="w-full px-3 py-1.5 text-sm border rounded-md"
        required
      >
        <option value="" disabled>Select Role</option>
        {roles.map((role) => (
          <option key={role._id} value={role.roleName}>{role.roleName}</option>
        ))}
      </select>
    </div>
  </div>

  <div className="flex justify-end space-x-3 pt-4">
    <button
      type="submit"
      className="px-4 py-2 text-sm bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:opacity-50"
      disabled={loading}
    >
      {loading ? "Adding..." : "Add Employee"}
    </button>
  </div>
</form>

      </div>
    </div>
  );
};

export default AddEmployee;
