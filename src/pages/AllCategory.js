import React, { useState, useEffect } from "react";
import AddCategory from "../components/AddCategory";
import { toast } from "react-toastify";
import SummaryApi from "../common";
import { MdModeEditOutline, MdDelete } from "react-icons/md";
import AdminEditCategory from "../components/AdminEditCategory";
import AdminDeleteCategory from "../components/AdminDeleteCategory";


const AllCategory = () => {
  const [allCategory, setAllCategory] = useState([]);
  const [filteredCategory, setFilteredCategory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortOption, setSortOption] = useState("newest");
  const [openAddCategory, setOpenAddCategory] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editCategory, setEditCategory] = useState(false);
  const [deleteCategory, setDeleteCategory] = useState(false);

  const fetchAllCategories = async () => {
    setLoading(true);
    try {
      const response = await fetch(SummaryApi.allCategory.url, {
        method: SummaryApi.allCategory.method,
        credentials: "include",
      });
      const data = await response.json();

      if (data.success) {
        setAllCategory(data.data);
        setFilteredCategory(data.data);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllCategories();
  }, []);

  // Apply filters and sorting whenever dependencies change
  useEffect(() => {
    let results = [...allCategory];

    // Apply search filter
    if (searchTerm) {
      results = results.filter((category) =>
        category.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply sorting
    if (sortOption === "newest") {
      results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortOption === "oldest") {
      results.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }

    setFilteredCategory(results);
  }, [allCategory, searchTerm, sortOption]);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Category Management</h2>
        <button
          className="border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-all py-1 px-3 rounded-full"
          onClick={() => setOpenAddCategory(true)}
        >
          Add Category
        </button>
      </div>

      {/* Search and Filter Section */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="">
          <input
            type="text"
            placeholder="Search categories..."
            className="w-full p-2 border rounded"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        
      </div>
      <div className="relative">
          <select
            className="p-2 pr-8 border rounded-md appearance-none w-full bg-white"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>

      {/* Categories Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">No.</th>
              <th className="px-4 py-2 text-left">Category Name</th>
              <th className="px-4 py-2 text-left">Created At</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="px-4 py-6 text-center">
                  Loading categories...
                </td>
              </tr>
            ) : filteredCategory.length > 0 ? (
              filteredCategory.map((category, index) => (
                <tr key={category._id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3">{category.categoryName}</td>
                  <td className="px-4 py-3">
                    {new Date(category.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditCategory(category._id)}
                        className=" text-gray-600 hover:text-blue-500"
                        title="Edit product"
                      >
                        <MdModeEditOutline size={18} />
                      </button>
                      <button
                        onClick={() => setDeleteCategory(category._id)}
                        className=" text-gray-600 hover:text-red-600"
                        title="Delete product"
                      >
                        <MdDelete size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-4 py-6 text-center">
                  No categories found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Category Modal */}
      {openAddCategory && (
        <AddCategory
          onClose={() => setOpenAddCategory(false)}
          fetchData={fetchAllCategories}
        />
      )}

      {/* Edit Category Modal */}
      {editCategory && (
        <AdminEditCategory
          categoryData={filteredCategory.find((cat) => cat._id === editCategory)}
          onClose={() => setEditCategory(false)}
          fetchData={fetchAllCategories}
        />
      )}

      {/* Delete Category Modal */}
      {deleteCategory && (
        <AdminDeleteCategory
          categoryData={filteredCategory.find((cat) => cat._id === deleteCategory)}
          onClose={() => setDeleteCategory(false)}
          fetchData={fetchAllCategories}  
        />
      )}
      
    </div>
  );
};

export default AllCategory;
