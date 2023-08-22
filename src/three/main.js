import { PerspectiveCamera, Scene, WebGLRenderer } from "three"
import { CSS3DRenderer } from "three/examples/jsm/renderers/CSS3DRenderer"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default class Main {

  beforeRender = () => { };

  // 初始化场景
  constructor() {
    this.scene = new Scene()

    this.renderer = new WebGLRenderer({ antialias: true })
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    // 允许渲染器产生阴影贴图
    this.renderer.shadowMap.enabled = true;
    this.renderer.setClearColor(0xaaaaaa)

    // 创建透视相机
    this.camera = new PerspectiveCamera(
      75,
      window.innerHeight / window.innerHeight,
      1,
      50000
    );

    this.camera.position.set(30, 250, -250);

    // 更新摄像头
    this.camera.aspect = window.innerWidth / window.innerHeight;
    //   更新摄像机的投影矩阵
    this.camera.updateProjectionMatrix();
    this.camera.tagName = "主界面";
    this.scene.add(this.camera);

    // 初始化控制器
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    // 设置控制器阻尼
    this.controls.enableDamping = true;
    this.controls.maxPolarAngle = Math.PI / 2;
    this.controls.minPolarAngle = Math.PI / 18;

    this.css3DRenderer = new CSS3DRenderer();
    this.css3DRenderer.setSize(window.innerWidth, window.innerHeight);
    document.querySelector("#cssrender").appendChild(this.css3DRenderer.domElement);
  }

  // 连续渲染
  render(time = 0) {
    this.beforeRender(time)
    this.controls.update();
    this.renderer.render(this.scene, this.camera)
    this.css3DRenderer.render(this.scene, this.camera);
    requestAnimationFrame((time) => {
      this.render(time)
    })
  }
}