import * as THREE from 'three';
import {Mesh, WebGLRenderer} from 'three';
import {PlaneGeometry} from 'three';
import {PerspectiveCamera} from 'three';

export class RenderManager {

  static getWebGLRenderer(width: number, height: number, color?: number): WebGLRenderer {
    const renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setClearColor(0x050505);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    return renderer;
  }

  static onWindowResize(camera: PerspectiveCamera, renderer: WebGLRenderer, container: HTMLElement) {
    camera.aspect = container.clientWidth / container.clientHeight;
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(container.clientWidth, container.clientHeight);
    camera.updateProjectionMatrix();
  }

  static planeInstance(width: number, height: number, widthSegments: number, heightSegments: number): Mesh {
    // const geometry = new PlaneGeometry(1000, 1000, 100, 100);
    const geometry = new PlaneGeometry(width, height, widthSegments, heightSegments);
    const material = new THREE.MeshNormalMaterial( {transparent: true, opacity: 1, wireframe: true} );
    return new Mesh( geometry, material );
  }
}
