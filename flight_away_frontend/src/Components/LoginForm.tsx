import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../services/api";

export default function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!email.trim() || !password.trim()) {
            setError("Todos los campos son obligatorios");
            return;
        }

        try {
            const response = await api.post("/auth/login", {
                email,
                password
            });

            const token = response.data.token;
            localStorage.setItem("token", token);
            navigate("/");
        } catch (err: unknown) {
            if (axios.isAxiosError(err) && err.response?.data?.detail) {
                setError(err.response.data.detail);
            } else {
                setError("Credenciales incorrectas");
            }
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col items-center justify-center min-h-screen bg-gray-100"
        >
            {error && (
                <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded w-80">
                    {error}
                </div>
            )}

            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mb-4 p-2 border border-gray-300 rounded w-80"
            />

            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mb-4 p-2 border border-gray-300 rounded w-80"
            />

            <button
                type="submit"
                className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 w-80"
            >
                Inicia Sesión
            </button>
        </form>
    );
}
