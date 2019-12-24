import {Component, OnInit} from '@angular/core';
import * as THREE from 'three';
import {AmbientLight, CameraHelper, Object3D, PerspectiveCamera, PointLight, Scene, WebGLRenderer} from 'three';
import {RenderUtil} from '../../../../engine/render/renderUtil';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {BookMesh} from '../../../../engine/gfxModel/bookMesh';
import {IsbnBookService} from '../../../../core/service/isbn/isbn-book.service';
import {Isbnbook} from '../../../../shared/model/isbnbook';

@Component({
  selector: 'app-render-books',
  templateUrl: './render-books.component.html',
  styleUrls: ['./render-books.component.css']
})
export class RenderBooksComponent implements OnInit {

  renderer: WebGLRenderer;
  private container: HTMLElement;
  private scene: Scene;
  private camera: PerspectiveCamera;
  private meshOfBooks = new Object3D();
  private bookMeshList: BookMesh [] = [];
  private bookList: Isbnbook [] = [];
  private controls: OrbitControls;
  private lightBlue: PointLight;

  constructor(private readonly isbnBookService: IsbnBookService) { }

  init() {
    this.initCanvas();
    this.initScene();
    this.initCam();
    this.initRenderer();
    this.initBookMeshs();
    this.initControl();
    this.initPlane();
    this.initLighting();

    this.camera.position.z = 10;
    this.camera.position.x = -15;
  }

  initCanvas() {
    this.container = document.getElementById('container');
  }

  initScene() {
    this.scene = new Scene();
  }

  initRenderer() {
    this.renderer = RenderUtil.getWebGLRenderer(this.container.clientWidth, this.container.clientHeight);
    this.container.append(this.renderer.domElement);
  }

  initCam() {
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.container.clientWidth / this.container.clientHeight,
      0.1,
      1000);

    const newCamera = new THREE.PerspectiveCamera(
      35,
      this.container.clientWidth / this.container.clientHeight,
      0.1,
      1000);

    const cameraHelper = new CameraHelper(newCamera);
    this.scene.add(cameraHelper);
  }

  initBookMeshs() {
    this.bookList.forEach(value => {
      const bookMesh = BookMesh.getInstance(1.5,
        1.5,
        0.1);
      bookMesh.book = value;
      bookMesh.touched = false;
      this.bookMeshList.push(bookMesh);
      this.meshOfBooks.add(bookMesh);
    });

    this.populateShape();
    this.scene.add(this.meshOfBooks);
  }

  initLighting() {
    const lightRed = new AmbientLight(0xFF2A00, 2);
    lightRed.position.set(0, 100, 100);
    this.scene.add(lightRed);

    this.lightBlue = new PointLight(0xFFFFFF, 5, 300);
    this.lightBlue.position.set(500, 0, 100);
    this.scene.add(this.lightBlue);
  }

  populateShape() {
    let i = 0;
    const count = 3;

    for (let x = 0; x < count; x++) {
      for (let y = 0; y < count; y++) {
        for (let z = 0; z < count; z++) {
          if (i < this.bookMeshList.length) {
            const tmpCube = this.bookMeshList[i];
            const dX = (2 * x);
            const dY = (2 * y);
            const dZ = (1.5 * z);
            tmpCube.rotation.y = 0.1;
            tmpCube.position.set(dX, dY, dZ);
            this.meshOfBooks.add(tmpCube);
            i++;
          }
        }
      }
    }

    this.meshOfBooks.children.forEach(value => {
      value.position.z += -8;
    });
  }

  initPlane() {
    const planeMesh = RenderUtil.planeInstance();
    this.scene.add(planeMesh);
  }

  initControl() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.minDistance = 0.1;
    this.controls.maxDistance = 1000;
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
    this.renderer.setRenderTarget(null);
  }

  getBooks() {
    this.isbnBookService.getAll(0).subscribe(value => {
      this.bookList = value.dataDtos;
      this.initBookMeshs();
      this.animate();
    });
  }

  onWindowResize() {
    RenderUtil.onWindowResize(this.camera, this.renderer, this.container);
  }

  initWindowResize() {
    window.addEventListener('resize', () => this.onWindowResize(), false);
  }

  ngOnInit() {
    this.init();
    this.getBooks();
    this.initWindowResize();
  }
}
