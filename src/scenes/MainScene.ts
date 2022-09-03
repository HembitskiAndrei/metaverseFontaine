import { Engine } from "@babylonjs/core/Engines/engine";
import "@babylonjs/core/Helpers/sceneHelpers";
import { Scene, SceneOptions } from "@babylonjs/core/scene";
import '@babylonjs/core/Loading/Plugins/babylonFileLoader';
import { AssetsManager } from "@babylonjs/core/Misc/assetsManager";
import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { Vector2, Vector3 } from "@babylonjs/core/Maths/math.vector";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";
import { Mesh } from "@babylonjs/core/Meshes/mesh";
import { createEnvironment } from "../utils/createEnvironment";
import { PBRMaterial } from "@babylonjs/core/Materials/PBR/pbrMaterial";
import {Texture} from "@babylonjs/core/Materials/Textures/texture";
import WaterMaterial from "../components/WaterMaterial";
import {
  CONFIG_WATER_MATERIAL,
} from "../components/shadersConfigWaterMaterial";
import setTextureWrap from "../utils/setTextureWrap";

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

    // this.useOrderIndependentTransparency = true;

    const ground = MeshBuilder.CreateGround("ground", { width: 2, height: 10, subdivisions: 100 }, this);
    ground.setEnabled(false);
    ground.freezeWorldMatrix();
    ground.checkCollisions = true;
    ground.isPickable = true;

    const waterMaterial = new WaterMaterial("waterMaterial", CONFIG_WATER_MATERIAL, 2, 10, new Vector2(5, 1), this);
    const waterBottomMaterial = new WaterMaterial("waterBottomMaterial", CONFIG_WATER_MATERIAL, -0.125, -1.5, new Vector2(5, 0.85), this);
    const waterBottomReverseMaterial = new WaterMaterial("waterReverseMaterial", CONFIG_WATER_MATERIAL, -0.125, -1.5, new Vector2(5, 0.85), this);

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

    const waterNoiseTextureTask = this.assetsManager.addTextureTask("waterNoiseTextureTask", "./assets/textures/water/noise.jpg");
    waterNoiseTextureTask.onSuccess = task => {
      waterMaterial.albedoTexture = task.texture;
      waterBottomMaterial.albedoTexture = task.texture;
      waterBottomReverseMaterial.albedoTexture = task.texture;
      setTextureWrap(task.texture, Texture.MIRROR_ADDRESSMODE);
      waterMaterial.setTexture(task.texture, "noiseTexture");
      waterBottomMaterial.setTexture(task.texture, "noiseTexture");
      waterBottomReverseMaterial.setTexture(task.texture, "noiseTexture");
    };
    const foamUpTextureTask = this.assetsManager.addTextureTask("foamUpTextureTask", "./assets/textures/water/water_foam_up.jpg");
    foamUpTextureTask.onSuccess = task => {
      setTextureWrap(task.texture, Texture.MIRROR_ADDRESSMODE);
      waterMaterial.setTexture(task.texture, "foamTextureUp");
      waterBottomMaterial.setTexture(task.texture, "foamTextureUp");
      waterBottomReverseMaterial.setTexture(task.texture, "foamTextureUp");
    };
    const backTextureTask = this.assetsManager.addTextureTask("backTextureTask", "./assets/textures/water/water_back.jpg");
    backTextureTask.onSuccess = task => {
      setTextureWrap(task.texture, Texture.MIRROR_ADDRESSMODE);
      waterMaterial.setTexture(task.texture, "backTexture");
      waterBottomMaterial.setTexture(task.texture, "backTexture");
      waterBottomReverseMaterial.setTexture(task.texture, "backTexture");
    };
    const upTextureTask = this.assetsManager.addTextureTask("upTextureTask", "./assets/textures/water/water_up.jpg");
    upTextureTask.onSuccess = task => {
      setTextureWrap(task.texture, Texture.MIRROR_ADDRESSMODE);
      waterMaterial.setTexture(task.texture, "upTexture");
      waterBottomMaterial.setTexture(task.texture, "upTexture");
      waterBottomReverseMaterial.setTexture(task.texture, "upTexture");
    };
    const alphaTextureTask = this.assetsManager.addTextureTask("alphaTextureTask", "./assets/textures/water/water_subtract.jpg");
    alphaTextureTask.onSuccess = task => {
      setTextureWrap(task.texture, Texture.MIRROR_ADDRESSMODE);
      waterMaterial.setTexture(task.texture, "alphaTexture");
    };
    const foamDownTextureTask = this.assetsManager.addTextureTask("foamDownTextureTask", "./assets/textures/water/water_foam_down.jpg");
    foamDownTextureTask.onSuccess = task => {
      setTextureWrap(task.texture, Texture.MIRROR_ADDRESSMODE);
      waterBottomMaterial.setTexture(task.texture, "alphaTexture");
      waterBottomReverseMaterial.setTexture(task.texture, "alphaTexture");
    };

    const waterMeshTask = this.assetsManager.addMeshTask("waterMeshTask", "", "./assets/meshes/", "water.glb");
    waterMeshTask.onSuccess = task => {
      task.loadedMeshes[0].getChildMeshes().forEach(mesh => {
        if (mesh.name.includes("water")) {
          if (mesh.name.includes("reverse")) {
            mesh.material = waterBottomReverseMaterial;
          } else if (mesh.name.includes("Bottom")) {
            mesh.material = waterBottomMaterial;
          } else {
            mesh.material = waterMaterial;
          }
        }
      });
      this.camera.setTarget(<Mesh>this.getMeshByName("fountain"));
    };

    this.camera = new ArcRotateCamera("Camera", 0, Math.PI/2.5, 5, new Vector3(0, 5, 5), this);
    this.camera.minZ = 0.0;
    this.camera.wheelPrecision = 25;
    this.camera.checkCollisions = false;
    this.camera.lowerRadiusLimit = 0.5;
    this.camera.upperRadiusLimit = 10;
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
