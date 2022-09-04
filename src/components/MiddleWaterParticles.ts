import {ParticleSystem} from "@babylonjs/core/Particles/particleSystem";
import { Color4 } from "@babylonjs/core/Maths/math.color";
import { SceneType, IDownWaterConfig } from "../utils/types";

export class MiddleWaterParticles extends ParticleSystem {

  constructor(name: string, capacity: number, size: IDownWaterConfig, scene: SceneType) {
    super(name, capacity, scene)

    this.renderingGroupId = 2;

    this.createCylinderEmitter(size.radius,size.height,size.radiusRange,0);

    // Colors of all particles
    this.color1 = new Color4(1.0, 1.0, 1.0, 1);
    this.color2 = new Color4(0.75, 0.75, 0.75, 0.75);
    this.colorDead = new Color4(1, 1, 1, 0);
    // Size of each particle (random between...
    this.minSize = 0.25;
    this.maxSize = 1.5;

    // Life time of each particle (random between...
    this.minLifeTime = 0.15;
    this.maxLifeTime = 0.5;

    // Emission rate
    this.emitRate = 300;

    this.blendMode = ParticleSystem.BLENDMODE_STANDARD;

    this.minInitialRotation = -Math.PI;
    this.maxInitialRotation = Math.PI;

    // Speed
    this.minEmitPower = 0.2;
    this.maxEmitPower = 0.5;
    this.updateSpeed = 0.025;
  }

  setupAnimationSheet(parameters: {
    width: number;
    height: number;
    numSpritesWidth: number;
    numSpritesHeight: number;
    animationSpeed: number;
    isRandom: boolean;
  }) {
    this.isAnimationSheetEnabled = true;
    this.spriteCellWidth =
      parameters.width / parameters.numSpritesWidth;
    this.spriteCellHeight =
      parameters.height / parameters.numSpritesHeight;
    const numberCells = parameters.numSpritesWidth * parameters.numSpritesHeight;
    this.startSpriteCellID = 0;
    this.endSpriteCellID = numberCells - 1;
    this.spriteCellChangeSpeed = parameters.animationSpeed;
    this.spriteRandomStartCell = parameters.isRandom;
    this.updateSpeed = 1 / 60;
  };
}
