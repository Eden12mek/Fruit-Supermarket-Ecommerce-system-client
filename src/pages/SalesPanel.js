import React , { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { BiSolidMessageRounded } from "react-icons/bi";
import { FaUserCircle, FaTachometerAlt, FaBoxes, FaUser, FaCreditCard } from "react-icons/fa";
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import ROLE from '../common/role';

const SalesPanel = () => {
    const user = useSelector(state => state?.user?.user)
    const navigate = useNavigate()
    const location = useLocation()


    useEffect(()=>{
        if(user?.role !== ROLE.SALES){
            navigate("/")
        }
    },[user])
      // Check if current route matches nav link
    const isActive = (path) => {
        return location.pathname === `/sales-panel/${path}` || 
               location.pathname.startsWith(`/sales-panel/${path}/`)
    }


  return (
      <div className='min-h-[calc(100vh-110px)] md:flex hidden -mt-4'>
  
      <aside className='bg-white min-h-full  w-full  max-w-60 customShadow'>
              <div className='h-32  flex justify-center items-center flex-col'>
                  <div className='text-5xl cursor-pointer relative flex justify-center'>
                      {
                      user?.profilePic ? (
                          <img src={user?.profilePic} className='w-20 h-20 rounded-full' alt={user?.name} />
                      ) : (
                          <FaUserCircle/>
                      )
                      }
                  </div>
                  <p className='capitalize text-lg font-semibold'>{user?.name}</p>
                  <p className='text-sm'>{user?.role}</p>
              </div>
  
               {/***navigation */}       
              <nav className='flex-1 p-4 space-y-1'>
            <Link 
              to={"sales-dashboard"} 
              className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                isActive('dashboard') 
                  ? 'bg-[#edfcf2] text-[#00a78f] font-medium' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <FaTachometerAlt className="mr-3 text-lg opacity-70" />
              Dashboard
              {isActive('dashboard') && (
                <span className="ml-auto w-1.5 h-1.5 bg-[#00a78f] rounded-full"></span>
              )}
            </Link>
            
            <Link 
              to={"all-products"} 
              className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                isActive('all-products') 
                  ? 'bg-[#edfcf2] text-[#00a78f] font-medium' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <FaBoxes className="mr-3 text-lg opacity-70" />
              Products
              {isActive('all-products') && (
                <span className="ml-auto w-1.5 h-1.5 bg-[#00a78f] rounded-full"></span>
              )}
            </Link>
            
            <Link 
              to={"all-payments"} 
              className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                isActive('all-payments') 
                  ? 'bg-[#edfcf2] text-[#00a78f] font-medium' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <FaCreditCard className="mr-3 text-lg opacity-70" />
              Payments
              {isActive('all-payments') && (
                <span className="ml-auto w-1.5 h-1.5 bg-[#00a78f] rounded-full"></span>
              )}
            </Link>
              <Link 
              to={"customer-message"} 
              className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                isActive('customer-message') 
                  ? 'bg-[#edfcf2] text-[#00a78f] font-medium' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <BiSolidMessageRounded className="mr-3 text-lg opacity-70" />
              Messages
              {isActive('customer-message') && (
                <span className="ml-auto w-1.5 h-1.5 bg-[#00a78f] rounded-full"></span>
              )}
            </Link>
          </nav> 
      </aside>
  
      <main className='w-full h-full p-2'>
          <Outlet/>
      </main>
  </div>
  )
}

export default SalesPanel