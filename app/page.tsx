"use client"
import Sidebar from "./components/sidebar/sidebar";
import Dashboard from "./dashboard/page";
import {NextUIProvider} from "@nextui-org/react";

export default function Home() {
  return (
    <NextUIProvider>
    <div className="flex">
      <div className="w-1/5 h-screen">
        <Sidebar activate={"dashboard"}/>
      </div>
      <div className="w-full h-screen p-5 bg-green-300">
        <Dashboard/>
      </div>
    </div>
    </NextUIProvider>
  );
}
