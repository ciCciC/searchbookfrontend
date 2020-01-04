import {Component, OnInit} from '@angular/core';
import * as THREE from 'three';
import {
  AmbientLight, Geometry,
  Material,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  PerspectiveCamera,
  Raycaster,
  Scene, TextureLoader,
  Vector3,
  WebGLRenderer
} from 'three';
import {RenderManager} from '../../../../engine/render/renderManager';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {BaseMesh} from '../../../../engine/gfxModel/baseMesh';
import {AmazonBook} from '../../../../shared/model/amazonBook';
import {AmazonService} from '../../../../core/service/amazon/amazon.service';
import {AmazonBookMesh} from '../../../../engine/gfxModel/amazonBookMesh';
import {AmazonBookFactory} from '../../../../engine/gfxModel/amazonBookFactory';
import {ArrowMesh} from '../../../../engine/gfxModel/arrowMesh';

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
  private bookList: AmazonBook [] = [];
  private controls: OrbitControls;
  private lightWhite: AmbientLight;
  private mouseVector: Vector3;
  private mouseMove: Vector3;
  private rayCasterClick: Raycaster;
  private rayCasterMove: Raycaster;
  private mouseX: number;
  private mouseY: number;
  private highlightBox: AmazonBookMesh;
  private nextMesh: ArrowMesh;
  private previousMesh: ArrowMesh;
  private groupActionMesh: THREE.Group;

  constructor(private readonly amazonBookService: AmazonService) {
  }

  init() {
    this.initCanvas();
    this.initScene();
    this.initCam();
    this.initRenderer();
    this.initBookMeshs();
    this.initNextAndPreviousMesh();
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
    this.scene.background = new THREE.TextureLoader().load('assets/texture/nebula.jpg');
  }

  initRenderer() {
    this.renderer = RenderManager.getWebGLRenderer(window.innerWidth, window.innerHeight);
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
    this.highlightBox.position.set(0, -1, 0);
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

  initNextAndPreviousMesh() {
    const heightY = 7;
    const widthArrow = 3;
    const geometry = new THREE.BoxBufferGeometry( widthArrow, 2, 0 );
    const img = new THREE.TextureLoader().load('assets/texture/arrow.webp');
    const material = new THREE.MeshBasicMaterial( { map : img, transparent: true } );

    this.nextMesh = new ArrowMesh(geometry, material);
    this.nextMesh.touched = false;
    this.nextMesh.direction = 'next';
    this.nextMesh.position.set(2, heightY, 2);
    this.nextMesh.rotateX(0.4);

    this.previousMesh = new ArrowMesh(geometry, material);
    this.previousMesh.touched = false;
    this.previousMesh.direction = 'previous';
    this.previousMesh.position.set(-2, heightY, 2);
    this.previousMesh.rotateX(3.5);

    this.groupActionMesh = new THREE.Group();
    this.groupActionMesh.add(this.nextMesh);
    this.groupActionMesh.add(this.previousMesh);
    this.groupActionMesh.position.set(0, 0, 0);

    this.scene.add(this.groupActionMesh);
  }

  initLighting() {
    this.lightWhite = new AmbientLight(0xffffff, 2);
    this.lightWhite.position.set(500, 0, -100);
    this.scene.add(this.lightWhite);
  }

  populateShape() {
    BaseMesh.populateAsRectangleShape(this.meshOfBooks, this.bookMeshList, 3);
  }

  initRaycaster() {
    this.rayCasterClick = new Raycaster();
    this.rayCasterMove = new Raycaster();
    this.mouseVector = new Vector3();
    this.mouseMove = new Vector3();
    this.rayCasterClick.params.Points.threshold = 0.1;
    this.rayCasterMove.params.Points.threshold = 0.1;
  }

  renderPick() {
    this.rayCasterClick.setFromCamera(this.mouseVector, this.camera);
    this.rayCasterMove.setFromCamera(this.mouseMove, this.camera);

    this.meshOfBooks.children.forEach(value => {
      const tmpMesh = (value as AmazonBookMesh);
      tmpMesh.touched = false;
      this.replaceWithMesh(tmpMesh);
    });

    this.groupActionMesh.children.forEach(value => {
      const tmpMesh = (value as ArrowMesh);
      tmpMesh.touched = false;
      this.replaceWithColor(tmpMesh);
    });

    const intersectObjects = this.rayCasterClick.intersectObjects(this.meshOfBooks.children);
    if (intersectObjects.length > 0) {
      intersectObjects.forEach(value => {
        const touchedCube = (value.object as AmazonBookMesh);
        touchedCube.touched = true;
        this.replaceWithMesh(touchedCube);
      });
    }

    const intersectArrows = this.rayCasterMove.intersectObjects(this.groupActionMesh.children);
    if (intersectArrows.length > 0) {
      intersectArrows.forEach(value => {
        const touchedCube = (value.object as ArrowMesh);
        touchedCube.touched = true;
        this.replaceWithColor(touchedCube);
      });
    }
  }

  replaceWithColor(mesh: ArrowMesh) {
    if (mesh.touched) {

      if (mesh.direction === 'next') {
        this.amazonBookService.nextPage();
      } else if (mesh.direction === 'previous') {
        this.amazonBookService.previousPage();
      }

      const searchField = this.amazonBookService.getSearchTitleValue();

      if (searchField.length > 0 || searchField) {
        this.amazonBookService.searchByTitle().subscribe(value => {
          this.transformFetchedData(value.dataDtos);
          this.animate();
        });
      } else {
        this.amazonBookService.getAll()
          .subscribe(value => value);
        this.getBooks();
      }
    }

    this.mouseMove.set(0, 0, 0);
    mesh.touched = false;
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
      this.highlightBox.position.set(0, -1, 1);
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

  getBooks() {
    this.amazonBookService.getLiveData().subscribe(value => {
      this.transformFetchedData(value.dataDtos);
      this.animate();
    });
  }

  transformFetchedData(value: AmazonBook[]) {
    this.meshOfBooks.children = [];
    this.meshOfBooks.add(this.highlightBox);
    this.bookList = value;
    this.initBookMeshs();
  }

  onMouseClick(event) {
    event.preventDefault();
    this.mouseVector.setX((event.clientX / window.innerWidth) * 2 - 1);
    this.mouseVector.setY(-(event.clientY / window.innerHeight) * 2 + 1);

    this.mouseX = event.clientX;
    this.mouseY = event.clientY;
  }

  onMouseMove(event) {
    event.preventDefault();
    this.mouseMove.setX((event.clientX / window.innerWidth) * 2 - 1);
    this.mouseMove.setY(-(event.clientY / window.innerHeight) * 2 + 1);
  }

  onWindowResize() {
    RenderManager.onWindowResize(this.camera, this.renderer, this.container);
  }

  initWindowResize() {
    window.addEventListener('resize', () => this.onWindowResize(), false);
  }

  initMouseClick() {
    this.renderer.domElement.addEventListener('click',
      (event) => this.onMouseClick(event), false);
  }

  initMouseMove() {
    this.renderer.domElement.addEventListener('click',
      (event) => this.onMouseMove(event), false);
  }

  ngOnInit() {
    this.init();
    this.getBooks();
    this.initWindowResize();
    this.initMouseClick();
    this.initMouseMove();
  }
}
