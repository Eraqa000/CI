// src/routes/PrivateLayout.jsx
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function PrivateLayout() {
  return (
    <div className="app">
      <Navbar />
      <main className="private-main">
        <Outlet />
      </main>
    </div>
  );
}
