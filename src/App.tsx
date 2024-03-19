import React, { RefObject, useRef } from "react";
import { Menu } from "./components/Menu";
import { Routes } from "./router";
import { Toast } from "primereact/toast";
import refugio from "./assets/refugio.png"

export const ToastContext = React.createContext<RefObject<Toast> | null>(null);

export const App: React.FC = () => {
  const toast = useRef<Toast>(null);

  return (
    <React.Fragment>
      <header className="surface-0 shadow-1 w-full px-4 py-3 flex justify-content-between align-items-center">
        <img src={refugio} alt="Refúgio" className="w-12rem" />
        <h1 className="text-3xl font-bold m-0 text-700">Rede 12 + 17</h1>
      </header>
      <div className="flex-1 flex flex-column lg:flex-row">
        <Menu />
        <main className="px-4 m-5 flex-1">
          <Toast ref={toast} />
          <ToastContext.Provider value={toast}>
            <Routes />
          </ToastContext.Provider>
        </main>
      </div>
    </React.Fragment>
  )
}