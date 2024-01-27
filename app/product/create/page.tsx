"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "../../components/sidebar/sidebar";
import Navbar from "../../components/navbar/navbar";
import { BASE_URL } from "../../config";
import {
  Button,
  ButtonGroup,
  Input,
  NextUIProvider,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { ReactSortable } from "react-sortablejs";
import axios from "axios";

type Category = {
  id: number;
  title: string;
  type: string;
};

type SUBCATEGORIES = {
  id: number;
  category_id: number;
  title: string;
};

type STOCK_BY_SIZE = {
  id: number;
  size: string;
  color: string;
  amount: number;
};

const AddProduct = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubCategories] = useState<SUBCATEGORIES[]>([]);
  const [stockBySize, setStockBySize] = useState<STOCK_BY_SIZE[]>([
    { id: 1, size: "S", color: "", amount: 0 },
    { id: 2, size: "M", color: "", amount: 0 },
    { id: 3, size: "L", color: "", amount: 0 },
    { id: 4, size: "XL", color: "", amount: 0 },
  ]);

  useEffect(() => {
    getCategoryData();
    getSubCategories();
  }, []);

  useEffect(() => {
    console.log(stockBySize);
  }, [stockBySize]);

  const getCategoryData = async () => {
    await axios
      .get(`${BASE_URL}/categories`)
      .then((res) => {
        setCategories(res.data.data);
      })
      .catch((err) => console.log(err));
  };

  const getSubCategories = async () => {
    await axios
      .get(`${BASE_URL}/sub-categories`)
      .then((res) => {
        setSubCategories(res.data.data);
      })
      .catch((err) => console.log(err));
  };

  const addStockBySizeHandler = () => {
    const dataTemp = [...stockBySize];
    const newIdx =
      dataTemp.sort((a, b) => a.id - b.id)[dataTemp.length - 1].id + 1;
    const data: STOCK_BY_SIZE[] = stockBySize;
    const newData = { id: newIdx, size: "", color: "", amount: 0 };
    data.push(newData);
    setStockBySize(data);
  };

  const rmvStockBySizeHandler = (idx: number) => {
    let dataTmp: STOCK_BY_SIZE[] = [...stockBySize];
    dataTmp.splice(idx, 1);
    setStockBySize(dataTmp);
  };

  const sizeChangeHandler = (idx: number, val: string) => {
    let dataTmp: STOCK_BY_SIZE[] = [...stockBySize];
    dataTmp[idx].size = val;
    setStockBySize(dataTmp);
  };

  const colorChangeHandler = (idx: number, val: string) => {
    let dataTmp: STOCK_BY_SIZE[] = [...stockBySize];
    dataTmp[idx].color = val;
    setStockBySize(dataTmp);
  };

  const amountChangeHandler = (idx: number, val: number) => {
    let dataTmp: STOCK_BY_SIZE[] = [...stockBySize];

    if (Number.isNaN(val)) {
      dataTmp[idx].amount = 0;
    } else {
      dataTmp[idx].amount = val;
    }

    setStockBySize(dataTmp);
  };

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
                <h1 className="text-sm font-bold">Add Product</h1>
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
                  <Input type="text" label="Title" />
                  <Select label="Select Category" className="max-w-xs">
                    {categories.map((cat: Category) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {`${cat.title} ${cat.type}`}
                      </SelectItem>
                    ))}
                  </Select>
                  <Select label="Select Type Product" className="max-w-xs">
                    {subcategories.map((sub: SUBCATEGORIES) => (
                      <SelectItem key={sub.id} value={sub.title}>
                        {sub.title}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
                <div className="flex w-full justify-between  mt-5">
                  <h3 className="text-md font-bold">Stock By Size</h3>

                  <Button
                    color="primary"
                    variant="solid"
                    onClick={() => addStockBySizeHandler()}
                  >
                    +
                  </Button>
                </div>
                <ReactSortable list={stockBySize} setList={setStockBySize}>
                  {stockBySize.map((item, idx) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center mt-5 "
                    >
                      <div className="flex w-[60%] flex-wrap md:flex-nowrap gap-10 text-xs cursor-grabbing">
                        <Input
                          type="text"
                          variant="underlined"
                          label="Size"
                          value={item.size}
                          onChange={(e) =>
                            sizeChangeHandler(idx, e.target.value)
                          }
                        />
                        <Input
                          type="text"
                          variant="underlined"
                          label="Color"
                          value={item.color}
                          onChange={(e) =>
                            colorChangeHandler(idx, e.target.value)
                          }
                        />
                        <Input
                          type="number"
                          variant="underlined"
                          label="Amount"
                          value={String(item.amount)}
                          onChange={(e) =>
                            amountChangeHandler(idx, parseInt(e.target.value))
                          }
                        />
                      </div>
                      <Button
                        color="danger"
                        variant="solid"
                        className="min-w-1"
                        onClick={() => rmvStockBySizeHandler(idx)}
                      >
                        <img
                          width="10"
                          height="10"
                          src="https://img.icons8.com/ios-filled/10/delete-sign--v1.png"
                          alt="delete-sign--v1"
                        />
                      </Button>
                    </div>
                  ))}
                </ReactSortable>
              </div>
            </div>
          </div>
        </div>
      </div>
    </NextUIProvider>
  );
};

export default AddProduct;
