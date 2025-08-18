import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";

const RequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();

  const handleCopy = (req) => {
    if (req.latitude && req.longitude) {
      const mapsLink = `https://www.google.com/maps?q=${req.latitude},${req.longitude}`;
      const message = `Emergency Location: ${mapsLink}\nContact: ${req.phone}`;
      navigator.clipboard.writeText(message).then(() => {
        alert("Location & phone copied to clipboard!");
      });
    } else {
      alert("No location data to share.");
    }
  };

  const handleShare = (req) => {
    if (req.latitude && req.longitude) {
      const osmLink = `https://www.openstreetmap.org/?mlat=${req.latitude}&mlon=${req.longitude}#map=18/${req.latitude}/${req.longitude}`;
      window.open(osmLink, "_blank");
    } else {
      alert("No location data to share.");
    }
  };

  const handleStatusUpdate = async (reqId, newStatus) => {
    try {
      const reqDocRef = doc(db, "emergencyRequests", reqId);
      await updateDoc(reqDocRef, { status: newStatus });

      // Update local state
      setRequests((prev) =>
        prev.map((r) =>
          r.id === reqId ? { ...r, status: newStatus } : r
        )
      );

      if (selected?.id === reqId) {
        setSelected((prev) => ({ ...prev, status: newStatus }));
      }

      // Redirect to accepted list if accepted
      if (newStatus === "Accepted") {
        navigate("/accepted-requests");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status. Please try again.");
    }
  };

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "emergencyRequests"),
      (snapshot) => {
        const reqData = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name || "",
            phone: data.phone || "",
            situation: data.situation || data.vehicle || "",
            latitude: data.latitude || data.location?.latitude || null,
            longitude: data.longitude || data.location?.longitude || null,
            status: data.status || "Pending",
          };
        });
        setRequests(reqData);
      },
      (error) => console.error("Error fetching requests:", error)
    );

    return () => unsub();
  }, []);

  useEffect(() => {
    if (!selected && requests.length > 0) {
      setSelected(requests[0]);
    }
  }, [requests, selected]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <AdminNavbar />
      <div style={{ display: "flex", flex: 1, flexWrap: "wrap" }}>
        {/* Table Section */}
        <div style={{ flex: 1, minWidth: "300px", padding: "20px", overflowX: "auto" }}>
          <h2>Incoming Requests</h2>
          {requests.length === 0 ? (
            <p>No incoming requests.</p>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #ddd" }}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Situation</th>
                  <th>Latitude</th>
                  <th>Longitude</th>
                  <th>Share Location</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req) => (
                  <tr
                    key={req.id}
                    onClick={() => setSelected(req)}
                    style={{
                      cursor: "pointer",
                      backgroundColor: selected?.id === req.id ? "#f0f0f0" : "transparent",
                    }}
                  >
                    <td>{req.name}</td>
                    <td>{req.phone}</td>
                    <td>{req.situation}</td>
                    <td>{req.latitude ? req.latitude.toFixed(4) : "-"}</td>
                    <td>{req.longitude ? req.longitude.toFixed(4) : "-"}</td>
                    <td>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleCopy(req); }}
                        style={{
                          padding: "6px 10px",
                          background: "#4CAF50",
                          color: "#fff",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                          marginRight: "5px",
                        }}
                      >
                        Copy
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleShare(req); }}
                        style={{
                          padding: "6px 10px",
                          background: "#2196F3",
                          color: "#fff",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        Share
                      </button>
                    </td>
                    <td>
                      <button
                        disabled={req.status === "Accepted"}
                        onClick={(e) => { e.stopPropagation(); handleStatusUpdate(req.id, "Accepted"); }}
                        style={{
                          padding: "6px 10px",
                          marginRight: "5px",
                          background: req.status === "Accepted" ? "#8BC34A" : "#4CAF50",
                          color: "#fff",
                          border: "none",
                          borderRadius: "4px",
                          cursor: req.status === "Accepted" ? "default" : "pointer",
                        }}
                      >
                        Accept
                      </button>
                      <button
                        disabled={req.status === "Rejected"}
                        onClick={(e) => { e.stopPropagation(); handleStatusUpdate(req.id, "Rejected"); }}
                        style={{
                          padding: "6px 10px",
                          background: req.status === "Rejected" ? "#E57373" : "#F44336",
                          color: "#fff",
                          border: "none",
                          borderRadius: "4px",
                          cursor: req.status === "Rejected" ? "default" : "pointer",
                        }}
                      >
                        Reject
                      </button>
                      <div style={{
                        marginTop: "5px",
                        fontWeight: "bold",
                        color:
                          req.status === "Accepted" ? "#4CAF50" :
                          req.status === "Rejected" ? "#F44336" : "black",
                      }}>
                        {req.status}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Map Section */}
        <div style={{ flex: 1, minWidth: "300px", height: "100%" }}>
          {selected && selected.latitude && selected.longitude ? (
            <iframe
              title="Google Map"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              src={`https://www.google.com/maps?q=${selected.latitude},${selected.longitude}&hl=es;z=14&output=embed`}
            ></iframe>
          ) : (
            <p style={{ padding: "20px" }}>No location data available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestsPage;
