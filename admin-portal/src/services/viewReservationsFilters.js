/**
 * Filtering + sorting logic for View Reservations page.
 * Keeps the page component focused on UI concerns.
 */
export const STATUS_OPTIONS_BASE = [{ value: "", label: "All" }];

function normalizeString(value) {
  if (value == null) return "";
  return String(value).trim();
}

export function getReservationId(reservation) {
  return reservation?.id ?? reservation?.reservationId ?? reservation?.reservation_id ?? null;
}

export function getReservationBusinessName(reservation) {
  return (
    reservation?.businessName ??
    reservation?.business_name ??
    reservation?.user?.businessName ??
    reservation?.user?.business_name ??
    reservation?.business?.name ??
    reservation?.vendor?.businessName ??
    reservation?.vendor?.business_name ??
    reservation?.vendor?.name ??
    ""
  );
}

export function getReservationDate(reservation) {
  return reservation?.reservationDate ?? reservation?.reservation_date ?? reservation?.createdAt ?? reservation?.created_at ?? null;
}

export function getReservationStalls(reservation) {
  const stalls = reservation?.stalls ?? reservation?.Stalls ?? [];
  if (!Array.isArray(stalls)) return [];
  return stalls
    .map((s) => s?.name ?? s?.stallName ?? s?.stall_name ?? s?.title ?? "")
    .map(normalizeString)
    .filter(Boolean);
}

export function buildStatusOptionsFromReservations(reservations) {
  const set = new Set();
  (reservations || []).forEach((r) => {
    const status = normalizeString(r?.status ?? r?.reservationStatus ?? r?.reservation_status);
    if (status) set.add(status);
  });
  const options = [...set]
    .sort((a, b) => a.localeCompare(b))
    .map((s) => ({ value: s, label: s }));
  return [...STATUS_OPTIONS_BASE, ...options];
}

export function hasActiveReservationFilter({
  businessQuery,
  stallQuery,
  statusFilter,
  fromDate,
  toDate,
} = {}) {
  return Boolean(businessQuery || stallQuery || statusFilter || fromDate || toDate);
}

function parseDateStart(dateStr) {
  // date input is YYYY-MM-DD; treat as local start-of-day
  if (!dateStr) return null;
  const d = new Date(`${dateStr}T00:00:00`);
  return Number.isNaN(d.getTime()) ? null : d;
}

function parseDateEnd(dateStr) {
  if (!dateStr) return null;
  const d = new Date(`${dateStr}T23:59:59.999`);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function filterAndSortReservations(
  reservations,
  { businessQuery, stallQuery, statusFilter, fromDate, toDate, idOrder = "desc" } = {}
) {
  let result = Array.isArray(reservations) ? [...reservations] : [];

  const businessQ = normalizeString(businessQuery).toLowerCase();
  const stallQ = normalizeString(stallQuery).toLowerCase();
  const statusF = normalizeString(statusFilter).toLowerCase();
  const from = parseDateStart(fromDate);
  const to = parseDateEnd(toDate);

  if (businessQ) {
    result = result.filter((r) =>
      normalizeString(getReservationBusinessName(r)).toLowerCase().includes(businessQ)
    );
  }

  if (stallQ) {
    result = result.filter((r) =>
      getReservationStalls(r)
        .join(", ")
        .toLowerCase()
        .includes(stallQ)
    );
  }

  if (statusF) {
    result = result.filter((r) => {
      const s = normalizeString(r?.status ?? r?.reservationStatus ?? r?.reservation_status).toLowerCase();
      return s === statusF;
    });
  }

  if (from || to) {
    result = result.filter((r) => {
      const raw = getReservationDate(r);
      if (!raw) return false;
      const d = new Date(raw);
      if (Number.isNaN(d.getTime())) return false;
      if (from && d < from) return false;
      if (to && d > to) return false;
      return true;
    });
  }

  result.sort((a, b) => {
    const aId = Number(getReservationId(a));
    const bId = Number(getReservationId(b));
    const aHas = !Number.isNaN(aId);
    const bHas = !Number.isNaN(bId);
    if (aHas && bHas) return idOrder === "asc" ? aId - bId : bId - aId;
    const aRaw = normalizeString(getReservationId(a));
    const bRaw = normalizeString(getReservationId(b));
    if (aRaw && bRaw) return idOrder === "asc" ? aRaw.localeCompare(bRaw) : bRaw.localeCompare(aRaw);
    if (aRaw) return -1;
    if (bRaw) return 1;
    return 0;
  });

  return result;
}

