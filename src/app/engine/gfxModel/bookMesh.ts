import {Book} from '../../shared/model/book';
import * as THREE from 'three';
import {Mesh} from 'three';
import {Object3D} from 'three';
import {AmazonBookMesh} from './amazonBookMesh';

export class BookMesh extends Mesh {
  idCube: string;
  book: Book;
  index: number;
  touched: boolean;

  static getInstance(width: number,
                     height: number,
                     depth: number,
                     file?: string): BookMesh {
    const geometry = new THREE.BoxGeometry(width, height, depth);
    // const texture = new THREE.TextureLoader().load(file);
    file = 'assets/texture/blaine.jpg';
    const texture = new THREE.TextureLoader();
    texture.crossOrigin = 'Anonymous';
    const img = texture.load(file);

    // const material = new THREE.MeshBasicMaterial( {map: img} );
    // const material = new THREE.MeshNormalMaterial( {transparent: true, opacity: 1, wireframe: true} );
    const material = new THREE.MeshStandardMaterial( {map: img} );
    const toReturn = new BookMesh( geometry, material );
    // const splitted = file.split('/');
    // toReturn.name = splitted[splitted.length - 1];
    toReturn.index = 0;
    toReturn.touched = false;
    return toReturn;
  }

  static populateShape(meshOfBooks: Object3D, bookMeshList: BookMesh []) {
    let i = 0;
    const count = 3;

    for (let x = 0; x < count; x++) {
      for (let y = 0; y < count; y++) {
        for (let z = 0; z < count; z++) {
          if (i < bookMeshList.length) {
            const tmpCube = bookMeshList[i];
            const dX = (2 * x);
            const dY = (2 * y);
            const dZ = (1.5 * z);
            tmpCube.rotation.y = 0.1;
            tmpCube.position.set(dX, dY, dZ);
            meshOfBooks.add(tmpCube);
            i++;
          }
        }
      }
    }

    meshOfBooks.children.forEach(value => {
      value.position.z += -8;
    });
  }

  /**
   * For mapping the list as a rectangle shape
   * @param meshOfBooks
   * @param bookMeshList
   */
  static populateAsRectangleShape(meshOfBooks: Object3D, bookMeshList: BookMesh []) {
    // Amount of rows
    const preferredRowLength = 3;

    const arrTwoD = [];
    while (bookMeshList.length) {
      arrTwoD.push(bookMeshList.splice(0, preferredRowLength));
    }

    const offset = ( arrTwoD.length - 1 );
    const areaSize = preferredRowLength / 2;

    for (let i = 0; i < arrTwoD.length; i++) {
      for (let j = 0; j < arrTwoD[i].length; j++) {
        const book = arrTwoD[i][j] as AmazonBookMesh;
        const jX = j * 2;
        const iY = i * 2;

        const vector3 = new THREE.Vector3();
        vector3.set( (offset - jX + (areaSize + 2)), offset - iY, 0 );
        book.position.set(vector3.x, vector3.y, vector3.z);
        book.currentPos.copy(vector3);

        meshOfBooks.add(book);
      }
    }
  }
}
