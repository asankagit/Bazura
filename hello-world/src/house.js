import { Canvas, render, useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import React, { useState, useEffect, useRef } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';


// import vm from '@asanka-npm/jsc-vm'

// console.log('vm',vm.default({
//     params: { code: `251;`},
//     callback: (x) => {console.log(x)}
// }))

// three/examples/jsm/loaders/GLTFLoader.js
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader';
// import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
// import { GLBLLoader } from 'three/examples/jsm/loaders/'

export const House = ({ url, position, scale, animationName }) => {
    const [houseObj, setHouseObj] = useState(null);
    const [animationMixer, setAnimationMixer] = useState(null);
    const gltfRef = useRef();
    const group = useRef();
    const clock = new THREE.Clock();

    const loadInit = () => {
        const loader = new GLTFLoader();

        loader.load(url,
            async function (glb) {
                // gltfRef.current.object = glb.scene;
                // gltfRef.current.animations = glb.animations;
                // console.log(glb.animations)
                setHouseObj(glb)
                
            }, (xhr) => {
                if (xhr.lengthComputable) {
                    const percentComplete = xhr.loaded / xhr.total * 100;
                    console.log('model ' + percentComplete.toFixed(2) + '% downloaded');
                }

            }, function (error) {
                console.log('>>>', error);
            });
    }



    useEffect(() => {
        loadInit();
    }, [])

    useEffect((x) => {
        if(houseObj) {
            
            const mesh = houseObj;
            const mixer = new THREE.AnimationMixer(houseObj.scene);
            const clips = mesh.animations;
            setAnimationMixer(mixer);
            const clip = THREE.AnimationClip.findByName( clips, animationName || 'Walk' );
            const action = mixer.clipAction( clip );

            console.log({ action}, { clips })
            action.play();
            mixer.update(clock.getDelta())
        }
    }, [houseObj]);

    const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
    const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

    useFrame((state, delta) => {
        if(animationMixer) {
            animationMixer.update(clock.getDelta())
        }

    })
    
    return houseObj ? <primitive object={houseObj.scene} scale={scale}  position={position} ref={gltfRef} /> : <primitive object={sphere} scale={[0.1, 0.1, 0.1]} ref={gltfRef} />;

}

export const Model = ({ url }) => {
    try {
        const { nodes, animations, scene } = useLoader(GLTFLoader, url);
        const group = useRef();
    
        const [currentAnimation, setCurrentAnimation] = useState(0);
    
        const { actions, mixerRef } = useAnimations(animations, group);
    
        const switchAnimation = (index) => {
            // setCurrentAnimation(index);
            console.log({actions }, actions["Walk"], mixerRef)
            // actions[index].reset().play();
        };
        switchAnimation(1)
        console.log({ animations })
        return <primitive object={scene} scale={[10, 10, 10]} position={[0, 0, -100]} />;
    } catch(e) {
        console.log(e)
        return null
    }
    
};

export const LoadingFallback = () => null