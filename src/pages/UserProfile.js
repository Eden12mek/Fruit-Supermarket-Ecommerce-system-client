import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setUserDetails } from "../store/userSlice";
import SummaryApi from "../common";

const UserProfile = () => {
  const user = useSelector((state) => state?.user?.user);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    profilePic: "",
  });
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    profilePic: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        profilePic: user.profilePic || "",
      });
    }
  }, [user]);

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      firstName: "",
      lastName: "",
      email: "",
      profilePic: "",
    };

    // First Name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First Name is required";
      valid = false;
    } else if (formData.firstName.length < 2) {
      newErrors.firstName = "First Name must be at least 2 characters";
      valid = false;
    } else if (formData.firstName.length > 50) {
      newErrors.firstName = "First Name must be less than 50 characters";
      valid = false;
    }
    // Last name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
      valid = false;
    } else if (formData.lastName.length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters";
      valid = false;
    } else if (formData.lastName.length > 50) {
      newErrors.lastName = "Last name must be less than 50 characters";
      valid = false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      valid = false;
    }

    // Profile picture URL validation (optional)
    if (formData.profilePic) {
      try {
        new URL(formData.profilePic); // Validate URL format

        // Check for potentially malicious URLs
        if (
          formData.profilePic.includes("javascript:") ||
          formData.profilePic.includes("data:text/html")
        ) {
          newErrors.profilePic = "Invalid URL format";
          valid = false;
        }
      } catch (e) {
        newErrors.profilePic = "Please enter a valid URL";
        valid = false;
      }
    }

    setErrors(newErrors);
    return valid;
  };

  const handleInputChange = (e) => {
    const { firstName, lastName, value } = e.target;
    setFormData({
      ...formData,
      [firstName]: value,
    });

    // Clear error when user types
    if (errors[firstName]) {
      setErrors({
        ...errors,
        [firstName]: "",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(SummaryApi.updateUser.url, {
        method: SummaryApi.updateUser.method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Add this line
        },
        body: JSON.stringify({
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          profilePic: formData.profilePic || null,
          // Remove userId from here - it should come from auth token
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      toast.success("Profile updated successfully");
      dispatch(setUserDetails(data.data));
      setIsEditMode(false);
    } catch (error) {
      toast.error(error.message || "Error updating profile");
      console.error("Update error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-120px)]">
        <div className="text-center text-gray-600">
          Please login to view your profile
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-120px)] p-4">
      <div className="bg-white rounded-xl shadow-md overflow-hidden w-full max-w-md">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">My Profile</h2>
            <button
              onClick={() => setIsEditMode(!isEditMode)}
              className="px-4 py-2 bg-white text-purple-600 rounded-lg hover:bg-gray-100 transition-colors font-medium"
            >
              {isEditMode ? "Cancel" : "Edit Profile"}
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="flex flex-col items-center mb-6 -mt-16">
            <div className="relative">
              {formData.profilePic ? (
                <img
                  src={formData.profilePic}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/150";
                  }}
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center border-4 border-white shadow-md">
                  <span className="text-4xl text-gray-600">
                    {user.name?.charAt(0).toUpperCase() || "U"}
                  </span>
                </div>
              )}
              {isEditMode && (
                <div className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-purple-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </div>
              )}
            </div>
          </div>

          {isEditMode ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="w-full md:w-1/2">
                  <label className="block text-gray-700 mb-1 font-medium">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.firstName
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-purple-500"
                    }`}
                    required
                    maxLength={50}
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.firstName}
                    </p>
                  )}
                </div>

                <div className="w-full md:w-1/2">
                  <label className="block text-gray-700 mb-1 font-medium">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.lastName
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-purple-500"
                    }`}
                    required
                    maxLength={50}
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-1 font-medium">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 bg-gray-100 cursor-not-allowed ${
                    errors.email
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300"
                  }`}
                  disabled
                />
                <p className="text-gray-500 text-sm mt-1">
                  Contact support to change email
                </p>
              </div>

              <div>
                <label className="block text-gray-700 mb-1 font-medium">
                  Profile Picture URL
                </label>
                <input
                  type="url"
                  name="profilePic"
                  value={formData.profilePic}
                  onChange={handleInputChange}
                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.profilePic
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-purple-500"
                  }`}
                  placeholder="https://example.com/profile.jpg"
                />
                {errors.profilePic && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.profilePic}
                  </p>
                )}
                <p className="text-gray-500 text-xs mt-1">
                  Leave blank to remove profile picture
                </p>
              </div>

              <button
                type="submit"
                className={`w-full py-3 rounded-lg text-white font-medium transition-colors ${
                  loading
                    ? "bg-purple-400"
                    : "bg-purple-600 hover:bg-purple-700"
                }`}
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Saving...
                  </span>
                ) : (
                  "Save Changes"
                )}
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                  Full Name
                </h3>
                <p className="text-lg font-medium text-gray-800 mt-1">
                  {user.firstName + " " + user.lastName}
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                  Email
                </h3>
                <p className="text-lg font-medium text-gray-800 mt-1">
                  {user.email}
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                  Role
                </h3>
                <p className="text-lg font-medium text-gray-800 mt-1 capitalize">
                  {user.role || "user"}
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                  Member Since
                </h3>
                <p className="text-lg font-medium text-gray-800 mt-1">
                  {new Date(user.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
