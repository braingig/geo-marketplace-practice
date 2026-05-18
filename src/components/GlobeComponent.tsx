'use client';

import 'cesium/Build/Cesium/Widgets/widgets.css';

import { useEffect, useRef, useState } from 'react';

import { Viewer, Entity } from 'resium';

import {
  Cartesian2,
  Cartesian3,
  Color,
  Ion,
  ScreenSpaceEventHandler,
  ScreenSpaceEventType,
} from 'cesium';

import { motion } from 'framer-motion';

import '../../lib/cesiumClient';

import ListingSidebar from './ListingSidebar';
import { listings } from '../data/listings';
import { ImageryLayer } from 'resium';

import {
  ArcGisMapServerImageryProvider,
} from 'cesium';

export default function GlobeComponent() {
  const viewerRef = useRef<any>(null);

  const [selectedCity, setSelectedCity] =
    useState<string | null>(null);

  const [hovered, setHovered] = useState<any>(null);

  const filteredListings = selectedCity
    ? listings.filter(
      (item) => item.city === selectedCity
    )
    : [];

  useEffect(() => {
    if (!viewerRef.current?.cesiumElement) return;

    const viewer = viewerRef.current.cesiumElement;

    viewer.camera.flyTo({
      destination: Cartesian3.fromDegrees(
        90,
        24,
        4500000
      ),
    });
  }, []);

  return (
    <div className="h-screen w-full overflow-hidden bg-black">
      <div className="flex h-full">
        {/* LEFT PANEL */}

        {selectedCity && (
          <motion.div
            initial={{ x: -400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-[40%] overflow-y-auto bg-white"
          >
            <ListingSidebar listings={filteredListings} />
          </motion.div>
        )}

        {/* GLOBE */}

        <motion.div
          animate={{
            width: selectedCity ? '60%' : '100%',
          }}
          transition={{ duration: 0.6 }}
          className="relative h-full"
        >
          <Viewer
            ref={viewerRef}
            full
            animation={false}
            timeline={false}
            baseLayerPicker={false}
            navigationHelpButton={false}
            homeButton={false}
            sceneModePicker={false}
            geocoder={false}
            infoBox={false}
            selectionIndicator={false}

          >
            <ImageryLayer
              imageryProvider={
                ArcGisMapServerImageryProvider.fromUrl(
                  'https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer'
                )
              }
            />
            {listings.map((item) => (
              <Entity
                key={item.id}
                name={item.title}
                ellipse={{
                  semiMinorAxis: 70000,
                  semiMajorAxis: 70000,
                  material: Color.CYAN.withAlpha(0.25),
                  height: 0,
                }}
                position={Cartesian3.fromDegrees(
                  item.lng,
                  item.lat
                )}
                point={{
                  pixelSize: 12,
                  color: Color.CYAN,
                  outlineColor: Color.WHITE,
                  outlineWidth: 2,
                }}
                label={{
                  text: item.city,
                  font: '16px sans-serif',
                  fillColor: Color.WHITE,
                  showBackground: true,
                  backgroundColor: Color.BLACK,
                  pixelOffset: new Cartesian2(0, -40),
                }}
                // description={`
                //   <div style="padding:10px">
                //     <h2>${item.title}</h2>
                //     <p>${item.price}</p>
                //     <p>${item.city}</p>
                //   </div>
                // `}
                onClick={() => {
                  setSelectedCity(item.city);

                  viewerRef.current?.cesiumElement.camera.flyTo(
                    {
                      destination:
                        Cartesian3.fromDegrees(
                          item.lng,
                          item.lat,
                          1500000
                        ),
                    }
                  );
                }}
              />
            ))}
          </Viewer>

          {/* TOP TEXT */}

          <div className="absolute top-8 left-8 z-50 rounded-2xl bg-black/50 p-6 text-white backdrop-blur-md">
            <h1 className="text-5xl font-bold">
              3D Geo Marketplace
            </h1>

            <p className="mt-3 text-lg text-gray-300">
              Explore listings around the world.
            </p>

            {selectedCity && (
              <button
                onClick={() => setSelectedCity(null)}
                className="mt-4 rounded-xl bg-cyan-500 px-4 py-2 font-semibold"
              >
                Back To Globe
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}