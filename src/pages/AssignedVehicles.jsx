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

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "requests"), (snapshot) => {
      const reqs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setRequests(reqs.filter((r) => r.status === "accepted"));
    });
    return () => unsub();
  }, []);

  // ✅ Assign vehicle logic
  const assignVehicle = async (request) => {
    const type = request.vehicleType?.toLowerCase(); // requested type
    if (!type || !vehicles[type]) {
      alert("Invalid vehicle type requested");
      return;
    }

    // find next available vehicle
    const availableVehicle = vehicles[type].find((v) => v.available);

    if (!availableVehicle) {
      alert(`No ${type} available right now`);
      return;
    }

    // mark vehicle as in use
    const updatedVehicles = {
      ...vehicles,
      [type]: vehicles[type].map((v) =>
        v.id === availableVehicle.id ? { ...v, available: false } : v
      ),
    };
    setVehicles(updatedVehicles);

    // ✅ update request in Firebase with details
    const requestRef = doc(db, "requests", request.id);
    await updateDoc(requestRef, {
      assignedVehicle: availableVehicle.id, // e.g., Ambulance-1
      assignedUser: request.name,
      assignedVehicleType: request.vehicleType,
      vehicleAssignedAt: new Date().toISOString(),
      status: "assigned",
    });

    // ✅ release vehicle after 2 hours
    setTimeout(async () => {
      setVehicles((prev) => ({
        ...prev,
        [type]: prev[type].map((v) =>
          v.id === availableVehicle.id ? { ...v, available: true } : v
        ),
      }));

      // clear assignment in firebase
      await updateDoc(requestRef, {
        assignedVehicle: null,
        assignedUser: null,
        assignedVehicleType: null,
        status: "accepted", // keep request accepted but free the vehicle
      });
    }, 2 * 60 * 60 * 1000); // 2 hours
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
              className="p-4 border rounded-lg shadow flex justify-between items-center"
            >
              <div>
                <p>
                  <strong>Name:</strong> {req.name}
                </p>
                <p>
                  <strong>Vehicle Needed:</strong> {req.vehicleType}
                </p>
                <p>
                  <strong>Assigned Vehicle:</strong>{" "}
                  {req.assignedVehicle || "Not Assigned"}
                </p>
                {req.assignedUser && (
                  <p>
                    <strong>Assigned To:</strong> {req.assignedUser}
                  </p>
                )}
              </div>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-lg"
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
