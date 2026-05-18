'use client';

import 'cesium/Build/Cesium/Widgets/widgets.css';

import { useRef, useState } from 'react';

import { Viewer, Entity } from 'resium';

import type { Viewer as CesiumViewer } from 'cesium';

import {
  ArcGisMapServerImageryProvider,
  BoundingSphere,
  Cartesian2,
  Cartesian3,
  Color,
  EllipsoidTerrainProvider,
  HeadingPitchRange,
  Math as CesiumMath,
} from 'cesium';

import { motion } from 'framer-motion';

import '../../lib/cesiumClient';

import ListingSidebar from './ListingSidebar';
import { listings } from '../data/listings';

const WORLD_IMAGERY_URL =
  'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer';

const WORLD_LABELS_URL =
  'https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer';

async function setupViewer(viewer: CesiumViewer) {
  viewer.imageryLayers.removeAll();

  const satelliteImagery =
    await ArcGisMapServerImageryProvider.fromUrl(WORLD_IMAGERY_URL);
  viewer.imageryLayers.addImageryProvider(satelliteImagery);

  const placeLabels =
    await ArcGisMapServerImageryProvider.fromUrl(WORLD_LABELS_URL);
  viewer.imageryLayers.addImageryProvider(placeLabels);

  viewer.terrainProvider = new EllipsoidTerrainProvider();
}

const EARTH_RADIUS_METERS = 6378137;

/** Full Earth in view, centered in the canvas (not zoomed to listing cluster). */
function frameFullGlobe(viewer: CesiumViewer, duration = 1.5) {
  const earth = new BoundingSphere(Cartesian3.ZERO, EARTH_RADIUS_METERS);

  viewer.resize();
  viewer.camera.flyToBoundingSphere(earth, {
    duration,
    offset: new HeadingPitchRange(
      CesiumMath.toRadians(25),
      CesiumMath.toRadians(-28),
      EARTH_RADIUS_METERS * 5.8
    ),
  });
}

export default function GlobeComponent() {
  const viewerRef = useRef<CesiumViewer | null>(null);
  const hasFramedGlobe = useRef(false);

  const [selectedCity, setSelectedCity] =
    useState<string | null>(null);

  const filteredListings = selectedCity
    ? listings.filter(
      (item) => item.city === selectedCity
    )
    : [];

  const handleViewerRef = (ref: { cesiumElement?: CesiumViewer } | null) => {
    const viewer = ref?.cesiumElement;
    if (!viewer || hasFramedGlobe.current) return;

    viewerRef.current = viewer;
    hasFramedGlobe.current = true;

    void (async () => {
      await setupViewer(viewer);
      requestAnimationFrame(() => frameFullGlobe(viewer, 0));
    })();
  };

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
            ref={handleViewerRef}
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
                description={`
                  <div style="padding:10px">
                    <h2>${item.title}</h2>
                    <p>${item.price}</p>
                    <p>${item.city}</p>
                  </div>
                `}
                onClick={() => {
                  setSelectedCity(item.city);

                  viewerRef.current?.camera.flyTo({
                    destination: Cartesian3.fromDegrees(
                      item.lng,
                      item.lat,
                      800000
                    ),
                    duration: 1.5,
                  });
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
                onClick={() => {
                  setSelectedCity(null);
                  if (viewerRef.current) {
                    frameFullGlobe(viewerRef.current);
                  }
                }}
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