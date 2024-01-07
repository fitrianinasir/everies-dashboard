"use client";
import React from "react";
import Sidebar from "../components/sidebar/sidebar";
import Navbar from "../components/navbar/navbar";
import { NextUIProvider } from "@nextui-org/react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  User,
  Chip,
  Tooltip,
  getKeyValue,
} from "@nextui-org/react";
import { columns, users } from "./data";

const Category = () => {
  const renderCell = React.useCallback((user: any, columnKey: any) => {
    const cellValue = user[columnKey];

    switch (columnKey) {
      case "name":
        return <p>{user.name}</p>;
      case "role":
        return <p>{user.role}</p>;
      case "actions":
        return <button type="button">delete</button>;
      default:
        return cellValue;
    }
  }, []);
  return (
    <NextUIProvider>
      <div className="flex">
        <div className="w-1/5 h-screen">
          <Sidebar activate={"category"} />
        </div>
        <div className="w-full bg-[#F2F1EB]">
          <div className="w-full h-[8%] px-5 py-3 bg-white">
            <Navbar />
          </div>
          <div className="w-full h-[92%] p-5">
            <div className="w-full p-5 bg-white">
              <h1 className="text-sm font-bold mb-5">CATEGORY</h1>
              <Table aria-label="Example table with custom cells">
                <TableHeader columns={columns}>
                  {(column) => (
                    <TableColumn
                      key={column.uid}
                      align={column.uid === "actions" ? "center" : "start"}
                    >
                      {column.name}
                    </TableColumn>
                  )}
                </TableHeader>
                <TableBody items={users}>
                  {(item) => (
                    <TableRow key={item.id}>
                      {(columnKey) => (
                        <TableCell>{renderCell(item, columnKey)}</TableCell>
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

export default Category;
