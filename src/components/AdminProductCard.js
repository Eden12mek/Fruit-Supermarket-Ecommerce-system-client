import React, { useState, useEffect } from "react";
import { MdModeEditOutline, MdDelete } from "react-icons/md";
import AdminEditProduct from "./AdminEditProduct";
import displayINRCurrency from "../helpers/displayCurrency";
import AdminDeleteProduct from "./AdminDeleteProduct";
import SummaryApi from "../common";
import { FaFilter, FaSort, FaSearch } from "react-icons/fa";
import AdminProductDetail from "./AdminProductDetail";
import { useSelector } from "react-redux";
import ROLE from "../common/role";

const AdminProductCard = ({ data, fetchdata, onRowClick }) => {
  const [editProduct, setEditProduct] = useState(false);
  const [deleteProduct, setDeleteProduct] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

    const user = useSelector(state => state?.user?.user);

  const getCategoryName = () => {
    if (!data.category || data.category.length === 0) return "Uncategorized";

    // Handle array of categories
    if (Array.isArray(data.category)) {
      // Return first category's name if it's populated
      if (data.category[0]?.categoryName) {
        return data.category[0].categoryName;
      }
      // If it's just ObjectId references, we can't show names here
      return "Multiple Categories";
    }

    // Handle single category (legacy cases)
    if (typeof data.category === "string") {
      return data.category;
    }

    if (typeof data.category === "object") {
      return data.category.categoryName || "Uncategorized";
    }

    return "Uncategorized";
  };

  const categoryName = getCategoryName();

  const handleEditClick = (e) => {
    e.stopPropagation();
    setEditProduct(true);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setDeleteProduct(true);
  };

  return (
    <>
      <tr
        className="border-b hover:bg-gray-50 cursor-pointer"
        onClick={() => onRowClick(data._id)}
      >
        {" "}
        <td className="p-3 w-24">
          <img
            src={data?.productImage?.[0] || "/placeholder-product.png"}
            className="w-16 h-16 object-cover rounded-md"
            alt={data.productName}
            onError={(e) => {
              e.target.src = "/placeholder-product.png";
            }}
          />
        </td>
        <td className="p-3">
          <p className="font-medium text-gray-800">{data.productName}</p>
        </td>
        <td className="p-3">
          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
            {categoryName}
          </span>
        </td>
        <td className="p-3">
          <span className="font-semibold">
            {displayINRCurrency(data.sellingPrice)}
          </span>
        </td>
        {(user?.role === ROLE.ADMIN || user?.role === ROLE.MANAGER) && (
        <td className="p-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleEditClick}
              className="text-gray-600 hover:text-blue-500"
              title="Edit product"
            >
              <MdModeEditOutline size={18} />
            </button>
            <button
              onClick={handleDeleteClick}
              className="text-gray-600 hover:text-red-600"
              title="Delete product"
            >
              <MdDelete size={18} />
            </button>
          </div>
        </td>
        )}
      </tr>

      
      {editProduct && (
        <AdminEditProduct
          productData={data}
          onClose={() => setEditProduct(false)}
          fetchdata={fetchdata}
        />
      )}
      {deleteProduct && (
        <AdminDeleteProduct
          productData={data}
          onClose={() => setDeleteProduct(false)}
          fetchdata={fetchdata}
        />
      )}
    </>
  );
};

const AdminProductsTable = ({ allProduct, fetchAllProduct }) => {
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortOption, setSortOption] = useState("newest");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productDetails, setProductDetails] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const user = useSelector(state => state?.user?.user);


  const fetchProductDetails = async (productId) => {
    try {
      const response = await fetch(SummaryApi.productDetails.url, {
        method: SummaryApi.productDetails.method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId }),
      });
      const dataResponse = await response.json();
      if (dataResponse.success) {
        setProductDetails(dataResponse.data);
      }
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  const handleRowClick = async (productId) => {
    setSelectedProduct(productId);
    await fetchProductDetails(productId);
  };

  // Apply filters, search, and sorting
  useEffect(() => {
    let results = [...allProduct];

    // apply search filter
    if (searchTerm) {
      results = results.filter((product) =>
        product.productName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // apply category filter
    if (selectedCategory !== "all") {
      results = results.filter(
        (product) => product.category === selectedCategory
      );
    }

    // apply sorting with date and selling price
    switch (sortOption) {
      case "newest":
        results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "oldest":
        results.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case "price-high":
        results.sort((a, b) => b.sellingPrice - a.sellingPrice);
        break;
      case "price-low":
        results.sort((a, b) => a.sellingPrice - b.sellingPrice);
        break;
      default:
        break;
    }
    setFilteredProducts(results);
  }, [allProduct, searchTerm, selectedCategory, sortOption]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300); // 300ms delay

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  // Calculate pagination data
  const totalPages = Math.ceil(filteredProducts.length / rowsPerPage);
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredProducts.slice(indexOfFirstRow, indexOfLastRow);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Handle rows per page change
  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when changing rows per page
  };

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredProducts]);

  const categories = [
    "all",
    ...new Set(allProduct.map((product) => product.category)),
  ];

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden p-4">
      <div className="flex flex-col md:flex-row gap-4 justify-end">
        {/* Search */}
        <div className="flex items-center border rounded-2xl rounded-md px-4 py-2">
          <FaSearch className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search by product name..."
            className="outline-none w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {/* Category Filter */}
        <div className="relative">
          <select
            className="p-2 pr-8 border rounded-md appearance-none w-full bg-white"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((cat, idx) => (
              <option value={cat} key={idx}>{cat}</option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500">
            <FaFilter />
          </div>
        </div>

        {/* Sort Options */}
        <div className="relative ">
          <select
            className="p-2 pr-8 border rounded-md appearance-none w-full bg-white"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="price-high">Price: High to Low</option>
            <option value="price-low">Price: Low to High</option>
          </select>
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500">
            <FaSort />
          </div>
        </div>
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
      {/* Rows per page selector */}
      <div className="flex justify-between items-center mb-4"></div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left text-sm font-semibold text-gray-700">
                Image
              </th>
              <th className="p-3 text-left text-sm capitalize font-semibold text-gray-700">
                Product Name
              </th>
              <th className="p-3 text-left text-sm font-semibold text-gray-700">
                Category
              </th>
              <th className="p-3 text-left text-sm font-semibold text-gray-700">
                Selling Price
              </th>
              {(user?.role === ROLE.ADMIN || user?.role === ROLE.MANAGER) && (
              <th className="p-3 text-left text-sm font-semibold text-gray-700">
                Actions
              </th>
              )}
            </tr>
          </thead>
          <tbody>
            {currentRows.map((product) => (
              <AdminProductCard
                data={product}
                key={product._id}
                fetchdata={fetchAllProduct}
                onRowClick={handleRowClick}
              />
            ))}
          </tbody>
        </table>
      </div>
      {/* Product Count */}
      <div className="text-sm text-gray-500">
        Showing {filteredProducts.length} of {allProduct.length} products
      </div>

      {/* Pagination controls */}
      <div className="flex justify-center mt-4">
        <nav className="inline-flex rounded-md shadow">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded-l-md border ${
              currentPage === 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Previous
          </button>

          {/* Page numbers */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-3 py-1 border-t border-b ${
                currentPage === page
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded-r-md border ${
              currentPage === totalPages
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Next
          </button>
        </nav>
      </div>

      {/* Product Details */}
      {productDetails && (
        <AdminProductDetail
          product={productDetails}
          onClose={() => {
            setSelectedProduct(null);
            setProductDetails(null);
          }}
        />
      )}
    </div>
  );
};

export default AdminProductsTable;
