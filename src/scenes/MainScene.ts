import { Engine } from "@babylonjs/core/Engines/engine";
import "@babylonjs/core/Helpers/sceneHelpers";
import { Scene, SceneOptions } from "@babylonjs/core/scene";
import '@babylonjs/core/Loading/Plugins/babylonFileLoader';
import { AssetsManager } from "@babylonjs/core/Misc/assetsManager";
import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";
import { createEnvironment } from "../utils/createEnvironment";
import { PBRMaterial } from "@babylonjs/core/Materials/PBR/pbrMaterial";
import {Fontaine} from "../components/Fontaine";

export class MainScene extends Scene {
  engine: Engine;
  canvas: HTMLCanvasElement;
  assetsManager: AssetsManager;
  camera: ArcRotateCamera;

  constructor(engine: Engine, canvas: HTMLCanvasElement, options?: SceneOptions) {
    super(engine, options);
    this.engine = engine;
    this.canvas = canvas;

    this.assetsManager = new AssetsManager(this);

    this.setRenderingAutoClearDepthStencil(2, false);

    // this.useOrderIndependentTransparency = true;

    const ground = MeshBuilder.CreateGround("ground", { width: 2, height: 10, subdivisions: 100 }, this);
    ground.setEnabled(false);
    ground.freezeWorldMatrix();
    ground.checkCollisions = true;
    ground.isPickable = true;

    const groundMaterial = new PBRMaterial("groundMaterial", this);
    groundMaterial.metallic = 0;
    groundMaterial.roughness = 1;
    ground.material = groundMaterial;

    const gridTextureTask = this.assetsManager.addTextureTask("gridTextureTask", "./assets/textures/grid.png");
    gridTextureTask.onSuccess = task => {
      task.texture.uScale = 10;
      task.texture.vScale = 10;
      groundMaterial.albedoTexture = task.texture;
    }

    new Fontaine(this.assetsManager, this);

    this.camera = new ArcRotateCamera("Camera", 0, Math.PI/2.5, 100, new Vector3(0, 5, 5), this);
    this.camera.minZ = 0.0;
    this.camera.wheelPrecision = 10;
    this.camera.checkCollisions = false;
    this.camera.lowerRadiusLimit = 0.5;
    this.camera.upperRadiusLimit = 500;
    this.camera.attachControl(canvas,false);

    createEnvironment(this);

    this.assetsManager.onFinish = () => {};

    window.addEventListener("resize", () => {
      this.engine.resize();
    });

    this.engine.runRenderLoop(() => {
      this.render();
    });

    this.assetsManager.load();
  }
}
