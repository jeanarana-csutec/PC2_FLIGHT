import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Navbar() {
  const [userName, setUserName] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token"));
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("userName");
    if (stored) {
      setUserName(stored);
    } else if (token) {
      api.get("/users/current").then((r) => {
        setUserName(r.data.username);
      }).catch(() => {});
    }
  }, [token]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    setToken(null);
    setUserName("");
    navigate("/login");
  };

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <div className="flex items-center gap-6">
        <Link to="/" className="hover:text-gray-300">
          Buscar Vuelos
        </Link>
        {token && (
          <Link to="/my-bookings" className="hover:text-gray-300">
            Mis Reservas
          </Link>
        )}
      </div>
      <div className="flex items-center gap-4">
        {token ? (
          <>
            {userName && <span className="text-gray-300">{userName}</span>}
            <button
              onClick={logout}
              className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
            >
              Cerrar sesión
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-gray-300">
              Iniciar sesión
            </Link>
            <Link
              to="/register"
              className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
            >
              Registrarse
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
