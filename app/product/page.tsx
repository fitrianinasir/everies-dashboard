"use client";
import Sidebar from "../components/sidebar/sidebar";
import Navbar from "../components/navbar/navbar";
import { Button, NextUIProvider } from "@nextui-org/react";
import { BASE_URL } from "../config";
import ProductImgs from "./product-imgs";
import { useEffect, useState } from "react";
import axios from "axios";

type PRODUCT = {
  id: number;
  id_sub_category: number;
  title: string;
  img: string;
  price: number;
  stock_by_type: string;
  stock_by_size: string;
  rate: number;
  sold: number;
};

const Product = () => {
  const [products, setProducts] = useState<PRODUCT[]>([]);

  const [showSettings, setShowSettings] = useState<any>([]);

  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = async () => {
    await axios
      .get(`${BASE_URL}/products`)
      .then((res) => {
        setProducts(res.data.data);
        const productsLength = res.data.data.length;
        const totalProducts = Array(productsLength).fill(0);
        setShowSettings(totalProducts);
      })
      .catch((err) => console.log(err));
  };

  const convertToRp = (num: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(num);
  };

  const settingsHandler = (idx: number) => {
    const changeSettings = Array(showSettings.length).fill(0);
    if (showSettings[idx] === 1) {
      changeSettings[idx] = 0;
    } else {
      changeSettings[idx] = 1;
    }
    setShowSettings(changeSettings);
  };

  const moveToCreate = () => (window.location.href = "/product/create");
  return (
    <NextUIProvider>
      <div className="flex">
        <div className="w-1/5 h-screen">
          <Sidebar activate={"product"} />
        </div>
        <div className="w-full bg-[#F2F1EB]">
          <div className="w-full h-[8%] px-5 py-3 bg-white">
            <Navbar />
          </div>

          <div className="w-full h-[92%] p-5">
            <div className="w-full p-5 bg-white">
              <div className="flex justify-between">
                <h1 className="text-sm font-bold">PRODUCTS</h1>
                <Button
                  color="primary"
                  endContent={"+"}
                  onClick={() => moveToCreate()}
                >
                  Add New
                </Button>
              </div>

              {/* PRODUCT LIST */}
              <div className="grid grid-cols-7 gap-6 mt-5">
                {products.map((product, index) => (
                  <div
                    key={index}
                    className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow"
                  >
                    <div className="p-3">
                      <ProductImgs
                        images={JSON.parse(product.img)}
                        currActiveVal={index}
                        settingsControl={settingsHandler}
                        isActive={showSettings[index]}
                      />
                      <h6 className="mt-3 text-sm font-semibold tracking-tight text-gray-900">
                        {product.title}
                      </h6>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center mt-2.5 mb-5">
                          <div className="flex items-center space-x-0">
                            {Array.from({ length: product.rate }).map(
                              (_, index) => (
                                <svg
                                  key={index}
                                  className="w-3 h-3 text-pink-300"
                                  aria-hidden="true"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="currentColor"
                                  viewBox="0 0 22 20"
                                >
                                  <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                                </svg>
                              )
                            )}
                            {Array.from({ length: 5 - product.rate }).map(
                              (_, index) => (
                                <svg
                                  key={index}
                                  className="w-3 h-3 text-gray-200 dark:text-gray-600"
                                  aria-hidden="true"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="currentColor"
                                  viewBox="0 0 22 20"
                                >
                                  <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                                </svg>
                              )
                            )}
                          </div>
                          <span className="ml-[1px] bg-pink-100 text-pink-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                            {product.rate}
                          </span>
                        </div>
                        <span className="text-sm font-bold text-gray-900 dark:text-white">
                          {convertToRp(product.price)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </NextUIProvider>
  );
};

export default Product;
