// src/pages/AssignedVehicles.jsx
import React, { useState, useEffect } from "react";
import AdminNavbar from "../components/AdminNavbar";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

// ✅ Default driver & vehicle list
const defaultVehicles = [
  { id: 1, type: "Ambulance", driver: "Ravi Kumar", lat: 16.5062, lon: 80.6480 },
  { id: 2, type: "Fire Truck", driver: "Sunil Reddy", lat: 16.5125, lon: 80.6412 },
  { id: 3, type: "Police Car", driver: "Anil Sharma", lat: 16.5050, lon: 80.6505 },
  { id: 4, type: "Ambulance", driver: "Vijay Kumar", lat: 16.5201, lon: 80.6423 }
];

// ✅ Calculate distance between two coordinates
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

export default function AssignedVehicles() {
  const [assignedData, setAssignedData] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Function to find nearest vehicle by type first, then by distance
  const getNearestVehicle = (vehicleType, userLat, userLon) => {
    let filteredVehicles = defaultVehicles.filter(v => v.type === vehicleType);

    // If no match by type, use all vehicles
    if (filteredVehicles.length === 0) {
      filteredVehicles = defaultVehicles;
    }

    // Find the closest
    let nearest = filteredVehicles[0];
    let minDist = getDistance(userLat, userLon, nearest.lat, nearest.lon);

    for (let vehicle of filteredVehicles) {
      const dist = getDistance(userLat, userLon, vehicle.lat, vehicle.lon);
      if (dist < minDist) {
        nearest = vehicle;
        minDist = dist;
      }
    }

    return nearest;
  };

  // ✅ Fetch assigned requests and auto-assign vehicles
  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "assigned"));
        const requests = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Auto-assign nearest vehicle for each request
        const updatedData = requests.map(req => {
          const nearestVehicle = getNearestVehicle(req.vehicle, req.latitude, req.longitude);
          return {
            ...req,
            assignedVehicle: nearestVehicle.type,
            driverName: nearestVehicle.driver
          };
        });

        setAssignedData(updatedData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching assigned requests:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <p className="text-center mt-6">Loading assigned vehicles...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNavbar /> {/* ✅ Navbar Added */}
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Assigned Vehicles</h1>
        {assignedData.length === 0 ? (
          <p>No assigned vehicles yet.</p>
        ) : (
          <table className="w-full bg-white shadow rounded-lg overflow-hidden">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Vehicle Type</th>
                <th className="p-3">Assigned Vehicle</th>
                <th className="p-3">Driver Name</th>
                <th className="p-3">Location</th>
              </tr>
            </thead>
            <tbody>
              {assignedData.map((req) => (
                <tr key={req.id} className="border-b hover:bg-gray-100">
                  <td className="p-3">{req.name}</td>
                  <td className="p-3">{req.phone}</td>
                  <td className="p-3">{req.vehicle}</td>
                  <td className="p-3">{req.assignedVehicle}</td>
                  <td className="p-3">{req.driverName}</td>
                  <td className="p-3">
                    {req.latitude}, {req.longitude}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
