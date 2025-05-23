import React, { useEffect } from 'react'
import Swal from 'sweetalert2';
import SummaryApi from '../common';

const AdminDeleteUser = ({ userData, onClose, fetchdata }) => {
  useEffect(() => {
    if (!userData || !userData._id) {
      Swal.fire({
        title: 'Error!',
        text: 'User data is not available',
        icon: 'error',
        confirmButtonText: 'OK'
      }).then(() => {
        onClose();
      });
      return;
    }

    const handleDeleteUser = async () => {
      try {
        const response = await fetch(SummaryApi.deleteUser.url, {
          method: SummaryApi.deleteUser.method,
          credentials: 'include',
          headers: {
            "content-type": "application/json"
          },
          body: JSON.stringify({
            _id: userData._id
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
            fetchdata();
            onClose();
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
        console.error('Delete error:', error);
        Swal.fire({
          title: 'Error!',
          text: error.message || 'An error occurred while deleting the user',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    };

    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete "${userData?.name || 'this user'}". This action cannot be undone!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        handleDeleteUser();
      } else {
        onClose();
      }
    });

  }, [userData, onClose, fetchdata]);

  return null;
};

export default AdminDeleteUser;