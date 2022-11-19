import React from 'react';
import ReactDOM from 'react-dom/client';
import 'aframe';
import './App.css';

import {
  Scene,
  Box,
  Sphere,
  Cylinder,
  Plane,
  Sky,
  Sound,
  Entity
} from '@belivvr/aframe-react';

import Rings from './Rings/Rings';
import Socket from './Socket/Socket';
import Boids from './Boids/Boids';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Socket />
    <Scene>
      <Rings />
      <Boids />
      <Sky color="#FAE908" />
    </Scene>
  </React.StrictMode>
);
