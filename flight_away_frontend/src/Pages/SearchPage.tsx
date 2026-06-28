import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import api from "../services/api";
import Navbar from "../Components/Navbar";

interface Flight {
  id: number;
  airlineName: string;
  flightNumber: string;
  estDepartureTime: string;
  estArrivalTime: string;
  availableSeats: number;
}

export default function SearchPage() {
  const [flightNumber, setFlightNumber] = useState("");
  const [airlineName, setAirlineName] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [flights, setFlights] = useState<Flight[]>([]);
  const [searched, setSearched] = useState(false);
  const [bookingMsg, setBookingMsg] = useState("");
  const [error, setError] = useState("");

  const search = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setBookingMsg("");

    const params: Record<string, string> = {};
    if (flightNumber.trim()) params.flightNumber = flightNumber.trim();
    if (airlineName.trim()) params.airlineName = airlineName.trim();
    if (dateFrom) params.estDepartureTimeFrom = new Date(dateFrom).toISOString();
    if (dateTo) params.estDepartureTimeTo = new Date(dateTo).toISOString();

    try {
      const res = await api.get("/flights/search", { params });
      setFlights(res.data.items ?? []);
      setSearched(true);
    } catch {
      setError("Error al buscar vuelos");
    }
  };

  const book = async (flightId: number) => {
    setError("");
    setBookingMsg("");

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Debes iniciar sesión para reservar");
      return;
    }

    try {
      const res = await api.post("/flights/book", { flightId });
      const bookingId = res.data.id;
      const ids = JSON.parse(localStorage.getItem("bookingIds") || "[]");
      ids.push(bookingId);
      localStorage.setItem("bookingIds", JSON.stringify(ids));
      setBookingMsg(`Reserva exitosa! ID: ${bookingId}`);
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else {
        setError("Error al reservar");
      }
    }
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString();

  return (
    <div>
      <Navbar />
      <div className="p-6 max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Buscar Vuelos</h1>

        {error && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error === "Debes iniciar sesión para reservar" ? (
              <span>
                {error}.{" "}
                <Link to="/login" className="font-bold underline">
                  Iniciar sesión
                </Link>
              </span>
            ) : (
              error
            )}
          </div>
        )}
        {bookingMsg && (
          <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            {bookingMsg}
          </div>
        )}

        <form onSubmit={search} className="flex flex-wrap gap-4 mb-6">
          <input
            type="text"
            placeholder="Número de vuelo"
            value={flightNumber}
            onChange={(e) => setFlightNumber(e.target.value)}
            className="border p-2 rounded flex-1 min-w-[150px]"
          />
          <input
            type="text"
            placeholder="Aerolínea"
            value={airlineName}
            onChange={(e) => setAirlineName(e.target.value)}
            className="border p-2 rounded flex-1 min-w-[150px]"
          />
          <input
            type="datetime-local"
            placeholder="Desde"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="border p-2 rounded flex-1 min-w-[180px]"
          />
          <input
            type="datetime-local"
            placeholder="Hasta"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="border p-2 rounded flex-1 min-w-[180px]"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            Buscar
          </button>
        </form>

        {searched && flights.length === 0 && (
          <p className="text-gray-500">No se encontraron vuelos.</p>
        )}

        {flights.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2 text-left">N° Vuelo</th>
                  <th className="border p-2 text-left">Aerolínea</th>
                  <th className="border p-2 text-left">Salida</th>
                  <th className="border p-2 text-left">Llegada</th>
                  <th className="border p-2 text-left">Asientos</th>
                  <th className="border p-2">Acción</th>
                </tr>
              </thead>
              <tbody>
                {flights.map((f) => (
                  <tr key={f.id} className="hover:bg-gray-50">
                    <td className="border p-2">{f.flightNumber}</td>
                    <td className="border p-2">{f.airlineName}</td>
                    <td className="border p-2">{formatDate(f.estDepartureTime)}</td>
                    <td className="border p-2">{formatDate(f.estArrivalTime)}</td>
                    <td className="border p-2">{f.availableSeats}</td>
                    <td className="border p-2 text-center">
                      <button
                        onClick={() => book(f.id)}
                        className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
                      >
                        Reservar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
