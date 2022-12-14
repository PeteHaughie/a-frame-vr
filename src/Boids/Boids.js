import React, { useEffect, useState } from "react";
import { Entity, Box, Sphere } from "@belivvr/aframe-react";
import { Object3D } from "aframe";

class BoidObject {
  constructor(
    radius = 100,
    d = {
      x: 100,
      y: 100,
      z: 100
    },
    v = {
      x: 0,
      y: 0,
      z: 0,
      min: 0,
      max: 0,
    },
    fov = 360,
    closeRange = 0,
    farRange = 0,
    boundaryRange = 0,
    seperationFactor = 0,
    cohesionFactor = 0,
    alignmentFactor = 0,
    boundaryFactor = 0
  ) {
    this.radius = radius;
    this.d = d;
    this.v = v;
    this.fov = fov;
    this.closeRange = closeRange;
    this.farRange = closeRange + farRange;
    this.boundaryRange = boundaryRange + radius;
    this.seperationFactor = seperationFactor;
    this.cohesionFactor = cohesionFactor;
    this.alignmentFactor = alignmentFactor;
    this.boundaryFactor = boundaryFactor;
    this.color = `hsl(0,0%,100%)`;
  }
}

const Boids = () => {
  const [screenDimensions, setScreenDimensions] = useState({
    width: 250,
    height: 10,
  });
  
  const [count, setCount] = useState(0);
  const [boids, setBoids] = useState([]);

  // update count, dimensions, step
  useEffect(() => {
    const id = setInterval(() => {
      setCount(count + 1);
      updateScreen();
      step();
      if (count >= 0 && count % 1 == 0 && boids.length <= 300) {
        addBoid();
      }
    }, 15);

    return () => {
      clearInterval(id);
    };
  }, [count]);
  const updateScreen = () => {
    setScreenDimensions({
      width: 250,
      height: 10,
    });
  };

  // ----------------------------------------------------------------

  //1 step in time
  const step = () => {
    // make new copy of current boids
    let newBoids = boids;
    // each boid loop
    for (let i = 0; i < newBoids.length; i++) {
      let closeNeighbours = 0;
      let closeDistance = { x: 0, y: 0, z: 0 };
      let farNeighbours = 0;
      let farDistance = { x: 0, y: 0, z: 0 };
      let farVelocity = { x: 0, y: 0, z: 0 };
      // comparision loop
      for (let j = 0; j < newBoids.length; j++) {
        // all other boids
        if (i !== j) {
          const distance =
            Math.sqrt(
              Math.pow(newBoids[j].d.x - newBoids[i].d.x, 2) +
              Math.pow(newBoids[j].d.y - newBoids[i].d.y, 2) +
              Math.pow(newBoids[j].d.z - newBoids[i].d.z, 2)
            ) -
            newBoids[i].radius -
            newBoids[j].radius;
          // other boid is within far range
          if (distance < newBoids[i].farRange) {
            // other boid within close range
            if (distance < newBoids[i].closeRange) {
              closeNeighbours += 1;
              closeDistance.x += newBoids[i].d.x - newBoids[j].d.x;
              closeDistance.y += newBoids[i].d.y - newBoids[j].d.y;
              closeDistance.z += newBoids[i].d.z - newBoids[j].d.z;
            }
            // other boid outside close range
            else {
              farNeighbours += 1;

              farDistance.x += newBoids[j].d.x;
              farDistance.y += newBoids[j].d.y;
              farDistance.z += newBoids[j].d.z;

              farVelocity.x += newBoids[j].v.x;
              farVelocity.y += newBoids[j].v.y;
              farVelocity.z += newBoids[j].v.z;
            }
          }
        }
      }

      if (closeNeighbours > 0) {
        newBoids[i].v.x += closeDistance.x * newBoids[i].seperationFactor;
        newBoids[i].v.y += closeDistance.y * newBoids[i].seperationFactor;
        newBoids[i].v.z += closeDistance.z * newBoids[i].seperationFactor;
      }

      if (farNeighbours > 0) {
        closeDistance.x = closeDistance.x / farNeighbours;
        closeDistance.y = closeDistance.y / farNeighbours;
        closeDistance.z = closeDistance.z / farNeighbours;
        newBoids[i].v.x +=
          (closeDistance.x - newBoids[i].d.x) * newBoids[i].cohesionFactor;
        newBoids[i].v.y +=
          (closeDistance.y - newBoids[i].d.y) * newBoids[i].cohesionFactor;
        newBoids[i].v.z +=
          (closeDistance.z - newBoids[i].d.z) * newBoids[i].cohesionFactor;

        farVelocity.x = farVelocity.x / farNeighbours;
        farVelocity.y = farVelocity.y / farNeighbours;
        farVelocity.z = farVelocity.z / farNeighbours;
        newBoids[i].v.x +=
          (farVelocity.x - newBoids[i].v.x) * newBoids[i].alignmentFactor;
        newBoids[i].v.y +=
          (farVelocity.y - newBoids[i].v.y) * newBoids[i].alignmentFactor;
        newBoids[i].v.z +=
          (farVelocity.z - newBoids[i].v.z) * newBoids[i].alignmentFactor;
      }

      // avoid boundaries of the flock area
      if (newBoids[i].d.x < newBoids[i].boundaryRange) {
        newBoids[i].v.x +=
          (1 - newBoids[i].d.x / newBoids[0].boundaryRange) *
          newBoids[i].boundaryFactor;
      } else if (
        newBoids[i].d.x >
        screenDimensions.width - newBoids[i].boundaryRange
      ) {
        newBoids[i].v.x -=
          (1 -
            (screenDimensions.width - newBoids[i].d.x) /
              newBoids[0].boundaryRange) *
          newBoids[i].boundaryFactor;
      }
      if (newBoids[i].d.y < newBoids[i].boundaryRange) {
        newBoids[i].v.y +=
          (1 - newBoids[i].d.y / newBoids[0].boundaryRange) *
          newBoids[i].boundaryFactor;
      } else if (
        newBoids[i].d.y >
        screenDimensions.height - newBoids[i].boundaryRange
      ) {
        newBoids[i].v.y -=
          (1 -
            (screenDimensions.height - newBoids[i].d.y) /
              newBoids[0].boundaryRange) *
          newBoids[i].boundaryFactor;
      }
      if (newBoids[i].d.z < newBoids[i].boundaryRange) {
        newBoids[i].v.z +=
          (1 - newBoids[i].d.z / newBoids[0].boundaryRange) *
          newBoids[i].boundaryFactor;
      } else if (
        newBoids[i].d.z >
        screenDimensions.height - newBoids[i].boundaryRange
      ) {
        newBoids[i].v.z -=
          (1 -
            (screenDimensions.height - newBoids[i].d.z) /
            newBoids[0].boundaryRange) *
          newBoids[i].boundaryFactor;
      }

      // update displacement
      newBoids[i].d.x += newBoids[i].v.x;
      newBoids[i].d.y += newBoids[i].v.y;
      newBoids[i].d.z += newBoids[i].v.z;

      // fix velocity
      const velocity = Math.sqrt(
        Math.pow(newBoids[i].v.x, 2) + Math.pow(newBoids[i].v.y, 2) + Math.pow(newBoids[i].v.z, 2)
      );

      if (velocity < newBoids[i].v.min) {
        newBoids[i].v.x = (newBoids[i].v.x / velocity) * newBoids[i].v.min;
        newBoids[i].v.y = (newBoids[i].v.y / velocity) * newBoids[i].v.min;
        newBoids[i].v.z = (newBoids[i].v.z / velocity) * newBoids[i].v.min;
      } else if (velocity > newBoids[i].v.max) {
        newBoids[i].v.x = (newBoids[i].v.x / velocity) * newBoids[i].v.max;
        newBoids[i].v.y = (newBoids[i].v.y / velocity) * newBoids[i].v.max;
        newBoids[i].v.z = (newBoids[i].v.z / velocity) * newBoids[i].v.max;
      }
    }
    // update new array
    setBoids(newBoids);
  };

  const addBoid = () => {
    const newBoids = boids;
    newBoids.push(
      new BoidObject(
        1, // radius
        {
          // displacement
          x: screenDimensions.width * Math.random(),
          y: screenDimensions.height / 2 * Math.random(),
          z: screenDimensions.width  * Math.random(),
        },
        {
          // velocity
          x: Math.random() * 2 - 1,
          y: Math.random() * 2 - 1,
          z: Math.random() * 2 - 1,
          min: 1 + (Math.random() * 0.2 - 0.1),
          max: 2 + (Math.random() * 0.2 - 0.1),
        },
        0, //fov - NOT USED
        7.5 + 2.5 * Math.random(), //close range
        50, //far range
        80, // boundary range
        0.01, // seperation factor
        0.0000006, // cohesion factor
        0.04, // alignment factor
        0.4 // boundary factor
      )
    );
    setBoids(newBoids);
  };

  const addBoid2 = () => {
    const newBoids = boids;
    newBoids.push(
      new BoidObject(
        5, // radius
        {
          // displacement
          x: screenDimensions.width / 2,
          y: screenDimensions.height / 4,
          z: screenDimensions.width / 2,
        },
        {
          // velocity
          x: Math.random() * 10 - 5,
          y: Math.random() * 10 - 5,
          z: Math.random() * 10 - 5,
          min: 0,
          max: 1.1,
        },
        0, //fov - NOT USED
        100, //close range
        0, //far range
        80, // boundary range
        0.0004, // seperation factor
        0, // cohesion factor
        -0.1, // alignment factor
        2 // boundary factor
      )
    );
    setBoids(newBoids);
  };

  // ----------------------------------------------------------------

  return (
    <Entity position={{x: 0, y: 2, z: -4}}>
      {boids.map((boid, index) => (
        // <Box
        //   key={index}
        //   position={{ x: boid.d.x * 1, y: (boid.d.y * 1) + 1, z: boid.d.z * 1 }}
        //   width={0.5}
        //   height={0.5}
        //   depth={1}
        //   color="#000"
        // />
        <Sphere
          key={index}
          animation={{
            property: 'position',
            to: `${boid.d.x} ${boid.d.y} ${boid.d.z}`
          }}
          radius={0.1}
          color="#000"
        />
      ))}
    </Entity>
  );
};

export default Boids;
