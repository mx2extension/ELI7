'use client';

import { useState, useEffect } from "react";
import { ComposableMap, Geographies, Geography, Sphere, Graticule } from "react-simple-maps";
import { geoOrthographic } from "d3-geo";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

export default function MovingGlobeBg() {
  const [isMounted, setIsMounted] = useState(false);
  const [rotation, setRotation] = useState<[number, number, number]>([0, -10, 0]);

  useEffect(() => {
    setIsMounted(true);
    
    const interval = setInterval(() => {
      setRotation((prev) => [prev[0] + 0.2, prev[1], prev[2]]);
    }, 30);

    return () => clearInterval(interval);
  }, []);

  const projection = geoOrthographic()
    .scale(400)
    .translate([400, 400]) // <--- ADDED THIS to perfectly center the globe in the 800x800 canvas
    .rotate(rotation);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden flex items-center justify-center">
      <div className="w-[300vmin] h-[300vmin] opacity-[0.15] flex items-center justify-center">
        {isMounted && (
          <ComposableMap
            projection={projection}
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