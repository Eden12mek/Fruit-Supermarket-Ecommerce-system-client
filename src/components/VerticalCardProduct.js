import React, { useContext, useEffect, useRef, useState } from "react";
import fetchCategoryWiseProduct from "../helpers/fetchCategoryWiseProduct";
import displayINRCurrency from "../helpers/displayCurrency";
import {
  FaAngleLeft,
  FaAngleRight,
  FaStar,
  FaRegStar,
  FaStarHalfAlt,
  FaShoppingCart,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import addToCart from "../helpers/addToCart";
import Context from "../context";

const VerticalCardProduct = ({ category, heading }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const loadingList = new Array(13).fill(null);

  const [scroll, setScroll] = useState(0);
  const scrollElement = useRef();

  const { fetchUserAddToCart } = useContext(Context);

  const handleAddToCart = async (e, id) => {
    await addToCart(e, id);
    fetchUserAddToCart();
  };

  const fetchData = async () => {
    setLoading(true);
    const categoryProduct = await fetchCategoryWiseProduct(category);
    setLoading(false);
    setData(categoryProduct?.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const scrollRight = () => {
    scrollElement.current.scrollLeft += 300;
  };
  const scrollLeft = () => {
    scrollElement.current.scrollLeft -= 300;
  };

  const renderStars = () => {
    return (
      <div className="flex items-center">
        <span className="text-xs text-gray-500 ml-1"></span>
        {[...Array(4)].map((_, i) => (
          <FaStar key={`full-${i}`} className="text-yellow-400 text-sm" />
        ))}
        <FaStarHalfAlt className="text-yellow-400 text-sm" />
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 my-6 relative">
      <h2 className="text-2xl font-semibold py-4">{heading}</h2>

      <div
        className="flex items-center gap-4 md:gap-6 overflow-scroll scrollbar-none transition-all"
        ref={scrollElement}
      >
        <button
          className="bg-white shadow-md rounded-full p-1 absolute left-0 text-lg hidden md:block"
          onClick={scrollLeft}
        >
          <FaAngleLeft />
        </button>
        <button
          className="bg-white shadow-md rounded-full p-1 absolute right-0 text-lg hidden md:block"
          onClick={scrollRight}
        >
          <FaAngleRight />
        </button>

        {loading
          ? loadingList.map((product, index) => {
              return (
                <div className="w-full min-w-[280px] md:min-w-[320px] max-w-[280px] md:max-w-[320px] bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                  <div className="bg-slate-200 h-48 w-full"></div>
                  <div className="p-4">
                    <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-slate-200 rounded w-1/2 mb-3"></div>
                    <div className="flex justify-between items-center mb-3">
                      <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                      <div className="flex space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className="h-4 w-4 bg-slate-200 rounded-full"
                          ></div>
                        ))}
                      </div>
                    </div>
                    <div className="h-3 bg-slate-200 rounded w-full mb-4"></div>
                    <div className="flex justify-between items-center">
                      <div className="h-8 bg-slate-200 rounded w-1/3"></div>
                      <div className="h-8 bg-slate-200 rounded w-1/3"></div>
                    </div>
                  </div>
                </div>
              );
            })
          : data.map((product, index) => {
              return (
                <div
                  key={index}
                  className="w-full min-w-[280px] md:min-w-[320px] max-w-[280px] md:max-w-[320px] bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <Link to={"product/" + product?._id}>
                    <div className="h-48 w-full bg-gray-100 flex items-center justify-center p-4">
                      <img
                        src={product.productImage[0]}
                        className="object-contain h-full w-full hover:scale-105 transition-transform duration-300"
                        alt={product.productName}
                      />
                    </div>
                  </Link>

                  <div className="p-4">
                    <Link to={"product/" + product?._id}>
                      <h2 className="font-semibold text-lg text-ellipsis capitalize line-clamp-1 text-gray-800 mb-1">
                        {product?.productName}
                      </h2>
                      <p className="text-sm text-gray-500 mb-2">
                        {product?.category}
                      </p>
                    </Link>

                    <div className="flex justify-between items-center mb-3">
                      <span className="text-lg font-bold text-red-600">
                        {displayINRCurrency(product?.sellingPrice)}
                      </span>
                      <div className="flex items-center">
                        <span className="text-xs text-gray-500 ml-1">
                          {" "}
                          (4.5){" "}
                        </span>{" "}
                        {renderStars(4.5)}
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {product?.description?.substring(0, 80)}...
                    </p>

                    <div className="flex justify-between items-center">
                      <button
                        className="flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-full text-sm transition-colors duration-300"
                        onClick={(e) => handleAddToCart(e, product?._id)}
                      >
                        <FaShoppingCart className="mr-2" />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
      </div>
    </div>
  );
};

export default VerticalCardProduct;
