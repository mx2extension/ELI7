'use client';

import { useEffect, useRef } from 'react';
import { geoOrthographic, geoPath } from 'd3-geo';
import * as topojson from 'topojson-client';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

export default function MovingGlobeBg() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    let animationFrameId: number;
    let land: any;

    const projection = geoOrthographic()
      .scale(440)
      .translate([400, 400]);

    const path = geoPath(projection, context);

    // Fetch and parse world topography once on mount
    fetch(geoUrl)
      .then((res) => res.json())
      .then((data) => {
        land = topojson.feature(data, data.objects.countries);

        let rotation = 0;
        const render = () => {
          rotation += 0.25;
          projection.rotate([rotation, -10, 0]);

          context.clearRect(0, 0, canvas.width, canvas.height);

          // Draw globe boundary (Sphere)
          context.beginPath();
          path({ type: "Sphere" });
          context.strokeStyle = "#0A0A0A";
          context.lineWidth = 1;
          context.stroke();

          // Draw countries
          context.beginPath();
          path(land);
          context.strokeStyle = "#0A0A0A";
          context.lineWidth = 1;
          context.stroke();

          animationFrameId = requestAnimationFrame(render);
        };

        render();
      })
      .catch((err) => console.error("Failed to load map data:", err));

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden flex items-center justify-center">
      <div className="w-[320vmax] h-[320vmax] min-w-[1400px] min-h-[1400px] opacity-[0.15] flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={800}
          height={800}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    </div>
  );
}