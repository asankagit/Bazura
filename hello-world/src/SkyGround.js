import { Mesh, SphereGeometry, MeshBasicMaterial } from '@react-three/drei';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Sky } from '@react-three/drei';
// import { Sky } from 'three/addons/objects/Sky.js';
import { ImprovedNoise } from 'three/addons/math/ImprovedNoise.js';
import GroundSolo from "./groundSolo";
import Noise from 'noisejs';
import {Reflector, useReflector,Water } from 'three-stdlib';

const CustomSky = () => {
  const skyMaterial = useRef();

  useEffect(() => {
    const canvas = window.document.createElement('canvas');
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
      <Mesh ref={skyMaterial} geometry={geometry} material={material}>
        <SphereGeometry args={[10000, 32, 32]} />
        <  MeshBasicMaterial attach="material" color={0x8080FF} side={THREE.BackSide} />
      </Mesh>
    );
  }, []);


};

export const Sun = () => {
  const geometry = new THREE.SphereGeometry(10, 32, 32);
  const material = new THREE.MeshStandardMaterial({ color: 0xfff00f });

  // Create a reference to the mesh
  const meshRef = React.useRef();

  // Use the useFrame hook to rotate the sun
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.01;
    }
  });

  return <mesh ref={meshRef} geometry={geometry} material={material} position={[0, 300, 0]}/>;
}

const GroundNoImpact = () => {
  const geometry = new THREE.PlaneGeometry(100, 100);
  const material = new THREE.MeshStandardMaterial({ color: "red" });
  // const mesh = new Mesh(geometry, material);

  return <mesh geometry={geometry} material={material} />;
};

export const WaterComponent = () => {
  const parameters = {
    elevation: 2,
    azimuth: 180
  };
  
  const sun = new THREE.Vector3();

  const phi = THREE.MathUtils.degToRad( 90 - parameters.elevation );
	const theta = THREE.MathUtils.degToRad( parameters.azimuth );
  sun.setFromSphericalCoords( 1, phi, theta );

  const waterNormalsTexture = useLoader(THREE.TextureLoader, 'https://threejs.org/examples/textures/waternormals.jpg');
  waterNormalsTexture.wrapS = waterNormalsTexture.wrapT = THREE.RepeatWrapping;

  // const { reflector, material, resolution } = useReflector();
  const waterGeometry = new THREE.PlaneGeometry( 10000, 10000 );
  const water = new Water(
    waterGeometry,
					{
						textureWidth: 512,
						textureHeight: 512,
						waterNormals: waterNormalsTexture,
						sunDirection: new THREE.Vector3(),
						sunColor: 0xffffff,
						waterColor:  0x80f0ff,
						distortionScale: 3.7,
            side: THREE.DoubleSide,
						// fog: scene.fog !== undefined
					}
  );
  water.geometry.rotateX(-Math.PI * 0.5);

  useFrame(() => {
    water.material.uniforms[ 'sunDirection' ].value.copy( sun ).normalize();
    water.material.uniforms[ 'time' ].value += 1.0 / 60.0;
  })
  return <mesh geometry={water.geometry} material={water.material} position={[0, 0, 0]}/>
};


const Terrain = ({ url, width, height, scale }) => {
  const groundGeo = new THREE.PlaneGeometry(10000, 10000);
  const groundMat = new THREE.MeshLambertMaterial({ color: 0x8c9091});
  groundMat.color.setHSL(0.295, 11, 0.75);

  groundGeo.rotateX(-Math.PI * 0.5);

  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.position.y = 10;
  ground.position.z =  0;
  ground.rotation.x = - Math.PI / 2;
  ground.receiveShadow = true;
  

  return <mesh geometry={groundGeo} material={groundMat} />;
}

//   const heightmap = generateHeight(256, 256);
//   const texture = generateTexture(heightmap, 256, 256);

const Ground = () => {
  const perlin = new ImprovedNoise();

  const data = new Uint8Array(256 * 256);

  for (let i = 0; i < data.length; i++) {
    const x = i % 256;
    const y = ~~(i / 256); // Fix bitwise operation

    // Generate a Perlin noise value for the current vertex.
    const noise = perlin.noise(x, y);

    // Scale the Perlin noise value to the range [0, 255].
    data[i] = noise * 255;
  }

  const geometry = new THREE.PlaneGeometry(256, 256);
  const vertices = geometry.attributes.position.array;

  for (let i = 0; i < vertices.length; i += 3) {
    // Set the vertex position to the heightmap value.
    vertices[i + 1] = data[i];
  }

  const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });

  return (
    <plane geometry={geometry} material={material}>
      <meshBasicMaterial />
    </plane>
  );
};

const PlaneMesh = () => {
  // Create a new TerrainGeometry object.
  const terrainGeometry = new THREE.TerrainGeometry(100, 100);// not exist in three js standard lib

  // Set the heightmap of the terrain.
  terrainGeometry.heightmap = [
    [0, 0, 0, 0, 0],
    [0, 10, 0, 0, 0],
    [0, 0, 20, 0, 0],
    [0, 0, 0, 30, 0],
    [0, 0, 0, 0, 40],
  ];

  // Create a new Material object.
  const material = new THREE.MeshPhongMaterial({
    color: 0xffffff,
  });

  // Create a new Mesh object.
  return  new THREE.Mesh(terrainGeometry, material);

  return (
    <mesh rotation-x={-Math.PI / 2} receiveShadow position={[0, 0, 10]}>
      <planeGeometry args={[600, 600]} />
      <meshStandardMaterial color={0x00ff00} />
    </mesh>
  );
};

export const FogEffect = () => {
  return <fog attach="fog" color="0x8c8fff" near={10} far={500} />
}

export const SkyWithShaders = () => {
  const hemiLight = new THREE.HemisphereLight( 0x79bbff, 0x8bbbff,2 );
	hemiLight.color.setHSL( 0.6, 1, 0.6 );

  const vertexShader = `varying vec3 vWorldPosition;

  void main() {

    vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
    vWorldPosition = worldPosition.xyz;

    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

  }`;

  const fragmentShader = `			uniform vec3 topColor;
  uniform vec3 bottomColor;
  uniform float offset;
  uniform float exponent;

  varying vec3 vWorldPosition;

  void main() {

    float h = normalize( vWorldPosition + offset ).y;
    gl_FragColor = vec4( mix( bottomColor, topColor, max( pow( max( h , 0.0), exponent ), 0.0 ) ), 1.0 );

  }`;
  const uniforms = {
    'topColor': { value: new THREE.Color(0x03befc) },
    'bottomColor': { value: new THREE.Color(0x8c9091) },
    'offset': { value: 33 },
    'exponent': { value: 0.6 }
  };
  uniforms['topColor'].value.copy(hemiLight.color);

  // fog.color.copy(uniforms['bottomColor'].value);

  const skyGeo = new THREE.SphereGeometry(500, 32, 15);
  skyGeo.rotateX(- Math.PI * 0.5);

  const skyMat = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    side: THREE.BackSide
  });

  //const sky = new THREE.Mesh(skyGeo, skyMat);
  return <mesh geometry={skyGeo} material={skyMat} position={[0,0,0]}/>
}

export const MySky = () => {
  const sky = useRef();
  const [canvasHeight, setCanvasHeight] = useState(500);

  useEffect(() => {
    // sky.current.scale.setScalar(450000);
    const updateCanvasHeight = () => {
      setCanvasHeight(window.innerHeight);
    };

    window.addEventListener('resize', updateCanvasHeight);

    return () => {
      window.removeEventListener('resize', updateCanvasHeight);
    };
  }, []);

  const light = new THREE.PointLight(0xff0000, 1, 100);
  light.position.set(0, 0, 0);

  return (
    <>
      {/*  default sky box */}
      {/* <Sky ref={sky} />  */}
      
      {/* <Ground /> */}
      {/* <PerspectiveCamera position={[0, 0, 100]} /> */}
      {/* <ambientLight color="#00000ff" intensity={0.5} /> */}
      <pointLight position={[0, 0, 0]} intensity={10} distance={10} color={"red"}/>
      <light />
      {/* <PlaneMesh />  */}
      {/* <GroundNoImpact />*/}
      <GroundSolo />
      {/* <FogEffect /> */}
      {/* <Terrain url="http://localhost:3001/client/heightmap.png" width={11} height={11} scale={5} position={[100, 100, 100 ]} /> */}
    </>

  );
};
