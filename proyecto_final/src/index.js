import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { CarritoProvider } from "./components/CarritoContext";
import "./index.css"; // si tienes estilos globales

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <CarritoProvider>
      <App />
    </CarritoProvider>
  </BrowserRouter>
);
