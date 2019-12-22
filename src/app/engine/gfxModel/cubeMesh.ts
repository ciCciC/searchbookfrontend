import {FontLoader, InstancedMesh, Mesh, PlaneGeometry, ShapeGeometry, TextGeometry} from 'three';
import * as THREE from 'three';
import {Book} from '../../shared/model/book';

export class CubeMesh extends Mesh {

  idCube: string;
  book: Book;
  index: number;
  touched: boolean;

  static getInstance(file: string): CubeMesh {
    const scale = 100;
    const geometry = new THREE.BoxGeometry( scale, scale, scale);
    const texture = new THREE.TextureLoader().load(file);
    const material = new THREE.MeshStandardMaterial( {map: texture} );
    // const material = new THREE.MeshBasicMaterial( {map: texture} );
    const toReturn = new CubeMesh( geometry, material );
    const splitted = file.split('/');
    toReturn.name = splitted[splitted.length - 1];
    toReturn.index = 0;
    toReturn.touched = false;
    return toReturn;
  }

  static getBookInstance(): CubeMesh {
    const scale = 100;
    const geometry = new THREE.BoxGeometry( scale, 2, scale * 4);
    const texture = new THREE.TextureLoader().load('assets/texture/mario.webp');
    // const material = new THREE.MeshStandardMaterial( {map: texture, color: 0xf3ffe2, roughness: 0.5, metalness: 0.5} );
    const material = new THREE.MeshBasicMaterial( {map: texture} );
    const toReturn = new CubeMesh( geometry, material );
    toReturn.index = 0;
    toReturn.touched = false;
    return toReturn;
  }

  static getBookInstanceWithImg(): CubeMesh {
    const scale = 100;
    // const geometry = new THREE.BoxGeometry( scale * 3, scale * 3, scale / 4);
    const geometry = new THREE.BoxBufferGeometry( scale, scale, 2 );
    const texture = new THREE.TextureLoader();
    texture.crossOrigin = 'Anonymous';
    const img = texture.load('https://images-na.ssl-images-amazon.com/images/I/41gdQTWQgEL._SX329_BO1,204,203,200_.jpg');
    const material = new THREE.MeshStandardMaterial( {map: img} );
    const toReturn = new CubeMesh( geometry, material );
    toReturn.index = 0;
    toReturn.touched = false;
    return toReturn;
  }

  static getSelection(): CubeMesh {
    const scale = 100;
    const geometry = new THREE.BoxGeometry( scale, scale, scale );
    const material = new THREE.MeshStandardMaterial( {color: 0xf3ffe2, roughness: 0.5, metalness: 0.5} );
    // const material = new THREE.MeshNormalMaterial( {transparent: true, opacity: 1} );
    // const material = new THREE.MeshLambertMaterial( {color: 0xf3ffe2, emissive: 0xff0000, transparent: true, opacity: 1} );
    // const material = new THREE.MeshPhongMaterial( {color: 0xf3ffe2, transparent: true, opacity: 1} );
    const toReturn = new CubeMesh( geometry, material );
    toReturn.idCube = 'selection';
    return toReturn;
  }

  static planeInstance(): CubeMesh {
    const geometry = new PlaneGeometry(10000, 10000, 100, 100);
    const material = new THREE.MeshNormalMaterial( {transparent: true, opacity: 1, wireframe: true} );
    // const material = new THREE.MeshPhongMaterial( {color: 0xf3ffe2} );
    // const material = new THREE.MeshDepthMaterial();
    const toReturn = new CubeMesh( geometry, material );
    toReturn.idCube = 'plane';
    return toReturn;
  }

  static planeLineInstance(): THREE.Points {
    const geometry = new PlaneGeometry(10000, 10000, 100, 100);
    const material = new THREE.PointsMaterial();
    const toReturn = new THREE.Points( geometry, material );
    return toReturn;
  }

  static getTextInstance(): CubeMesh {
    const fontStyle = new FontLoader()
      .parse('assets/fonts/gentilis_regular.typeface.json');

    const textShape = new THREE.BufferGeometry();
    const shapes = fontStyle.generateShapes('info', 80, 2);
    const geometry = new ShapeGeometry(shapes);
    geometry.computeBoundingBox();

    const material = new THREE.MeshBasicMaterial( {
      color      : 0x006699,
      transparent: true,
      opacity    : 0.4,
      side       : THREE.DoubleSide
    } );

    const xMid = -0.5 * ( geometry.boundingBox.max.x - geometry.boundingBox.min.x );
    const yMax = -0.5 * ( geometry.boundingBox.max.y - geometry.boundingBox.min.y );
    geometry.translate( xMid, yMax, 0 );

    textShape.fromGeometry( geometry );
    const textCubeMesh = new CubeMesh(textShape, material);
    return textCubeMesh;
  }

  static getInstanceMockList(): CubeMesh[] {
    const mockList: CubeMesh[] = [];
    for (let i = 0; i < 30; i++) {
      mockList.push(CubeMesh.getBookInstanceWithImg());
    }
    return mockList;
  }

  public setIndex(change: number) {
    this.index = change;
  }

  public getIndex(): number {
    return this.index;
  }
}
