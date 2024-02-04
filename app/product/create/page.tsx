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

type RawCategory = {
  id: number;
  title: string;
  type: string;
};

type Category = {
  id: number;
  name: string;
};

type ProductType = {
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

type PRODUCT = {
  title: string;
  category_id: number;
  type_id: number;
  price: number;
  stock_by_size: STOCK_BY_SIZE_RESULT[];
  stock_by_type: STOCK_BY_TYPE_RESULT[];
  img: string;
  rate: number;
  sold: number;
};

interface STOCK_BY_SIZE_RESULT {
  [size: string]: {
    [color: string]: number;
  };
}

interface STOCK_BY_TYPE_RESULT {
  [color: string]: {
    [size: string]: number;
  };
}

const AddProduct = () => {
  const initialStockBySize: STOCK_BY_SIZE[] = [
    { id: 1, size: "", color: "", amount: 0 },
  ];

  const initialFields = {
    title: "",
    category_id: 0,
    type_id: 0,
    price: 0,
    stock_by_size: [],
    stock_by_type: [],
    img: "",
    rate: 0,
    sold: 0,
  };

  const [categories, setCategories] = useState<Category[]>([]);
  const [productType, setProductTypes] = useState<ProductType[]>([]);
  const [stockBySize, setStockBySize] =
    useState<STOCK_BY_SIZE[]>(initialStockBySize);

  const [product, setProduct] = useState<PRODUCT>(initialFields);

  useEffect(() => {
    getCategoryData();
    getProductTypes();
  }, []);

  const getCategoryData = async () => {
    await axios
      .get(`${BASE_URL}/categories`)
      .then((res) => {
        let modifdata: Category[] = [];
        let rawdata: RawCategory[] = res.data.data;
        rawdata.map((i): any => {
          let tmp = {
            id: i.id,
            name: `${i.title} ${i.type}`,
          };
          modifdata.push(tmp);
        });
        setCategories(modifdata);
      })
      .catch((err) => console.log(err));
  };

  const getProductTypes = async () => {
    await axios
      .get(`${BASE_URL}/product-types`)
      .then((res) => {
        setProductTypes(res.data.data);
      })
      .catch((err) => console.log(err));
  };

  // ====== HANDLER ======

  const resetFields = () => setProduct(initialFields);

  const selectCategoryHandler = (e: any) => {
    const selectedID = parseInt(e.target.value);
    setProduct((prev) => ({
      ...prev,
      category_id: selectedID,
    }));
  };

  const selectProductTypeHandler = (e: any) => {
    const selectedID = parseInt(e.target.value);
    setProduct((prev) => ({
      ...prev,
      type_id: selectedID,
    }));
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

  const modifStockBySizeAndType = () => {
    let stockBySizeResult: STOCK_BY_SIZE_RESULT[] = [];
    let stockByTypeResult: STOCK_BY_TYPE_RESULT[] = [];

    stockBySize.map((item): any => {
      const { size, color, amount } = item;
      let tmpSize: Record<string, Record<string, number>> = {};
      let tmpType: Record<string, Record<string, number>> = {};

      tmpSize[size] = { [color]: amount };
      tmpType[color] = { [size]: amount };

      const existingSizeIdx = stockBySizeResult.findIndex((existingItem) =>
        existingItem.hasOwnProperty(size)
      );

      const existingTypeIdx = stockByTypeResult.findIndex((existingItem) =>
      existingItem.hasOwnProperty(color)
    );

      if (existingSizeIdx !== -1) {
        // Update existing entry by adding new color and amount
        stockBySizeResult[existingSizeIdx][size][color] = amount;
      } else {
        // Add tmpSize to stockBySizeResult if size doesn't exist
        tmpSize[size] = { [color]: amount };
        stockBySizeResult.push(tmpSize);
      }

      if (existingTypeIdx !== -1) {
        // Update existing entry by adding new size and amount
        stockByTypeResult[existingTypeIdx][color][size] = amount;
      } else {
        // Add tmpType to stockByTypeResult if size doesn't exist
        tmpType[color] = { [size]: amount };
        stockByTypeResult.push(tmpType);
      }
    });    

    setProduct((prev) => ({
      ...prev,
      stock_by_size: stockBySizeResult,
      stock_by_type: stockByTypeResult
    }))
  };

  const submitProduct = () => {
    modifStockBySizeAndType();

    console.log(product)
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
              <h1 className="text-xl font-bold mb-5">ADD PRODUCT</h1>
              <div className="flex flex-col gap-4">
                <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
                  <Input
                    type="text"
                    label="Title"
                    value={product.title}
                    onChange={(e) =>
                      setProduct((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                  />
                  <Input
                    type="number"
                    label="Price"
                    value={product.price == 0 ? "" : product.price.toString()}
                    className="w-1/6"
                    onChange={(e) =>
                      setProduct((prev) => ({
                        ...prev,
                        price: parseInt(e.target.value),
                      }))
                    }
                  />
                  <Select
                    label="Category"
                    className="w-2/6"
                    selectedKeys={[product.category_id.toString()]}
                    onChange={(e) => selectCategoryHandler(e)}
                  >
                    {categories.map((category: Category) => (
                      <SelectItem
                        key={category.id}
                        value={category.name}
                        textValue={category.name}
                      >
                        {category.name}
                      </SelectItem>
                    ))}
                  </Select>
                  <Select
                    label="Product Type"
                    className="max-w-xs"
                    selectedKeys={[product.type_id.toString()]}
                    onChange={(e) => selectProductTypeHandler(e)}
                  >
                    {productType.map((type: ProductType) => (
                      <SelectItem key={type.id} value={type.title}>
                        {type.title}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
                <div className="flex w-full justify-between  mt-5">
                  <h3 className="text-xl font-bold">STOCK</h3>

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
                      className="flex flex-wrap md:flex-nowrap gap-10 text-xs cursor-grabbing mt-5 "
                    >
                      <Input
                        type="text"
                        variant="underlined"
                        label="Size"
                        value={item.size}
                        onChange={(e) => sizeChangeHandler(idx, e.target.value)}
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
                      <button onClick={() => rmvStockBySizeHandler(idx)}>
                        <img src="/icons/remove.png" alt="delete-sign--v1" />
                      </button>
                    </div>
                  ))}
                </ReactSortable>
                <div>
                  <h1 className="text-xl font-bold mt-5">IMAGES OF PRODUCT</h1>
                </div>
              </div>
              <div className="flex justify-end gap-1 mt-5">
                <Button
                  variant="solid"
                  color="warning"
                  onClick={() => resetFields()}
                >
                  RESET
                </Button>
                <Button
                  variant="solid"
                  color="primary"
                  onClick={() => submitProduct()}
                >
                  SUBMIT
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </NextUIProvider>
  );
};

export default AddProduct;
