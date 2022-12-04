import React, { Component } from 'react';
import st from './cards.scss';
import locationIcon from '../../assets/svg/location-dot-solid.svg'
import { Box } from "./TheeDemo"
import { Canvas, useFrame } from '@react-three/fiber'
import ThreeMap from "./threejsMap"

// class Hello extends Component {
//     constructor(props) {
//         super(props)
//         this.intiveTo = props.to
//     }

//     render() {
//         return (
//             <div className={st.top}>
//                 <div className={st.bg}>
//                     <h1 onClick={() => alert('click handler')}>We invite you to be with us <br />as we begin our new life together</h1>
//                 </div>
//                 <div className={st.bottom}>
//                     <p>RSVP Regrets only</p>

//                 </div>
//             </div>
//         )
//     }

// }


function Hello(props) {
    return (
        <div className={st.top}>
            <div className={st.bg}>
                <h1 onClick={() => alert('woo hoo')}>React SSR boilerplate application</h1>
            </div>
            <div className={st.bottom}>
                <Canvas>
                    <ambientLight />
                    <pointLight position={[10, 10, 10]} />
                    <Box position={[-1.2, 0, 0]} />
                    <Box position={[1.2, 0, 0]} />
                </Canvas>
            </div>
            <div>{ThreeMap()}</div>
        </div>
    )
}

export default Hello;