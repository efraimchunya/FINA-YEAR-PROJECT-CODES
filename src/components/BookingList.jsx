import React from "react";

export default function BookingsList({ bookings }) {
  if (!bookings.length) {
    return <p>No bookings found.</p>;
  }

  return (
    <div className="space-y-4 max-w-3xl">
      {bookings.map((booking) => (
        <div
          key={booking.id}
          className="bg-white dark:bg-gray-800 rounded shadow p-4"
        >
          <h3 className="text-lg font-semibold">{booking.tourName || "Unnamed Tour"}</h3>
          <p><strong>Tourist:</strong> {booking.touristName || "N/A"}</p>
          <p><strong>Email:</strong> {booking.touristEmail || "N/A"}</p>
          <p><strong>Booking Date:</strong> {new Date(booking.bookingDate).toLocaleDateString()}</p>
          <p><strong>Status:</strong> {booking.status || "Pending"}</p>
        </div>
      ))}
    </div>
  );
}
