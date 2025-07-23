import React from "react";
import Modal from "react-modal";

Modal.setAppElement("#root");

export default function BookingInfoModal({ isOpen, onRequestClose, booking }) {
  if (!booking) return null;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Booking Information"
      className="modal"
      overlayClassName="modal-overlay"
    >
      <h2 className="text-xl font-bold mb-4 text-center">Booking Details</h2>
      <div className="space-y-2 text-sm">
        <div>
          <strong>Tourist Name:</strong> {booking.user?.name || booking.user?.username || "N/A"}
        </div>
        <div>
          <strong>Activity:</strong> {booking.activity?.name || "N/A"}
        </div>
        <div>
          <strong>Location:</strong> {booking.location?.name || "N/A"}
        </div>
        <div>
          <strong>Status:</strong>{" "}
          <span
            className={`px-2 py-1 rounded text-white ${
              booking.status === "approved"
                ? "bg-green-500"
                : booking.status === "rejected"
                ? "bg-red-500"
                : "bg-yellow-500"
            }`}
          >
            {booking.status}
          </span>
        </div>
        <div>
          <strong>Notes:</strong> {booking.notes || "None"}
        </div>
        <div>
          <strong>Created At:</strong>{" "}
          {booking.createdAt ? new Date(booking.createdAt).toLocaleString() : "N/A"}
        </div>
      </div>

      <div className="mt-4 text-center">
        <button
          onClick={onRequestClose}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Close
        </button>
      </div>
    </Modal>
  );
}
