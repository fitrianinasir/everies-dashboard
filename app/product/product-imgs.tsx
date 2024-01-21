import React, { useEffect, useState } from "react";

const ProductImgs = ({ images }: any) => {
  const [active, setActive] = useState(0);

  const nextHandler = () => {
    if (active < images.length-1) {
      setActive(active + 1);
    }
  };
  const prevHandler = () => {
    if (active == 0) {
      setActive(0);
    } else {
      setActive(active - 1);
    }
  };
  return (
    <div className="relative w-full">
      <div className="relative h-56 overflow-hidden">
        <img src={`images/${images[active]}`} alt="" />
      </div>
      <button
        type="button"
        className="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-2 cursor-pointer group focus:outline-none"
        onClick={() => prevHandler()}
      >
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white/30 group-hover:bg-white/50 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
          <svg
            className="w-3 h-3 text-white dark:text-gray-800 rtl:rotate-180"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 6 10"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 1 1 5l4 4"
            />
          </svg>
          <span className="sr-only">Previous</span>
        </span>
      </button>
      <button
        type="button"
        className="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-2 cursor-pointer group focus:outline-none"
        onClick={() => nextHandler()}
      >
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white/30 group-hover:bg-white/50 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
          <svg
            className="w-3 h-3 text-white dark:text-gray-800 rtl:rotate-180"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 6 10"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="m1 9 4-4-4-4"
            />
          </svg>
          <span className="sr-only">Next</span>
        </span>
      </button>
    </div>
  );
};

export default ProductImgs;
