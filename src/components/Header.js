import React, { useState, useEffect, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { GrSearch } from "react-icons/gr";
import { FaRegCircleUser, FaChevronDown } from "react-icons/fa6";
import { FaShoppingCart, FaBell, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setUserDetails } from "../store/userSlice";
import Context from "../context";
import ROLE from "../common/role";
import SummaryApi from "../common";
import Logo from "../assest/Ab&Emu logo.png";
import LogoSec from "../assest/Ab&Emu logo 3.png";

const Header = () => {
  const user = useSelector((state) => state?.user?.user);
  const dispatch = useDispatch();
  const [menuDisplay, setMenuDisplay] = useState(false);
  const context = useContext(Context);
  const navigate = useNavigate();
  const searchInput = useLocation();
  const URLSearch = new URLSearchParams(searchInput?.search);
  const searchQuery = URLSearch.getAll("q");
  const [search, setSearch] = useState(searchQuery);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    if (user?._id) {
      const fetchNotifications = async () => {
        try {
          const response = await fetch(
            `${SummaryApi.getNotifications.url}?userId=${user._id}`,
            {
              method: SummaryApi.getNotifications.method,
              credentials: "include",
            }
          );
          const data = await response.json();
          if (data.success) {
            setNotifications(data.notifications);
            setUnreadCount(data.unreadCount);
          }
        } catch (error) {
          console.error("Error fetching notifications:", error);
        }
      };

      fetchNotifications();
      const interval = setInterval(fetchNotifications, 60000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const markAsRead = async (notificationId) => {
    try {
      await fetch(`${SummaryApi.markNotificationRead.url}/${notificationId}`, {
        method: SummaryApi.markNotificationRead.method,
        credentials: "include",
      });
      setNotifications(
        notifications.map((n) =>
          n._id === notificationId ? { ...n, read: true } : n
        )
      );
      setUnreadCount((prev) => prev - 1);
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch(
        `${SummaryApi.markAllNotificationsRead.url}?userId=${user._id}`,
        {
          method: SummaryApi.markAllNotificationsRead.method,
          credentials: "include",
        }
      );
      setNotifications(notifications.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const handleLogout = async () => {
    const fetchData = await fetch(SummaryApi.logout_user.url, {
      method: SummaryApi.logout_user.method,
      credentials: "include",
    });

    const data = await fetchData.json();

    if (data.success) {
      toast.success(data.message);
      dispatch(setUserDetails(null));
      navigate("/");
    }

    if (data.error) {
      toast.error(data.message);
    }
  };

  const handleSearch = (e) => {
    const { value } = e.target;
    setSearch(value);

    if (value) {
      navigate(`/search?q=${value}`);
    } else {
      navigate("/search");
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100 -mb-12">
      {/* Main Header */}
      <div className="px-20 py-1">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center ">
            <img src={LogoSec} alt="Logo" className="h-12 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link
              to="/"
              className="font-medium text-gray-700 hover:text-[#00a78f] transition-colors"
            >
              Home
            </Link>
            <Link
              to="/about-us"
              className="font-medium text-gray-700 hover:text-[#00a78f] transition-colors"
            >
              About Us
            </Link>
            <Link
              to="/contact-us"
              className="font-medium text-gray-700 hover:text-[#00a78f] transition-colors"
            >
              Contact Us
            </Link>
          </nav>

          {/* Search - Desktop */}
          <div className="hidden lg:flex items-center w-full max-w-md mx-4">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#00a78f] focus:border-transparent"
                onChange={handleSearch}
                value={search}
              />
              <GrSearch className="absolute right-3 top-3 text-gray-400" />
            </div>
          </div>

          {/* Icons - Desktop */}
          <div className="hidden lg:flex items-center space-x-6">
            {/* Search Icon - Mobile Trigger */}
            <button
              className="lg:hidden text-gray-600 hover:text-purple-600"
              onClick={() => setSearchOpen(!searchOpen)}
            >
              <GrSearch size={20} />
            </button>

            {/* Notification */}
            {user?._id && user?.role === ROLE.GENERAL && (
              <div className="relative">
                <button
                  className="text-gray-600 hover:text-emerald-600 relative"
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <FaBell size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-50 border border-gray-200">
                    <div className="p-3 border-b border-gray-200 flex justify-between items-center">
                      <h3 className="font-semibold text-gray-800">
                        Notifications
                      </h3>
                      <button
                        onClick={markAllAsRead}
                        className="text-xs text-purple-600 hover:underline"
                      >
                        Mark all as read
                      </button>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map((notification) => (
                          <div
                            key={notification._id}
                            className={`p-3 border-b border-gray-100 ${
                              !notification.read ? "bg-blue-50" : ""
                            }`}
                            onClick={() => {
                              markAsRead(notification._id);
                              navigate(notification.link || "/");
                            }}
                          >
                            <p className="text-sm text-gray-800">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(
                                notification.createdAt
                              ).toLocaleString()}
                            </p>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-center text-gray-500">
                          No notifications
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Cart */}
            {user?._id && (
              <Link
                to="/cart"
                className="text-gray-600 hover:text-emerald relative"
              >
                <FaShoppingCart size={20} />
                {context?.cartProductCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-emerald-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {context?.cartProductCount}
                  </span>
                )}
              </Link>
            )}

            {/* User Profile */}
            {user?._id ? (
              <div className="relative">
                <button
                  className="flex items-center space-x-1 text-gray-600 hover:text-purple-600"
                  onClick={() => setMenuDisplay(!menuDisplay)}
                >
                  {user?.profilePic ? (
                    <img
                      src={user?.profilePic}
                      className="w-8 h-8 rounded-full object-cover border border-gray-200"
                      alt={user?.name}
                    />
                  ) : (
                    <FaRegCircleUser size={20} />
                  )}
                  <FaChevronDown
                    size={12}
                    className={`transition-transform ${
                      menuDisplay ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {menuDisplay && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-200 py-1">
                    {user?.role === ROLE.ADMIN && (
                      <>
                        <Link
                          to="/admin-panel/dashboard"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setMenuDisplay(false)}
                        >
                          Admin Panel
                        </Link>
                        <Link
                          to="/admin-panel/admin-profile"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setMenuDisplay(false)}
                        >
                          My Profile
                        </Link>
                      </>
                    )}
                    {user?.role === ROLE.MANAGER && (
                      <>
                        <Link
                          to="/manager-panel/manager-dashboard"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setMenuDisplay(false)}
                        >
                          Manager Panel
                        </Link>
                        <Link
                          to="/manager-panel/manager-profile"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setMenuDisplay(false)}
                        >
                          My Profile
                        </Link>
                      </>
                    )}
                    {user?.role === ROLE.SALES && (
                      <>
                        <Link
                          to="/sales-panel/sales-dashboard"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setMenuDisplay(false)}
                        >
                          Sales Panel
                        </Link>
                        <Link
                          to="/sales-panel/sales-profile"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setMenuDisplay(false)}
                        >
                          My Profile
                        </Link>
                      </>
                    )}
                    {user?.role === ROLE.GENERAL && (
                      <Link
                        to="/user-profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setMenuDisplay(false)}
                      >
                        My Profile
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        handleLogout();
                        setMenuDisplay(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-t border-gray-200"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-emerald-600 border border-emerald-600 rounded-full hover:bg-emerald-50 transition-colors"
                >
                  Login
                </Link>
                
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-gray-600 hover:text-purple-600"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <FaTimes size={24} />
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Search - Shows when searchOpen is true */}
        {searchOpen && (
          <div className="lg:hidden mt-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                onChange={handleSearch}
                value={search}
              />
              <GrSearch className="absolute right-3 top-3 text-gray-400" />
              <button
                className="absolute right-10 top-3 text-gray-400 hover:text-gray-600"
                onClick={() => setSearchOpen(false)}
              >
                <FaTimes size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-b border-gray-200">
            <nav className="flex flex-col space-y-3">
              <Link
                to="/"
                className="font-medium text-gray-700 hover:text-purple-600 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/about-us"
                className="font-medium text-gray-700 hover:text-purple-600 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                About Us
              </Link>
              <Link
                to="/contact-us"
                className="font-medium text-gray-700 hover:text-purple-600 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact Us
              </Link>
            </nav>

            <div className="mt-4 flex items-center justify-between">
              {user?._id ? (
                <>
                  <div className="flex items-center space-x-4">
                    <Link
                      to="/cart"
                      className="text-gray-600 hover:text-purple-600 relative"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <FaShoppingCart size={20} />
                      {context?.cartProductCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {context?.cartProductCount}
                        </span>
                      )}
                    </Link>
                    {user?.role === ROLE.GENERAL && (
                      <button
                        className="text-gray-600 hover:text-purple-600 relative"
                        onClick={() => setShowNotifications(!showNotifications)}
                      >
                        <FaBell size={20} />
                        {unreadCount > 0 && (
                          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {unreadCount}
                          </span>
                        )}
                      </button>
                    )}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-full hover:bg-purple-700 transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="w-full flex space-x-3">
                  <Link
                    to="/login"
                    className="flex-1 px-4 py-2 text-sm font-medium text-center text-purple-600 border border-purple-600 rounded-full hover:bg-purple-50 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="flex-1 px-4 py-2 text-sm font-medium text-center text-white bg-purple-600 rounded-full hover:bg-purple-700 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Notifications */}
      {showNotifications && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
          <div className="bg-white w-4/5 h-full overflow-y-auto">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="font-semibold text-lg">Notifications</h3>
              <button
                onClick={() => {
                  setShowNotifications(false);
                  markAllAsRead();
                }}
                className="text-purple-600"
              >
                <FaTimes size={20} />
              </button>
            </div>
            <div className="divide-y divide-gray-200">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div
                    key={notification._id}
                    className={`p-4 ${!notification.read ? "bg-blue-50" : ""}`}
                    onClick={() => {
                      markAsRead(notification._id);
                      navigate(notification.link || "/");
                      setShowNotifications(false);
                    }}
                  >
                    <p className="text-gray-800">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500">
                  No notifications
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
