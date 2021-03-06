import { Mesh, Object3D, PlaneBufferGeometry, ShaderMaterial } from "three";
import quad_vert from "./quad.vert";
import postprocessing_frag from "./terrain.frag";

export default class Terrain extends Object3D {
  // Average dimensions of medieval settlements (1sq mile) in km
  static lenght = 1609.344;
  static width = 1609.344;
  static height = 0;

  constructor(
    readonly lenght = Terrain.lenght,
    readonly width = Terrain.lenght,
    readonly height = Terrain.height
  ) {
    super();

    this.createMesh();
  }

  private createMesh(): void {
    const material = new ShaderMaterial({
      uniforms: { data: { value: null } },
      vertexShader: quad_vert,
      fragmentShader: postprocessing_frag,
    });
    const mesh = new Mesh(new PlaneBufferGeometry(), material);

    mesh.scale.set(this.lenght, this.width, 1);
    mesh.position.z = -1;

    this.add(mesh);
  }
}
