import * as THREE from "three"
export default function (scene) {
  class CustomSinCurve extends THREE.Curve {

    constructor(scale = 1) {

      super();

      this.scale = scale;

    }

    getPoint(t, optionalTarget = new THREE.Vector3()) {

      const tx = t * 3 - 1.5;
      const ty = Math.sin(2 * Math.PI * t);
      const tz = 0;

      return optionalTarget.set(tx, ty, tz).multiplyScalar(this.scale);

    }

  }

  const path = new CustomSinCurve(10);
  const geometry = new THREE.TubeGeometry(path, 1, 1, 2, false);
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
}