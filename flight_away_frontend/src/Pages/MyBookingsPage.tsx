import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../Components/Navbar";

interface Booking {
  id: number;
  flightNumber: string;
  customerFirstName: string;
  customerLastName: string;
  estDepartureTime: string;
  estArrivalTime: string;
}

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error] = useState("");

  useEffect(() => {
    const ids = JSON.parse(localStorage.getItem("bookingIds") || "[]") as number[];

    if (ids.length === 0) {
      setLoading(false);
      return;
    }

    Promise.all(
      ids.map((id: number) =>
        api.get(`/flights/book/${id}`).then((r) => r.data).catch(() => null)
      )
    ).then((results) => {
      setBookings(results.filter(Boolean));
      setLoading(false);
    });
  }, []);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString();

  if (loading) return <div><Navbar /><p className="p-6">Cargando...</p></div>;

  return (
    <div>
      <Navbar />
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Mis Reservas</h1>

        {error && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {bookings.length === 0 ? (
          <p className="text-gray-500">No tienes reservas.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2 text-left">ID Reserva</th>
                  <th className="border p-2 text-left">N° Vuelo</th>
                  <th className="border p-2 text-left">Pasajero</th>
                  <th className="border p-2 text-left">Salida</th>
                  <th className="border p-2 text-left">Llegada</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50">
                    <td className="border p-2">{b.id}</td>
                    <td className="border p-2">{b.flightNumber}</td>
                    <td className="border p-2">{b.customerFirstName} {b.customerLastName}</td>
                    <td className="border p-2">{formatDate(b.estDepartureTime)}</td>
                    <td className="border p-2">{formatDate(b.estArrivalTime)}</td>
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
