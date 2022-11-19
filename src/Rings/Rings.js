import React from 'react';
import { Entity, Ring } from '@belivvr/aframe-react';

const createRings = count => {
  return (<>{Array(count).fill(1).map((input, i) => (
    <Ring key={i}
      position={{ x: 0, y: 0, z: 0 }}
      radiusInner={1.58}
      radiusOuter={1.6}
      width={1}
      segmentsTheta={32 * 4}
      animation={{
        property: 'rotation',
        from: '0 0 0',
        to: '0 360 0',
        easing: 'linear',
        loop: -1,
        dur: i * 1000
      }}
      color="#000"
    />))}
  </>)
}

function Rings() {
  return (
    <Entity
      position={{ x: -2, y: 3, z: -5 }}
      animation={{
        property: 'rotation',
        from: '0 0 0',
        to: '0 360 360',
        easing: 'linear',
        loop: -1,
        dur: 10000
      }}
    >
      { createRings(10) }
    </Entity>
  );
}

export default Rings;
