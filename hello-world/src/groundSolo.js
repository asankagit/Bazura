import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import React, { useState, useEffect } from 'react';

const MyComponent = () => {
  const meshRef = React.useRef();
  const [uniforms, setUniforms] = useState({
    time: 0,
    resolution: new THREE.Vector2(window.innerWidth, window.innerHeight),
    amplitude: 0,
    light: new THREE.Vector3(100, 150, 100),
    heightMap: new THREE.TextureLoader().load('http://localhost:3001/dist/heightmap.png'),
  });

  useEffect(() => {
    // Update the uniforms each frame.
    const frameUpdate = () => {
      setUniforms({
        time: uniforms.time + 0.025,
        resolution: new THREE.Vector2(window.innerWidth, window.innerHeight),
      });
    };

    const frameId = requestAnimationFrame(frameUpdate);

    return () => cancelAnimationFrame(frameId);
  }, [uniforms]);

  // const vertexShader = document                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                mentById('fragment').textContent;

  const material = new THREE.ShaderMaterial({
    vertexShader: `varying vec3 vNormal;
  varying vec3 light;
  
  uniform vec2 resolution;
  uniform float time;
  uniform float amplitude;
  uniform sampler2D heightMap;
  
  attribute float displacement;
  
  void main() {
    vec3 newPosition = position;
    float timeStep = time * 0.025;
    
    vec2 coords = vec2(uv);
    coords.y += timeStep;
    
float uvScale = sin(timeStep) * 0.75;
    
    float redChannel = texture2D(heightMap, coords + uvScale + sin(time * 0.01)).r;
    newPosition.z = redChannel * displacement;
    vNormal = normal * newPosition;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  }`,
    fragmentShader: `varying vec3 vNormal;
  
  uniform float time;
  uniform vec2 resolution;
  uniform vec3 light;
  
  void main() {
    vec2 st = gl_FragCoord.xy / resolution.xy;
    vec3 color = vec3(1.0, 0.35, 0.0);
    vec3 newLight = normalize(light);
    float dotProduct = max(0.0, dot(vNormal, newLight)); 
    gl_FragColor = vec4(vec3(dotProduct) * color, 1.0);}`,
    uniforms,
  });

  const geometry = new THREE.PlaneGeometry(400, 300, 600, 600);
  //   const mesh = new THREE.Mesh(geometry, material);

  return <mesh geometry={geometry} material={material} ref={meshRef} />;
  return (
    <Canvas>
      <primitive object={mesh} />
    </Canvas>
  );
};

export default MyComponent;
