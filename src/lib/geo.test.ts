import { describe, expect, test } from "bun:test";
import khetData from "@/data/bangkokKhet.json";
import { featureCentroid, featureToPath, fitProjection, type KhetFeature } from "./geo";

const square = (code: string, x0: number, y0: number, size: number): KhetFeature => ({
  type: "Feature",
  properties: { code },
  geometry: {
    type: "MultiPolygon",
    coordinates: [[[[x0, y0], [x0 + size, y0], [x0 + size, y0 + size], [x0, y0 + size], [x0, y0]]]],
  },
});

describe("fitProjection", () => {
  test("fills the width, north up", () => {
    const f = square("01", 100, 13, 1);
    const p = fitProjection([f], 100);
    expect(p.project([100, 14])).toEqual([0, 0]); // north-west corner → top-left
    const [x, y] = p.project([101, 13]);
    expect(x).toBeCloseTo(100);
    expect(y).toBeCloseTo(p.height);
    // A degree of longitude is shorter than a degree of latitude away from the equator.
    expect(p.height).toBeGreaterThan(100);
  });

  test("no features → an empty box, not NaN", () => {
    expect(fitProjection([], 100).height).toBe(0);
  });
});

describe("featureToPath", () => {
  test("one closed subpath per ring, one decimal", () => {
    const d = featureToPath(square("01", 0, 0, 1), ([x, y]) => [x * 10.04, y * 10]);
    expect(d).toBe("M0,0L10,0L10,10L0,10L0,0Z");
  });

  test("a hole is its own subpath", () => {
    const withHole: KhetFeature = square("01", 0, 0, 4);
    withHole.geometry.coordinates[0]!.push([[1, 1], [1, 2], [2, 2], [2, 1], [1, 1]]);
    expect(featureToPath(withHole, (p) => p).match(/M/g)).toHaveLength(2);
  });
});

describe("featureCentroid", () => {
  test("the middle of the largest piece", () => {
    const f = square("01", 0, 0, 4);
    f.geometry.coordinates.push(square("01", 10, 10, 1).geometry.coordinates[0]!);
    const [x, y] = featureCentroid(f, (p) => p);
    expect(x).toBeCloseTo(2);
    expect(y).toBeCloseTo(2);
  });
});

describe("src/data/bangkokKhet.json", () => {
  const features = (khetData as unknown as { features: KhetFeature[] }).features;
  test("all 50 khet, codes 01–50, each with a drawable path", () => {
    expect(features.map((f) => f.properties.code)).toEqual(
      Array.from({ length: 50 }, (_, i) => String(i + 1).padStart(2, "0")),
    );
    const { project } = fitProjection(features, 600);
    for (const f of features) expect(featureToPath(f, project)).toMatch(/^M[\d.,L]+Z/);
  });
});
