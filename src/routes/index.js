import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import Login from "../pages/Login";
import ForgotPassword from "../pages/ForgotPassword";
import SignUp from "../pages/SignUp";
import AdminPanel from "../pages/AdminPanel";
import AllUsers from "../pages/AllUsers";
import AllProducts from "../pages/AllProducts";
import CategoryProduct from "../pages/CategoryProduct";
import ProductDetails from "../pages/ProductDetails";
import Cart from "../pages/Cart";
import SearchProduct from "../pages/SearchProduct";
import Dashboard from "../pages/Dashboard";
import AdminProfile from "../pages/AdminProfile";
import UserProfile from "../pages/UserProfile";
import AllCategory from "../pages/AllCategory";
import AboutUs from "../pages/AboutUs";
import ContactUs from "../pages/ContactUs";
import PaymentSuccess from "../pages/PaymentSuccess";
import AdminPayments from "../components/AdminPayments";
import OrderSuccess from "../components/OrderSuccess";
import CustomerMessage from "../components/CustomerMessage";
import ManagerPanel from "../pages/ManagerPanel";
import ManagerProfile from "../pages/ManagerProfile";
import SalesPanel from "../pages/SalesPanel";
import SalesProfile from "../pages/SalesProfile";
import SalesDashboard from "../pages/SalesDashboard";
import ManagerDashboard from "../pages/ManagerDashboard";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "sign-up",
        element: <SignUp />,
      },
      {
        path: "about-us",
        element: <AboutUs/>
      },
       {
        path: "contact-us",
        element: <ContactUs/>
      },
      {
        path: "product-category",
        element: <CategoryProduct />,
      },
      {
        path: "product/:id",
        element: <ProductDetails />,
      },
      {
        path: "cart",
        element: <Cart />,
      },
      {
        path: "search",
        element: <SearchProduct />,
      },
      { 
        path:"/payment-success",
         element:<PaymentSuccess />

         } ,
         {
            path:"/order-sucess",
            element: <OrderSuccess/>
          },
          //  admin-panel
      {
        path: "admin-panel",
        element: <AdminPanel />,
        children: [
          {
            path: "dashboard",
            element: <Dashboard />,
          },
          {
            path: "all-products",
            element: <AllProducts />,
          },
          {
            path: "all-users",
            element: <AllUsers />,
          },
          {
            path: "admin-profile",
            element: <AdminProfile />,
          },
          {
            path: "all-payments",
            element: <AdminPayments/>
          },
          {
            path: "customer-message",
            element: <CustomerMessage/>
          },
        ],
      },
      // manager-panel
      {
        path: "manager-panel",
        element: <ManagerPanel />,
        children: [
          {
            path: "manager-dashboard",
            element: <ManagerDashboard />,
          },
          {
            path: "all-products",
            element: <AllProducts />,
          },
          {
            path: "manager-profile",
            element: <ManagerProfile />,
          },
          {
            path: "all-category",
            element: <AllCategory />,
          },
          
        ],
      },
      //  sales-panel
      {
        path: "sales-panel",
        element: <SalesPanel />,
        children: [
          {
            path: "sales-dashboard",
            element: <SalesDashboard />,
          },
          {
            path: "all-products",
            element: <AllProducts />,
          },
          
          {
            path: "sales-profile",
            element: <SalesProfile />,
          },
          {
            path: "all-payments",
            element: <AdminPayments/>
          },
          {
            path: "customer-message",
            element: <CustomerMessage/>
          },
        ],
      },
      {
        path: "user-profile",
        element: <UserProfile />,
      },
    ],
  },
]);

export default router;
