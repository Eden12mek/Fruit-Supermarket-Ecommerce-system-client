import React, { useState } from "react";
import { CgClose } from "react-icons/cg";
import productCategory from "../helpers/productCategory";
import { FaCloudUploadAlt } from "react-icons/fa";
import uploadImage from "../helpers/uploadImage";
import DisplayImage from "./DisplayImage";
import { MdDelete } from "react-icons/md";
import SummaryApi from "../common";
import { toast } from "react-toastify";

const UploadProduct = ({ onClose, fetchData }) => {
  const [data, setData] = useState({
    productName: "",
    category: "",
    productImage: [],
    description: "",
    price: "",
    sellingPrice: "",
  });
  const [openFullScreenImage, setOpenFullScreenImage] = useState(false);
  const [fullScreenImage, setFullScreenImage] = useState("");

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setData((preve) => {
      return {
        ...preve,
        [name]: value,
      };
    });
  };

  const handleUploadProduct = async (e) => {
    const file = e.target.files[0];
    const uploadImageCloudinary = await uploadImage(file);

    setData((preve) => {
      return {
        ...preve,
        productImage: [...preve.productImage, uploadImageCloudinary.url],
      };
    });
  };

  const handleDeleteProductImage = async (index) => {
    console.log("image index", index);

    const newProductImage = [...data.productImage];
    newProductImage.splice(index, 1);

    setData((preve) => {
      return {
        ...preve,
        productImage: [...newProductImage],
      };
    });
  };

  {
    /**upload product */
  }
  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch(SummaryApi.uploadProduct.url, {
      method: SummaryApi.uploadProduct.method,
      credentials: "include",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (responseData.success) {
      toast.success(responseData?.message);
      onClose();
      fetchData();
    }

    if (responseData.error) {
      toast.error(responseData?.message);
    }
  };
  return (
    <div className="fixed w-full  h-full bg-black bg-opacity-50 top-0 left-0 right-0 bottom-0 flex justify-center items-center z-50">
      <div className="bg-white p-4 rounded w-full max-w-2xl h-full max-h-[80%] overflow-hidden">
        <div className="flex justify-between items-center pb-3">
          <h2 className="text-xl text-center font-bold w-full">
            Add New Product
          </h2>
          <div
            className="w-fit ml-auto text-2xl hover:text-red-600 cursor-pointer"
            onClick={onClose}
          >
            <CgClose />
          </div>
        </div>

        <form
          className="grid p-4 gap-3 capitalize overflow-y-scroll h-full pb-5 text-sm"
          onSubmit={handleSubmit}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label htmlFor="productName">Product Name :</label>
              <input
                type="text"
                id="productName"
                placeholder="enter product name"
                name="productName"
                value={data.productName}
                onChange={handleOnChange}
                className="w-full px-3 py-1.5 bg-slate-100 border rounded"
                required
              />
            </div>

            <div>
              <label htmlFor="category">Category :</label>
              <select
                required
                value={data.category}
                name="category"
                onChange={handleOnChange}
                className="w-full px-3 py-1.5 bg-slate-100 border rounded"
              >
                <option value={""}>Select Category</option>
                {productCategory.map((el, index) => (
                  <option value={el.value} key={el.value + index}>
                    {el.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label htmlFor="productImage">Product Image :</label>
              <label htmlFor="uploadImageInput">
                <div className="px-3 py-2 bg-slate-100 border rounded h-32 w-full flex justify-center items-center cursor-pointer">
                  <div className="text-slate-500 flex justify-center items-center flex-col gap-2">
                    <span className="text-3xl">
                      <FaCloudUploadAlt />
                    </span>
                    <p className="text-xs">Upload Product Image</p>
                    <input
                      type="file"
                      id="uploadImageInput"
                      className="hidden"
                      onChange={handleUploadProduct}
                    />
                  </div>
                </div>
              </label>

              <div className="mt-2">
                {data?.productImage[0] ? (
                  <div className="flex items-center gap-2 flex-wrap">
                    {data.productImage.map((el, index) => (
                      <div className="relative group" key={index}>
                        <img
                          src={el}
                          alt={el}
                          width={70}
                          height={70}
                          className="bg-slate-100 border cursor-pointer"
                          onClick={() => {
                            setOpenFullScreenImage(true);
                            setFullScreenImage(el);
                          }}
                        />
                        <div
                          className="absolute bottom-0 right-0 p-1 text-white bg-red-600 rounded-full hidden group-hover:block cursor-pointer"
                          onClick={() => handleDeleteProductImage(index)}
                        >
                          <MdDelete />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-red-600 text-xs">
                    *Please upload product image
                  </p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="price">Price :</label>
              <input
                type="number"
                id="price"
                placeholder="enter price"
                value={data.price}
                name="price"
                onChange={handleOnChange}
                className="w-full px-3 py-1.5 bg-slate-100 border rounded"
                required
              />
            </div>

            <div>
              <label htmlFor="sellingPrice">Selling Price :</label>
              <input
                type="number"
                id="sellingPrice"
                placeholder="enter selling price"
                value={data.sellingPrice}
                name="sellingPrice"
                onChange={handleOnChange}
                className="w-full px-3 py-1.5 bg-slate-100 border rounded"
                required
              />
            </div>
          </div>

          <div className="mt-3">
            <label htmlFor="description">Description :</label>
            <textarea
              className="h-24 bg-slate-100 border resize-none px-2 py-1 rounded w-full"
              placeholder="enter product description"
              rows={3}
              onChange={handleOnChange}
              name="description"
              value={data.description}
            />
          </div>

          <button className="mt-4 mb-3 px-4 py-2 text-sm bg-emerald-600 text-white rounded hover:bg-emerald-700">
            Add Product
          </button>
        </form>
      </div>

      {/***display image full screen */}
      {openFullScreenImage && (
        <DisplayImage
          onClose={() => setOpenFullScreenImage(false)}
          imgUrl={fullScreenImage}
        />
      )}
    </div>
  );
};

export default UploadProduct;
