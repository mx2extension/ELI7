'use client';

import { useState, useEffect, useRef } from "react";
import { ComposableMap, Geographies, Geography, Sphere, Graticule } from "react-simple-maps";
import { geoOrthographic } from "d3-geo";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

export default function MovingGlobeBg() {
  const [isMounted, setIsMounted] = useState(false);
  const [rotation, setRotation] = useState<[number, number, number]>([0, -10, 0]);
  const reqRef = useRef<number | null>(null);

  useEffect(() => {
    setIsMounted(true);

    const animate = () => {
      // Rotation speed increased by 0.1
      setRotation((prev) => [prev[0] + 0.25, prev[1], prev[2]]);
      reqRef.current = requestAnimationFrame(animate);
    };

    reqRef.current = requestAnimationFrame(animate);

    return () => {
      if (reqRef.current) cancelAnimationFrame(reqRef.current);
    };
  }, []);

  // Projection scale increased from 400 -> 440 (scaled up on both sides)
  const projection = geoOrthographic()
    .scale(440)
    .translate([400, 400])
    .rotate(rotation);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden flex items-center justify-center">
      {/* Container size increased to 320vmax / 320vmin to extend further out on both sides on desktop */}
      <div className="w-[320vmax] h-[320vmax] min-w-[1400px] min-h-[1400px] opacity-[0.15] flex items-center justify-center">
        {isMounted && (
          <ComposableMap
            projection={projection as any}
            width={800}
            height={800}
            style={{ width: "100%", height: "100%" }}
          >
            <Graticule stroke="#0A0A0A" strokeWidth={1} strokeOpacity={0.5} />
            <Sphere id="sphere-bg" fill="transparent" stroke="#0A0A0A" strokeWidth={1} />

            <Geographies geography={geoUrl}>
              {({ geographies }: { geographies: any[] }) =>
                geographies.map((geo: any) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill="transparent"
                    stroke="#0A0A0A"
                    strokeWidth={1}
                    style={{
                      default: { outline: "none" },
                      hover: { outline: "none" },
                      pressed: { outline: "none" },
                    }}
                  />
                ))
              }
            </Geographies>
          </ComposableMap>
        )}
      </div>
    </div>
  );
}