import {
  BufferGeometry,
  Float32BufferAttribute,
  Points,
  PointsMaterial,
  Vector3,
} from "three";
import Terrain from "./objects/Terrain";

export default class Agent {
  material = new PointsMaterial({ color: 0xffffff, size: 0.25 });
  /** Average stride lenght in meters */
  stride = 1.39;
  speed = 1;
  static particles: Points<BufferGeometry, PointsMaterial>;

  constructor(private position: Vector3, private angle: number) {
    // console.log({ x: position.x, y: position.y, angle });
  }

  move(deltaTime: number): void {
    const lenght = Terrain.lenght / 2;
    const width = Terrain.width / 2;
    enum bound {
      TOP = width,
      RIGHT = lenght,
      BOTTOM = -width,
      LEFT = -lenght,
    }

    const prediction = (location: number) =>
      location + deltaTime * this.stride * this.speed;
    const degreeToRad = (degree: number) => (degree * Math.PI) / 180;
    const randomRange = (min: number, max: number) =>
      Math.floor(Math.random() * (max - min + 1) + min);

    const angleInRange = (...range: [number, number]) =>
      degreeToRad(randomRange(...range));

    // TODO: move to own method that handles collision
    // Pick new random move dir if close to boundary
    if (prediction(this.position.y + 1) > bound.TOP)
      this.angle = angleInRange(180, 360);
    if (prediction(this.position.x + 1) > bound.RIGHT)
      this.angle = angleInRange(90, 270);
    if (prediction(this.position.y - 1) < bound.BOTTOM)
      this.angle = angleInRange(0, 180);
    if (prediction(this.position.x - 1) < bound.LEFT)
      this.angle = angleInRange(-90, 90);

    this.position = new Vector3(
      this.position.x +
        Math.cos(this.angle) * deltaTime * this.stride * this.speed,
      this.position.y +
        Math.sin(this.angle) * deltaTime * this.stride * this.speed,
      this.position.z
    );
  }

  static createPointCloud(agents: Agent[]): void {
    const geometry = new BufferGeometry();

    geometry.setAttribute(
      "position",
      new Float32BufferAttribute(
        agents.reduce<number[]>(
          (vectors, { position: { x, y, z } }) => [...vectors, x, y, z],
          []
        ),
        3
      )
    );

    const material = new PointsMaterial({ color: 0xffffff });

    Agent.particles = new Points(geometry, material);
  }

  static updatePointCloud(agents: Agent[]): void {
    const { geometry } = Agent.particles;

    const positions = geometry.attributes.position.array as number[];

    let id: number;
    agents.forEach(({ position: { x, y, z } }, i) => {
      id = i * 3;
      positions[id++] = x;
      positions[id++] = y;
      positions[id++] = z;
    });

    geometry.attributes.position.needsUpdate = true;
  }
}
