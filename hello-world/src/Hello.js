import React, { useEffect, useRef, useState } from 'react';
import st from './cards.scss';
import locationIcon from '../../assets/svg/location-dot-solid.svg'
import { Box } from "./TheeDemo"
import { Canvas, useFrame, Camera, extend,  TextureLoader  } from '@react-three/fiber'
import { useGLTF, Edges, MeshPortalMaterial, CameraControls, Environment, PivotControls, OrbitControls,
   Sky as Skypremitive, Terrain, Ground, PerspectiveCamera
} from '@react-three/drei'
import { useControls } from 'leva'
import * as THREE from 'three';
import Noise from 'noisejs';
import {MySky, Sun, SkyWithShaders} from "./SkyGround";


// import { OrbitControls } from 'drei';

// Extend the THREE namespace with OrbitControls
extend({ OrbitControls });

const Sky = () => {
  const meshRef = useRef();

  // Use the useFrame hook to animate the sky
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x = 0.002;
      meshRef.current.rotation.y = 0.002;
    }
  });

  // Create a new noise instance
  const noise = new Noise.Noise();

  // Create a new canvas element.
  const canvas = document.createElement('canvas');

  // Get the context of the canvas element.
  const ctx = canvas.getContext('2d');

  // Set the dimensions of the canvas element.
  canvas.width = 556; // Increase canvas size for better resolution
  canvas.height = 5506;

  // Iterate over each pixel of the canvas element.
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      // Generate a random noise value.
      const noiseValue = noise.simplex2(x / 50, y / 50); // Adjust scale for better results

      // Map the noise value to the range [0, 1]
      const mappedValue = (noiseValue + 1) / 2;

      // Set the opacity of the pixel based on the noise value.
      ctx.fillStyle = `rgba(255, 255, 255, ${mappedValue})`;
      ctx.fillRect(x, y, 1, 1);
    }
  }

  // Create a new texture from the canvas element.
  const texture = new THREE.CanvasTexture(canvas);

  // Create a new Material object.
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.DoubleSide, // Make sure the material is visible from both sides
    transparent: true, // Enable transpare
  });

  // Create a new SphereGeometry object.
  const geometry = new THREE.BoxGeometry(1000, 1000, 1000);// new THREE.SphereGeometry(500, 100, 100); // Adjust sphere size

  return (
    <mesh ref={meshRef} geometry={geometry} material={material} />
  );
};

const App = () => (
  <Canvas shadows camera={{ position: [-3, 0.5, 3] }}>
    <PivotControls anchor={[-1.1, -1.1, -1.1]} scale={0.75} lineWidth={3.5}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2, 2, 2]} />
        <Edges />
      </mesh>
    </PivotControls>
    <CameraControls makeDefault />
  </Canvas>
)

function Side({ rotation = [0, 0, 0], bg = '#f0f0f0', children, index }) {
  const mesh = useRef()
  const { worldUnits } = useControls({ worldUnits: false })
  const { nodes } = useGLTF('/aobox-transformed.glb')
  useFrame((state, delta) => {
    mesh.current.rotation.x = mesh.current.rotation.y += delta
  })
  return (
    <MeshPortalMaterial worldUnits={worldUnits} attach={`material-${index}`}>
      {/** Everything in here is inside the portal and isolated from the canvas */}
      <ambientLight intensity={0.5} />
      <Environment preset="city" />
      {/** A box with baked AO */}
      <mesh castShadow receiveShadow rotation={rotation} geometry={nodes.Cube.geometry}>
        <meshStandardMaterial aoMapIntensity={1} aoMap={nodes.Cube.material.aoMap} color={bg} />
        <spotLight castShadow color={bg} intensity={2} position={[10, 10, 10]} angle={0.15} penumbra={1} shadow-normalBias={0.05} shadow-bias={0.0001} />
      </mesh>
      {/** The shape */}
      <mesh castShadow receiveShadow ref={mesh}>
        {children}
        <meshLambertMaterial color={bg} />
      </mesh>
    </MeshPortalMaterial>
  )
}


const DEG45 = Math.PI / 4;


const CameraHelper = () => {
  const camera = new THREE.PerspectiveCamera(60, 1, 1, 2000);
  return <group position={[0, 100, 500]}>
    <cameraHelper args={[camera]} />
  </group>
}

function Hello(props) {
    const cameraControlRef = useRef(null);

    // Create a state variable to store the terrain heightmap
  const [heightmap, setHeightmap] = useState([]);

  return (
    <div className={st.top}>
      <div className={st.bg}>
        <h1 onClick={() => alert('woo ha3 hoo')}> WebGl world playground</h1>
      </div>
      <div className={st.bottom} style={{ width: "100vw", height: "100vh" }}>
        <Canvas height={"100%"} 
        camera={{ position: [0, 100, 500], fov: 60, rotateY : Math.PI * 0.5,  far:2000, rotation:new THREE.Euler(Math.PI * 0.25, 0,0,'XYZ' )}}
        >
          <ambientLight intensity={0.1}  color={"white"}/>
          <directionalLight position={[0, 0, 100]} />
          <Sun />
          <SkyWithShaders/>
          <MySky />
          {/* <PerspectiveCamera position={[0, 0, 0]} fov={75}/> */}
          <CameraHelper />
          <OrbitControls />
          {/* <Skypremitive
            distance={450000}
            sunPosition={[5, 1, 8]}
            inclination={0}
            azimuth={0.25}
            scale={450000}
            rayleigh={1}
          // {...props}
          /> */}
        </Canvas>
      </div>
    </div>
  )
}

export default Hello;
// https://codesandbox.io/s/cameracontrols-basic-forked-22hfx3?file=/src/App.js:4330-4351