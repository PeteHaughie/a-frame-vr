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
  Sound
} from '@belivvr/aframe-react';

import Rings from './Rings';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Scene>
      <Rings />
      <Sky color="#FAE908" />
      <Sound
        src="url(./dreamy.mp3)"
        autoplay={ true }
        loop={ true }
        position={{ x:0, y:0, z:0 }}
      />
    </Scene>
  </React.StrictMode>
);
