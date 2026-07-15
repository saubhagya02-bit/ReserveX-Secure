/**
 * Filter options and logic for View Stalls page.
 * Keeps filtering concerns separate from the page component.
 */

export const SIZE_OPTIONS = [
  { value: "", label: "All sizes" },
  { value: "small", label: "Small" },
  { value: "medium", label: "Medium" },
  { value: "large", label: "Large" },
];

export const STATUS_OPTIONS = [
  { value: "", label: "All" },
  { value: "available", label: "Available" },
  { value: "reserved", label: "Reserved" },
];

/**
 * Resolve whether a stall is reserved.
 * Handles backend field variants: reserved, confirmed, is_Confirmed.
 */
export function isStallReserved(stall) {
  return (
    stall?.reserved === true ||
    stall?.confirmed === true ||
    stall?.Confirmed === true
  );
}

/**
 * Pure function: filter and sort stalls by size, status, and name order.
 * @param {Array} stalls - Raw stall list from API
 * @param {Object} filters - { sizeFilter, statusFilter, sortOrder }
 * @returns {Array} Filtered and sorted stalls
 */
export function filterAndSortStalls(stalls, { sizeFilter, statusFilter, sortOrder }) {
  if (!Array.isArray(stalls)) return [];

  let result = [...stalls];

  // Filter by size (case-insensitive)
  if (sizeFilter) {
    const sizeLower = sizeFilter.toLowerCase();
    result = result.filter(
      (stall) =>
        stall.size && String(stall.size).toLowerCase() === sizeLower
    );
  }

  // Filter by status (available vs reserved)
  if (statusFilter) {
    result = result.filter((stall) => {
      const reserved = isStallReserved(stall);
      if (statusFilter === "available") return !reserved;
      if (statusFilter === "reserved") return reserved;
      return true;
    });
  }

  // Sort by name
  const order = sortOrder === "desc" ? -1 : 1;
  result.sort((a, b) => {
    const aName = (a.name ?? a.stall_name ?? "").toLowerCase();
    const bName = (b.name ?? b.stall_name ?? "").toLowerCase();
    return order * aName.localeCompare(bName);
  });

  return result;
}

/**
 * Check if any filter is currently active.
 */
export function hasActiveFilter(sizeFilter, statusFilter, sortOrder) {
  return Boolean(sizeFilter || statusFilter || sortOrder !== "asc");
}
