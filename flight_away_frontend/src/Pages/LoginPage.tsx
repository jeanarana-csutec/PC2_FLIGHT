import { Link } from "react-router-dom";
import LoginForm from "../Components/LoginForm";

export default function LoginPage(){

  return (

    <div className="min-h-screen flex flex-col items-center justify-center">

      <LoginForm />

      <p className="mt-4 text-gray-600">
        ¿No tienes cuenta?{" "}
        <Link to="/register" className="text-blue-500 hover:underline">
          Regístrate
        </Link>
      </p>

    </div>

  );
}
