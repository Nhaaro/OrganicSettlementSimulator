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
  velocity = 1.39;
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

    const degreeToRad = (degree: number) => (degree * Math.PI) / 180;
    const randomRange = (min: number, max: number) =>
      Math.floor(Math.random() * (max - min + 1) + min);

    const angleInRange = (...range: [number, number]) =>
      degreeToRad(randomRange(...range));

    // TODO: move to own method that handles collision
    // Pick new random move dir if close to boundary
    if (this.calculateNextPosition(this.velocity, deltaTime).y > bound.TOP)
      this.angle = angleInRange(180, 360);
    if (this.calculateNextPosition(this.velocity, deltaTime).x > bound.RIGHT)
      this.angle = angleInRange(90, 270);
    if (this.calculateNextPosition(this.velocity, deltaTime).y < bound.BOTTOM)
      this.angle = angleInRange(0, 180);
    if (this.calculateNextPosition(this.velocity, deltaTime).x < bound.LEFT)
      this.angle = angleInRange(-90, 90);

    this.position = this.calculateNextPosition(this.velocity, deltaTime);
  }

  private calculateNextPosition(distance: number, deltaTime: number): Vector3 {
    const newPosition = this.position.clone();

    newPosition.x += distance * Math.cos(this.angle) * deltaTime;
    newPosition.y += distance * Math.sin(this.angle) * deltaTime;
    // newPosition.z += distance * Math.???(this.angle) * deltaTime;

    return newPosition;
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
