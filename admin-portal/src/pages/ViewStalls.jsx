import React, { useEffect, useState, useMemo } from "react";
import NavBar from "../components/NavBar";
import api from "../services/api";
import {
  SIZE_OPTIONS,
  STATUS_OPTIONS,
  filterAndSortStalls,
  hasActiveFilter,
  isStallReserved,
} from "../services/viewStallsFilters";
import "./ViewStalls.css";

export default function ViewStalls() {
  const [stalls, setStalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sizeFilter, setSizeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [sizeDropdown, setSizeDropdown] = useState("");
  const [statusDropdown, setStatusDropdown] = useState("");
  const [orderDropdown, setOrderDropdown] = useState("asc");

  useEffect(() => {
    api
      .get("/stalls")
      .then((res) => {
        setStalls(res.data || []);
        setError(null);
      })
      .catch((err) => {
        console.error("Error fetching stalls:", err);
        setError(err?.response?.data?.message || "Failed to load stalls.");
        setStalls([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const displayedStalls = useMemo(
    () =>
      filterAndSortStalls(stalls, {
        sizeFilter,
        statusFilter,
        sortOrder,
      }),
    [stalls, sizeFilter, statusFilter, sortOrder]
  );

  const applyFilter = () => {
    setSizeFilter(sizeDropdown);
    setStatusFilter(statusDropdown);
    setSortOrder(orderDropdown);
  };

  const clearFilter = () => {
    setSizeDropdown("");
    setStatusDropdown("");
    setOrderDropdown("asc");
    setSizeFilter("");
    setStatusFilter("");
    setSortOrder("asc");
  };

  const activeFilter = hasActiveFilter(sizeFilter, statusFilter, sortOrder);

  return (
    <div className="view-stalls-background">
      <NavBar />

      <h3 className="view-stalls-title">View Stalls</h3>

      <div className="view-stalls-controls">
        <div className="control-group">
          <label className="control-label">Size</label>
          <select
            className="control-select"
            value={sizeDropdown}
            onChange={(e) => setSizeDropdown(e.target.value)}
          >
            {SIZE_OPTIONS.map((opt) => (
              <option key={opt.value || "all"} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div className="control-group">
          <label className="control-label">Status</label>
          <select
            className="control-select"
            value={statusDropdown}
            onChange={(e) => setStatusDropdown(e.target.value)}
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value || "all"} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div className="control-group">
          <label className="control-label">Order</label>
          <select
            className="control-select"
            value={orderDropdown}
            onChange={(e) => setOrderDropdown(e.target.value)}
          >
            <option value="asc">A → Z (Ascending)</option>
            <option value="desc">Z → A (Descending)</option>
          </select>
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

      <div className="view-stalls-table-container">
        {loading ? (
          <p className="view-stalls-loading">Loading stalls...</p>
        ) : error ? (
          <p className="view-stalls-error">{error}</p>
        ) : (
          <table className="view-stalls-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Stall Name</th>
                <th>Size</th>
                <th>Price (LKR)</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {displayedStalls.length === 0 ? (
                <tr>
                  <td colSpan={5} className="no-data">
                    No stalls found.
                  </td>
                </tr>
              ) : (
                displayedStalls.map((stall) => {
                  const reserved = isStallReserved(stall);
                  const stallName = stall.name ?? stall.stall_name;
                  const stallId = stall.id ?? stall.stall_id;
                  return (
                    <tr key={stallId}>
                      <td>{stallId}</td>
                      <td>{stallName}</td>
                      <td className="capitalize">
                        {stall.size ? String(stall.size).toLowerCase() : ""}
                      </td>
                      <td>{stall.price != null ? stall.price : "—"}</td>
                      <td>
                        <span
                          className={
                            reserved
                              ? "status-badge reserved"
                              : "status-badge available"
                          }
                        >
                          {reserved ? "Reserved" : "Available"}
                        </span>
                      </td>
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
