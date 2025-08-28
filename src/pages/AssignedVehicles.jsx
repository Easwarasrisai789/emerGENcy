// src/pages/AcceptedRequests.jsx
import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
} from "firebase/firestore";
import AdminNavbar from "../components/AdminNavbar";

// ✅ Default vehicles pool
const defaultVehicles = {
  ambulance: Array.from({ length: 10 }, (_, i) => ({
    id: `Ambulance-${i + 1}`,
    available: true,
  })),
  fireengine: Array.from({ length: 10 }, (_, i) => ({
    id: `FireEngine-${i + 1}`,
    available: true,
  })),
  policevan: Array.from({ length: 10 }, (_, i) => ({
    id: `PoliceVan-${i + 1}`,
    available: true,
  })),
};

export default function AcceptedRequests() {
  const [requests, setRequests] = useState([]);
  const [vehicles, setVehicles] = useState(defaultVehicles);

  // ✅ Fetch accepted/assigned requests in realtime
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "requests"), (snapshot) => {
      const reqs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setRequests(
        reqs.filter((r) => r.status === "accepted" || r.status === "assigned")
      );
    });
    return () => unsub();
  }, []);

  // ✅ Assign a vehicle
  const assignVehicle = async (request) => {
    const type = request.vehicleType?.toLowerCase();
    if (!type || !vehicles[type]) {
      alert("Invalid vehicle type requested");
      return;
    }

    // Find first available vehicle of this type
    const availableVehicle = vehicles[type].find((v) => v.available);
    if (!availableVehicle) {
      alert(`No ${type} available right now`);
      return;
    }

    // Mark this vehicle as unavailable in local state
    setVehicles((prev) => ({
      ...prev,
      [type]: prev[type].map((v) =>
        v.id === availableVehicle.id ? { ...v, available: false } : v
      ),
    }));

    // Update Firestore with assignment
    const requestRef = doc(db, "requests", request.id);
    await updateDoc(requestRef, {
      assignedVehicle: availableVehicle.id,
      assignedUser: request.name,
      assignedVehicleType: request.vehicleType,
      vehicleAssignedAt: new Date().toISOString(),
      status: "assigned",
    });

    // ✅ Release vehicle after 2 hours (only locally, don't clear Firestore)
    setTimeout(() => {
      setVehicles((prev) => ({
        ...prev,
        [type]: prev[type].map((v) =>
          v.id === availableVehicle.id ? { ...v, available: true } : v
        ),
      }));
    }, 2 * 60 * 60 * 1000);
  };

  return (
    <div className="p-6">
      <AdminNavbar />
      <h1 className="text-2xl font-bold mb-4">Accepted Requests</h1>

      {requests.length === 0 ? (
        <p>No accepted requests.</p>
      ) : (
        <ul className="space-y-4">
          {requests.map((req) => (
            <li
              key={req.id}
              className="p-4 border rounded-lg shadow flex justify-between items-center bg-white"
            >
              <div>
                <p>
                  <strong>Name:</strong> {req.name}
                </p>
                <p>
                  <strong>Vehicle Needed:</strong>{" "}
                  {req.vehicleType || "N/A"}
                </p>
                <p>
                  <strong>Assigned Vehicle:</strong>{" "}
                  {req.assignedVehicle || (
                    <span className="text-gray-500">Not Assigned</span>
                  )}
                </p>
                {req.assignedUser && (
                  <p>
                    <strong>Assigned To:</strong> {req.assignedUser}
                  </p>
                )}
                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      req.status === "assigned"
                        ? "bg-green-200 text-green-800"
                        : "bg-yellow-200 text-yellow-800"
                    }`}
                  >
                    {req.status}
                  </span>
                </p>
              </div>

              <button
                className={`px-4 py-2 rounded-lg ${
                  req.assignedVehicle
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                } text-white`}
                onClick={() => assignVehicle(req)}
                disabled={!!req.assignedVehicle}
              >
                {req.assignedVehicle ? "Assigned" : "Assign"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
