import React from "react";
import AppRoutes from "./router/AppRoutes";
import { ToastContainer } from "react-toastify";
import { ThemeProvider } from "./common/ThemeContext";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

function App() {
  return (
    <ThemeProvider>
      <AppRoutes />

      {/* ✅ Global Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={2000}
        theme="colored"
      />
    </ThemeProvider>
  );
}

export default App;
