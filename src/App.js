import React, { useEffect, useState } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";

const options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
};


const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const distance = Math.acos(Math.sin(lat1) * Math.sin(lat2) + Math.cos(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1)) * 6371000
  return distance.toString()
}

export default function SimpleMap() {
  const [currentPos, setCurrentPos] = useState({
    lat: 21.03555,
    lng: 105.788697
  })

  const handleChangePosition = (lat, lng) => {
    localStorage.setItem("lat", lat);
    localStorage.setItem("lng", lng);
    setCurrentPos({
      lat,
      lng
    })
  }

  function success(pos) {
    const crd = pos.coords;

    console.log("Your current position is:");
    console.log(`Latitude : ${crd.latitude}`);
    console.log(`Longitude: ${crd.longitude}`);
    const newDistance = calculateDistance(currentPos.lat, currentPos.lng, Number(crd.latitude), Number(crd.longitude))
    console.log(newDistance)
    if (newDistance > 5) handleChangePosition(crd.latitude, crd.longitude)
  }

  function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(success, error, options);
    navigator.geolocation.watchPosition(success, error, options)
  }, [])

  const handleChangeRandomPos = () => {
    const newLat = currentPos.lat + Math.floor(Math.random() * 3) / 50000;
    const newLon = currentPos.lng + Math.floor(Math.random() * 3) / 50000;
    const newDistance = calculateDistance(currentPos.lat, currentPos.lng, newLat, newLon)
    console.log("new distance:", newDistance)
    if (newDistance > 5) handleChangePosition(newLat, newLon)
  }

  return (
    <div>
      <div style={{
        width: '80px',
        height: '30px',
        padding: '10px',
        marginBottom: '15px',
        color: 'white',
        backgroundColor: 'blue',
        cursor: 'pointer'
      }}
        onClick={handleChangeRandomPos}
      >
        Change location
      </div>
      <GoogleMap
        center={currentPos}
        zoom={12}
        mapContainerStyle={{ height: "100vh", width: "100vw" }}
      >
        <Marker
          position={currentPos}
        />
      </GoogleMap>
    </div>
  );
}