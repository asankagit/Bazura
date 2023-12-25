"use strict";
/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "HelloWorldFunction";
exports.ids = null;
exports.modules = {

/***/ "./hello-world/src/groundSolo.js":
/*!***************************************!*\
  !*** ./hello-world/src/groundSolo.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _babel_runtime_corejs3_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime-corejs3/helpers/slicedToArray */ \"./node_modules/@babel/runtime-corejs3/helpers/slicedToArray.js\");\n/* harmony import */ var _babel_runtime_corejs3_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _react_three_fiber__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @react-three/fiber */ \"./node_modules/@react-three/fiber/dist/index-6f0019d1.esm.js\");\n/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! three */ \"./node_modules/three/build/three.module.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"./node_modules/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n\n\n\n\n//Reference: https://codepen.io/BrendonC/pen/wEmWaP\n\nvar MyComponentNew = function MyComponentNew() {\n  var meshRef = react__WEBPACK_IMPORTED_MODULE_1___default().useRef();\n  var _useState = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null),\n    _useState2 = _babel_runtime_corejs3_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0___default()(_useState, 2),\n    texture = _useState2[0],\n    setTexture = _useState2[1];\n  var _useState3 = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null),\n    _useState4 = _babel_runtime_corejs3_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0___default()(_useState3, 2),\n    mesh = _useState4[0],\n    setMesh = _useState4[1];\n  var _useState5 = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null),\n    _useState6 = _babel_runtime_corejs3_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0___default()(_useState5, 2),\n    vertices = _useState6[0],\n    setVertices = _useState6[1]; // const heightMapImage = useLoader(THREE.TextureLoader, 'https://i.imgur.com/KcbQyP4.png');\n  var loadTexture = function loadTexture() {\n    var textureLoader = new three__WEBPACK_IMPORTED_MODULE_2__.TextureLoader();\n    textureLoader.load(\n    // 'https://images.rawpixel.com/image_png_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIyLTA1L2pvYjgzNS0wNTIucG5n.png'\n    'http://localhost:3001/client/rock-height-map.jpg', function (texture) {\n      // http://localhost:3001/dist/heightmap.png\n      setTexture(texture);\n    });\n  };\n  (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(function () {\n    loadTexture();\n  }, []);\n  (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(function () {\n    if (texture) {\n      var _mesh = setupNoiseTexture();\n      setMesh(_mesh);\n    }\n  }, [texture]);\n  var setupNoiseTexture = function setupNoiseTexture() {\n    // Vertex shader\n    var vertexShader = \"\\n            varying vec2 vUv;\\n            uniform sampler2D displacementMap; // Displacement map texture\\n            uniform float displacementScale; // Scale factor for displacement\\n            void main() {\\n                vUv = uv;\\n                \\n                // Sample displacement map to get height\\n                float displacement = texture2D(displacementMap, vUv).r;\\n\\n                // Update vertex position based on displacement\\n                vec4 modelViewPosition = modelViewMatrix * vec4(position + normal * displacement * displacementScale, 1.0);\\n                gl_Position = projectionMatrix * modelViewPosition;\\n            }\\n        \";\n\n    // Fragment shader\n    var fragmentShader = \"\\n            varying vec2 vUv;\\n            uniform sampler2D displacementMap;\\n            uniform vec2 resolution;  // Add this line to declare resolution\\n\\n            void main() {\\n              float heightThreshold = 10.5;\\n                // float blueChannel = sin(vUv.y); // Use a variable for the blue channel\\n                // float redChannel = 1.0 - sin(vUv.x); // Use a variable for the red channel\\n\\n                // // Compute grayscale value\\n                // float grayscale = (redChannel + 0.30 + blueChannel) / 2.0;\\n                // gl_FragColor = vec4(grayscale, grayscale, grayscale, 1.0);\\n                // //gl_FragColor = vec4(redChannel, 0.30, blueChannel, 1.0);\\n\\n                 // Calculate slope using central differences\\n              float dx = texture2D(displacementMap, vUv + vec2(1.0 / resolution.x, 0.0)).r - texture2D(displacementMap, vUv - vec2(1.0 / resolution.x, 0.0)).r;\\n              float dy = texture2D(displacementMap, vUv + vec2(0.0, 1.0 / resolution.y)).r - texture2D(displacementMap, vUv - vec2(0.0, 1.0 / resolution.y)).r;\\n              float slope = sqrt(dx * dx + dy * dy);\\n\\n              // Sample the displacement map\\n              float displacement = texture2D(displacementMap, vUv).r;\\n              \\n              // Define color for slopes (adjust these values)\\n              vec3 slopeColor = vec3(.3,0.1,.1);\\n\\n              // Define color for flat areas (adjust these values)\\n              vec3 flatColor = vec3(1.);\\n\\n              // Interpolate between slope color and flat color based on slope\\n              vec3 finalColor = mix(flatColor, slopeColor, smoothstep(0.0, 0.1, slope));\\n\\n              // Check if the displacement is above the height threshold\\n              if (displacement > heightThreshold) {\\n                  // Interpolate between slope color and flat color based on slope\\n                  vec3 finalColor = mix(flatColor, slopeColor, smoothstep(0.0, 0.1, slope));\\n\\n                  gl_FragColor = vec4(finalColor, 1.0);\\n              } else {\\n                  // If below the height threshold, use the original color\\n                  gl_FragColor = vec4(texture2D(displacementMap, vUv).rgb, 1.0);\\n              }\\n            }\\n        \";\n\n    // Create a Three.js scene\n    var scene = new three__WEBPACK_IMPORTED_MODULE_2__.Scene();\n\n    // Create a plane geometry\n    var geometry = new three__WEBPACK_IMPORTED_MODULE_2__.PlaneGeometry(100, 100, 100, 100);\n\n    // Load the displacement map texture\n    // const displacementMapTexture = new THREE.TextureLoader().load('path/to/your/displacementmap.jpg');\n\n    // Apply custom vertex and fragment shaders to a material\n    var material = new three__WEBPACK_IMPORTED_MODULE_2__.ShaderMaterial({\n      vertexShader: vertexShader,\n      fragmentShader: fragmentShader,\n      uniforms: {\n        displacementMap: {\n          value: texture\n        },\n        displacementScale: {\n          value: 10.5\n        }\n      },\n      // wireframe:true,\n      side: three__WEBPACK_IMPORTED_MODULE_2__.DoubleSide\n    });\n\n    // Create a mesh with the geometry and shader material\n    var mesh = new three__WEBPACK_IMPORTED_MODULE_2__.Mesh(geometry, material);\n\n    // Rotate the mesh to better visualize the terrain\n    mesh.rotation.x = -Math.PI / 2;\n\n    // Add the mesh to the scene\n    // scene.add(mesh);\n\n    // Create a perspective camera\n    var camera = new three__WEBPACK_IMPORTED_MODULE_2__.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);\n    camera.position.z = 5;\n\n    // Create a WebGLRenderer and set its size\n    var renderer = new three__WEBPACK_IMPORTED_MODULE_2__.WebGLRenderer();\n    renderer.setSize(window.innerWidth, window.innerHeight);\n\n    // Add the renderer canvas to the DOM\n    document.body.appendChild(renderer.domElement);\n\n    // Animation function\n    var animate = function animate() {\n      requestAnimationFrame(animate);\n\n      // Rotate the mesh\n      mesh.rotation.z += Math.PI / 2;\n\n      // Render the scene\n      renderer.render(scene, camera);\n    };\n\n    // Call the animate function\n    // animate();\n\n    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement(\"mesh\", {\n      geometry: geometry,\n      material: material,\n      ref: meshRef,\n      texture: texture,\n      position: [0, -5, 0]\n    });\n  };\n  (0,_react_three_fiber__WEBPACK_IMPORTED_MODULE_3__.A)(function (state, delta) {\n    if (texture && mesh) {\n      // meshRef.current.rotation.y += 0.01;\n      meshRef.current.rotation.x = -Math.PI * 0.5;\n    }\n  });\n  return mesh;\n};\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (MyComponentNew);\n\n// reference for  displacement basesd vertix update\n\n//------------------------------\nvar vertexshader = \"varying vec3 vNormal;\\nvarying vec3 light;\\n\\nuniform vec2 resolution;\\nuniform float time;\\nuniform float amplitude;\\nuniform sampler2D heightMap;\\n\\nattribute float displacement;\\n\\nvoid main() {\\n  vec3 newPosition = position;\\n  float timeStep = time * 0.025;\\n  \\n  vec2 coords = vec2(uv);\\n  coords.y += timeStep;\\n  \\n  float uvScale = sin(timeStep) * 0.75;\\n  \\n  float redChannel = texture2D(heightMap, coords + uvScale + sin(time * 0.01)).r;\\n  newPosition.z = redChannel * displacement;\\n  vNormal = normal * newPosition;\\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);\\n}\";\nvar fragmentShader = \"varying vec3 vNormal;\\n  \\nuniform float time;\\nuniform vec2 resolution;\\nuniform vec3 light;\\n\\nvoid main() {\\n  vec2 st = gl_FragCoord.xy / resolution.xy;\\n  vec3 color = vec3(1.0, 0.35, 0.0);\\n  vec3 newLight = normalize(light);\\n  float dotProduct = max(0.0, dot(vNormal, newLight));\\n  gl_FragColor = vec4(vec3(dotProduct) * color, 1.0);\\n}\";\nvar vanila = \"let renderer, camera, scene, uniforms;\\n\\nfunction setup(){\\n  THREE.ImageUtils.crossOrigin = '';//Allows us to load an external image\\n  scene = new THREE.Scene();\\n  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);\\n  renderer = new THREE.WebGLRenderer();\\n  renderer.setSize(window.innerWidth, window.innerHeight);\\n  renderer.setClearColor(0x000000, 1);\\n  document.body.appendChild(renderer.domElement);\\n}\\n\\nsetup();\\n\\nlet fragShader = document.getElementById('fragment').textContent;\\nlet vertShader = document.getElementById('vertex').textContent;\\n\\nlet noiseTexture = THREE.ImageUtils.loadTexture(\\\"http://i.imgur.com/KcbQyP4.png\\\");\\n// https://i.pinimg.com/originals/1c/7a/d2/1c7ad2698f8970b104087c58e9289782.jpg\\n// http://2.bp.blogspot.com/-DuJPjHc67Uo/T5X0dLkmrQI/AAAAAAAADQw/ps2chw2AWbA/s1600/perlin_sum.jpg\\n// http://i.imgur.com/1wJ3lJw.png\\n// http://i.imgur.com/KcbQyP4.png\\n// https://wiki.jmonkeyengine.org/jme3/beginner/mountains512.png\\n// https://upload.wikimedia.org/wikipedia/commons/d/da/Perlin_noise.jpg\\n// https://upload.wikimedia.org/wikipedia/commons/0/00/Worley.jpg\\n// https://vvvv.org/contribution/tiled-perlin-noise-generator\\n// https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/CellularTexture.png/220px-CellularTexture.png\\nnoiseTexture.wrapS = THREE.RepeatWrapping;\\nnoiseTexture.wrapT = THREE.RepeatWrapping;\\nnoiseTexture.repeat.set(10, 10);\\nnoiseTexture.minFilter = THREE.NearestFilter;\\n\\nuniforms = {\\n  time: {\\n    type: 'f',\\n    value: 0\\n  },\\n  resolution: {\\n    type: 'v2',\\n    value: new THREE.Vector2(\\n      window.innerWidth,\\n      window.innerHeight\\n    )\\n  },\\n  amplitude: {\\n    type: 'f',\\n    value: 0\\n  },\\n  light: {\\n    type: 'v3',\\n    value: new THREE.Vector3(\\n      100, 150, 100\\n    )\\n  },\\n  heightMap: {\\n    type: \\\"t\\\",\\n    value: noiseTexture\\n  }\\n};\\n\\nlet attributes = {\\n  displacement: {\\n    type: 'f',\\n    value: []\\n  }\\n};\\n\\nlet material = new THREE.ShaderMaterial({ \\n  fragmentShader: fragShader, \\n  vertexShader: vertShader,\\n  uniforms: uniforms,\\n  attributes: attributes,\\n  wireframe: true,\\n  flatShading: false\\n});\\n\\n// let geometry = new THREE.SphereGeometry(50, 32, 32);\\nlet geometry = new THREE.PlaneGeometry(400, 300, 600, 600);\\n\\nlet sphere = new THREE.Mesh(geometry, material);\\nsphere.position.z = -100;\\nsphere.geometry.verticesNeedUpdate = true; // Allows Changes to the vertices\\nsphere.geometry.normalsNeedUpdate = true; // Allows Changes to the normals\\nsphere.rotation.x = -Math.PI / 3;\\nscene.add(sphere);\\n\\nlet verts = sphere.geometry.vertices;\\nlet values = attributes.displacement.value;\\n\\nfor (let i = 0; i < verts.length; i++) {\\n  attributes.displacement.value.push((Math.random() - 0.5) * 25);\\n}\\n\\nlet pointLight = new THREE.PointLight(0xffffff);\\npointLight.position.x = -20;\\npointLight.position.y = 100;\\npointLight.position.z = -100;\\nscene.add(pointLight);\\n\\nlet time = 0;\\nlet mouseX = 0;\\nlet mouseY = 0;\\n\\nwindow.addEventListener('mousemove', (e) => {\\n  mouseX = e.clientX;\\n  mouseY = e.clientY;\\n});\\n\\nfunction render(delta) {\\n  uniforms.time.value = time;\\n  time += 0.025;\\n  // sphere.rotation.z += 0.001;\\n  uniforms.resolution.value.x = window.innerWidth;\\n  uniforms.resolution.value.y = window.innerHeight;\\n  requestAnimationFrame(render);\\n  renderer.render(scene, camera);\\n}\\n\\nrender();\";\n\n//# sourceURL=webpack://hello_world/./hello-world/src/groundSolo.js?");

/***/ })

};
exports.runtime =
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("c11c6b343a3bfbf76996")
/******/ })();
/******/ 
/******/ }
;