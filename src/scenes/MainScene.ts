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
import {UpWaterParticles} from "../components/UpWaterParticles";
import {ParticleSystem} from "@babylonjs/core/Particles/particleSystem";
import {Color3} from "@babylonjs/core/Maths/math.color";
import {DownWaterParticles} from "../components/DownWaterParticles";
import {MiddleWaterParticles} from "../components/MiddleWaterParticles";

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

    const waterMaterial = new WaterMaterial("waterMaterial", CONFIG_WATER_MATERIAL, 2, 10, new Vector2(5, 1), new Color3(0.5, 0.5, 0.5), this);
    const waterBottomMaterial = new WaterMaterial("waterBottomMaterial", CONFIG_WATER_MATERIAL, -0.125, -1.5, new Vector2(5, 0.85), new Color3(0.35, 0.35, 0.35), this);
    const waterBottomReverseMaterial = new WaterMaterial("waterReverseMaterial", CONFIG_WATER_MATERIAL, -0.125, -1.5, new Vector2(5, 0.85), new Color3(0.35, 0.35, 0.35), this);

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

    const upWaterParticles = new UpWaterParticles("upWaterParticles", 5000, this);
    upWaterParticles.emitRate = 250;
    const upWaterParticles1 = new UpWaterParticles("upWaterParticles1", 5000, this);
    upWaterParticles1.minSize = 0.05;
    upWaterParticles1.maxSize = 0.35;
    const upWaterParticles2 = new UpWaterParticles("upWaterParticles2", 5000, this);
    upWaterParticles2.emitRate = 50;
    upWaterParticles2.billboardMode = ParticleSystem.BILLBOARDMODE_Y;
    upWaterParticles2.createConeEmitter(0.001, Math.PI / 100);
    upWaterParticles2.minEmitPower = 6;
    upWaterParticles2.maxEmitPower = 10;
    upWaterParticles2.minScaleY = 3;
    upWaterParticles2.maxScaleY = 6;
    upWaterParticles2.minScaleX = 0.5;
    upWaterParticles2.maxScaleX = 0.75;

    const downWaterParticles = new DownWaterParticles("downWaterParticles", 5000, {
      radius: 1,
      height: 0.01,
      radiusRange: 0.1
    }, this);
    const middleWaterParticles = new MiddleWaterParticles("middleWaterParticles", 5000, {
      radius: 0.75,
      height: 0.01,
      radiusRange: 1
    }, this)

    const splash1TextureTask = this.assetsManager.addTextureTask("splash1TextureTask", "./assets/textures/water/splash.png");
    splash1TextureTask.onSuccess = task => {
      middleWaterParticles.particleTexture = task.texture;
      middleWaterParticles.setupAnimationSheet({
        width: 512,
        height: 512,
        numSpritesWidth: 4,
        numSpritesHeight: 4,
        animationSpeed: 1,
        isRandom: false,
      });
      middleWaterParticles.start();
    };
    const splashTextureTask = this.assetsManager.addTextureTask("splashTextureTask", "./assets/textures/water/Splash_SpriteSheet_8x8_1.png");
    splashTextureTask.onSuccess = task => {
      upWaterParticles.particleTexture = task.texture;
      upWaterParticles.setupAnimationSheet({
        width: 512,
        height: 512,
        numSpritesWidth: 8,
        numSpritesHeight: 8,
        animationSpeed: 1,
        isRandom: true,
      });
      upWaterParticles.start();

      downWaterParticles.particleTexture = task.texture;
      downWaterParticles.setupAnimationSheet({
        width: 512,
        height: 512,
        numSpritesWidth: 8,
        numSpritesHeight: 8,
        animationSpeed: 1,
        isRandom: false,
      });
      downWaterParticles.start();
    };
    const sprayTextureTask = this.assetsManager.addTextureTask("sprayTextureTask", "./assets/textures/water/drop.png");
    sprayTextureTask.onSuccess = task => {
      upWaterParticles1.particleTexture = task.texture;
      upWaterParticles1.setupAnimationSheet({
        width: 1600,
        height: 200,
        numSpritesWidth: 8,
        numSpritesHeight: 1,
        animationSpeed: 1,
        isRandom: true,
      });
      upWaterParticles1.start();
    };
    const singleTextureTask = this.assetsManager.addTextureTask("singleTextureTask", "./assets/textures/water/single.png");
    singleTextureTask.onSuccess = task => {
      upWaterParticles2.particleTexture = task.texture;
      upWaterParticles2.setupAnimationSheet({
        width: 580,
        height: 260,
        numSpritesWidth: 10,
        numSpritesHeight: 1,
        animationSpeed: 1,
        isRandom: true,
      });
      upWaterParticles2.start();
    };

    const waterMeshTask = this.assetsManager.addMeshTask("waterMeshTask", "", "./assets/meshes/", "water.glb");
    waterMeshTask.onSuccess = task => {
      task.loadedMeshes[0].scaling.scaleInPlace(10);
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
        if (mesh.name.includes("Emitter")) {
          mesh.visibility = 0;
          upWaterParticles.emitter = mesh;
          upWaterParticles1.emitter = mesh;
          upWaterParticles2.emitter = mesh;
        }
        if (mesh.name.includes("reversewaterBottom")) {
          downWaterParticles.emitter = mesh;
        }
        if (mesh.name.includes("waterMiddle")) {
          middleWaterParticles.emitter = mesh;
        }
      });
      this.camera.setTarget(<Mesh>this.getMeshByName("reversewaterBottom"));
    };

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
