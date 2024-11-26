import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { TransactionContext, TransactionProvider } from "./context/TransactionContext.jsx"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

ReactDOM.createRoot(document.getElementById("root")).render(
  <TransactionProvider>
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    <ToastContainer />
  </TransactionProvider>
);
