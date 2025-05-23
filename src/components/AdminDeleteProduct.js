import React, {useEffect} from 'react'
import Swal from 'sweetalert2';
import SummaryApi from '../common';



const AdminDeleteProduct = ({ productData, onClose, fetchdata }) => {
  useEffect(() => {
    const handleDeleteProduct = async () => {
      try {
        const response = await fetch(SummaryApi.deleteProduct.url, {
          method: SummaryApi.deleteProduct.method,
          credentials: 'include',
          headers: {
             "content-type" : "application/json"
          },
          body: JSON.stringify({
            productId: productData._id
          })
        });

        const data = await response.json();

        if (data.success) {
          Swal.fire({
            title: 'Deleted!',
            text: data.message,
            icon: 'success',
            confirmButtonText: 'OK'
          }).then(() => {
            fetchdata(); // Refresh the product list
            onClose(); // Close the modal
          });
        } else {
          Swal.fire({
            title: 'Error!',
            text: data.message,
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      } catch (error) {
        Swal.fire({
          title: 'Error!',
          text: 'An error occurred while deleting the product',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    };

    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete "${productData.productName}". This action cannot be undone!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        handleDeleteProduct();
      } else {
        onClose(); // Close the modal if cancelled
      }
    });

  }, [productData, onClose, fetchdata]);

  return null; // This component doesn't render anything itself
};

export default AdminDeleteProduct