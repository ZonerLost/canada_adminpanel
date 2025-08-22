import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { MdSearch, MdAdd, MdRemove } from "react-icons/md";
import "leaflet/dist/leaflet.css";
import React from "react";


// Zoom Control Component
const ZoomControl = () => {
  const map = useMap();
  return (
    <div className="absolute right-4 top-4 z-[1000] flex flex-col gap-2">
      <button
        onClick={() => map.zoomIn()}
        className="bg-white p-2 rounded-lg shadow-md hover:bg-gray-50"
      >
        <MdAdd className="w-5 h-5" />
      </button>
      <button
        onClick={() => map.zoomOut()}
        className="bg-white p-2 rounded-lg shadow-md hover:bg-gray-50"
      >
        <MdRemove className="w-5 h-5" />
      </button>
    </div>
  );
};

const RecenterMap = ({ center }) => {
  const map = useMap();
  map.setView(center);
  return null;
};


const SimpleMap = ({ center }) => {
  const defaultCenter = center
    ? ([center.lat, center.lng] )
    : ([33.5973, 73.0479] ); // Fallback to Saddar, Rawalpindi

  return (
    <div className="relative rounded-xl overflow-hidden shadow-sm border border-gray-200">
      {/* Optional Search bar */}
      <div className="absolute top-4 left-4 z-[1000] w-72">
        <div className="relative">
          <MdSearch
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search by area"
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#22c55e] focus:border-transparent"
          />
        </div>
      </div>

      {/* Map */}
      <MapContainer
        center={defaultCenter}
        zoom={14}
        className="h-[500px] w-full"
        zoomControl={false}
      >
        <RecenterMap center={defaultCenter} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        <ZoomControl />
      </MapContainer>
    </div>
  );
};

export default SimpleMap;
