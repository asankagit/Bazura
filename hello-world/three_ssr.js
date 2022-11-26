import express from "express"
import path from "path"
import http from "http"
import * as THREE from "three"
import socketIO from "socket.io"
import Jimp from "jimp"
import { JSDOM } from "jsdom"
import { OBJLoader } from "./OBJLoader.js"
import fs from 'fs'
import React, { createElement } from 'react';

const { window } = new JSDOM();
global.document = window.document;


class ImgEngine {
    //  server: http.Server
    //  port: number
    //  io: socketIO.Server

    constructor(port) {
        // this.port = port
        this.clients = {}
        this.width = 600
        this.height = 400
        this.scene = new THREE.Scene()
        this.camera = new THREE.PerspectiveCamera(75, this.width / this.height, 0.1, 1000)
        this.gl = require('gl')(this.width, this.height, { preserveDrawingBuffer: true }); //headless-gl
        this.renderer = new THREE.WebGLRenderer({ context: this.gl });
        this.mesh = new THREE.Mesh()
        this.clock = new THREE.Clock()
        this.delta = 0;
        this.serverDateTime = new Date()
        this.font
        this.renderStart = new Date()
        const app = express()
        app.use(express.static(path.join(__dirname, '../client')))

        // this.server = new http.Server(app);

        // this.io = new socketIO.Server(this.server);

        // this.io.on('connection', (socket: socketIO.Socket) => {
        //     this.clients[socket.id] = {}
        //     socket.emit("id", socket.id);

        //     socket.on('disconnect', () => {
        //         console.log('socket disconnected : ' + socket.id)
        //         if (this.clients && this.clients[socket.id]) {
        //             console.log("deleting " + socket.id)
        //             delete this.clients[socket.id]
        //         }
        //     })

        //     socket.on("clientTimestamp", (t: number) => {
        //         if (this.clients[socket.id]) {
        //             socket.emit("timestampResponse", t);
        //         }
        //     })
        // })

        this.renderer.setSize(this.width, this.height)
        this.renderer.outputEncoding = THREE.sRGBEncoding

        var light1 = new THREE.PointLight();
        light1.position.set(50, 50, 50)
        this.scene.add(light1);

        var light2 = new THREE.PointLight();
        light2.position.set(-50, 50, 50)
        this.scene.add(light2);

        const material = new THREE.MeshPhysicalMaterial({
            color: 0x66ffff,
            metalness: 0.5,
            roughness: 0.1,
            transparent: true,
            transmission: 1.0,
            side: THREE.DoubleSide,
            clearcoat: 1.0,
            clearcoatRoughness: .25
        });

        const loader = new OBJLoader()
        const data = fs.readFileSync(path.resolve(__dirname, "models/seanwasere.obj"), { encoding: 'utf8', flag: 'r' });

        const obj = loader.parse(data)
        obj.traverse((child) => {
            if (child.type === "Mesh") {
                child.material = material
                this.mesh = new THREE.Mesh(child.geometry, material)
            }
        })
        this.mesh = obj
        this.mesh.rotateZ(Math.PI)
        this.scene.add(this.mesh)

        this.camera.position.z = 30

        Jimp.loadFont(Jimp.FONT_SANS_16_WHITE).then((font) => {
            this.font = font
        })

        setInterval(() => {
            this.render()
        }, 100)
    }

    Start() {
        // this.server.listen(this.port, () => {
        //     console.log(`Server listening on port ${this.port}.`)
        // })
    }

    render() {
        this.renderStart = new Date()

        this.delta = this.clock.getDelta()

        if (this.mesh) {
            this.mesh.rotation.y += 0.5 * this.delta
            this.mesh.rotation.z += 0.25 * this.delta
        }

        if (1 > 0) {
            this.renderer.render(this.scene, this.camera);

            var bitmapData = new Uint8Array(this.width * this.height * 4)
            this.gl.readPixels(0, 0, this.width, this.height, this.gl.RGBA, this.gl.UNSIGNED_BYTE, bitmapData)

            new Jimp(this.width, this.height, (err, image) => {
                image.bitmap.data = bitmapData
                this.serverDateTime = new Date()
                image.print(this.font, 40, 330, "Server ISO Date : " + this.serverDateTime.toISOString())
                image.print(this.font, 40, 350, "Render Delta ms: " + (new Date().getTime() - this.renderStart.getTime()))
                // image.print(this.font, 40, 370, "Client Count: " + Object.keys(this.clients).length)
                image.getBuffer("image/png", (err, buffer) => {
                    // this.io.emit('image', Buffer.from(buffer));
                    return Buffer.from(buffer)
                });
            })
        }
    }
}

const imgEngine = new ImgEngine(123)
export default imgEngine