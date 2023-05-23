import React, { useEffect, useState } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import './App.css'
const options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
};

const MIN_DISTANCE = 0

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const distance = Math.acos(Math.sin(lat1) * Math.sin(lat2) + Math.cos(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1)) * 6371000
  return distance
}

export default function SimpleMap() {
  const [currentPos, setCurrentPos] = useState({
    lat: 0,
    lng: 100
  })

  const [isAllowed, setIsAllowed] = useState(true)

  const handleChangePosition = (lat, lng) => {
    localStorage.setItem("lat", lat);
    localStorage.setItem("lng", lng);
    setCurrentPos({
      lat,
      lng
    })
  }

  const success = (pos) => {
    const crd = pos.coords;
    console.log("Your current position is:");
    console.log(`Latitude : ${crd.latitude}`);
    console.log(`Longitude: ${crd.longitude}`);
    const newDistance = calculateDistance(currentPos.lat, currentPos.lng, Number(crd.latitude), Number(crd.longitude))
    console.log(newDistance)
    if (newDistance > MIN_DISTANCE) handleChangePosition(crd.latitude, crd.longitude)
  }

  function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error, options);
      navigator.geolocation.watchPosition(success, error, options)

      navigator.permissions
        .query({ name: "geolocation" })
        .then(function (result) {
          console.log(result)
          if (result.state === 'granted') {
            setIsAllowed(true)
          }
          result.onchange = function () {
            setIsAllowed(result.state === 'granted')
          };
        });
    }
    else {
      console.log("Geolocation not supported")
    }
  }, [])

  const handleChangeRandomPos = () => {
    const newLat = currentPos.lat + Math.floor(Math.random() * 3) / 50000;
    const newLon = currentPos.lng + Math.floor(Math.random() * 3) / 50000;
    const newDistance = calculateDistance(currentPos.lat, currentPos.lng, newLat, newLon)
    console.log("new distance:", newDistance)
    if (newDistance > MIN_DISTANCE) handleChangePosition(newLat, newLon)
  }

  return (
    <div>
      <div class="button-3"
        onClick={() => isAllowed && handleChangeRandomPos()}
      >
        Change location
      </div>
      {isAllowed ?
        <GoogleMap
          center={currentPos}
          zoom={20}
          mapContainerStyle={{ height: "90vh", width: "100vw" }}
        >
          <Marker
            position={currentPos}
          />
        </GoogleMap> :
        <div>
          Location is not allowed
        </div>
      }
    </div>
  );
}