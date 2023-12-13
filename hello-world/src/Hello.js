import React, { useEffect, useRef, useState,  Suspense } from 'react';
import st from './cards.scss';
import locationIcon from '../../assets/svg/location-dot-solid.svg'
import { Box } from "./TheeDemo"
import { Canvas, useFrame, Camera, extend,  useThree  } from '@react-three/fiber'
import { useGLTF, Edges, MeshPortalMaterial, CameraControls, Environment, PivotControls, OrbitControls,
   Sky as Skypremitive, Terrain, Ground, PerspectiveCamera
} from '@react-three/drei'
import { useControls } from 'leva'
import * as THREE from 'three';
import Noise from 'noisejs';
import {MySky, Sun, SkyWithShaders, FogEffect} from "./SkyGround";
import { House, Model, LoadingFallback } from "./house"
import { useSelector } from 'react-redux';
// import { selectCount } from "./features/keyController/keyControllerSlice"

// Extend the THREE namespace with OrbitControls
extend({ OrbitControls });

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

const MyCameraControls = ({ target, offset }) => {
  const { camera } = useThree();
  const controlsRef = useRef();

  const prevTargetProps = usePrevious(useSelector(state => state.counter)) || {x:0,y:0,z:0}
  const prevTarget = new THREE.Vector3(prevTargetProps.x, prevTargetProps.y, prevTargetProps.z) 

  const clock = new THREE.Clock();
  
  useFrame(() => {
    // Update the camera position based on the target and offset
    const targetPosition = target.clone().add(offset);

    const elapsedSeconds =clock.getDelta();
    const animationDuration = 1;
    const progress  = Math.min(1, elapsedSeconds / animationDuration)
    camera.position.lerp(targetPosition, progress);

    // Look at the target
    //  previous  position 
    camera.lookAt(prevTarget);
    const q1 = new THREE.Quaternion().copy( camera.quaternion );
    
    camera.lookAt( target );
    const q2 = new THREE.Quaternion().copy( camera.quaternion );
    camera.quaternion.slerpQuaternions( q1, q2, 1 ); // 0 < time < 1

    
    
    
    // Update OrbitControls
    // controlsRef.current.update();
  });

  return null
  // return <orbitControls ref={controlsRef} args={[camera]} />;
};


const DEG45 = Math.PI / 4;


const CameraHelper = () => {
  const camera = new THREE.PerspectiveCamera(60, 1, 1, 2000);
  return <group position={[0, 100, 500]}>
    <cameraHelper args={[camera]} />
  </group>
}


// custom hook for getting previous value
const usePrevious = (value) => {
  const ref = useRef();

  useEffect(() => {
    ref.current = value
  }, [value]);

  return ref.current;
}

function Hello(props) {
    const cameraControlRef = useRef(null);
    let position = {x:0,y:0,z:0};
    if (props.store) {
      position = useSelector(state => state.counter);
    }

    // console.log('select count',selectCount(props.store))
    // Create a state variable to store the terrain heightmap
  const [heightmap, setHeightmap] = useState([]);

  const characterRef = useRef();

  // Set up a Vector3 to define the offset from the character
  const cameraOffset = new THREE.Vector3(0, 3, -5);

  return (
    <div className={st.top}>
      <div className={st.bg}>
        <h1 onClick={() => alert('woo ha3 hoo')}> PixelCraft </h1>
      </div>
      <div className={st.bottom} style={{ width: "100vw", height: "100vh" }}>
        <Canvas height={"100%"}  style={{ width: '100%', height: '100%' }}
        camera={{ position: [0, 20, -20], fov: 60, rotateY : Math.PI * 0.5,  far:2000, rotation:new THREE.Euler(Math.PI * 0.25, 0,0,'XYZ' )}}
        >
          <MyCameraControls target={characterRef.current ? characterRef.current.position : new THREE.Vector3(0, position.y, 0)} offset={new THREE.Vector3(3, 15, -5)} />
          <ambientLight intensity={0.1}  color={"white"}/>
          <directionalLight position={[0, 0, 100]} />
          <directionalLight position={[-20, 100, -100]}  color={'gary'}/>
          <Sun />
          <SkyWithShaders/>
          <MySky />
          {/* <PerspectiveCamera position={[0, 0, 0]} fov={75}/> */}
          <FogEffect />
          <CameraHelper />
          <OrbitControls />
          <Suspense fallback={<LoadingFallback />}>
            {/* <House 
              url='https://webgl-content.s3.ap-south-1.amazonaws.com/dady_papa_smurf___rigged_blender.glb'
              position={[0, position.y, 0]} scale={[1.0, 1.1, 1.1]}
              animationName="Action.001"
            /> */}
            <House
              ref={characterRef}
              url='https://webgl-content.s3.ap-south-1.amazonaws.com/dragon_fly.glb' 
              position={[0, position.y, 0]} scale={[0.01, 0.01, 0.01]} animationName='GltfAnimation 0' 
            />
            {/* <Model url='https://webgl-content.s3.ap-south-1.amazonaws.com/Soldier.glb' /> */}
          </Suspense>
        </Canvas>
      </div>
      
    </div>
  )
}

export default Hello;
// https://codesandbox.io/s/cameracontrols-basic-forked-22hfx3?file=/src/App.js:4330-4351