import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { CarritoProvider } from "./components/CarritoContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <CarritoProvider>
    <App />
  </CarritoProvider>
);
