// Just enough cartography for one city map, so the dashboard needs no map
// library: fit lng/lat into an SVG box, turn rings into `d` strings, find a
// point to hang a tooltip on.
//
// Equirectangular, with longitude shrunk by cos(latitude). Over Bangkok's
// half a degree that is indistinguishable from a proper projection; it would
// not be for a whole country.

export type Position = [number, number];

/** A boundary feature as src/data/bangkokKhet.json stores it — always a
 *  MultiPolygon, outer ring first in each polygon. */
export type KhetFeature = {
  type: "Feature";
  properties: { code: string };
  geometry: { type: "MultiPolygon"; coordinates: Position[][][] };
};

export type Projection = {
  width: number;
  height: number;
  project: (p: Position) => Position;
};

/** A projection that fits every feature into `width` (height follows). */
export function fitProjection(features: KhetFeature[], width: number): Projection {
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (const f of features) {
    for (const polygon of f.geometry.coordinates) {
      for (const [x, y] of polygon[0] ?? []) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  if (!Number.isFinite(minX)) return { width, height: 0, project: () => [0, 0] };

  const k = Math.cos((((minY + maxY) / 2) * Math.PI) / 180);
  const scale = width / ((maxX - minX) * k || 1);
  const height = (maxY - minY) * scale;
  // North up: SVG y grows downward, latitude grows upward.
  const project = ([x, y]: Position): Position => [(x - minX) * k * scale, (maxY - y) * scale];
  return { width, height, project };
}

const r1 = (n: number) => Math.round(n * 10) / 10;

/** Every ring of the feature as one SVG path, holes included — draw it with
 *  fill-rule="evenodd" so an enclave shows through. */
export function featureToPath(feature: KhetFeature, project: Projection["project"]): string {
  const parts: string[] = [];
  for (const polygon of feature.geometry.coordinates) {
    for (const ring of polygon) {
      if (ring.length < 3) continue;
      const pts = ring.map((p) => project(p)).map(([x, y]) => `${r1(x)},${r1(y)}`);
      parts.push(`M${pts.join("L")}Z`);
    }
  }
  return parts.join("");
}

/** Signed area and area-weighted centroid of one ring (shoelace). */
function ringCentroid(ring: Position[]): { area: number; x: number; y: number } {
  let a = 0, cx = 0, cy = 0;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [x0, y0] = ring[j]!;
    const [x1, y1] = ring[i]!;
    const cross = x0 * y1 - x1 * y0;
    a += cross;
    cx += (x0 + x1) * cross;
    cy += (y0 + y1) * cross;
  }
  if (a === 0) {
    const [x, y] = ring[0] ?? [0, 0];
    return { area: 0, x, y };
  }
  return { area: Math.abs(a / 2), x: cx / (3 * a), y: cy / (3 * a) };
}

/** The centroid of the feature's largest piece, in projected coordinates —
 *  the largest, so a district with a stray islet anchors on the mainland. */
export function featureCentroid(feature: KhetFeature, project: Projection["project"]): Position {
  let best = { area: -1, x: 0, y: 0 };
  for (const polygon of feature.geometry.coordinates) {
    const outer = polygon[0];
    if (!outer || outer.length < 3) continue;
    const c = ringCentroid(outer.map((p) => project(p)));
    if (c.area > best.area) best = c;
  }
  return [best.x, best.y];
}
