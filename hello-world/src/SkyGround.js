import { Mesh, SphereGeometry, MeshBasicMaterial, PerspectiveCamera, AmbientLight  } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Sky } from '@react-three/drei';
// import { Sky } from 'three/addons/objects/Sky.js';

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
    const geometry = new THREE.SphereGeometry(100, 32, 32);
    const material = new  THREE.MeshStandardMaterial({ color: 0xffff00 });
  
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

export const MySky = () => {
    const sky = useRef();
    const [canvasHeight, setCanvasHeight] = useState(500);

    useEffect(() => {
        sky.current.scale.setScalar(450000);
        const updateCanvasHeight = () => {
            setCanvasHeight(window.innerHeight);
        };

        window.addEventListener('resize', updateCanvasHeight);

        return () => {
            window.removeEventListener('resize', updateCanvasHeight);
        };
    }, []);

    
    return (
        <>
            <Sky ref={sky} />
            <PerspectiveCamera position={[0, 0, 100]} />
            <ambientLight color="#487a48" intensity={0.5} />
        </>

    );
};
const Ground = () => {
    //   return (
    //     <Mesh>
    //       <PlaneGeometry args={[20000, 20000, 300, 300]} />
    //       {/* <MeshStandardMaterial attach="material" color={0x808080} /> */}
    //     </Mesh>
    //   );
    return null
};