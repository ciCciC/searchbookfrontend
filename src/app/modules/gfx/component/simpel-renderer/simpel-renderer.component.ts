import {Component, OnInit} from '@angular/core';
import * as THREE from 'three';
import {Intersection, Raycaster, Vector2} from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

@Component({
  selector: 'app-simpel-renderer',
  templateUrl: './simpel-renderer.component.html',
  styleUrls: ['./simpel-renderer.component.css']
})
export class SimpelRendererComponent implements OnInit {

  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  cube: THREE.InstancedMesh;
  cubeList: THREE.Mesh[] = [];
  dummy = new THREE.Object3D();
  amount = Number( window.location.search.substr( 1 ) ) || 4;
  count = Math.pow( this.amount, 3 );

  rotationTheta = 0.1;
  rotationMatrix = new THREE.Matrix4().makeRotationY( this.rotationTheta );
  instanceMatrix = new THREE.Matrix4();
  matrix = new THREE.Matrix4();
  private controls: OrbitControls;

  mouseVector: Vector2;
  private raycaster: Raycaster;

  constructor() {
  }

  init() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000);
    this.camera.position.set( this.amount * 0.9, this.amount * 0.9, this.amount * 0.9 );
    this.camera.lookAt(0, 0, 0);

    this.initRenderer();
    this.initCubeOfCubes();
    this.initRaycaster();
    this.initControl();

    this.camera.position.z = 5;
  }

  onMouseMove(event) {
    event.preventDefault();
    this.mouseVector.setX(( event.clientX / window.innerWidth ) * 2 - 1);
    this.mouseVector.setY(-( event.clientY / window.innerHeight ) * 2 + 1);
  }

  initControl() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.minDistance = 1;
    this.controls.maxDistance = 1000;
  }

  initRaycaster() {
    this.raycaster = new Raycaster();
    this.mouseVector = new Vector2();
  }

  initRenderer() {
    this.renderer = new THREE.WebGLRenderer({antialias: true});
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);
  }

  initCubeOfCubes() {
    for (let i = 0; i < this.amount; i++) {
      // this.cube = this.initSphereInstance('assets/texture/sphere.png');
      this.cube = this.initIcosahedronGeometry('assets/texture/sphere.png');
      this.cubeList.push(this.cube);
      this.scene.add(this.cube);
    }

    this.renderCubeOfCubes();
  }

  initIcosahedronGeometry(file: string): THREE.InstancedMesh {
    const geometry = new THREE.IcosahedronGeometry(0.5, 2);
    const texture = new THREE.TextureLoader().load(file);
    const material = new THREE.MeshBasicMaterial( {map: texture} );
    return new THREE.InstancedMesh( geometry, material, this.count );
  }

  initSphereInstance(file: string): THREE.InstancedMesh {
    const geometry = new THREE.SphereBufferGeometry( 0.5, 0.5, 0.5 );
    const texture = new THREE.TextureLoader().load(file);
    const material = new THREE.MeshBasicMaterial( {map: texture} );
    return new THREE.InstancedMesh( geometry, material, this.count );
  }

  animate()  {
      requestAnimationFrame(() => this.animate());
      this.render();
      this.controls.update();
      this.renderer.render(this.scene, this.camera);
  }

  render() {
    this.renderPick();
    // this.renderCubeOfCubes();
  }

  renderPick() {
    this.raycaster.setFromCamera(this.mouseVector, this.camera);

    const intersectObject = this.raycaster.intersectObject(this.cube);
    if (intersectObject.length > 0) {
      this.cube.getMatrixAt((intersectObject[0] as Intersection).instanceId, this.instanceMatrix);
      this.matrix.multiplyMatrices(this.instanceMatrix, this.rotationMatrix);
      this.cube.setMatrixAt(intersectObject[0].instanceId, this.matrix );
      this.cube.instanceMatrix.needsUpdate = true;
    }
  }

  renderCubeOfCubes() {
    if ( this.cube ) {
      const time = Date.now() * 0.001;
      this.cube.rotation.x = Math.sin( time / 4 );
      this.cube.rotation.y = Math.sin( time / 2 );
      let i = 0;
      const offset = ( this.amount - 1 ) / 2;
      for ( let x = 0; x < this.amount; x ++ ) {
        for ( let y = 0; y < this.amount; y ++ ) {
          for ( let z = 0; z < this.amount; z ++ ) {
            this.dummy.position.set( offset - x, offset - y, offset - z );
            this.dummy.rotation.y = ( Math.sin( x / 4 + time ) + Math.sin( y / 4 + time ) + Math.sin( z / 4 + time ) );
            this.dummy.rotation.z = this.dummy.rotation.y * 2;
            this.dummy.updateMatrix();
            this.cube.setMatrixAt( i ++, this.dummy.matrix );
          }
        }
      }
      this.cube.instanceMatrix.needsUpdate = true;
    }
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  initEventListener() {
    window.addEventListener('resize', () => this.onWindowResize(), false);
  }

  initMouseListener() {
    document.addEventListener( 'click', (event) => this.onMouseMove(event), false );
  }

  ngOnInit() {
    this.init();
    this.animate();
    this.initEventListener();
    this.initMouseListener();
  }

}
