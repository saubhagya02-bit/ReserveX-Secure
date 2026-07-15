import React, { useEffect, useMemo, useState } from "react";
import NavBar from "../components/NavBar";
import api from "../services/api";
import {
  buildStatusOptionsFromReservations,
  filterAndSortReservations,
  getReservationBusinessName,
  getReservationDate,
  getReservationId,
  getReservationStalls,
  hasActiveReservationFilter,
} from "../services/viewReservationsFilters";
import "./ViewReservations.css";

export default function ViewReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [businessQuery, setBusinessQuery] = useState("");
  const [stallQuery, setStallQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // draft controls (apply/clear like ViewStalls)
  const [businessDraft, setBusinessDraft] = useState("");
  const [stallDraft, setStallDraft] = useState("");
  const [statusDraft, setStatusDraft] = useState("");
  const [fromDraft, setFromDraft] = useState("");
  const [toDraft, setToDraft] = useState("");

  useEffect(() => {
    api
      .get("/admin/reservations")
      .then((res) => {
        setReservations(res.data || []);
        setError(null);
      })
      .catch((err) => {
        console.error("Error fetching reservations:", err);
        setError(err?.response?.data?.message || "Failed to load reservations.");
        setReservations([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const statusOptions = useMemo(
    () => buildStatusOptionsFromReservations(reservations),
    [reservations]
  );

  const displayedReservations = useMemo(
    () =>
      filterAndSortReservations(reservations, {
        businessQuery,
        stallQuery,
        statusFilter,
        fromDate,
        toDate,
        idOrder: "desc",
      }),
    [reservations, businessQuery, stallQuery, statusFilter, fromDate, toDate]
  );

  const applyFilter = () => {
    setBusinessQuery(businessDraft);
    setStallQuery(stallDraft);
    setStatusFilter(statusDraft);
    setFromDate(fromDraft);
    setToDate(toDraft);
  };

  const clearFilter = () => {
    setBusinessDraft("");
    setStallDraft("");
    setStatusDraft("");
    setFromDraft("");
    setToDraft("");
    setBusinessQuery("");
    setStallQuery("");
    setStatusFilter("");
    setFromDate("");
    setToDate("");
  };

  const activeFilter = hasActiveReservationFilter({
    businessQuery,
    stallQuery,
    statusFilter,
    fromDate,
    toDate,
  });

  return (
    <div className="view-reservations-background">
      <NavBar />

      <h3 className="view-reservations-title">View Reservations</h3>

      <div className="view-reservations-controls">
        <div className="control-group">
          <label className="control-label">Business</label>
          <input
            className="control-input"
            value={businessDraft}
            onChange={(e) => setBusinessDraft(e.target.value)}
            placeholder="Search business name..."
          />
        </div>
        <div className="control-group">
          <label className="control-label">Stall</label>
          <input
            className="control-input"
            value={stallDraft}
            onChange={(e) => setStallDraft(e.target.value)}
            placeholder="Search stall name..."
          />
        </div>
        <div className="control-group">
          <label className="control-label">Status</label>
          <select
            className="control-select"
            value={statusDraft}
            onChange={(e) => setStatusDraft(e.target.value)}
          >
            {statusOptions.map((opt) => (
              <option key={opt.value || "all"} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div className="control-group">
          <label className="control-label">From</label>
          <input
            className="control-input"
            type="date"
            value={fromDraft}
            onChange={(e) => setFromDraft(e.target.value)}
          />
        </div>
        <div className="control-group">
          <label className="control-label">To</label>
          <input
            className="control-input"
            type="date"
            value={toDraft}
            onChange={(e) => setToDraft(e.target.value)}
          />
        </div>

        <button type="button" className="filter-btn" onClick={applyFilter}>
          Filter
        </button>
        {activeFilter && (
          <button type="button" className="clear-filter-btn" onClick={clearFilter}>
            Clear
          </button>
        )}
      </div>

      <div className="view-reservations-table-container">
        {loading ? (
          <p className="view-reservations-loading">Loading reservations...</p>
        ) : error ? (
          <p className="view-reservations-error">{error}</p>
        ) : (
          <table className="view-reservations-table">
            <thead>
              <tr>
                <th>Reservation ID</th>
                <th>Business Name</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
                <th>Stalls</th>
              </tr>
            </thead>
            <tbody>
              {displayedReservations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="no-data">
                    No reservations found.
                  </td>
                </tr>
              ) : (
                displayedReservations.map((r, idx) => {
                  const id = getReservationId(r) ?? `row-${idx}`;
                  const businessName = getReservationBusinessName(r) || "—";
                  const dateRaw = getReservationDate(r);
                  const d = dateRaw ? new Date(dateRaw) : null;
                  const stalls = getReservationStalls(r);
                  return (
                    <tr key={String(id)}>
                      <td>{getReservationId(r) ?? "—"}</td>
                      <td>{businessName}</td>
                      <td>{d ? d.toLocaleDateString() : "—"}</td>
                      <td>{d ? d.toLocaleTimeString() : "—"}</td>
                      <td>{r?.status ?? r?.reservationStatus ?? "—"}</td>
                      <td>{stalls.length ? stalls.join(", ") : "—"}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

