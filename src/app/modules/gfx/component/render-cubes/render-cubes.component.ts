import {Component, OnInit} from '@angular/core';
import * as THREE from 'three';
import {AmbientLight, CameraHelper, MeshBasicMaterial, Object3D, PointLight, Raycaster, SpotLight, Vector2, Vector3} from 'three';
import {CubeMesh} from '../../../../engine/gfxModel/cubeMesh';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {IsbnBookService} from '../../../../core/service/isbn/isbn-book.service';
import {Book} from '../../../../shared/model/book';
import {RenderUtil} from '../../../../engine/render/renderUtil';


@Component({
  selector: 'app-render-cubes',
  templateUrl: './render-cubes.component.html',
  styleUrls: ['./render-cubes.component.css']
})
export class RenderCubesComponent implements OnInit {

  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  cube = new Object3D();
  cubeList: CubeMesh[] = [];
  bookList: Book[] = [];
  private container: HTMLElement;
  private textBox = document.createElement('div');
  private controls: OrbitControls;
  mouseVector: Vector2;
  private raycaster: Raycaster;
  highlightBox: CubeMesh;
  touched: boolean;
  private mouseX: number;
  private mouseY: number;
  lightBlue: PointLight;

  constructor(private readonly bookService: IsbnBookService) {
  }

  init() {
    this.container = document.getElementById('container');
    this.initScene();
    this.initCam();
    this.initRenderer();
    this.initRaycaster();
    // this.initOneMeshForAll();
    // this.initMeshBooks();
    this.initInfobox();
    this.initControl();
    this.initLight();
    this.initPlane();
    // this.camera.position.z = 1000; // dit is voor zonder controller
    // this.camera.position.y = -10; // dit is voor zonder controller
    this.camera.position.z = (this.container.clientHeight / 2) / Math.tan(Math.PI / 6);
    this.camera.position.y = 0;
    this.camera.position.x = 1000;
  }

  initCam() {
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.container.clientWidth / this.container.clientHeight,
      1,
      10000);
    // this.camera.lookAt(new Vector3(0, 0, 0));

    const newCamera = new THREE.PerspectiveCamera(
      75,
      this.container.clientWidth / this.container.clientHeight,
      1,
      1000);

    const cameraHelper = new CameraHelper(newCamera);
    this.scene.add(cameraHelper);
  }

  initPlane() {
    const planeMesh = CubeMesh.planeInstance();
    planeMesh.position.x = -90 * Math.PI / 180;
    planeMesh.position.y = -100;
    this.scene.add(planeMesh);
  }

  initLight() {
    const lightRed = new AmbientLight(0xFF2A00, 0.5);
    lightRed.position.set(-500, 10, -100);
    this.scene.add(lightRed);

    this.lightBlue = new PointLight(0x003AFF, 4, 300);
    this.lightBlue.position.set(-500, 10, -100);
    this.scene.add(this.lightBlue);
  }

  initScene() {
    this.scene = new THREE.Scene();
  }

  initRenderer() {
    this.renderer = RenderUtil.getWebGLRenderer(this.container.clientWidth, this.container.clientHeight);
    this.container.append(this.renderer.domElement);
  }

  initMeshBooks() {
    this.bookList.forEach(value => {
      const cb = CubeMesh.getBookInstanceWithImg();
      cb.book = value;
      cb.touched = false;
      this.cubeList.push(cb);
      this.cube.add(cb);
    });

    this.populeateShape();
    this.scene.add(this.cube);
  }

  populeateShape() {
    let i = 0;
    const count = 3;
    for (let x = 0; x < count; x++) {
      for (let y = 0; y < count; y++) {
        for (let z = 0; z < count; z++) {
          if (i < this.cubeList.length) {
            const tmpCube = this.cubeList[i];
            const dX = (200 * x);
            const dY = (200 * y);
            const dZ = (150 * z);
            tmpCube.position.set(dX, dY, dZ);
            this.cube.add(tmpCube);
            i++;
          }
        }
      }
    }

    this.cube.children.forEach(value => {
      value.position.z += 50;
    });
  }

  initInfobox() {
    this.textBox = document.createElement('div');
    this.textBox.className = 'infobox';
    this.textBox.style.position = 'absolute';
    // text2.style.zIndex = '1';    // if you still don't see the label, try uncommenting this
    this.textBox.style.width = '100';
    this.textBox.style.height = '100';
    this.textBox.style.backgroundColor = 'black';
    this.textBox.style.color = 'red';
    this.textBox.innerHTML = '';
    this.textBox.style.top = 200 + 'px';
    this.textBox.style.left = 200 + 'px';
    document.body.appendChild(this.textBox);
  }

  initRaycaster() {
    this.raycaster = new Raycaster();
    this.mouseVector = new Vector2();
  }

  initControl() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.minDistance = 500;
    this.controls.maxDistance = 5000;
    this.controls.dampingFactor = 0.1;
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    this.render();
    this.controls.update();
    this.camera.updateProjectionMatrix();
    this.renderer.render(this.scene, this.camera);
  }

  render() {
    this.animateCubes();
    this.renderInfobox();
    this.renderer.setRenderTarget(null);
  }

  renderInfobox() {
    this.textBox.style.left = this.mouseX + 10 + 'px';
    this.textBox.style.top = this.mouseY + 10 + 'px';
  }

  animateCubes() {
    this.renderPick();
  }

  replaceWithColor(mesh: CubeMesh) {
    const objMat = (mesh.material as MeshBasicMaterial);
    if (mesh.touched) {
      // objMat.color.setHex(0xffff00);
    } else {
      objMat.color.setHex(0xffffff);
    }
  }

  replaceWithMesh(mesh: CubeMesh) {
    const objMat = (mesh.material as MeshBasicMaterial);
    if (mesh.touched) {
      this.highlightBox.position.copy(mesh.position);
      this.highlightBox.rotation.copy(mesh.rotation);
      this.highlightBox.scale.copy(mesh.scale);
      this.highlightBox.visible = true;
      mesh.visible = false;
    } else {
      mesh.visible = true;
      this.highlightBox.visible = false;
    }
  }

  rotateBox(mesh: CubeMesh) {
    if (mesh.touched) {
      const time = Date.now() * 0.001;
      // mesh.rotation.x = Math.sin(time / 4);
      // mesh.rotation.y = Math.sin(time / 2);
      /////

      mesh.rotation.z = Math.sin(time / 2);
    } else {
      mesh.rotation.x = 0;
      mesh.rotation.y = 0;
    }
  }

  onWindowResize() {
    RenderUtil.onWindowResize(this.camera, this.renderer, this.container);
  }

  onMouseMove(event) {
    event.preventDefault();
    this.mouseVector.setX((event.clientX / window.innerWidth) * 2 - 1);
    this.mouseVector.setY(-(event.clientY / window.innerHeight) * 2 + 1);

    this.mouseX = event.clientX;
    this.mouseY = event.clientY;
  }

  renderPick() {
    this.raycaster.setFromCamera(this.mouseVector, this.camera);

    this.cube.children.forEach(value => {
      const tmpMesh = (value as CubeMesh);
      tmpMesh.touched = true;
      this.rotateBox((value as CubeMesh));
      this.replaceWithColor((value as CubeMesh));
    });

    this.touched = false;
    this.textBox.innerHTML = '';

    const intersectObjects = this.raycaster.intersectObjects(this.cube.children);
    if (intersectObjects.length > 0) {
      intersectObjects.forEach(value => {
        const touchedCube = (value.object as CubeMesh);
        touchedCube.touched = true;
        this.textBox.innerHTML = touchedCube.book.title;
        // this.replaceWithColor(touchedCube);
        this.rotateBox(touchedCube);
      });
    }
  }

  initWindowResize() {
    window.addEventListener('resize', () => this.onWindowResize(), false);
  }

  initMouseClick() {
    this.renderer.domElement.addEventListener('mousemove', (event) => this.onMouseMove(event), false);
  }

  fetchData() {
    this.bookService.getAll(0).subscribe(value => {
      this.bookList = value.dataDtos;
      this.initMeshBooks();
      this.animate();
    });
  }

  ngOnInit() {
    this.init();
    this.fetchData();
    // this.animate();
    this.initWindowResize();
    this.initMouseClick();
  }
}
