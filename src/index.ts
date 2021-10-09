import { WebGLRenderer, OrthographicCamera, Clock } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Scene from "./Scene";

const { innerHeight, innerWidth } = window;

const scene = new Scene();

const cameraScale = 2;
const cameraFar = 3000;
const camera = new OrthographicCamera(
  innerWidth / -cameraScale,
  innerWidth / +cameraScale,
  innerHeight / +cameraScale,
  innerHeight / -cameraScale,
  0.001,
  cameraFar
);
camera.position.set(0, 0, cameraFar / 2);
camera.up.set(0, 0, 1);
camera.zoom = 1;

const renderer = new WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(0x363636, 1);

const controls = new OrbitControls(camera, renderer.domElement);

const clock = new Clock();
let iterations = 0;

// render loop
const onAnimationFrameHandler = (timeStamp: number) => {
  iterations++;

  controls.update();
  scene.update(clock.getDelta());
  renderer.render(scene, camera);

  // if (iterations < 50) window.requestAnimationFrame(onAnimationFrameHandler);
  window.requestAnimationFrame(onAnimationFrameHandler);
};
window.requestAnimationFrame(onAnimationFrameHandler);

// resize
const windowResizeHanlder = () => {
  const { innerHeight, innerWidth } = window;

  renderer.setSize(innerWidth, innerHeight);

  camera.left = innerWidth / -cameraScale;
  camera.right = innerWidth / cameraScale;
  camera.top = innerHeight / cameraScale;
  camera.bottom = innerHeight / -cameraScale;
  camera.updateProjectionMatrix();
};
windowResizeHanlder();
window.addEventListener("resize", windowResizeHanlder);

// dom
document.body.style.margin = "0";
document.body.appendChild(renderer.domElement);
