import { Mesh, SphereGeometry, MeshBasicMaterial, PerspectiveCamera, AmbientLight } from '@react-three/drei';
import { Canvas, useFrame, useLoader  } from '@react-three/fiber';
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Sky } from '@react-three/drei';
// import { Sky } from 'three/addons/objects/Sky.js';
import { ImprovedNoise } from 'three/addons/math/ImprovedNoise.js';
// import 'regenerator-runtime';
import Noise from 'noisejs';


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
        <MeshBasicMaterial attach="material" color={0x8080FF} side={THREE.BackSide} />
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

  return <mesh ref={meshRef} geometry={geometry} material={material} />;
}

const GroundNoImpact = () => {
  const geometry = new THREE.PlaneGeometry(100, 100);
  const material = new THREE.MeshStandardMaterial({ color: "red" });
  // const mesh = new Mesh(geometry, material);

  return <mesh geometry={geometry} material={material} />;
};

const TerrainLocalImg = ({ imagePath, width, height, scale }) => {
  const [heightmap, setHeightmap] = useState(null);
  const geometryRef = useRef(null);

  useEffect(() => {
    const loadImage = async () => {
      try {
        const textureLoader = new TextureLoader();
        const loadedHeightmap = await textureLoader.load(imagePath);
        setHeightmap(loadedHeightmap);
      } catch (error) {
        console.error('Error loading image:', error);
      }
    };

    loadImage();
  }, [imagePath]);

  useEffect(() => {
    if (!heightmap) return;

    const createGeometry = () => {
      console.log(window, "windows")
      const canvas = window.document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = width;
      canvas.height = height;
      context.drawImage(heightmap.image, 0, 0, width, height);

      const imageData = context.getImageData(0, 0, width, height).data;

      const geometry = new THREE.PlaneGeometry(width, height, width - 1, height - 1);

      for (let i = 0; i < geometry.vertices.length; i++) {
        const x = i % width;
        const y = Math.floor(i / width);
        const heightValue = imageData[(y * width + x) * 4] / 255;

        geometry.vertices[i].z = heightValue * scale;
      }

      geometry.computeFaceNormals();
      geometry.computeVertexNormals();

      return geometry;
    };

    geometryRef.current = createGeometry();
  }, [heightmap, width, height, scale]);

  return (
    <mesh geometry={geometryRef.current}>
      <meshStandardMaterial color="green" />
    </mesh>
  );
};


const Terrain = ({ url, width, height, scale }) => {
  return null
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
      <Sky ref={sky} />
      {/* <Ground /> */}
      <PerspectiveCamera position={[0, 0, 100]} />
      <ambientLight color="#00000ff" intensity={0.5} />
      <pointLight position={[0, 1, 100]} intensity={10} distance={10} color={"red"}/>
      <light />
      {/* <PlaneMesh />  */}
      {/* <GroundNoImpact />*/}
      <Terrain url="http://localhost:3001/client/heightmap.png" width={11} height={11} scale={5} />
    </>

  );
};
