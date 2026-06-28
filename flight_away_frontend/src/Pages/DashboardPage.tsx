import { useNavigate } from "react-router-dom";

export default function DashboardPage(){

  const navigate = useNavigate();


  const logout = () => {

    localStorage.removeItem("token");

    navigate("/");

  };


  return (

    <div className="p-10">

      <h1 className="text-3xl font-bold">
        Dashboard
      </h1>


      <p>
        Bienvenido
      </p>


      <button
        onClick={logout}
        className="mt-5 bg-red-500 text-white p-2 rounded"
      >
        Cerrar sesión
      </button>


    </div>

  );
}