import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { CarritoProvider } from "./context/CarritoContext"; // ✅ Importar provider del carrito
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import ScrollToTop from "./components/ScrollToTop";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ScrollToTop />
      <CarritoProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </CarritoProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
