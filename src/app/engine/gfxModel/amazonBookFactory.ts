import * as THREE from 'three';
import {MeshStandardMaterial} from 'three';
import {MeshBasicMaterial} from 'three';
import {Texture} from 'three';
import {AmazonBookMesh} from './amazonBookMesh';

export class AmazonBookFactory {

  static getInstance(width: number,
                     height: number,
                     depth: number,
                     file: string): AmazonBookMesh {
    const geometry = new THREE.BoxGeometry(width, height, depth);
    const material = this.getImgMaterial(file);
    // const material = new THREE.MeshNormalMaterial( {transparent: true, opacity: 10, wireframe: false} );
    const toReturn = new AmazonBookMesh( geometry, material );
    toReturn.file = file;
    toReturn.geometryIntern = geometry;

    let splitted = [];

    if (file.length > 1) {
      splitted = file.split('/');
      toReturn.name = splitted[splitted.length - 1];
    } else {
      toReturn.name = 'no title';
    }

    toReturn.index = 0;
    toReturn.touched = false;
    return toReturn;
  }

  static getImgMaterial(file: string): MeshStandardMaterial {
    const texture = new THREE.TextureLoader();
    texture.crossOrigin = 'Anonymous';
    const img = texture.load(file);
    const material = new THREE.MeshStandardMaterial( {map: img} );
    material.needsUpdate = true;
    return material;
  }

  static testImgLoader(file: string): MeshBasicMaterial {
    const textureLoader = new THREE.TextureLoader();
    textureLoader.crossOrigin = '';
    const img = textureLoader.load(file);
    const material = new THREE.MeshBasicMaterial(
      {map: img} );
    material.needsUpdate = true;
    return material;
  }

  static getImgTexture(file: string): Texture {
    const textureLoader = new THREE.TextureLoader();
    textureLoader.crossOrigin = '';
    const img = textureLoader.load(file);
    return img;
  }
}
