import {Geometry, Mesh, Vector3} from 'three';
import {AmazonBook} from '../../shared/model/amazonBook';

export class AmazonBookMesh extends Mesh {

  idCube: string;
  book: AmazonBook;
  index: number;
  touched: boolean;
  geometryIntern: Geometry = new Geometry();
  currentPos: Vector3 = new Vector3();
  file: string;

}
