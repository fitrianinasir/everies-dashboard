"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const Sidebar = ({ activate }: any) => {
  const [active, setActive] = useState("");

  useEffect(() => {
    setActive(activate);
  }, [active]);

  return (
    <div className="h-screen flex flex-col justify-between border-[1px]">
      <div className="w-full px-20 py-10">
        <img src="/logos/cover.png" alt="" />
      </div>
      <div className="flex flex-col h-4/5">
        <Link href="/">
          <div
            className={`px-7 py-2 flex items-center mb-1 ${
              active == "dashboard" ? "bg-slate-200" : ""
            }`}
          >
            <img src="/icons/dashboard.png" className="w-[20px] h-[20px] " />
            <span className="ml-3 text-sm">Monitoring</span>
          </div>
        </Link>
        <Link href="/category">
          <div
            className={`px-7 py-2 flex items-center mb-1 ${
              active == "category" ? "bg-slate-200" : ""
            }`}
          >
            <img src="/icons/category.png" className="w-[23px] h-[23px] " />
            <span className="ml-3 text-sm">Category</span>
          </div>
        </Link>
        <Link href="/category-type">
          <div
            className={`px-7 py-2 flex items-center mb-1 ${
              active == "type" ? "bg-slate-200" : ""
            }`}
          >
            <img src="/icons/list.png" className="w-[23px] h-[23px] " />
            <span className="ml-3 text-sm">Category Types</span>
          </div>
        </Link>
        <Link href="/product">
          <div
            className={`px-7 py-2 flex items-center mb-1 ${
              active == "product" ? "bg-slate-200" : ""
            }`}
          >
            <img src="/icons/product.png" className="w-[23px] h-[23px] " />
            <span className="ml-3 text-sm">Product</span>
          </div>
        </Link>
        <Link href="/product-type">
          <div
            className={`px-7 py-2 flex items-center mb-1 ${
              active == "product-type" ? "bg-slate-200" : ""
            }`}
          >
            <img src="/icons/product-type.png" className="w-[23px] h-[23px] " />
            <span className="ml-3 text-sm">Product Type</span>
          </div>
        </Link>
      </div>

      <div className="w-full h-1/6 flex flex-col justify-end">
        <div className="flex items-center">
          <img src="/icons/settings.png" className="w-[20px] h-[20px] " />
          <p className="text-xs ml-3">SETTINGS</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
