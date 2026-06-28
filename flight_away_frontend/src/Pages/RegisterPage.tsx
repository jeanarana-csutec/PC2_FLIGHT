import { Link } from "react-router-dom";
import RegisterForm from "../Components/RegisterForm";

export default function RegisterPage(){

  return (

    <div className="min-h-screen flex flex-col items-center justify-center">

      <RegisterForm />

      <p className="mt-4 text-gray-600">
        ¿Ya tienes cuenta?{" "}
        <Link to="/login" className="text-blue-500 hover:underline">
          Inicia sesión
        </Link>
      </p>

    </div>

  );
}
