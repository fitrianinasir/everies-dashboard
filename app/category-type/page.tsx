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
} from "@nextui-org/react";
import Sidebar from "../components/sidebar/sidebar";
import Navbar from "../components/navbar/navbar";
import axios from "axios";
import { BASE_URL } from "../config";
import Swal from "sweetalert2";

type TYPE = {
  id: number;
  name: string;
};

const columns = [
  { name: "Name", uid: "name" },
  { name: "ACTIONS", uid: "actions" },
];

const CategoryType = () => {
  const [data, setData] = useState<TYPE[]>([]);
  const [dataLoaded, setDataLoaded] = useState(true);

  const [type, setType] = useState<TYPE>({ id: 0, name: "" });
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editData, setEditData] = useState<TYPE>();
  useEffect(() => {
    getTypeData();
  }, []);
  const getTypeData = async () => {
    await axios
      .get(`${BASE_URL}/category-types`)
      .then((res) => {
        setData(res.data.data);
        setDataLoaded(true);
      })
      .catch((err) => console.log(err));
  };

  const ResetType = () => {
    setType({ id: 0, name: "" });
  };

  const DeleteHandler = (id: number) => {
    axios
      .delete(`${BASE_URL}/category-type/${id}`)
      .then((res) => {
        Swal.fire({
          title: "Deleted!",
          text: "Type has been deleted.",
          icon: "success",
        });
        getTypeData();
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
          return <p>{type.name}</p>;
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
                    onClick={() => setType({ id: type.id, name: type.name })}
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
    [data]
  );

  const submitHandler = () => {
    if (type.id == 0 && type.name.length > 0) {
      axios
        .post(BASE_URL + "/category-type", type)
        .then((res) => {
          Swal.fire({
            title: "Success",
            text: "Type added successfully",
            icon: "success",
          }).then((res) => {
            ResetType();
            getTypeData();
          });
        })
        .catch((err) => console.log(err));
    } else if (type.id >= 1) {
      axios
        .put(`${BASE_URL}/category-type/${type.id}`, type)
        .then((res) => {
          Swal.fire({
            title: "Success",
            text: "Type updated successfully",
            icon: "success",
          }).then((res) => {
            ResetType();
            getTypeData();
          });
        })
        .catch((err) => console.log(err));
    } else {
      Swal.fire({
        title: "Add data first",
        icon: "warning",
      });
    }
  };
  return (
    <NextUIProvider>
      <div className="flex">
        <div className="w-1/5 h-screen">
          <Sidebar activate={"type"} />
        </div>
        <div className="w-full bg-[#F2F1EB]">
          <div className="w-full h-[8%] px-5 py-3 bg-white">
            <Navbar />
          </div>
          <div className="w-full h-[92%] p-5">
            <div className="w-full p-5 bg-white">
              <h1 className="text-sm font-bold mb-5">TYPE</h1>
              <div className="flex justify-between my-5">
                <Input
                  type="text"
                  label="Enter type name"
                  className="w-3/6"
                  value={type?.name}
                  onChange={(e) =>
                    setType((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                />
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
                      width={column.uid === "actions" ? "10%" : "50%"}
                    >
                      {column.name}
                    </TableColumn>
                  )}
                </TableHeader>
                <TableBody items={data}>
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
          </div>
        </div>
      </div>
    </NextUIProvider>
  );
};

export default CategoryType;
