import React, { useEffect, useRef, useState } from 'react';
import st from './cards.scss';
import locationIcon from '../../assets/svg/location-dot-solid.svg'
import { Box } from "./TheeDemo"
import { Canvas, useFrame, Camera, extend,  TextureLoader  } from '@react-three/fiber'
import { useGLTF, Edges, MeshPortalMaterial, CameraControls, Environment, PivotControls, OrbitControls,
   Sky as Skypremitive, Terrain, Ground
} from '@react-three/drei'
import { useControls } from 'leva'
import * as THREE from 'three';
import Noise from 'noisejs';
import {MySky, Sun} from "./SkyGround";


// import { OrbitControls } from 'drei';

// Extend the THREE namespace with OrbitControls
extend({ OrbitControls });

const Sky = () => {
  const meshRef = useRef();

  // Use the useFrame hook to animate the sky
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.002;
      meshRef.current.rotation.y += 0.002;
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
        {/* <Side rotation={[0, 0, 0]} bg="orange" index={0}>
          <torusGeometry args={[0.65, 0.3, 64]} />
        </Side>
        <Side rotation={[0, Math.PI, 0]} bg="lightblue" index={1}>
          <torusKnotGeometry args={[0.55, 0.2, 128, 32]} />
        </Side>
        <Side rotation={[0, Math.PI / 2, Math.PI / 2]} bg="lightgreen" index={2}>
          <boxGeometry args={[1.15, 1.15, 1.15]} />
        </Side>
        <Side rotation={[0, Math.PI / 2, -Math.PI / 2]} bg="aquamarine" index={3}>
          <octahedronGeometry />
        </Side>
        <Side rotation={[0, -Math.PI / 2, 0]} bg="indianred" index={4}>
          <icosahedronGeometry />
        </Side>
        <Side rotation={[0, Math.PI / 2, 0]} bg="hotpink" index={5}>
          <dodecahedronGeometry />
        </Side> */}
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


function Hello(props) {
    const cameraControlRef = useRef(null);

    // const [terrainProps, setTerrainProps] = React.useState({
    //   heightmap: [],
    //   // texture: 'https://example.com/terrain.jpg',
    //   material: new THREE.MeshStandardMaterial({
    //     color: 'white',
    //   }),
    // });
  
    // // Load the terrain heightmap
    // React.useEffect(() => {
    //   fetch('https://example.com/heightmap.png')
    //     .then(response => response.arrayBuffer())
    //     .then(arrayBuffer => {
    //       const heightmap = new Uint8Array(arrayBuffer);
    //       setTerrainProps({ ...terrainProps, heightmap });
    //     });
    // }, [])

    // Create a state variable to store the terrain heightmap
  const [heightmap, setHeightmap] = useState([]);


  // Load the terrain heightmap
  useEffect(() => {
    fetch('https://jurnsearch.files.wordpress.com/2020/12/hmap.jpg')
      .then(response => response.arrayBuffer())
      .then(arrayBuffer => {
        const heightmap = new Uint8Array(arrayBuffer);
        setHeightmap(heightmap);
      });
  }, []);
  

  // Generate the terrain mesh
  const mesh = () => {
    const geometry = new PlaneGeometry( 7500, 7500, heightmap.length - 1, heightmap[0].length - 1 );
    geometry.rotateX( - Math.PI / 2 );

    const vertices = geometry.attributes.position.array;

    for ( let i = 0, j = 0, l = vertices.length; i < l; i ++, j += 3 ) {

      vertices[ j + 1 ] = heightmap[i] * 10;

    }

    const material = new MeshBasicMaterial( { map: texture } );

    return (
      <Mesh geometry={geometry} material={material} />
    );
  };

     // Generate the terrain texture
  const texture = () => {

    useEffect(() => {
      const canvas = window.document.createElement('canvas');
      canvas.width =  1000;
      canvas.height = 1000;
  
      const context = canvas.getContext('2d');
      context.fillStyle = '#000';
      context.fillRect(0, 0, canvas.width, canvas.height);
  
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  
      for (let i = 0, j = 0, l = imageData.length; i < l; i += 4, j ++ ) {
  
        const shade = heightmap[j] / 255;
  
        imageData[i] = (96 + shade * 128) * (0.5 + heightmap[j] * 0.007);
        imageData[i + 1] = (32 + shade * 96) * (0.5 + heightmap[j] * 0.007);
        imageData[i + 2] = (shade * 96) * (0.5 + heightmap[j] * 0.007);
  
      }
  
      context.putImageData(imageData, 0, 0);
  
      return (
        <Canvas>
          {/* <TextureLoader texture={canvas} /> */}
        </Canvas>
      );
    }, [])

    return (
      <Canvas>
        <Sky />
      </Canvas>
    );
    
  };
    return (
        <div className={st.top}>
            <div className={st.bg}>
                <h1 onClick={() => alert('woo ha3 hoo')}> WebGl world playground</h1>
            </div>
            <div className={st.bottom} style={{ width: "100vw", height: "100vh" }}>
                {/* {App()}
                <Canvas>
                    <ambientLight />
                    <pointLight position={[100, 100, 100]} />
                    <Box position={[-1.2, 0, 0]} />
                    <Box position={[1.2, 0, 0]} />
                </Canvas> */}
                
                  <Canvas height={"100%"} camera={{ position: [0, 0, 500], fov: 75 }}
                // camera={{ position: [0, 0, 50] }}
                > 
                  <ambientLight intensity={0.5} />
                  <directionalLight position={[5, 5, 5]} />
                  {/* <Sky /> */}
                  <Sun />
                  <MySky />
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