import React from 'react'
import displayINRCurrency from '../helpers/displayCurrency';

const AdminProductDetail = ({product, onClose}) => {
const getCategoryName = () => {
    if (!product.category || product.category.length === 0) return 'Uncategorized';
    
    if (Array.isArray(product.category)) {
      if (product.category[0]?.categoryName) {
        return product.category[0].categoryName;
      }
      return 'Multiple Categories';
    }
    
    if (typeof product.category === 'string') {
      return product.category;
    }
    
    if (typeof product.category === 'object') {
      return product.category.categoryName || 'Uncategorized';
    }
    
    return 'Uncategorized';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl text-center font-bold w-full">{product.productName}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-3xl"
            >
              &times;
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div>
              <div className="mb-4">
                <h3 className="font-semibold text-lg mb-2">Main Image</h3>
                <img
                  src={product?.productImage?.[0] || '/placeholder-product.png'}
                  alt={product.productName}
                  className="w-full h-64 object-contain rounded-lg border"
                  onError={(e) => {
                    e.target.src = '/placeholder-product.png'
                  }}
                />
              </div>

              {product.productImage?.length > 1 && (
                <div>
                  <h3 className="font-semibold text-lg mb-2">Additional Images</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {product.productImage.slice(1).map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`${product.productName} ${index + 2}`}
                        className="w-full h-24 object-cover rounded border"
                        onError={(e) => {
                          e.target.src = '/placeholder-product.png'
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="space-y-4">
              <div className="bg-gray-100 rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-2">Main Information</h3>
                <p><span className="font-medium">Category:</span> {getCategoryName()}</p>
                <p><span className="font-medium">Price:</span> {displayINRCurrency(product.sellingPrice)}</p>
                <p><span className="font-medium">Stock:</span> {product.quantity || 0}</p>
              </div>

              <div className="bg-gray-100 rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-2">Description</h3>
                <p>{product.description || 'No description available'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default AdminProductDetail