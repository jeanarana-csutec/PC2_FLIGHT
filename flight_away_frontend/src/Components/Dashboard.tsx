import { Navigate } from "react-router-dom";

export default function Dashboard() {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/" />;
  }

  return <h1>Bienvenido</h1>;
}