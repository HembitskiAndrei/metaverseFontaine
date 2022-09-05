import {ParticleSystem} from "@babylonjs/core/Particles/particleSystem";
import {CylinderDirectedParticleEmitter} from "@babylonjs/core/Particles/EmitterTypes/cylinderParticleEmitter";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { Color4 } from "@babylonjs/core/Maths/math.color";
import { Scene } from "@babylonjs/core/scene";
import { IDownWaterConfig } from "../utils/types";

export class DownWaterParticles extends ParticleSystem {

  constructor(name: string, capacity: number, size: IDownWaterConfig, scene: Scene) {
    super(name, capacity, scene)

    this.renderingGroupId = 2;

    this.particleEmitterType = new CylinderDirectedParticleEmitter(size.radius,size.height,size.radiusRange, new Vector3(0,1,0),new Vector3(0,1,0))

    // Colors of all particles
    this.color1 = new Color4(1.0, 1.0, 1.0, 0.5);
    this.color2 = new Color4(0.75, 0.75, 0.75, 0.25);
    this.colorDead = new Color4(1, 1, 1, 0.05);

    this.minScaleY = 0.75;
    this.maxScaleY = 1.25;
    this.minScaleX = 0.75;
    this.maxScaleX = 1.25;
    // Size of each particle (random between...
    this.minSize = 0.5;
    this.maxSize = 2;

    // Life time of each particle (random between...
    this.minLifeTime = 1.5;
    this.maxLifeTime = 1.5;

    // Emission rate
    this.emitRate = 200;

    // Blend mode : BLENDMODE_ONEONE, or BLENDMODE_STANDARD
    this.blendMode = ParticleSystem.BLENDMODE_STANDARD;

    // Speed
    this.minEmitPower = 0;
    this.maxEmitPower = 0;
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
