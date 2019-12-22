import * as THREE from 'three';
import {Mesh, WebGLRenderer} from 'three';
import {PlaneGeometry} from 'three';
import {PerspectiveCamera} from 'three';

export class RenderUtil {

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

  static planeInstance(): Mesh {
    const geometry = new PlaneGeometry(1000, 1000, 100, 100);
    const material = new THREE.MeshNormalMaterial( {transparent: true, opacity: 1, wireframe: true} );
    const toReturn = new Mesh( geometry, material );
    return toReturn;
  }
}
