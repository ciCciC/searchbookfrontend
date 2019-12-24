import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import * as THREE from 'three';
import {AmbientLight, MeshStandardMaterial, Object3D, PerspectiveCamera, Raycaster, Scene, Vector3, WebGLRenderer} from 'three';
import {RenderUtil} from '../../../../engine/render/renderUtil';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {BookMesh} from '../../../../engine/gfxModel/bookMesh';
import {Amazonbook} from '../../../../shared/model/amazonbook';
import {AmazonService} from '../../../../core/service/amazon/amazon.service';
import {AmazonBookMesh} from '../../../../engine/gfxModel/amazonBookMesh';
import {AmazonBookFactory} from '../../../../engine/gfxModel/amazonBookFactory';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-render-amazon-books',
  templateUrl: './render-amazon-books.component.html',
  styleUrls: ['./render-amazon-books.component.css']
})
export class RenderAmazonBooksComponent implements OnInit {

  private renderer: WebGLRenderer;
  private container: HTMLElement;
  private scene: Scene;
  private camera: PerspectiveCamera;
  private meshOfBooks = new Object3D();
  private bookMeshList: AmazonBookMesh [] = [];
  private bookList: Amazonbook [] = [];
  private controls: OrbitControls;
  private lightWhite: AmbientLight;
  private mouseVector: Vector3;
  private raycaster: Raycaster;
  private mouseX: number;
  private mouseY: number;
  private highlightBox: AmazonBookMesh;

  constructor(private readonly amazonBookService: AmazonService) {
  }

  init() {
    this.initCanvas();
    this.initScene();
    this.initCam();
    this.initRenderer();
    this.initBookMeshs();
    this.initHighlightBox();
    this.initControl();
    this.initLighting();
    this.initRaycaster();

    this.camera.position.z = 15;
  }

  initControl() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.minDistance = 0.1;
    this.controls.maxDistance = 1000;
    this.controls.dampingFactor = 0.1;
  }

  initCanvas() {
    this.container = document.getElementById('container');
  }

  initScene() {
    this.scene = new Scene();
  }

  initRenderer() {
    this.renderer = RenderUtil.getWebGLRenderer(window.innerWidth, window.innerHeight);
    this.renderer.autoClear = false;
    this.container.append(this.renderer.domElement);
  }

  initCam() {
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000);
  }

  initHighlightBox() {
    const geometry = new THREE.BoxGeometry(
      10,
      10,
      1.1);
    const material = AmazonBookFactory.getImgMaterial('assets/texture/sphere.png');
    this.highlightBox = new AmazonBookMesh(geometry, material);
    this.highlightBox.position.set(0, 0, 0);
    this.meshOfBooks.add(this.highlightBox);
  }

  initBookMeshs() {
    this.bookList.forEach(value => {
      const bookMesh = AmazonBookFactory.getInstance(
        1.5,
        1.5,
        1.1, // <- 0.1
        value.imgUrl);
      bookMesh.book = value;
      bookMesh.touched = false;
      this.bookMeshList.push(bookMesh);
    });
    this.populateShape();
    this.scene.add(this.meshOfBooks);
  }

  initLighting() {
    this.lightWhite = new AmbientLight(0xffffff, 2);
    this.lightWhite.position.set(500, 0, -100);
    this.scene.add(this.lightWhite);
  }

  populateShape() {
    BookMesh.populateAsRectangleShape(this.meshOfBooks, this.bookMeshList);
  }

  initRaycaster() {
    this.raycaster = new Raycaster();
    this.mouseVector = new Vector3();
    this.raycaster.params.Points.threshold = 0.1;
  }

  renderPick() {
    this.raycaster.setFromCamera(this.mouseVector, this.camera);

    this.meshOfBooks.children.forEach(value => {
      const tmpMesh = (value as AmazonBookMesh);
      tmpMesh.touched = false;
      this.replaceWithMesh(tmpMesh);
    });

    const intersectObjects = this.raycaster.intersectObjects(this.meshOfBooks.children);
    if (intersectObjects.length > 0) {
      intersectObjects.forEach(value => {
        const touchedCube = (value.object as AmazonBookMesh);
        touchedCube.touched = true;
        this.replaceWithMesh(touchedCube);
      });
    }
  }

  replaceWithMesh(mesh: AmazonBookMesh) {
    if (mesh.touched) {
      this.highlightBox.visible = true;
      (this.highlightBox.material as MeshStandardMaterial).copy((mesh.material as MeshStandardMaterial));
      (mesh.material as MeshStandardMaterial).color.setHex(0x808080);

      const time = Date.now() * 0.001;
      const calCos = Math.cos(time / 2);
      this.highlightBox.translateZ(calCos < 1 ? calCos + 1 : calCos);
    } else {
      this.highlightBox.visible = false;
      this.highlightBox.position.set(0, 0, 1);
      this.highlightBox.translateZ(0);
      (mesh.material as MeshStandardMaterial).color.setHex(0xffffff);
    }
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    this.render();
    this.controls.update();
    this.camera.updateProjectionMatrix();
    this.renderer.render(this.scene, this.camera);
  }

  render() {
    this.renderPick();
    this.renderer.setRenderTarget(null);
  }

  getBooks(dataSource: Observable<Amazonbook[]>) {
    dataSource.subscribe(value => {
      this.meshOfBooks.children = [];
      this.meshOfBooks.add(this.highlightBox);
      this.bookList = value;
      this.initBookMeshs();
      this.animate();
    });
  }

  onMouseClick(event) {
    event.preventDefault();
    this.mouseVector.setX((event.clientX / window.innerWidth) * 2 - 1);
    this.mouseVector.setY(-(event.clientY / window.innerHeight) * 2 + 1);

    this.mouseX = event.clientX;
    this.mouseY = event.clientY;
  }

  onWindowResize() {
    RenderUtil.onWindowResize(this.camera, this.renderer, this.container);
  }

  initWindowResize() {
    window.addEventListener('resize', () => this.onWindowResize(), false);
  }

  initMouseClick() {
    this.renderer.domElement.addEventListener('click',
      (event) => this.onMouseClick(event), false);
  }

  ngOnInit() {
    this.init();
    this.initWindowResize();
    this.initMouseClick();
  }
}
