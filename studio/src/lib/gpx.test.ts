import { inferDifficulty, parseGpx } from "./gpx";

const sampleGpx = `<?xml version="1.0" encoding="UTF-8"?>
<gpx xmlns="http://www.topografix.com/GPX/1/1" version="1.1">
  <metadata><time>2026-07-20T16:00:00Z</time></metadata>
  <trk>
    <name>Cascade Pass Test</name>
    <desc>A sample imported trail.</desc>
    <trkseg>
      <trkpt lat="48.4785" lon="-121.0786"><ele>1000</ele><time>2026-07-20T16:00:00Z</time></trkpt>
      <trkpt lat="48.4795" lon="-121.0776"><ele>1010</ele><time>2026-07-20T16:10:00Z</time></trkpt>
      <trkpt lat="48.4805" lon="-121.0766"><ele>1008</ele><time>2026-07-20T16:20:00Z</time></trkpt>
    </trkseg>
  </trk>
</gpx>`;

describe("GPX import", () => {
  it("extracts route geometry and fills hike metrics", () => {
    const result = parseGpx(sampleGpx);

    expect(result.name).toBe("Cascade Pass Test");
    expect(result.description).toBe("A sample imported trail.");
    expect(result.date).toBe("2026-07");
    expect(result.coordinates).toEqual([-121.0786, 48.4785]);
    expect(result.points).toHaveLength(3);
    expect(result.distanceMiles).toBeGreaterThan(0.1);
    expect(result.elevationFeet).toBe(33);
    expect(result.movingHours).toBeCloseTo(0.33, 2);
    expect(result.elapsedHours).toBeCloseTo(0.33, 2);
    expect(result.elevationProfileFeet).toEqual([3281, 3314, 3307]);
  });

  it("rejects malformed and empty GPX files", () => {
    expect(() => parseGpx("<gpx><trk>")).toThrow("GPX file is invalid");
    expect(() => parseGpx("<gpx />")).toThrow("at least two valid points");
  });

  it("leaves optional metrics unset when the GPX omits them", () => {
    const result = parseGpx(`
      <gpx xmlns="http://www.topografix.com/GPX/1/1">
        <metadata><name>Metadata trail</name></metadata>
        <trk><trkseg>
          <trkpt lat="47" lon="-122" />
          <trkpt lat="47.001" lon="-121.999" />
        </trkseg></trk>
      </gpx>
    `);

    expect(result.name).toBe("Metadata trail");
    expect(result.elevationFeet).toBeUndefined();
    expect(result.movingHours).toBeUndefined();
    expect(result.elevationProfileFeet).toEqual([]);
  });

  it("infers difficulty from imported distance and elevation", () => {
    expect(inferDifficulty(3, 500)).toBe("Easy");
    expect(inferDifficulty(7, 1_500)).toBe("Moderate");
    expect(inferDifficulty(11, 2_000)).toBe("Strenuous");
    expect(inferDifficulty(6, 3_100)).toBe("Strenuous");
  });
});
