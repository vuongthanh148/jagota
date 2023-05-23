import React from 'react';
import './index.css';
import { render } from "react-dom";
import App from './App';
import { LoadScript } from '@react-google-maps/api';

const root = document.getElementById("root");
render(
  <LoadScript googleMapsApiKey={process.env.REACT_APP_MAP_KEY} libraries={['places']}>
    <App />
  </LoadScript>, root);
