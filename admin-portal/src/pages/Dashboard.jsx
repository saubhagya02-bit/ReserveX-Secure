import React, { useEffect, useState, useContext, useMemo } from "react";
import { Link } from "react-router-dom";
import StallsPieChart from "../components/StallsPieChart";
import NavBar from "../components/NavBar";
import { AuthContext } from "../contexts/AuthContext";
import api from "../services/api";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const { user } = useContext(AuthContext);

  const [stats, setStats] = useState({
    total: 0,
    reserved: 0,
    available: 0,
  });

  const [reservations, setReservations] = useState([]);
  const [stalls, setStalls] = useState([]);
  const [sizeFilter, setSizeFilter] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const stallsRes = await api.get("/stalls");
        const stallsData = stallsRes.data || [];
        setStalls(stallsData);

        const total = stallsData.length;
        const reserved = stallsData.filter((s) => s.Confirmed === true || s.isConfirmed === true).length;
        const available = total - reserved;
        setStats({ total, reserved, available });
      } catch (err) {
        console.error("Failed to load stalls:", err);
      }

      try {
        const reservationsRes = await api.get("/admin/reservations");
        const allReservations = reservationsRes.data || [];
        const sorted = [...allReservations].sort(
          (a, b) => new Date(b.reservationDate) - new Date(a.reservationDate)
        );
        setReservations(sorted.slice(0, 3));
      } catch (err) {
        console.error("Failed to load reservations:", err);
        setReservations([]);
      }
    };

    fetchData();
  }, []);

  // Build stall grid
  const stallGrid = useMemo(() => {
    const grid = {};
    stalls.forEach((stall) => {
      const row = stall.gridRow || 0;
      const col = stall.gridCol || 0;
      if (row > 0 && col > 0) {
        if (!grid[row]) grid[row] = {};
        grid[row][col] = stall;
      }
    });
    return grid;
  }, [stalls]);

  const maxRow = Math.max(...Object.keys(stallGrid).map(Number), 0);
  const maxCol = Math.max(
    ...Object.values(stallGrid).flatMap((row) => Object.keys(row).map(Number)),
    0
  );

  const filteredStalls = useMemo(() => {
    if (sizeFilter === "all") return stalls;
    return stalls.filter((s) => s.size?.toLowerCase() === sizeFilter);
  }, [stalls, sizeFilter]);

  const isStallReserved = (stall) => {
    return stall?.isConfirmed === true || stall?.Confirmed === true;
  };

  const getStallClass = (stall) => {
    if (!stall) return "stall-cell empty";
    const reserved = isStallReserved(stall);
    const size = stall.size?.toLowerCase() || "";
    return `stall-cell ${reserved ? "reserved" : "available"} size-${size}`;
  };

  return (
    <div className="dashboard-background">
      <NavBar />

      <div className="dashboard-header">
        <div className="header-left">
          <p className="greeting"></p>
        </div>
      </div>

      {/* ===== QUICK ACTIONS ===== */}
      <div className="action-cards">
        <Link to="/manage-stalls" className="action-card">
          <h3>Manage Stalls</h3>
          <p>Add, edit, or remove stalls</p>
        </Link>
        <Link to="/view-stalls" className="action-card">
          <h3>View Stalls</h3>
          <p>View stall availability and map</p>
        </Link>
        <Link to="/view-reservations" className="action-card">
          <h3>View Reservations</h3>
          <p>View and filter all reservations</p>
        </Link>
        <Link to="/admin-profile" className="action-card">
          <h3>Admin Profile</h3>
          <p>Update your profile settings</p>
        </Link>
      </div>

      {/* ===== STALLS OVERVIEW - SIDE BY SIDE ===== */}
      <div className="stalls-overview-section">
        <h2 className="stalls-overview-heading">Stalls Overview</h2>
        <div className="overview-grid">
          {/* LEFT: PIE CHART + STATS */}
          <div className="chart-container">
            <div className="chart-with-stats">
              <div className="pie-chart-wrapper">
                <StallsPieChart available={stats.available} reserved={stats.reserved} />
              </div>
              <div className="stats-stack">
                <div className="card">
                  <h3>Total Stalls</h3>
                  <p>{stats.total}</p>
                </div>
                <div className="card reserved">
                  <h3>Reserved</h3>
                  <p>{stats.reserved}</p>
                </div>
                <div className="card available">
                  <h3>Available</h3>
                  <p>{stats.available}</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: STALL MAP */}
          <div className="stall-map-container">
            <div className="stall-map-header">
              <h3>Stall Map</h3>
              <div className="filter-buttons">
                <button
                  className={sizeFilter === "all" ? "filter-btn active" : "filter-btn"}
                  onClick={() => setSizeFilter("all")}
                >
                  All
                </button>
                <button
                  className={sizeFilter === "small" ? "filter-btn active small" : "filter-btn small"}
                  onClick={() => setSizeFilter("small")}
                >
                  Small
                </button>
                <button
                  className={sizeFilter === "medium" ? "filter-btn active medium" : "filter-btn medium"}
                  onClick={() => setSizeFilter("medium")}
                >
                  Medium
                </button>
                <button
                  className={sizeFilter === "large" ? "filter-btn active large" : "filter-btn large"}
                  onClick={() => setSizeFilter("large")}
                >
                  Large
                </button>
              </div>
            </div>
            <div className="stall-grid-wrapper">
              <table className="stall-grid">
                <tbody>
                  {Array.from({ length: maxRow }, (_, rowIdx) => {
                    const row = rowIdx + 1;
                    const rowLetter = String.fromCharCode(64 + row);
                    return (
                      <tr key={row}>
                        <td className="row-label">{rowLetter}</td>
                        {Array.from({ length: maxCol }, (_, colIdx) => {
                          const col = colIdx + 1;
                          const stall = stallGrid[row]?.[col];
                          const shouldShow =
                            sizeFilter === "all" ||
                            stall?.size?.toLowerCase() === sizeFilter;
                          return (
                            <td key={col} className={shouldShow ? getStallClass(stall) : "stall-cell hidden"}>
                              {shouldShow && stall && (
                                <>
                                  <div className="stall-name">{stall.name || stall.stall_name}</div>
                                  <div className="stall-size">{stall.size?.toUpperCase()}</div>
                                </>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="stall-legend">
              <div className="legend-item">
                <span className="legend-color available"></span>
                <span>Available</span>
              </div>
              <div className="legend-item">
                <span className="legend-color reserved"></span>
                <span>Reserved</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== RECENT RESERVATIONS TABLE ===== */}
      <div className="table-container">
        <h2>Recent Reservations</h2>
        <table>
          <thead>
            <tr>
              <th>Reservation ID</th>
              <th>Reservation Date</th>
              <th>Status</th>
              <th>Stalls</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((r) => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>
                  {r.reservationDate
                    ? new Date(r.reservationDate).toLocaleString()
                    : "-"}
                </td>
                <td>{r.status}</td>
                <td>
                  {r.stalls && r.stalls.length > 0
                    ? r.stalls.map((s) => s.name).join(", ")
                    : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}