"use client";
import React, { useEffect, useState } from "react";
import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import { BASE_URL, TYPES, animals } from "../config";
import axios from "axios";
import Swal from "sweetalert2";

type Category = {
  title: string;
  type: string;
  img: string;
};
const EditPage = ({ EditHandler, ReloadData, Data }: any) => {
  const [data, setData] = useState<Category>({ title: "", type: "", img: "" });
  const [imgLoad, setImgLoad] = useState<string | null>(null);
  const selectedType = TYPES.find((type) => type.label == Data.type)?.value;

  useEffect(() => {
    getImageHandler()
  }, []);

  const getImageHandler = () => {
    axios
      .get(`${BASE_URL}/img/${Data.img}`)
      .then((res) => {
        console.log(res.data)
        const reader = new FileReader();
        if (res.data instanceof Blob || res.data instanceof File) {
          reader.onload = function (e) {
            // e.target.result contains the data URL
            const dataURL = res.data
            console.log(dataURL);
          };
    
          reader.readAsDataURL(res.data)
        }else {
          console.error('Selected file is not a Blob or File.');
        }
      })
      .catch((err) => console.log(err));
  };
  const uploadImgHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    let uploaded_img = e.target.files?.[0];
    console.log(uploaded_img);
    if (e && uploaded_img) {
      const formData = new FormData();
      formData.append("image", uploaded_img);
      axios
        .post(BASE_URL + "/category/img", formData)
        .then((res) => {
          const reader = new FileReader();
          reader.onload = () => {
            if (typeof reader.result == "string") {
              setImgLoad(reader.result);
            }
          };
          reader.readAsDataURL(uploaded_img);

          setData((prev) => ({
            ...prev,
            img: res.data.fileName,
          }));
        })
        .catch((err) => console.log(err));
    } else {
      setImgLoad(null);
    }
  };

  const submitHandler = () => {
    axios
      .post(BASE_URL + "/category", data)
      .then((res) => {
        Swal.fire({
          title: "Good job!",
          text: "You clicked the button!",
          icon: "success",
        }).then((res) => {
          EditHandler();
          ReloadData();
        });
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="h-full flex flex-col justify-between p-7">
      <h1>EDIT CATEGORY</h1>

      <div className="">
        <div className="mt-3 flex w-full flex-wrap md:flex-nowrap gap-4">
          <Input
            type="text"
            label="Title"
            value={Data.title}
            onChange={(e) =>
              setData((prev) => ({
                ...prev,
                title: e.target.value,
              }))
            }
          />
          <Select
            label="Select Type"
            className="max-w-xs"
            defaultSelectedKeys={[selectedType ? selectedType : ""]}
            onChange={(e) => {
              setData((prev) => ({
                ...prev,
                type: e.target.value,
              }));
            }}
          >
            {TYPES.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.value}
              </SelectItem>
            ))}
          </Select>
        </div>
        <div>
          {imgLoad == null ? (
            <label
              htmlFor="fileUpload"
              className="w-full flex flex-col items-center text-center justify-center text-xs text-gray-500 bg-gray-100 p-5 mt-3 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer"
            >
              <img
                width="40"
                height="40"
                src="https://img.icons8.com/ios/40/upload-to-cloud.png"
                alt="upload-to-cloud"
              />
              <div>
                <h3>Click to upload or drag and drop</h3>
                <p>SVG, PNG, or JPG (Max 5Mb)</p>
              </div>
            </label>
          ) : (
            <div className="relative w-full h-[12rem] flex justify-center mt-5">
              <img src={imgLoad} className="w-[30%]" />
              <label
                htmlFor="fileUpload"
                className="absolute top-0 right-0 text-[10px] font-medium underline tracking wide"
              >
                REPLACE
              </label>
            </div>
          )}
          <input
            id="fileUpload"
            type="file"
            onChange={uploadImgHandler}
            className="hidden"
          />
        </div>
      </div>

      <div className="flex w-full mt-5 justify-end items-end">
        <Button
          color="warning"
          className="mr-1"
          onClick={() => EditHandler(false)}
        >
          CANCEL
        </Button>
        <Button color="primary" className="" onClick={() => submitHandler()}>
          SUBMIT
        </Button>
      </div>
    </div>
  );
};

export default EditPage;
