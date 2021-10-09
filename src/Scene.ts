import { Scene, Vector3 } from "three";
import Terrain from "./objects/Terrain";
import Agent from "./Agent";

export default class cityScene extends Scene {
  agents: Agent[] = new Array(1000);
  terrain = new Terrain();

  constructor() {
    super();

    this.add(this.terrain);

    this.init();
  }

  init(): void {
    for (let i = 0; i < this.agents.length; i++) {
      const position = new Vector3(
        Math.random() * this.terrain.lenght - this.terrain.lenght / 2,
        Math.random() * this.terrain.width - this.terrain.width / 2,
        Math.random() * this.terrain.height - this.terrain.height / 2
      );
      // const position = new Vector3(0, 0, 0);

      const angle = Math.random() * Math.PI * 2;
      // const angle = 180 * (Math.PI / 180);

      this.agents[i] = new Agent(position, angle);
    }

    Agent.createPointCloud(this.agents);
    this.add(Agent.particles);
  }

  update(deltaTime: number): void {
    this.agents.forEach((agent) => {
      agent.move(deltaTime);
    });
    Agent.updatePointCloud(this.agents);
  }
}
