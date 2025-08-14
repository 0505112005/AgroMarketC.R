import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { CarritoProvider } from "./components/CarritoContext";
import { FavoritosProvider } from "./context/FavoritosContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <CarritoProvider>
    <FavoritosProvider>
      <App />
    </FavoritosProvider>
  </CarritoProvider>
);
