import {Component, OnInit} from '@angular/core';
import * as THREE from 'three';
import {AmbientLight, MeshStandardMaterial, Object3D, PerspectiveCamera, Raycaster, Scene, Vector3, WebGLRenderer} from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {AmazonBook} from '../../../../shared/model/amazonBook';
import {AmazonService} from '../../../../core/service/amazon/amazon.service';
import {AmazonBookMesh} from '../../../../engine/gfxModel/amazonBookMesh';
import {RenderUtil} from '../../../../engine/render/renderUtil';
import {AmazonBookFactory} from '../../../../engine/gfxModel/amazonBookFactory';
import {BookMesh} from '../../../../engine/gfxModel/bookMesh';

@Component({
  selector: 'app-simpel-renderer',
  templateUrl: './simpel-renderer.component.html',
  styleUrls: ['./simpel-renderer.component.css']
})
export class SimpelRendererComponent implements OnInit {

  private rendererRight: WebGLRenderer;
  private rendererLeft: WebGLRenderer;
  private container: HTMLElement;
  private sceneRight: Scene;
  private sceneLeft: Scene;
  private camera: PerspectiveCamera;
  private meshOfBooks = new Object3D();
  private bookMeshList: AmazonBookMesh [] = [];
  private bookList: AmazonBook [] = [];
  private controls: OrbitControls;
  private lightWhite: AmbientLight;
  private mouseVector: Vector3;
  private rayCaster: Raycaster;
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
    this.controls = new OrbitControls(this.camera, this.rendererRight.domElement);
    this.controls.minDistance = 0.1;
    this.controls.maxDistance = 1000;
    this.controls.dampingFactor = 0.1;
  }

  initCanvas() {
    this.container = document.getElementById('container1');
  }

  initScene() {
    this.sceneRight = new Scene();
    this.sceneLeft = new Scene();
  }

  initRenderer() {
    this.rendererLeft = RenderUtil.getWebGLRenderer(window.innerWidth / 2, window.innerHeight);
    this.rendererLeft.autoClear = false;
    this.container.append(this.rendererLeft.domElement);

    this.rendererRight = RenderUtil.getWebGLRenderer(window.innerWidth / 2, window.innerHeight);
    this.rendererRight.autoClear = false;
    this.container.append(this.rendererRight.domElement);
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
    this.sceneLeft.add(this.highlightBox);
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
    this.sceneRight.add(this.meshOfBooks);
  }

  populateShape() {
    BookMesh.populateAsRectangleShape(this.meshOfBooks, this.bookMeshList);
  }

  initLighting() {
    this.lightWhite = new AmbientLight(0xffffff, 2);
    this.lightWhite.position.set(500, 0, -100);
    this.sceneRight.add(this.lightWhite);

    const leftLight = new AmbientLight(0xffffff, 2);
    leftLight.position.set(0, 0, -100);
    this.sceneLeft.add(leftLight);
  }

  initRaycaster() {
    this.rayCaster = new Raycaster();
    this.mouseVector = new Vector3();
    this.rayCaster.params.Points.threshold = 0.1;
  }

  renderPick() {
    this.rayCaster.setFromCamera(this.mouseVector, this.camera);

    this.meshOfBooks.children.forEach(value => {
      const tmpMesh = (value as AmazonBookMesh);
      tmpMesh.touched = false;
      // this.replaceWithMesh(tmpMesh);
    });

    const intersectObjects = this.rayCaster.intersectObjects(this.meshOfBooks.children);
    if (intersectObjects.length > 0) {
      intersectObjects.forEach(value => {
        const touchedCube = (value.object as AmazonBookMesh);
        touchedCube.touched = true;
        // this.replaceWithMesh(touchedCube);
      });
    }
  }

  animate()  {
    requestAnimationFrame(() => this.animate());
    this.render();
    this.controls.update();
    this.camera.updateProjectionMatrix();
    this.rendererRight.render(this.sceneRight, this.camera);
    this.rendererLeft.render(this.sceneLeft, this.camera);
  }

  render() {
    this.renderPick();
    this.highlightBox.rotation.z += Math.PI / 500;
    this.rendererRight.setRenderTarget(null);
    this.rendererLeft.setRenderTarget(null);
  }

  getBooks() {
    this.amazonBookService.getAllMock().subscribe(value => {
      this.meshOfBooks.children = [];
      // this.meshOfBooks.add(this.highlightBox);
      this.bookList = value.dataDtos;
      this.initBookMeshs();
      this.animate();
    });
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.rendererLeft.setPixelRatio(window.devicePixelRatio);
    this.rendererLeft.setSize(window.innerWidth / 2, window.innerHeight);
    this.rendererRight.setPixelRatio(window.devicePixelRatio);
    this.rendererRight.setSize(window.innerWidth / 2, window.innerHeight);
  }

  onMouseClick(event) {
    event.preventDefault();
    this.mouseVector.setX(( event.clientX / window.innerWidth ) * 2 - 1);
    this.mouseVector.setY(-( event.clientY / window.innerHeight ) * 2 + 1);
  }

  initEventListener() {
    window.addEventListener('resize', () => this.onWindowResize(), false);
  }

  initMouseListener() {
    document.addEventListener( 'click', (event) => this.onMouseClick(event), false );
  }

  ngOnInit() {
    this.init();
    this.getBooks();
    // this.animate();
    this.initEventListener();
    this.initMouseListener();
  }

}
