'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const icon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface Listing {
  id: number;
  title: string;
  price: string;
  image: string;
  city: string;
  lat: number;
  lng: number;
}

export default function MarketplaceMap({
  listings,
}: {
  listings: Listing[];
}) {
  return (
    <MapContainer
      center={[listings[0]?.lat || 0, listings[0]?.lng || 0]}
      zoom={10}
      scrollWheelZoom={true}
      className="h-screen w-full"
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      />

      {listings.map((item) => (
        <Marker
          key={item.id}
          position={[item.lat, item.lng]}
          icon={icon}
        >
          <Popup>
            <div className="w-52">
              <img
                src={item.image}
                alt={item.title}
                className="h-28 w-full rounded-lg object-cover"
              />

              <h3 className="mt-2 font-bold">{item.title}</h3>
              <p>{item.price}</p>
              <p>{item.city}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}