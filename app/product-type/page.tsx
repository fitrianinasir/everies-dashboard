"use client";
import React, { useEffect, useState } from "react";
import {
  Button,
  Input,
  NextUIProvider,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
  Select,
  SelectItem,
} from "@nextui-org/react";
import Sidebar from "../components/sidebar/sidebar";
import Navbar from "../components/navbar/navbar";
import axios from "axios";
import { BASE_URL } from "../config";
import Swal from "sweetalert2";

type TYPE = {
  id: number;
  category_id: number;
  title: string;
  category_name: string;
};

type RawCategory = {
  id: number;
  title: string;
  type: string;
};
type Category = {
  id: number;
  name: string;
};

const columns = [
  { name: "Product Name", uid: "title" },
  { name: "Category", uid: "category_name" },
  { name: "ACTIONS", uid: "actions" },
];

const ProductType = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [types, setTypes] = useState<TYPE[]>([]);
  const [type, setType] = useState<TYPE>({
    id: 0,
    category_id: 0,
    title: "",
    category_name: "",
  });

  const [action, setAction] = useState<string>("");
  const [isActionTriggered, setActionTriggered] = useState<boolean>(false);
  const [countAction, setCountAction] = useState<number>(2);

  useEffect(() => {
    getTypeData();
    getCategoryData();
  }, []);

  useEffect(() => {
    if (isActionTriggered) {
      const toastDisappear = setInterval(() => {
        setCountAction((prev) => prev - 1);
      }, 1000);

      if (countAction === 0) {
        clearInterval(toastDisappear);
        setActionTriggered(false);
      }
      return () => clearInterval(toastDisappear);
    }
  }, [isActionTriggered, countAction]);

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

  const getTypeData = async () => {
    await axios
      .get(`${BASE_URL}/product-types`)
      .then((res) => {
        setTypes(res.data.data);
      })
      .catch((err) => console.log(err));
  };


  // ============== HANDLER ===============
  const ResetType = () => {
    setType({ id: 0, category_id: 0, title: "", category_name: "" });
  };

  const handleEdit = (id: number) => {
    const editType = types.find((type) => type.id == id);
    if (editType) {
      setType(editType);
    }
  };

  const handlerAfterAction = () => {
    ResetType();
    getTypeData();
    setActionTriggered(true);
    setCountAction(2);
  };

  const handlingSelect = (e: any) => {
    const selectedID = parseInt(e.target.value);
    const selectedTmp = categories.find((cat) => cat.id == selectedID)?.name;

    setType((prev) => ({
      ...prev,
      category_id: selectedID,
      category_name: selectedTmp || "",
    }));
  };

  const submitHandler = () => {
    if (type.id == 0 && type.title.length > 0) {
      axios
        .post(BASE_URL + "/product-type", type)
        .then((res) => {
          handlerAfterAction();
          setAction("added");
        })
        .catch((err) => console.log(err));
    } else if (type.id >= 1) {
      axios
        .put(`${BASE_URL}/product-type/${type.id}`, type)
        .then((res) => {
          handlerAfterAction();
          setAction("updated");
        })
        .catch((err) => console.log(err));
    } else {
      Swal.fire({
        title: "Add data first",
        icon: "warning",
      });
    }
  };

  const DeleteHandler = (id: number) => {
    axios
      .delete(`${BASE_URL}/product-type/${id}`)
      .then((res) => {
        handlerAfterAction();
        setAction("deleted");
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
        });
      });
  };

  const renderTypeData = React.useCallback(
    (type: TYPE, columnKey: React.Key) => {
      const typeVal = type[columnKey as keyof TYPE];

      switch (columnKey) {
        case "name":
          return <p>{type.title}</p>;
        case "actions":
          return (
            <div className="relative flex items-center gap-2">
              <Tooltip content="Edit type">
                <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                  <img
                    width="20"
                    height="20"
                    src="https://img.icons8.com/pastel-glyph/20/113946/pencil--v2.png"
                    alt="pencil--v2"
                    onClick={() => handleEdit(type.id)}
                  />
                </span>
              </Tooltip>
              <Tooltip color="danger" content="Delete type">
                <span className="text-lg text-danger cursor-pointer active:opacity-50">
                  <img
                    width="20"
                    height="20"
                    src="https://img.icons8.com/pastel-glyph/20/trash.png"
                    alt="trash"
                    onClick={() => DeleteHandler(type.id)}
                  />
                </span>
              </Tooltip>
            </div>
          );
        default:
          return typeVal;
      }
    },
    [types]
  );

  return (
    <NextUIProvider>
      <div className="flex">
        <div className="w-1/5 h-screen">
          <Sidebar activate={"product-type"} />
        </div>
        <div className="w-full bg-[#F2F1EB]">
          <div className="w-full h-[8%] px-5 py-3 bg-white">
            <Navbar />
          </div>
          <div className="w-full h-[92%] p-5">
            <div className="w-full p-5 bg-white">
              <h1 className="text-sm font-bold mb-5">PRODUCT TYPE</h1>
              <div className="flex justify-between my-5">
                <div className="flex w-full">
                  <Input
                    type="text"
                    label="Enter type name"
                    className="w-2/6 mr-3"
                    value={type?.title}
                    onChange={(e) =>
                      setType((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                  />
                  <Select
                    label="This product type is part of"
                    className="w-2/6"
                    selectedKeys={[type.category_id.toString()]}
                    onChange={(e) => handlingSelect(e)}
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
                </div>
                <div className="flex gap-2">
                  <Button
                    color="primary"
                    className=""
                    onClick={() => submitHandler()}
                  >
                    SUBMIT
                  </Button>
                  <Button
                    color="warning"
                    className=""
                    onClick={() => ResetType()}
                  >
                    RESET
                  </Button>
                </div>
              </div>
              <Table aria-label="Example table with custom cells">
                <TableHeader columns={columns}>
                  {(column) => (
                    <TableColumn
                      key={column.uid}
                      align={column.uid === "actions" ? "end" : "start"}
                      width={column.uid === "actions" ? "10%" : "20%"}
                    >
                      {column.name}
                    </TableColumn>
                  )}
                </TableHeader>
                <TableBody items={types}>
                  {(item) => (
                    <TableRow key={item.id}>
                      {(columnKey) => (
                        <TableCell>{renderTypeData(item, columnKey)}</TableCell>
                      )}
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            {isActionTriggered ? (
              <div
                id="toast-success"
                className="absolute right-5 bottom-5 flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow"
                role="alert"
              >
                <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg">
                  <svg
                    className="w-5 h-5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                  </svg>
                  <span className="sr-only">Check icon</span>
                </div>
                <div className="ms-3 text-sm font-normal">
                  Type {action} successfully.
                </div>
                <button
                  type="button"
                  className="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
                  data-dismiss-target="#toast-success"
                  aria-label="Close"
                >
                  <span className="sr-only">Close</span>
                  <svg
                    className="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap ="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                </button>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </NextUIProvider>
  );
};

export default ProductType;
