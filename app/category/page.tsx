"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "../components/sidebar/sidebar";
import Navbar from "../components/navbar/navbar";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
  Selection,
  Button,
  NextUIProvider,
  Pagination,
  SortDescriptor,
} from "@nextui-org/react";
import axios from "axios";

type Category = {
  title: string;
  type: string;
  img: string;
  category_order: number;
};

const columns = [
  { name: "TITLE", uid: "title", sortable: true },
  { name: "TYPE", uid: "type", sortable: true },
  { name: "ORDER", uid: "category_order", sortable: true },
  { name: "ACTIONS", uid: "actions" },
];

const Category = () => {
  const URL = "http://localhost:8080/api";
  const [page, setPage] = useState(1);
  const [filterValue, setFilterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "age",
    direction: "ascending",
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryLoaded, setCategoryLoaded] = useState(false);

  useEffect(() => {
    getCategoryData();
  }, []);

  const getCategoryData = async () => {
    console.log("GET CATEGORIES CALLED");
    await axios
      .get(`${URL}/categories`)
      .then((res) => {
        setCategories(res.data.data);
        setCategoryLoaded(true);
      })
      .catch((err) => console.log(err));
  };

  const renderCategoryData = React.useCallback(
    (category: Category, columnKey: React.Key) => {
      const categoryVal = category[columnKey as keyof Category];

      switch (columnKey) {
        case "title":
          return <p>{category.title}</p>;
        case "type":
          return <p>{category.type}</p>;
        case "img":
          return <p>{category.img}</p>;
        case "category_order":
          return <p>{category.category_order}</p>;
        case "actions":
          return (
            <div className="relative flex items-center gap-2">
              <Tooltip content="Edit user">
                <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                  <img
                    width="20"
                    height="20"
                    src="https://img.icons8.com/pastel-glyph/20/113946/pencil--v2.png"
                    alt="pencil--v2"
                  />
                </span>
              </Tooltip>
              <Tooltip color="danger" content="Delete user">
                <span className="text-lg text-danger cursor-pointer active:opacity-50">
                  <img
                    width="20"
                    height="20"
                    src="https://img.icons8.com/pastel-glyph/20/trash.png"
                    alt="trash"
                  />
                </span>
              </Tooltip>
            </div>
          );
        default:
          return categoryVal;
      }
    },
    [categories]
  );
  const hasSearchFilter = Boolean(filterValue);

  const filteredItems = React.useMemo(() => {
    let filteredUsers = [...categories];

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter((category) =>
        category.title.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
    return filteredUsers;
  }, [categories, categoryLoaded, filterValue]);

  // PAGINATION START
  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const onNextPage = React.useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = React.useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400">
          {selectedKeys === "all"
            ? "All items selected"
            : `${selectedKeys.size} of ${filteredItems.length} selected`}
        </span>
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
        />
        <div className="hidden sm:flex w-[30%] justify-end gap-2">
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onPreviousPage}
          >
            Previous
          </Button>
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onNextPage}
          >
            Next
          </Button>
        </div>
      </div>
    );
  }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

  // PAGINATION END

  // TOP CONTENT

  const onSearchChange = React.useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onRowsPerPageChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    []
  );

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col">
        <div className="flex justify-between items-end mb-5">
          <div className="relative w-1/3">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
              <img
                width="20"
                height="20"
                src="https://img.icons8.com/pastel-glyph/20/search--v1.png"
                alt="search--v1"
              />
            </div>
            <input
              type="text"
              id="input-group-1"
              value={filterValue}
              onChange={(e) => onSearchChange(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full ps-10 p-2.5"
              placeholder="Search Name.."
            />
          </div>
          <div className="flex">
            <Button color="primary" endContent={"+"}>
              Add New
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {categories.length} users
          </span>
          <label className="flex items-center text-default-400 text-small">
            Rows per page:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={onRowsPerPageChange}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    filterValue,
    onSearchChange,
    onRowsPerPageChange,
    categories.length,
    hasSearchFilter,
  ]);
  // END OF TOP CONTENT

  // SORTED ITEMS
  const sortedItems = React.useMemo(() => {
    return [...items].sort((a: Category, b: Category) => {
      const first = a[sortDescriptor.column as keyof Category] as number;
      const second = b[sortDescriptor.column as keyof Category] as number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

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
              <Table
                aria-label="Example table with custom cells"
                bottomContent={bottomContent}
                bottomContentPlacement="outside"
                classNames={{
                  wrapper: "max-h-[382px]",
                }}
                // selectedKeys={selectedKeys}
                // selectionMode="multiple"
                sortDescriptor={sortDescriptor}
                // onSelectionChange={setSelectedKeys}
                onSortChange={setSortDescriptor}
                topContent={topContent}
                topContentPlacement="outside"
              >
                <TableHeader columns={columns}>
                  {(column) => (
                    <TableColumn
                      key={column.uid}
                      align={column.uid === "actions" ? "center" : "start"}
                      allowsSorting={column.sortable}
                    >
                      {column.name}
                    </TableColumn>
                  )}
                </TableHeader>
                <TableBody emptyContent={"No users found"} items={sortedItems}>
                  {(item) => (
                    <TableRow key={item.title}>
                      {(columnKey) => (
                        <TableCell>
                          {renderCategoryData(item, columnKey)}
                        </TableCell>
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
