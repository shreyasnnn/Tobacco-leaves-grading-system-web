import React from "react";
import { BrowserRouter } from "react-router-dom";
import ReactDOM from "react-dom/client";
import AppRouter from "./appRouter";
// import BackgroundSilk from "./components/backgrounds/backgroundSilk";
import "./index.css";

const rootElement = document.getElementById("root");

if (!rootElement) throw new Error("Failed to find the root element");

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    {/* <BackgroundSilk /> */}
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
  </React.StrictMode>
);
