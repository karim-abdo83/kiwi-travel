// Client-safe: no config imports, only the ordering rule shared by the server (ItemList) and the grid.

export type PriorityOptions = {
  priority?: readonly string[];
  off?: readonly string[];
};

type SortableTrip = { slug: string; isFeatured: boolean };

/**
 * "Default / Recommended" order:
 * 1. active trips listed in `priority`, in that order;
 * 2. other active trips, featured first, then their original order;
 * 3. off-season trips last, keeping the same rules among themselves.
 */
export function sortByPriority<T extends SortableTrip>(trips: readonly T[], options: PriorityOptions): T[] {
  const rank = new Map((options.priority ?? []).map((slug, index) => [slug, index]));
  const off = new Set(options.off ?? []);
  const original = new Map(trips.map((trip, index) => [trip.slug, index]));
  const listed = (trip: T) => rank.get(trip.slug) ?? Number.MAX_SAFE_INTEGER;

  return [...trips].sort(
    (a, b) =>
      Number(off.has(a.slug)) - Number(off.has(b.slug)) ||
      listed(a) - listed(b) ||
      Number(b.isFeatured) - Number(a.isFeatured) ||
      (original.get(a.slug) ?? 0) - (original.get(b.slug) ?? 0),
  );
}
