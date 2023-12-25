import { Canvas, render, useFrame, useLoader, useThree, startTransition } from '@react-three/fiber';
import * as THREE from 'three';
import React, { useState, useEffect, useRef } from 'react';
//Reference: https://codepen.io/BrendonC/pen/wEmWaP

const MyComponentNew = () => {
  const meshRef = React.useRef();
  const [texture, setTexture] = useState(null);
  const [mesh, setMesh] = useState(null);
  const [vertices, setVertices] = useState(null);

  // const heightMapImage = useLoader(THREE.TextureLoader, 'https://i.imgur.com/KcbQyP4.png');

  const loadTexture = () => {
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      // 'https://images.rawpixel.com/image_png_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIyLTA1L2pvYjgzNS0wNTIucG5n.png'
      'http://localhost:3001/client/rock-height-map.jpg'
      , (texture) => {
      // http://localhost:3001/dist/heightmap.png
      setTexture(texture);
    });
  };

  useEffect(() => {
    loadTexture();
  }, []);

  useEffect(() => {
    if (texture) {
      const mesh = setupNoiseTexture()
      setMesh(mesh)
    }

  }, [texture]);


  const setupNoiseTexture = () => {
    // Vertex shader
    const vertexShader = `
            varying vec2 vUv;
            uniform sampler2D displacementMap; // Displacement map texture
            uniform float displacementScale; // Scale factor for displacement
            void main() {
                vUv = uv;
                
                // Sample displacement map to get height
                float displacement = texture2D(displacementMap, vUv).r;

                // Update vertex position based on displacement
                vec4 modelViewPosition = modelViewMatrix * vec4(position + normal * displacement * displacementScale, 1.0);
                gl_Position = projectionMatrix * modelViewPosition;
            }
        `;

    // Fragment shader
    const fragmentShader = `
            varying vec2 vUv;
            uniform sampler2D displacementMap;
            uniform vec2 resolution;  // Add this line to declare resolution

            void main() {
              float heightThreshold = 10.5;
                // float blueChannel = sin(vUv.y); // Use a variable for the blue channel
                // float redChannel = 1.0 - sin(vUv.x); // Use a variable for the red channel

                // // Compute grayscale value
                // float grayscale = (redChannel + 0.30 + blueChannel) / 2.0;
                // gl_FragColor = vec4(grayscale, grayscale, grayscale, 1.0);
                // //gl_FragColor = vec4(redChannel, 0.30, blueChannel, 1.0);

                 // Calculate slope using central differences
              float dx = texture2D(displacementMap, vUv + vec2(1.0 / resolution.x, 0.0)).r - texture2D(displacementMap, vUv - vec2(1.0 / resolution.x, 0.0)).r;
              float dy = texture2D(displacementMap, vUv + vec2(0.0, 1.0 / resolution.y)).r - texture2D(displacementMap, vUv - vec2(0.0, 1.0 / resolution.y)).r;
              float slope = sqrt(dx * dx + dy * dy);

              // Sample the displacement map
              float displacement = texture2D(displacementMap, vUv).r;
              
              // Define color for slopes (adjust these values)
              vec3 slopeColor = vec3(.3,0.1,.1);

              // Define color for flat areas (adjust these values)
              vec3 flatColor = vec3(1.);

              // Interpolate between slope color and flat color based on slope
              vec3 finalColor = mix(flatColor, slopeColor, smoothstep(0.0, 0.1, slope));

              // Check if the displacement is above the height threshold
              if (displacement > heightThreshold) {
                  // Interpolate between slope color and flat color based on slope
                  vec3 finalColor = mix(flatColor, slopeColor, smoothstep(0.0, 0.1, slope));

                  gl_FragColor = vec4(finalColor, 1.0);
              } else {
                  // If below the height threshold, use the original color
                  gl_FragColor = vec4(texture2D(displacementMap, vUv).rgb, 1.0);
              }
            }
        `;

    // Create a Three.js scene
    const scene = new THREE.Scene();

    // Create a plane geometry
    const geometry = new THREE.PlaneGeometry(100, 100, 100, 100);

    // Load the displacement map texture
    // const displacementMapTexture = new THREE.TextureLoader().load('path/to/your/displacementmap.jpg');

    // Apply custom vertex and fragment shaders to a material
    const material = new THREE.ShaderMaterial({
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      uniforms: {
        displacementMap: { value: texture },
        displacementScale: { value: 10.5 },
      },
      // wireframe:true,
      side: THREE.DoubleSide
    });

    // Create a mesh with the geometry and shader material
    const mesh = new THREE.Mesh(geometry, material);

    // Rotate the mesh to better visualize the terrain
    mesh.rotation.x = -Math.PI / 2;

    // Add the mesh to the scene
    // scene.add(mesh);

    // Create a perspective camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // Create a WebGLRenderer and set its size
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Add the renderer canvas to the DOM
    document.body.appendChild(renderer.domElement);

    // Animation function
    const animate = function () {
      requestAnimationFrame(animate);

      // Rotate the mesh
      mesh.rotation.z += Math.PI / 2;

      // Render the scene
      renderer.render(scene, camera);
    };

    // Call the animate function
    // animate();
    
    return <mesh geometry={geometry} material={material} ref={meshRef} texture={texture} position={[0,-5,0] } />

  };

  useFrame((state, delta) => {
    if (texture && mesh) {
      // meshRef.current.rotation.y += 0.01;
      meshRef.current.rotation.x = -Math.PI * 0.5
    }


  });
  
  return mesh
};

export default MyComponentNew


// reference for  displacement basesd vertix update

//------------------------------
const vertexshader = `varying vec3 vNormal;
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
}`;

const fragmentShader = `varying vec3 vNormal;
  
uniform float time;
uniform vec2 resolution;
uniform vec3 light;

void main() {
  vec2 st = gl_FragCoord.xy / resolution.xy;
  vec3 color = vec3(1.0, 0.35, 0.0);
  vec3 newLight = normalize(light);
  float dotProduct = max(0.0, dot(vNormal, newLight));
  gl_FragColor = vec4(vec3(dotProduct) * color, 1.0);
}`;


const vanila = `let renderer, camera, scene, uniforms;

function setup(){
  THREE.ImageUtils.crossOrigin = '';//Allows us to load an external image
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 1);
  document.body.appendChild(renderer.domElement);
}

setup();

let fragShader = document.getElementById('fragment').textContent;
let vertShader = document.getElementById('vertex').textContent;

let noiseTexture = THREE.ImageUtils.loadTexture("http://i.imgur.com/KcbQyP4.png");
// https://i.pinimg.com/originals/1c/7a/d2/1c7ad2698f8970b104087c58e9289782.jpg
// http://2.bp.blogspot.com/-DuJPjHc67Uo/T5X0dLkmrQI/AAAAAAAADQw/ps2chw2AWbA/s1600/perlin_sum.jpg
// http://i.imgur.com/1wJ3lJw.png
// http://i.imgur.com/KcbQyP4.png
// https://wiki.jmonkeyengine.org/jme3/beginner/mountains512.png
// https://upload.wikimedia.org/wikipedia/commons/d/da/Perlin_noise.jpg
// https://upload.wikimedia.org/wikipedia/commons/0/00/Worley.jpg
// https://vvvv.org/contribution/tiled-perlin-noise-generator
// https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/CellularTexture.png/220px-CellularTexture.png
noiseTexture.wrapS = THREE.RepeatWrapping;
noiseTexture.wrapT = THREE.RepeatWrapping;
noiseTexture.repeat.set(10, 10);
noiseTexture.minFilter = THREE.NearestFilter;

uniforms = {
  time: {
    type: 'f',
    value: 0
  },
  resolution: {
    type: 'v2',
    value: new THREE.Vector2(
      window.innerWidth,
      window.innerHeight
    )
  },
  amplitude: {
    type: 'f',
    value: 0
  },
  light: {
    type: 'v3',
    value: new THREE.Vector3(
      100, 150, 100
    )
  },
  heightMap: {
    type: "t",
    value: noiseTexture
  }
};

let attributes = {
  displacement: {
    type: 'f',
    value: []
  }
};

let material = new THREE.ShaderMaterial({ 
  fragmentShader: fragShader, 
  vertexShader: vertShader,
  uniforms: uniforms,
  attributes: attributes,
  wireframe: true,
  flatShading: false
});

// let geometry = new THREE.SphereGeometry(50, 32, 32);
let geometry = new THREE.PlaneGeometry(400, 300, 600, 600);

let sphere = new THREE.Mesh(geometry, material);
sphere.position.z = -100;
sphere.geometry.verticesNeedUpdate = true; // Allows Changes to the vertices
sphere.geometry.normalsNeedUpdate = true; // Allows Changes to the normals
sphere.rotation.x = -Math.PI / 3;
scene.add(sphere);

let verts = sphere.geometry.vertices;
let values = attributes.displacement.value;

for (let i = 0; i < verts.length; i++) {
  attributes.displacement.value.push((Math.random() - 0.5) * 25);
}

let pointLight = new THREE.PointLight(0xffffff);
pointLight.position.x = -20;
pointLight.position.y = 100;
pointLight.position.z = -100;
scene.add(pointLight);

let time = 0;
let mouseX = 0;
let mouseY = 0;

window.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function render(delta) {
  uniforms.time.value = time;
  time += 0.025;
  // sphere.rotation.z += 0.001;
  uniforms.resolution.value.x = window.innerWidth;
  uniforms.resolution.value.y = window.innerHeight;
  requestAnimationFrame(render);
  renderer.render(scene, camera);
}

render();`