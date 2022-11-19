import React, { useEffect, useState } from "react";
import { Entity, Box } from "@belivvr/aframe-react";

const createBoids = (count) => {
  let x = 0;
  let z = 0;
  return (
    <>
      {Array(count)
        .fill(1)
        .map((input, i) => (
          <Box
            key={i}
            position={{
              x: (i % Math.ceil(Math.sqrt(count)) == 0 ? (x = 0) : (x += 1)) * 0.05,
              y: 0,
              z: (i % Math.ceil(Math.sqrt(count)) == 0 ? (z += 1) : z) * 0.05,
            }}
            height={0.01}
            depth={0.02}
            width={0.01}
            color="#000"
          />
        ))}
    </>
  );
};

function Boids() {
  return <Entity position={{ x: 0, y: 2, z: -2 }}>{createBoids(500)}</Entity>;
}

export default Boids;
