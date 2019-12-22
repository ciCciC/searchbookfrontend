import {Geometry, Mesh, Vector3} from 'three';
import {Amazonbook} from '../../shared/model/amazonbook';

export class AmazonBookMesh extends Mesh {

  idCube: string;
  book: Amazonbook;
  index: number;
  touched: boolean;
  geometryIntern: Geometry = new Geometry();
  currentPos: Vector3 = new Vector3();
  file: string;

}
