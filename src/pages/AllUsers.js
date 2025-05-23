import React, { useEffect, useState } from "react";
import SummaryApi from "../common";
import { toast } from "react-toastify";
import moment from "moment";
import { MdDelete, MdModeEdit } from "react-icons/md";
import { FaFilter, FaSort, FaUserPlus } from "react-icons/fa";
import ChangeUserRole from "../components/ChangeUserRole";
import AdminDeleteUser from "../components/AdminDeleteUser";
import AddEmployee from "../components/AddEmployee";
import AdminEditEmployee from "../components/AdminEditEmployee";

const AllUsers = ({ data, fetchdata }) => {
  const [allUser, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [selectedRole, setSelectedRole] = useState("all");
  const [openUpdateRole, setOpenUpdateRole] = useState(false);
  const [deleteUser, setDeleteUser] = useState(false);
  const [openAddEmployee, setOpenAddEmployee] = useState(false);
  const [openEditEmployee, setOpenEditEmployee] = useState(false);
  const [updateUserDetails, setUpdateUserDetails] = useState({
    email: "",
    firstName: "",
    lastName: "",
    role: "",
    _id: "",
  });
  const [expandedRows, setExpandedRows] = useState([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Calculate pagination
  const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);
  const indexOfLastUser = currentPage * rowsPerPage;
  const indexOfFirstUser = indexOfLastUser - rowsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  // Toggle row expansion
  const toggleRow = (userId) => {
    if (expandedRows.includes(userId)) {
      setExpandedRows(expandedRows.filter(id => id !== userId));
    } else {
      setExpandedRows([...expandedRows, userId]);
    }
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    setExpandedRows([]); 
  };

  // Handle rows per page change
  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
    setExpandedRows([]); 
  };

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
    setExpandedRows([]); 
  }, [filteredUsers]);

  // Update the edit button click handler
  const handleEditClick = (e, user) => {
    e.stopPropagation(); 
    setUpdateUserDetails(user);
    setOpenEditEmployee(true);
  };

  const fetchAllUsers = async () => {
    const fetchData = await fetch(SummaryApi.allUser.url, {
      method: SummaryApi.allUser.method,
      credentials: "include",
    });

    const dataResponse = await fetchData.json();

    if (dataResponse.success) {
      setAllUsers(dataResponse.data);
    }

    if (dataResponse.error) {
      toast.error(dataResponse.message);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  // Apply filters, search, and sorting
  useEffect(() => {
    let results = [...allUser];

    // apply search filter
    if (searchTerm) {
      results = results.filter((user) =>
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // apply role filter
    if (selectedRole !== "all") {
      results = results.filter((user) => user.role === selectedRole);
    }

    // apply sorting with date and selling price
    switch (sortOption) {
      case "a-z":
        results.sort((a, b) =>
          `${a.firstName} ${a.lastName}`.toLowerCase().localeCompare(`${b.firstName} ${b.lastName}`.toLowerCase())
        );
        break;
      case "z-a":
        results.sort((a, b) =>
          `${b.firstName} ${b.lastName}`.toLowerCase().localeCompare(`${a.firstName} ${a.lastName}`.toLowerCase())
        );
        break;
      case "newest":
        results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "oldest":
        results.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      default:
        break;
    }
    setFilteredUsers(results);
  }, [allUser, searchTerm, selectedRole, sortOption]);

  // Extract unique roles
  const roles = ["all", ...new Set(allUser.map((user) => user.role))];

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white py-2 px-4 flex justify-between items-center shadow-sm">
        <h2 className="text-xl font-bold text-gray-800">User Management</h2>
        <button
          className="flex items-center gap-2 border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all py-1 px-3 rounded-full"
          onClick={() => setOpenAddEmployee(true)}
        >
          <FaUserPlus/>
          Add Employee
        </button>
      </div>
      <div className="p-4 space-y-4">
        <div className="flex justify-end">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by name..."
                className="w-full p-2 border rounded-md"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <select
                className="p-2 pr-8 border rounded-md appearance-none w-full bg-white"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
              >
                <option value="all">All Roles</option>
                {roles
                  .filter((rol) => rol !== "all")
                  .map((role) => (
                    <option key={role} value={role}>
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </option>
                  ))}
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500">
                <FaFilter />
              </div>
            </div>

            {/* Sort Options */}
            <div className="relative">
              <select
                className="p-2 pr-8 border rounded-md appearance-none w-full bg-white"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="a-z">A-Z (Name)</option>
                <option value="z-a">Z-A (Name)</option>
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500">
                <FaSort />
              </div>
            </div>
            {/* Rows per page selector */}
            <div className="flex items-center">
              <span className="mr-2 text-sm text-gray-600">Rows per page:</span>
              <select
                value={rowsPerPage}
                onChange={handleRowsPerPageChange}
                className="p-1 border rounded text-sm"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>
        </div>
        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    #
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentUsers.length > 0 ? (
                  currentUsers.map((user, index) => (
                    <React.Fragment key={user._id}>
                      <tr 
                        className="hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => toggleRow(user._id)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {(currentPage - 1) * rowsPerPage + index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="text-sm font-medium text-gray-900">
                              {user?.firstName} {user?.lastName}
                            </div>
                            
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user?.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                            user.role === 'employee' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {user?.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {moment(user?.createdAt).format("MMM D, YYYY")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={(e) => handleEditClick(e, user)}
                              className="text-gray-500 hover:text-blue-700 p-1 rounded-md hover:bg-blue-50"
                              title="Edit user"
                            >
                              <MdModeEdit size={18} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setUpdateUserDetails(user);
                                setDeleteUser(true);
                              }}
                              className="text-gray-500 hover:text-red-600 p-1 rounded-md hover:bg-red-50"
                              title="Delete user"
                            >
                              <MdDelete size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                      {expandedRows.includes(user._id) && (
                        <tr className="bg-gray-50">
                          <td colSpan="6" className="px-6 py-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                              <div>
                                <h3 className="font-medium text-gray-900 mb-2">User Details</h3>
                                <div className="space-y-2 text-sm text-gray-600">
                                  <p><span className="font-medium">Full Name:</span> {user.firstName} {user.lastName}</p>
                                  <p><span className="font-medium">Email:</span> {user.email}</p>
                                  <p><span className="font-medium">Role:</span> <span className="capitalize">{user.role}</span></p>
                                </div>
                              </div>
                              <div>
                                <h3 className="font-medium text-gray-900 mb-2">Additional Information</h3>
                                <div className="space-y-2 text-sm text-gray-600">
                                  <p><span className="font-medium">Account Created:</span> {moment(user.createdAt).format("MMMM Do YYYY, h:mm a")}</p>
                                  {/* Add more user details here as needed */}
                                  <p><span className="font-medium">Last Updated:</span> {moment(user.updatedAt).format("MMMM Do YYYY, h:mm a")}</p>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Table footer */}
          <div className="bg-gray-50 px-6 py-3 flex flex-col md:flex-row items-center justify-between border-t border-gray-200">
            <div className="text-sm text-gray-500 mb-2 md:mb-0">
              Showing <span className="font-medium">{indexOfFirstUser + 1}</span> to{' '}
              <span className="font-medium">
                {Math.min(indexOfLastUser, filteredUsers.length)}
              </span>{' '}
              of <span className="font-medium">{filteredUsers.length}</span> users
            </div>

            {/* Pagination */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-md border ${
                  currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Previous
              </button>

              <div className="flex space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-1 rounded-md border ${
                        currentPage === pageNum
                          ? 'bg-blue-500 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || totalPages === 0}
                className={`px-3 py-1 rounded-md border ${
                  currentPage === totalPages || totalPages === 0
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {openAddEmployee && (
        <AddEmployee
          onClose={() => setOpenAddEmployee(false)}
          fetchdata={fetchAllUsers}
        />
      )}

      {openEditEmployee && (
        <AdminEditEmployee
          userData={updateUserDetails}
          onClose={() => setOpenEditEmployee(false)}
          fetchdata={fetchAllUsers}
        />
      )}

      {openUpdateRole && (
        <ChangeUserRole
          onClose={() => setOpenUpdateRole(false)}
          name={updateUserDetails.name}
          email={updateUserDetails.email}
          role={updateUserDetails.role}
          userId={updateUserDetails._id}
          callFunc={fetchAllUsers}
        />
      )}

      {deleteUser && (
        <AdminDeleteUser
          userData={updateUserDetails}
          onClose={() => setDeleteUser(false)}
          fetchdata={fetchAllUsers}
        />
      )}
    </div>
  );
};

export default AllUsers;