import WaterMaterial from "./WaterMaterial";
import { Scene } from "@babylonjs/core/scene";
import { AssetsManager } from "@babylonjs/core/Misc/assetsManager";
import {CONFIG_WATER_MATERIAL} from "./shadersConfigWaterMaterial";
import {Vector2} from "@babylonjs/core/Maths/math.vector";
import {Color3} from "@babylonjs/core/Maths/math.color";
import setTextureWrap from "../utils/setTextureWrap";
import {Texture} from "@babylonjs/core/Materials/Textures/texture";
import {UpWaterParticles} from "./UpWaterParticles";
import {ParticleSystem} from "@babylonjs/core/Particles/particleSystem";
import {DownWaterParticles} from "./DownWaterParticles";
import {MiddleWaterParticles} from "./MiddleWaterParticles";

export class Fontaine {
  constructor(assetsManager: AssetsManager, scene: Scene) {
    const waterMaterial = new WaterMaterial("waterMaterial", CONFIG_WATER_MATERIAL, 2, 10, new Vector2(5, 1), new Color3(0.5, 0.5, 0.5), scene);
    const waterBottomMaterial = new WaterMaterial("waterBottomMaterial", CONFIG_WATER_MATERIAL, -0.125, -1.5, new Vector2(5, 0.85), new Color3(0.35, 0.35, 0.35), scene);
    const waterBottomReverseMaterial = new WaterMaterial("waterReverseMaterial", CONFIG_WATER_MATERIAL, -0.125, -1.5, new Vector2(5, 0.85), new Color3(0.35, 0.35, 0.35), scene);

    const waterNoiseTextureTask = assetsManager.addTextureTask("waterNoiseTextureTask", "./assets/textures/water/noise.jpg");
    waterNoiseTextureTask.onSuccess = task => {
      waterMaterial.albedoTexture = task.texture;
      waterBottomMaterial.albedoTexture = task.texture;
      waterBottomReverseMaterial.albedoTexture = task.texture;
      setTextureWrap(task.texture, Texture.MIRROR_ADDRESSMODE);
      waterMaterial.setTexture(task.texture, "noiseTexture");
      waterBottomMaterial.setTexture(task.texture, "noiseTexture");
      waterBottomReverseMaterial.setTexture(task.texture, "noiseTexture");
    };
    const foamUpTextureTask = assetsManager.addTextureTask("foamUpTextureTask", "./assets/textures/water/water_foam_up.jpg");
    foamUpTextureTask.onSuccess = task => {
      setTextureWrap(task.texture, Texture.MIRROR_ADDRESSMODE);
      waterMaterial.setTexture(task.texture, "foamTextureUp");
      waterBottomMaterial.setTexture(task.texture, "foamTextureUp");
      waterBottomReverseMaterial.setTexture(task.texture, "foamTextureUp");
    };
    const backTextureTask = assetsManager.addTextureTask("backTextureTask", "./assets/textures/water/water_back.jpg");
    backTextureTask.onSuccess = task => {
      setTextureWrap(task.texture, Texture.MIRROR_ADDRESSMODE);
      waterMaterial.setTexture(task.texture, "backTexture");
      waterBottomMaterial.setTexture(task.texture, "backTexture");
      waterBottomReverseMaterial.setTexture(task.texture, "backTexture");
    };
    const upTextureTask = assetsManager.addTextureTask("upTextureTask", "./assets/textures/water/water_up.jpg");
    upTextureTask.onSuccess = task => {
      setTextureWrap(task.texture, Texture.MIRROR_ADDRESSMODE);
      waterMaterial.setTexture(task.texture, "upTexture");
      waterBottomMaterial.setTexture(task.texture, "upTexture");
      waterBottomReverseMaterial.setTexture(task.texture, "upTexture");
    };
    const alphaTextureTask = assetsManager.addTextureTask("alphaTextureTask", "./assets/textures/water/water_subtract.jpg");
    alphaTextureTask.onSuccess = task => {
      setTextureWrap(task.texture, Texture.MIRROR_ADDRESSMODE);
      waterMaterial.setTexture(task.texture, "alphaTexture");
    };
    const foamDownTextureTask = assetsManager.addTextureTask("foamDownTextureTask", "./assets/textures/water/water_foam_down.jpg");
    foamDownTextureTask.onSuccess = task => {
      setTextureWrap(task.texture, Texture.MIRROR_ADDRESSMODE);
      waterBottomMaterial.setTexture(task.texture, "alphaTexture");
      waterBottomReverseMaterial.setTexture(task.texture, "alphaTexture");
    };

    const upWaterParticles = new UpWaterParticles("upWaterParticles", 5000, scene);
    upWaterParticles.emitRate = 250;
    const upWaterParticles1 = new UpWaterParticles("upWaterParticles1", 5000, scene);
    upWaterParticles1.minSize = 0.05;
    upWaterParticles1.maxSize = 0.35;
    const upWaterParticles2 = new UpWaterParticles("upWaterParticles2", 5000, scene);
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
    }, scene);
    const middleWaterParticles = new MiddleWaterParticles("middleWaterParticles", 5000, {
      radius: 0.75,
      height: 0.01,
      radiusRange: 1
    }, scene)

    const splash1TextureTask = assetsManager.addTextureTask("splash1TextureTask", "./assets/textures/water/splash.png");
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
    const splashTextureTask = assetsManager.addTextureTask("splashTextureTask", "./assets/textures/water/Splash_SpriteSheet_8x8_1.png");
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
    const sprayTextureTask = assetsManager.addTextureTask("sprayTextureTask", "./assets/textures/water/drop.png");
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
    const singleTextureTask = assetsManager.addTextureTask("singleTextureTask", "./assets/textures/water/single.png");
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

    const waterMeshTask = assetsManager.addMeshTask("waterMeshTask", "", "./assets/meshes/", "water.glb");
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
    };
  }
}
